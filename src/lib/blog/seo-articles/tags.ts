import type { BlogTag } from "@/types/blog";

/** Tags used exclusively by SEO article seeds — merged into BLOG_TAGS in templates.ts */
export const SEO_ARTICLE_TAGS: BlogTag[] = [
  { id: "tag_ghid", name: "Ghid", slug: "ghid" },
  { id: "tag_comparatie", name: "Comparație", slug: "comparatie" },
  { id: "tag_costuri", name: "Costuri", slug: "costuri" },
  { id: "tag_dc", name: "Stații DC", slug: "statii-dc" },
  { id: "tag_ac", name: "Stații AC", slug: "statii-ac" },
  { id: "tag_condominii", name: "Condominii", slug: "condominii" },
  { id: "tag_wallbox", name: "Wallbox", slug: "wallbox" },
  { id: "tag_ocpp", name: "OCPP", slug: "ocpp" },
  { id: "tag_anre", name: "ANRE", slug: "anre" },
  { id: "tag_fiscal", name: "Fiscal", slug: "fiscal" },
  { id: "tag_pmi", name: "PMI", slug: "pmi" },
  { id: "tag_hotel", name: "HoReCa", slug: "hotel-horeca" },
  { id: "tag_conectori", name: "Conectori", slug: "conectori" },
  { id: "tag_tarife", name: "Tarife", slug: "tarife" },
  { id: "tag_roi", name: "ROI", slug: "roi" },
  { id: "tag_dimensionare", name: "Dimensionare", slug: "dimensionare" },
  { id: "tag_mentenanta", name: "Mentenanță", slug: "mentenanta" },
  { id: "tag_securitate", name: "Securitate", slug: "securitate" },
  { id: "tag_autonomie", name: "Autonomie", slug: "autonomie" },
  { id: "tag_roaming", name: "Roaming", slug: "roaming" },
  { id: "tag_leasing", name: "Leasing", slug: "leasing" },
  { id: "tag_primarii", name: "Primării", slug: "primarii" },
  { id: "tag_eu_fonduri", name: "Fonduri UE", slug: "fonduri-ue" },
];
