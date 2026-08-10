"use client";

import { useEffect, useState } from "react";

const DEFAULT_INTERVAL_MS = 35;

/**
 * Reveals `text` one character at a time on an interval, for a typewriter
 * entrance effect. Returns the full text immediately (no animation) while
 * `enabled` is false — callers gate that on prefers-reduced-motion. Resets
 * and retypes from scratch whenever `text` itself changes (e.g. the async
 * Company tagline replacing the static fallback after mount).
 */
export function useTypewriter(
  text: string,
  enabled: boolean,
  intervalMs: number = DEFAULT_INTERVAL_MS,
): string {
  const [length, setLength] = useState(0);

  // Resets synchronously during render rather than via an effect (React's
  // recommended "adjusting state when a prop changes" pattern) so a new
  // `text` restarts the typing animation from empty on the very same
  // render, before the browser paints anything from the old text's length.
  const [trackedText, setTrackedText] = useState(text);
  if (text !== trackedText) {
    setTrackedText(text);
    setLength(0);
  }

  useEffect(() => {
    if (!enabled) return;

    // Starts from 0 unconditionally: the render-phase reset above already
    // zeroes `length` in the same render a new `text` arrives in, so by the
    // time this effect (re)runs for that change, 0 is already correct —
    // and for an `enabled` flip with `text` unchanged, restarting the type-
    // out from scratch is the simpler, more predictable behavior anyway.
    let index = 0;
    const id = setInterval(() => {
      index += 1;
      setLength(index);
      if (index >= text.length) clearInterval(id);
    }, intervalMs);

    return () => clearInterval(id);
  }, [text, enabled, intervalMs]);

  return enabled ? text.slice(0, length) : text;
}
