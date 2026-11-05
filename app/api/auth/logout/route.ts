import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

function clearSession(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url), { status: 303 });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

export async function POST(req: Request) {
  return clearSession(req);
}

export async function GET(req: Request) {
  return clearSession(req);
}
