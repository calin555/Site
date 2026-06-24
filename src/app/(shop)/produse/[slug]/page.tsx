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
import {
  getProductDetail,
  getRelatedProducts,
  getAllProductSlugs,
} from "@/lib/services/product.service";
import { getSchemaAvailability } from "@/lib/catalog/stock-status";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetail(slug);
  if (!product) return { title: "Produs negăsit" };

  const powerLabel = product.powerKw > 0 ? `${product.powerKw} kW` : "";
  const title = `${product.name}${powerLabel ? ` — ${powerLabel}` : ""}`;
  const description = `${product.shortDescription} Stație încărcare EV ${product.brand}. Livrare România, consultanță tehnică.`;

  return buildPageMetadata({
    title,
    description,
    path: `/produse/${slug}`,
    ogImage: product.image,
    keywords: [
      product.name,
      "stații încărcare EV",
      product.category,
      product.brand,
      "încărcare auto electrică",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => i.url),
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "RON",
      availability: getSchemaAvailability(product.stockStatus, product.stock),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <ProductGallery images={product.images} productName={product.name} />
            <ProductVideos videos={product.videos} productName={product.name} />
          </div>
          <ProductInfo product={product} />
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
