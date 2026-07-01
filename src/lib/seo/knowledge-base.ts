import type { FaqItem } from "@/lib/seo/faq-content";

export interface KnowledgeCategory {
  id: string;
  title: string;
  description: string;
  items: FaqItem[];
}

const POWERS_KW = [3.7, 7.4, 11, 22, 30, 60, 120, 180] as const;

const CHARGER_BRANDS = [
  "ABB",
  "Autel",
  "Fronius",
  "Huawei",
  "Wallbox",
  "Vestel",
  "Alfen",
  "Schneider",
  "Legrand",
] as const;

const APPLICATIONS = [
  "Acasă",
  "Firmă",
  "Hotel",
  "Restaurant",
  "Mall",
  "Flotă",
  "Parcare publică",
  "Primărie",
  "Bloc de locuințe",
] as const;

const VEHICLE_BRANDS = [
  "Tesla",
  "BYD",
  "BMW",
  "Mercedes",
  "Hyundai",
  "Kia",
  "Volkswagen",
  "Dacia Spring",
] as const;

function powerCategory(): KnowledgeCategory {
  const items: FaqItem[] = POWERS_KW.flatMap((kw) => {
    const useCase =
      kw <= 7.4
        ? "wallbox monofazat rezidențial, apartamente și case"
        : kw <= 22
          ? "case mari, trifazat, birouri mici"
          : kw <= 60
            ? "retail, hoteluri, parcări comerciale"
            : "flote, hub-uri DC, autostrăzi";

    return [
      {
        question: `Pentru ce aplicații este recomandată o stație de ${kw} kW?`,
        answer: `Stațiile de ${kw} kW sunt potrivite pentru ${useCase}. Dimensionarea corectă depinde de puterea acceptată de vehicul, tabloul electric și tipul de rețea (monofazat/trifazat). ChargePro oferă consultanță gratuită.`,
      },
      {
        question: `Cât durează încărcarea unei baterii de 60 kWh la ${kw} kW?`,
        answer: `Teoretic ~${(60 / kw).toFixed(1)} ore; în practică 10–25% mai mult din cauza pierderilor și limitării curentului de către BMS. Stațiile DC peste 50 kW reduc timpul la 20–45 minute pentru 80% SOC.`,
      },
      {
        question: `Ce secțiune de cablu este necesară pentru ${kw} kW?`,
        answer: `Depinde de distanță și fază: 7,4 kW monofazat — min. 3×6 mm² pe distanțe scurte; 11–22 kW trifazat — 5×6 mm² sau 5×10 mm²; peste 22 kW necesită proiect electric ANRE. Instalarea se face doar de electrician autorizat.`,
      },
    ];
  });

  return {
    id: "putere",
    title: "Putere stații (kW)",
    description: "Dimensionare 3,7 kW – 180 kW pentru AC și DC.",
    items,
  };
}

function brandCategory(): KnowledgeCategory {
  const items: FaqItem[] = CHARGER_BRANDS.flatMap((brand) => [
    {
      question: `Stațiile ${brand} sunt potrivite pentru piața din România?`,
      answer: `${brand} produce echipamente certificate CE, compatibile Type 2 / CCS2. Disponibilitatea modelelor, garanția locală și suportul post-vânzare variază — ChargePro selectează branduri cu stoc și service în România.`,
    },
    {
      question: `Unde găsesc stații de încărcare ${brand} în catalog?`,
      answer: `Verificați catalogul ChargePro la /produse filtrat după brand sau contactați-ne pentru ofertă personalizată. Unele modele ${brand} se comandă la cerere cu livrare 5–15 zile.`,
    },
  ]);

  return {
    id: "branduri",
    title: "Branduri stații",
    description: "ABB, Autel, Wallbox, Huawei și altele.",
    items,
  };
}

