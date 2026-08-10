"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

interface UseScrollScrubOptions {
  containerRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  enabled: boolean;
}

/**
 * Drives a <video>'s currentTime from scroll position instead of native
 * playback. Progress is 0 while containerRef's top edge sits at the
 * viewport's top (page load) and reaches 1 once the container has scrolled
 * a full container-height past it — mapped to currentTime = (1 - progress)
 * * duration, so the video sits at its last frame at progress 0 (matching
 * where the mount-time autoplay-to-completion leaves it) and rewinds to the
 * first frame as the user scrolls down, playing forward again on the way
 * back up. No-ops entirely while `enabled` is false (e.g. prefers-reduced-
 * motion), leaving whatever frame the video already shows untouched.
 */
export function useScrollScrub({
  containerRef,
  videoRef,
  enabled,
}: UseScrollScrubOptions): void {
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
      const range = rect.height || 1;
      const progress = Math.min(1, Math.max(0, -rect.top / range));

      video.currentTime = (1 - progress) * duration;
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
}
