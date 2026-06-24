import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductCatalog } from "@/components/shop/catalog/ProductCatalog";
import { getCatalogProducts } from "@/lib/services/catalog.service";
import { parseCatalogSearchParams, getCatalogBasePath } from "@/lib/catalog/urls";
import { brands } from "@/lib/mock-data";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface BrandCatalogPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getBrandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}

export async function generateMetadata({
  params,
  searchParams,
}: BrandCatalogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "Brand negăsit" };

  const rawParams = await searchParams;
  const hasExtraFilters = Object.keys(rawParams).length > 0;

  return buildPageMetadata({
    title: `${brand.name} — stații încărcare EV România`,
    description: `Produse ${brand.name}: stații încărcare mașini electrice, wallbox AC și stații DC. Livrare România.`,
    path: `/produse/brand/${slug}`,
    noIndex: hasExtraFilters,
    keywords: [brand.name, "stații încărcare EV", "încărcătoare EV România"],
  });
}

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export default async function BrandCatalogPage({
  params,
  searchParams,
}: BrandCatalogPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const rawParams = await searchParams;
  const catalogParams = parseCatalogSearchParams(rawParams, {
    brandSlug: slug,
  });
  const result = await getCatalogProducts(catalogParams);

  const context = {
    basePath: getCatalogBasePath({
      basePath: `/produse/brand/${slug}`,
      brandSlug: slug,
    }),
    brandSlug: slug,
    brandName: brand.name,
  };

  return (
    <>
      <PageHeader
        title={`Produse ${brand.name}`}
        description={`Explorează gama completă de stații de încărcare și accesorii ${brand.name}.`}
      />
      <ProductCatalog
        result={result}
        context={context}
        breadcrumbs={[
          { label: "Produse", href: "/produse" },
          { label: brand.name },
        ]}
      />
    </>
  );
}
