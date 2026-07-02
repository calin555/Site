import type { Metadata } from "next";
import Link from "next/link";
import { Car, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { EnergyField } from "@/components/shared/EnergyField";
import { CompatibilitySearch } from "@/components/compatibility/CompatibilitySearch";
import { VehicleSilhouette } from "@/components/compatibility/VehicleSilhouette";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getVehicleBrands, getVehiclesByBrand } from "@/lib/compatibility/vehicles";

export const metadata: Metadata = buildPageMetadata({
  title: "Compatibilitate EV — găsește stația potrivită mașinii tale",
  description:
    "Caută vehiculul electric și vezi instant stațiile de încărcare compatibile din catalogul ChargePro. Tesla, BMW, VW, Hyundai, Dacia și multe altele.",
  path: "/compatibilitate",
  keywords: [
    "compatibilitate EV",
    "stație încărcare Tesla",
    "wallbox BMW",
    "încărcător electric compatibil",
    "finder stație încărcare",
  ],
});

const POPULAR_BRANDS = ["Tesla", "BMW", "Volkswagen", "Hyundai", "Dacia", "Mercedes"];

export default function CompatibilityHubPage() {
  const brands = getVehicleBrands();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", path: "/" },
          { name: "Compatibilitate EV", path: "/compatibilitate" },
        ]}
      />

      <div className="relative overflow-hidden">
        <EnergyField variant="light" particles circuits />
        <PageHeader
          title="Compatibilitate EV"
          description="Selectează vehiculul tău electric și vezi doar stațiile de încărcare compatibile din magazinul nostru — filtrate automat după conector, putere și fază."
        >
          <div className="mt-6 w-full max-w-2xl">
            <CompatibilitySearch autoFocus size="large" />
          </div>
        </PageHeader>
      </div>

      <Container className="py-12">
        <Breadcrumbs
          items={[
            { label: "Acasă", href: "/" },
            { label: "Compatibilitate EV", href: "/compatibilitate" },
          ]}
        />

        <section className="mt-10">
          <div className="connector-animation mx-auto max-w-md rounded-3xl border border-brand-200/50 bg-gradient-to-b from-brand-50/80 to-white p-8">
            <VehicleSilhouette className="mx-auto h-24 w-72 text-brand-400" />
            <p className="mt-4 text-center text-sm text-surface-600">
              Caută marca sau modelul — sugestii instant în timp ce tastezi
            </p>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-surface-900">
                Mărci populare
              </h2>
              <p className="mt-2 text-surface-600">
                {brands.length} mărci · peste 30 de modele EV în baza noastră
              </p>
            </div>
            <Link
              href="/tools/recomandare-statie"
              className="hidden text-sm font-semibold text-brand-600 hover:text-brand-700 sm:inline-flex sm:items-center sm:gap-1"
            >
              <Zap className="h-4 w-4" />
              Wizard recomandare
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {POPULAR_BRANDS.map((brand) => {
              const models = getVehiclesByBrand(brand);
              return (
                <div
                  key={brand}
                  className="card-lift rounded-2xl border border-surface-200 bg-white p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Car className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-lg font-bold text-surface-900">
                      {brand}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {models.map((vehicle) => (
                      <li key={vehicle.slug}>
                        <Link
                          href={`/compatibilitate/${vehicle.slug}`}
                          className="block rounded-lg px-2 py-1.5 text-sm text-surface-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                        >
                          {vehicle.model}
                          <span className="ml-2 text-surface-400">
                            {vehicle.recommendedHomeChargerKw} kW
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </Container>
    </>
  );
}
