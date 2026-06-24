/** Configurație SEO centralizată — incarcareauto.ro / stații încărcare EV */

export const SEO_KEYWORDS = [
  "stații încărcare EV",
  "stații încărcare mașini electrice",
  "încărcare auto electrică",
  "stații rapide DC",
  "încărcătoare EV România",
  "hartă stații încărcare",
  "rețea încărcare electrică",
  "wallbox România",
  "stație încărcare AC",
  "stație încărcare DC",
  "infrastructură EV",
  "ChargePro",
  "incarcareauto.ro",
] as const;

export const seoConfig = {
  siteName: "IncarcAuto.ro",
  legalName: "ChargePro",
  defaultOgImage:
    "https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=1200&h=630&fit=crop&q=80",
  locale: "ro_RO",
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  /** Google Analytics 4 — fallback la ID-ul contului dacă env lipsește pe Vercel */
  gaMeasurementId:
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-XXNZ2Y8W5W",
  /** Pagini private — noindex */
  noIndexPaths: [
    "/admin",
    "/api",
    "/cont",
    "/cos",
    "/checkout",
    "/autentificare",
  ],
} as const;

export const defaultKeywords = [...SEO_KEYWORDS];
