import type { CatalogProduct } from "@/types/catalog";
import type { RecommendationInput, RecommendationResult } from "@/types/tools";

function connectorMatch(product: CatalogProduct, connector: string): boolean {
  if (product.connectorTypes.length === 0) return true;
  return product.connectorTypes.some(
    (c) => c.toLowerCase().includes(connector.toLowerCase().replace(" ", ""))
      || connector.toLowerCase().includes(c.toLowerCase().replace(" ", ""))
  );
}

function recommendPowerKw(input: RecommendationInput): number {
  const dailyKwh = (input.dailyKm * 18) / 100;

  if (input.useCase === "public") return 60;
  if (input.useCase === "fleet") return input.phases === "THREE" ? 22 : 11;
  if (input.useCase === "business") return input.phases === "THREE" ? 22 : 11;

  if (input.phases === "SINGLE") {
    if (input.availableAmps >= 32 && dailyKwh > 15) return 7.4;
    return 7.4;
  }

  if (dailyKwh > 25) return 22;
  if (dailyKwh > 12) return 11;
  return 7.4;
}

function scoreProduct(
  product: CatalogProduct,
  input: RecommendationInput,
  targetPower: number
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (product.categorySlug === "accesorii" || product.categorySlug === "smart-ocpp") {
    return { score: 0, reasons: [] };
  }

  if (input.useCase === "public" && product.categorySlug !== "statii-dc") {
    return { score: 0, reasons: [] };
  }
  if (input.useCase !== "public" && product.categorySlug === "statii-dc" && input.useCase === "home") {
    return { score: 0, reasons: [] };
  }

  const powerDiff = Math.abs(product.powerKw - targetPower);
  if (powerDiff === 0) {
    score += 30;
    reasons.push(`Putere ideală (${product.powerKw} kW)`);
  } else if (powerDiff <= 3) {
    score += 20;
    reasons.push(`Putere apropiată (${product.powerKw} kW)`);
  } else if (powerDiff <= 7) {
    score += 10;
  }

  if (product.phases === input.phases) {
    score += 20;
    reasons.push(input.phases === "SINGLE" ? "Monofazat — compatibil" : "Trifazat — compatibil");
  } else if (input.phases === "THREE" && product.phases === "SINGLE") {
    score += 5;
  }

  if (connectorMatch(product, input.connector)) {
    score += 15;
    reasons.push(`Conector ${input.connector}`);
  }

  if (product.price <= input.budgetMax) {
    score += 15;
    reasons.push("În buget");
  } else {
    score -= 10;
  }

  if (input.needsOcpp && product.categorySlug === "smart-ocpp") {
    score += 10;
    reasons.push("Modul OCPP disponibil");
  }

  if (product.isFeatured) score += 5;
  if (product.stock > 0) score += 5;

  if (input.useCase === "fleet" && product.powerKw >= 11) {
    score += 10;
    reasons.push("Potrivit pentru flote");
  }

  return { score, reasons };
}

export function getChargerRecommendations(
  input: RecommendationInput,
  catalogProducts: CatalogProduct[]
): RecommendationResult {
  const recommendedPowerKw = recommendPowerKw(input);
  const dailyEnergyKwh = Math.round(((input.dailyKm * 18) / 100) * 10) / 10;
  const estimatedChargeHours = Math.ceil(dailyEnergyKwh / recommendedPowerKw);

  const products = catalogProducts
    .map((product) => {
      const { score, reasons } = scoreProduct(product, input, recommendedPowerKw);
      return { ...product, score, matchReasons: reasons };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const tips: string[] = [];
  if (input.phases === "SINGLE" && recommendedPowerKw > 7.4) {
    tips.push("Pentru peste 7.4 kW este necesară racordare trifazată — verificați branșamentul.");
  }
  if (input.dailyKm > 80) {
    tips.push("Rulaj ridicat — considerați stație 11–22 kW sau încărcare rapidă DC.");
  }
  if (input.needsOcpp) {
    tips.push("Pentru management centralizat, alegeți stații cu OCPP sau adăugați SmartBox Gateway.");
  }
  if (input.outdoorInstall) {
    tips.push("Pentru exterior, verificați gradul IP (minimum IP54 recomandat).");
  }

  return {
    recommendedPowerKw,
    dailyEnergyKwh,
    estimatedChargeHours,
    products,
    tips,
  };
}
