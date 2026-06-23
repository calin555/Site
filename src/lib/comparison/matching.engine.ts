import type {
  CompareQuery,
  NormalizedChargerSpec,
  OcppVersionLabel,
  PhaseLabel,
} from "@/types/comparison";
import { powerToClass } from "./normalize";

const WEIGHTS = {
  electrical: 0.5,
  connector: 0.2,
  ocpp: 0.15,
  smart: 0.1,
  ip: 0.05,
} as const;

const OCPP_MISMATCH_PENALTY = 0.35;

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function scorePower(queryKw: number, offerKw: number): number {
  const qClass = powerToClass(queryKw);
  const oClass = powerToClass(offerKw);
  if (qClass === oClass) return 1;
  const classes = ["7", "11", "22", "50+"] as const;
  const qi = classes.indexOf(qClass);
  const oi = classes.indexOf(oClass);
  const dist = Math.abs(qi - oi);
  if (dist === 1) return 0.65;
  if (dist === 2) return 0.35;
  return 0.1;
}

function scorePhase(query: PhaseLabel, offer: PhaseLabel): number {
  return query === offer ? 1 : 0.4;
}

function scoreCurrent(query?: number, offer?: number): number {
  if (!query || !offer) return 0.85;
  const ratio = Math.min(query, offer) / Math.max(query, offer);
  return clamp01(ratio);
}

function scoreChargerType(
  query?: "AC" | "DC",
  offer?: "AC" | "DC"
): number {
  if (!query || !offer) return 0.9;
  return query === offer ? 1 : 0.15;
}

function scoreElectrical(
  query: CompareQuery,
  offer: NormalizedChargerSpec
): number {
  const power = scorePower(query.power_kw, offer.power_kw);
  const phase = scorePhase(query.phase, offer.phase);
  const current = scoreCurrent(query.current_amps, offer.current_amps);
  const type = scoreChargerType(query.type, offer.type);
  return clamp01(power * 0.45 + phase * 0.25 + current * 0.15 + type * 0.15);
}

function normalizeConnector(c: string): string {
  return c.toLowerCase().replace(/\s+/g, "").replace("type2", "type 2");
}

function scoreConnector(queryConnector: string, offer: NormalizedChargerSpec): number {
  const q = normalizeConnector(queryConnector);
  const offerConnectors = offer.connectors.map(normalizeConnector);
  if (offerConnectors.some((c) => c.includes(q) || q.includes(c))) return 1;
  const families: Record<string, string[]> = {
    ac: ["type2", "type 2", "type1", "type 1"],
    dc: ["ccs", "chademo", "gb/t", "gbt"],
  };
  for (const group of Object.values(families)) {
    const qIn = group.some((g) => q.includes(g.replace(/\s/g, "")));
    const oIn = offerConnectors.some((oc) =>
      group.some((g) => oc.includes(g.replace(/\s/g, "")))
    );
    if (qIn && oIn) return 0.55;
  }
  return 0.1;
}

function scoreOcpp(
  queryOcpp: OcppVersionLabel | undefined,
  offerOcpp: OcppVersionLabel
): { score: number; match: boolean } {
  if (!queryOcpp || queryOcpp === "none") {
    return { score: offerOcpp === "none" ? 0.85 : 0.6, match: true };
  }
  if (queryOcpp === offerOcpp) {
    return { score: 1, match: true };
  }
  if (offerOcpp === "none") {
    return { score: 0.05, match: false };
  }
  if (
    (queryOcpp === "2.0.1" && offerOcpp === "1.6J") ||
    (queryOcpp === "1.6J" && offerOcpp === "2.0.1")
  ) {
    return { score: 0.35, match: false };
  }
  return { score: 0.1, match: false };
}

function scoreSmartFeatures(
  query: CompareQuery,
  offer: NormalizedChargerSpec
): number {
  let score = 0;
  let parts = 0;

  const flags: Array<[boolean | undefined, boolean]> = [
    [query.load_balancing, offer.load_balancing],
  ];

  for (const [q, o] of flags) {
    if (q === undefined) continue;
    parts += 1;
    score += q === o ? 1 : 0.3;
  }

  const smartSignals = [
    offer.smart_charging,
    offer.backend_connectivity,
    offer.remote_management,
    offer.firmware_ota,
    offer.rfid_control,
    offer.app_control,
  ];
  const smartRatio =
    smartSignals.filter(Boolean).length / smartSignals.length;
  parts += 1;
  score += smartRatio;

  return parts > 0 ? score / parts : smartRatio;
}

function parseIp(ip?: string): number | null {
  if (!ip) return null;
  const m = ip.toUpperCase().match(/IP(\d{2})/);
  return m ? parseInt(m[1], 10) : null;
}

function scoreIp(queryIp?: string, offerIp?: string): number {
  const q = parseIp(queryIp);
  const o = parseIp(offerIp);
  if (!q && !o) return 0.85;
  if (!q || !o) return 0.7;
  if (o >= q) return 1;
  const diff = q - o;
  if (diff <= 1) return 0.75;
  if (diff <= 2) return 0.5;
  return 0.25;
}

export interface MatchScoreBreakdown {
  similarity: number;
  electrical_match: number;
  connector_match: number;
  ocpp_score: number;
  ocpp_match: boolean;
  smart_score: number;
  ip_score: number;
  best_match_type: string;
}

export function computeSimilarity(
  query: CompareQuery,
  offer: NormalizedChargerSpec
): MatchScoreBreakdown {
  const electrical_match = scoreElectrical(query, offer);
  const connector_match = scoreConnector(query.connector, offer);
  const ocppResult = scoreOcpp(query.ocpp, offer.ocpp);
  const smart_score = scoreSmartFeatures(query, offer);
  const ip_score = scoreIp(query.ip_rating, offer.ip_rating);

  let similarity =
    electrical_match * WEIGHTS.electrical +
    connector_match * WEIGHTS.connector +
    ocppResult.score * WEIGHTS.ocpp +
    smart_score * WEIGHTS.smart +
    ip_score * WEIGHTS.ip;

  if (!ocppResult.match && query.ocpp && query.ocpp !== "none") {
    similarity = clamp01(similarity - OCPP_MISMATCH_PENALTY);
  }

  let best_match_type = "partial technical match";
  if (
    electrical_match >= 0.9 &&
    connector_match >= 0.9 &&
    ocppResult.match &&
    query.ocpp &&
    query.ocpp !== "none"
  ) {
    best_match_type = "same OCPP + same electrical class";
  } else if (electrical_match >= 0.85 && connector_match >= 0.85) {
    best_match_type = "same electrical class + connector family";
  } else if (ocppResult.match && query.ocpp && query.ocpp !== "none") {
    best_match_type = "OCPP protocol match";
  }

  return {
    similarity: clamp01(similarity),
    electrical_match,
    connector_match,
    ocpp_score: ocppResult.score,
    ocpp_match: ocppResult.match,
    smart_score,
    ip_score,
    best_match_type,
  };
}

export function rankOffers<T extends { spec: NormalizedChargerSpec }>(
  query: CompareQuery,
  offers: T[]
): Array<T & MatchScoreBreakdown> {
  return offers
    .map((offer) => ({
      ...offer,
      ...computeSimilarity(query, offer.spec),
    }))
    .sort((a, b) => b.similarity - a.similarity);
}
