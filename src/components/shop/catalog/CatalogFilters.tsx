"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  buildCatalogUrl,
  resolveBrandPath,
  resolveCategoryPath,
} from "@/lib/catalog/urls";
import { Button } from "@/components/ui/Button";
import type { CatalogFilters, CatalogParams } from "@/types/catalog";

interface CatalogFiltersProps {
  basePath: string;
  params: CatalogParams;
  filters: CatalogFilters;
}

export function CatalogFiltersPanel({
  basePath,
  params,
  filters,
}: CatalogFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [priceMin, setPriceMin] = useState(
    params.priceMin?.toString() ?? ""
  );
  const [priceMax, setPriceMax] = useState(
    params.priceMax?.toString() ?? ""
  );

  function navigate(overrides: Partial<CatalogParams>) {
    startTransition(() => {
      router.push(buildCatalogUrl(basePath, params, { ...overrides, page: 1 }));
      setMobileOpen(false);
    });
  }

  function togglePower(value: CatalogParams["power"] extends (infer T)[] | undefined ? T : never) {
    const current = params.power ?? [];
    const next = current.includes(value)
      ? current.filter((p) => p !== value)
      : [...current, value];
    navigate({ power: next.length ? next : undefined });
  }

  function toggleConnector(
    value: NonNullable<CatalogParams["connectors"]>[number]
  ) {
    const current = params.connectors ?? [];
    const next = current.includes(value)
      ? current.filter((c) => c !== value)
      : [...current, value];
    navigate({ connectors: next.length ? next : undefined });
  }

  function applyPriceFilter() {
    const min = priceMin ? Number(priceMin) : undefined;
    const max = priceMax ? Number(priceMax) : undefined;
    navigate({
      priceMin: min && min >= 0 ? min : undefined,
      priceMax: max && max >= 0 ? max : undefined,
    });
  }

  const panel = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-surface-900">
          Categorii
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => navigate({ categorySlug: undefined })}
              disabled={isPending}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                !params.categorySlug
                  ? "bg-brand-50 font-medium text-brand-700"
                  : "text-surface-600 hover:bg-surface-50"
              }`}
            >
              Toate produsele
            </button>
          </li>
          {filters.categories.map((cat) => (
            <li key={cat.slug}>
              <button
                type="button"
                onClick={() => {
                  startTransition(() => {
                    router.push(
                      resolveCategoryPath(cat.slug, {
                        ...params,
                        categorySlug: undefined,
                        page: 1,
                      })
                    );
                    setMobileOpen(false);
                  });
                }}
                disabled={isPending || cat.count === 0}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors disabled:opacity-40 ${
                  params.categorySlug === cat.slug
                    ? "bg-brand-50 font-medium text-brand-700"
                    : "text-surface-600 hover:bg-surface-50"
                }`}
              >
                {cat.name}{" "}
                <span className="text-surface-400">({cat.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Brands */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-surface-900">
          Brand
        </h3>
        <ul className="space-y-1">
          {filters.brands.map((brand) => (
            <li key={brand.slug}>
              <button
                type="button"
                onClick={() => {
                  startTransition(() => {
                    router.push(
                      resolveBrandPath(brand.slug, {
                        ...params,
                        brandSlug: undefined,
                        page: 1,
                      })
                    );
                    setMobileOpen(false);
                  });
                }}
                disabled={isPending || brand.count === 0}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors disabled:opacity-40 ${
                  params.brandSlug === brand.slug
                    ? "bg-brand-50 font-medium text-brand-700"
                    : "text-surface-600 hover:bg-surface-50"
                }`}
              >
                {brand.name}{" "}
                <span className="text-surface-400">({brand.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Power */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-surface-900">
          Putere
        </h3>
        <div className="flex flex-wrap gap-2">
          {filters.powerOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => togglePower(opt.value)}
              disabled={isPending || opt.count === 0}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                params.power?.includes(opt.value)
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-surface-200 text-surface-600 hover:border-brand-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Connectors */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-surface-900">
          Tip conector
        </h3>
        <div className="flex flex-wrap gap-2">
          {filters.connectorOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleConnector(opt.value)}
              disabled={isPending || opt.count === 0}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                params.connectors?.includes(opt.value)
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-surface-200 text-surface-600 hover:border-brand-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-surface-900">
          Preț (RON)
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            placeholder={`Min ${filters.priceRange.min}`}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="h-10 w-full rounded-lg border border-surface-200 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            aria-label="Preț minim"
          />
          <input
            type="number"
            min={0}
            placeholder={`Max ${filters.priceRange.max}`}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="h-10 w-full rounded-lg border border-surface-200 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            aria-label="Preț maxim"
          />
        </div>
        <Button
          size="sm"
          variant="outline"
          fullWidth
          className="mt-2"
          onClick={applyPriceFilter}
          disabled={isPending}
        >
          Aplică prețul
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-surface-200 bg-white py-3 text-sm font-medium text-surface-700 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtre
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-28 rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
          {panel}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-surface-900">Filtre</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-surface-500 hover:bg-surface-100"
                aria-label="Închide filtre"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {panel}
          </div>
        </div>
      )}
    </>
  );
}
