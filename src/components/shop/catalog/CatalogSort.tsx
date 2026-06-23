"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { buildCatalogUrl } from "@/lib/catalog/urls";
import { SORT_OPTIONS } from "@/config/catalog";
import type { CatalogParams, SortOption } from "@/types/catalog";

interface CatalogSortProps {
  basePath: string;
  params: CatalogParams;
}

export function CatalogSort({ basePath, params }: CatalogSortProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(sort: SortOption) {
    startTransition(() => {
      router.push(buildCatalogUrl(basePath, params, { sort, page: 1 }));
    });
  }

  return (
    <div className="relative">
      <select
        value={params.sort ?? "popular"}
        onChange={(e) => handleChange(e.target.value as SortOption)}
        disabled={isPending}
        aria-label="Sortează produsele"
        className="h-10 appearance-none rounded-xl border border-surface-200 bg-white pl-4 pr-10 text-sm font-medium text-surface-700 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
