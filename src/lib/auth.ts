import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "ecobridal_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 14;

type SessionPayload = {
  email: string;
  expiresAt: number;
};

function getAuthSecret() {
  return process.env.AUTH_SECRET?.trim() ?? "";
}

function getSharedPassword() {
  return process.env.AUTH_SHARED_PASSWORD?.trim() ?? "";
}

function getAllowedEmails() {
  const raw = process.env.AUTH_ALLOWED_EMAILS ?? "";

  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signValue(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function buildSessionToken(payload: SessionPayload) {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signValue(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function parseSessionToken(token?: string | null): SessionPayload | null {
  if (!token || !getAuthSecret()) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;

    if (!payload.email || typeof payload.expiresAt !== "number") {
      return null;
    }

    if (payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function getSessionCookieOptions(expiresAt = Date.now() + SESSION_DURATION_MS) {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  };
}

export function isAuthConfigured() {
  return Boolean(getAuthSecret() && getSharedPassword() && getAllowedEmails().length > 0);
}

export function validateLogin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const allowedEmails = getAllowedEmails();
  const sharedPassword = getSharedPassword();

  if (!normalizedEmail || !password.trim()) {
    return false;
  }

  return allowedEmails.includes(normalizedEmail) && password === sharedPassword;
}

export async function createSession(email: string) {
  const cookieStore = await cookies();
  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const token = buildSessionToken({ email: normalizedEmail, expiresAt });

  cookieStore.set({
    ...getSessionCookieOptions(expiresAt),
    value: token,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set({
    ...getSessionCookieOptions(0),
    value: "",
    expires: new Date(0),
  });
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  return parseSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export function getSessionFromRequest(request: NextRequest) {
  return parseSessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}
