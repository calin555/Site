import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Car, Gauge, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { LocalCitiesGrid } from "@/components/seo/LocalCitiesGrid";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getCommercialLandingsBySilo,
  getAllCommercialLandings,
} from "@/lib/seo/commercial/registry";
import { getHighPriorityTargets } from "@/lib/seo/commercial/keyword-strategy";

export const metadata: Metadata = buildPageMetadata({
  title: "Stații încărcare EV — AC, DC, wallbox, puteri, mărci auto",
  description:
    "Ghid complet stații încărcare vehicule electrice România: AC, DC rapid, 7–120 kW, Tesla, Dacia Spring, firmă, hotel, flotă. Catalog, instalare ANRE, oferte ChargePro.",
  path: "/statii-incarcare",
  keywords: [
    "stații încărcare EV",
    "stație încărcare AC",
    "stație încărcare DC",
    "wallbox România",
    "stație încărcare Tesla",
  ],
});

const SILO_CONFIG = [
  {
    id: "types" as const,
    title: "Tipuri de stații",
    icon: Zap,
    description: "AC, DC rapid, wallbox, monofazat, trifazat",
  },
  {
    id: "power" as const,
    title: "Putere (kW)",
    icon: Gauge,
    description: "7, 11, 22, 30, 60, 120 kW",
  },
  {
    id: "vehicles" as const,
    title: "Mărci auto",
    icon: Car,
    description: "Tesla, Dacia Spring, BMW, BYD, VW și altele",
  },
  {
    id: "use-cases" as const,
    title: "Utilizare",
    icon: Building2,
    description: "Acasă, firmă, hotel, pensiune, bloc, flotă",
  },
];

export default function StatiiIncarcareHubPage() {
  const total = getAllCommercialLandings().length;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", path: "/" },
          { name: "Stații încărcare", path: "/statii-incarcare" },
        ]}
      />

      <PageHeader
        title="Stații de încărcare vehicule electrice"
        description={`Arhitectură SEO completă — ${total} landing pages comerciale pentru AC, DC, puteri kW, mărci auto și aplicații. Fiecare pagină răspunde unei căutări Google specifice.`}
      />

      <Container className="py-8">
        <Breadcrumbs items={[{ label: "Stații încărcare" }]} className="mb-10" />

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-surface-900">
            Prioritate SEO — intenție comercială
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {getHighPriorityTargets().map((t) => (
              <li key={t.slug}>
                <Link
                  href={t.url}
                  className="flex h-full flex-col rounded-xl border-2 border-brand-200 bg-white p-4 transition-all hover:border-brand-400 hover:shadow-md"
                >
                  <span className="text-xs font-semibold uppercase text-brand-600">
                    High priority
                  </span>
                  <span className="mt-1 font-semibold text-surface-900">
                    {t.primaryKeyword}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mb-12 rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-surface-900">Structură siloz</h2>
          <pre className="mt-4 overflow-x-auto text-xs leading-relaxed text-surface-700 sm:text-sm">
{`Stații încărcare
├── Stații AC (7–22 kW)
├── Stații DC (30–120 kW)
├── După marcă (Tesla, Dacia, BMW…)
├── După utilizare (acasă, firmă, hotel…)
└── Ghiduri → /ghid`}
          </pre>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/produse"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Catalog produse
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/ghid"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Ghiduri tehnice
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="space-y-14">
          {SILO_CONFIG.map(({ id, title, icon: Icon, description }) => {
            const pages = getCommercialLandingsBySilo(id);
            return (
              <section key={id}>
                <div className="mb-6 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-surface-900">{title}</h2>
                    <p className="text-sm text-surface-500">{description}</p>
                  </div>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pages.map((page) => (
                    <li key={page.slug}>
                      <Link
                        href={`/${page.slug}`}
                        className="group flex h-full flex-col rounded-xl border border-surface-200 bg-white p-4 transition-all hover:border-brand-300 hover:shadow-md"
                      >
                        <span className="font-semibold text-surface-900 group-hover:text-brand-700">
                          {page.primaryKeyword}
                        </span>
                        <span className="mt-1 line-clamp-2 text-sm text-surface-500">
                          {page.metaDescription}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-16">
          <LocalCitiesGrid title="Stații încărcare EV pe orașe" />
        </div>
      </Container>
    </>
  );
}
