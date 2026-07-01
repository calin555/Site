import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { buildCommercialBodyHtml } from "@/lib/seo/commercial/content-builder";
import { getProductsForLanding } from "@/lib/seo/commercial/product-matcher";
import type { CommercialLandingPageData } from "@/lib/seo/commercial/types";
import {
  getRelatedCommercialLandings,
} from "@/lib/seo/commercial/registry";
import { buildFaqPageSchema } from "@/lib/seo/structured-data";
import { buildProductSchema } from "@/lib/seo/structured-data";
import { getProductDetail } from "@/lib/services/product.service";
import { getLandingConversion } from "@/lib/seo/commercial/landing-conversion";

interface CommercialLandingViewProps {
  page: CommercialLandingPageData;
}

export async function CommercialLandingView({ page }: CommercialLandingViewProps) {
  const products = await getProductsForLanding(page.productFilter, 6);
  const productDetails = await Promise.all(
    products.slice(0, 3).map((p) => getProductDetail(p.slug))
  );

  const relatedPages = getRelatedCommercialLandings(page.relatedLandingSlugs);
  const conversion = getLandingConversion(page.slug);
  const bodyHtml = buildCommercialBodyHtml(page);
  const ctaPrimary = conversion?.ctaPrimary ?? "Solicită ofertă gratuită";
  const ctaSecondary = conversion?.ctaSecondary ?? page.catalogCtaLabel;

  const productSchemas = productDetails
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .map((p) => buildProductSchema(p));

  return (
    <>
      <JsonLd
        data={[
          buildFaqPageSchema(page.faq),
          ...productSchemas,
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", path: "/" },
          { name: "Stații încărcare", path: "/statii-incarcare" },
          { name: page.h1, path: `/${page.slug}` },
        ]}
      />

      <PageHeader title={page.h1} description={page.intro} />

      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Stații încărcare", href: "/statii-incarcare" },
            { label: page.primaryKeyword },
          ]}
          className="mb-8"
        />

        <div className="grid min-w-0 gap-10 lg:grid-cols-3">
          <article className="blog-content min-w-0 lg:col-span-2">
            <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          </article>

          <aside className="space-y-6">
            <Card padding="lg" className="sticky top-24">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <Zap className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-surface-900">
                Ofertă {page.primaryKeyword}
              </h2>
              <p className="mt-2 text-sm text-surface-600">
                Consultanță gratuită, dimensionare tehnică și instalare autorizată ANRE.
              </p>
              <div className="mt-6 space-y-3">
                <Link
                  href="/contact"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 text-base font-semibold text-white shadow-sm shadow-brand-600/20 transition-colors hover:bg-brand-700"
                >
                  {ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={page.catalogCtaHref}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl border-2 border-surface-200 bg-white text-sm font-semibold text-surface-900 transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  {ctaSecondary}
                </Link>
              </div>
            </Card>

            {conversion?.toolLinks && conversion.toolLinks.length > 0 && (
              <Card padding="md">
                <h3 className="font-semibold text-surface-900">Instrumente utile</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {conversion.toolLinks.map((tool) => (
                    <li key={tool.href}>
                      <Link
                        href={tool.href}
                        className="text-brand-600 hover:text-brand-700 hover:underline"
                      >
                        {tool.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {relatedPages.length > 0 && (
              <Card padding="md">
                <h3 className="font-semibold text-surface-900">Pagini conexe</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {relatedPages.map((rel) => (
                    <li key={rel.slug}>
                      <Link
                        href={`/${rel.slug}`}
                        className="text-brand-600 hover:text-brand-700 hover:underline"
                      >
                        {rel.primaryKeyword}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </aside>
        </div>

        {products.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-surface-900">
              Produse recomandate — {page.primaryKeyword}
            </h2>
            <ProductGrid products={products} />
            <div className="mt-6 text-center">
              <Link
                href={page.catalogCtaHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                {page.catalogCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        <div className="mt-16">
          <FaqSection
            title={`Întrebări frecvente — ${page.primaryKeyword}`}
            items={page.faq}
          />
        </div>
      </Container>
    </>
  );
}
