import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api/client";
import { isTrustedOrigin, setRefreshCookie } from "@/lib/auth/session";
import type { LoginPayload, TokenResponse } from "@/lib/api/types";

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Invalid origin" } },
      { status: 403 },
    );
  }

  const payload = (await request.json()) as LoginPayload;

  try {
    const tokens = await apiFetch<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const response = NextResponse.json({ access_token: tokens.access_token });
    // The refresh token never reaches client JS — only this httpOnly cookie
    // holds it, so an XSS payload elsewhere on the site can't read it out of
    // localStorage/document.cookie (SECURITY.md "proteger contra XSS").
    setRefreshCookie(response, tokens.refresh_token);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "Login failed" } },
      { status: 500 },
    );
  }
}
