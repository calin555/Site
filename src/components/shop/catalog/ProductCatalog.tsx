import Link from "next/link";
import { SearchX } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CatalogSearch } from "./CatalogSearch";
import { CatalogSort } from "./CatalogSort";
import { CatalogFiltersPanel } from "./CatalogFilters";
import { CatalogPagination } from "./CatalogPagination";
import { ActiveFilters } from "./ActiveFilters";
import { Button } from "@/components/ui/Button";
import type { CatalogResult, CatalogPageContext } from "@/types/catalog";

interface ProductCatalogProps {
  result: CatalogResult;
  context: CatalogPageContext;
  breadcrumbs: { label: string; href?: string }[];
}

export function ProductCatalog({
  result,
  context,
  breadcrumbs,
}: ProductCatalogProps) {
  const { products, total, page, totalPages, filters, params } = result;
  const { basePath } = context;

  return (
    <Container className="py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="mb-6">
        <CatalogSearch basePath={basePath} params={params} />
      </div>

      <ActiveFilters basePath={basePath} params={params} context={context} />

      <div className="flex min-w-0 flex-col gap-8 lg:flex-row">
        <CatalogFiltersPanel
          basePath={basePath}
          params={params}
          filters={filters}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-surface-500">
              <span className="font-semibold text-surface-900">{total}</span>{" "}
              {total === 1 ? "produs găsit" : "produse găsite"}
              {params.q && (
                <span>
                  {" "}
                  pentru „<span className="text-surface-700">{params.q}</span>"
                </span>
              )}
            </p>
            <CatalogSort basePath={basePath} params={params} />
          </div>

          {products.length > 0 ? (
            <>
              <ProductGrid products={products} columns={3} />
              <CatalogPagination
                basePath={basePath}
                params={params}
                page={page}
                totalPages={totalPages}
                total={total}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-surface-300 bg-surface-50 py-20 text-center">
              <SearchX className="mx-auto h-12 w-12 text-surface-300" />
              <h3 className="mt-4 text-lg font-bold text-surface-900">
                Niciun produs găsit
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-surface-500">
                Încearcă să modifici filtrele sau termenul de căutare pentru a
                vedea mai multe rezultate.
              </p>
              <Link href={basePath} className="mt-6 inline-block">
                <Button variant="outline">Resetează filtrele</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
