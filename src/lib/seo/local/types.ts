import type { FaqItem } from "@/lib/seo/faq-content";
import type { ContentSection } from "@/lib/seo/content-utils";

export interface CityPageData {
  slug: string;
  cityName: string;
  county: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  keywords: string[];
  latitude: number;
  longitude: number;
  intro: string;
  sections: ContentSection[];
  installationSection: ContentSection[];
  benefitsSection: ContentSection[];
  faq: FaqItem[];
  relatedProductLinks: { href: string; label: string }[];
  relatedArticleSlugs: string[];
  targetKeywords: string[];
}

export const LOCAL_CITY_SLUGS = [
  "statii-incarcare-bucuresti",
  "statii-incarcare-cluj-napoca",
  "statii-incarcare-timisoara",
  "statii-incarcare-iasi",
  "statii-incarcare-brasov",
  "statii-incarcare-constanta",
  "statii-incarcare-craiova",
  "statii-incarcare-oradea",
  "statii-incarcare-sibiu",
  "statii-incarcare-arges",
] as const;

export type LocalCitySlug = (typeof LOCAL_CITY_SLUGS)[number];

export function isLocalCitySlug(slug: string): slug is LocalCitySlug {
  return (LOCAL_CITY_SLUGS as readonly string[]).includes(slug);
}
