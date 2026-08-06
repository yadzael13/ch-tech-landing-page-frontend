import { NextRequest, NextResponse } from "next/server";

const REFRESH_COOKIE_NAME = "ch_tech_refresh";

const maxAgeSeconds =
  Number(process.env.REFRESH_TOKEN_EXPIRE_DAYS ?? "7") * 24 * 60 * 60;

/** Secure requires HTTPS — false in dev (plain http://localhost) or the
 * browser silently drops the cookie and login would appear to succeed but
 * never persist a session. */
const isProduction = process.env.NODE_ENV === "production";

export function setRefreshCookie(response: NextResponse, token: string): void {
  response.cookies.set(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export function clearRefreshCookie(response: NextResponse): void {
  response.cookies.set(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function readRefreshCookie(request: NextRequest): string | undefined {
  return request.cookies.get(REFRESH_COOKIE_NAME)?.value;
}

/** CSRF defense-in-depth on top of the cookie's `sameSite: "lax"` (OWASP
 * "Verifying Origin with Standard Headers"). Browsers omit the Origin header
 * on some legitimate same-origin requests, so absence isn't treated as
 * suspicious — only a *mismatching* Origin is rejected. */
export function isTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return new URL(origin).host === request.headers.get("host");
}
