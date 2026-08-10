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
}

export function Reveal({
  as,
  children,
  delayMs = 0,
  once = true,
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

  return (
    <Tag
      ref={ref}
      style={mergedStyle}
      className={cx(isVisible ? "animate-fade-in-up" : "opacity-0", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
