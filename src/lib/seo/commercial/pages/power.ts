import type { CommercialLandingPageData } from "@/lib/seo/commercial/types";
import { BASE_LINKS } from "@/lib/seo/commercial/pages/types-stations";

function powerPage(
  slug: string,
  kw: number,
  opts: Partial<CommercialLandingPageData> & Pick<CommercialLandingPageData, "metaTitle" | "metaDescription" | "h1" | "intro" | "sections" | "faq">
): CommercialLandingPageData {
  const isDc = kw >= 30;
  return {
    slug,
    silo: "power",
    siloLabel: "Putere (kW)",
    primaryKeyword: `stație încărcare ${kw} kW`,
    secondaryKeywords: [
      `wallbox ${kw} kW`,
      `încărcător ${kw} kW EV`,
      `stație ${kw} kW România`,
    ],
    productFilter: isDc
      ? { categorySlug: "statii-dc", powerKwMin: kw * 0.8, powerKwMax: kw * 1.2 }
      : { categorySlug: "statii-ac", powerKwMin: kw * 0.9, powerKwMax: kw * 1.1 },
    relatedLandingSlugs: [],
    relatedArticleSlugs: ["comparatie-statii-7kw-vs-22kw-acasa", "cum-alegi-statia-de-incarcare-potrivita"],
    relatedProductLinks: [
      isDc ? BASE_LINKS.dc : BASE_LINKS.ac,
      { href: "/tools/recomandare-statie", label: "Wizard recomandare stație" },
    ],
    catalogCtaHref: isDc ? "/produse/categorie/statii-dc" : "/produse/categorie/statii-ac",
    catalogCtaLabel: `Vezi stații ${kw} kW`,
    imageAlt: `Stație încărcare ${kw} kW pentru vehicule electrice`,
    ...opts,
  };
}

