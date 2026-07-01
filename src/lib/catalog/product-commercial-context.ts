import type { FaqItem } from "@/lib/seo/faq-content";

export interface ProductCommercialContext {
  chargeType: "AC" | "DC" | "Accesoriu" | "Smart/OCPP";
  phases: string;
  recommendedVehicles: string[];
  useCases: string[];
  chargingTimeExamples: { label: string; hours: string }[];
  faq: FaqItem[];
  landingLinks: { href: string; label: string }[];
}

const BY_SLUG: Record<string, Partial<ProductCommercialContext>> = {
  "ecowatt-home-7-4kw": {
    recommendedVehicles: ["Dacia Spring", "Renault Zoe", "Fiat 500e"],
    useCases: ["Acasă monofazat", "Apartament"],
    chargingTimeExamples: [{ label: "Dacia Spring 27 kWh", hours: "~4 h" }],
    faq: [{ question: "EcoWatt vs ChargePro Home?", answer: "Specificații similare 7,4 kW — diferențe design și garanție. Consultați oferta actuală." }],
    landingLinks: [{ href: "/statie-incarcare-7kw", label: "Stație 7 kW" }],
  },
  "ecowatt-business-22kw": {
    recommendedVehicles: ["Flote corporate", "Audi e-tron", "Mercedes EQ"],
    useCases: ["Firmă", "Parcare comercială", "Hotel"],
    chargingTimeExamples: [{ label: "95 kWh (20→80%)", hours: "~2,5 h" }],
    landingLinks: [{ href: "/statie-incarcare-22kw", label: "Stație 22 kW" }, { href: "/statie-incarcare-firma", label: "Stație firmă" }],
  },
  "voltedge-dc-120kw": {
    recommendedVehicles: ["Flote curierat", "Retail tranzit", "Autostrăzi"],
    useCases: ["Parcare publică", "Retail", "Hub logistic"],
    chargingTimeExamples: [{ label: "60 kWh (20→80%)", hours: "~20–25 min" }],
    landingLinks: [{ href: "/statie-incarcare-rapida", label: "Stație rapidă" }],
  },
  "chargepro-home-7-4kw": {
    recommendedVehicles: ["Dacia Spring", "Renault Zoe", "Fiat 500e", "Hyundai Kona"],
    useCases: ["Acasă — garaj sau curte", "Apartament cu loc parcare dedicat"],
    chargingTimeExamples: [
      { label: "Dacia Spring 27 kWh (0→100%)", hours: "~4 h" },
      { label: "Renault Zoe 52 kWh", hours: "~7 h" },
    ],
    faq: [
      {
        question: "Este suficient 7,4 kW pentru Dacia Spring?",
        answer: "Da — Spring acceptă maximum 7,4 kW AC. Stația 22 kW nu accelerează încărcarea.",
      },
      {
        question: "Funcționează pe monofazat?",
        answer: "Da, necesită circuit 32A dedicat și protecție RCBO Tip A.",
      },
    ],
    landingLinks: [
      { href: "/statie-incarcare-7kw", label: "Stație 7 kW" },
      { href: "/statie-incarcare-dacia-spring", label: "Stație Dacia Spring" },
      { href: "/statie-incarcare-acasa", label: "Stație acasă" },
    ],
  },
  "chargepro-wall-11kw": {
    recommendedVehicles: ["Tesla Model 3/Y", "BMW i4", "VW ID.3/4", "Hyundai Ioniq 5", "Kia EV6"],
    useCases: ["Acasă trifazat", "Vilă", "Pensiune mică"],
    chargingTimeExamples: [
      { label: "Tesla Model 3 60 kWh (20→80%)", hours: "~3,5 h" },
      { label: "VW ID.4 77 kWh (0→100%)", hours: "~7 h" },
    ],
    faq: [
      {
        question: "Merită 11 kW față de 7,4 kW?",
        answer: "Da, dacă ai trifazat și vehicul 11 kW (Tesla, BMW, VW). Dacia Spring nu beneficiază.",
      },
    ],
    landingLinks: [
      { href: "/statie-incarcare-11kw", label: "Stație 11 kW" },
      { href: "/statie-incarcare-tesla", label: "Stație Tesla" },
    ],
  },
  "chargepro-pro-22kw": {
    recommendedVehicles: ["Audi e-tron", "Porsche Taycan", "Mercedes EQS", "Tesla Model S/X"],
    useCases: ["Firmă — parcare angajați", "Hotel", "Retail", "Flotă urbană"],
    chargingTimeExamples: [
      { label: "Audi e-tron 95 kWh (20→80%)", hours: "~2,5 h" },
      { label: "Tesla Model 3 (limitat 11 kW onboard)", hours: "~3,5 h" },
    ],
    faq: [
      {
        question: "Câte stații pot alimenta simultan?",
        answer: "Depinde de puterea contractată — load balancing distribuie 22 kW × N stații inteligent.",
      },
      {
        question: "Suportă OCPP pentru firmă?",
        answer: "Da, OCPP 1.6J — integrare platformă management flotă și rapoarte consum.",
      },
    ],
    landingLinks: [
      { href: "/statie-incarcare-22kw", label: "Stație 22 kW" },
      { href: "/statie-incarcare-firma", label: "Stație firmă" },
    ],
  },
  "voltedge-dc-60kw": {
    recommendedVehicles: ["Orice EV CCS2", "Tesla Model 3/Y", "Hyundai Ioniq 5", "BMW iX"],
    useCases: ["Retail", "Flotă curierat", "Hotel tranzit", "Parcare publică"],
    chargingTimeExamples: [
      { label: "60 kWh baterie (20→80%)", hours: "~35–45 min" },
      { label: "40 kWh urban (20→80%)", hours: "~25 min" },
    ],
    faq: [
      {
        question: "Ce putere electrică necesită?",
        answer: "Minimum ~63A trifazat dedicat — audit tehnic obligatoriu înainte de comandă.",
      },
    ],
    landingLinks: [
      { href: "/statie-incarcare-dc", label: "Stații DC" },
      { href: "/statie-incarcare-rapida", label: "Stație rapidă" },
      { href: "/statie-incarcare-flota", label: "Stație flotă" },
    ],
  },
};

