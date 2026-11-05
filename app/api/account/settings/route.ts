import { NextResponse } from "next/server";
import { cookieOptions, DEFAULT_PROFILE, encode, getProfile, getSessionUser, PROFILE_COOKIE, type Profile } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  return NextResponse.json({ ok: true, profile: await getProfile() });
}

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as Partial<Profile>;
  const current = await getProfile();
  const profile: Profile = {
    displayName: typeof body.displayName === "string" ? body.displayName.trim().slice(0, 60) : current.displayName,
    marketingEmails: body.marketingEmails ? true : current.marketingEmails,
    defaultCity: typeof body.defaultCity === "string" ? body.defaultCity.trim().slice(0, 60) : current.defaultCity,
    defaultCountry: typeof body.defaultCountry === "string" && /^[A-Z]{2}$/.test(body.defaultCountry) ? body.defaultCountry : current.defaultCountry || DEFAULT_PROFILE.defaultCountry,
  };

  const res = NextResponse.json({ ok: true, profile });
  res.cookies.set(PROFILE_COOKIE, encode(profile), { ...cookieOptions, maxAge: 60 * 60 * 24 * 365 });
  return res;
}
