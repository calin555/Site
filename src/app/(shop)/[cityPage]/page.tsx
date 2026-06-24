import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Phone, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { LocalCitiesGrid } from "@/components/seo/LocalCitiesGrid";
import {
  buildBreadcrumbSchema,
  buildCityLocalBusinessSchema,
  buildFaqPageSchema,
} from "@/lib/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  faqToHtml,
  internalLinksBlock,
  sectionsToHtml,
} from "@/lib/seo/content-utils";
import { getCityPageBySlug, getAllCityPages } from "@/lib/seo/local/city-pages";
import { isLocalCitySlug } from "@/lib/seo/local/types";

interface CityLandingPageProps {
  params: Promise<{ cityPage: string }>;
}

export function generateStaticParams() {
  return getAllCityPages().map((city) => ({ cityPage: city.slug }));
}

export async function generateMetadata({
  params,
}: CityLandingPageProps): Promise<Metadata> {
  const { cityPage } = await params;
  if (!isLocalCitySlug(cityPage)) return { title: "Pagină negăsită" };
  const city = getCityPageBySlug(cityPage);
  if (!city) return { title: "Pagină negăsită" };

  return buildPageMetadata({
    title: city.metaTitle,
    description: city.metaDescription,
    path: `/${city.slug}`,
    keywords: city.keywords,
  });
}

export default async function CityLandingPage({ params }: CityLandingPageProps) {
  const { cityPage } = await params;
  if (!isLocalCitySlug(cityPage)) notFound();

  const city = getCityPageBySlug(cityPage);
  if (!city) notFound();

  const bodyHtml = [
    sectionsToHtml(city.sections),
    `<h2>Instalare stații de încărcare EV în ${city.cityName}</h2>`,
    sectionsToHtml(city.installationSection),
    `<h2>Avantajele încărcării electrice în ${city.cityName}</h2>`,
    sectionsToHtml(city.benefitsSection),
    internalLinksBlock([
      ...city.relatedProductLinks,
      { href: "/blog", label: "Ghiduri și articole despre mobilitate electrică" },
      { href: "/contact", label: "Solicită ofertă personalizată" },
      { href: "/tools/recomandare-statie", label: "Calculator recomandare stație EV" },
    ]),
    faqToHtml(city.faq),
  ].join("\n\n");

  return (
    <>
      <JsonLd
        data={[
          buildCityLocalBusinessSchema(city),
          buildFaqPageSchema(city.faq),
          buildBreadcrumbSchema([
            { name: "Acasă", path: "/" },
            { name: "Stații încărcare local", path: "/statii-incarcare-bucuresti" },
            { name: city.cityName, path: `/${city.slug}` },
          ]),
        ]}
      />
      <PageHeader
        title={city.h1}
        description={city.intro}
      />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Acasă", href: "/" },
            { label: `Stații încărcare ${city.cityName}` },
          ]}
          className="mb-8"
        />

        <div className="grid gap-10 lg:grid-cols-3">
          <article className="blog-content lg:col-span-2">
            <div
              className="prose prose-surface max-w-none"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </article>

          <aside className="space-y-6">
            <Card padding="lg" className="sticky top-24">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <Zap className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-surface-900">
                Ofertă stație EV în {city.cityName}
              </h2>
              <p className="mt-2 text-sm text-surface-600">
                Consultanță gratuită, dimensionare tehnică și instalare autorizată ANRE
                pentru {city.cityName} și {city.county}.
              </p>
              <div className="mt-6 space-y-3">
                <Link
                  href={`/contact?oras=${encodeURIComponent(city.cityName)}`}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 text-base font-semibold text-white shadow-sm shadow-brand-600/20 transition-colors hover:bg-brand-700"
                >
                  Solicită ofertă
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/produse/categorie/statii-ac"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl border-2 border-surface-200 bg-white text-sm font-semibold text-surface-900 transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  Vezi stații AC
                </Link>
                <Link
                  href="/produse/categorie/statii-dc"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl border-2 border-surface-200 bg-white text-sm font-semibold text-surface-900 transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  Vezi stații DC
                </Link>
              </div>
            </Card>

            <Card padding="md">
              <h3 className="font-semibold text-surface-900">Zone acoperite</h3>
              <p className="mt-2 flex items-start gap-2 text-sm text-surface-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                {city.cityName}, {city.county} și localități limitrofe
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm text-surface-600">
                <Phone className="h-4 w-4 text-brand-600" />
                Suport tehnic dedicat
              </p>
            </Card>
          </aside>
        </div>

        <div className="mt-16">
          <FaqSection
            title={`Întrebări frecvente — stații EV ${city.cityName}`}
            items={city.faq}
          />
        </div>

        <div className="mt-16">
          <LocalCitiesGrid
            title="Stații de încărcare EV în alte orașe"
            excludeSlug={city.slug}
          />
        </div>
      </Container>
    </>
  );
}
