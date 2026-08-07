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
}

export function Reveal({
  as,
  children,
  delayMs = 0,
  className,
  style,
  ...rest
}: RevealProps) {
  const Tag = as ?? "div";
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

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
