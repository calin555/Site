import type { FaqItem } from "@/lib/seo/faq-content";

export interface SeoArticleSeed {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  categoryId: string;
  tagIds: string[];
  author: string;
  publishedAt: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords?: string[];
  };
  content: string;
  faq: FaqItem[];
  targetKeywords: string[];
}
