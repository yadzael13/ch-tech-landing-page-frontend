import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTypewriter } from "./useTypewriter";

describe("useTypewriter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the full text immediately when disabled", () => {
    const { result } = renderHook(() => useTypewriter("Hola", false));

    expect(result.current).toBe("Hola");
  });

  it("reveals the text one character at a time when enabled", () => {
    const { result } = renderHook(() => useTypewriter("Hola", true, 10));

    expect(result.current).toBe("");

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current).toBe("H");

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current).toBe("Ho");

    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(result.current).toBe("Hola");
  });

  it("stops advancing once the full text has been revealed", () => {
    const { result } = renderHook(() => useTypewriter("Hi", true, 10));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe("Hi");
  });

  it("restarts from scratch when the text changes", () => {
    const { result, rerender } = renderHook(
      ({ text }) => useTypewriter(text, true, 10),
      { initialProps: { text: "Old" } },
    );

    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(result.current).toBe("Old");

    rerender({ text: "New headline" });
    expect(result.current).toBe("");

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current).toBe("N");
  });
});
