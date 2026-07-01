import type { CommercialLandingPageData } from "@/lib/seo/commercial/types";

export interface LandingConversion {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  ctaPrimary: string;
  ctaSecondary: string;
  toolLinks: { href: string; label: string }[];
}

/** Override-uri CTR + conversie — doar pagini High priority. */
const CONVERSION_OVERRIDES: Partial<Record<string, LandingConversion>> = {
  "statie-incarcare-ac": {
    metaTitle: "Stație încărcare AC — preț de la 2.899 RON | Ofertă gratuită",
    metaDescription:
      "Cumpără stație AC 7–22 kW Type 2. Livrare România, instalare ANRE, consultanță gratuită. Compară modele și primește ofertă în 24h.",
    h1: "Stație încărcare AC — cumpără wallbox cu instalare în România",
    intro:
      "Alege stația AC potrivită rețelei tale (monofazat sau trifazat), vehiculului și bugetului. Primești ofertă personalizată cu echipament, instalare și termen livrare — fără obligație.",
    ctaPrimary: "Primește ofertă AC gratuită",
    ctaSecondary: "Vezi stații AC în catalog",
    toolLinks: [
      { href: "/tools/calculator-putere-recomandata", label: "Calculator putere" },
      { href: "/tools/calculator-timp-incarcare", label: "Timp încărcare" },
    ],
  },
  "statie-incarcare-dc": {
    metaTitle: "Stație încărcare DC rapidă — 30–120 kW | Consultanță firmă",
    metaDescription:
      "Stații DC CCS2 pentru retail, flote și parcări. Dimensionare, OCPP, ofertă completă instalare. ChargePro — proiecte comerciale România.",
    h1: "Stație încărcare DC — soluții rapide pentru afaceri",
    intro:
      "Proiectezi infrastructură DC? Analizăm traficul, puterea disponibilă și ROI-ul. Ofertă cu echipament certificat, integrare plată și suport post-instalare.",
    ctaPrimary: "Solicită audit DC gratuit",
    ctaSecondary: "Vezi stații DC",
    toolLinks: [
      { href: "/tools/calculator-amortizare-firma", label: "Amortizare investiție" },
      { href: "/tools/calculator-roi", label: "Calculator ROI" },
    ],
  },
  "statie-incarcare-rapida": {
    metaTitle: "Stație încărcare rapidă EV — DC 50+ kW | Ofertă comercială",
    metaDescription:
      "Stație rapidă mașini electrice: 20–45 min per sesiune. Ideal retail, hotel, flotă. Consultanță și instalare ANRE — ChargePro România.",
    h1: "Stație încărcare rapidă — DC pentru trafic intens",
    intro:
      "Ai nevoie de rotație rapidă a vehiculelor? Comparăm 30, 60 și 120 kW în funcție de buget și grad de utilizare. Primești simulare ROI înainte de comandă.",
    ctaPrimary: "Calculează ROI stație rapidă",
    ctaSecondary: "Contactează consultant",
    toolLinks: [{ href: "/tools/calculator-amortizare-firma", label: "Amortizare firmă" }],
  },
  "statie-incarcare-7kw": {
    metaTitle: "Stație încărcare 7 kW — de la 2.899 RON | Acasă & Dacia Spring",
    metaDescription:
      "Wallbox 7,4 kW monofazat Type 2. Perfect Dacia Spring, apartamente. Preț, instalare ANRE, livrare rapidă. Ofertă gratuită ChargePro.",
    h1: "Stație încărcare 7 kW — wallbox monofazat acasă",
    intro:
      "Cea mai populară alegere pentru prima mașină electrică în România. Verificăm tabloul electric și îți recomandăm modelul potrivit — livrare 3–7 zile din stoc.",
    ctaPrimary: "Ofertă wallbox 7 kW",
    ctaSecondary: "Calculator timp încărcare",
    toolLinks: [
      { href: "/tools/calculator-timp-incarcare", label: "Timp încărcare" },
      { href: "/tools/calculator-cost-incarcare", label: "Cost lunar" },
    ],
  },
  "statie-incarcare-11kw": {
    metaTitle: "Stație încărcare 11 kW trifazat — Tesla, BMW, VW | ChargePro",
    metaDescription:
      "Wallbox 11 kW Type 2 pentru vehicule premium. Instalare trifazat, app smart, garanție. Ofertă personalizată — livrare România.",
    h1: "Stație încărcare 11 kW — trifazat pentru EV premium",
    intro:
      "Ideal pentru Tesla Model 3/Y, BMW i4, VW ID — încărcare completă peste noapte. Confirmăm compatibilitatea trifazat înainte de comandă.",
    ctaPrimary: "Verifică compatibilitate 11 kW",
    ctaSecondary: "Vezi produse 11 kW",
    toolLinks: [{ href: "/tools/recomandare-statie", label: "Wizard recomandare" }],
  },
  "statie-incarcare-22kw": {
    metaTitle: "Stație încărcare 22 kW — firmă & parcare | Ofertă 24h",
    metaDescription:
      "Stație AC 22 kW trifazat cu OCPP, RFID. Pentru firme, hoteluri, parcări. Preț transparent, instalare ANRE. Solicită ofertă ChargePro.",
    h1: "Stație încărcare 22 kW — maxim AC pentru business",
    intro:
      "Cel mai căutat wallbox comercial din România. Dimensionăm numărul de puncte, load balancing și facturare — ofertă completă în 24h lucrătoare.",
    ctaPrimary: "Ofertă stație 22 kW firmă",
    ctaSecondary: "Studii de caz business",
    toolLinks: [
      { href: "/tools/calculator-amortizare-firma", label: "Amortizare" },
      { href: "/studii-de-caz", label: "Studii de caz" },
    ],
  },
  "statie-incarcare-tesla": {
    metaTitle: "Stație încărcare Tesla Model 3/Y — 11 kW Type 2 | ChargePro",
    metaDescription:
      "Wallbox compatibil Tesla acasă — 11 kW trifazat, alternativă la Wall Connector. Instalare ANRE, preț competitiv. Ofertă gratuită.",
    h1: "Stație încărcare Tesla — wallbox acasă Model 3 și Model Y",
    intro:
      "Tesla acceptă 11 kW AC trifazat (CCS2 DC la public). Recomandăm wallbox Type 2 certificat — instalare coordonată, test sesiune completă inclus.",
    ctaPrimary: "Ofertă wallbox Tesla",
    ctaSecondary: "Calculator timp încărcare",
    toolLinks: [{ href: "/tools/calculator-timp-incarcare", label: "Timp încărcare Tesla" }],
  },
  "statie-incarcare-dacia-spring": {
    metaTitle: "Stație încărcare Dacia Spring — 7,4 kW de la 2.899 RON",
    metaDescription:
      "Wallbox pentru Dacia Spring: 7,4 kW monofazat, Type 2. Cel mai accesibil pachet acasă din România. Instalare ANRE — ofertă gratuită.",
    h1: "Stație încărcare Dacia Spring — wallbox 7,4 kW acasă",
    intro:
      "Dacia Spring acceptă max 7,4 kW AC — stația 22 kW nu aduce beneficiu. Pachet complet echipament + consultanță instalare, optimizat pentru buget.",
    ctaPrimary: "Ofertă pachet Dacia Spring",
    ctaSecondary: "Calculator cost încărcare",
    toolLinks: [{ href: "/tools/calculator-cost-incarcare", label: "Cost vs benzină" }],
  },
  "statie-incarcare-bmw": {
    metaTitle: "Stație încărcare BMW i4/iX — wallbox 11 kW | ChargePro",
    metaDescription: "Wallbox BMW compatibil Type 2, 11 kW trifazat. Instalare ANRE, livrare România. Consultanță gratuită ChargePro.",
    h1: "Stație încărcare BMW — wallbox pentru gama electrică",
    intro: "BMW i4, iX3, iX — 11 kW AC standard. Verificăm onboard charger și recomandăm stația potrivită cu programare nocturnă.",
    ctaPrimary: "Ofertă wallbox BMW",
    ctaSecondary: "Wizard recomandare",
    toolLinks: [{ href: "/tools/recomandare-statie", label: "Wizard EV" }],
  },
  "statie-incarcare-byd": {
    metaTitle: "Stație încărcare BYD Atto 3 / Seal — 11 kW | Ofertă ChargePro",
    metaDescription: "Wallbox BYD Type 2, 7–11 kW. Atto 3, Dolphin, Seal — compatibilitate verificată. Instalare România.",
    h1: "Stație încărcare BYD — wallbox acasă sau firmă",
    intro: "BYD câștigă teren în România. Dimensionăm stația după puterea AC acceptată de modelul tău — ofertă fără obligație.",
    ctaPrimary: "Ofertă stație BYD",
    ctaSecondary: "Vezi catalog AC",
    toolLinks: [{ href: "/tools/calculator-putere-recomandata", label: "Putere recomandată" }],
  },
  "statie-incarcare-mercedes": {
    metaTitle: "Stație încărcare Mercedes EQ — EQA, EQB, EQC | ChargePro",
    metaDescription: "Wallbox Mercedes EQ 11–22 kW Type 2. Instalare ANRE, consultanță tehnică. Ofertă personalizată.",
    h1: "Stație încărcare Mercedes EQ — wallbox premium",
    intro: "EQA/EQB: 11 kW; EQS: până la 22 kW AC. Recomandăm stația corectă — evităm overspending pe putere neutilizată.",
    ctaPrimary: "Consultant Mercedes EQ",
    ctaSecondary: "Catalog stații AC",
    toolLinks: [],
  },
  "statie-incarcare-hyundai": {
    metaTitle: "Stație încărcare Hyundai Ioniq 5/6 — 11 kW wallbox",
    metaDescription: "Wallbox Hyundai Ioniq 5, Ioniq 6, Kona Electric. 11 kW AC acasă, DC rapid la public. Ofertă ChargePro.",
    h1: "Stație încărcare Hyundai — Ioniq 5, Ioniq 6, Kona",
    intro: "Ioniq 5/6: 11 kW AC acasă, 800V DC la stații publice. Recomandăm wallbox trifazat 11 kW — încărcare completă ~6 ore.",
    ctaPrimary: "Ofertă wallbox Hyundai",
    ctaSecondary: "Calculator timp",
    toolLinks: [{ href: "/tools/calculator-timp-incarcare", label: "Timp încărcare" }],
  },
  "statie-incarcare-kia": {
    metaTitle: "Stație încărcare Kia EV6 / Niro EV — 11 kW Type 2",
    metaDescription: "Wallbox Kia EV6, Niro EV — 11 kW trifazat. Instalare ANRE România. Ofertă gratuită ChargePro.",
    h1: "Stație încărcare Kia — EV6, Niro EV, EV9",
    intro: "Platformă E-GMP — aceleași recomandări ca Hyundai Ioniq: 11 kW AC acasă. Verificare trifazat inclusă în consultanță.",
    ctaPrimary: "Ofertă stație Kia",
    ctaSecondary: "Contact rapid",
    toolLinks: [],
  },
  "statie-incarcare-volkswagen": {
    metaTitle: "Stație încărcare VW ID.3 / ID.4 / ID.5 — 11 kW",
    metaDescription: "Wallbox Volkswagen ID Type 2, 11 kW. MEB platform — instalare ANRE. Preț și ofertă ChargePro.",
    h1: "Stație încărcare Volkswagen ID — wallbox 11 kW",
    intro: "ID.3, ID.4, ID.5 acceptă 11 kW AC. Pachet wallbox + instalare coordonată — un singur interlocutor ChargePro.",
    ctaPrimary: "Ofertă VW ID wallbox",
    ctaSecondary: "Vezi stații 11 kW",
    toolLinks: [],
  },
  "statie-incarcare-acasa": {
    metaTitle: "Stație încărcare acasă — pachet complet de la 4.000 RON",
    metaDescription:
      "Instalează wallbox acasă: echipament + electrician ANRE. 7–22 kW, Type 2. Ofertă gratuită, livrare România. ChargePro.",
    h1: "Stație încărcare acasă — pachet wallbox + instalare",
    intro:
      "Nu mai depinde de stații publice scumpe. Primești audit tablou electric, recomandare putere și ofertă totală (echipament + manoperă) — răspuns în 24h.",
    ctaPrimary: "Ofertă instalare acasă",
    ctaSecondary: "Calculator cost vs public",
    toolLinks: [
      { href: "/tools/calculator-cost-incarcare", label: "Cost încărcare" },
      { href: "/proiecte-realizate", label: "Proiecte rezidențiale" },
    ],
  },
  "statie-incarcare-firma": {
    metaTitle: "Stații încărcare firmă — parcare angajați & clienți | ChargePro",
    metaDescription:
      "Infrastructură EV firmă: 11–22 kW AC, OCPP, RFID. Deducere fiscală, ROI calculat. Audit gratuit — proiecte România.",
    h1: "Stație încărcare firmă — infrastructură EV pentru business",
    intro:
      "De la 2 wallbox-uri la 20+ puncte cu load balancing. Analizăm flota, parcarea și bugetul — propunere tehnică + financiară în 48h.",
    ctaPrimary: "Audit gratuit firmă",
    ctaSecondary: "Studii de caz business",
    toolLinks: [
      { href: "/tools/calculator-amortizare-firma", label: "Amortizare" },
      { href: "/studii-de-caz", label: "Studii de caz" },
    ],
  },
  "statie-incarcare-hotel": {
    metaTitle: "Stație încărcare hotel — perk premium oaspeți EV",
    metaDescription:
      "Wallbox hotel 11 kW overnight + DC opțional. Crește rating Booking, venit ancillary. Ofertă ChargePro — instalare ANRE.",
    h1: "Stație încărcare hotel — serviciu premium pentru oaspeți EV",
    intro:
      "Oaspeții EV aleg hoteluri cu încărcare. Propunem mix AC overnight + DC tranzit — simulare ROI din tarifare sau pachet cameră.",
    ctaPrimary: "Ofertă hotel EV",
    ctaSecondary: "Studiu de caz hotel",
    toolLinks: [{ href: "/studii-de-caz/hotel-boutique-cluj", label: "Studiu de caz hotel" }],
  },
  "statie-incarcare-bloc": {
    metaTitle: "Stație încărcare bloc — condominiu & parcare subterană",
    metaDescription:
      "Soluții EV bloc: wallbox per loc, load balancing, facturare individuală. Procedură asociație — ChargePro te ghidează.",
    h1: "Stație încărcare bloc — soluții condominiu",
    intro:
      "Instalare în bloc necesită acordul asociației. Oferim documentație tehnică pentru AGA, dimensionare coloană și ofertă per loc de parcare.",
    ctaPrimary: "Consultant bloc / AGA",
    ctaSecondary: "Studiu de caz condominiu",
    toolLinks: [{ href: "/studii-de-caz/bloc-bucuresti", label: "Studiu de caz bloc" }],
  },
  "statie-incarcare-wallbox": {
    metaTitle: "Wallbox Type 2 — de la 2.899 RON | Instalare ANRE",
    metaDescription:
      "Cumpără wallbox acasă 7–22 kW. Type 2, smart app, livrare România. Ofertă echipament + montaj ChargePro.",
    h1: "Wallbox — stație încărcare acasă Type 2",
    intro:
      "Wallbox-ul este soluția standard pentru încărcare AC acasă. Alegem puterea potrivită (7,4 / 11 / 22 kW) după vehicul și tablou electric.",
    ctaPrimary: "Ofertă wallbox complet",
    ctaSecondary: "Compară wallbox-uri",
    toolLinks: [{ href: "/tools/calculator-putere-recomandata", label: "Putere recomandată" }],
  },
  "statie-incarcare-monofazata": {
    metaTitle: "Stație monofazată 7,4 kW — Dacia Spring, apartament",
    metaDescription: "Wallbox monofazat 7,4 kW Type 2. Ideal apartamente și Dacia Spring. Instalare ANRE.",
    h1: "Stație încărcare monofazată — 7,4 kW acasă",
    intro: "Monofazat = maximum 7,4 kW. Perfect pentru prima mașină electrică și apartamente cu circuit 32A dedicat.",
    ctaPrimary: "Verifică monofazat",
    ctaSecondary: "Stații 7 kW",
    toolLinks: [{ href: "/tools/calculator-timp-incarcare", label: "Timp încărcare" }],
  },
  "statie-incarcare-trifazata": {
    metaTitle: "Stație trifazată 11–22 kW — Tesla, BMW, firmă",
    metaDescription: "Wallbox trifazat 11 sau 22 kW. Tesla, BMW, VW ID. Instalare ANRE România.",
    h1: "Stație încărcare trifazată — 11–22 kW",
    intro: "Trifazat deblochează 11 kW (vehicule premium) sau 22 kW (business). Confirmăm branșamentul înainte de comandă.",
    ctaPrimary: "Audit trifazat gratuit",
    ctaSecondary: "Stații 11 kW",
    toolLinks: [],
  },
  "statie-incarcare-pensiune": {
    metaTitle: "Stație încărcare pensiune — perk oaspeți EV",
    metaDescription: "Wallbox pensiune 7–11 kW overnight. Crește rezervările oaspeților EV. ChargePro România.",
    h1: "Stație încărcare pensiune — serviciu pentru oaspeți EV",
    intro: "Oaspeții cu mașini electrice caută pensiuni cu încărcare overnight. Soluție simplă AC 7–11 kW, cost redus vs DC.",
    ctaPrimary: "Ofertă pensiune EV",
    ctaSecondary: "Studii de caz hotel",
    toolLinks: [{ href: "/studii-de-caz/hotel-boutique-cluj", label: "Studiu de caz" }],
  },
  "statie-incarcare-flota": {
    metaTitle: "Stații încărcare flotă — AC + DC, OCPP",
    metaDescription: "Infrastructură flotă EV: wallbox AC overnight + DC rapid. OCPP, RFID, ROI calculat.",
    h1: "Stație încărcare flotă — infrastructură vehicule electrice",
    intro: "Dimensionăm mix AC/DC după tipul flotei, ture și buget. OCPP centralizat pentru rapoarte consum.",
    ctaPrimary: "Audit flotă gratuit",
    ctaSecondary: "Studiu de caz logistică",
    toolLinks: [
      { href: "/studii-de-caz/firma-logistica-timisoara", label: "Studiu de caz flotă" },
      { href: "/tools/calculator-amortizare-firma", label: "Amortizare" },
    ],
  },
  "statie-incarcare-audi": {
    metaTitle: "Stație încărcare Audi e-tron — 22 kW trifazat",
    metaDescription: "Wallbox Audi e-tron 22 kW AC. Q4, e-tron GT — instalare ANRE ChargePro.",
    h1: "Stație încărcare Audi e-tron — wallbox 22 kW",
    intro: "Audi e-tron full-size acceptă 22 kW AC — maxim din segment. Q4 e-tron: verificăm varianta 11 vs 22 kW.",
    ctaPrimary: "Ofertă Audi e-tron",
    ctaSecondary: "Stații 22 kW",
    toolLinks: [],
  },
  "statie-incarcare-skoda": {
    metaTitle: "Stație încărcare Skoda Enyaq — wallbox 11 kW",
    metaDescription: "Wallbox Skoda Enyaq iV 11 kW Type 2. Platformă MEB — instalare ANRE.",
    h1: "Stație încărcare Skoda Enyaq — wallbox 11 kW",
    intro: "Enyaq iV (MEB) — 11 kW AC standard. Încărcare completă baterie 77 kWh în ~7 ore overnight.",
    ctaPrimary: "Ofertă Enyaq wallbox",
    ctaSecondary: "Stații VW ID",
    toolLinks: [],
  },
};

export function applyLandingConversion(
  page: CommercialLandingPageData
): CommercialLandingPageData {
  const c = CONVERSION_OVERRIDES[page.slug];
  if (!c) return page;

  return {
    ...page,
    metaTitle: c.metaTitle,
    metaDescription: c.metaDescription,
    h1: c.h1,
    intro: c.intro,
    catalogCtaLabel: c.ctaSecondary,
  };
}

export function getLandingConversion(slug: string): LandingConversion | undefined {
  return CONVERSION_OVERRIDES[slug];
}
