import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductCatalog } from "@/components/shop/catalog/ProductCatalog";
import { getCatalogProducts } from "@/lib/services/catalog.service";
import { parseCatalogSearchParams, getCatalogBasePath } from "@/lib/catalog/urls";
import { brands } from "@/lib/mock-data";
import { getShopBrandBySlug } from "@/lib/services/brand.service";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

interface BrandCatalogPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
  searchParams,
}: BrandCatalogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getShopBrandBySlug(slug);
  // 404 real (nu soft 404 cu status 200) pentru produse/pagini șterse.
  if (!brand) notFound();

  const rawParams = await searchParams;
  const hasExtraFilters = Object.keys(rawParams).length > 0;
  // Pagini de brand fără produse = conținut subțire → noindex,follow (audit SEO).
  const isEmpty = brand.productCount === 0;

  return buildPageMetadata({
    title: `${brand.name} — stații încărcare EV România`,
    description: `Produse ${brand.name}: stații încărcare mașini electrice, wallbox AC și stații DC. Livrare România.`,
    path: `/produse/brand/${slug}`,
    noIndex: hasExtraFilters || isEmpty,
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
  const brand = await getShopBrandBySlug(slug);
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
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", path: "/" },
          { name: "Produse", path: "/produse" },
          { name: brand.name, path: `/produse/brand/${slug}` },
        ]}
      />
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
