import type { FaqItem } from "@/lib/seo/faq-content";

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords?: string[];
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string;
  tagIds: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  isPublished: boolean;
  seo: BlogSeo;
  faq?: FaqItem[];
}

export interface BlogArticleWithRelations extends BlogArticle {
  category: BlogCategory;
  tags: BlogTag[];
}

/** @deprecated Use BlogArticle — kept for gradual migration */
export interface LegacyBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
}

export function toLegacyPost(article: BlogArticleWithRelations): LegacyBlogPost {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    coverImage: article.coverImage,
    category: article.category.name,
    author: article.author,
    publishedAt: article.publishedAt,
    readTime: article.readTime,
  };
}
