import { cx } from "@/lib/cx";

interface ErrorStateProps {
  message: string;
  className?: string;
}

export function ErrorState({ message, className }: ErrorStateProps) {
  return (
    <p role="alert" className={cx("mt-6 text-sm text-danger", className)}>
      {message}
    </p>
  );
}
