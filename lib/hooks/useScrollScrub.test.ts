import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useScrollScrub } from "./useScrollScrub";

function setupNodes({
  top,
  height,
  duration,
}: {
  top: number;
  height: number;
  duration: number;
}) {
  const container = document.createElement("div");
  vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
    top,
    height,
    bottom: top + height,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: top,
    toJSON() {},
  });

  const video = document.createElement("video");
  Object.defineProperty(video, "duration", {
    value: duration,
    configurable: true,
  });
  Object.defineProperty(video, "currentTime", {
    value: 0,
    writable: true,
    configurable: true,
  });

  // Stable ref objects, matching what useRef() hands a real component: the
  // same object identity across re-renders. Passing a fresh `{ current }`
  // literal on every render (as the renderHook callback would otherwise do)
  // changes useScrollScrub's effect dependencies on each render, forcing it
  // to tear down and re-run — which resets isSettled right after it settles.
  const containerRef = { current: container };
  const videoRef = { current: video };

  return { container, video, containerRef, videoRef };
}

function dispatchScrollAndFlush() {
  act(() => {
    window.dispatchEvent(new Event("scroll"));
    vi.runOnlyPendingTimers();
  });
}

describe("useScrollScrub", () => {
  beforeEach(() => {
    vi.stubGlobal("innerHeight", 800);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("does nothing when disabled", () => {
    vi.useFakeTimers();
    const { video, containerRef, videoRef } = setupNodes({
      top: -100,
      height: 1800,
      duration: 10,
    });

    const { result } = renderHook(() =>
      useScrollScrub({
        containerRef,
        videoRef,
        enabled: false,
      }),
    );

    dispatchScrollAndFlush();

    expect(video.currentTime).toBe(0);
    expect(result.current.isSettled).toBe(false);
  });

  it("advances currentTime forward through the pinned scroll range", () => {
    vi.useFakeTimers();
    // scrollableDistance = height(1800) - innerHeight(800) = 1000
    // progress = -top / range = 100 / 1000 = 0.1 -> currentTime = 1
    const { video, containerRef, videoRef } = setupNodes({
      top: -100,
      height: 1800,
      duration: 10,
    });

    renderHook(() =>
      useScrollScrub({
        containerRef,
        videoRef,
        enabled: true,
      }),
    );

    dispatchScrollAndFlush();

    expect(video.currentTime).toBeCloseTo(1);
  });

  it("settles once scroll has advanced through the full pinned range", () => {
    vi.useFakeTimers();
    // top = -(height - innerHeight) -> progress = 1 -> last frame
    const { video, containerRef, videoRef } = setupNodes({
      top: -1000,
      height: 1800,
      duration: 10,
    });

    const { result } = renderHook(() =>
      useScrollScrub({
        containerRef,
        videoRef,
        enabled: true,
      }),
    );

    dispatchScrollAndFlush();

    expect(video.currentTime).toBeCloseTo(10);
    expect(result.current.isSettled).toBe(true);
  });

  it("clamps progress to the [0, 1] range", () => {
    vi.useFakeTimers();
    const { video, containerRef, videoRef } = setupNodes({
      top: 50,
      height: 1800,
      duration: 10,
    });

    renderHook(() =>
      useScrollScrub({
        containerRef,
        videoRef,
        enabled: true,
      }),
    );

    dispatchScrollAndFlush();

    expect(video.currentTime).toBe(0);
  });

  it("ignores scroll while duration is not yet known", () => {
    vi.useFakeTimers();
    const { video, containerRef, videoRef } = setupNodes({
      top: -100,
      height: 1800,
      duration: NaN,
    });

    renderHook(() =>
      useScrollScrub({
        containerRef,
        videoRef,
        enabled: true,
      }),
    );

    dispatchScrollAndFlush();

    expect(video.currentTime).toBe(0);
  });

  it("removes the scroll listener on unmount", () => {
    vi.useFakeTimers();
    const { containerRef, videoRef } = setupNodes({
      top: -100,
      height: 1800,
      duration: 10,
    });
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() =>
      useScrollScrub({
        containerRef,
        videoRef,
        enabled: true,
      }),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });
});
