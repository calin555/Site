import type { CommercialLandingPageData } from "@/lib/seo/commercial/types";
import { BASE_LINKS } from "@/lib/seo/commercial/pages/types-stations";

interface UseCaseConfig {
  slug: string;
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: CommercialLandingPageData["sections"];
  productFilter: CommercialLandingPageData["productFilter"];
  relatedSlugs: string[];
  catalogHref: string;
  comparisonTable?: CommercialLandingPageData["comparisonTable"];
}

function useCasePage(c: UseCaseConfig): CommercialLandingPageData {
  return {
    slug: c.slug,
    silo: "use-cases",
    siloLabel: "Utilizare",
    primaryKeyword: c.keyword,
    secondaryKeywords: [
      c.keyword.replace("stație", "wallbox"),
      `${c.keyword} România`,
      "instalare ANRE",
    ],
    metaTitle: c.metaTitle,
    metaDescription: c.metaDescription,
    h1: c.h1,
    intro: c.intro,
    sections: c.sections,
    comparisonTable: c.comparisonTable,
    prosCons: {
      pros: ["Soluție personalizată ChargePro", "Instalare ANRE autorizată", "Suport tehnic în română", "Finanțare disponibilă"],
      cons: ["Necesită evaluare tehnică prealabilă", "Timeline instalare 2–8 săptămâni"],
    },
    faq: [
      { question: "Cât durează instalarea?", answer: "Rezidențial: 1–2 zile. Comercial: 1–4 săptămâni în funcție de avize și putere." },
      { question: "Oferiți consultanță gratuită?", answer: "Da — audit telefonic sau la fața locului, dimensionare și ofertă fără obligație." },
      { question: "Există finanțare?", answer: "ElectricUP, AFM, PNRR — eligibilitate în funcție de tip beneficiar. ChargePro asistă documentația." },
      { question: "Ce garanție include?", answer: "2–5 ani echipament + proces verbal instalare ANRE pentru conformitate." },
    ],
    productFilter: c.productFilter,
    relatedLandingSlugs: c.relatedSlugs,
    relatedArticleSlugs: ["instalare-statii-ac-spatii-comerciale", "cum-alegi-statia-de-incarcare-potrivita"],
    relatedProductLinks: [BASE_LINKS.ac, BASE_LINKS.dc, { href: "/contact", label: "Solicită audit gratuit" }],
    catalogCtaHref: c.catalogHref,
    catalogCtaLabel: "Vezi produse recomandate",
    imageAlt: c.keyword,
  };
}

