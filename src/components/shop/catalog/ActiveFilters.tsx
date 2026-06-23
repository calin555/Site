"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { buildCatalogUrl } from "@/lib/catalog/urls";
import {
  CONNECTOR_LABELS,
  SORT_LABELS,
  POWER_OPTIONS,
} from "@/config/catalog";
import type { CatalogParams, CatalogPageContext } from "@/types/catalog";

interface ActiveFiltersProps {
  basePath: string;
  params: CatalogParams;
  context: CatalogPageContext;
}

export function ActiveFilters({ basePath, params, context }: ActiveFiltersProps) {
  const chips: { label: string; href: string }[] = [];

  if (params.q) {
    chips.push({
      label: `„${params.q}"`,
      href: buildCatalogUrl(basePath, params, { q: undefined, page: 1 }),
    });
  }

  if (params.categorySlug && !context.categorySlug) {
    chips.push({
      label: `Categorie: ${params.categorySlug}`,
      href: buildCatalogUrl(basePath, params, { categorySlug: undefined, page: 1 }),
    });
  }

  if (params.brandSlug && !context.brandSlug) {
    chips.push({
      label: `Brand: ${params.brandSlug}`,
      href: buildCatalogUrl(basePath, params, { brandSlug: undefined, page: 1 }),
    });
  }

  params.power?.forEach((p) => {
    const label = POWER_OPTIONS.find((o) => o.value === p)?.label ?? p;
    chips.push({
      label: `Putere: ${label}`,
      href: buildCatalogUrl(basePath, params, {
        power: params.power!.filter((x) => x !== p),
        page: 1,
      }),
    });
  });

  params.connectors?.forEach((c) => {
    chips.push({
      label: `Conector: ${CONNECTOR_LABELS[c]}`,
      href: buildCatalogUrl(basePath, params, {
        connectors: params.connectors!.filter((x) => x !== c),
        page: 1,
      }),
    });
  });

  if (params.priceMin !== undefined) {
    chips.push({
      label: `Min: ${params.priceMin} RON`,
      href: buildCatalogUrl(basePath, params, { priceMin: undefined, page: 1 }),
    });
  }

  if (params.priceMax !== undefined) {
    chips.push({
      label: `Max: ${params.priceMax} RON`,
      href: buildCatalogUrl(basePath, params, { priceMax: undefined, page: 1 }),
    });
  }

  if (params.sort && params.sort !== "popular") {
    chips.push({
      label: SORT_LABELS[params.sort],
      href: buildCatalogUrl(basePath, params, { sort: "popular", page: 1 }),
    });
  }

  if (chips.length === 0) return null;

  const clearAllHref = context.categorySlug
    ? `/produse/categorie/${context.categorySlug}`
    : context.brandSlug
      ? `/produse/brand/${context.brandSlug}`
      : "/produse";

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-surface-500">
        Filtre active:
      </span>
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800 transition-colors hover:bg-brand-100"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </Link>
      ))}
      <Link
        href={clearAllHref}
        className="text-xs font-semibold text-surface-500 underline-offset-2 hover:text-brand-600 hover:underline"
      >
        Șterge toate
      </Link>
    </div>
  );
}
