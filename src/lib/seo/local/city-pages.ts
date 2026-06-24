import type { CityPageData } from "@/lib/seo/local/types";
import { CITY_PAGES, getCityBySlug } from "@/lib/seo/local/cities";

export function getAllCityPages(): CityPageData[] {
  return CITY_PAGES;
}

export function getCityPageBySlug(slug: string): CityPageData | undefined {
  return getCityBySlug(slug);
}

export { CITY_PAGES, getCityBySlug };
