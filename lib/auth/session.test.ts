import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it } from "vitest";
import {
  clearRefreshCookie,
  isTrustedOrigin,
  readRefreshCookie,
  setRefreshCookie,
} from "./session";

describe("session cookie helpers", () => {
  it("round-trips a refresh token through set + read", () => {
    const response = NextResponse.json({});
    setRefreshCookie(response, "raw-refresh-token");

    const setCookie = response.cookies.get("ch_tech_refresh");
    expect(setCookie?.value).toBe("raw-refresh-token");
    expect(setCookie?.httpOnly).toBe(true);

    const request = new NextRequest("http://localhost/admin", {
      headers: { cookie: "ch_tech_refresh=raw-refresh-token" },
    });
    expect(readRefreshCookie(request)).toBe("raw-refresh-token");
  });

  it("returns undefined when there is no cookie", () => {
    const request = new NextRequest("http://localhost/admin");
    expect(readRefreshCookie(request)).toBeUndefined();
  });

  it("clears the cookie with an empty value", () => {
    const response = NextResponse.json({});
    clearRefreshCookie(response);

    expect(response.cookies.get("ch_tech_refresh")?.value).toBe("");
  });
});

describe("isTrustedOrigin", () => {
  it("allows a request with no Origin header", () => {
    const request = new NextRequest("http://localhost/api/auth/login");
    expect(isTrustedOrigin(request)).toBe(true);
  });

  it("allows a same-origin request", () => {
    const request = new NextRequest("http://localhost/api/auth/login", {
      headers: { origin: "http://localhost", host: "localhost" },
    });
    expect(isTrustedOrigin(request)).toBe(true);
  });

  it("rejects a cross-origin request", () => {
    const request = new NextRequest("http://localhost/api/auth/login", {
      headers: { origin: "https://evil.example", host: "localhost" },
    });
    expect(isTrustedOrigin(request)).toBe(false);
  });
});
