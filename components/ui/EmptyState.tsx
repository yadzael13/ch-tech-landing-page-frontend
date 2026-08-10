import { cx } from "@/lib/cx";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className }: EmptyStateProps) {
  return <p className={cx("mt-6 text-sm text-muted", className)}>{message}</p>;
}
