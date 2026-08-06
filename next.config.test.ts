import type { NextConfig } from "next";
import { afterEach, describe, expect, it, vi } from "vitest";

async function loadConfig(nodeEnv: string): Promise<NextConfig> {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", nodeEnv);
  const mod = await import("./next.config");
  return mod.default;
}

async function cspFor(nodeEnv: string): Promise<string> {
  const config = await loadConfig(nodeEnv);
  const rules = await config.headers?.();
  const rule = rules![0]!;
  return rule.headers.find((h) => h.key === "Content-Security-Policy")!.value;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("next.config headers", () => {
  it("sends a Content-Security-Policy and related security headers on every route", async () => {
    const config = await loadConfig("production");
    const rules = await config.headers?.();
    expect(rules).toBeDefined();
    const rule = rules![0]!;

    expect(rule.source).toBe("/:path*");

    const byKey = Object.fromEntries(
      rule.headers.map((h) => [h.key, h.value]),
    );

    expect(byKey["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(byKey["Content-Security-Policy"]).toContain(
      "frame-ancestors 'none'",
    );
    expect(byKey["X-Content-Type-Options"]).toBe("nosniff");
    expect(byKey["X-Frame-Options"]).toBe("DENY");
    expect(byKey["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });

  it("allows connecting to the configured backend API origin", async () => {
    const config = await loadConfig("production");
    const rules = await config.headers?.();
    const byKey = Object.fromEntries(
      rules![0]!.headers.map((h) => [h.key, h.value]),
    );

    // Defaults to the dev backend (NEXT_PUBLIC_API_URL isn't set in tests) —
    // without this, every fetch from the browser to the backend would be
    // blocked by connect-src.
    expect(byKey["Content-Security-Policy"]).toContain(
      "connect-src 'self' http://localhost:8000",
    );
  });

  it("allows 'unsafe-eval' in script-src only in development", async () => {
    // React dev mode uses eval() for debugging features (component stack
    // reconstruction); production React never calls eval() at all, so the
    // stricter CSP only needs to relax for the dev server.
    expect(await cspFor("development")).toContain(
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    );

    const prodCsp = await cspFor("production");
    expect(prodCsp).toContain("script-src 'self' 'unsafe-inline'");
    expect(prodCsp).not.toContain("'unsafe-eval'");
  });
});
