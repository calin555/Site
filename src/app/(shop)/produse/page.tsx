import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductCatalog } from "@/components/shop/catalog/ProductCatalog";
import { getCatalogProducts } from "@/lib/services/catalog.service";
import { parseCatalogSearchParams, getCatalogBasePath } from "@/lib/catalog/urls";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const catalogParams = parseCatalogSearchParams(params);
  const hasFilters =
    catalogParams.q ||
    catalogParams.categorySlug ||
    catalogParams.brandSlug ||
    catalogParams.power?.length ||
    catalogParams.connectors?.length ||
    catalogParams.priceMin ||
    catalogParams.priceMax;

  if (hasFilters) {
    return buildPageMetadata({
      title: "Produse filtrate",
      description: "Rezultate căutare în catalogul de stații încărcare EV.",
      path: "/produse",
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: "Stații încărcare EV — catalog AC & DC România",
    description:
      "Catalog complet stații încărcare mașini electrice: wallbox AC, stații rapide DC, încărcătoare EV și accesorii. Livrare în România.",
    path: "/produse",
    keywords: [
      "stații încărcare EV",
      "încărcătoare EV România",
      "stații rapide DC",
      "stații AC wallbox",
    ],
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawParams = await searchParams;
  const catalogParams = parseCatalogSearchParams(rawParams);
  const result = await getCatalogProducts(catalogParams);

  const context = {
    basePath: getCatalogBasePath({ basePath: "/produse", ...catalogParams }),
  };

  return (
    <>
      <PageHeader
        title="Catalog produse"
        description="Stații de încărcare AC și DC, accesorii și module smart. Filtrează după putere, conector și preț."
      />
      <ProductCatalog
        result={result}
        context={context}
        breadcrumbs={[{ label: "Produse" }]}
      />
    </>
  );
}
