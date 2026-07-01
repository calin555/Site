import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildFaqPageSchema } from "@/lib/seo/structured-data";
import {
  KNOWLEDGE_CATEGORIES,
  getAllKnowledgeFaqItems,
  getKnowledgeFaqCount,
} from "@/lib/seo/knowledge-base";
import { EV_FAQ_ITEMS } from "@/lib/seo/faq-content";

export const metadata: Metadata = buildPageMetadata({
  title: "Bază de cunoștințe EV — întrebări și răspunsuri",
  description:
    "Peste 100 de întrebări și răspunsuri despre stații încărcare EV: puteri kW, branduri, aplicații, finanțări, ANRE, flote, vehicule electrice România.",
  path: "/baza-de-cunoastinte",
  keywords: [
    "bază de cunoștințe EV",
    "întrebări stații încărcare",
    "wallbox FAQ",
    "încărcare mașini electrice",
  ],
});

/** Schema FAQ — primele 40 pentru rich results (pagina afișează tot conținutul). */
const FAQ_SCHEMA_ITEMS = [
  ...EV_FAQ_ITEMS,
  ...getAllKnowledgeFaqItems().slice(0, 32),
];

export default function KnowledgeBasePage() {
  const total = getKnowledgeFaqCount() + EV_FAQ_ITEMS.length;

  return (
    <>
      <JsonLd data={buildFaqPageSchema(FAQ_SCHEMA_ITEMS)} />
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", path: "/" },
          { name: "Bază de cunoștințe", path: "/baza-de-cunoastinte" },
        ]}
      />

      <PageHeader
        title="Bază de cunoștințe EV"
        description={`${total}+ întrebări și răspunsuri factuale despre stații de încărcare, instalare, finanțări și vehicule electrice în România.`}
      />

      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "FAQ", href: "/faq" },
            { label: "Bază de cunoștințe" },
          ]}
          className="mb-8"
        />

        <p className="mb-10 max-w-3xl text-surface-600">
          Conținut structurat pentru motoare de căutare și asistenți AI (GEO).
          Pentre ghiduri detaliate, vezi{" "}
          <Link href="/ghid" className="font-medium text-brand-600 hover:underline">
            indexul de ghiduri
          </Link>
          .
        </p>

        {KNOWLEDGE_CATEGORIES.map((category) => (
          <div key={category.id} id={category.id} className="mb-14 scroll-mt-24">
            <FaqSection
              items={category.items}
              id={`kb-${category.id}`}
              title={category.title}
              subtitle={category.description}
              className="mt-0"
            />
          </div>
        ))}
      </Container>
    </>
  );
}
