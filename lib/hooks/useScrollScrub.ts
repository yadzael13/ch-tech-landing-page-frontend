"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";

interface UseScrollScrubOptions {
  containerRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  enabled: boolean;
}

interface UseScrollScrubResult {
  /** True once scroll has advanced the video to its last frame. */
  isSettled: boolean;
}

/**
 * Drives a <video>'s currentTime from scroll position instead of native
 * playback, for a full-viewport section that pins (position: sticky) while
 * its containing block scrolls past. Progress is 0 while containerRef's top
 * edge sits at the viewport's top (the pin has just engaged) and reaches 1
 * once the container has scrolled by its own height minus one viewport (the
 * pin is about to release) — mapped directly to currentTime = progress *
 * duration, so the video advances frame by frame on the way down and
 * rewinds on the way back up. No-ops while `enabled` is false (e.g.
 * prefers-reduced-motion), leaving whatever frame the video already shows
 * untouched.
 */
export function useScrollScrub({
  containerRef,
  videoRef,
  enabled,
}: UseScrollScrubOptions): UseScrollScrubResult {
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let frame: number | null = null;

    const applyScrub = () => {
      frame = null;

      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      const range = scrollableDistance > 0 ? scrollableDistance : 1;
      const progress = Math.min(1, Math.max(0, -rect.top / range));

      video.currentTime = progress * duration;
      setIsSettled(progress >= 1);
    };

    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(applyScrub);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [containerRef, videoRef, enabled]);

  return { isSettled };
}
