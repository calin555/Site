import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { EV_FAQ_ITEMS } from "@/lib/seo/faq-content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildFaqPageSchema, buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = buildPageMetadata({
  title: "Întrebări frecvente — stații încărcare EV",
  description:
    "Răspunsuri despre cost încărcare EV, timp de încărcare, conectori Type 2 și CCS2, diferența stații AC vs DC și rețea încărcare electrică în România.",
  path: "/faq",
  keywords: [
    "stații încărcare EV",
    "cost încărcare mașină electrică",
    "conectori EV Type 2 CCS2",
    "stații AC vs DC",
    "încărcare auto electrică România",
  ],
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          buildFaqPageSchema(EV_FAQ_ITEMS),
          buildBreadcrumbSchema([
            { name: "Acasă", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ]}
      />

      <PageHeader
        title="Întrebări frecvente"
        description="Tot ce trebuie să știi despre stații de încărcare EV, costuri, conectori și instalare în România."
      />

      <Container className="py-8">
        <Breadcrumbs
          items={[{ label: "FAQ" }]}
          className="mb-10"
        />

        <FaqSection items={EV_FAQ_ITEMS} id="faq-page" />

        <p className="mx-auto mt-8 max-w-3xl text-center text-surface-600">
          Cauți mai multe răspunsuri? Explorează{" "}
          <Link href="/baza-de-cunoastinte" className="font-semibold text-brand-600 hover:text-brand-700">
            baza de cunoștințe EV (100+ întrebări)
          </Link>
          {" "}sau{" "}
          <Link href="/ghid" className="font-semibold text-brand-600 hover:text-brand-700">
            indexul de ghiduri
          </Link>
          .
        </p>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
          <h2 className="text-xl font-bold text-surface-900">
            Ai nevoie de o stație de încărcare EV?
          </h2>
          <p className="mt-2 text-surface-600">
            Consultanță gratuită pentru alegerea stației AC sau DC potrivite — acasă, birou sau flotă.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/produse">
              <Button>
                Vezi stații încărcare
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Contactează-ne</Button>
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
