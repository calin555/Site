import type { CatalogProduct } from "@/types/catalog";
import { calculateChargingTime } from "@/lib/tools/calculators";
import { getRelatedVehicles } from "@/lib/compatibility/vehicles";
import { buildVehicleFaq } from "@/lib/compatibility/content";
import type {
  CompatibilityBadge,
  CompatibilityMatch,
  EvVehicle,
  MatchedProduct,
} from "@/lib/compatibility/types";

function connectorMatch(product: CatalogProduct, connector: string): boolean {
  if (product.connectorTypes.length === 0) return false;
  const normalized = connector.toLowerCase().replace(/\s+/g, "");
  return product.connectorTypes.some((c) => {
    const pc = c.toLowerCase().replace(/\s+/g, "");
    return pc.includes(normalized) || normalized.includes(pc);
  });
}

function isAcStation(product: CatalogProduct): boolean {
  return (
    product.categorySlug === "statii-ac" ||
    (product.categorySlug === "smart-ocpp" &&
      product.powerKw > 0 &&
      connectorMatch(product, "Type 2"))
  );
}

function isDcStation(product: CatalogProduct): boolean {
  return product.categorySlug === "statii-dc";
}

function isAccessory(product: CatalogProduct): boolean {
  return product.categorySlug === "accesorii";
}

function scoreAcStation(
  product: CatalogProduct,
  vehicle: EvVehicle
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (!connectorMatch(product, vehicle.acConnector)) {
    return { score: 0, reasons: [] };
  }

  if (product.powerKw <= 0) return { score: 0, reasons: [] };

  score += 30;
  reasons.push(`Conector ${vehicle.acConnector} compatibil`);

  const effectiveMax = Math.min(product.powerKw, vehicle.acMaxKw);
  const powerDiff = Math.abs(effectiveMax - vehicle.recommendedHomeChargerKw);

  if (powerDiff < 0.5) {
    score += 35;
    reasons.push(`Putere ideală ${product.powerKw} kW`);
  } else if (powerDiff <= 3.6) {
    score += 22;
    reasons.push(`Putere apropiată ${product.powerKw} kW`);
  } else if (product.powerKw <= vehicle.acMaxKw) {
    score += 12;
    reasons.push(`Compatibil la ${product.powerKw} kW AC`);
  } else {
    score += 5;
    reasons.push("Stație mai puternică — vehiculul limitează viteza");
  }

  if (product.phases === vehicle.phases) {
    score += 15;
    reasons.push(
      vehicle.phases === "SINGLE" ? "Monofazat — potrivit" : "Trifazat — potrivit"
    );
  } else if (vehicle.phases === "THREE" && product.phases === "SINGLE") {
    score += 5;
    reasons.push("Monofazat pe rețea trifazată");
  }

  if (product.stock > 0) score += 5;
  if (product.isFeatured) score += 3;

  return { score, reasons };
}

function scoreDcStation(
  product: CatalogProduct,
  vehicle: EvVehicle
): { score: number; reasons: string[] } {
  if (!connectorMatch(product, vehicle.dcConnector)) {
    return { score: 0, reasons: [] };
  }

  const reasons: string[] = [
    `DC ${vehicle.dcConnector} — până la ${vehicle.dcMaxKw} kW vehicul`,
  ];
  let score = 25;

  if (product.powerKw <= vehicle.dcMaxKw) {
    score += 20;
    reasons.push(`Stație ${product.powerKw} kW DC`);
  } else {
    score += 8;
    reasons.push("Stație DC de mare putere");
  }

  if (product.stock > 0) score += 5;

  return { score, reasons };
}

function scoreAccessory(
  product: CatalogProduct,
  vehicle: EvVehicle
): { score: number; reasons: string[] } {
  const name = product.name.toLowerCase();
  const slug = product.slug.toLowerCase();
  let score = 0;
  const reasons: string[] = [];

  if (name.includes("type 2") || slug.includes("type2")) {
    if (vehicle.acConnector === "Type 2") {
      score += 30;
      reasons.push("Cablu Type 2 pentru vehiculul tău");
    }
  }

  if (name.includes("rcbo") || name.includes("protectie")) {
    score += 25;
    reasons.push("Protecție obligatorie la instalare wallbox");
  }

  if (name.includes("suport") || name.includes("perete")) {
    score += 20;
    reasons.push("Montaj wallbox pe perete");
  }

  if (
    vehicle.brand === "Tesla" &&
    (name.includes("tesla") || slug.includes("tesla"))
  ) {
    score += 35;
    reasons.push("Adaptor dedicat Tesla");
  }

  if (score === 0 && product.connectorTypes.length === 0) {
    score += 10;
    reasons.push("Accesoriu util instalare EV");
  }

  return { score, reasons };
}

