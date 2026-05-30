import "dotenv/config";
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL no está definida.");
  process.exit(1);
}

const client = new Client({ connectionString });

async function run() {
  await client.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(`
      select distinct
        da."modelId" as "modelId",
        trim(d."size") as "size"
      from "DressAssignment" da
      inner join "Dress" d on d."id" = da."dressId"
      where da."modelId" is not null
        and trim(coalesce(d."size", '')) <> ''
        and trim(coalesce(d."size", '')) <> 'Por definir'
    `);

    let inserted = 0;

    for (const row of rows) {
      await client.query(
        `
          insert into "ModelSize" (
            "id",
            "modelId",
            "size",
            "createdAt"
          )
          values (gen_random_uuid()::text, $1, $2, now())
          on conflict ("modelId", "size") do nothing
        `,
        [row.modelId, row.size],
      );

      inserted += 1;
    }

    await client.query("COMMIT");

    console.log(
      `Sincronización completada. Tallas procesadas desde vestidos: ${rows.length}.`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error("Error sincronizando tallas de modelos:", error);
  process.exit(1);
});
