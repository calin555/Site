import { siteConfig } from "@/config/site";

export interface OfferSource {
  site: string;
  url?: string;
}

export function hostnameFromUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host || null;
  } catch {
    return null;
  }
}

export function resolveOfferSource(
  sourceUrl: string | null | undefined,
  sourceType: "INTERNAL" | "SCRAPED" | "MANUAL" = "MANUAL"
): OfferSource {
  if (sourceUrl) {
    const site = hostnameFromUrl(sourceUrl);
    if (site) {
      return { site, url: sourceUrl };
    }
    if (sourceUrl.startsWith("/")) {
      const base = siteConfig.url.replace(/\/$/, "");
      return {
        site: hostnameFromUrl(base) ?? "chargepro.ro",
        url: `${base}${sourceUrl}`,
      };
    }
  }

  if (sourceType === "INTERNAL") {
    const base = siteConfig.url.replace(/\/$/, "");
    return {
      site: hostnameFromUrl(base) ?? "chargepro.ro",
      url: `${base}/produse`,
    };
  }

  return { site: "Estimare piață RO" };
}
