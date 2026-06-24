import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { legalPaths } from "@/config/legal";
import { legalUpdatedAt, privacySections } from "@/lib/legal/content";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Politica de confidențialitate",
  description:
    "Politica de confidențialitate ChargePro — ce date colectăm, cum le folosim și drepturile tale.",
  path: legalPaths.privacy,
});

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Politica de confidențialitate"
      description="Cum prelucrăm datele personale în magazinul online ChargePro."
      updatedAt={legalUpdatedAt}
      sections={privacySections}
    />
  );
}
