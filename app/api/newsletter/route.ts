import { NextResponse } from "next/server";
import { cookieOptions } from "@/lib/auth";
import { NEWSLETTER_COOKIE } from "@/lib/newsletter";
import { isValidEmail } from "@/lib/validation";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true, email });
  res.cookies.set(NEWSLETTER_COOKIE, email, { ...cookieOptions, httpOnly: false, maxAge: 60 * 60 * 24 * 365 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(NEWSLETTER_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
