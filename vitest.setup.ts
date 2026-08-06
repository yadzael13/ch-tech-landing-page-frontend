import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./test/msw-server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  // Without `test.globals: true`, @testing-library/react's own auto-cleanup
  // (which depends on a global `afterEach`) never registers, so each
  // render() would otherwise accumulate in the DOM across tests.
  cleanup();
});
afterAll(() => server.close());
