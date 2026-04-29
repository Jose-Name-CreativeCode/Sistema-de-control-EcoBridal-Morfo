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
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const instagramHandle = String(formData.get("instagramHandle") ?? "").trim();
  const availability = String(formData.get("availability") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const hourlyRate = parseOptionalNumber(formData.get("hourlyRate"));
  const perDressRate = parseOptionalNumber(formData.get("perDressRate"));
  const sizes = parseSizes(formData.get("sizes"));

  await prisma.modelProfile.create({
    data: {
      name,
      contactPhone: contactPhone || null,
      contactEmail: contactEmail || null,
      instagramHandle: instagramHandle || null,
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
