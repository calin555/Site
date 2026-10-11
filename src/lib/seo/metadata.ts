import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getSiteBaseUrl } from "@/lib/site-url";
import { defaultKeywords, seoConfig } from "@/config/seo";
import { getSiteOgImageUrl, resolveOgImageUrl } from "@/lib/seo/og-image";

function baseUrl(): string {
  return getSiteBaseUrl().replace(/\/$/, "");
}

export function absoluteUrl(path = ""): string {
  const BASE_URL = baseUrl();
  if (!path) return BASE_URL;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const {
    title,
    description,
    path,
    keywords = defaultKeywords,
    ogImage = seoConfig.defaultOgImage,
    ogType = "website",
    noIndex = false,
    publishedTime,
    modifiedTime,
    authors,
  } = input;

  const canonical = absoluteUrl(path);
  const fullTitle = title.includes(seoConfig.siteName)
    ? title
    : `${title} | ${seoConfig.siteName}`;
  const imageUrl = resolveOgImageUrl(ogImage);

  return {
    // `absolute` evită aplicarea încă o dată a template-ului din root layout
    // (altfel rezulta „| IncarcAuto.ro | IncarcAuto.ro”).
    title: { absolute: fullTitle },
    description,
    keywords: keywords.join(", "),
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      type: ogType,
      ...(ogType === "article" && publishedTime
        ? { publishedTime, modifiedTime, authors }
        : {}),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export function buildRootMetadata(): Metadata {
  const BASE_URL = baseUrl();
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `Stație încărcare mașini electrice România | AC & DC | ${seoConfig.siteName}`,
      template: `%s | ${seoConfig.siteName}`,
    },
    description:
      "Stație încărcare mașini electrice — wallbox AC, stații DC rapide și accesorii EV. Livrare în România, instalare ANRE, consultanță tehnică gratuită.",
    keywords: defaultKeywords.join(", "),
    authors: [{ name: seoConfig.legalName, url: BASE_URL }],
    creator: seoConfig.legalName,
    publisher: seoConfig.siteName,
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      type: "website",
      locale: seoConfig.locale,
      url: BASE_URL,
      siteName: seoConfig.siteName,
      title: `Stație încărcare mașini electrice | ${seoConfig.siteName}`,
      description: siteConfig.description,
      images: [
        {
          url: getSiteOgImageUrl(),
          width: 1200,
          height: 630,
          alt: "Stații de încărcare vehicule electrice România",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Stație încărcare mașini electrice | ${seoConfig.siteName}`,
      description: siteConfig.description,
      images: [getSiteOgImageUrl()],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: seoConfig.googleSiteVerification
      ? { google: seoConfig.googleSiteVerification }
      : undefined,
  };
}
