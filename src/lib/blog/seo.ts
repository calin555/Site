import type { BlogArticleWithRelations } from "@/types/blog";
import { siteConfig } from "@/config/site";
import { defaultAuthor } from "@/config/author";
import { buildFaqPageSchema } from "@/lib/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function buildArticleJsonLd(article: BlogArticleWithRelations) {
  const url = `${siteConfig.url}/blog/${article.slug}`;
  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      image: article.coverImage,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: {
        "@type": "Person",
        name: article.author || defaultAuthor.name,
        url: `${siteConfig.url}${defaultAuthor.url}`,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      keywords: article.seo.keywords?.join(", "),
    },
  ];

  if (article.faq?.length) {
    schemas.push(buildFaqPageSchema(article.faq));
  }

  return schemas.length === 1 ? schemas[0] : schemas;
}

export function buildArticleMetadata(article: BlogArticleWithRelations) {
  const title = article.seo.metaTitle ?? article.title;
  const description = article.seo.metaDescription ?? article.excerpt;
  const image = article.seo.ogImage ?? article.coverImage;

  return buildPageMetadata({
    title,
    description,
    path: `/blog/${article.slug}`,
    keywords: article.seo.keywords,
    ogImage: image,
    ogType: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.author || defaultAuthor.name],
  });
}
