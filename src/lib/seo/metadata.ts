import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getSiteBaseUrl } from "@/lib/site-url";
import { defaultKeywords, seoConfig } from "@/config/seo";

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
  } = input;

  const canonical = absoluteUrl(path);
  const fullTitle = title.includes(seoConfig.siteName)
    ? title
    : `${title} | ${seoConfig.siteName}`;

  return {
    title: fullTitle,
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
      images: [
        {
          url: ogImage,
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
      images: [ogImage],
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
      default: `Stații încărcare EV România | AC & DC | ${seoConfig.siteName}`,
      template: `%s | ${seoConfig.siteName}`,
    },
    description:
      "Magazin online de stații încărcare mașini electrice — AC, DC rapid, wallbox și accesorii. Livrare în România, instalare ANRE, consultanță tehnică gratuită.",
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
      title: `Stații încărcare EV România | ${seoConfig.siteName}`,
      description: siteConfig.description,
      images: [
        {
          url: seoConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: "Stații de încărcare vehicule electrice România",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Stații încărcare EV | ${seoConfig.siteName}`,
      description: siteConfig.description,
      images: [seoConfig.defaultOgImage],
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
