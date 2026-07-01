import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";
import { getAllCatalogProducts } from "@/lib/services/catalog.service";
import { getShopCategories } from "@/lib/services/category.service";
import { getPublishedArticles, getBlogCategories, getBlogTags } from "@/lib/services/blog.service";
import { brands } from "@/lib/mock-data";
import { TOOLS } from "@/config/tools";
import { getAllCityPages } from "@/lib/seo/local/city-pages";
import { legalPaths } from "@/config/legal";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base = absoluteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/produse"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/categorii"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/tools"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/despre"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/ghid"), lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    {
      url: absoluteUrl("/baza-de-cunoastinte"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/autor/echipa-chargepro"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: absoluteUrl(legalPaths.terms), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl(legalPaths.privacy), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl(legalPaths.gdpr), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const [products, categories] = await Promise.all([
    getAllCatalogProducts(),
    getShopCategories(),
  ]);

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: absoluteUrl(`/produse/${p.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((c) => [
    {
      url: absoluteUrl(`/categorii/${c.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: absoluteUrl(`/produse/categorie/${c.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ]);

  const brandPages: MetadataRoute.Sitemap = brands.map((b) => ({
    url: absoluteUrl(`/produse/brand/${b.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: absoluteUrl(`/tools/${t.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogPosts = getPublishedArticles();
  const blogCategories = getBlogCategories();
  const blogTags = getBlogTags();

  const blogPages: MetadataRoute.Sitemap = [
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...blogCategories.map((cat) => ({
      url: absoluteUrl(`/blog/categorie/${cat.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.55,
    })),
    ...blogTags.map((tag) => ({
      url: absoluteUrl(`/blog/tag/${tag.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];

  const cityPages: MetadataRoute.Sitemap = getAllCityPages().map((city) => ({
    url: absoluteUrl(`/${city.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [
    ...staticPages,
    ...cityPages,
    ...productPages,
    ...categoryPages,
    ...brandPages,
    ...toolPages,
    ...blogPages,
  ];
}

/** Regenerat automat la fiecare deploy Vercel (SSR la build + revalidare). */
export const revalidate = 3600;
