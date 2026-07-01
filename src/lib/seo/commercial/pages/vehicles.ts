import type { CommercialLandingPageData } from "@/lib/seo/commercial/types";
import { BASE_LINKS } from "@/lib/seo/commercial/pages/types-stations";

interface VehicleConfig {
  slug: string;
  brand: string;
  acMax: string;
  dcMax: string;
  recommendedKw: string;
  battery: string;
  connector: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  extraSections: CommercialLandingPageData["sections"];
  productFilter?: CommercialLandingPageData["productFilter"];
  relatedLandingSlugs?: string[];
}

function vehiclePage(c: VehicleConfig): CommercialLandingPageData {
  return {
    slug: c.slug,
    silo: "vehicles",
    siloLabel: "Mărci auto",
    primaryKeyword: `stație încărcare ${c.brand}`,
    secondaryKeywords: [
      `wallbox ${c.brand}`,
      `încărcare ${c.brand} acasă`,
      `stație EV ${c.brand} România`,
    ],
    metaTitle: c.metaTitle,
    metaDescription: c.metaDescription,
    h1: c.h1,
    intro: c.intro,
    sections: [
      ...c.extraSections,
      {
        h2: `Specificații încărcare ${c.brand}`,
        paragraphs: [
          `Putere AC maximă acceptată: ${c.acMax}. DC rapid (CCS2): ${c.dcMax}. Baterie tipică: ${c.battery}. Conector standard Europa: ${c.connector}.`,
          `ChargePro recomandă stație ${c.recommendedKw} pentru uz rezidențial ${c.brand}. Verificați manualul modelului exact — variantele Long Range vs Standard pot diferi.`,
        ],
      },
      {
        h2: "Instalare acasă",
        paragraphs: [
          `Pentru ${c.brand}, instalarea wallbox Type 2 cu RCBO Tip A respectă garanția vehiculului. ChargePro livrează echipament, coordonează electrician ANRE și testează sesiune completă de încărcare.`,
          "Programarea încărcării nocturnă (22:00–06:00) reduce costul cu 30–40% față de tariful de vârf — funcție disponibilă în app wallbox sau Tesla app.",
        ],
      },
      {
        h2: "Cost încărcare acasă vs public",
        paragraphs: [
          `La 1,0 RON/kWh nocturn, 100 km cu ${c.brand} costă ~15–25 RON acasă vs 40–60 RON la stații publice. Amortizarea wallbox-ului: 12–24 luni pentru 15.000+ km/an.`,
        ],
      },
    ],
    comparisonTable: {
      caption: `Opțiuni stație pentru ${c.brand}`,
      headers: ["Soluție", "Putere", "Timp 50 kWh", "Preț orientativ"],
      rows: [
        ["Priză Schuko", "2,3 kW", "20+ h", "0 RON (nerecomandat)"],
        ["Wallbox recomandat", c.recommendedKw, "4–8 h", "4.000–8.000 RON total"],
        ["DC public", c.dcMax, "25–40 min", "1,8–3,5 RON/kWh"],
      ],
    },
    prosCons: {
      pros: [
        `Stație dedicată ${c.brand} — încărcare sigură`,
        "Cost/km minim acasă",
        "Pregătire pentru upgrade vehicul",
      ],
      cons: [
        "Investiție inițială wallbox + instalare",
        "Necesită loc parcare cu acces la tablou",
      ],
    },
    faq: [
      {
        question: `Ce wallbox recomandați pentru ${c.brand}?`,
        answer: `Stație AC ${c.recommendedKw} Type 2, smart, cu app. Catalog ChargePro include modele compatibile testate cu ${c.brand}.`,
      },
      {
        question: `${c.brand} se poate încărca de la priză normală?`,
        answer: "Posibil cu cablu Mode 2 inclus, dar lent (2,3 kW) și nerecomandat permanent — risc termic și uzură priză.",
      },
      {
        question: "Ce conector folosește în România?",
        answer: `${c.connector}. Adaptor inclus sau opțional de la producător pentru stații publice.`,
      },
      {
        question: "Instalare la bloc pentru " + c.brand + "?",
        answer: "Da, cu acordul asociației. Procedura standard ChargePro pentru condominiu — 30–90 zile.",
      },
    ],
    productFilter: c.productFilter ?? { categorySlug: "statii-ac" },
    relatedLandingSlugs: c.relatedLandingSlugs ?? [
      "statie-incarcare-acasa",
      "statie-incarcare-ac",
      c.recommendedKw.includes("11") ? "statie-incarcare-11kw" : "statie-incarcare-7kw",
    ],
    relatedArticleSlugs: ["cum-alegi-statia-de-incarcare-potrivita"],
    relatedProductLinks: [
      BASE_LINKS.acasa,
      BASE_LINKS.ac,
      { href: "/tools/recomandare-statie", label: "Wizard compatibilitate vehicul" },
    ],
    catalogCtaHref: "/produse/categorie/statii-ac",
    catalogCtaLabel: `Stații compatibile ${c.brand}`,
    imageAlt: `Stație încărcare pentru ${c.brand}`,
  };
}

