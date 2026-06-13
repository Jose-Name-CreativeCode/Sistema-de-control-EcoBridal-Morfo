import { execFile } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { Client } from "pg";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const BASE_DIR =
  "/Volumes/ADATA HD710/CLIENTE_ACTIVOS/ECOBRIDAL/VESTIDOS/VESTIDOS";
const FACE_SCAN_SCRIPT = path.join(process.cwd(), "tmp/face_scan.swift");
const FACE_SCAN_BINARY = path.join(process.cwd(), "tmp/face_scan_bin");
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim() || "dinuvdpmz";
const UPLOAD_PRESET =
  process.env.CLOUDINARY_UPLOAD_PRESET?.trim() || "ecobridal_unsigned";
const DRY_RUN = process.argv.includes("--dry-run");

function normalizeName(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/\btoma\b/gi, "")
    .replace(/\bde\b/gi, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}

function slugify(value) {
  return normalizeName(value);
}

async function directoryExists(targetPath) {
  try {
    const target = await stat(targetPath);
    return target.isDirectory();
  } catch {
    return false;
  }
}

async function getDateFolders(rootPath) {
  const entries = await readdir(rootPath, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

async function findOriginalFolders(baseDir) {
  const entries = await readdir(baseDir, { withFileTypes: true });
  const folders = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const dressRoot = path.join(baseDir, entry.name);
    for (const dateKey of await getDateFolders(dressRoot)) {
      const originalsPath = path.join(dressRoot, dateKey, "01-ORIGINALES");
      if (await directoryExists(originalsPath)) {
        folders.push({
          folderName: entry.name,
          matchName: entry.name,
          originalsPath,
          dateKey,
        });
      }
    }

    const children = await readdir(dressRoot, { withFileTypes: true }).catch(() => []);
    for (const child of children) {
      if (!child.isDirectory() || /^\d{4}-\d{2}-\d{2}$/.test(child.name)) continue;

      const childRoot = path.join(dressRoot, child.name);
      for (const dateKey of await getDateFolders(childRoot)) {
        const originalsPath = path.join(childRoot, dateKey, "01-ORIGINALES");
        if (await directoryExists(originalsPath)) {
          folders.push({
            folderName: `${entry.name} ${child.name}`,
            matchName: `${entry.name} ${child.name}`,
            originalsPath,
            dateKey,
          });
        }
      }
    }
  }

  return folders;
}

async function findCatalogFolderKeys(baseDir) {
  const entries = await readdir(baseDir, { withFileTypes: true });
  const keys = new Set(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => normalizeName(entry.name)),
  );

  for (const key of [...keys]) {
    for (const suffix of ["mediano", "actual", "renewed", "sincierre"]) {
      if (key.endsWith(suffix)) {
        keys.add(key.slice(0, -suffix.length));
      }
    }
  }

  if (keys.has("merena")) {
    keys.add("marena");
  }

  return keys;
}

function latestFoldersByName(folders) {
  const latest = new Map();

  for (const folder of folders) {
    const key = normalizeName(folder.matchName);
    const current = latest.get(key);
    if (!current || folder.dateKey > current.dateKey) {
      latest.set(key, folder);
    }
  }

  return latest;
}

function groupRuns(metrics) {
  const runs = [];

  for (const metric of metrics) {
    const hasFace = metric.faceCount > 0;
    const current = runs.at(-1);
    if (!current || current.hasFace !== hasFace) {
      runs.push({ hasFace, items: [metric] });
      continue;
    }
    current.items.push(metric);
  }

  return runs;
}

function chooseFrontAndBack(metrics) {
  const runs = groupRuns(metrics);
  const faceRuns = runs
    .map((run, index) => ({ ...run, index }))
    .filter((run) => run.hasFace && run.items.length >= 3)
    .sort((left, right) => right.items.length - left.items.length);
  const frontRun = faceRuns[0];
  if (!frontRun) return null;

  const backRunsAfter = runs
    .map((run, index) => ({ ...run, index }))
    .filter((run) => !run.hasFace && run.items.length >= 3 && run.index > frontRun.index)
    .sort((left, right) => right.items.length - left.items.length);
  const backRunsBefore = runs
    .map((run, index) => ({ ...run, index }))
    .filter((run) => !run.hasFace && run.items.length >= 3 && run.index < frontRun.index)
    .sort((left, right) => right.items.length - left.items.length);
  const backRun = backRunsAfter[0] ?? backRunsBefore[0];
  if (!backRun) return null;

  const frontCandidates = [...frontRun.items].sort(
    (left, right) => left.largestFaceArea - right.largestFaceArea,
  );

  return {
    front: frontCandidates[Math.floor(frontCandidates.length / 3)] ?? frontCandidates[0],
    back: backRun.items[Math.floor(backRun.items.length / 2)],
  };
}

async function ensureFaceScannerBinary() {
  await execFileAsync("swiftc", [FACE_SCAN_SCRIPT, "-O", "-o", FACE_SCAN_BINARY], {
    maxBuffer: 10 * 1024 * 1024,
  });
}

async function scanFaces(originalsPath) {
  const { stdout } = await execFileAsync(FACE_SCAN_BINARY, [originalsPath], {
    maxBuffer: 50 * 1024 * 1024,
  });
  return JSON.parse(stdout);
}

