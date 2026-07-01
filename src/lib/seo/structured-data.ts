import { siteConfig } from "@/config/site";
import { seoConfig } from "@/config/seo";
import { absoluteUrl } from "@/lib/seo/metadata";
import type { FaqItem } from "@/lib/seo/faq-content";
import { getSchemaAvailability } from "@/lib/catalog/stock-status";
import type { ProductDetail } from "@/types/product";

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.legalName,
    alternateName: seoConfig.siteName,
    url: absoluteUrl(),
    logo: absoluteUrl("/icon"),
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "București",
      addressCountry: "RO",
    },
    sameAs: [absoluteUrl()],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phone,
        contactType: "sales",
        areaServed: "RO",
        availableLanguage: ["Romanian", "English"],
      },
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phoneTechnical,
        contactType: "technical support",
        areaServed: "RO",
        availableLanguage: ["Romanian"],
      },
    ],
  };
}

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${absoluteUrl()}#localbusiness`,
    name: seoConfig.legalName,
    alternateName: seoConfig.siteName,
    url: absoluteUrl(),
    image: seoConfig.defaultOgImage,
    description:
      "Furnizor de stații încărcare EV, wallbox AC, stații rapide DC și servicii de instalare în România.",
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address,
      addressLocality: "București",
      addressCountry: "RO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 44.4268,
      longitude: 26.1025,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:30",
        closes: "17:00",
      },
    ],
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "România",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Stații încărcare vehicule electrice",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Stații AC — încărcare auto electrică acasă",
        },
        {
          "@type": "OfferCatalog",
          name: "Stații DC rapide — încărcătoare EV comerciale",
        },
        {
          "@type": "OfferCatalog",
          name: "Accesorii și rețea încărcare electrică",
        },
      ],
    },
  };
}

export function buildFaqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.siteName,
    url: absoluteUrl(),
    description: siteConfig.description,
    inLanguage: "ro-RO",
    publisher: {
      "@type": "Organization",
      name: seoConfig.legalName,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/produse")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; path?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path ? absoluteUrl(item.path) : undefined,
    })),
  };
}

export function buildProductSchema(product: ProductDetail) {
  const productUrl = absoluteUrl(`/produse/${product.slug}`);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => i.url),
    sku: product.sku,
    url: productUrl,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: product.price,
      priceCurrency: "RON",
      availability: getSchemaAvailability(product.stockStatus, product.stock),
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: seoConfig.legalName,
        url: absoluteUrl(),
      },
    },
  };

  if (product.reviews.length > 0 && product.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
    schema.review = product.reviews.slice(0, 5).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      datePublished: review.date,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.content,
    }));
  }

  return schema;
}

export function buildCityLocalBusinessSchema(city: {
  cityName: string;
  county: string;
  slug: string;
  latitude: number;
  longitude: number;
  metaDescription: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${absoluteUrl(`/${city.slug}`)}#localbusiness`,
    name: `${seoConfig.siteName} — Stații încărcare EV ${city.cityName}`,
    alternateName: seoConfig.legalName,
    url: absoluteUrl(`/${city.slug}`),
    image: seoConfig.defaultOgImage,
    description: city.metaDescription,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.cityName,
      addressRegion: city.county,
      addressCountry: "RO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.latitude,
      longitude: city.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:30",
        closes: "17:00",
      },
    ],
    priceRange: "$$",
    areaServed: {
      "@type": "City",
      name: city.cityName,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: city.county,
      },
    },
    knowsAbout: [
      "Stații încărcare vehicule electrice",
      "Wallbox AC",
      "Stații rapide DC",
      "Instalare ANRE",
    ],
  };
}
