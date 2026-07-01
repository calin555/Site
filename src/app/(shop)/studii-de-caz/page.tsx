import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { CaseStudyCard } from "@/components/content/CaseStudyCard";

export const metadata: Metadata = buildPageMetadata({
  title: "Studii de caz — stații încărcare firmă, hotel, bloc",
  description:
    "Studii de caz EV: flote, hoteluri, condominiu. Probleme, soluții, metrici ROI. ChargePro România.",
  path: "/studii-de-caz",
  keywords: ["studiu de caz stație încărcare", "EV firmă", "hotel EV", "bloc EV"],
});

export default function StudiiDeCazPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", path: "/" },
          { name: "Studii de caz", path: "/studii-de-caz" },
        ]}
      />
      <PageHeader
        title="Studii de caz"
        description="Cum au implementat firme, hoteluri și asociații de proprietari infrastructura EV — cu cifre, provocări și lecții învățate."
      />
      <Container className="py-8">
        <Breadcrumbs items={[{ label: "Studii de caz" }]} className="mb-8" />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/statie-incarcare-firma"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Stații firmă
          </Link>
          <Link
            href="/statie-incarcare-hotel"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Stații hotel
          </Link>
          <Link
            href="/statie-incarcare-bloc"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Stații bloc
          </Link>
          <Link
            href="/proiecte-realizate"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
          >
            Proiecte realizate
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </>
  );
}