async function uploadImage(filePath, dressSlug, slot) {
  const bytes = await sharp(filePath)
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  const form = new FormData();
  form.append("file", new Blob([bytes], { type: "image/jpeg" }), `${slot}.jpg`);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", `ecobridal/dresses/${dressSlug}`);
  form.append("public_id", slot);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form },
  );
  if (!response.ok) {
    throw new Error(`Cloudinary ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  return payload.secure_url;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL");
  }

  await ensureFaceScannerBinary();

  const folders = await findOriginalFolders(BASE_DIR);
  const folderMap = latestFoldersByName(folders);
  const catalogFolderKeys = await findCatalogFolderKeys(BASE_DIR);
  const foldersWithOriginalsKeys = new Set(folderMap.keys());
  const report = {
    dryRun: DRY_RUN,
    foldersWithOriginals: folders.length,
    uniqueFolderNames: folderMap.size,
    deleted: [],
    uploaded: [],
    skippedUpload: [],
  };

  const fetchClient = new Client({ connectionString: process.env.DATABASE_URL });
  await fetchClient.connect();
  let dresses;
  try {
    const dresses = (
      await fetchClient.query(
        `select d.id, d.name, d."internalCode",
          count(p.id) filter (where p."photoType" in ('COVER', 'BACK'))::int as photo_count
         from "Dress" d
         left join "DressPhoto" p on p."dressId" = d.id
         group by d.id
         order by d.name, d."internalCode"`,
      )
    ).rows;
    await fetchClient.end();

    const dressesToDelete = dresses.filter(
      (dress) => !catalogFolderKeys.has(normalizeName(dress.name)),
    );

    if (!DRY_RUN && dressesToDelete.length > 0) {
      const client = new Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();
      await client.query("BEGIN");
      await client.query(
        `delete from "Dress" where id = any($1::text[])`,
        [dressesToDelete.map((dress) => dress.id)],
      );
      await client.query("COMMIT");
      await client.end();
    }

    report.deleted = dressesToDelete.map((dress) => ({
      name: dress.name,
      internalCode: dress.internalCode,
    }));

    const activeDresses = dresses.filter(
      (dress) =>
        foldersWithOriginalsKeys.has(normalizeName(dress.name)) &&
        Number(dress.photo_count) < 2,
    );

    for (const dress of activeDresses) {
      const folder = folderMap.get(normalizeName(dress.name));
      console.error(`Uploading ${dress.name} from ${folder.dateKey}`);

      try {
        const metrics = await scanFaces(folder.originalsPath);
        const selected = chooseFrontAndBack(metrics);
        if (!selected) {
          report.skippedUpload.push({
            name: dress.name,
            reason: "No reliable front/back sequence",
            folder: folder.folderName,
            dateKey: folder.dateKey,
          });
          continue;
        }

        const frontPath = path.join(folder.originalsPath, selected.front.file);
        const backPath = path.join(folder.originalsPath, selected.back.file);

        if (DRY_RUN) {
          report.uploaded.push({
            name: dress.name,
            folder: folder.folderName,
            dateKey: folder.dateKey,
            frontFile: selected.front.file,
            backFile: selected.back.file,
          });
          continue;
        }

        const [frontUrl, backUrl] = await Promise.all([
          uploadImage(frontPath, slugify(dress.name), "cover"),
          uploadImage(backPath, slugify(dress.name), "back"),
        ]);

        const client = new Client({ connectionString: process.env.DATABASE_URL });
        await client.connect();
        try {
          await client.query("BEGIN");
          await client.query(
            `delete from "DressPhoto" where "dressId" = $1 and "photoType" in ('COVER', 'BACK')`,
            [dress.id],
          );
          await client.query(
            `insert into "DressPhoto" ("id", "dressId", "photoType", "imageUrl", "altText", "sortOrder", "createdAt")
             values
               (gen_random_uuid(), $1, 'COVER', $2, $3, 1, now()),
               (gen_random_uuid(), $1, 'BACK', $4, $5, 2, now())`,
            [
              dress.id,
              frontUrl,
              `${dress.name} frente cuerpo completo`,
              backUrl,
              `${dress.name} espalda cuerpo completo`,
            ],
          );
          await client.query(
            `update "Dress"
             set "workflowStatus" =
               case
                 when "workflowStatus" in ('DRAFT', 'PENDING_PHOTOS', 'MODEL_ASSIGNED', 'IN_SESSION')
                 then 'PHOTOGRAPHED'
                 else "workflowStatus"
               end,
               "updatedAt" = now()
             where id = $1`,
            [dress.id],
          );
          await client.query("COMMIT");
        } catch (error) {
          await client.query("ROLLBACK").catch(() => {});
          throw error;
        } finally {
          await client.end().catch(() => {});
        }

        report.uploaded.push({
          name: dress.name,
          folder: folder.folderName,
          dateKey: folder.dateKey,
          frontFile: selected.front.file,
          backFile: selected.back.file,
          frontUrl,
          backUrl,
        });
      } catch (error) {
        report.skippedUpload.push({
          name: dress.name,
          reason: error.message,
          folder: folder.folderName,
          dateKey: folder.dateKey,
        });
      }
    }
  } catch (error) {
    await fetchClient.end().catch(() => {});
    throw error;
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
