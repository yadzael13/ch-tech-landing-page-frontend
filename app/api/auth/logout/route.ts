import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api/client";
import {
  clearRefreshCookie,
  isTrustedOrigin,
  readRefreshCookie,
} from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Invalid origin" } },
      { status: 403 },
    );
  }

  const refreshToken = readRefreshCookie(request);
  const authHeader = request.headers.get("authorization");

  if (refreshToken && authHeader) {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
        headers: { Authorization: authHeader },
      });
    } catch {
      // Best-effort: the local session ends either way (e.g. the access
      // token already expired, or the refresh token was already revoked).
    }
  }

  const response = NextResponse.json({ success: true });
  clearRefreshCookie(response);
  return response;
}
