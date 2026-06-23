import type { BlogArticleWithRelations } from "@/types/blog";
import { siteConfig } from "@/config/site";

export function buildArticleJsonLd(article: BlogArticleWithRelations) {
  const url = `${siteConfig.url}/blog/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: article.seo.keywords?.join(", "),
  };
}

export function buildArticleMetadata(article: BlogArticleWithRelations) {
  const title = article.seo.metaTitle ?? article.title;
  const description = article.seo.metaDescription ?? article.excerpt;
  const image = article.seo.ogImage ?? article.coverImage;

  return {
    title,
    description,
    keywords: article.seo.keywords,
    openGraph: {
      title,
      description,
      type: "article" as const,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      images: [{ url: image, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
  };
}
