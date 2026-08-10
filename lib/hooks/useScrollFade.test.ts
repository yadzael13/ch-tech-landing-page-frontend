import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useScrollFade } from "./useScrollFade";

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    value,
    configurable: true,
    writable: true,
  });
}

function scrollAndFlush() {
  act(() => {
    window.dispatchEvent(new Event("scroll"));
    vi.runOnlyPendingTimers();
  });
}

describe("useScrollFade", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setScrollY(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts fully opaque", () => {
    const { result } = renderHook(() => useScrollFade(400));

    expect(result.current).toBe(1);
  });

  it("fades linearly as scrollY advances through the range", () => {
    const { result } = renderHook(() => useScrollFade(400));

    setScrollY(200);
    scrollAndFlush();

    expect(result.current).toBeCloseTo(0.5);
  });

  it("reaches 0 once scrollY passes the range", () => {
    const { result } = renderHook(() => useScrollFade(400));

    setScrollY(600);
    scrollAndFlush();

    expect(result.current).toBe(0);
  });

  it("fades back in as the user scrolls back up", () => {
    const { result } = renderHook(() => useScrollFade(400));

    setScrollY(400);
    scrollAndFlush();
    expect(result.current).toBe(0);

    setScrollY(100);
    scrollAndFlush();

    expect(result.current).toBeCloseTo(0.75);
  });

  it("removes the scroll listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useScrollFade(400));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });
});
