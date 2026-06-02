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
