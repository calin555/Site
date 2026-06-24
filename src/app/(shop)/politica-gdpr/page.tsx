import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { legalPaths } from "@/config/legal";
import { gdprSections, legalUpdatedAt } from "@/lib/legal/content";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Informare GDPR",
  description:
    "Informare privind protecția datelor personale conform GDPR — drepturile tale și cum ne contactezi.",
  path: legalPaths.gdpr,
});

export default function GdprPage() {
  return (
    <LegalDocument
      title="Informare GDPR"
      description="Drepturile tale privind datele personale și modul de exercitare conform Regulamentului UE 2016/679."
      updatedAt={legalUpdatedAt}
      sections={gdprSections}
    />
  );
}
