import type { CompareQuery, CompareResult } from "@/types/comparison";
import { rankOffers } from "@/lib/comparison/matching.engine";
import { inferChargerType } from "@/lib/comparison/normalize";
import { ocppLabelToEnum } from "@/lib/comparison/ocpp.extractor";
import {
  applyOwnSitePriority,
  type ComparableOffer,
} from "@/lib/comparison/own-site-priority";
import {
  dbFindActiveMarketOffers,
  dbGetClusterForQuery,
} from "@/lib/db/market-offer.repository";
import { SAMPLE_MARKET_OFFERS } from "@/lib/comparison/sample-data";
import { normalizeFromScraped } from "@/lib/comparison/normalize";
import {
  COMPARISON_MARKET,
  ROMANIAN_MARKET_LABEL,
} from "@/lib/comparison/market-region";
import { siteConfig } from "@/config/site";

function parsePhase(value: string | null): CompareQuery["phase"] | null {
  if (!value) return null;
  const v = value.toLowerCase().replace(/\s+/g, "");
  if (v === "3-phase" || v === "3phase" || v === "three") return "3-phase";
  if (v === "1-phase" || v === "1phase" || v === "single") return "1-phase";
  return null;
}

function parseOcpp(value: string | null): CompareQuery["ocpp"] | undefined {
  if (!value) return undefined;
  const v = value.toLowerCase().replace(/\s+/g, "");
  if (v === "none" || v === "no") return "none";
  if (v === "1.6j" || v === "ocpp1.6j" || v === "1.6") return "1.6J";
  if (v === "2.0.1" || v === "ocpp2.0.1" || v === "2.0" || v === "2") {
    return "2.0.1";
  }
  return undefined;
}

export function parseCompareQuery(
  searchParams: URLSearchParams
): CompareQuery | { error: string } {
  const powerRaw = searchParams.get("power_kw");
  const power_kw = powerRaw ? Number(powerRaw) : NaN;
  if (!powerRaw || Number.isNaN(power_kw) || power_kw <= 0) {
    return { error: "power_kw is required and must be positive" };
  }

  const phase = parsePhase(searchParams.get("phase"));
  if (!phase) {
    return { error: "phase is required (1-phase or 3-phase)" };
  }

  const connector = searchParams.get("connector");
  if (!connector?.trim()) {
    return { error: "connector is required" };
  }

  const ocpp = parseOcpp(searchParams.get("ocpp"));
  const typeParam = searchParams.get("type");
  const type =
    typeParam?.toUpperCase() === "DC"
      ? "DC"
      : typeParam?.toUpperCase() === "AC"
        ? "AC"
        : undefined;

  const currentRaw = searchParams.get("current_amps");
  const referenceRaw = searchParams.get("reference_price");
  const loadBalancingRaw = searchParams.get("load_balancing");

  return {
    power_kw,
    phase,
    connector: connector.trim(),
    ocpp,
    type,
    current_amps: currentRaw ? Number(currentRaw) : undefined,
    ip_rating: searchParams.get("ip_rating") ?? undefined,
    load_balancing:
      loadBalancingRaw === "true"
        ? true
        : loadBalancingRaw === "false"
          ? false
          : undefined,
    reference_price: referenceRaw ? Number(referenceRaw) : undefined,
  };
}

function getFallbackOffers(): ComparableOffer[] {
  return SAMPLE_MARKET_OFFERS.map((input, index) => ({
    id: `sample-${index + 1}`,
    spec: normalizeFromScraped(input),
    sourceSite: "Estimare piață RO",
    sourceUrl: undefined,
    sourceLinkActive: false,
    isOwnSite: false,
    similarity: 0,
    electrical_match: 0,
    connector_match: 0,
    ocpp_score: 0,
    ocpp_match: false,
    smart_score: 0,
    ip_score: 0,
    best_match_type: "",
  }));
}

function marketPosition(
  reference: number | undefined,
  avg: number
): CompareResult["position"] {
  if (!reference || avg <= 0) return "unknown";
  const ratio = reference / avg;
  if (ratio < 0.95) return "below market";
  if (ratio > 1.05) return "above market";
  return "at market";
}

function toBestPriceInfo(offer: ComparableOffer) {
  return {
    price: Math.round(offer.spec.price),
    currency: offer.spec.currency,
    source_site: offer.sourceSite,
    source_url: offer.sourceLinkActive ? offer.sourceUrl : undefined,
    source_link_active: offer.sourceLinkActive,
    is_own_site: offer.isOwnSite,
    similarity: Math.round(offer.similarity * 100) / 100,
    ocpp_match: offer.ocpp_match,
  };
}

