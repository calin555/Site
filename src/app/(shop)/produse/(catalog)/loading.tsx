import { Container } from "@/components/shared/Container";
import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function ProduseLoading() {
  return (
    <>
      <div className="border-b border-surface-200 bg-surface-50 pattern-grid">
        <Container className="py-12 sm:py-16">
          <Skeleton className="h-10 w-64 sm:h-12" />
          <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        </Container>
      </div>
      <Container className="py-8">
        <Skeleton className="mb-8 h-4 w-48" />
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="hidden space-y-6 lg:block">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-10 w-44" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
