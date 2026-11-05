import { NextResponse } from "next/server";
import { ACCOUNT_COOKIE, cookieOptions, DEMO_USER, encode, hashPassword, isValidEmail, newSalt, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { name?: string; email?: string; password?: string };
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (name.length < 2) return NextResponse.json({ ok: false, error: "Enter your name." }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });
  if (email === DEMO_USER.email) return NextResponse.json({ ok: false, error: "An account with that email already exists." }, { status: 409 });

  const salt = newSalt();
  const account = { email, name, salt, hash: hashPassword(password, salt) };
  const res = NextResponse.json({ ok: true, user: { email, name } }, { status: 201 });
  res.cookies.set(ACCOUNT_COOKIE, encode(account), { ...cookieOptions, maxAge: 60 * 60 * 24 * 365 });
  res.cookies.set(SESSION_COOKIE, encode({ email, name }), cookieOptions);
  return res;
}
