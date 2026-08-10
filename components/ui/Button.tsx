import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const BASE =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-background hover:shadow-[0_0_24px_-6px_var(--color-accent)]",
  secondary:
    "border border-border text-foreground hover:border-accent hover:text-accent",
  ghost: "text-accent hover:opacity-80",
  danger:
    "bg-danger text-foreground hover:shadow-[0_0_24px_-6px_var(--color-danger)]",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type LinkProps = CommonProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children"
  >;

type ButtonElProps = CommonProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

export type ButtonProps = LinkProps | ButtonElProps;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cx(
    BASE,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );

  if (rest.href !== undefined) {
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
