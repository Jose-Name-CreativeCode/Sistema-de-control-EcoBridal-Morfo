"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getNextInternalCode } from "@/lib/internal-codes";
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

  const internalCode = await getNextInternalCode();
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const size = String(formData.get("size") ?? "").trim();
  const condition = String(formData.get("condition") ?? "USED");
  const workflowStatus = String(formData.get("workflowStatus") ?? "PENDING_PHOTOS");
  const instagramStatus = String(formData.get("instagramStatus") ?? "NOT_PUBLISHED");
  const receivedAt = String(formData.get("receivedAt") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const price = parseOptionalNumber(formData.get("price"));
  const isNew = formData.get("isNew") === "on";

  if (!name || !size) {
    redirect("/vestidos/nuevo?missing=1");
  }

  await prisma.dress.create({
    data: {
      internalCode,
      name,
      brand: brand || null,
      size,
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

export async function updateDressDetailAction(formData: FormData) {
  const dressId = String(formData.get("dressId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  const name = String(formData.get("name") ?? "").trim();
  const brand = parseOptionalString(formData.get("brand"));
  const size = parseOptionalString(formData.get("size")) ?? "Por definir";
  const condition = String(formData.get("condition") ?? "USED");
  const price = parseOptionalNumber(formData.get("price"));
  const notes = parseOptionalString(formData.get("notes"));
  const receivedAtValue = String(formData.get("receivedAt") ?? "").trim();
  const isNew = formData.get("isNew") === "on";

  if (!name) {
    redirect(`/vestidos/${dressId}?missing=1`);
  }

  await prisma.dress.update({
    where: { id: dressId },
    data: {
      name,
      brand,
      size,
      condition: condition as "USED" | "NEW" | "SAMPLE",
      price,
      notes,
      receivedAt: receivedAtValue ? new Date(receivedAtValue) : null,
      isNew,
    },
  });

  revalidatePath("/vestidos");
  revalidatePath(`/vestidos/${dressId}`);
  redirect(`/vestidos/${dressId}?detailsSaved=1`);
}

export async function deleteDressAction(formData: FormData) {
  const dressId = String(formData.get("dressId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  if (!dressId) {
    redirect("/vestidos");
  }

  await prisma.dress.delete({
    where: { id: dressId },
  });

  revalidatePath("/vestidos");
  redirect("/vestidos?deleted=1");
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
  const folderId = parseOptionalString(formData.get("folderId"));

  await prisma.$transaction(async (tx) => {
    const existingFolder = folderId
      ? await tx.dressPhotoFolder.findFirst({
          where: {
            id: folderId,
            dressId,
          },
        })
      : await tx.dressPhotoFolder.findFirst({
          where: { dressId },
          orderBy: {
            createdAt: "desc",
          },
        });

    const savedFolder = existingFolder
      ? await tx.dressPhotoFolder.update({
          where: { id: existingFolder.id },
          data: {
            provider: provider as
              | "OUTLOOK_ONEDRIVE"
              | "SHAREPOINT"
              | "GOOGLE_DRIVE"
              | "OTHER",
            folderUrl,
            versionLabel,
            notes,
          },
        })
      : await tx.dressPhotoFolder.create({
          data: {
            dressId,
            provider: provider as
              | "OUTLOOK_ONEDRIVE"
              | "SHAREPOINT"
              | "GOOGLE_DRIVE"
              | "OTHER",
            folderUrl,
            versionLabel,
            notes,
          },
        });

    await tx.dressPhotoFolder.deleteMany({
      where: {
        dressId,
        id: {
          not: savedFolder.id,
        },
      },
    });
  });

  revalidatePath(`/vestidos/${dressId}`);
  revalidatePath("/vestidos");
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
  const instagramPostId = parseOptionalString(formData.get("instagramPostId"));

  await prisma.$transaction(async (tx) => {
    const existingPost = instagramPostId
      ? await tx.dressInstagramPost.findFirst({
          where: {
            id: instagramPostId,
            dressId,
          },
        })
      : await tx.dressInstagramPost.findFirst({
          where: { dressId },
          orderBy: [
            {
              publishedAt: "desc",
            },
            {
              createdAt: "desc",
            },
          ],
        });

    const savedPost = existingPost
      ? await tx.dressInstagramPost.update({
          where: { id: existingPost.id },
          data: {
            postType: postType as "POST" | "REEL" | "STORY" | "CAROUSEL",
            instagramUrl,
            accountName,
            captionNotes,
            publishedAt: publishedAtValue ? new Date(publishedAtValue) : null,
          },
        })
      : await tx.dressInstagramPost.create({
          data: {
            dressId,
            postType: postType as "POST" | "REEL" | "STORY" | "CAROUSEL",
            instagramUrl,
            accountName,
            captionNotes,
            publishedAt: publishedAtValue ? new Date(publishedAtValue) : null,
          },
        });

    await tx.dressInstagramPost.deleteMany({
      where: {
        dressId,
        id: {
          not: savedPost.id,
        },
      },
    });
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
  const imageDataUrl = String(formData.get("imageDataUrl") ?? "").trim();
  const imageUrl = imageDataUrl || String(formData.get("imageUrl") ?? "").trim();
  const altText = parseOptionalString(formData.get("altText"));
  const sortOrder = parseOptionalNumber(formData.get("sortOrder")) ?? 0;

  if (!imageUrl) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

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

export async function updateDressPhotoAction(formData: FormData) {
  const dressId = String(formData.get("dressId") ?? "").trim();
  const photoId = String(formData.get("photoId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  const existingPhoto = await prisma.dressPhoto.findUnique({
    where: { id: photoId },
    select: {
      id: true,
      dressId: true,
      imageUrl: true,
    },
  });

  if (!existingPhoto || existingPhoto.dressId !== dressId) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  const photoType = String(formData.get("photoType") ?? "COVER");
  const imageDataUrl = String(formData.get("imageDataUrl") ?? "").trim();
  const imageUrlInput = String(formData.get("imageUrl") ?? "").trim();
  const altText = parseOptionalString(formData.get("altText"));
  const sortOrder = parseOptionalNumber(formData.get("sortOrder")) ?? 0;
  const nextImageUrl = imageDataUrl || imageUrlInput || existingPhoto.imageUrl;

  await prisma.dressPhoto.update({
    where: { id: photoId },
    data: {
      photoType: photoType as
        | "COVER"
        | "FRONT"
        | "BACK"
        | "DETAIL"
        | "WORN_BY_MODEL"
        | "VIDEO",
      imageUrl: nextImageUrl,
      altText,
      sortOrder,
    },
  });

  revalidatePath(`/vestidos/${dressId}`);
  redirect(`/vestidos/${dressId}?photoUpdated=1`);
}

export async function saveDressGalleryLinksAction(formData: FormData) {
  const dressId = String(formData.get("dressId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  const slots = [
    { field: "coverUrl", type: "COVER" as const },
    { field: "frontUrl", type: "FRONT" as const },
    { field: "backUrl", type: "BACK" as const },
    { field: "detailUrl", type: "DETAIL" as const },
  ];

  const existingPhotos = await prisma.dressPhoto.findMany({
    where: {
      dressId,
      photoType: {
        in: slots.map((slot) => slot.type),
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  for (const [index, slot] of slots.entries()) {
    const imageUrl = String(formData.get(slot.field) ?? "").trim();
    const existingPhoto = existingPhotos.find((photo) => photo.photoType === slot.type);

    if (!imageUrl) {
      if (existingPhoto) {
        await prisma.dressPhoto.delete({
          where: { id: existingPhoto.id },
        });
      }

      continue;
    }

    if (existingPhoto) {
      await prisma.dressPhoto.update({
        where: { id: existingPhoto.id },
        data: {
          imageUrl,
          sortOrder: index + 1,
        },
      });
    } else {
      await prisma.dressPhoto.create({
        data: {
          dressId,
          photoType: slot.type,
          imageUrl,
          sortOrder: index + 1,
        },
      });
    }
  }

  revalidatePath(`/vestidos/${dressId}`);
  redirect(`/vestidos/${dressId}?gallerySaved=1`);
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

  const modelIds = Array.from(
    new Set(
      formData
        .getAll("modelIds")
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .filter(Boolean),
    ),
  );
  const assignmentStatus = String(formData.get("assignmentStatus") ?? "SUGGESTED");
  const scheduledDateValue = String(formData.get("scheduledDate") ?? "").trim();
  const costAgreed = parseOptionalNumber(formData.get("costAgreed"));
  const notes = parseOptionalString(formData.get("notes"));

  if (modelIds.length === 0) {
    redirect(`/vestidos/${dressId}?assignmentMissing=1&edit=1`);
  }

  const existingAssignments = await prisma.dressAssignment.findMany({
    where: {
      dressId,
      modelId: {
        in: modelIds,
      },
      assignmentStatus: {
        in: ["SUGGESTED", "CONFIRMED"],
      },
    },
    select: {
      modelId: true,
    },
  });

  const existingModelIds = new Set(existingAssignments.map((assignment) => assignment.modelId));

  const assignmentsToCreate = modelIds.filter((modelId) => !existingModelIds.has(modelId));

  if (assignmentsToCreate.length > 0) {
    await prisma.dressAssignment.createMany({
      data: assignmentsToCreate.map((modelId) => ({
        dressId,
        modelId,
        assignmentStatus: assignmentStatus as
          | "SUGGESTED"
          | "CONFIRMED"
          | "COMPLETED"
          | "CANCELLED",
        scheduledDate: scheduledDateValue ? new Date(scheduledDateValue) : null,
        costAgreed,
        notes,
      })),
    });
  }

  await prisma.dress.update({
    where: { id: dressId },
    data: {
      workflowStatus: "MODEL_ASSIGNED",
    },
  });

  revalidatePath(`/vestidos/${dressId}`);
  revalidatePath("/vestidos");
  redirect(`/vestidos/${dressId}?assignmentSaved=1`);
}

export async function removeDressAssignmentAction(formData: FormData) {
  const dressId = String(formData.get("dressId") ?? "").trim();
  const assignmentId = String(formData.get("assignmentId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  const assignment = await prisma.dressAssignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      dressId: true,
    },
  });

  if (!assignment || assignment.dressId !== dressId) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  await prisma.dressAssignment.delete({
    where: { id: assignmentId },
  });

  revalidatePath(`/vestidos/${dressId}`);
  revalidatePath("/vestidos");
  redirect(`/vestidos/${dressId}?assignmentRemoved=1&edit=1`);
}

export async function updateDressAssignmentAction(formData: FormData) {
  const dressId = String(formData.get("dressId") ?? "").trim();
  const assignmentId = String(formData.get("assignmentId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  const assignmentStatus = String(formData.get("assignmentStatus") ?? "SUGGESTED");
  const scheduledDateValue = String(formData.get("scheduledDate") ?? "").trim();
  const notes = parseOptionalString(formData.get("notes"));

  const assignment = await prisma.dressAssignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      dressId: true,
    },
  });

  if (!assignment || assignment.dressId !== dressId) {
    redirect(`/vestidos/${dressId}?demo=1`);
  }

  await prisma.dressAssignment.update({
    where: { id: assignmentId },
    data: {
      assignmentStatus: assignmentStatus as
        | "SUGGESTED"
        | "CONFIRMED"
        | "COMPLETED"
        | "CANCELLED",
      scheduledDate: scheduledDateValue ? new Date(scheduledDateValue) : null,
      notes,
    },
  });

  revalidatePath(`/vestidos/${dressId}`);
  revalidatePath("/vestidos");
  redirect(`/vestidos/${dressId}?assignmentUpdated=1&edit=1`);
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

export async function bulkUpdateDressStatusesAction(formData: FormData) {
  const dressIds = formData
    .getAll("dressIds")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (!isDatabaseConfigured()) {
    redirect("/vestidos/actualizacion-masiva?demo=1");
  }

  if (dressIds.length === 0) {
    redirect("/vestidos/actualizacion-masiva?empty=1");
  }

  const workflowStatus = parseOptionalString(formData.get("workflowStatus"));
  const instagramStatus = parseOptionalString(formData.get("instagramStatus"));

  if (!workflowStatus && !instagramStatus) {
    redirect("/vestidos/actualizacion-masiva?empty=1");
  }

  await prisma.dress.updateMany({
    where: {
      id: {
        in: dressIds,
      },
    },
    data: {
      ...(workflowStatus
        ? {
            workflowStatus: workflowStatus as
              | "DRAFT"
              | "PENDING_PHOTOS"
              | "MODEL_ASSIGNED"
              | "IN_SESSION"
              | "PHOTOGRAPHED"
              | "EDITED"
              | "READY_TO_POST"
              | "PUBLISHED",
          }
        : {}),
      ...(instagramStatus
        ? {
            instagramStatus: instagramStatus as
              | "NOT_PUBLISHED"
              | "SCHEDULED"
              | "PUBLISHED"
              | "ARCHIVED",
          }
        : {}),
    },
  });

  revalidatePath("/vestidos");
  revalidatePath("/");
  revalidatePath("/vestidos/actualizacion-masiva");
  redirect("/vestidos/actualizacion-masiva?saved=1");
}
