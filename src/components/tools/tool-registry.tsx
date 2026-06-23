import type { ReactNode } from "react";
import { getAllCatalogProducts } from "@/lib/services/catalog.service";
import { RecommendationWizard } from "@/components/tools/RecommendationWizard";
import { AfmCalculator } from "@/components/tools/AfmCalculator";
import { ElectricUpCalculator } from "@/components/tools/ElectricUpCalculator";
import { SolarEvCalculator } from "@/components/tools/SolarEvCalculator";
import { RoiCalculator } from "@/components/tools/RoiCalculator";
import { QuoteGenerator } from "@/components/tools/QuoteGenerator";
import { PdfOfferGenerator } from "@/components/tools/PdfOfferGenerator";
import { InstallerMarketplace } from "@/components/tools/InstallerMarketplace";
import { TechnicalCompareWidget } from "@/components/tools/TechnicalCompareWidget";

export async function renderTool(slug: string) {
  if (slug === "recomandare-statie") {
    const catalogProducts = await getAllCatalogProducts();
    return <RecommendationWizard catalogProducts={catalogProducts} />;
  }

  if (slug === "generator-oferta") {
    const catalogProducts = await getAllCatalogProducts();
    const stationProducts = catalogProducts.filter(
      (p) => p.categorySlug === "statii-ac" || p.categorySlug === "statii-dc"
    );
    return <QuoteGenerator stationProducts={stationProducts} />;
  }

  const components: Record<string, ReactNode> = {
    "comparator-tehnic": <TechnicalCompareWidget />,
    "calculator-afm": <AfmCalculator />,
    "calculator-electric-up": <ElectricUpCalculator />,
    "calculator-solar-ev": <SolarEvCalculator />,
    "calculator-roi": <RoiCalculator />,
    "oferta-pdf": <PdfOfferGenerator />,
    instalatori: <InstallerMarketplace />,
  };

  return components[slug] ?? null;
}