export const POWER_PAGES: CommercialLandingPageData[] = [
  powerPage("statie-incarcare-7kw", 7.4, {
    metaTitle: "Stație încărcare 7 kW — wallbox monofazat acasă | ChargePro",
    metaDescription:
      "Stație încărcare 7 kW (7,4 kW) monofazată Type 2. Ideală Dacia Spring, apartamente, case. Preț, instalare ANRE, livrare România.",
    h1: "Stație încărcare 7 kW — wallbox monofazat pentru acasă",
    intro:
      "Stația de 7 kW (7,4 kW real pe monofazat 32A) este cea mai vândută categorie din România — echilibrul perfect între cost, viteză și compatibilitate cu rețeaua 230V. Adaugă 35–45 km autonomie pe oră și încarcă complet un Dacia Spring sau Renault Zoe în 6–8 ore peste noapte.",
    sections: [
      {
        h2: "Pentru ce mașini este potrivită stația 7 kW",
        paragraphs: [
          "Dacia Spring (7,4 kW AC max), Renault Zoe, Fiat 500e, Honda e, Smart EQ — vehicule urbane cu baterie 25–45 kWh. Tesla Model 3 va accepta 7 kW dar nu exploatează potentialul de 11 kW — pentru Tesla recomandăm 11 kW trifazat dacă rețeaua permite.",
          "Flote urbane de livrare cu vehicule mici dimensionează 7 kW per loc — cost per punct minim, instalare simplă, suficient pentru încărcare nocturnă sau schimb de tură de 8 ore.",
        ],
      },
      {
        h2: "Instalare stație 7 kW",
        paragraphs: [
          "Circuit dedicat 32A monofazat, cablu 3×6 mm², RCBO Tip A. Distanță maximă recomandată tablou-stație: 15 m (pierderi minime). ChargePro include checklist tablou electric în consultanța pre-vânzare.",
          "Preț orientativ 2026: echipament 2.500–4.500 RON + instalare 1.500–3.000 RON. Finanțări ElectricUP pot acoperi parțial costul pentru entități eligibile.",
        ],
      },
      {
        h2: "7 kW vs 11 kW — merită upgrade?",
        paragraphs: [
          "Dacă vehiculul acceptă doar 7,4 kW AC, 11 kW nu aduce beneficiu. Dacă planificați Tesla, BMW sau VW ID în următorii 3 ani și aveți trifazat disponibil, investiția în 11 kW acum evită reinstalarea cablajului.",
        ],
      },
    ],
    comparisonTable: {
      headers: ["", "7 kW monofazat", "11 kW trifazat", "22 kW trifazat"],
      rows: [
        ["Timp 50 kWh", "~7 h", "~5 h", "~2,5 h"],
        ["Cost echipament", "2.500–4.500 RON", "3.500–6.000 RON", "5.000–10.000 RON"],
        ["Rețea", "230V", "400V", "400V"],
      ],
    },
    prosCons: {
      pros: ["Cel mai accesibil", "Compatibil monofazat", "Suficient urban zilnic"],
      cons: ["Lent pentru baterii mari", "Sub potential Tesla/BMW"],
    },
    faq: [
      { question: "7 kW sau 7,4 kW — care e diferența?", answer: "7,4 kW este puterea reală pe monofazat 32A; „7 kW” este rotunjirea comercială — același produs." },
      { question: "Cât consumă o stație 7 kW?", answer: "La putere maximă, 7,4 kWh pe oră din rețea (+ pierderi ~10%)." },
    ],
    relatedLandingSlugs: ["statie-incarcare-11kw", "statie-incarcare-monofazata", "statie-incarcare-dacia-spring", "statie-incarcare-acasa"],
  }),
  powerPage("statie-incarcare-11kw", 11, {
    metaTitle: "Stație încărcare 11 kW trifazat — Tesla, BMW | ChargePro",
    metaDescription: "Stație 11 kW trifazată Type 2 pentru Tesla Model 3, BMW i4, VW ID. Wallbox smart, instalare ANRE, livrare România.",
    h1: "Stație încărcare 11 kW — trifazat pentru vehicule premium",
    intro: "11 kW trifazat este sweet spot-ul pentru Tesla Model 3/Y, BMW i4, Mercedes EQA și majoritatea EV-urilor mid-range lansate după 2022. Oferă ~55 km/oră — o noapte completă pentru orice baterie sub 80 kWh.",
    sections: [
      { h2: "De ce 11 kW este standardul premium AC", paragraphs: ["Producătorii auto optimizează onboard charger la 11 kW trifazat — echilibru cost/greutate/căldură. Stația 22 kW costă mai mult dar nu accelerează încărcarea dacă vehiculul limitează la 11 kW.", "Pentru case cu trifazat disponibil, 11 kW este recomandarea ChargePro default pentru vehicule din segmentul C și D."] },
      { h2: "Instalare 11 kW", paragraphs: ["5×6 mm² trifazat, siguranță 20A/fază, RCBO. Verificare dezechilibru faze — important în case cu multe circuit monofazate.", "Integrare solar: wallbox-uri 11 kW cu funcție surplus charging redirecționează excedentul PV către vehicul."] },
    ],
    prosCons: { pros: ["Ideal Tesla/BMW/VW", "Raport preț/performanță excelent"], cons: ["Necesită trifazat", "Overkill pentru Dacia Spring"] },
    faq: [{ question: "Tesla Model 3 cât acceptă AC?", answer: "11 kW trifazat (3×16A). Stația 11 kW este match perfect." }],
    relatedLandingSlugs: ["statie-incarcare-7kw", "statie-incarcare-22kw", "statie-incarcare-tesla", "statie-incarcare-trifazata"],
  }),
  powerPage("statie-incarcare-22kw", 22, {
    metaTitle: "Stație încărcare 22 kW — comercial & premium | ChargePro",
    metaDescription: "Stație 22 kW trifazată pentru firme, hoteluri, Audi e-tron, Porsche Taycan. OCPP, RFID, load balancing. Instalare ANRE România.",
    h1: "Stație încărcare 22 kW — maxim AC pentru firme și vehicule premium",
    intro: "22 kW este puterea maximă AC standard — ~110 km autonomie/oră. Necesară pentru Audi e-tron, Porsche Taycan, Mercedes EQS și parcări comerciale cu rotație medie. Multiple stații 22 kW necesită load balancing.",
    sections: [
      { h2: "Aplicații 22 kW", paragraphs: ["Parcări firme — angajați cu vehicule premium, timp de staționare 4–6 ore. Hoteluri — oaspeți cu Tesla/Porsche. Retail — 2–4 stații cu plată RFID.", "Load balancing dinamic distribuie 22 kW × N stații pe puterea disponibilă — evită declanșarea siguranței generale."] },
      { h2: "Cost și ROI", paragraphs: ["Echipament 5.000–12.000 RON/stație. Instalare 3.000–8.000 RON cu cablaj trifazat lung. ROI pentru firmă: retenție angajați, deducere fiscală, imagine ESG."] },
    ],
    comparisonTable: { headers: ["Vehicul", "AC max", "Timp 80% cu 22 kW"], rows: [["Dacia Spring", "7,4 kW", "N/A — folosiți 7 kW"], ["Tesla Model 3", "11 kW", "N/A — folosiți 11 kW"], ["Audi e-tron", "22 kW", "~2,5 h"], ["Porsche Taycan", "22 kW", "~2 h"]] },
    prosCons: { pros: ["Viteză maximă AC", "Ideal parcări comerciale"], cons: ["Investiție mare", "Necesită studiu putere"] },
    faq: [{ question: "Pot instala 22 kW acasă?", answer: "Da, dacă aveți trifazat și vehicul compatibil. Pentru Dacia Spring sau Tesla 11 kW, 22 kW este overkill." }],
    relatedLandingSlugs: ["statie-incarcare-11kw", "statie-incarcare-firma", "statie-incarcare-trifazata"],
  }),
  powerPage("statie-incarcare-30kw", 30, {
    metaTitle: "Stație încărcare 30 kW DC — retail & pensiuni | ChargePro",
    metaDescription: "Stație DC 30 kW CCS2 — încărcare rapidă accesibilă pentru retail, pensiuni, flote mici. Instalare, OCPP, livrare România.",
    h1: "Stație încărcare 30 kW DC — intrare în segmentul rapid",
    intro: "30 kW DC este poarta de intrare în încărcare rapidă — cost sub 60 kW, suficient pentru retail, pensiuni pe traseu turistic și flote mici. Timp 20–80%: ~60 min pentru 60 kWh.",
    sections: [
      { h2: "Cine alege 30 kW DC", paragraphs: ["Pensiuni și hoteluri pe DN-uri — oaspeți în tranzit. Supermarket-uri regionale — diferențiator față de concurență. Flote locale de ridesharing — 1–2 vehicule simultan.", "Upgrade path: multe stații 30 kW permit adăugare module putere la 60 kW fără înlocuire completă."] },
    ],
    prosCons: { pros: ["Cost DC redus", "Rapid vs AC"], cons: ["Mai lent decât 60+ kW", "Tot necesită aviz putere"] },
    faq: [{ question: "30 kW e suficient pentru autostradă?", answer: "Pentru tranzit intens recomandăm 60 kW+. 30 kW e ideal pentru opriri de 45–60 min (mâncare, cumpărături)." }],
    relatedLandingSlugs: ["statie-incarcare-60kw", "statie-incarcare-rapida", "statie-incarcare-pensiune"],
    productFilter: { categorySlug: "statii-dc", powerKwMin: 25, powerKwMax: 40 },
  }),
  powerPage("statie-incarcare-60kw", 60, {
    metaTitle: "Stație încărcare 60 kW DC — flote & retail | ChargePro",
    metaDescription: "Stație rapidă 60 kW DC CCS2 pentru flote, mall-uri, hoteluri. Plată integrată, OCPP, instalare ANRE. Ofertă ChargePro România.",
    h1: "Stație încărcare 60 kW — cel mai popular fast charger comercial",
    intro: "60 kW DC este standardul de facto pentru retail, flote urbane și hub-uri regionale. Oferă echilibru optim între investiție, viteză (~35 min pentru 20–80%) și cerințe de putere electrică.",
    sections: [
      { h2: "Specificații tehnice 60 kW", paragraphs: ["Alimentare tipic 63A trifazat + convertor DC. Dual port opțional — 2 vehicule × 30 kW sau 1 × 60 kW. Ecran 10\", POS, RFID, OCPP 1.6J.", "Mentenanță: verificare contacte DC trimestrial, firmware updates remote."] },
      { h2: "Finanțare 60 kW", paragraphs: ["ElectricUP, PNRR și programe locale acoperă parțial echipamentul. ChargePro asistă la documentația tehnică pentru grant."] },
    ],
    prosCons: { pros: ["ROI demonstrat retail", "Standard flote"], cons: ["Investiție 80k+ RON"] },
    faq: [{ question: "Câte vehicule simultan la 60 kW?", answer: "Single port: 1 vehicul × 60 kW. Dual: 2 × 30 kW tipic." }],
    relatedLandingSlugs: ["statie-incarcare-120kw", "statie-incarcare-flota", "statie-incarcare-rapida"],
  }),
  powerPage("statie-incarcare-120kw", 120, {
    metaTitle: "Stație încărcare 120 kW DC — hub & autostradă | ChargePro",
    metaDescription: "Stație ultra-rapidă 120 kW DC CCS2 pentru hub-uri, autostrăzi, centre logistice. Instalare completă, OCPP 2.0, ChargePro România.",
    h1: "Stație încărcare 120 kW — ultra-rapid pentru trafic intens",
    intro: "120 kW DC adresează hub-uri de mobilitate, stații de servicii și centre logistice cu rotație mare. Timp 20–80% sub 25 minute pentru majoritatea vehiculelor compatibile CCS2 800V.",
    sections: [
      { h2: "Infrastructură 120 kW", paragraphs: ["Necesită transformator dedicat sau extindere substation. Cablare BT cu secțiuni generoase. Fundație beton, protecție impact, iluminat.", "ChargePro coordonează proiectul complet — studiu fezabilitate, avize, execuție, recepție ANRE."] },
    ],
    prosCons: { pros: ["Experiență premium șofer", "Vizibilitate brand locație"], cons: ["CAPEX foarte ridicat"] },
    faq: [{ question: "Toate mașinile acceptă 120 kW?", answer: "Nu — vehiculul limitează la puterea BMS. 400V arhitectură plafonează ~100 kW; 800V (Hyundai Ioniq 5, Porsche) beneficiază complet." }],
    relatedLandingSlugs: ["statie-incarcare-60kw", "statie-incarcare-rapida", "statie-incarcare-firma"],
    productFilter: { categorySlug: "statii-dc", powerKwMin: 100 },
  }),
];
