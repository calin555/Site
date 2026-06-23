import {
  FileText,
  Sun,
  TrendingUp,
  Wand2,
  Zap,
  Building2,
  Users,
  GitCompare,
  type LucideIcon,
} from "lucide-react";

export interface ToolDefinition {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  category: "calculator" | "generator" | "marketplace";
  featured?: boolean;
}

export const TOOLS: ToolDefinition[] = [
  {
    slug: "comparator-tehnic",
    title: "Comparator tehnic OCPP",
    shortTitle: "Comparator OCPP",
    description:
      "Compară stații după putere, conector și protocol OCPP pe piața românească — fără brand, prețuri în RON.",
    icon: GitCompare,
    category: "calculator",
    featured: true,
  },
  {
    slug: "recomandare-statie",
    title: "Wizard recomandare stație EV",
    shortTitle: "Recomandare stație",
    description:
      "Răspunde la câteva întrebări și primești stațiile potrivite pentru uz casnic, business sau flotă.",
    icon: Wand2,
    category: "calculator",
    featured: true,
  },
  {
    slug: "calculator-afm",
    title: "Calculator eligibilitate AFM",
    shortTitle: "Calculator AFM",
    description:
      "Verifică dacă proiectul tău se califică pentru finanțare AFM și estimează valoarea grantului.",
    icon: Building2,
    category: "calculator",
    featured: true,
  },
  {
    slug: "calculator-electric-up",
    title: "Calculator Electric Up",
    shortTitle: "Electric Up",
    description:
      "Estimează finanțarea disponibilă prin programul Electric Up pentru IMM-uri.",
    icon: Zap,
    category: "calculator",
    featured: true,
  },
  {
    slug: "calculator-solar-ev",
    title: "Calculator Solar + EV",
    shortTitle: "Solar + EV",
    description:
      "Dimensionează sistemul fotovoltaic și stația de încărcare pentru autoconsum optim.",
    icon: Sun,
    category: "calculator",
  },
  {
    slug: "calculator-roi",
    title: "Calculator ROI încărcare EV",
    shortTitle: "ROI",
    description:
      "Calculează perioada de amortizare și rentabilitatea investiției în infrastructură EV.",
    icon: TrendingUp,
    category: "calculator",
  },
  {
    slug: "generator-oferta",
    title: "Generator cerere ofertă",
    shortTitle: "Cerere ofertă",
    description:
      "Configurează produsele și serviciile dorite și generează o cerere de ofertă structurată.",
    icon: FileText,
    category: "generator",
    featured: true,
  },
  {
    slug: "oferta-pdf",
    title: "Generator ofertă PDF",
    shortTitle: "Ofertă PDF",
    description:
      "Creează și descarcă o ofertă comercială profesională în format PDF/HTML.",
    icon: FileText,
    category: "generator",
  },
  {
    slug: "instalatori",
    title: "Marketplace instalatori",
    shortTitle: "Instalatori",
    description:
      "Găsește instalatori certificați în zona ta pentru montaj stații de încărcare EV.",
    icon: Users,
    category: "marketplace",
    featured: true,
  },
];

export const TOOL_BY_SLUG = Object.fromEntries(
  TOOLS.map((t) => [t.slug, t])
) as Record<string, ToolDefinition>;

export const ROMANIAN_COUNTIES = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
  "Brașov", "Brăila", "București", "Buzău", "Călărași", "Caraș-Severin",
  "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu",
  "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș",
  "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Sălaj", "Satu Mare",
  "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vâlcea", "Vaslui", "Vrancea",
] as const;
