import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api/client";
import {
  clearRefreshCookie,
  isTrustedOrigin,
  readRefreshCookie,
  setRefreshCookie,
} from "@/lib/auth/session";
import type { TokenResponse } from "@/lib/api/types";

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Invalid origin" } },
      { status: 403 },
    );
  }

  const refreshToken = readRefreshCookie(request);
  if (!refreshToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "No active session" } },
      { status: 401 },
    );
  }

  try {
    const tokens = await apiFetch<TokenResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const response = NextResponse.json({ access_token: tokens.access_token });
    // Rotation (API.md): the presented refresh token is now revoked
    // backend-side, so the cookie must be replaced with the new one too.
    setRefreshCookie(response, tokens.refresh_token);
    return response;
  } catch (error) {
    const isApiError = error instanceof ApiError;
    const response = NextResponse.json(
      {
        error: isApiError
          ? { code: error.code, message: error.message }
          : { code: "INTERNAL_SERVER_ERROR", message: "Refresh failed" },
      },
      { status: isApiError ? error.status : 500 },
    );
    // The refresh token was rejected (expired/revoked/already used) — clear
    // the stale cookie so the client stops silently retrying with it.
    clearRefreshCookie(response);
    return response;
  }
}
