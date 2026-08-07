import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./test/msw-server";

// jsdom has no IntersectionObserver implementation. useScrollReveal treats
// its absence as "reveal immediately" (fail-open), but without this stub
// merely *importing* it in a component under test throws a ReferenceError
// before that fallback logic ever runs.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  // Without `test.globals: true`, @testing-library/react's own auto-cleanup
  // (which depends on a global `afterEach`) never registers, so each
  // render() would otherwise accumulate in the DOM across tests.
  cleanup();
});
afterAll(() => server.close());
