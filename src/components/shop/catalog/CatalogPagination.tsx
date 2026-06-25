import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildCatalogUrl } from "@/lib/catalog/urls";
import type { CatalogParams } from "@/types/catalog";

interface CatalogPaginationProps {
  basePath: string;
  params: CatalogParams;
  page: number;
  totalPages: number;
  total: number;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export function CatalogPagination({
  basePath,
  params,
  page,
  totalPages,
  total,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Paginare produse"
      className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
    >
      <p className="text-sm text-surface-500">
        Pagina{" "}
        <span className="font-semibold text-surface-900">{page}</span> din{" "}
        <span className="font-semibold text-surface-900">{totalPages}</span>
        <span className="hidden sm:inline">
          {" "}
          · {total} produse total
        </span>
      </p>

      <div className="max-w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <div className="flex flex-wrap items-center justify-center gap-1 px-0.5 sm:flex-nowrap sm:justify-start">
        {page > 1 ? (
          <Link
            href={buildCatalogUrl(basePath, params, { page: page - 1 })}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 text-surface-600 transition-colors hover:border-brand-300 hover:text-brand-700"
            aria-label="Pagina anterioară"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-100 text-surface-300">
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-10 w-10 items-center justify-center text-surface-400"
            >
              …
            </span>
          ) : (
            <Link
              key={p}
              href={buildCatalogUrl(basePath, params, { page: p })}
              aria-label={`Pagina ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-colors",
                p === page
                  ? "bg-brand-600 text-white shadow-sm"
                  : "border border-surface-200 text-surface-600 hover:border-brand-300 hover:text-brand-700"
              )}
            >
              {p}
            </Link>
          )
        )}

        {page < totalPages ? (
          <Link
            href={buildCatalogUrl(basePath, params, { page: page + 1 })}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 text-surface-600 transition-colors hover:border-brand-300 hover:text-brand-700"
            aria-label="Pagina următoare"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-100 text-surface-300">
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
      </div>
    </nav>
  );
}
