import type { CommercialLandingPageData } from "@/lib/seo/commercial/types";
import { TYPE_STATION_PAGES } from "@/lib/seo/commercial/pages/types-stations";
import { POWER_PAGES } from "@/lib/seo/commercial/pages/power";
import { VEHICLE_PAGES } from "@/lib/seo/commercial/pages/vehicles";
import { USE_CASE_PAGES } from "@/lib/seo/commercial/pages/use-cases";

export const COMMERCIAL_LANDING_PAGES: CommercialLandingPageData[] = [
  ...TYPE_STATION_PAGES,
  ...POWER_PAGES,
  ...VEHICLE_PAGES,
  ...USE_CASE_PAGES,
];

const PAGE_MAP = new Map(
  COMMERCIAL_LANDING_PAGES.map((p) => [p.slug, p])
);

export function getAllCommercialLandings(): CommercialLandingPageData[] {
  return COMMERCIAL_LANDING_PAGES;
}

export function getCommercialLandingBySlug(
  slug: string
): CommercialLandingPageData | undefined {
  return PAGE_MAP.get(slug);
}

export function getRelatedCommercialLandings(
  slugs: string[]
): CommercialLandingPageData[] {
  return slugs
    .map((s) => PAGE_MAP.get(s))
    .filter((p): p is CommercialLandingPageData => p !== undefined);
}

export function getCommercialLandingsBySilo(
  silo: CommercialLandingPageData["silo"]
): CommercialLandingPageData[] {
  return COMMERCIAL_LANDING_PAGES.filter((p) => p.silo === silo);
}
