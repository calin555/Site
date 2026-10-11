import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";
import { getAllCatalogProducts } from "@/lib/services/catalog.service";
import { getShopCategories } from "@/lib/services/category.service";
import { getPublishedArticles, getBlogCategories } from "@/lib/services/blog.service";
import { getShopBrandsWithProducts } from "@/lib/services/brand.service";
import { TOOLS } from "@/config/tools";
import { getAllCityPages } from "@/lib/seo/local/city-pages";
import { getAllCommercialLandings } from "@/lib/seo/commercial/registry";
import { getAllVehicles } from "@/lib/compatibility/vehicles";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { legalPaths } from "@/config/legal";

function toDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/**
 * Sitemap = doar URL-uri canonice și indexabile.
 * `lastModified` apare doar când avem o dată reală de conținut (produse din DB,
 * articole); paginile statice nu mai primesc ora cererii ca „lastmod”.
 * Excluse: /categorii/:slug (301 → /produse/categorie/:slug), branduri și
 * categorii fără produse (noindex), /blog/tag/* (noindex,follow).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = absoluteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/produse"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/categorii"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/tools"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/despre"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.8 },
    {
      url: absoluteUrl("/statii-incarcare"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/compatibilitate"),
      changeFrequency: "weekly",
      priority: 0.92,
    },
    { url: absoluteUrl("/proiecte-realizate"), changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl("/studii-de-caz"), changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl("/ghid"), changeFrequency: "monthly", priority: 0.85 },
    {
      url: absoluteUrl("/baza-de-cunoastinte"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/autor/echipa-chargepro"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: absoluteUrl(legalPaths.terms), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl(legalPaths.privacy), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl(legalPaths.gdpr), changeFrequency: "yearly", priority: 0.3 },
  ];

  const [products, categories, brands] = await Promise.all([
    getAllCatalogProducts(),
    getShopCategories(),
    getShopBrandsWithProducts(),
  ]);

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: absoluteUrl(`/produse/${p.slug}`),
    lastModified: toDate(p.updatedAt ?? p.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => c.productCount > 0)
    .map((c) => ({
      url: absoluteUrl(`/produse/categorie/${c.slug}`),
      changeFrequency: "weekly",
      priority: 0.75,
    }));

  const brandPages: MetadataRoute.Sitemap = brands.map((b) => ({
    url: absoluteUrl(`/produse/brand/${b.slug}`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: absoluteUrl(`/tools/${t.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogPosts = getPublishedArticles();
  const blogCategories = getBlogCategories();

  const blogPages: MetadataRoute.Sitemap = [
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: toDate(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...blogCategories.map((cat) => ({
      url: absoluteUrl(`/blog/categorie/${cat.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.55,
    })),
  ];

  const commercialPages: MetadataRoute.Sitemap = getAllCommercialLandings().map(
    (p) => ({
      url: absoluteUrl(`/${p.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })
  );

  const cityPages: MetadataRoute.Sitemap = getAllCityPages().map((city) => ({
    url: absoluteUrl(`/${city.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const caseStudyPages: MetadataRoute.Sitemap = CASE_STUDIES.map((s) => ({
    url: absoluteUrl(`/studii-de-caz/${s.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const compatibilityPages: MetadataRoute.Sitemap = getAllVehicles().map(
    (vehicle) => ({
      url: absoluteUrl(`/compatibilitate/${vehicle.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.88,
    })
  );

  return [
    ...staticPages,
    ...commercialPages,
    ...cityPages,
    ...compatibilityPages,
    ...caseStudyPages,
    ...productPages,
    ...categoryPages,
    ...brandPages,
    ...toolPages,
    ...blogPages,
  ];
}

/** Regenerat automat la fiecare deploy Vercel (SSR la build + revalidare). */
export const revalidate = 3600;
