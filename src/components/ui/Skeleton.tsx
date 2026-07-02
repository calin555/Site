import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

/** Shimmer skeleton — GPU-friendly (transform-based sweep). */
export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} aria-hidden="true" {...props} />;
}

/** Skeleton shaped like a ProductCard, for grid loading states. */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200/80 bg-white shadow-elev-1">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}
