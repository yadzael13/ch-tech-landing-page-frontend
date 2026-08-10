import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSectionReveal } from "./useSectionReveal";

type ObserverCallback = (
  entries: Pick<IntersectionObserverEntry, "isIntersecting">[],
) => void;

function mockIntersectionObserver() {
  let latestCallback: ObserverCallback | undefined;

  class MockObserver {
    constructor(callback: ObserverCallback) {
      latestCallback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }

  vi.stubGlobal("IntersectionObserver", MockObserver);

  return {
    triggerIntersect(isIntersecting: boolean) {
      act(() => {
        latestCallback?.([{ isIntersecting }]);
      });
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useSectionReveal", () => {
  it("gives each block an increasing entrance delay while visible", () => {
    const { triggerIntersect } = mockIntersectionObserver();
    const { result } = renderHook(() => useSectionReveal(150));

    result.current.ref(document.createElement("section"));
    triggerIntersect(true);

    expect(result.current.blockProps(0)).toEqual({
      className: "animate-fade-in-up-slow",
      style: { animationDelay: "0ms" },
    });
    expect(result.current.blockProps(1)).toEqual({
      className: "animate-fade-in-up-slow",
      style: { animationDelay: "150ms" },
    });
    expect(result.current.blockProps(2)).toEqual({
      className: "animate-fade-in-up-slow",
      style: { animationDelay: "300ms" },
    });
  });

  it("switches every block to the exit animation, keeping the stagger, once out of view", () => {
    const { triggerIntersect } = mockIntersectionObserver();
    const { result } = renderHook(() => useSectionReveal(150));

    result.current.ref(document.createElement("section"));
    triggerIntersect(true);
    triggerIntersect(false);

    expect(result.current.blockProps(0)).toEqual({
      className: "animate-fade-out-down-slow",
      style: { animationDelay: "0ms" },
    });
    expect(result.current.blockProps(1)).toEqual({
      className: "animate-fade-out-down-slow",
      style: { animationDelay: "150ms" },
    });
  });

  it("merges in a caller-supplied className", () => {
    const { result } = renderHook(() => useSectionReveal());

    expect(result.current.blockProps(0, "mt-8 flex gap-4").className).toBe(
      "animate-fade-in-up-slow mt-8 flex gap-4",
    );
  });
});
