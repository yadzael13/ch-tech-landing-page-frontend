import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
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

  return { container, video };
}

function dispatchScrollAndFlush() {
  window.dispatchEvent(new Event("scroll"));
  vi.runOnlyPendingTimers();
}

describe("useScrollScrub", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("does nothing when disabled", () => {
    vi.useFakeTimers();
    const { container, video } = setupNodes({
      top: -50,
      height: 200,
      duration: 10,
    });

    renderHook(() =>
      useScrollScrub({
        containerRef: { current: container },
        videoRef: { current: video },
        enabled: false,
      }),
    );

    dispatchScrollAndFlush();

    expect(video.currentTime).toBe(0);
  });

  it("sets currentTime from scroll progress through the container", () => {
    vi.useFakeTimers();
    // top: -50, height: 200 -> progress 0.25 -> currentTime = (1 - 0.25) * 10
    const { container, video } = setupNodes({
      top: -50,
      height: 200,
      duration: 10,
    });

    renderHook(() =>
      useScrollScrub({
        containerRef: { current: container },
        videoRef: { current: video },
        enabled: true,
      }),
    );

    dispatchScrollAndFlush();

    expect(video.currentTime).toBeCloseTo(7.5);
  });

  it("clamps progress to the [0, 1] range", () => {
    vi.useFakeTimers();
    const { container, video } = setupNodes({
      top: 50,
      height: 200,
      duration: 10,
    });

    renderHook(() =>
      useScrollScrub({
        containerRef: { current: container },
        videoRef: { current: video },
        enabled: true,
      }),
    );

    dispatchScrollAndFlush();

    expect(video.currentTime).toBeCloseTo(10);
  });

  it("ignores scroll while duration is not yet known", () => {
    vi.useFakeTimers();
    const { container, video } = setupNodes({
      top: -50,
      height: 200,
      duration: NaN,
    });

    renderHook(() =>
      useScrollScrub({
        containerRef: { current: container },
        videoRef: { current: video },
        enabled: true,
      }),
    );

    dispatchScrollAndFlush();

    expect(video.currentTime).toBe(0);
  });

  it("removes the scroll listener on unmount", () => {
    vi.useFakeTimers();
    const { container, video } = setupNodes({
      top: -50,
      height: 200,
      duration: 10,
    });
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() =>
      useScrollScrub({
        containerRef: { current: container },
        videoRef: { current: video },
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
