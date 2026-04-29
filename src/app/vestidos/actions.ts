"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/database";

function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function createDressAction(formData: FormData) {
  if (!isDatabaseConfigured()) {
    redirect("/vestidos/nuevo?demo=1");
  }

  const internalCode = String(formData.get("internalCode") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const size = String(formData.get("size") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const condition = String(formData.get("condition") ?? "USED");
  const workflowStatus = String(formData.get("workflowStatus") ?? "PENDING_PHOTOS");
  const instagramStatus = String(formData.get("instagramStatus") ?? "NOT_PUBLISHED");
  const receivedAt = String(formData.get("receivedAt") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const price = parseOptionalNumber(formData.get("price"));
  const isNew = formData.get("isNew") === "on";

  await prisma.dress.create({
    data: {
      internalCode,
      name,
      brand: brand || null,
      size,
      color: color || null,
      condition: condition as "USED" | "NEW" | "SAMPLE",
      workflowStatus: workflowStatus as
        | "DRAFT"
        | "PENDING_PHOTOS"
        | "MODEL_ASSIGNED"
        | "IN_SESSION"
        | "PHOTOGRAPHED"
        | "EDITED"
        | "READY_TO_POST"
        | "PUBLISHED",
      instagramStatus: instagramStatus as
        | "NOT_PUBLISHED"
        | "SCHEDULED"
        | "PUBLISHED"
        | "ARCHIVED",
      receivedAt: receivedAt ? new Date(receivedAt) : null,
      notes: notes || null,
      price,
      isNew,
    },
  });

  revalidatePath("/vestidos");
  redirect("/vestidos?created=1");
}