function toCompareMatch(m: ComparableOffer, market_avg: number) {
  const savings_vs_market =
    market_avg > 0 ? Math.round(market_avg - m.spec.price) : undefined;
  const savings_percent =
    market_avg > 0
      ? Math.round(((market_avg - m.spec.price) / market_avg) * 100)
      : undefined;

  return {
    ref_id: m.id,
    price: Math.round(m.spec.price),
    currency: m.spec.currency,
    similarity: Math.round(m.similarity * 100) / 100,
    ocpp_match: m.ocpp_match,
    electrical_match: Math.round(m.electrical_match * 100) / 100,
    connector_match: Math.round(m.connector_match * 100) / 100,
    ocpp_score: Math.round(m.ocpp_score * 100) / 100,
    smart_score: Math.round(m.smart_score * 100) / 100,
    ip_score: Math.round(m.ip_score * 100) / 100,
    source_site: m.sourceSite,
    source_url: m.sourceLinkActive ? m.sourceUrl : undefined,
    source_link_active: m.sourceLinkActive,
    is_own_site: m.isOwnSite,
    specs: m.spec,
    savings_vs_market,
    savings_percent,
  };
}

export async function runComparison(
  query: CompareQuery
): Promise<CompareResult> {
  let offers = await dbFindActiveMarketOffers();
  if (offers.length === 0) {
    offers = getFallbackOffers();
  }

  const ranked = rankOffers(query, offers).filter(
    (o) => o.similarity >= 0.35
  ) as ComparableOffer[];

  const { visible, bestOwn } = applyOwnSitePriority(ranked, query);

  const competitorPrices = visible
    .filter((m) => !m.isOwnSite)
    .map((m) => m.spec.price);
  const allVisiblePrices = visible.map((m) => m.spec.price);

  const market_avg =
    competitorPrices.length > 0
      ? Math.round(
          competitorPrices.reduce((s, p) => s + p, 0) / competitorPrices.length
        )
      : allVisiblePrices.length > 0
        ? Math.round(
            allVisiblePrices.reduce((s, p) => s + p, 0) /
              allVisiblePrices.length
          )
        : 0;

  const market_min =
    bestOwn != null
      ? Math.round(bestOwn.spec.price)
      : allVisiblePrices.length > 0
        ? Math.min(...allVisiblePrices)
        : 0;

  const market_max =
    allVisiblePrices.length > 0 ? Math.max(...allVisiblePrices) : 0;

  const referencePrice =
    bestOwn?.spec.price ?? query.reference_price ?? visible[0]?.spec.price;
  const position = bestOwn
    ? "below market"
    : marketPosition(referencePrice, market_avg);

  const top = bestOwn ?? visible[0];
  const best_match_type = top?.best_match_type ?? "no close match";

  const chargerType =
    query.type ?? inferChargerType(query.power_kw, [query.connector]);
  const ocppEnum = ocppLabelToEnum(query.ocpp ?? "none");

  const cluster = await dbGetClusterForQuery(
    query.power_kw,
    ocppEnum,
    chargerType
  );

  const ocppClusterAvg = cluster ? Number(cluster.avgPrice) : undefined;

  const compatible_backend = visible.some(
    (m) => m.spec.backend_connectivity && m.ocpp_match
  );

  const tier_detected =
    top?.spec.tier ??
    (query.power_kw >= 50 && query.ocpp === "2.0.1"
      ? "enterprise"
      : query.ocpp && query.ocpp !== "none"
        ? "commercial"
        : "residential");

  const alerts: string[] = [];

  if (!bestOwn) {
    alerts.push(
      `Nu există încă un produs potrivit în catalogul ${siteConfig.name}. Adaugă stații în admin pentru comparare cu prețul tău.`
    );
  }

  const suspicious = visible.filter((m) => m.spec.ocpp_claim_suspicious);
  if (suspicious.length > 0) {
    alerts.push(
      `${suspicious.length} ofertă/oferte cu claim OCPP suspect`
    );
  }

  const best_price = bestOwn ? toBestPriceInfo(bestOwn) : null;
  const matches = visible.slice(0, 12).map((m) => toCompareMatch(m, market_avg));

  return {
    query,
    matches,
    best_price,
    market: COMPARISON_MARKET,
    market_label: ROMANIAN_MARKET_LABEL,
    market_avg,
    market_min,
    market_max,
    market_sample_count: visible.length,
    position,
    best_match_type,
    ocpp_cluster_avg: ocppClusterAvg,
    compatible_backend,
    tier_detected,
    alerts,
  };
}
