import type { CommercialLandingPageData } from "@/lib/seo/commercial/types";

export type KeywordPriority = "High" | "Medium" | "Low";
export type SearchIntent = "transactional" | "commercial" | "informational";

export interface KeywordTarget {
  primaryKeyword: string;
  slug: string;
  url: string;
  intent: SearchIntent;
  difficulty: "Low" | "Medium" | "High";
  priority: KeywordPriority;
  parentSlug?: string;
  notes?: string;
}

/** Matrice keyword → URL — aliniată la intenții comerciale, fără branduri fără produse în catalog. */
export const KEYWORD_TARGETS: KeywordTarget[] = [
  {
    primaryKeyword: "stație încărcare AC",
    slug: "statie-incarcare-ac",
    url: "/statie-incarcare-ac",
    intent: "transactional",
    difficulty: "High",
    priority: "High",
    notes: "Pilon siloz — concurență: e-mobility.ro hub, categorii magazin",
  },
  {
    primaryKeyword: "stație încărcare DC",
    slug: "statie-incarcare-dc",
    url: "/statie-incarcare-dc",
    intent: "transactional",
    difficulty: "High",
    priority: "High",
    notes: "Pilon siloz — e-mobility ElectricUP DC, SolarOne",
  },
  {
    primaryKeyword: "stație încărcare rapidă",
    slug: "statie-incarcare-rapida",
    url: "/statie-incarcare-rapida",
    intent: "commercial",
    difficulty: "Medium",
    priority: "High",
    parentSlug: "statie-incarcare-dc",
    notes: "Variantă lexicală DC — canonical intent spre DC, fără duplicare tehnică",
  },
  {
    primaryKeyword: "stație încărcare 7 kW",
    slug: "statie-incarcare-7kw",
    url: "/statie-incarcare-7kw",
    intent: "transactional",
    difficulty: "Medium",
    priority: "High",
    parentSlug: "statie-incarcare-ac",
  },
  {
    primaryKeyword: "stație încărcare 11 kW",
    slug: "statie-incarcare-11kw",
    url: "/statie-incarcare-11kw",
    intent: "transactional",
    difficulty: "Medium",
    priority: "High",
    parentSlug: "statie-incarcare-ac",
  },
  {
    primaryKeyword: "stație încărcare 22 kW",
    slug: "statie-incarcare-22kw",
    url: "/statie-incarcare-22kw",
    intent: "transactional",
    difficulty: "High",
    priority: "High",
    parentSlug: "statie-incarcare-ac",
    notes: "Cel mai disputat — Autel MaxiCharger, Easee, Fronius pe SERP",
  },
  {
    primaryKeyword: "stație încărcare Tesla",
    slug: "statie-incarcare-tesla",
    url: "/statie-incarcare-tesla",
    intent: "commercial",
    difficulty: "Medium",
    priority: "High",
    parentSlug: "statie-incarcare-11kw",
  },
  {
    primaryKeyword: "stație încărcare Dacia Spring",
    slug: "statie-incarcare-dacia-spring",
    url: "/statie-incarcare-dacia-spring",
    intent: "commercial",
    difficulty: "Low",
    priority: "High",
    parentSlug: "statie-incarcare-7kw",
    notes: "Oportunitate RO — puțini concurenți cu landing dedicat",
  },
  {
    primaryKeyword: "stație încărcare BMW",
    slug: "statie-incarcare-bmw",
    url: "/statie-incarcare-bmw",
    intent: "commercial",
    difficulty: "Medium",
    priority: "High",
    parentSlug: "statie-incarcare-11kw",
  },
  {
    primaryKeyword: "stație încărcare BYD",
    slug: "statie-incarcare-byd",
    url: "/statie-incarcare-byd",
    intent: "commercial",
    difficulty: "Low",
    priority: "High",
    parentSlug: "statie-incarcare-11kw",
  },
  {
    primaryKeyword: "stație încărcare Mercedes",
    slug: "statie-incarcare-mercedes",
    url: "/statie-incarcare-mercedes",
    intent: "commercial",
    difficulty: "Medium",
    priority: "High",
    parentSlug: "statie-incarcare-11kw",
  },
  {
    primaryKeyword: "stație încărcare Hyundai",
    slug: "statie-incarcare-hyundai",
    url: "/statie-incarcare-hyundai",
    intent: "commercial",
    difficulty: "Low",
    priority: "High",
    parentSlug: "statie-incarcare-11kw",
  },
  {
    primaryKeyword: "stație încărcare Kia",
    slug: "statie-incarcare-kia",
    url: "/statie-incarcare-kia",
    intent: "commercial",
    difficulty: "Low",
    priority: "High",
    parentSlug: "statie-incarcare-11kw",
  },
  {
    primaryKeyword: "stație încărcare Volkswagen",
    slug: "statie-incarcare-volkswagen",
    url: "/statie-incarcare-volkswagen",
    intent: "commercial",
    difficulty: "Medium",
    priority: "High",
    parentSlug: "statie-incarcare-11kw",
  },
  {
    primaryKeyword: "stație încărcare acasă",
    slug: "statie-incarcare-acasa",
    url: "/statie-incarcare-acasa",
    intent: "transactional",
    difficulty: "High",
    priority: "High",
    parentSlug: "statie-incarcare-ac",
  },
  {
    primaryKeyword: "stație încărcare firmă",
    slug: "statie-incarcare-firma",
    url: "/statie-incarcare-firma",
    intent: "transactional",
    difficulty: "Medium",
    priority: "High",
    parentSlug: "statie-incarcare-22kw",
  },
  {
    primaryKeyword: "stație încărcare hotel",
    slug: "statie-incarcare-hotel",
    url: "/statie-incarcare-hotel",
    intent: "commercial",
    difficulty: "Low",
    priority: "High",
    parentSlug: "statie-incarcare-firma",
  },
  {
    primaryKeyword: "stație încărcare bloc",
    slug: "statie-incarcare-bloc",
    url: "/statie-incarcare-bloc",
    intent: "commercial",
    difficulty: "Medium",
    priority: "High",
    parentSlug: "statie-incarcare-acasa",
  },
  // Secondary — fără canibalizare dacă linkuim ierarhic spre High
  {
    primaryKeyword: "stație încărcare wallbox",
    slug: "statie-incarcare-wallbox",
    url: "/statie-incarcare-wallbox",
    intent: "commercial",
    difficulty: "Medium",
    priority: "Medium",
    parentSlug: "statie-incarcare-ac",
  },
  {
    primaryKeyword: "stație încărcare monofazată",
    slug: "statie-incarcare-monofazata",
    url: "/statie-incarcare-monofazata",
    intent: "commercial",
    difficulty: "Low",
    priority: "Medium",
    parentSlug: "statie-incarcare-7kw",
  },
  {
    primaryKeyword: "stație încărcare trifazată",
    slug: "statie-incarcare-trifazata",
    url: "/statie-incarcare-trifazata",
    intent: "commercial",
    difficulty: "Low",
    priority: "Medium",
    parentSlug: "statie-incarcare-22kw",
  },
  {
    primaryKeyword: "stație încărcare flotă",
    slug: "statie-incarcare-flota",
    url: "/statie-incarcare-flota",
    intent: "transactional",
    difficulty: "Medium",
    priority: "Medium",
    parentSlug: "statie-incarcare-dc",
  },
  {
    primaryKeyword: "stație încărcare 60 kW",
    slug: "statie-incarcare-60kw",
    url: "/statie-incarcare-60kw",
    intent: "transactional",
    difficulty: "Medium",
    priority: "Medium",
    parentSlug: "statie-incarcare-dc",
  },
  {
    primaryKeyword: "stație încărcare pensiune",
    slug: "statie-incarcare-pensiune",
    url: "/statie-incarcare-pensiune",
    intent: "commercial",
    difficulty: "Low",
    priority: "Low",
    parentSlug: "statie-incarcare-hotel",
  },
  {
    primaryKeyword: "stație încărcare Audi",
    slug: "statie-incarcare-audi",
    url: "/statie-incarcare-audi",
    intent: "commercial",
    difficulty: "Low",
    priority: "Low",
    parentSlug: "statie-incarcare-22kw",
  },
  {
    primaryKeyword: "stație încărcare Skoda",
    slug: "statie-incarcare-skoda",
    url: "/statie-incarcare-skoda",
    intent: "commercial",
    difficulty: "Low",
    priority: "Low",
    parentSlug: "statie-incarcare-volkswagen",
  },
  {
    primaryKeyword: "stație încărcare 30 kW",
    slug: "statie-incarcare-30kw",
    url: "/statie-incarcare-30kw",
    intent: "transactional",
    difficulty: "Low",
    priority: "Low",
    parentSlug: "statie-incarcare-dc",
  },
  {
    primaryKeyword: "stație încărcare 120 kW",
    slug: "statie-incarcare-120kw",
    url: "/statie-incarcare-120kw",
    intent: "transactional",
    difficulty: "Medium",
    priority: "Low",
    parentSlug: "statie-incarcare-dc",
  },
];