function applicationCategory(): KnowledgeCategory {
  const items: FaqItem[] = APPLICATIONS.flatMap((app) => [
    {
      question: `Ce stație de încărcare EV recomandați pentru ${app.toLowerCase()}?`,
      answer: `Pentru ${app.toLowerCase()}, alegerea depinde de numărul de vehicule, timpul de staționare și puterea disponibilă. AC 7,4–22 kW pentru staționări lungi; DC 50+ kW pentru trafic rapid. Oferim audit gratuit.`,
    },
    {
      question: `Există finanțare pentru stații EV la ${app.toLowerCase()}?`,
      answer: `Programul ElectricUP, fonduri AFM/PNRR și programe locale pot acoperi parțial costurile. Eligibilitatea depinde de tipul beneficiarului — consultați ghidurile de finanțare sau contactați ChargePro.`,
    },
  ]);

  return {
    id: "aplicatii",
    title: "Aplicații",
    description: "Acasă, firmă, hotel, flotă, blocuri și spații publice.",
    items,
  };
}

function vehicleCategory(): KnowledgeCategory {
  const items: FaqItem[] = VEHICLE_BRANDS.flatMap((brand) => [
    {
      question: `Ce wallbox este compatibil cu ${brand}?`,
      answer: `Majoritatea modelelor ${brand} vândute în România acceptă Type 2 AC și, unde e cazul, CCS2 DC. Verificați puterea maximă AC acceptată (3,7–11 kW sau 22 kW) în manualul vehiculului.`,
    },
    {
      question: `Cât costă încărcarea unui ${brand} acasă?`,
      answer: `Costul = kWh încărcați × tariful energiei. Un ${brand} urban consumă ~15–22 kWh/100 km. La 1,2 RON/kWh, 100 km costă ~18–26 RON vs 40–60 RON echivalent benzină.`,
    },
  ]);

  return {
    id: "vehicule",
    title: "Mărci auto",
    description: "Tesla, BYD, BMW, Dacia Spring și altele.",
    items,
  };
}

const FINANCING_FAQ: FaqItem[] = [
  {
    question: "Ce este programul ElectricUP?",
    answer:
      "ElectricUP finanțează stații de încărcare pentru entități publice și private eligibile. Grantul acoperă parțial echipamentul și instalarea. Condițiile se actualizează — verificați apelul curent AFM sau articolul nostru dedicat.",
  },
  {
    question: "Cum accesez fonduri AFM pentru stații EV?",
    answer:
      "AFM administrează programe naționale de mobilitate electrică. Depunerea se face online cu documentație juridică și tehnică. ChargePro poate sprijini cu specificații tehnice și devize.",
  },
  {
    question: "PNRR finanțează stații de încărcare?",
    answer:
      "Componentele PNRR pentru mobilitate verde includ infrastructură EV pentru administrații publice și transport. Termenele și bugetele sunt limitate — monitorizați portalul guvernamental.",
  },
  {
    question: "Stațiile pentru firme sunt deductibile fiscal?",
    answer:
      "Investițiile în infrastructură EV pot fi deductibile ca active corporative. Consultați contabilul pentru amortizare accelerată și TVA deductibil.",
  },
  {
    question: "Există leasing operațional pentru stații EV?",
    answer:
      "Da, partenerii financiari oferă leasing cu rată lunară ce include mentenanță. Util pentru flote care preferă OPEX vs CAPEX.",
  },
];

const TECHNICAL_FAQ: FaqItem[] = [
  {
    question: "Ce este OCPP și de ce contează?",
    answer:
      "Open Charge Point Protocol — standard de comunicare între stație și platformă cloud. OCPP 1.6J este cel mai răspândit; 2.0.1 pentru proiecte noi. Permite facturare, monitorizare și load balancing.",
  },
  {
    question: "Ce este load balancing pentru stații multiple?",
    answer:
      "Algoritm care distribuie puterea disponibilă între mai multe stații, evitând declanșarea protecțiilor. Esențial în parcări cu 4+ puncte de încărcare.",
  },
  {
    question: "Am nevoie de RCD Tip A pentru wallbox?",
    answer:
      "Da, protecție diferențială Tip A sau A6 este obligatorie conform normelor pentru circuite de încărcare EV.",
  },
  {
    question: "Pot instala wallbox la bloc?",
    answer:
      "Da, cu acordul asociației de proprietari și aviz tehnic. Legea favorizează dreptul la reșea electrică pentru locuri de parcare. Procedura durează 30–90 zile.",
  },
  {
    question: "Care e diferența Type 2 vs CCS2?",
    answer:
      "Type 2 — AC (Mennekes). CCS2 — DC rapid (Combined Charging System), standard european. Tesla Model 3/Y în EU folosesc CCS2.",
  },
  {
    question: "Stațiile smart au nevoie de internet?",
    answer:
      "Nu obligatoriu pentru încărcare de bază, dar WiFi/4G/Ethernet sunt necesare pentru app, OCPP, actualizări firmware și rapoarte consum.",
  },
  {
    question: "Cât rezistă un wallbox în exterior?",
    answer:
      "Modelele IP54–IP65 suportă ploaie și praf. Montajul corect (înălțime, drenaj) prelungește durata de viață peste 10 ani.",
  },
  {
    question: "Se poate integra wallbox cu panouri fotovoltaice?",
    answer:
      "Da, prin EMS sau funcții solar surplus charging — încarcă doar cu excedentul PV, reducând costul la zero în orele însorite.",
  },
];

