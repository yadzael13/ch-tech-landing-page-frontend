import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

function mockMatchMedia(initialMatches: boolean) {
  let changeHandler: (() => void) | undefined;

  const mediaQueryList = {
    matches: initialMatches,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: vi.fn((_event: string, handler: () => void) => {
      changeHandler = handler;
    }),
    removeEventListener: vi.fn(),
  };

  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mediaQueryList));

  return {
    setMatches(matches: boolean) {
      mediaQueryList.matches = matches;
      act(() => {
        changeHandler?.();
      });
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("usePrefersReducedMotion", () => {
  it("reflects the current media query state on mount", () => {
    mockMatchMedia(true);

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(true);
  });

  it("defaults to false when the query does not match", () => {
    mockMatchMedia(false);

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);
  });

  it("updates when the media query changes", () => {
    const { setMatches } = mockMatchMedia(false);

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    setMatches(true);

    expect(result.current).toBe(true);
  });
});
