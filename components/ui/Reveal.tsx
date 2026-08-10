"use client";

import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { cx } from "@/lib/cx";

type RevealTag = "div" | "li" | "article" | "figure" | "section";

interface RevealProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> {
  as?: RevealTag;
  children: ReactNode;
  delayMs?: number;
  /**
   * Default true: reveal once and leave it revealed. Pass false to also
   * play the inverse (fade back to opacity-0) every time the element
   * scrolls out of view, and re-reveal every time it scrolls back in.
   */
  once?: boolean;
  /**
   * Default false (the snappy 0.6s micro-animation). Pass true for the
   * stretched-out 1.4s crossfade — section-level once={false} reveals need
   * enough duration to actually read as a transition, not a small element
   * popping in.
   */
  slow?: boolean;
}

export function Reveal({
  as,
  children,
  delayMs = 0,
  once = true,
  slow = false,
  className,
  style,
  ...rest
}: RevealProps) {
  const Tag = as ?? "div";
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ once });

  const mergedStyle: CSSProperties = {
    ...style,
    ...(delayMs ? { animationDelay: `${delayMs}ms` } : {}),
  };

  const revealAnimation = slow
    ? "animate-fade-in-up-slow"
    : "animate-fade-in-up";

  return (
    <Tag
      ref={ref}
      style={mergedStyle}
      className={cx(isVisible ? revealAnimation : "opacity-0", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
