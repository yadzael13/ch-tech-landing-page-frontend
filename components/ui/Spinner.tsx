import { cx } from "@/lib/cx";

interface SpinnerProps {
  label?: string;
  className?: string;
}

export function Spinner({ label = "Cargando", className }: SpinnerProps) {
  return (
    <span
      role="status"
      className={cx(
        "inline-flex items-center gap-2 text-sm text-muted",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
