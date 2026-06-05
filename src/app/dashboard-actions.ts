"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/database";

export async function saveDashboardLinkAction(formData: FormData) {
  const key = String(formData.get("key") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect("/?demo=1");
  }

  if (!key || !label) {
    redirect("/");
  }

  await prisma.dashboardLink.upsert({
    where: { key },
    update: {
      label,
      url: url || null,
    },
    create: {
      key,
      label,
      url: url || null,
    },
  });

  revalidatePath("/");
  redirect("/");
}

export async function updateDashboardAssignmentAction(formData: FormData) {
  const assignmentId = String(formData.get("assignmentId") ?? "").trim();
  const assignmentStatus = String(
    formData.get("assignmentStatus") ?? "SUGGESTED",
  ).trim();
  const scheduledDateValue = String(formData.get("scheduledDate") ?? "").trim();
  const notesValue = String(formData.get("notes") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect("/?demo=1");
  }

  if (!assignmentId) {
    redirect("/");
  }

  const assignment = await prisma.dressAssignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      dressId: true,
    },
  });

  if (!assignment) {
    redirect("/");
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
      notes: notesValue || null,
    },
  });

  revalidatePath("/");
  revalidatePath(`/vestidos/${assignment.dressId}`);
  redirect("/");
}

export async function removeDashboardAssignmentAction(formData: FormData) {
  const assignmentId = String(formData.get("assignmentId") ?? "").trim();

  if (!isDatabaseConfigured()) {
    redirect("/?demo=1");
  }

  if (!assignmentId) {
    redirect("/");
  }

  const assignment = await prisma.dressAssignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      dressId: true,
    },
  });

  if (!assignment) {
    redirect("/");
  }

  await prisma.dressAssignment.delete({
    where: { id: assignmentId },
  });

  revalidatePath("/");
  revalidatePath(`/vestidos/${assignment.dressId}`);
  redirect("/");
}
