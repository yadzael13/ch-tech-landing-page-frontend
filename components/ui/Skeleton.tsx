import { cx } from "@/lib/cx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "skeleton-shimmer block animate-shimmer rounded-md",
        className,
      )}
    />
  );
}
