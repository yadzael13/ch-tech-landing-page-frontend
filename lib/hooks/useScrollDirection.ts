"use client";

import { useEffect, useState } from "react";

type ScrollDirection = "up" | "down";

const DEFAULT_THRESHOLD_PX = 4;

/**
 * Tracks the most recent scroll direction, throttled to one measurement per
 * animation frame. Starts at "up" so content reads as visible before any
 * scrolling has happened. Movements smaller than `thresholdPx` (rubber-band
 * bounce, sub-pixel jitter) are ignored so the direction doesn't flicker.
 */
export function useScrollDirection(
  thresholdPx: number = DEFAULT_THRESHOLD_PX,
): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>("up");

  useEffect(() => {
    let lastY = window.scrollY;
    let frame: number | null = null;

    const measure = () => {
      frame = null;
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      if (Math.abs(delta) < thresholdPx) return;
      setDirection(delta > 0 ? "down" : "up");
      lastY = currentY;
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
  }, [thresholdPx]);

  return direction;
}
