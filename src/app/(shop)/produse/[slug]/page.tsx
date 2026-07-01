import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductGallery } from "@/components/shop/product/ProductGallery";
import { ProductVideos } from "@/components/shop/product/ProductVideos";
import { ProductInfo } from "@/components/shop/product/ProductInfo";
import { ProductTabs } from "@/components/shop/product/ProductTabs";
import { ProductRelatedLandings } from "@/components/shop/product/ProductRelatedLandings";
import {
  getProductDetail,
  getRelatedProducts,
  getAllProductSlugs,
} from "@/lib/services/product.service";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { buildProductSchema } from "@/lib/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildProductSeoTitle,
  buildProductSeoDescription,
} from "@/lib/seo/product-seo-name";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetail(slug);
  if (!product) return { title: "Produs negăsit" };

  const seoTitle = buildProductSeoTitle(product);
  const description = buildProductSeoDescription(product);

  return buildPageMetadata({
    title: seoTitle,
    description,
    path: `/produse/${slug}`,
    ogImage: product.image,
    keywords: [
      "stație încărcare",
      product.name,
      `${product.powerKw} kW`,
      product.category,
      product.brand,
      "stații încărcare EV România",
    ],
  });
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductDetail(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(slug);

  return (
    <>
      <JsonLd data={buildProductSchema(product)} />
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", path: "/" },
          { name: "Produse", path: "/produse" },
          {
            name: product.category,
            path: `/produse/categorie/${product.categorySlug}`,
          },
          { name: product.name, path: `/produse/${product.slug}` },
        ]}
      />

      <Container className="py-6">
        <Breadcrumbs
          items={[
            { label: "Produse", href: "/produse" },
            {
              label: product.category,
              href: `/produse/categorie/${product.categorySlug}`,
            },
            { label: product.name },
          ]}
        />
      </Container>

      <Container className="pb-8">
        <div className="grid min-w-0 max-w-full gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0 space-y-6">
            <ProductGallery images={product.images} productName={product.name} />
            <ProductVideos videos={product.videos} productName={product.name} />
          </div>
          <div className="min-w-0">
            <ProductInfo product={product} />
            <ProductRelatedLandings product={product} />
          </div>
        </div>
      </Container>

      <div className="border-t border-surface-200 bg-surface-50">
        <Container>
          <div id="detalii">
            <ProductTabs product={product} />
          </div>
        </Container>
      </div>

      {related.length > 0 && (
        <Container className="py-16">
          <SectionHeading
            title="Produse similare"
            subtitle="Alte produse din aceeași categorie sau brand care te-ar putea interesa."
            className="mb-8"
          />
          <ProductGrid products={related} columns={4} />
        </Container>
      )}
    </>
  );
}
