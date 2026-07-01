import type { FaqItem } from "@/lib/seo/faq-content";
import type { ContentSection } from "@/lib/seo/content-utils";

export type CommercialSilo =
  | "types"
  | "power"
  | "vehicles"
  | "use-cases";

export interface ProductFilter {
  categorySlug?: string;
  brandSlug?: string;
  powerKwMin?: number;
  powerKwMax?: number;
  phases?: "SINGLE" | "THREE";
  connectorTypes?: string[];
}

export interface ComparisonTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface ProsCons {
  pros: string[];
  cons: string[];
}

export interface CommercialLandingPageData {
  slug: string;
  silo: CommercialSilo;
  siloLabel: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: ContentSection[];
  comparisonTable?: ComparisonTable;
  prosCons?: ProsCons;
  faq: FaqItem[];
  productFilter: ProductFilter;
  relatedLandingSlugs: string[];
  relatedArticleSlugs: string[];
  relatedProductLinks: { href: string; label: string }[];
  catalogCtaHref: string;
  catalogCtaLabel: string;
  imageAlt: string;
  imageUrl?: string;
}

export const COMMERCIAL_LANDING_SLUGS = [
  "statie-incarcare-ac",
  "statie-incarcare-dc",
  "statie-incarcare-rapida",
  "statie-incarcare-wallbox",
  "statie-incarcare-monofazata",
  "statie-incarcare-trifazata",
  "statie-incarcare-7kw",
  "statie-incarcare-11kw",
  "statie-incarcare-22kw",
  "statie-incarcare-30kw",
  "statie-incarcare-60kw",
  "statie-incarcare-120kw",
  "statie-incarcare-tesla",
  "statie-incarcare-dacia-spring",
  "statie-incarcare-byd",
  "statie-incarcare-bmw",
  "statie-incarcare-mercedes",
  "statie-incarcare-hyundai",
  "statie-incarcare-kia",
  "statie-incarcare-volkswagen",
  "statie-incarcare-audi",
  "statie-incarcare-skoda",
  "statie-incarcare-acasa",
  "statie-incarcare-firma",
  "statie-incarcare-hotel",
  "statie-incarcare-pensiune",
  "statie-incarcare-bloc",
  "statie-incarcare-flota",
] as const;

export type CommercialLandingSlug = (typeof COMMERCIAL_LANDING_SLUGS)[number];

export function isCommercialLandingSlug(
  slug: string
): slug is CommercialLandingSlug {
  return (COMMERCIAL_LANDING_SLUGS as readonly string[]).includes(slug);
}
