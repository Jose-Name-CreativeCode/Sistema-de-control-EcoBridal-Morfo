"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isDatabaseConfigured } from "@/lib/database";
import { prisma } from "@/lib/prisma";

function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseSizes(rawValue: FormDataEntryValue | null) {
  const value = typeof rawValue === "string" ? rawValue : "";

  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

export async function createModelAction(formData: FormData) {
  if (!isDatabaseConfigured()) {
    redirect("/modelos/nuevo?demo=1");
  }

  const name = String(formData.get("name") ?? "").trim();
  const contactPhone = String(formData.get("contactPhone") ?? "").trim();
  const instagramHandle = String(formData.get("instagramHandle") ?? "").trim();
  const photoUrl = String(formData.get("photoUrl") ?? "").trim();
  const availability = String(formData.get("availability") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const hourlyRate = parseOptionalNumber(formData.get("hourlyRate"));
  const perDressRate = parseOptionalNumber(formData.get("perDressRate"));
  const sizes = parseSizes(formData.get("sizes"));

  await prisma.modelProfile.create({
    data: {
      name,
      contactPhone: contactPhone || null,
      instagramHandle: instagramHandle || null,
      photoUrl: photoUrl || null,
      availability: availability || null,
      notes: notes || null,
      hourlyRate,
      perDressRate,
      sizes: {
        create: sizes.map((size) => ({
          size,
        })),
      },
    },
  });

  revalidatePath("/modelos");
  revalidatePath("/asignaciones");
  redirect("/modelos?created=1");
}

export async function updateModelAction(formData: FormData) {
  const modelId = String(formData.get("modelId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect(`/modelos/${modelId}?demo=1`);
  }

  const name = String(formData.get("name") ?? "").trim();
  const contactPhone = parseOptionalString(formData.get("contactPhone"));
  const instagramHandle = parseOptionalString(formData.get("instagramHandle"));
  const photoUrl = parseOptionalString(formData.get("photoUrl"));
  const availability = parseOptionalString(formData.get("availability"));
  const notes = parseOptionalString(formData.get("notes"));
  const hourlyRate = parseOptionalNumber(formData.get("hourlyRate"));
  const perDressRate = parseOptionalNumber(formData.get("perDressRate"));
  const sizes = parseSizes(formData.get("sizes"));

  if (!name) {
    redirect(`/modelos/${modelId}?missing=1&edit=1`);
  }

  await prisma.modelProfile.update({
    where: { id: modelId },
    data: {
      name,
      contactPhone,
      instagramHandle,
      photoUrl,
      availability,
      notes,
      hourlyRate,
      perDressRate,
      sizes: {
        deleteMany: {},
        create: sizes.map((size) => ({ size })),
      },
    },
  });

  revalidatePath("/modelos");
  revalidatePath(`/modelos/${modelId}`);
  revalidatePath("/asignaciones");
  redirect(`/modelos/${modelId}?saved=1`);
}
