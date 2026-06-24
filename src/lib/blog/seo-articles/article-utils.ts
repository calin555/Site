import type { FaqItem } from "@/lib/seo/faq-content";
import {
  faqToHtml,
  internalLinksBlock,
  sectionsToHtml,
  type ContentSection,
} from "@/lib/seo/content-utils";
import { getBlogCoverImageByIndex } from "@/lib/blog/blog-cover-images";
import type { SeoArticleSeed } from "./types";

const DEFAULT_AUTHOR = "Echipa ChargePro";

const CATEGORY_SLUGS: Record<string, string> = {
  cat_ghiduri: "ghiduri",
  cat_business: "business",
  cat_finantare: "finantare",
  cat_tehnic: "tehnic",
  cat_comparatii: "comparatii",
  cat_costuri: "costuri",
};

const CITY_LINKS = [
  { href: "/statii-incarcare-bucuresti", label: "Stații încărcare București" },
  { href: "/statii-incarcare-cluj-napoca", label: "Stații încărcare Cluj-Napoca" },
  { href: "/statii-incarcare-timisoara", label: "Stații încărcare Timișoara" },
  { href: "/statii-incarcare-iasi", label: "Stații încărcare Iași" },
  { href: "/statii-incarcare-brasov", label: "Stații încărcare Brașov" },
  { href: "/statii-incarcare-constanta", label: "Stații încărcare Constanța" },
  { href: "/statii-incarcare-craiova", label: "Stații încărcare Craiova" },
  { href: "/statii-incarcare-oradea", label: "Stații încărcare Oradea" },
  { href: "/statii-incarcare-sibiu", label: "Stații încărcare Sibiu" },
  { href: "/statii-incarcare-arges", label: "Stații încărcare Argeș" },
];

export interface CreateSeoArticleParams {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  categoryId: string;
  tagIds: string[];
  publishedAt: string;
  seo: { metaTitle: string; metaDescription: string };
  targetKeywords: string[];
  sections: ContentSection[];
  faq: FaqItem[];
  cityLinkIndex?: number;
  extraLinks?: { href: string; label: string }[];
  author?: string;
}

export function createSeoArticle(params: CreateSeoArticleParams): SeoArticleSeed {
  const catSlug = CATEGORY_SLUGS[params.categoryId] ?? "ghiduri";
  const cityLink = CITY_LINKS[params.cityLinkIndex ?? 0] ?? CITY_LINKS[0];

  const links = [
    { href: "/produse/categorie/statii-ac", label: "Catalog stații AC" },
    { href: "/produse/categorie/statii-dc", label: "Catalog stații DC" },
    cityLink,
    { href: `/blog/categorie/${catSlug}`, label: `Mai multe articole — ${catSlug}` },
    { href: "/contact", label: "Solicită ofertă personalizată" },
    ...(params.extraLinks ?? []),
  ];

  const content = [
    sectionsToHtml(params.sections),
    faqToHtml(params.faq),
    internalLinksBlock(links),
  ].join("\n\n");

  return {
    id: params.id,
    slug: params.slug,
    title: params.title,
    excerpt: params.excerpt,
    coverImage: params.coverImage,
    categoryId: params.categoryId,
    tagIds: params.tagIds,
    author: params.author ?? DEFAULT_AUTHOR,
    publishedAt: params.publishedAt,
    seo: {
      metaTitle: params.seo.metaTitle,
      metaDescription: params.seo.metaDescription,
      keywords: params.targetKeywords,
    },
    content,
    faq: params.faq,
    targetKeywords: params.targetKeywords,
  };
}

export function coverImage(index: number): string {
  return getBlogCoverImageByIndex(index);
}
