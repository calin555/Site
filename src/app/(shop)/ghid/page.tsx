import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Wrench, Calculator, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { GUIDE_SECTIONS } from "@/lib/seo/guide-links";

export const metadata: Metadata = buildPageMetadata({
  title: "Ghiduri stații încărcare EV — AC, DC, instalare, finanțări",
  description:
    "Index ghiduri ChargePro: alegere stație, AC vs DC, 7–22 kW, instalare ANRE, ElectricUP, AFM, flote, hoteluri. Conținut existent extins, fără duplicare.",
  path: "/ghid",
  keywords: [
    "ghid stații încărcare EV",
    "AC vs DC",
    "instalare wallbox",
    "ElectricUP",
    "finanțare stații EV",
  ],
});

const TYPE_ICON = {
  article: BookOpen,
  tool: Calculator,
  catalog: Wrench,
  page: FileText,
} as const;

export default function GhidPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", path: "/" },
          { name: "Ghiduri", path: "/ghid" },
        ]}
      />

      <PageHeader
        title="Ghiduri stații de încărcare EV"
        description="Resurse tehnice și comerciale pentru alegerea, instalarea și finanțarea infrastructurii de încărcare — legături către articole și instrumente existente."
      />

      <Container className="py-8">
        <Breadcrumbs items={[{ label: "Ghiduri" }]} className="mb-10" />

        <div className="space-y-12">
          {GUIDE_SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-bold text-surface-900">
                {section.title}
              </h2>
              <p className="mt-2 max-w-3xl text-surface-600">
                {section.description}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {section.links.map((link) => {
                  const Icon = TYPE_ICON[link.type];
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-start gap-3 rounded-xl border border-surface-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/50"
                      >
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                        <span className="min-w-0 flex-1">
                          <span className="font-semibold text-surface-900 group-hover:text-brand-700">
                            {link.title}
                          </span>
                          {link.description ? (
                            <span className="mt-1 block text-sm text-surface-500">
                              {link.description}
                            </span>
                          ) : null}
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-surface-300 group-hover:text-brand-600" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
