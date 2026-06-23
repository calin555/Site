import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductCatalog } from "@/components/shop/catalog/ProductCatalog";
import { getCatalogProducts } from "@/lib/services/catalog.service";
import { parseCatalogSearchParams, getCatalogBasePath } from "@/lib/catalog/urls";
import { siteConfig } from "@/config/site";

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
    return {
      title: "Produse filtrate",
      description: "Rezultate căutare în catalogul ChargePro.",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: "Produse — Stații de încărcare EV",
    description:
      "Catalog complet de stații de încărcare AC și DC, accesorii și soluții smart pentru orice aplicație.",
    alternates: { canonical: `${siteConfig.url}/produse` },
  };
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
