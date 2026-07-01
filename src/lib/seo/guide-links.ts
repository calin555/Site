/** Hub ghiduri — leagă conținut existent (blog/tools), fără duplicare. */

export interface GuideLink {
  title: string;
  href: string;
  description?: string;
  type: "article" | "tool" | "catalog" | "page";
}

export interface GuideSection {
  title: string;
  description: string;
  links: GuideLink[];
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    title: "Ghiduri esențiale",
    description: "Alegere stație, AC vs DC, puteri și costuri.",
    links: [
      {
        title: "Cum alegi stația de încărcare potrivită",
        href: "/blog/cum-alegi-statia-de-incarcare-potrivita",
        type: "article",
      },
      {
        title: "Stații AC vs DC — diferențe tehnice",
        href: "/blog/statii-ac-vs-dc-diferente-tehnice-utilizare",
        type: "article",
      },
      {
        title: "7 kW vs 22 kW acasă",
        href: "/blog/comparatie-statii-7kw-vs-22kw-acasa",
        type: "article",
      },
      {
        title: "Cât costă o stație acasă (2026)",
        href: "/blog/cat-costa-statia-incarcare-acasa-2026",
        type: "article",
      },
      {
        title: "Wizard recomandare stație",
        href: "/tools/recomandare-statie",
        type: "tool",
      },
    ],
  },
  {
    title: "Instalare și reglementări",
    description: "ANRE, documentație, montaj comercial.",
    links: [
      {
        title: "Instalare wallbox pas cu pas",
        href: "/blog/instalare-wallbox-pas-cu-pas-documentatie",
        type: "article",
      },
      {
        title: "Avize și autorizații instalare",
        href: "/blog/avize-autorizatii-instalare-statii-incarcare",
        type: "article",
      },
      {
        title: "Instalare în condominiu",
        href: "/blog/incarcare-ev-in-condominiu-drepturi-proceduri",
        type: "article",
      },
      {
        title: "Stații pentru firme și spații comerciale",
        href: "/blog/instalare-statii-ac-spatii-comerciale",
        type: "article",
      },
    ],
  },
  {
    title: "Finanțări — ElectricUP, AFM, PNRR",
    description: "Granturi, deduceri fiscale, programe locale.",
    links: [
      {
        title: "Fonduri europene infrastructură EV 2026",
        href: "/blog/fonduri-europene-infrastructura-ev-2026",
        type: "article",
      },
      {
        title: "Granturi PMI pentru angajați",
        href: "/blog/granturi-pmi-statii-incarcare-angajati",
        type: "article",
      },
      {
        title: "Finanțare sector hotelier",
        href: "/blog/finantare-infrastructura-ev-sector-hotelier",
        type: "article",
      },
      {
        title: "Calculator ROI stații comerciale",
        href: "/tools/calculator-roi",
        type: "tool",
      },
    ],
  },
  {
    title: "Aplicații: hotel, flotă, bloc, primărie",
    description: "Studii de caz și ghiduri pe segment.",
    links: [
      {
        title: "Buget infrastructură flotă 10 vehicule",
        href: "/blog/buget-infrastructura-ev-flota-10-vehicule",
        type: "article",
      },
      {
        title: "Stații spații publice municipale",
        href: "/blog/instalare-statii-incarcare-spatii-publice-municipale",
        type: "article",
      },
      {
        title: "Parcări subterane",
        href: "/blog/instalare-statii-ev-parcari-subterane",
        type: "article",
      },
      {
        title: "Stații AC catalog",
        href: "/produse/categorie/statii-ac",
        type: "catalog",
      },
      {
        title: "Stații DC catalog",
        href: "/produse/categorie/statii-dc",
        type: "catalog",
      },
    ],
  },
  {
    title: "Branduri și conectori",
    description: "Comparații tehnice și selecție producător.",
    links: [
      {
        title: "Criterii alegere brand stație",
        href: "/blog/criterii-alegere-brand-statie-incarcare",
        type: "article",
      },
      {
        title: "Type 2 vs CCS2 — ghid complet",
        href: "/blog/conectori-type2-vs-ccs2-ghid-complet",
        type: "article",
      },
      {
        title: "Catalog branduri",
        href: "/produse",
        type: "catalog",
      },
    ],
  },
  {
    title: "Resurse suplimentare",
    description: "FAQ, bază de cunoștințe, contact.",
    links: [
      { title: "Întrebări frecvente", href: "/faq", type: "page" },
      {
        title: "Bază de cunoștințe (100+ Q&A)",
        href: "/baza-de-cunoastinte",
        type: "page",
      },
      { title: "Despre ChargePro", href: "/despre", type: "page" },
      { title: "Contact / ofertă", href: "/contact", type: "page" },
    ],
  },
];
