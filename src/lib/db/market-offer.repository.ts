import type {
  ChargerTier,
  ChargerType,
  ConnectorType,
  MarketOfferRow,
  OcppVersion,
  PhaseType,
} from "@/types/database";
import { getSupabase } from "@/lib/supabase/server";
import { isDatabaseEnabled } from "@/lib/db/config";
import {
  buildSpecFingerprint,
  connectorFromDb,
  connectorToEnum,
  normalizeFromProduct,
  normalizeFromScraped,
  phaseFromDb,
  phaseToDb,
  powerToClass,
} from "@/lib/comparison/normalize";
import { ocppEnumToLabel, ocppLabelToEnum } from "@/lib/comparison/ocpp.extractor";
import { resolveOfferSource } from "@/lib/comparison/source-site";
import {
  COMPARISON_MARKET,
  detectMarketCountry,
  assertRomanianMarketOffer,
} from "@/lib/comparison/market-region";
import { verifySourceUrl } from "@/lib/comparison/url-verify";
import type { NormalizedChargerSpec, ScrapedOfferInput } from "@/types/comparison";
import { dbFindAllProducts } from "@/lib/db/product.repository";

function tierToDb(
  tier: "residential" | "commercial" | "enterprise"
): ChargerTier {
  const map = {
    residential: "RESIDENTIAL",
    commercial: "COMMERCIAL",
    enterprise: "ENTERPRISE",
  } as const;
  return map[tier];
}

function tierFromDb(tier: ChargerTier): "residential" | "commercial" | "enterprise" {
  return tier.toLowerCase() as "residential" | "commercial" | "enterprise";
}

function mountingToDb(value?: string): string | null {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v.includes("wall") || v.includes("perete")) return "WALL";
  if (v.includes("pedestal") || v.includes("stalp")) return "PEDESTAL";
  if (v.includes("floor") || v.includes("sol")) return "FLOOR";
  return null;
}

function mountingFromDb(value: string | null): string | undefined {
  if (!value) return undefined;
  const map: Record<string, string> = {
    WALL: "wall",
    PEDESTAL: "pedestal",
    FLOOR: "floor",
  };
  return map[value];
}

export function marketOfferToSpec(row: MarketOfferRow): NormalizedChargerSpec {
  const power_kw = Number(row.powerKw);
  return {
    power_kw,
    power_class: powerToClass(power_kw),
    phase: phaseFromDb(row.phase),
    current_amps: row.currentAmps ? Number(row.currentAmps) : undefined,
    connector: connectorFromDb(row.connectorTypes).split(", ")[0] ?? "Type 2",
    connectors: connectorFromDb(row.connectorTypes).split(", "),
    type: row.chargerType as "AC" | "DC",
    ocpp: ocppEnumToLabel(row.ocppVersion),
    load_balancing: row.loadBalancing,
    smart_charging: row.smartCharging,
    rfid_control: row.rfidControl,
    app_control: row.appControl,
    backend_connectivity: row.backendConnectivity,
    remote_management: row.remoteManagement,
    firmware_ota: row.firmwareOta,
    ip_rating: row.ipRating ?? undefined,
    mounting_type: mountingFromDb(row.mountingType),
    price: Number(row.price),
    currency: row.currency,
    tier: tierFromDb(row.tier),
    ocpp_confidence: row.ocppConfidence,
    ocpp_claim_suspicious: row.ocppClaimSuspicious,
  };
}

async function recordPriceHistory(
  offerId: string,
  price: number,
  currency: string
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("market_offer_price_history").insert({
    offerId,
    price,
    currency,
  });
  if (error) throw error;
}

export async function dbFindActiveMarketOffers(): Promise<
  Array<{
    id: string;
    spec: NormalizedChargerSpec;
    sourceSite: string;
    sourceUrl?: string;
    sourceLinkActive: boolean;
    isOwnSite: boolean;
  }>
> {
  if (!isDatabaseEnabled()) return [];

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("market_offers")
    .select("*")
    .eq("isActive", true)
    .eq("marketCountry", COMPARISON_MARKET)
    .eq("currency", "RON")
    .order("price", { ascending: true });

  if (error) throw error;

  return (data as MarketOfferRow[]).map((row) => {
    const source = resolveOfferSource(row.sourceUrl, row.sourceType);
    const sourceLinkActive =
      row.sourceType === "INTERNAL" || row.sourceUrlActive;
    return {
      id: row.id,
      spec: marketOfferToSpec(row),
      sourceSite: source.site,
      sourceUrl: sourceLinkActive ? source.url : undefined,
      sourceLinkActive,
      isOwnSite: row.sourceType === "INTERNAL",
    };
  });
}

