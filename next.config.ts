import type { NextConfig } from "next";

// The browser fetches the backend directly from NEXT_PUBLIC_API_URL —
// connect-src must allow that origin or every fetch (public and admin)
// would be blocked by the CSP below. Falls back to the dev default so
// `next build` never crashes on a missing env var.
const apiOrigin = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
).origin;

// React's development build uses eval() for debugging features (e.g.
// reconstructing component stack traces) — production React never calls
// eval() at all, so the relaxation only applies to the dev server.
const scriptSrc =
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  // Client/TeamMember/Product logos and photos are admin-supplied external
  // URLs (docs/DATA_MODEL.md) — their host isn't known in advance.
  "img-src 'self' data: https:",
  `connect-src 'self' ${apiOrigin}`,
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

// HSTS only makes sense once the site is actually served over HTTPS — sending
// it in dev would tell the browser to force-upgrade localhost and break the
// plain-http dev server.
const securityHeaders =
  process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : [];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          ...securityHeaders,
        ],
      },
    ];
  },
};

export default nextConfig;
