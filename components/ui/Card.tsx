import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";

type CardTag = "div" | "li" | "article" | "figure" | "section";

const BASE = "rounded-2xl border border-border bg-surface p-6";
const INTERACTIVE =
  "transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]";

/**
 * Composes the canonical card classes without rendering an element — for
 * cases where the card IS an article/figure/li already carrying other
 * semantics (e.g. wrapped in Reveal), so a second nested element would be
 * redundant.
 */
export function cardClassName({
  interactive = false,
  className,
}: {
  interactive?: boolean;
  className?: string;
} = {}) {
  return cx(BASE, interactive && INTERACTIVE, className);
}

interface CardProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  as?: CardTag;
  interactive?: boolean;
  children?: ReactNode;
}

export function Card({
  as,
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  const Tag = as ?? "div";

  return (
    <Tag className={cardClassName({ interactive, className })} {...rest}>
      {children}
    </Tag>
  );
}
