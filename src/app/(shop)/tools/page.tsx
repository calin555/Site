import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ToolsGrid } from "@/components/tools/ToolsGrid";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Instrumente EV — calculatoare stații încărcare",
  description:
    "Calculatoare gratuite pentru stații încărcare EV: AFM, Electric Up, ROI, recomandare putere AC/DC și comparator tehnic OCPP.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        title="Instrumente EV"
        description="Calculatoare gratuite, wizard de recomandare și generatoare de oferte pentru proiectul tău de încărcare electrică."
      />
      <Container className="py-8">
        <Breadcrumbs items={[{ label: "Instrumente" }]} className="mb-8" />
        <ToolsGrid />
      </Container>
    </>
  );
}
