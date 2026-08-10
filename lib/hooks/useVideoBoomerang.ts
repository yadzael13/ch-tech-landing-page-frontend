"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

interface UseVideoBoomerangOptions {
  videoRef: RefObject<HTMLVideoElement | null>;
  enabled: boolean;
}

/**
 * Plays a <video> forward to the end, then back to the start, then forward
 * again — repeating indefinitely ("boomerang" loop). Native <video> has no
 * reverse playback, so the reverse leg is simulated by stepping
 * currentTime backward via requestAnimationFrame (delta-timed, not a fixed
 * step per frame, so it holds a steady pace regardless of frame rate). The
 * native `loop` attribute is deliberately not used: it would seek straight
 * back to 0 without ever firing `ended`, skipping the reverse leg entirely.
 * No-ops while `enabled` is false (e.g. prefers-reduced-motion), leaving
 * the video paused on whatever frame it already shows.
 */
export function useVideoBoomerang({
  videoRef,
  enabled,
}: UseVideoBoomerangOptions): void {
  useEffect(() => {
    if (!enabled) return;

    const video = videoRef.current;
    if (!video) return;

    let frame: number | null = null;
    let lastTimestamp: number | null = null;

    const stepReverse = (timestamp: number) => {
      lastTimestamp ??= timestamp;
      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const next = video.currentTime - deltaSeconds;
      if (next <= 0) {
        video.currentTime = 0;
        frame = null;
        video.play()?.catch(() => {});
        return;
      }

      video.currentTime = next;
      frame = requestAnimationFrame(stepReverse);
    };

    const handleEnded = () => {
      // Browsers already auto-pause on `ended`, but that's implicit browser
      // behavior rather than something this code asserts — pausing
      // explicitly here means the reverse leg never has to reason about
      // whether native playback might still be advancing currentTime out
      // from under our own rAF-driven writes to it.
      video.pause();
      lastTimestamp = null;
      frame = requestAnimationFrame(stepReverse);
    };

    video.addEventListener("ended", handleEnded);
    video.play()?.catch(() => {});

    return () => {
      video.removeEventListener("ended", handleEnded);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [videoRef, enabled]);
}
