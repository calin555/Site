export const COMPARISON_MARKET = "RO" as const;
export type ComparisonMarket = typeof COMPARISON_MARKET;

const RO_TLD = /\.ro(?:\/|$)/i;

export function isRomanianSourceUrl(
  sourceUrl: string | null | undefined
): boolean {
  if (!sourceUrl) return false;
  if (sourceUrl.startsWith("/")) return true;
  try {
    const host = new URL(sourceUrl).hostname.toLowerCase();
    return host.endsWith(".ro") || host === "localhost";
  } catch {
    return RO_TLD.test(sourceUrl);
  }
}

export function detectMarketCountry(
  sourceUrl: string | null | undefined,
  sourceType: "INTERNAL" | "SCRAPED" | "MANUAL",
  currency = "RON"
): ComparisonMarket | null {
  if (sourceType === "INTERNAL") return COMPARISON_MARKET;
  if (currency !== "RON") return null;
  if (!sourceUrl) return COMPARISON_MARKET;
  if (isRomanianSourceUrl(sourceUrl)) return COMPARISON_MARKET;
  return null;
}

export function assertRomanianMarketOffer(
  sourceUrl: string | null | undefined,
  sourceType: "INTERNAL" | "SCRAPED" | "MANUAL",
  currency = "RON"
): void {
  const market = detectMarketCountry(sourceUrl, sourceType, currency);
  if (market !== COMPARISON_MARKET) {
    throw new Error(
      "Comparatorul acceptă doar oferte de pe piața românească (.ro, preț în RON)."
    );
  }
}

export const ROMANIAN_MARKET_LABEL = "România";