function assignBadges(
  matches: MatchedProduct[],
  products: CatalogProduct[],
  vehicle: EvVehicle
): MatchedProduct[] {
  const byId = new Map(products.map((p) => [p.id, p]));

  let bestValueId: string | null = null;
  let lowestPrice = Infinity;

  const scored = matches.map((match) => {
    const product = byId.get(match.productId);
    if (!product) return match;

    const badges: CompatibilityBadge[] = [];

    if (
      isAcStation(product) &&
      Math.abs(product.powerKw - vehicle.recommendedHomeChargerKw) < 0.5 &&
      connectorMatch(product, vehicle.acConnector)
    ) {
      badges.push("perfect_match");
    }

    if (match.matchScore >= 55) badges.push("recommended");
    if (isDcStation(product)) badges.push("fast_charging");
    if (
      (isAcStation(product) || isDcStation(product)) &&
      product.powerKw >= 11
    ) {
      badges.push("professional_installation");
    }

    if (
      isAcStation(product) &&
      product.price < lowestPrice &&
      match.matchScore >= 40
    ) {
      lowestPrice = product.price;
      bestValueId = product.id;
    }

    return { ...match, badges };
  });

  return scored.map((match) => {
    if (match.productId === bestValueId) {
      return {
        ...match,
        badges: [...new Set([...match.badges, "best_value" as CompatibilityBadge])],
      };
    }
    return match;
  });
}

export function matchProductsToVehicle(
  vehicle: EvVehicle,
  catalogProducts: CatalogProduct[]
): CompatibilityMatch {
  const stations: MatchedProduct[] = [];
  const accessories: MatchedProduct[] = [];

  for (const product of catalogProducts) {
    let result: { score: number; reasons: string[] } = { score: 0, reasons: [] };

    if (isAcStation(product) || isDcStation(product)) {
      const ac = isAcStation(product)
        ? scoreAcStation(product, vehicle)
        : { score: 0, reasons: [] };
      const dc = isDcStation(product)
        ? scoreDcStation(product, vehicle)
        : { score: 0, reasons: [] };
      result =
        dc.score > ac.score
          ? dc
          : ac.score > 0
            ? ac
            : { score: 0, reasons: [] };
    } else if (isAccessory(product)) {
      result = scoreAccessory(product, vehicle);
    }

    if (result.score <= 0) continue;

    const entry: MatchedProduct = {
      productId: product.id,
      badges: [],
      matchScore: result.score,
      matchReasons: result.reasons,
    };

    if (isAccessory(product)) {
      accessories.push(entry);
    } else {
      stations.push(entry);
    }
  }

  stations.sort((a, b) => b.matchScore - a.matchScore);
  accessories.sort((a, b) => b.matchScore - a.matchScore);

  const badgedStations = assignBadges(stations, catalogProducts, vehicle);
  const badgedAccessories = accessories.slice(0, 6);

  const homeTime = calculateChargingTime({
    batteryKwh: vehicle.batteryKwh,
    fromSocPercent: 20,
    toSocPercent: 80,
    chargerPowerKw: vehicle.recommendedHomeChargerKw,
    efficiencyPercent: 92,
  });

  const fastTime = calculateChargingTime({
    batteryKwh: vehicle.batteryKwh,
    fromSocPercent: 10,
    toSocPercent: 80,
    chargerPowerKw: Math.min(vehicle.dcMaxKw, 150),
    efficiencyPercent: 95,
  });

  return {
    vehicle,
    stations: badgedStations,
    accessories: badgedAccessories,
    chargingTimeHome: homeTime.hoursFormatted,
    chargingTimeFast: fastTime.hoursFormatted,
    relatedVehicles: getRelatedVehicles(vehicle),
    faq: buildVehicleFaq(vehicle),
  };
}

export function resolveMatchedProducts(
  matches: MatchedProduct[],
  catalogProducts: CatalogProduct[]
): Array<CatalogProduct & { match: MatchedProduct }> {
  const byId = new Map(catalogProducts.map((p) => [p.id, p]));
  return matches
    .map((match) => {
      const product = byId.get(match.productId);
      if (!product) return null;
      return { ...product, match };
    })
    .filter((item): item is CatalogProduct & { match: MatchedProduct } =>
      Boolean(item)
    );
}
