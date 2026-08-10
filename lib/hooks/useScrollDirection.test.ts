import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useScrollDirection } from "./useScrollDirection";

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

describe("useScrollDirection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setScrollY(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts as 'up'", () => {
    const { result } = renderHook(() => useScrollDirection());

    expect(result.current).toBe("up");
  });

  it("switches to 'down' once scrollY increases past the threshold", () => {
    const { result } = renderHook(() => useScrollDirection(4));

    setScrollY(20);
    scrollAndFlush();

    expect(result.current).toBe("down");
  });

  it("switches back to 'up' once scrollY decreases past the threshold", () => {
    const { result } = renderHook(() => useScrollDirection(4));

    setScrollY(200);
    scrollAndFlush();
    expect(result.current).toBe("down");

    setScrollY(150);
    scrollAndFlush();

    expect(result.current).toBe("up");
  });

  it("ignores movement smaller than the threshold", () => {
    const { result } = renderHook(() => useScrollDirection(10));

    setScrollY(5);
    scrollAndFlush();

    expect(result.current).toBe("up");
  });

  it("removes the scroll listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useScrollDirection());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });
});
