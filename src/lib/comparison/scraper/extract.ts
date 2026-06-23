import { extractOcppFromText } from "@/lib/comparison/ocpp.extractor";
import { isRomanianSourceUrl } from "@/lib/comparison/market-region";
import type { ScrapedOfferInput } from "@/types/comparison";

const POWER_RE =
  /(\d{1,3}(?:[.,]\d)?)\s*k\s*w\b|\b(\d{1,3}(?:[.,]\d)?)\s*kw\b/gi;
const PHASE_RE =
  /\b(3[\s-]?phase|trifazat|three[\s-]?phase|1[\s-]?phase|monofazat|single[\s-]?phase)\b/i;
const CONNECTOR_RE =
  /\b(type\s*2|type\s*1|ccs\s*2?|chademo|cha\s*de\s*mo)\b/gi;
const PRICE_RE =
  /(?:€|eur|ron|lei)\s*([\d\s.,]+)|([\d\s.,]+)\s*(?:€|eur|ron|lei)/gi;
const IP_RE = /\bIP\s*(\d{2})\b/i;
const CURRENT_RE = /\b(\d{1,2}(?:[.,]\d)?)\s*a\b/i;

function parsePower(text: string): number | null {
  const matches = [...text.matchAll(POWER_RE)];
  if (matches.length === 0) return null;
  const values = matches.map((m) => {
    const raw = (m[1] ?? m[2] ?? "").replace(",", ".");
    return parseFloat(raw);
  });
  return Math.max(...values.filter((v) => !Number.isNaN(v)));
}

function parsePhase(text: string): ScrapedOfferInput["phase"] {
  const m = text.match(PHASE_RE);
  if (!m) return "3-phase";
  const v = m[0].toLowerCase();
  if (v.includes("1") || v.includes("mono") || v.includes("single")) {
    return "1-phase";
  }
  return "3-phase";
}

function parseConnectors(text: string): string {
  const found = new Set<string>();
  for (const m of text.matchAll(CONNECTOR_RE)) {
    const c = m[0].toLowerCase();
    if (c.includes("type 2") || c.includes("type2")) found.add("Type 2");
    else if (c.includes("type 1")) found.add("Type 1");
    else if (c.includes("ccs")) found.add("CCS");
    else if (c.includes("chademo") || c.includes("cha de mo"))
      found.add("CHAdeMO");
  }
  return [...found].join(", ") || "Type 2";
}

function parsePrice(text: string): number | null {
  const matches = [...text.matchAll(PRICE_RE)];
  if (matches.length === 0) return null;
  const raw = (matches[0][1] ?? matches[0][2] ?? "")
    .replace(/\s/g, "")
    .replace(",", ".");
  const val = parseFloat(raw);
  return Number.isNaN(val) ? null : val;
}

function inferType(text: string, powerKw: number, connector: string): "AC" | "DC" {
  if (/dc\b|fast\s*charg|rapid/i.test(text)) return "DC";
  if (/ccs|chademo/i.test(connector)) return "DC";
  if (powerKw >= 50) return "DC";
  return "AC";
}

/** Extract structured charger data from messy HTML/text — no brand fields */
export function extractStructuredFromHtml(
  html: string,
  sourceUrl?: string
): ScrapedOfferInput | null {
  if (sourceUrl && !isRomanianSourceUrl(sourceUrl)) {
    return null;
  }

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const power_kw = parsePower(text);
  const price = parsePrice(text);
  if (!power_kw || !price || price <= 0) return null;

  const connector = parseConnectors(text);
  const phase = parsePhase(text);
  const type = inferType(text, power_kw, connector);
  const ocppExtract = extractOcppFromText(text);
  const ipMatch = text.match(IP_RE);
  const currentMatch = text.match(CURRENT_RE);

  return {
    power_kw,
    phase,
    connector,
    type,
    ocpp: ocppExtract.version,
    load_balancing: ocppExtract.loadBalancing,
    price,
    source_url: sourceUrl,
    raw_text: text.slice(0, 8000),
    current_amps: currentMatch
      ? parseFloat(currentMatch[1].replace(",", "."))
      : undefined,
    ip_rating: ipMatch ? `IP${ipMatch[1]}` : undefined,
  };
}
