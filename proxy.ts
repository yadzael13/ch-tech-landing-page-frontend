import { NextRequest, NextResponse } from "next/server";
import { readRefreshCookie } from "@/lib/auth/session";

// Fast heuristic gate only — doesn't validate the JWT signature/expiry (that
// needs the HS256 secret, and this runs in the Edge runtime before every
// request). Real enforcement is server-side: AuthContext's silent refresh on
// mount, and every admin API call requiring a valid access token.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!readRefreshCookie(request)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
