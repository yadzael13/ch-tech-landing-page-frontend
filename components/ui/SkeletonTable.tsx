import { Skeleton } from "./Skeleton";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  label?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 3,
  label = "Cargando",
}: SkeletonTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-border">
      <div aria-hidden="true">
        <div className="border-b border-border bg-surface-sunken px-4 py-3">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 px-4 py-3">
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <Skeleton key={columnIndex} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <span role="status" className="sr-only">
        {label}
      </span>
    </div>
  );
}
