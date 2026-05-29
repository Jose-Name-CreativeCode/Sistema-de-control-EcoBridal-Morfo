import "dotenv/config";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL no está definida.");
  process.exit(1);
}

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Uso: node prisma/import-vero-catalog.mjs <archivo-json>");
  process.exit(1);
}

const client = new Client({ connectionString });

function buildInternalCode(entry, index) {
  if (entry.number !== null && entry.number !== undefined && entry.number !== "") {
    return `ECO-${String(entry.number).padStart(3, "0")}`;
  }

  return `ECO-XLS-${String(index + 1).padStart(3, "0")}`;
}

function buildDressNotes(entry) {
  const notes = [];

  if (entry.state) {
    notes.push(`Estado: ${entry.state}`);
  }

  if (entry.location) {
    notes.push(`Estuvo en: ${entry.location}`);
  }

  if (entry.models.length > 0) {
    notes.push(`Modelos del Excel: ${entry.models.join(", ")}`);
  }

  return notes.length > 0 ? notes.join("\n") : null;
}

async function run() {
  const payload = JSON.parse(await fs.readFile(inputPath, "utf8"));
  const dresses = payload.dresses ?? [];
  const models = payload.models ?? [];

  await client.connect();

  try {
    await client.query("BEGIN");

    await client.query('delete from "Dress"');
    await client.query('delete from "ModelProfile"');

    const modelIdByName = new Map();

    for (const modelName of models) {
      const modelId = randomUUID();

      modelIdByName.set(modelName, modelId);

      await client.query(
        `
          insert into "ModelProfile" (
            "id",
            "name",
            "notes",
            "createdAt",
            "updatedAt"
          )
          values ($1, $2, $3, now(), now())
        `,
        [modelId, modelName, "Importada desde Excel de Vero."],
      );
    }

    for (const [index, dress] of dresses.entries()) {
      const dressId = randomUUID();
      const internalCode = buildInternalCode(dress, index);
      const notes = buildDressNotes(dress);

      await client.query(
        `
          insert into "Dress" (
            "id",
            "internalCode",
            "name",
            "size",
            "condition",
            "workflowStatus",
            "instagramStatus",
            "notes",
            "receivedAt",
            "isNew",
            "createdAt",
            "updatedAt"
          )
          values (
            $1,
            $2,
            $3,
            $4,
            'USED'::"DressCondition",
            'PENDING_PHOTOS'::"WorkflowStatus",
            'NOT_PUBLISHED'::"InstagramStatus",
            $5,
            $6::timestamp,
            false,
            now(),
            now()
          )
        `,
        [
          dressId,
          internalCode,
          dress.name,
          dress.size ?? "Por definir",
          notes,
          dress.receivedAt,
        ],
      );

      for (const modelName of dress.models) {
        const modelId = modelIdByName.get(modelName);

        if (!modelId) {
          continue;
        }

        await client.query(
          `
            insert into "DressAssignment" (
              "id",
              "dressId",
              "modelId",
              "assignmentStatus",
              "notes",
              "createdAt",
              "updatedAt"
            )
            values (
              $1,
              $2,
              $3,
              'COMPLETED'::"AssignmentStatus",
              $4,
              now(),
              now()
            )
          `,
          [
            randomUUID(),
            dressId,
            modelId,
            `Importada desde Excel de Vero${dress.location ? ` · ${dress.location}` : ""}.`,
          ],
        );
      }
    }

    await client.query("COMMIT");

    console.log(
      `Importación completada. Vestidos: ${dresses.length}. Modelos: ${models.length}.`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error("Error importando catálogo de Vero:", error);
  process.exit(1);
});
