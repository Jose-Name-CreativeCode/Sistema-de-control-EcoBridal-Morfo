"use server";

import { redirect } from "next/navigation";
import { clearSession, createSession, isAuthConfigured, validateLogin } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  if (!isAuthConfigured()) {
    redirect("/login?error=config");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!validateLogin(email, password)) {
    redirect("/login?error=invalid");
  }

  await createSession(email);
  redirect("/");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
