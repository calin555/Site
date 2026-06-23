import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductCatalog } from "@/components/shop/catalog/ProductCatalog";
import { getCatalogProducts } from "@/lib/services/catalog.service";
import { parseCatalogSearchParams, getCatalogBasePath } from "@/lib/catalog/urls";
import { getCategoryBySlug, getShopCategories } from "@/lib/services/category.service";
import { siteConfig } from "@/config/site";

interface CategoryCatalogPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryCatalogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Categorie negăsită" };

  const rawParams = await searchParams;
  const hasExtraFilters = Object.keys(rawParams).length > 0;

  return {
    title: `${category.name} — Stații de încărcare EV`,
    description: category.description,
    alternates: {
      canonical: `${siteConfig.url}/produse/categorie/${slug}`,
    },
    robots: hasExtraFilters ? { index: false, follow: true } : undefined,
  };
}

export async function generateStaticParams() {
  const categories = await getShopCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryCatalogPage({
  params,
  searchParams,
}: CategoryCatalogPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const rawParams = await searchParams;
  const catalogParams = parseCatalogSearchParams(rawParams, {
    categorySlug: slug,
  });
  const result = await getCatalogProducts(catalogParams);

  const context = {
    basePath: getCatalogBasePath({
      basePath: `/produse/categorie/${slug}`,
      categorySlug: slug,
    }),
    categorySlug: slug,
    categoryName: category.name,
  };

  return (
    <>
      <PageHeader
        title={category.name}
        description={category.description}
      />
      <ProductCatalog
        result={result}
        context={context}
        breadcrumbs={[
          { label: "Produse", href: "/produse" },
          { label: category.name },
        ]}
      />
    </>
  );
}
