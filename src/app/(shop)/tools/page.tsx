import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ToolsGrid } from "@/components/tools/ToolsGrid";

export const metadata: Metadata = {
  title: "Instrumente EV",
  description:
    "Calculatoare, wizard-uri și generatoare de oferte pentru stații de încărcare electrică — AFM, Electric Up, Solar+EV, ROI și marketplace instalatori.",
};

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
