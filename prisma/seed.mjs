import "dotenv/config";
import { Client } from "pg";
import { randomUUID } from "node:crypto";
import initialDressNames from "../src/data/initial-dresses.json" with { type: "json" };

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL no está definida.");
  process.exit(1);
}

const client = new Client({ connectionString });

const stateMap = {
  ADRIANA: {
    workflowStatus: "PHOTOGRAPHED",
    instagramStatus: "PUBLISHED",
    receivedAt: "2026-04-05",
  },
  ARIADNA: {
    workflowStatus: "MODEL_ASSIGNED",
    instagramStatus: "NOT_PUBLISHED",
    isNew: true,
    receivedAt: "2026-04-24",
  },
  ELENA: {
    workflowStatus: "READY_TO_POST",
    instagramStatus: "SCHEDULED",
    receivedAt: "2026-02-18",
  },
  DALIA: {
    workflowStatus: "PENDING_PHOTOS",
    instagramStatus: "NOT_PUBLISHED",
    isNew: true,
    receivedAt: "2026-04-26",
  },
  FRANCIA: {
    workflowStatus: "EDITED",
    instagramStatus: "SCHEDULED",
    receivedAt: "2026-04-27",
  },
  MARCIA: {
    workflowStatus: "IN_SESSION",
    instagramStatus: "NOT_PUBLISHED",
    receivedAt: "2026-04-12",
  },
  SOFIA: {
    workflowStatus: "PUBLISHED",
    instagramStatus: "PUBLISHED",
    receivedAt: "2026-04-06",
  },
  YOLANDA: {
    workflowStatus: "PENDING_PHOTOS",
    instagramStatus: "NOT_PUBLISHED",
    isNew: true,
    receivedAt: "2026-04-28",
  },
};

function buildInternalCode(index) {
  return `ECO-${String(index + 1).padStart(3, "0")}`;
}

async function run() {
  await client.connect();

  try {
    for (const [index, name] of initialDressNames.entries()) {
      const state = stateMap[name] ?? {};

      await client.query(
        `
          insert into "Dress" (
            "id",
            "internalCode",
            "name",
            "size",
            "isNew",
            "workflowStatus",
            "instagramStatus",
            "receivedAt",
            "createdAt",
            "updatedAt",
            "condition"
          )
          values (
            $9,
            $1,
            $2,
            $3,
            $4,
            $5::"WorkflowStatus",
            $6::"InstagramStatus",
            $7::timestamp,
            now(),
            now(),
            $8::"DressCondition"
          )
          on conflict ("internalCode")
          do update set
            "name" = excluded."name",
            "size" = excluded."size",
            "isNew" = excluded."isNew",
            "workflowStatus" = excluded."workflowStatus",
            "instagramStatus" = excluded."instagramStatus",
            "receivedAt" = excluded."receivedAt",
            "condition" = excluded."condition",
            "updatedAt" = now()
        `,
        [
          buildInternalCode(index),
          name,
          "Por definir",
          state.isNew ?? false,
          state.workflowStatus ?? "PENDING_PHOTOS",
          state.instagramStatus ?? "NOT_PUBLISHED",
          state.receivedAt ?? "2026-03-06",
          state.isNew ? "NEW" : "USED",
          randomUUID(),
        ],
      );
    }

    console.log(`Seed completado. Vestidos cargados: ${initialDressNames.length}`);
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error("Error ejecutando seed:", error);
  process.exit(1);
});