export const VEHICLE_PAGES: CommercialLandingPageData[] = [
  vehiclePage({
    slug: "statie-incarcare-tesla",
    brand: "Tesla",
    acMax: "11 kW trifazat (3×16A)",
    dcMax: "250 kW Supercharger / 170 kW CCS2",
    recommendedKw: "11 kW trifazat",
    battery: "57–82 kWh (Model 3/Y)",
    connector: "Type 2 AC / CCS2 DC",
    metaTitle: "Stație încărcare Tesla Model 3/Y — wallbox 11 kW | ChargePro",
    metaDescription: "Stație încărcare Tesla acasă: wallbox 11 kW Type 2, compatibil Model 3, Model Y. Instalare ANRE, livrare România.",
    h1: "Stație încărcare Tesla — wallbox acasă pentru Model 3 și Model Y",
    intro: "Tesla Model 3 și Model Y vândute în Europa acceptă 11 kW AC trifazat și CCS2 DC până la 170 kW. Pentru acasă, un wallbox 11 kW Type 2 este echivalentul funcional al Tesla Wall Connector — la preț competitiv și cu service local ChargePro.",
    extraSections: [{
      h2: "Tesla Wall Connector vs wallbox universal",
      paragraphs: ["Tesla Wall Connector este optimizat pentru fleet Tesla. Wallbox-uri universale (ABB, Wallbox, ChargePro) oferă aceeași putere 11 kW, adesea la preț inferior, cu app proprie și compatibilitate viitoare non-Tesla.", "ChargePro configurează wallbox-ul pentru Tesla — Type 2, 11 kW trifazat, programare nocturnă."],
    }],
  }),
  vehiclePage({
    slug: "statie-incarcare-dacia-spring",
    brand: "Dacia Spring",
    acMax: "7,4 kW monofazat",
    dcMax: "30 kW CCS2",
    recommendedKw: "7,4 kW monofazat",
    battery: "26,8–45 kWh",
    connector: "Type 2 AC / CCS2 DC",
    metaTitle: "Stație încărcare Dacia Spring — wallbox 7,4 kW | ChargePro",
    metaDescription: "Wallbox pentru Dacia Spring: 7,4 kW monofazat, Type 2. Cel mai vândut EV din România — stație acasă de la 4.000 RON.",
    h1: "Stație încărcare Dacia Spring — wallbox 7,4 kW monofazat",
    intro: "Dacia Spring este cel mai accesibil EV din România — baterie 27–45 kWh, AC max 7,4 kW. Stația ideală: wallbox monofazat 7,4 kW Type 2. Încărcare completă 4–7 ore — perfect peste noapte.",
    extraSections: [{
      h2: "De ce 7,4 kW este suficient pentru Spring",
      paragraphs: ["Spring nu acceptă 11 kW AC — stația 22 kW nu aduce beneficiu. Economisiți cu wallbox 7,4 kW monofazat: instalare simplă, cost minim.", "Autonomie reală 150–220 km WLTP — 7,4 kW acoperă 200+ km peste noapte."],
    }],
    relatedLandingSlugs: ["statie-incarcare-7kw", "statie-incarcare-monofazata", "statie-incarcare-acasa"],
  }),
  vehiclePage({ slug: "statie-incarcare-byd", brand: "BYD", acMax: "7–11 kW", dcMax: "88–150 kW CCS2", recommendedKw: "11 kW trifazat", battery: "45–82 kWh", connector: "Type 2 / CCS2", metaTitle: "Stație încărcare BYD — Atto 3, Dolphin, Seal | ChargePro", metaDescription: "Stație încărcare BYD Atto 3, Dolphin, Seal: wallbox 11 kW Type 2. Instalare ANRE România.", h1: "Stație încărcare BYD — wallbox pentru Atto 3, Dolphin și Seal", intro: "BYD câștigă teren rapid în România — Atto 3, Dolphin și Seal acceptă 7–11 kW AC și DC rapid CCS2. Wallbox 11 kW trifazat acoperă toate modelele actuale și viitoare din gamă.", extraSections: [{ h2: "BYD Blade Battery și încărcare AC", paragraphs: ["Bateria Blade suportă cicluri frecvente AC fără degradare accelerată. Încărcare 20–80% zilnică pe AC este recomandată de producător.", "BYD Seal AWD acceptă 11 kW AC — verificați variantele FWD vs AWD."] }] }),
  vehiclePage({ slug: "statie-incarcare-bmw", brand: "BMW", acMax: "11 kW trifazat (22 kW opțional iX)", dcMax: "150–200 kW CCS2", recommendedKw: "11 kW trifazat", battery: "64–111 kWh", connector: "Type 2 / CCS2", metaTitle: "Stație încărcare BMW i4, iX, iX3 — 11 kW | ChargePro", metaDescription: "Wallbox BMW i4, iX, iX3: stație 11–22 kW Type 2. Instalare premium ANRE, ChargePro România.", h1: "Stație încărcare BMW — stație AC pentru i4, iX și iX3", intro: "BMW i4, iX3 acceptă 11 kW AC standard; iX și i7 pot configura 22 kW AC. Pentru majoritatea clienților BMW, wallbox 11 kW trifazat este alegerea corectă — raport cost/performanță.", extraSections: [{ h2: "BMW Charging Card vs wallbox propriu", paragraphs: ["Cardul BMW funcționează la stații publice. Acasă, wallbox dedicat reduce costul/kWh cu 50%+ și prelungește viața bateriei prin încărcare lentă nocturnă."] }] }),
  vehiclePage({ slug: "statie-incarcare-mercedes", brand: "Mercedes", acMax: "11 kW (EQS/EQC 22 kW opțional)", dcMax: "200 kW CCS2", recommendedKw: "11 kW trifazat", battery: "66–108 kWh", connector: "Type 2 / CCS2", metaTitle: "Stație încărcare Mercedes EQ — EQA, EQB, EQC | ChargePro", metaDescription: "Stație încărcare Mercedes EQ: wallbox 11–22 kW. EQA, EQB, EQC, EQS — instalare ANRE România.", h1: "Stație încărcare Mercedes EQ — wallbox pentru gama electrică", intro: "Gama Mercedes EQ (EQA, EQB, EQC, EQS) folosește CCS2 și Type 2. Wallbox 11 kW acoperă EQA/EQB/EQC; EQS beneficiază de 22 kW AC opțional.", extraSections: [] }),
  vehiclePage({ slug: "statie-incarcare-hyundai", brand: "Hyundai", acMax: "11 kW (Ioniq 5/6: 22 kW opțional)", dcMax: "220 kW 800V CCS2", recommendedKw: "11 kW trifazat", battery: "58–77 kWh", connector: "Type 2 / CCS2", metaTitle: "Stație încărcare Hyundai Ioniq 5/6, Kona EV | ChargePro", metaDescription: "Wallbox Hyundai Ioniq 5, Ioniq 6, Kona Electric: 11 kW AC acasă. DC 800V la stații publice.", h1: "Stație încărcare Hyundai — Ioniq 5, Ioniq 6, Kona Electric", intro: "Hyundai Ioniq 5/6 folosesc arhitectură 800V — DC ultra-rapid 220 kW la stații publice. Acasă, 11 kW AC este standardul — încărcare completă Ioniq 5 în ~6 ore.", extraSections: [{ h2: "Ioniq 5 — 800V acasă", paragraphs: ["800V aduce beneficii la DC rapid, nu la AC. Wallbox 11 kW funcționează identic cu orice EV — nu necesită echipament special."] }] }),
  vehiclePage({ slug: "statie-incarcare-kia", brand: "Kia", acMax: "11 kW", dcMax: "220 kW CCS2", recommendedKw: "11 kW trifazat", battery: "58–77 kWh", connector: "Type 2 / CCS2", metaTitle: "Stație încărcare Kia EV6, Niro EV, EV9 | ChargePro", metaDescription: "Stație încărcare Kia EV6, Niro EV: wallbox 11 kW Type 2. Instalare ANRE, livrare România.", h1: "Stație încărcare Kia — EV6, Niro EV, EV9", intro: "Kia EV6 share platformă E-GMP cu Ioniq 5 — aceleași recomandări AC: 11 kW trifazat acasă. Niro EV: 11 kW suficient; baterie mai mică, încărcare completă în 5–6 ore.", extraSections: [] }),
  vehiclePage({ slug: "statie-incarcare-volkswagen", brand: "Volkswagen", acMax: "11 kW (ID.7: 22 kW)", dcMax: "170 kW CCS2", recommendedKw: "11 kW trifazat", battery: "52–86 kWh", connector: "Type 2 / CCS2", metaTitle: "Stație încărcare VW ID.3, ID.4, ID.5 — 11 kW | ChargePro", metaDescription: "Wallbox Volkswagen ID.3, ID.4, ID.5: stație 11 kW Type 2. Instalare ANRE, consultanță ChargePro.", h1: "Stație încărcare Volkswagen ID — ID.3, ID.4, ID.5", intro: "Volkswagen ID.3, ID.4, ID.5 acceptă 11 kW AC trifazat standard. MEB platform — CCS2 DC până la 170 kW. Wallbox 11 kW acoperă 95% din scenariile rezidențiale VW.", extraSections: [] }),
  vehiclePage({ slug: "statie-incarcare-audi", brand: "Audi", acMax: "11 kW (e-tron: 22 kW)", dcMax: "150–270 kW CCS2", recommendedKw: "22 kW trifazat", battery: "71–114 kWh", connector: "Type 2 / CCS2", metaTitle: "Stație încărcare Audi e-tron — 22 kW AC | ChargePro", metaDescription: "Stație 22 kW pentru Audi e-tron, Q4 e-tron, e-tron GT. Wallbox trifazat, instalare ANRE România.", h1: "Stație încărcare Audi e-tron — wallbox 22 kW trifazat", intro: "Audi e-tron și e-tron GT acceptă 22 kW AC — maxim din segment. Q4 e-tron: 11 kW standard, 22 kW opțional. Pentru e-tron full-size, recomandăm stație 22 kW.", extraSections: [], productFilter: { categorySlug: "statii-ac", phases: "THREE", powerKwMin: 11 } }),
  vehiclePage({ slug: "statie-incarcare-skoda", brand: "Skoda", acMax: "11 kW", dcMax: "170 kW CCS2", recommendedKw: "11 kW trifazat", battery: "52–77 kWh", connector: "Type 2 / CCS2", metaTitle: "Stație încărcare Skoda Enyaq — wallbox 11 kW | ChargePro", metaDescription: "Wallbox Skoda Enyaq iV: 11 kW Type 2 acasă. Platformă MEB VW — instalare ANRE ChargePro.", h1: "Stație încărcare Skoda Enyaq — wallbox 11 kW", intro: "Skoda Enyaq iV (MEB) acceptă 11 kW AC și DC 170 kW. Cel mai vândut SUV electric Skoda în România — wallbox 11 kW acasă, încărcare completă ~7 ore pentru bateria 77 kWh.", extraSections: [] }),
];