export async function dbUpsertMarketOfferFromSpec(
  spec: NormalizedChargerSpec,
  meta: {
    productId?: string;
    sourceType?: "INTERNAL" | "SCRAPED" | "MANUAL";
    sourceUrl?: string;
    rawText?: string;
  } = {}
): Promise<string> {
  const sourceType = meta.sourceType ?? "MANUAL";
  const sourceUrl = meta.sourceUrl ?? null;
  const currency = spec.currency;

  assertRomanianMarketOffer(sourceUrl, sourceType, currency);
  const marketCountry = detectMarketCountry(sourceUrl, sourceType, currency)!;

  const fingerprint = buildSpecFingerprint({
    power_kw: spec.power_kw,
    phase: spec.phase,
    type: spec.type,
    connector: spec.connector,
    ocpp: spec.ocpp,
  });

  const connectors = spec.connectors.map((c) => connectorToEnum(c));

  let sourceUrlActive = sourceType === "INTERNAL";
  if (sourceType === "SCRAPED" && sourceUrl) {
    const check = await verifySourceUrl(sourceUrl);
    sourceUrlActive = check.ok;
  }

  const now = new Date().toISOString();
  const data = {
    specFingerprint: fingerprint,
    powerKw: spec.power_kw,
    phase: phaseToDb(spec.phase) as PhaseType,
    currentAmps: spec.current_amps ?? null,
    chargerType: spec.type as ChargerType,
    connectorTypes: connectors as ConnectorType[],
    ipRating: spec.ip_rating ?? null,
    mountingType: mountingToDb(spec.mounting_type),
    ocppVersion: ocppLabelToEnum(spec.ocpp) as OcppVersion,
    loadBalancing: spec.load_balancing,
    smartCharging: spec.smart_charging,
    rfidControl: spec.rfid_control,
    appControl: spec.app_control,
    backendConnectivity: spec.backend_connectivity,
    remoteManagement: spec.remote_management,
    firmwareOta: spec.firmware_ota,
    ocppConfidence: spec.ocpp_confidence,
    ocppClaimSuspicious: spec.ocpp_claim_suspicious,
    tier: tierToDb(spec.tier),
    price: spec.price,
    currency: spec.currency,
    marketCountry,
    rawText: meta.rawText ?? null,
    sourceType,
    sourceUrl,
    sourceUrlActive,
    sourceUrlCheckedAt: sourceUrl ? now : null,
    lastScrapedAt: sourceType === "SCRAPED" ? now : null,
    isActive: true,
    updatedAt: now,
  };

  const supabase = getSupabase();

  if (meta.productId) {
    const { data: existing, error: findError } = await supabase
      .from("market_offers")
      .select("*")
      .eq("productId", meta.productId)
      .maybeSingle();

    if (findError) throw findError;

    if (existing) {
      const priceChanged = Number(existing.price) !== spec.price;
      const { data: updated, error } = await supabase
        .from("market_offers")
        .update(data)
        .eq("id", existing.id)
        .select("id")
        .single();

      if (error) throw error;
      if (priceChanged) {
        await recordPriceHistory(updated.id, spec.price, spec.currency);
      }
      return updated.id;
    }

    const { data: created, error } = await supabase
      .from("market_offers")
      .insert({ ...data, productId: meta.productId, createdAt: now })
      .select("id")
      .single();

    if (error) throw error;
    await recordPriceHistory(created.id, spec.price, spec.currency);
    return created.id;
  }

  const { data: created, error } = await supabase
    .from("market_offers")
    .insert({ ...data, createdAt: now })
    .select("id")
    .single();

  if (error) throw error;
  await recordPriceHistory(created.id, spec.price, spec.currency);
  return created.id;
}

export async function dbSyncCatalogToMarketOffers(): Promise<number> {
  const products = await dbFindAllProducts(true);
  let count = 0;

  for (const product of products) {
    if (
      product.categorySlug !== "statii-ac" &&
      product.categorySlug !== "statii-dc"
    ) {
      continue;
    }

    const spec = normalizeFromProduct({
      id: product.id,
      powerKw: product.powerKw,
      phases: product.phases,
      connectorTypes: product.connectorTypes,
      price: product.price,
      description: product.description,
      shortDescription: product.shortDescription,
    });

    await dbUpsertMarketOfferFromSpec(spec, {
      productId: product.id,
      sourceType: "INTERNAL",
      sourceUrl: `/produse/${product.slug}`,
    });
    count += 1;
  }

  return count;
}