const TARGET_BY_SLUG = new Map(KEYWORD_TARGETS.map((t) => [t.slug, t]));

export function getKeywordTarget(slug: string): KeywordTarget | undefined {
  return TARGET_BY_SLUG.get(slug);
}

export function getHighPriorityTargets(): KeywordTarget[] {
  return KEYWORD_TARGETS.filter((t) => t.priority === "High");
}

/** Legături interne ierarhice — evită canibalizarea. */
export function getInternalLinksForLanding(
  slug: string,
  page: CommercialLandingPageData
): { href: string; label: string }[] {
  const target = getKeywordTarget(slug);
  const links: { href: string; label: string }[] = [];

  if (target?.parentSlug) {
    const parent = TARGET_BY_SLUG.get(target.parentSlug);
    if (parent) {
      links.push({ href: parent.url, label: `↑ ${parent.primaryKeyword}` });
    }
  }

  for (const relSlug of page.relatedLandingSlugs.slice(0, 5)) {
    const rel = TARGET_BY_SLUG.get(relSlug);
    if (rel && rel.slug !== slug) {
      links.push({ href: rel.url, label: rel.primaryKeyword });
    }
  }

  links.push(
    { href: page.catalogCtaHref, label: page.catalogCtaLabel },
    { href: "/statii-incarcare", label: "Index stații încărcare" },
    { href: "/produse", label: "Catalog produse EV" },
    { href: "/contact", label: "Solicită ofertă" }
  );

  return links;
}

