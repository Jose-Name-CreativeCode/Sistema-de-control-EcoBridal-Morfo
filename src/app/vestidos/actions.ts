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

function parseOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
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

export async function addDressPhotoFolderAction(formData: FormData) {
  const dressId = String(formData.get("dressId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  const provider = String(formData.get("provider") ?? "OUTLOOK_ONEDRIVE");
  const folderUrl = String(formData.get("folderUrl") ?? "").trim();
  const versionLabel = parseOptionalString(formData.get("versionLabel"));
  const notes = parseOptionalString(formData.get("notes"));

  await prisma.dressPhotoFolder.create({
    data: {
      dressId,
      provider: provider as "OUTLOOK_ONEDRIVE" | "SHAREPOINT" | "GOOGLE_DRIVE" | "OTHER",
      folderUrl,
      versionLabel,
      notes,
    },
  });

  revalidatePath(`/vestidos/${dressId}`);
  redirect(`/vestidos/${dressId}?folderSaved=1`);
}

export async function addDressInstagramPostAction(formData: FormData) {
  const dressId = String(formData.get("dressId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  const postType = String(formData.get("postType") ?? "POST");
  const instagramUrl = String(formData.get("instagramUrl") ?? "").trim();
  const accountName = parseOptionalString(formData.get("accountName"));
  const captionNotes = parseOptionalString(formData.get("captionNotes"));
  const publishedAtValue = String(formData.get("publishedAt") ?? "").trim();

  await prisma.dressInstagramPost.create({
    data: {
      dressId,
      postType: postType as "POST" | "REEL" | "STORY" | "CAROUSEL",
      instagramUrl,
      accountName,
      captionNotes,
      publishedAt: publishedAtValue ? new Date(publishedAtValue) : null,
    },
  });

  revalidatePath(`/vestidos/${dressId}`);
  revalidatePath("/vestidos");
  redirect(`/vestidos/${dressId}?instagramSaved=1`);
}

export async function addDressPhotoAction(formData: FormData) {
  const dressId = String(formData.get("dressId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  const photoType = String(formData.get("photoType") ?? "COVER");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const altText = parseOptionalString(formData.get("altText"));
  const sortOrder = parseOptionalNumber(formData.get("sortOrder")) ?? 0;

  await prisma.dressPhoto.create({
    data: {
      dressId,
      photoType: photoType as
        | "COVER"
        | "FRONT"
        | "BACK"
        | "DETAIL"
        | "WORN_BY_MODEL"
        | "VIDEO",
      imageUrl,
      altText,
      sortOrder,
    },
  });

  revalidatePath(`/vestidos/${dressId}`);
  redirect(`/vestidos/${dressId}?photoSaved=1`);
}

export async function updateDressStatusesAction(formData: FormData) {
  const dressId = String(formData.get("dressId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  const workflowStatus = String(formData.get("workflowStatus") ?? "PENDING_PHOTOS");
  const instagramStatus = String(formData.get("instagramStatus") ?? "NOT_PUBLISHED");

  await prisma.dress.update({
    where: { id: dressId },
    data: {
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
    },
  });

  revalidatePath(`/vestidos/${dressId}`);
  revalidatePath("/vestidos");
  redirect(`/vestidos/${dressId}?statusSaved=1`);
}

export async function assignModelToDressAction(formData: FormData) {
  const dressId = String(formData.get("dressId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  const modelId = String(formData.get("modelId") ?? "").trim();
  const assignmentStatus = String(formData.get("assignmentStatus") ?? "SUGGESTED");
  const scheduledDateValue = String(formData.get("scheduledDate") ?? "").trim();
  const costAgreed = parseOptionalNumber(formData.get("costAgreed"));
  const notes = parseOptionalString(formData.get("notes"));

  await prisma.dressAssignment.create({
    data: {
      dressId,
      modelId: modelId || null,
      assignmentStatus: assignmentStatus as
        | "SUGGESTED"
        | "CONFIRMED"
        | "COMPLETED"
        | "CANCELLED",
      scheduledDate: scheduledDateValue ? new Date(scheduledDateValue) : null,
      costAgreed,
      notes,
    },
  });

  await prisma.dress.update({
    where: { id: dressId },
    data: {
      workflowStatus: "MODEL_ASSIGNED",
    },
  });

  revalidatePath(`/vestidos/${dressId}`);
  revalidatePath("/vestidos");
  revalidatePath("/asignaciones");
  redirect(`/vestidos/${dressId}?assignmentSaved=1`);
}

export async function updateDressBasicsAction(formData: FormData) {
  const dressId = String(formData.get("dressId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect("/vestidos/edicion-rapida?demo=1");
  }

  const brand = parseOptionalString(formData.get("brand"));
  const size = parseOptionalString(formData.get("size")) ?? "Por definir";
  const color = parseOptionalString(formData.get("color"));
  const condition = String(formData.get("condition") ?? "USED");
  const price = parseOptionalNumber(formData.get("price"));
  const notes = parseOptionalString(formData.get("notes"));

  await prisma.dress.update({
    where: { id: dressId },
    data: {
      brand,
      size,
      color,
      condition: condition as "USED" | "NEW" | "SAMPLE",
      price,
      notes,
    },
  });

  revalidatePath("/vestidos");
  revalidatePath(`/vestidos/${dressId}`);
  revalidatePath("/vestidos/edicion-rapida");
  redirect("/vestidos/edicion-rapida?saved=1");
}