export const USE_CASE_PAGES: CommercialLandingPageData[] = [
  useCasePage({
    slug: "statie-incarcare-acasa",
    keyword: "stație încărcare acasă",
    metaTitle: "Stație încărcare acasă — wallbox 7–22 kW | ChargePro",
    metaDescription: "Instalează stație încărcare acasă: wallbox 7.4–22 kW, Type 2, programare nocturnă. Preț, instalare ANRE, livrare România.",
    h1: "Stație încărcare acasă — wallbox personal pentru garaj",
    intro: "Stația de încărcare acasă elimină dependența de stații publice scumpe și ocupate. Wallbox dedicat oferă 7–22 kW sigur, programare tarif nocturn și cost sub 0,50 RON/km — față de 1,00+ RON/km la public.",
    sections: [
      { h2: "Alegerea stației pentru locuință", paragraphs: ["Case monofazat: 7,4 kW. Case trifazat: 11 kW (Tesla, BMW) sau 22 kW (Audi, Porsche). Apartament cu loc parcare: verificați acordul asociației.", "Garaj vs carport vs exterior: IP54–IP65 pentru montaj exterior. ChargePro recomandă modelul potrivit după audit gratuit."] },
      { h2: "Cost total acasă 2026", paragraphs: ["Echipament 2.500–8.000 RON + instalare 1.500–5.000 RON. Finanțare ElectricUP pentru persoane juridice. Amortizare 12–24 luni vs încărcare publică.", "Integrare solar: wallbox smart cu surplus charging — încărcare gratuită în orele însorite."] },
      { h2: "Pași instalare", paragraphs: ["1. Consultanță ChargePro. 2. Audit tablou electric. 3. Comandă echipament. 4. Instalare electrician ANRE. 5. Recepție și configurare app.", "Timeline total: 1–3 săptămâni rezidențial standard."] },
    ],
    productFilter: { categorySlug: "statii-ac" },
    relatedSlugs: ["statie-incarcare-7kw", "statie-incarcare-wallbox", "statie-incarcare-monofazata", "statie-incarcare-dacia-spring"],
    catalogHref: "/produse/categorie/statii-ac",
  }),
  useCasePage({
    slug: "statie-incarcare-firma",
    keyword: "stație încărcare firmă",
    metaTitle: "Stație încărcare firmă — parcare angajați & clienți | ChargePro",
    metaDescription: "Stații încărcare pentru firmă: AC 11–22 kW, DC 60 kW, OCPP, RFID, facturare. Flote, birouri, retail. Instalare ANRE România.",
    h1: "Stație încărcare firmă — infrastructură EV pentru angajați și clienți",
    intro: "Firmele instalează stații EV pentru a reține talente, reduce amprenta de carbon și genera venit din parcarea clienților. ChargePro proiectează de la 2 wallbox-uri la hub-uri 20+ puncte cu load balancing și platformă OCPP.",
    sections: [
      { h2: "Beneficii pentru companii", paragraphs: ["Retenție angajați EV — perk valoros. Deducere fiscală active corporative. Certificări ESG și raportare sustenabilitate.", "Venit din tarifare clienți/vizitatori — RFID, POS, app."] },
      { h2: "Arhitectură recomandată firmă", paragraphs: ["Birou 50–200 angajați: 4–10× AC 11 kW + load balancing. Logistică: DC 60 kW la bază + AC noapte. Retail: mix AC clienți + DC tranzit.", "Platformă CSMS centralizată — rapoarte consum, alocare cost centre, API ERP."] },
      { h2: "Finanțare firmă", paragraphs: ["Leasing operațional, amortizare accelerată, granturi ElectricUP pentru entități eligibile. ChargePro oferă devize conform cerințelor grant."] },
    ],
    comparisonTable: { headers: ["Dimensiune firmă", "Stații recomandate", "Investiție orientativă"], rows: [["10–30 angajați", "2–4 AC 11 kW", "15.000–40.000 RON"], ["50–100 angajați", "6–12 AC 11–22 kW", "50.000–120.000 RON"], ["Flotă 20+ vehicule", "DC 60 kW + AC", "150.000–400.000 RON"]] },
    productFilter: { categorySlug: "statii-ac" },
    relatedSlugs: ["statie-incarcare-flota", "statie-incarcare-22kw", "statie-incarcare-60kw"],
    catalogHref: "/produse",
  }),
  useCasePage({
    slug: "statie-incarcare-hotel",
    keyword: "stație încărcare hotel",
    metaTitle: "Stație încărcare hotel — serviciu premium oaspeți EV | ChargePro",
    metaDescription: "Stații încărcare hotel: AC 11 kW overnight + DC 60 kW tranzit. OCPP, facturare cameră, instalare ANRE. ChargePro România.",
    h1: "Stație încărcare hotel — infrastructură EV pentru oaspeți",
    intro: "Hotelurile cu stații EV cresc ratingul Booking.com, atrag clienți premium și justifică tarife superioare. Mix recomandat: AC 11 kW pentru oaspeți overnight + DC 60 kW opțional pentru tranzit.",
    sections: [
      { h2: "Model business hotel", paragraphs: ["Încărcare inclusă în tarif cameră — perk premium. Tarifare separată kWh — venit ancillary. Parteneriat cu rețele roaming.", "Stații vizibile la intrare — marketing mobilitate verde."] },
      { h2: "Finanțare sector hotelier", paragraphs: ["Granturi AFM/PNRR pentru turism sustenabil. Amortizare 18–36 luni cu tarifare oaspeți. ChargePro case study: hotel 4* Brașov — 4× AC 11 kW, ROI 24 luni."] },
    ],
    productFilter: { categorySlug: "statii-ac", powerKwMin: 7 },
    relatedSlugs: ["statie-incarcare-pensiune", "statie-incarcare-11kw", "statie-incarcare-firma"],
    catalogHref: "/produse/categorie/statii-ac",
  }),
  useCasePage({
    slug: "statie-incarcare-pensiune",
    keyword: "stație încărcare pensiune",
    metaTitle: "Stație încărcare pensiune — atrage turiști EV | ChargePro",
    metaDescription: "Wallbox pensiune 7–11 kW pe DN-uri turistice. Instalare simplă, cost redus, diferențiator Booking. ChargePro România.",
    h1: "Stație încărcare pensiune — diferențiator pentru turiști electrici",
    intro: "Pensiunile de pe trasee turistice (Transfăgărășan, Delta, Maramureș) beneficiază disproporționat de stații EV — oprire overnight cu încărcare inclusă. Investiție modestă: 1–2× AC 7–11 kW.",
    sections: [
      { h2: "De ce pensiuni investesc în EV", paragraphs: ["Turiști EV planifică ruta după overnight charging. O pensiune cu wallbox apare pe PlugShare, Electroverse — marketing gratuit.", "Cost instalare 5.000–12.000 RON — recuperat prin 10–20 sejururi premium/an."] },
    ],
    productFilter: { categorySlug: "statii-ac", powerKwMax: 11 },
    relatedSlugs: ["statie-incarcare-hotel", "statie-incarcare-acasa", "statie-incarcare-7kw"],
    catalogHref: "/produse/categorie/statii-ac",
  }),
  useCasePage({
    slug: "statie-incarcare-bloc",
    keyword: "stație încărcare bloc",
    metaTitle: "Stație încărcare bloc — condominiu & parcare subterană | ChargePro",
    metaDescription: "Stații încărcare bloc de locuințe: wallbox per loc, facturare individuală, load balancing. Procedură asociație, ANRE.",
    h1: "Stație încărcare bloc — soluții pentru condominiu",
    intro: "Instalarea stațiilor în bloc necesită acordul asociației, aviz tehnic și soluție de facturare individuală. ChargePro a implementat proiecte cu 4–40 de locuri — load balancing, RFID per apartament, subcontorizare.",
    sections: [
      { h2: "Procedură legală bloc", paragraphs: ["Adunare generală — majoritate calificată. Aviz administrator + furnizor energie. Proiect electric ANRE.", "Timeline tipic: 30–90 zile de la decizie la punere în funcțiune."] },
      { h2: "Arhitectură tehnică bloc", paragraphs: ["Coloană electrică dedicată parcare subterană. Load balancing 4–20 stații pe putere disponibilă. RFID sau app per loc.", "Parcări subterane: atenție ventilație, IP rating, distanță cablu."] },
    ],
    productFilter: { categorySlug: "statii-ac" },
    relatedSlugs: ["statie-incarcare-monofazata", "statie-incarcare-acasa", "statie-incarcare-7kw"],
    catalogHref: "/produse/categorie/statii-ac",
  }),
  useCasePage({
    slug: "statie-incarcare-flota",
    keyword: "stație încărcare flotă",
    metaTitle: "Stație încărcare flotă — DC 60 kW + AC hub | ChargePro",
    metaDescription: "Infrastructură încărcare flotă electrică: DC rapid, AC overnight, OCPP, management centralizat. Curierat, ridesharing, logistică.",
    h1: "Stație încărcare flotă — hub DC + AC pentru vehicule comerciale",
    intro: "Flotele electrice necesită mix DC (rotație zi) + AC (încărcare noapte). ChargePro dimensionează hub-uri pentru curierat, ridesharing, logistică last-mile — 60–120 kW DC + 10–50× AC cu platformă OCPP.",
    sections: [
      { h2: "Dimensionare flotă", paragraphs: ["Regulă: km/zi ÷ autonomie/kWh × putere disponibilă. Flotă 10 vehicule urbane: 2× DC 60 kW + 8× AC 11 kW. Flotă 50+: hub 120 kW + load management.", "Depot charging overnight: AC suficient dacă timp staționare 8+ ore."] },
      { h2: "TCO flotă electrică", paragraphs: ["Cost/km electric: 0,15–0,30 RON vs 0,50–0,80 RON diesel. Stația se amortizește din diferența combustibil în 18–36 luni.", "Mentenanță vehicul EV redusă — ROI total superior."] },
    ],
    comparisonTable: { headers: ["Tip flotă", "Configurație", "Vehicule"], rows: [["Curierat urban", "DC 60 + AC overnight", "10–30"], ["Ridesharing", "DC 60 hub", "5–15"], ["Logistică", "DC 120 + AC bază", "20–100"]] },
    productFilter: { categorySlug: "statii-dc", powerKwMin: 30 },
    relatedSlugs: ["statie-incarcare-firma", "statie-incarcare-60kw", "statie-incarcare-rapida"],
    catalogHref: "/produse/categorie/statii-dc",
  }),
];
