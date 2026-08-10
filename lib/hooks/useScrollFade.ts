"use client";

import { useEffect, useState } from "react";

const DEFAULT_RANGE_PX = 400;

/**
 * Returns 1 at the top of the page, fading linearly to 0 as the user
 * scrolls down through `rangePx`, and back to 1 on the way back up.
 * Tied directly to scroll position (rather than a discrete "direction"
 * flag paired with a fixed-duration CSS transition) so the value tracks
 * the scroll gesture 1:1, with no separate animation timing to feel out
 * of sync with it. Throttled to one recompute per animation frame.
 */
export function useScrollFade(rangePx: number = DEFAULT_RANGE_PX): number {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let frame: number | null = null;

    const measure = () => {
      frame = null;
      const progress = Math.min(1, Math.max(0, window.scrollY / rangePx));
      setOpacity(1 - progress);
    };

    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [rangePx]);

  return opacity;
}
