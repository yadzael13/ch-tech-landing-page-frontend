"use client";

import type { CSSProperties } from "react";
import { useScrollReveal } from "./useScrollReveal";
import { cx } from "@/lib/cx";

const DEFAULT_STAGGER_MS = 150;

interface BlockProps {
  className: string;
  style: CSSProperties;
}

interface UseSectionRevealResult<T extends HTMLElement> {
  ref: (node: T | null) => void;
  isVisible: boolean;
  /**
   * Props for the Nth top-level block of the section (0-indexed): a
   * className that switches between the slow entrance and exit keyframes
   * depending on the section's current visibility, plus an animationDelay
   * staggered by `index * staggerMs` — applied in both directions, so
   * blocks fade in one after another and fade out the same way, not just
   * on entrance.
   */
  blockProps: (index: number, className?: string) => BlockProps;
}

/**
 * Section-level counterpart to Reveal's once=true default: stays observing
 * for the section's whole lifetime (useScrollReveal's once:false) and
 * hands back a `blockProps` helper so each top-level block (title, intro,
 * item grid, ...) can stagger in and out together, on the same shared
 * visibility state — instead of hand-rolling the same animate/opacity/
 * delay wiring in every section that wants this.
 */
export function useSectionReveal<T extends HTMLElement = HTMLElement>(
  staggerMs: number = DEFAULT_STAGGER_MS,
): UseSectionRevealResult<T> {
  const { ref, isVisible } = useScrollReveal<T>({ once: false });

  const blockProps = (index: number, className?: string): BlockProps => ({
    className: cx(
      isVisible ? "animate-fade-in-up-slow" : "animate-fade-out-down-slow",
      className,
    ),
    style: { animationDelay: `${index * staggerMs}ms` },
  });

  return { ref, isVisible, blockProps };
}