/** Landing pages relevante — după categorie și putere. */
export function getLandingsForProduct(product: {
  categorySlug: string;
  powerKw: number;
}): { href: string; label: string }[] {
  const links: { href: string; label: string }[] = [];

  if (product.categorySlug === "statii-ac") {
    links.push({ href: "/statie-incarcare-ac", label: "Stații încărcare AC" });
  }
  if (product.categorySlug === "statii-dc") {
    links.push({ href: "/statie-incarcare-dc", label: "Stații încărcare DC" });
    links.push({ href: "/statie-incarcare-rapida", label: "Stație încărcare rapidă" });
  }

  const kw = product.powerKw;
  if (kw > 0 && kw <= 8) {
    links.push({ href: "/statie-incarcare-7kw", label: "Stație 7 kW" });
    links.push({ href: "/statie-incarcare-dacia-spring", label: "Stație Dacia Spring" });
  } else if (kw > 8 && kw <= 12) {
    links.push({ href: "/statie-incarcare-11kw", label: "Stație 11 kW" });
    links.push({ href: "/statie-incarcare-tesla", label: "Stație Tesla" });
  } else if (kw > 12 && kw <= 25) {
    links.push({ href: "/statie-incarcare-22kw", label: "Stație 22 kW" });
    links.push({ href: "/statie-incarcare-firma", label: "Stație firmă" });
  } else if (kw >= 30 && kw < 80) {
    links.push({ href: "/statie-incarcare-60kw", label: "Stație 60 kW" });
    links.push({ href: "/statie-incarcare-flota", label: "Stație flotă" });
  } else if (kw >= 80) {
    links.push({ href: "/statie-incarcare-120kw", label: "Stație 120 kW" });
  }

  links.push({ href: "/statie-incarcare-acasa", label: "Stație acasă" });

  return links.slice(0, 6);
}
