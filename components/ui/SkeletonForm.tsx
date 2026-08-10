import { Skeleton } from "./Skeleton";

interface SkeletonFormProps {
  fields?: number;
  label?: string;
}

export function SkeletonForm({
  fields = 4,
  label = "Cargando",
}: SkeletonFormProps) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div aria-hidden="true" className="flex flex-col gap-4">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <span role="status" className="sr-only">
        {label}
      </span>
    </div>
  );
}