function inferFromProduct(product: {
  slug: string;
  categorySlug: string;
  powerKw: number;
  phases: "SINGLE" | "THREE";
}): ProductCommercialContext {
  const chargeType =
    product.categorySlug === "statii-dc"
      ? "DC"
      : product.categorySlug === "accesorii"
        ? "Accesoriu"
        : product.categorySlug === "smart-ocpp"
          ? "Smart/OCPP"
          : "AC";

  const phases =
    product.phases === "SINGLE"
      ? "Monofazat 230V (max ~7,4 kW)"
      : product.powerKw > 0
        ? "Trifazat 400V"
        : "N/A";

  const hoursFull =
    product.powerKw > 0
      ? (60 / product.powerKw).toFixed(1)
      : "—";

  return {
    chargeType,
    phases,
    recommendedVehicles:
      product.powerKw <= 7.4
        ? ["Dacia Spring", "Renault Zoe", "modele urbane"]
        : product.powerKw <= 11
          ? ["Tesla Model 3", "BMW i4", "VW ID", "Hyundai Ioniq"]
          : product.categorySlug === "statii-dc"
            ? ["Toate EV CCS2"]
            : ["Audi e-tron", "flote", "vehicule premium"],
    useCases:
      product.categorySlug === "statii-dc"
        ? ["Retail", "Flotă", "Parcare publică"]
        : product.powerKw <= 11
          ? ["Acasă", "Pensiune"]
          : ["Firmă", "Hotel", "Parcare comercială"],
    chargingTimeExamples:
      product.powerKw > 0
        ? [{ label: "Baterie 60 kWh (0→100%)", hours: `~${hoursFull} h` }]
        : [],
    faq: [],
    landingLinks:
      product.categorySlug === "statii-ac"
        ? [{ href: "/statie-incarcare-ac", label: "Stații AC" }]
        : product.categorySlug === "statii-dc"
          ? [{ href: "/statie-incarcare-dc", label: "Stații DC" }]
          : [],
  };
}

export function getProductCommercialContext(product: {
  slug: string;
  categorySlug: string;
  powerKw: number;
  phases: "SINGLE" | "THREE";
}): ProductCommercialContext {
  const specific = BY_SLUG[product.slug];
  const base = inferFromProduct(product);
  if (!specific) return base;
  return {
    ...base,
    ...specific,
    faq: specific.faq?.length ? specific.faq : base.faq,
    landingLinks: specific.landingLinks?.length
      ? specific.landingLinks
      : base.landingLinks,
    chargingTimeExamples:
      specific.chargingTimeExamples?.length
        ? specific.chargingTimeExamples
        : base.chargingTimeExamples,
  };
}
