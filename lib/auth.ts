import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
export { isValidEmail } from "./validation";

export const SESSION_COOKIE = "gs_session";
export const ACCOUNT_COOKIE = "gs_account";
export const PROFILE_COOKIE = "gs_profile";

export interface SessionUser {
  email: string;
  name: string;
}

export interface Profile {
  displayName: string;
  marketingEmails: boolean;
  defaultCity: string;
  defaultCountry: string;
}

export const DEFAULT_PROFILE: Profile = {
  displayName: "",
  marketingEmails: false,
  defaultCity: "",
  defaultCountry: "US",
};

export const DEMO_USER = {
  email: "demo@gauntlet.shop",
  password: "password123",
  name: "Demo Rider",
};

export function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

export function newSalt(): string {
  return randomBytes(8).toString("hex");
}

export function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

export function decode<T>(raw: string | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  return decode<SessionUser>(store.get(SESSION_COOKIE)?.value);
}

export async function getProfile(): Promise<Profile> {
  const store = await cookies();
  const saved = decode<Partial<Profile>>(store.get(PROFILE_COOKIE)?.value);
  return { ...DEFAULT_PROFILE, ...(saved ?? {}) };
}

