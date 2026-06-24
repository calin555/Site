import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { legalPaths } from "@/config/legal";
import { legalUpdatedAt, termsSections } from "@/lib/legal/content";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Termeni și condiții",
  description:
    "Termenii și condițiile de utilizare a magazinului ChargePro — comenzi, livrare, garanție și dreptul de retragere.",
  path: legalPaths.terms,
});

export default function TermsPage() {
  return (
    <LegalDocument
      title="Termeni și condiții"
      description="Regulile de utilizare a site-ului și de achiziție a produselor ChargePro."
      updatedAt={legalUpdatedAt}
      sections={termsSections}
    />
  );
}
