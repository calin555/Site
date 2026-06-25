"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useTransition } from "react";
import { buildCatalogUrl } from "@/lib/catalog/urls";
import type { CatalogParams } from "@/types/catalog";

interface CatalogSearchProps {
  basePath: string;
  params: CatalogParams;
}

export function CatalogSearch({ basePath, params }: CatalogSearchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.q ?? "");

  function submit(search?: string) {
    const q = (search ?? query).trim();
    startTransition(() => {
      router.push(
        buildCatalogUrl(basePath, params, { q: q || undefined, page: 1 })
      );
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="relative"
    >
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Caută stații, branduri, accesorii..."
        className="h-11 w-full max-w-full rounded-xl border border-surface-200 bg-white pl-10 pr-10 text-base text-surface-900 placeholder:text-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:text-sm"
        aria-label="Caută produse"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            submit("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-0.5 text-surface-400 hover:text-surface-600"
          aria-label="Șterge căutarea"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {isPending && (
        <div className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 animate-pulse rounded-full bg-brand-200" />
      )}
    </form>
  );
}