export async function dbSeedScrapedOffers(
  inputs: ScrapedOfferInput[]
): Promise<number> {
  let count = 0;
  for (const input of inputs) {
    try {
      const spec = normalizeFromScraped(input);
      await dbUpsertMarketOfferFromSpec(spec, {
        sourceType: "SCRAPED",
        sourceUrl: input.source_url,
        rawText: input.raw_text,
      });
      count += 1;
    } catch {
      // Skip offers outside Romanian market
    }
  }
  return count;
}

export async function dbRecomputeMarketClusters(): Promise<number> {
  if (!isDatabaseEnabled()) return 0;

  const supabase = getSupabase();
  const { data: offers, error } = await supabase
    .from("market_offers")
    .select("powerKw, ocppVersion, chargerType, price")
    .eq("isActive", true)
    .eq("marketCountry", COMPARISON_MARKET)
    .eq("currency", "RON");

  if (error) throw error;

  const groups = new Map<
    string,
    { powerClass: string; ocpp: OcppVersion; type: ChargerType; prices: number[] }
  >();

  for (const offer of offers ?? []) {
    const kw = Number(offer.powerKw);
    const powerClass =
      kw >= 50 ? "50+" : kw >= 22 ? "22" : kw >= 11 ? "11" : "7";
    const key = `${powerClass}|${offer.ocppVersion}|${offer.chargerType}`;
    const group = groups.get(key) ?? {
      powerClass,
      ocpp: offer.ocppVersion as OcppVersion,
      type: offer.chargerType as ChargerType,
      prices: [],
    };
    group.prices.push(Number(offer.price));
    groups.set(key, group);
  }

  const { error: deleteError } = await supabase
    .from("market_clusters")
    .delete()
    .neq("id", "");

  if (deleteError) throw deleteError;

  let count = 0;
  const now = new Date().toISOString();

  for (const group of groups.values()) {
    const prices = group.prices.sort((a, b) => a - b);
    const avg = prices.reduce((s, p) => s + p, 0) / prices.length;

    const { error: insertError } = await supabase.from("market_clusters").insert({
      powerClass: group.powerClass,
      ocppVersion: group.ocpp,
      chargerType: group.type,
      avgPrice: avg,
      minPrice: prices[0],
      maxPrice: prices[prices.length - 1],
      sampleCount: prices.length,
      computedAt: now,
    });

    if (insertError) throw insertError;
    count += 1;
  }

  return count;
}

export async function dbGetClusterForQuery(
  powerKw: number,
  ocpp: OcppVersion,
  chargerType: ChargerType
) {
  const powerClass =
    powerKw >= 50 ? "50+" : powerKw >= 22 ? "22" : powerKw >= 11 ? "11" : "7";

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("market_clusters")
    .select("*")
    .eq("powerClass", powerClass)
    .eq("ocppVersion", ocpp)
    .eq("chargerType", chargerType)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function dbVerifyAllMarketOfferUrls(): Promise<{
  checked: number;
  active: number;
  broken: number;
}> {
  if (!isDatabaseEnabled()) return { checked: 0, active: 0, broken: 0 };

  const supabase = getSupabase();
  const { data: offers, error } = await supabase
    .from("market_offers")
    .select("id, sourceUrl, isActive")
    .eq("isActive", true)
    .not("sourceUrl", "is", null)
    .neq("sourceType", "INTERNAL");

  if (error) throw error;

  let active = 0;
  let broken = 0;
  const now = new Date().toISOString();

  for (const offer of offers ?? []) {
    const check = await verifySourceUrl(offer.sourceUrl);
    const isActive = check.ok;

    const { error: updateError } = await supabase
      .from("market_offers")
      .update({
        sourceUrlActive: isActive,
        sourceUrlCheckedAt: now,
        isActive: isActive ? offer.isActive : false,
        updatedAt: now,
      })
      .eq("id", offer.id);

    if (updateError) throw updateError;

    if (isActive) active += 1;
    else broken += 1;
  }

  return { checked: offers?.length ?? 0, active, broken };
}