const OPERATIONS_FAQ: FaqItem[] = [
  {
    question: "Cât de des necesită mentenanță o stație AC?",
    answer: "Verificare anuală: contacte, cablu, etanșare, test RCD. Stațiile comerciale DC — trimestrial, conform producătorului.",
  },
  {
    question: "Ce garanție oferă ChargePro?",
    answer: "Garanție conform producătorului, de la 2 la 5 ani pentru echipamente selectate. Service în România prin rețea autorizată.",
  },
  {
    question: "Pot monitoriza consumul per utilizator?",
    answer: "Da, stațiile cu OCPP și app permit RFID, facturare per sesiune și rapoarte export CSV.",
  },
  {
    question: "Funcționează stația în caz de pană de curent?",
    answer: "După reluarea alimentării, stațiile smart repornesc automat. Sesiunea întreruptă se reia conform setărilor vehiculului.",
  },
  {
    question: "Care e durata de viață a unui wallbox?",
    answer: "10–15 ani cu mentenanță preventivă. Componentele consumabile (contacte DC) se înlocuiesc la stațiile cu utilizare intensă.",
  },
  {
    question: "Pot migra de la o stație la alta păstrând datele?",
    answer: "Datele OCPP sunt în platforma CSMS. La schimbarea hardware, reconfigurarea OCPP este suficientă.",
  },
  {
    question: "Stațiile suportă plata cu card?",
    answer: "Modelele comerciale pot integra terminal POS sau app. Wallbox-urile rezidențiale folosesc de obicei app sau RFID.",
  },
  {
    question: "Ce temperatură suportă un wallbox exterior?",
    answer: "Majoritatea modelelor: -25°C până la +50°C. Verificați IP rating și specificațiile producătorului.",
  },
  {
    question: "Cum raportez o defecțiune?",
    answer: "Contactați suportul tehnic ChargePro la numărul dedicat sau prin formularul /contact cu SKU-ul stației.",
  },
  {
    question: "Există training pentru administratori de flotă?",
    answer: "Da, oferim instruire pentru platforma de management, rapoarte și proceduri de urgență.",
  },
  {
    question: "Pot extinde o instalare existentă?",
    answer: "Da, cu load balancing și upgrade tablou. Recomandăm conductoare supradimensionate la instalarea inițială.",
  },
  {
    question: "Ce documente primesc la recepție?",
    answer: "Proces verbal, scheme electrice, certificate CE, manual utilizare și declarație conformitate instalare ANRE.",
  },
];

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  powerCategory(),
  brandCategory(),
  applicationCategory(),
  vehicleCategory(),
  {
    id: "finantari",
    title: "Finanțări și programe",
    description: "ElectricUP, AFM, PNRR, fiscalitate.",
    items: FINANCING_FAQ,
  },
  {
    id: "tehnic",
    title: "Tehnic și reglementări",
    description: "OCPP, load balancing, ANRE, conectori.",
    items: TECHNICAL_FAQ,
  },
  {
    id: "operare",
    title: "Operare, mentenanță, garanții",
    description: "Service, monitorizare, durată de viață.",
    items: OPERATIONS_FAQ,
  },
];

export function getAllKnowledgeFaqItems(): FaqItem[] {
  return KNOWLEDGE_CATEGORIES.flatMap((c) => c.items);
}

export function getKnowledgeFaqCount(): number {
  return getAllKnowledgeFaqItems().length;
}
