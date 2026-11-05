import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCOUNT_COOKIE, cookieOptions, decode, DEMO_USER, encode, hashPassword, isValidEmail, SESSION_COOKIE } from "@/lib/auth";

interface StoredAccount {
  email: string;
  name: string;
  salt: string;
  hash: string;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!isValidEmail(email) || !password) {
    return NextResponse.json({ ok: false, error: "Enter your email and password." }, { status: 400 });
  }

  let name: string | null = null;
  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    name = DEMO_USER.name;
  } else {
    const store = await cookies();
    const account = decode<StoredAccount>(store.get(ACCOUNT_COOKIE)?.value);
    if (account && account.email === email && hashPassword(password, account.salt) === account.hash) {
      name = account.name;
    }
  }

  if (!name) {
    return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, user: { email, name } });
  res.cookies.set(SESSION_COOKIE, encode({ email, name }), cookieOptions);
  return res;
}
