import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { VehicleHero } from "@/components/compatibility/VehicleHero";
import { ChargingSpecsTable } from "@/components/compatibility/ChargingSpecsTable";
import { CompatibilityProductCard } from "@/components/compatibility/CompatibilityProductCard";
import { RelatedVehicles } from "@/components/compatibility/RelatedVehicles";
import { CompatibilitySearch } from "@/components/compatibility/CompatibilitySearch";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildFaqPageSchema } from "@/lib/seo/structured-data";
import {
  buildVehicleKeywords,
  buildVehicleMetaDescription,
  buildVehicleMetaTitle,
  buildChargingGuideParagraphs,
} from "@/lib/compatibility/content";
import {
  getAllVehicles,
  getVehicleBySlug,
} from "@/lib/compatibility/vehicles";
import {
  matchProductsToVehicle,
  resolveMatchedProducts,
} from "@/lib/compatibility/matcher";
import { getAllCatalogProducts } from "@/lib/services/catalog.service";

interface CompatibilityVehiclePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllVehicles().map((vehicle) => ({ slug: vehicle.slug }));
}

export async function generateMetadata({
  params,
}: CompatibilityVehiclePageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicul negăsit" };

  return buildPageMetadata({
    title: buildVehicleMetaTitle(vehicle),
    description: buildVehicleMetaDescription(vehicle),
    path: `/compatibilitate/${vehicle.slug}`,
    keywords: buildVehicleKeywords(vehicle),
    ogImage: vehicle.image,
  });
}

export default async function CompatibilityVehiclePage({
  params,
}: CompatibilityVehiclePageProps) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const catalogProducts = await getAllCatalogProducts();
  const match = matchProductsToVehicle(vehicle, catalogProducts);
  const stations = resolveMatchedProducts(match.stations, catalogProducts);
  const accessories = resolveMatchedProducts(match.accessories, catalogProducts);
  const guideParagraphs = buildChargingGuideParagraphs(vehicle);
  const vehicleLabel = `${vehicle.brand} ${vehicle.model}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", path: "/" },
          { name: "Compatibilitate EV", path: "/compatibilitate" },
          { name: vehicleLabel, path: `/compatibilitate/${vehicle.slug}` },
        ]}
      />
      <JsonLd
        data={buildFaqPageSchema(
          match.faq.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))
        )}
      />

      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Acasă", href: "/" },
            { label: "Compatibilitate EV", href: "/compatibilitate" },
            { label: vehicleLabel, href: `/compatibilitate/${vehicle.slug}` },
          ]}
        />

        <div className="mt-6 max-w-xl">
          <CompatibilitySearch />
        </div>

        <div className="mt-8">
          <VehicleHero
            vehicle={vehicle}
            chargingTimeHome={match.chargingTimeHome}
            chargingTimeFast={match.chargingTimeFast}
            stations={stations}
          />
        </div>

        <section className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-surface-900">
              Ghid încărcare {vehicleLabel}
            </h2>
            <div className="mt-4 space-y-4 text-surface-600">
              {guideParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
              <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              <div>
                <p className="font-semibold text-surface-900">
                  Recomandare instalare
                </p>
                <p className="mt-1 text-sm text-surface-600">
                  {vehicle.installationNote}
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Solicită consultanță instalare →
                </Link>
              </div>
            </div>
          </div>
          <ChargingSpecsTable
            vehicle={vehicle}
            chargingTimeHome={match.chargingTimeHome}
            chargingTimeFast={match.chargingTimeFast}
          />
        </section>

        <section id="produse-compatibile" className="mt-16 scroll-mt-24">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-surface-900 sm:text-3xl">
              Încărcătoare compatibile {vehicleLabel}
            </h2>
            <p className="mt-2 max-w-2xl text-surface-600">
              {stations.length > 0
                ? `${stations.length} produse din catalog sunt compatibile cu ${vehicleLabel} — filtrate după conector ${vehicle.acConnector}, putere și specificații tehnice.`
                : `Momentan nu avem stații listate pentru criteriile ${vehicleLabel}. Contactează-ne pentru recomandare personalizată.`}
            </p>
          </div>

          {stations.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stations.map((product) => (
                <CompatibilityProductCard
                  key={product.id}
                  product={product}
                  match={product.match}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-8 text-center">
              <p className="text-surface-600">
                Verificăm stocul pentru {vehicleLabel}. Între timp, folosește{" "}
                <Link href="/tools/recomandare-statie" className="text-brand-600">
                  wizard-ul de recomandare
                </Link>{" "}
                sau{" "}
                <Link href="/contact" className="text-brand-600">
                  contactează-ne
                </Link>
                .
              </p>
            </div>
          )}
        </section>

        {accessories.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-surface-900">
              Accesorii recomandate
            </h2>
            <p className="mt-2 text-surface-600">
              Cabluri, protecții și suporturi pentru instalarea stației{" "}
              {vehicleLabel}.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {accessories.map((product) => (
                <CompatibilityProductCard
                  key={product.id}
                  product={product}
                  match={product.match}
                />
              ))}
            </div>
          </section>
        )}

        <div className="mt-16">
          <RelatedVehicles
            vehicles={match.relatedVehicles}
            currentSlug={vehicle.slug}
          />
        </div>

        {vehicle.relatedLanding && (
          <section className="mt-12 rounded-2xl border border-surface-200 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-surface-900">
              Linkuri utile
            </h2>
            <ul className="mt-3 flex flex-wrap gap-4 text-sm">
              <li>
                <Link
                  href={vehicle.relatedLanding}
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Stație încărcare {vehicle.brand} →
                </Link>
              </li>
              <li>
                <Link
                  href="/produse/categorie/statii-ac"
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Toate stațiile AC →
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/calculator-timp-incarcare"
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Calculator timp încărcare →
                </Link>
              </li>
            </ul>
          </section>
        )}

        <FaqSection
          items={match.faq}
          title={`Întrebări despre încărcarea ${vehicleLabel}`}
          subtitle={`Răspunsuri despre conectori, putere AC/DC și stații compatibile ${vehicle.brand}.`}
          className="mt-16"
        />
      </Container>
    </>
  );
}
