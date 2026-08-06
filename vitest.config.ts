import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Next's own bundler resolves the "@/*" alias from tsconfig.json
    // natively; Vite (which powers Vitest) does not, so it needs restating
    // here or every "@/..." import in a test fails to resolve.
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: [
        "app/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
      ],
      // layout.tsx/page.tsx files are pure composition with no logic of
      // their own; the public page.tsx also mixes in async Server
      // Components (TechStack, Services, Projects), which plain ReactDOM/
      // RTL can't render as JSX children the way Next's RSC runtime does —
      // each is unit-tested on its own instead (see their respective
      // *.test.tsx). Route Handlers (app/api/**) need a real NextRequest/
      // cookie jar to test meaningfully — AuthContext's tests already cover
      // the client-side contract against them via MSW; the handlers
      // themselves are exercised by the manual verification pass instead.
      exclude: [
        "app/**/*.test.{ts,tsx}",
        "app/**/layout.tsx",
        "app/page.tsx",
        // Uses next/og's ImageResponse (Satori/resvg), which needs Next's
        // own runtime, not jsdom — same reasoning as layout.tsx above.
        "app/icon.tsx",
        // Renders its own <html>/<body> (only fires when the root layout
        // itself throws) — RTL can't mount that as a child, same reasoning
        // as layout.tsx above.
        "app/global-error.tsx",
        "app/api/**",
        "components/**/*.test.{ts,tsx}",
        "lib/**/*.test.{ts,tsx}",
      ],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 80,
      },
    },
  },
});
