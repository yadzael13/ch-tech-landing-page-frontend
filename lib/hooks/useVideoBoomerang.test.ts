import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useVideoBoomerang } from "./useVideoBoomerang";

function createVideo({ duration }: { duration: number }) {
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
  vi.spyOn(video, "play").mockResolvedValue(undefined);
  return video;
}

describe("useVideoBoomerang", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("plays the video forward on mount when enabled", () => {
    const video = createVideo({ duration: 4 });
    const videoRef = { current: video };

    renderHook(() => useVideoBoomerang({ videoRef, enabled: true }));

    expect(video.play).toHaveBeenCalledTimes(1);
  });

  it("does nothing when disabled", () => {
    const video = createVideo({ duration: 4 });
    const videoRef = { current: video };

    renderHook(() => useVideoBoomerang({ videoRef, enabled: false }));

    expect(video.play).not.toHaveBeenCalled();
  });

  it("reverses currentTime back to 0 after the video ends, then loops forward again", () => {
    const video = createVideo({ duration: 4 });
    const videoRef = { current: video };

    renderHook(() => useVideoBoomerang({ videoRef, enabled: true }));
    expect(video.play).toHaveBeenCalledTimes(1);

    video.currentTime = 4;
    act(() => {
      video.dispatchEvent(new Event("ended"));
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(video.currentTime).toBe(0);
    expect(video.play).toHaveBeenCalledTimes(2);
  });

  it("removes the ended listener and cancels pending frames on unmount", () => {
    const video = createVideo({ duration: 4 });
    const videoRef = { current: video };
    const removeEventListenerSpy = vi.spyOn(video, "removeEventListener");

    const { unmount } = renderHook(() =>
      useVideoBoomerang({ videoRef, enabled: true }),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "ended",
      expect.any(Function),
    );
  });
});
