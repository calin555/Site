import type { CommercialLandingPageData } from "@/lib/seo/commercial/types";

const BASE_LINKS = {
  ac: { href: "/statie-incarcare-ac", label: "Stație încărcare AC" },
  dc: { href: "/statie-incarcare-dc", label: "Stație încărcare DC" },
  rapid: { href: "/statie-incarcare-rapida", label: "Stație încărcare rapidă" },
  wallbox: { href: "/statie-incarcare-wallbox", label: "Stație încărcare Wallbox" },
  mono: { href: "/statie-incarcare-monofazata", label: "Stație monofazată" },
  tri: { href: "/statie-incarcare-trifazata", label: "Stație trifazată" },
  acasa: { href: "/statie-incarcare-acasa", label: "Stație încărcare acasă" },
  firma: { href: "/statie-incarcare-firma", label: "Stație încărcare firmă" },
};

export const TYPE_STATION_PAGES: CommercialLandingPageData[] = [
  {
    slug: "statie-incarcare-ac",
    silo: "types",
    siloLabel: "Tipuri stații",
    primaryKeyword: "stație încărcare AC",
    secondaryKeywords: [
      "wallbox AC",
      "stație AC Type 2",
      "încărcare alternativă EV",
      "stație încărcare acasă AC",
    ],
    metaTitle: "Stație încărcare AC — wallbox 7–22 kW | ChargePro România",
    metaDescription:
      "Cumpără stație încărcare AC pentru acasă sau firmă. Wallbox Type 2, 7.4–22 kW, instalare ANRE, livrare România. Consultanță gratuită ChargePro.",
    h1: "Stație încărcare AC — wallbox pentru vehicule electrice",
    intro:
      "O stație încărcare AC (curent alternativ) transformă energia din rețea într-un flux sigur pentru bateria mașinii electrice. Este soluția standard pentru acasă, birouri, hoteluri și flote cu timp de staționare de câteva ore. ChargePro comercializează wallbox-uri certificate CE, compatibile Type 2, cu puteri de la 7,4 kW la 22 kW.",
    sections: [
      {
        h2: "Ce este o stație încărcare AC?",
        paragraphs: [
          "Stațiile AC folosesc convertorul onboard al vehiculului pentru a transforma curentul alternativ în curent continuu pentru baterie. Conectorul standard în Europa este Type 2 (Mennekes). Puterea efectivă depinde atât de stație, cât și de limita acceptată de mașină — de exemplu, un Dacia Spring poate accepta 7,4 kW AC, iar un Tesla Model 3 până la 11 kW trifazat.",
          "Față de stațiile DC, echipamentele AC sunt mai accesibile ca preț, mai ușor de instalat și ideale acolo unde vehiculul stă 4–12 ore. Wallbox-ul montat pe perete sau stâlp include protecții, comunicare smart și opțional RFID sau app pentru facturare.",
          "În România, instalarea unei stații AC necesită circuit dedicat, protecție diferențială Tip A și, pentru puteri peste 7,4 kW trifazat, verificarea capacității tabloului electric. ChargePro oferă dimensionare gratuită înainte de comandă.",
        ],
      },
      {
        h2: "Pentru cine este potrivită o stație AC?",
        paragraphs: [
          "Proprietarii de case și apartamente cu loc de parcare privat aleg wallbox AC 7,4–11 kW pentru încărcare nocturnă la tarif redus. Firmele montează stații AC 11–22 kW în parcările angajaților sau clienților. Hotelurile și pensiunile folosesc AC pentru oaspeți care stau peste noapte.",
          "Flotele urbane cu vehicule care revin la bază seara pot dimensiona 10–50 de puncte AC cu load balancing, evitând costul stațiilor DC rapide. Retail-ul și mall-urile combină AC pentru clienți cu staționare lungă și DC pentru tranzit rapid.",
        ],
        list: [
          "Rezidențial: 7,4 kW monofazat sau 11 kW trifazat",
          "Firme mici: 11–22 kW cu management RFID",
          "HoReCa: 11 kW per loc, facturare opțională",
          "Flote: multiple stații AC + platformă OCPP",
        ],
      },
      {
        h2: "Cum alegi puterea stației AC",
        paragraphs: [
          "7,4 kW monofazat — cel mai frecvent pentru apartamente și case cu un singur vehicul. Adaugă ~35–45 km autonomie/oră. 11 kW trifazat — recomandat pentru Tesla, BMW, Mercedes cu onboard charger 11 kW. 22 kW trifazat — pentru vehicule premium (Audi e-tron, Porsche Taycan) și parcări comerciale.",
          "Verificați în manualul vehiculului puterea AC maximă. Nu are sens să instalați 22 kW dacă mașina acceptă 7,4 kW — plătiți extra pentru cablaj trifazat fără beneficiu. Wizard-ul ChargePro de la /tools/recomandare-statie estimează puterea optimă în 2 minute.",
        ],
      },
      {
        h2: "Instalare și reglementări ANRE",
        paragraphs: [
          "Montajul wallbox-ului AC se face de electrician autorizat ANRE. Include trasarea cablului de la tablou, montarea RCBO, testarea izolației și punerea în funcțiune. Pentru condominiu este necesar acordul asociației și, uneori, aviz de la furnizorul de energie.",
          "ChargePro livrează stația, documentația CE, manualul în limba română și poate coordona instalarea cu parteneri autorizați în toată țara. Procesul-verbal de recepție este esențial pentru garanție și eventuale finanțări ElectricUP sau AFM.",
        ],
      },
      {
        h2: "Prețuri stații încărcare AC în România (2026)",
        paragraphs: [
          "Wallbox-urile AC pornește de la aproximativ 2.500–4.000 RON echipament, plus 1.500–4.500 RON instalare în funcție de distanță și complexitate. Stațiile comerciale 22 kW cu OCPP și RFID costă 5.000–12.000 RON.",
          "Costul total de proprietate pe 5 ani este semnificativ mai mic decât încărcarea exclusiv publică — un șofer cu 20.000 km/an economisește 3.000–6.000 RON anual încărcând acasă la tarif nocturn. Solicitați ofertă personalizată pentru proiectul dumneavoastră.",
        ],
      },
    ],
    comparisonTable: {
      caption: "Comparație stații AC vs DC",
      headers: ["Criteriu", "Stație AC", "Stație DC"],
      rows: [
        ["Putere tipică", "3,7–22 kW", "30–180 kW"],
        ["Timp 20–80%", "3–8 ore", "20–45 min"],
        ["Preț echipament", "2.500–12.000 RON", "80.000–400.000 RON"],
        ["Instalare", "Simplă, perete/stâlp", "Complexă, fundație + putere"],
        ["Utilizare ideală", "Acasă, birou, hotel", "Autostradă, flotă, retail"],
        ["Conector", "Type 2", "CCS2 / CHAdeMO"],
      ],
    },
    prosCons: {
      pros: [
        "Cost redus de achiziție și instalare",
        "Ideal pentru încărcare peste noapte",
        "Compatibil cu majoritatea vehiculelor din România",
        "Consum redus de energie reactivă",
        "Mentenanță minimă",
      ],
      cons: [
        "Timp de încărcare mai lung decât DC",
        "Puterea limitată de onboard charger al vehiculului",
        "Necesită timp de staționare suficient",
      ],
    },
    faq: [
      {
        question: "Care este diferența între stație AC și wallbox?",
        answer:
          "Wallbox este termenul pentru o stație AC de putere redusă (3,7–22 kW), montată de obicei pe perete. Toate wallbox-urile sunt stații AC, dar nu toate stațiile AC sunt wallbox — unele modele comerciale sunt pe stâlp sau totem.",
      },
      {
        question: "Pot instala stație AC la bloc?",
        answer:
          "Da, cu acordul asociației de proprietari. Legea favorizează dreptul la rețea pentru locuri de parcare. Procedura durează 30–90 zile. ChargePro poate sprijini cu documentație tehnică.",
      },
      {
        question: "Ce cablu folosește stația AC?",
        answer:
          "Stația este conectată permanent la tablou; vehiculul se conectează cu cablu Type 2 (T2-T2 sau T2-T1). Majoritatea wallbox-urilor includ cablu integrat de 5–7 m.",
      },
      {
        question: "Cât costă o stație încărcare AC acasă?",
        answer:
          "Echipament + instalare: 4.000–10.000 RON pentru 7,4–11 kW. Prețul exact depinde de distanța față de tablou și necesitatea upgrade-ului electric.",
      },
      {
        question: "Stația AC funcționează fără internet?",
        answer:
          "Da, încărcarea de bază funcționează offline. WiFi/4G este necesar pentru app, OCPP, actualizări firmware și rapoarte consum.",
      },
      {
        question: "Ce garanție oferă ChargePro pentru stații AC?",
        answer:
          "Garanție 2–5 ani conform producătorului, plus suport tehnic în limba română și service în rețea națională.",
      },
    ],
    productFilter: { categorySlug: "statii-ac" },
    relatedLandingSlugs: [
      "statie-incarcare-dc",
      "statie-incarcare-wallbox",
      "statie-incarcare-7kw",
      "statie-incarcare-22kw",
      "statie-incarcare-acasa",
    ],
    relatedArticleSlugs: [
      "statii-ac-vs-dc-diferente-tehnice-utilizare",
      "cum-alegi-statia-de-incarcare-potrivita",
    ],
    relatedProductLinks: [
      BASE_LINKS.dc,
      BASE_LINKS.wallbox,
      { href: "/produse/categorie/statii-ac", label: "Catalog stații AC" },
    ],
    catalogCtaHref: "/produse/categorie/statii-ac",
    catalogCtaLabel: "Vezi toate stațiile AC",
    imageAlt: "Stație încărcare AC wallbox Type 2 montată pe perete",
  },
  {
    slug: "statie-incarcare-dc",
    silo: "types",
    siloLabel: "Tipuri stații",
    primaryKeyword: "stație încărcare DC",
    secondaryKeywords: [
      "stație rapidă DC",
      "CCS2",
      "încărcare rapidă EV",
      "stație DC 60 kW",
    ],
    metaTitle: "Stație încărcare DC rapidă — 30–120 kW CCS2 | ChargePro",
    metaDescription:
      "Stații încărcare DC rapide 30, 60, 120 kW cu conector CCS2. Soluții pentru flote, retail, hoteluri și parcări publice. Instalare ANRE, livrare România.",
    h1: "Stație încărcare DC — încărcare rapidă pentru vehicule electrice",
    intro:
      "Stațiile încărcare DC (curent continuu) alimentează direct bateria vehiculului, ocolind convertorul onboard. Oferă puteri de la 30 kW la 180 kW și reduc timpul de încărcare la 20–45 minute pentru 20–80% SOC. Sunt esențiale pentru flote, parcări comerciale, stații de servicii și hub-uri de mobilitate.",
    sections: [
      {
        h2: "Cum funcționează o stație DC",
        paragraphs: [
          "Convertorul din stație transformă AC din rețea în DC la tensiunea cerută de baterie. Conectorul standard european este CCS2 (Combined Charging System). Stațiile DC includ ecran tactil, terminal de plată, comunicare OCPP și management termic pentru cabluri și module de putere.",
          "Puterea reală livrată variază în funcție de vehicul, temperatura bateriei și starea de încărcare (SOC). La peste 80% SOC, viteza scade automat pentru protecția bateriei — comportament normal, nu defect al stației.",
        ],
      },
      {
        h2: "Aplicații comerciale pentru stații DC",
        paragraphs: [
          "Flote de curierat și ridesharing au nevoie de rotație rapidă — 60 kW DC permite 200+ km autonomie în pauza de prânz. Retail și mall-uri atrag clienți EV cu 30–60 kW în parcare. Hoteluri premium oferă DC pentru oaspeți în tranzit.",
          "Primării și parcări publice instalează hub-uri DC 120 kW pe coridoare de mobilitate. Stațiile de servicii integrează DC 150–180 kW alături de combustibil clasic, pregătind tranziția energetică.",
        ],
      },
      {
        h2: "Dimensionare putere DC",
        paragraphs: [
          "30 kW — parcări mici, 1–2 vehicule simultan, buget moderat. 60 kW — cel mai echilibrat raport cost/utilizare pentru retail și flote urbane. 120 kW — hub-uri cu trafic intens, autostrăzi, centre logistice.",
          "Fiecare kW DC necesită aproximativ 1,2–1,5 kVA din transformator. Proiectele comerciale cer studiu de putere, aviz de racordare și uneori substation dedicată. ChargePro coordonează auditul tehnic înainte de ofertare.",
        ],
      },
      {
        h2: "Costuri și ROI stații DC",
        paragraphs: [
          "Investiția într-o stație DC 60 kW pornește de la 80.000–150.000 RON echipament + instalare civilă și electrică. ROI-ul depinde de tariful per kWh, gradul de utilizare și finanțările PNRR/ElectricUP disponibile.",
          "Stațiile cu plată integrată (POS, app, RFID) generează venit direct. Retail-ul raportează creșteri de 15–25% în timpul sesiunii de încărcare — argument comercial puternic pentru mall-uri și restaurante.",
        ],
      },
    ],
    comparisonTable: {
      caption: "Puteri stații DC — comparație",
      headers: ["Putere", "Timp 20–80% (60 kWh)", "Aplicație", "Investiție orientativă"],
      rows: [
        ["30 kW", "~60 min", "Retail mic, pensiuni", "60.000–90.000 RON"],
        ["60 kW", "~35 min", "Flotă, hotel, mall", "80.000–150.000 RON"],
        ["120 kW", "~20 min", "Hub, autostradă", "150.000–280.000 RON"],
        ["180 kW", "~15 min", "Stație servicii", "250.000–400.000 RON"],
      ],
    },
    prosCons: {
      pros: [
        "Timp de încărcare redus — ideal pentru tranzit",
        "Experiență premium pentru clienți și flote",
        "Venit din tarifare per kWh sau minut",
        "Imagine de brand — mobilitate sustenabilă",
      ],
      cons: [
        "Investiție inițială semnificativă",
        "Necesită putere electrică substanțială",
        "Mentenanță specializată (contacte DC)",
        "Utilizare sub 20% poate afecta ROI",
      ],
    },
    faq: [
      {
        question: "Ce conector folosesc stațiile DC în România?",
        answer: "CCS2 este standardul european. Tesla Model 3/Y folosesc CCS2 nativ. CHAdeMO este în declin, dar unele stații dual-offer CCS2 + CHAdeMO.",
      },
      {
        question: "Pot instala stație DC acasă?",
        answer: "Tehnic posibil dar neobișnuit — costul și puterea necesară o fac neeconomică. Pentru acasă recomandăm AC 7–22 kW.",
      },
      {
        question: "Cât consumă o stație DC 60 kW?",
        answer: "La putere maximă, ~60 kW activi. Consumul mediu per sesiune depinde de vehicul — tipic 25–45 kWh per încărcare rapidă.",
      },
      {
        question: "Stațiile DC sunt compatibile OCPP?",
        answer: "Da, modelele comerciale ChargePro suportă OCPP 1.6J sau 2.0.1 pentru monitorizare, facturare și load management.",
      },
    ],
    productFilter: { categorySlug: "statii-dc", powerKwMin: 30 },
    relatedLandingSlugs: [
      "statie-incarcare-ac",
      "statie-incarcare-rapida",
      "statie-incarcare-60kw",
      "statie-incarcare-120kw",
      "statie-incarcare-firma",
    ],
    relatedArticleSlugs: ["statii-ac-vs-dc-diferente-tehnice-utilizare"],
    relatedProductLinks: [
      BASE_LINKS.ac,
      BASE_LINKS.rapid,
      { href: "/produse/categorie/statii-dc", label: "Catalog stații DC" },
    ],
    catalogCtaHref: "/produse/categorie/statii-dc",
    catalogCtaLabel: "Vezi stațiile DC rapide",
    imageAlt: "Stație încărcare DC rapidă CCS2 60 kW",
  },
  {
    slug: "statie-incarcare-rapida",
    silo: "types",
    siloLabel: "Tipuri stații",
    primaryKeyword: "stație încărcare rapidă",
    secondaryKeywords: [
      "încărcare rapidă EV",
      "fast charger",
      "DC rapid",
      "stație rapidă mașini electrice",
    ],
    metaTitle: "Stație încărcare rapidă EV — DC 50–180 kW | ChargePro",
    metaDescription:
      "Stație încărcare rapidă pentru mașini electrice: DC 50–180 kW, CCS2, plată integrată. Flote, retail, parcări. Consultanță și instalare ANRE România.",
    h1: "Stație încărcare rapidă — soluții DC pentru mobilitate electrică",
    intro:
      "Stația încărcare rapidă (fast charger) livrează peste 50 kW DC, reducând oprirea la 20–40 de minute. Este soluția pentru șoferi în tranzit, flote comerciale și locații cu rotație mare de vehicule. ChargePro furnizează stații rapide certificate, cu suport OCPP și instalare autorizată.",
    sections: [
      {
        h2: "Ce înseamnă „încărcare rapidă” tehnic",
        paragraphs: [
          "În terminologia europeană, „rapid” = DC peste 50 kW; „ultra-rapid” = peste 150 kW. Spre deosebire de AC (ore), rapid DC adaugă sute de km autonomie în timpul unei opriri scurte. Viteza scade după 80% SOC — planificați opririle în funcție de traseu.",
          "Stațiile rapide includ module de putere redundante — dacă un vehicul cere 120 kW dar altul e conectat, algoritmul distribuie puterea disponibilă. Load balancing inteligent maximizează throughput-ul parcării.",
        ],
      },
      {
        h2: "Unde instalezi o stație rapidă",
        paragraphs: [
          "Locații cu trafic EV ridicat: benzinării, mall-uri, restaurante pe autostradă, centre logistice. Flote de livrare instalează 60 kW la baza de plecare pentru schimb de tură rapid.",
          "Primăriile accesează fonduri PNRR pentru stații rapide în parcări publice. ROI-ul crește când tariful per kWh este competitiv față de rețelele publice și când locația are vizibilitate bună.",
        ],
      },
      {
        h2: "Comparație rapid vs AC pentru afaceri",
        paragraphs: [
          "Dacă vehiculele stau 8+ ore, AC este mai economic. Dacă rotația este sub 2 ore, rapid DC este obligatoriu. Multe proiecte hibride combină 4× AC 22 kW + 2× DC 60 kW — acoperă ambele scenarii.",
          "ChargePro dimensionează mixul optim pe baza datelor de trafic, tip flotă și buget. Calculatorul ROI de la /tools/calculator-roi estimează payback-ul pentru stații rapide comerciale.",
        ],
      },
    ],
    comparisonTable: {
      headers: ["Tip", "Putere", "Timp tipic", "Cost/kWh utilizator"],
      rows: [
        ["AC wallbox", "7–22 kW", "4–8 h", "0,8–1,4 RON (acasă)"],
        ["DC rapid", "50–90 kW", "25–40 min", "1,8–3,5 RON (public)"],
        ["DC ultra-rapid", "150–180 kW", "15–25 min", "2,2–4,0 RON"],
      ],
    },
    prosCons: {
      pros: [
        "Minimizează timpul de nefuncționare al flotei",
        "Atrage clienți EV la locația comercială",
        "Tarifare flexibilă — kWh, minut, abonament",
      ],
      cons: [
        "Investiție și mentenanță superioară AC",
        "Necesită aviz putere de la distribuitor",
      ],
    },
    faq: [
      {
        question: "Cât de rapidă este o stație de 60 kW?",
        answer: "Pentru o baterie de 60 kWh, de la 20% la 80% durează aproximativ 35–45 minute în condiții normale.",
      },
      {
        question: "Stația rapidă funcționează iarna?",
        answer: "Da, dar bateria rece poate limita puterea inițială. Preconditionarea bateriei (funcție vehicul) îmbunătățește viteza.",
      },
      {
        question: "Pot combina rapid DC cu stații AC?",
        answer: "Da, este arhitectura recomandată pentru parcări mixte — AC pentru staționare lungă, DC pentru tranzit.",
      },
    ],
    productFilter: { categorySlug: "statii-dc", powerKwMin: 50 },
    relatedLandingSlugs: [
      "statie-incarcare-dc",
      "statie-incarcare-60kw",
      "statie-incarcare-120kw",
      "statie-incarcare-flota",
    ],
    relatedArticleSlugs: ["statii-ac-vs-dc-diferente-tehnice-utilizare"],
    relatedProductLinks: [BASE_LINKS.dc, { href: "/statie-incarcare-flota", label: "Stații flotă" }],
    catalogCtaHref: "/produse/categorie/statii-dc",
    catalogCtaLabel: "Catalog stații rapide DC",
    imageAlt: "Stație încărcare rapidă DC cu ecran tactil",
  },
  {
    slug: "statie-incarcare-wallbox",
    silo: "types",
    siloLabel: "Tipuri stații",
    primaryKeyword: "stație încărcare Wallbox",
    secondaryKeywords: [
      "wallbox EV",
      "wallbox Type 2",
      "wallbox acasă",
      "cumpără wallbox România",
    ],
    metaTitle: "Stație încărcare Wallbox — Type 2, smart, 7–22 kW | ChargePro",
    metaDescription:
      "Wallbox pentru mașini electrice: 7.4, 11 și 22 kW, Type 2, app smart, RFID. Livrare România, instalare ANRE. ABB, Wallbox, ChargePro — consultanță gratuită.",
    h1: "Stație încărcare Wallbox — wallbox smart pentru acasă și firmă",
    intro:
      "Wallbox-ul este stația de încărcare AC montată pe perete — soluția cea mai populară pentru proprietari de vehicule electrice. Modelele smart oferă programare, monitorizare consum, integrare solară și OCPP. ChargePro comercializează wallbox-uri de la 7,4 kW la 22 kW, compatibile Type 2.",
    sections: [
      {
        h2: "De ce alegi un wallbox în loc de priză normală",
        paragraphs: [
          "Priză Schuko (2,3 kW) necesită 20+ ore pentru o încărcare completă și poate supraîncălzi circuitul. Wallbox-ul oferă 7–22 kW sigur, cu protecții integrate, comunicare cu vehiculul (Pilot PWM) și opțiuni smart.",
          "Asigurătorii și instalatorii ANRE recomandă wallbox dedicat — reduce riscul de incendiu și respectă normele I7-2011. Garanția vehiculului poate fi afectată de încărcare permanentă de pe priză domestică neadaptată.",
        ],
      },
      {
        h2: "Wallbox smart vs simplu",
        paragraphs: [
          "Wallbox simplu: pornire manuală, LED status, fiabil și economic. Wallbox smart: app WiFi/Bluetooth, programare ore ieftine, statistici kWh, actualizări firmware, integrare panouri fotovoltaice (solar surplus).",
          "Pentru firmă, wallbox smart cu RFID permite alocarea costului per angajat sau vizitator. OCPP permite conectarea la platforme de management flotă.",
        ],
      },
      {
        h2: "Branduri wallbox disponibile",
        paragraphs: [
          "ChargePro comercializează wallbox-uri proprii și parteneri: ABB Terra AC, Wallbox Pulsar Plus, Autel MaxiCharger, Schneider EVlink. Selecția depinde de putere, conectivitate și buget.",
          "Toate modelele sunt certificate CE, cu service în România. Compară produsele în catalog sau folosește wizard-ul de recomandare.",
        ],
      },
    ],
    prosCons: {
      pros: [
        "Design compact, montaj pe perete",
        "7–22 kW — de 3× până la 10× mai rapid decât priză",
        "Protecții integrate — RCBO, detectare defect",
        "Modele smart cu app și solar",
      ],
      cons: [
        "Necesită instalare electrician autorizat",
        "Putere limitată vs DC rapid",
      ],
    },
    faq: [
      {
        question: "Wallbox sau stație pe stâlp?",
        answer: "Wallbox pe perete economisește spațiu în garaj. Stâlp free-standing e preferat în parcări deschise sau când peretele e prea departe de locul de parcare.",
      },
      {
        question: "Ce wallbox pentru Tesla?",
        answer: "Orice wallbox Type 2 cu 7,4–11 kW. Tesla include adaptor; Model 3/Y acceptă până la 11 kW AC trifazat.",
      },
    ],
    productFilter: { categorySlug: "statii-ac", powerKwMax: 22 },
    relatedLandingSlugs: ["statie-incarcare-ac", "statie-incarcare-acasa", "statie-incarcare-7kw"],
    relatedArticleSlugs: ["instalare-wallbox-pas-cu-pas-documentatie"],
    relatedProductLinks: [BASE_LINKS.ac, BASE_LINKS.acasa],
    catalogCtaHref: "/produse/categorie/statii-ac",
    catalogCtaLabel: "Vezi wallbox-uri disponibile",
    imageAlt: "Wallbox smart Type 2 montat în garaj",
  },
  {
    slug: "statie-incarcare-monofazata",
    silo: "types",
    siloLabel: "Tipuri stații",
    primaryKeyword: "stație încărcare monofazată",
    secondaryKeywords: [
      "wallbox monofazat",
      "stație 7.4 kW monofazat",
      "încărcare monofazată EV",
    ],
    metaTitle: "Stație încărcare monofazată — 3,7–7,4 kW | ChargePro",
    metaDescription:
      "Stație încărcare monofazată pentru rețea 230V: 3,7 kW și 7,4 kW, Type 2. Ideală apartamente și case. Instalare ANRE, livrare România.",
    h1: "Stație încărcare monofazată — soluție pentru rețea 230V",
    intro:
      "Stația monofazată funcționează pe rețea 230V standard din România, cu puteri tipice de 3,7 kW (16A) sau 7,4 kW (32A). Este alegerea naturală pentru apartamente, case cu tablou monofazat și locuri unde trifazat nu este disponibil.",
    sections: [
      {
        h2: "Când alegi monofazat",
        paragraphs: [
          "Majoritatea apartamentelor din blocuri vechi au alimentare monofazată. 7,4 kW este maximum pe monofazat — suficient pentru 35–45 km/oră. Dacia Spring, Renault Zoe și multe modele urbane se încarcă complet peste noapte.",
          "Dacă planificați vehicul cu onboard 11 kW sau 22 kW, verificați dacă puteți upgrada la trifazat — costul diferenței de cablaj se amortizează pe termen lung.",
        ],
      },
      {
        h2: "Instalare monofazat — cerințe",
        paragraphs: [
          "Circuit dedicat 32A, cablu min. 3×6 mm² pe distanțe scurte, RCBO Tip A 40A. Verificați că contorul și siguranța generală suportă 7,4 kW continuu alături de consumul casei.",
          "ChargePro evaluează tabloul electric gratuit înainte de recomandare — evităm suprasolicitarea rețelei interne.",
        ],
      },
    ],
    comparisonTable: {
      headers: ["", "Monofazat 7,4 kW", "Trifazat 11 kW", "Trifazat 22 kW"],
      rows: [
        ["Rețea necesară", "230V / 32A", "400V / 16A/fază", "400V / 32A/fază"],
        ["km/oră tipic", "35–45", "50–60", "100–120"],
        ["Cost instalare", "Scăzut", "Mediu", "Ridicat"],
      ],
    },
    prosCons: {
      pros: ["Compatibil cu orice locuință monofazată", "Instalare simplă și ieftină", "Suficient pentru uz zilnic urban"],
      cons: ["Limitat la 7,4 kW maximum", "Mai lent decât trifazat pentru vehicule premium"],
    },
    faq: [
      {
        question: "Pot trece de la monofazat la trifazat ulterior?",
        answer: "Da, dacă distribuitorul aprobă upgrade și cablajul stației permite — recomandăm conductoare supradimensionate de la început.",
      },
    ],
    productFilter: { categorySlug: "statii-ac", phases: "SINGLE" },
    relatedLandingSlugs: ["statie-incarcare-trifazata", "statie-incarcare-7kw", "statie-incarcare-bloc"],
    relatedArticleSlugs: ["comparatie-statii-7kw-vs-22kw-acasa"],
    relatedProductLinks: [BASE_LINKS.tri, { href: "/statie-incarcare-7kw", label: "Stație 7 kW" }],
    catalogCtaHref: "/produse/categorie/statii-ac",
    catalogCtaLabel: "Stații monofazate",
    imageAlt: "Stație încărcare monofazată 7.4 kW",
  },
  {
    slug: "statie-incarcare-trifazata",
    silo: "types",
    siloLabel: "Tipuri stații",
    primaryKeyword: "stație încărcare trifazată",
    secondaryKeywords: [
      "wallbox trifazat 11 kW",
      "stație 22 kW trifazat",
      "încărcare trifazată EV",
    ],
    metaTitle: "Stație încărcare trifazată — 11 kW și 22 kW | ChargePro",
    metaDescription:
      "Stație încărcare trifazată 11–22 kW pentru case și firme. Type 2, OCPP, load balancing. Instalare ANRE, consultanță tehnică ChargePro România.",
    h1: "Stație încărcare trifazată — 11 kW și 22 kW pentru performanță maximă AC",
    intro:
      "Stația trifazată folosește rețea 400V pentru puteri de 11 kW sau 22 kW AC — de 2–3× mai rapid decât monofazat. Este recomandată pentru case noi, vile, firme și vehicule premium cu onboard charger 11/22 kW.",
    sections: [
      {
        h2: "Beneficii trifazat",
        paragraphs: [
          "11 kW trifazat adaugă ~55 km/oră — ideal pentru Tesla Model 3, BMW i4, Mercedes EQC. 22 kW trifazat atinge ~110 km/oră — maxim AC pentru Audi e-tron, Porsche Taycan, flote premium.",
          "Distribuția pe trei faze reduce dezechilibrul rețelei interne — important când aveți multiple consumatori mari (pompă căldură, cuptor industrial).",
        ],
      },
      {
        h2: "Cerințe instalare trifazat",
        paragraphs: [
          "Tablou cu alimentare trifazată, siguranță dedicată, cablu 5×6 mm² sau 5×10 mm² în funcție de distanță. Aviz distribuitor dacă puterea contractată este insuficientă.",
          "ChargePro verifică schema electrică și propune upgrade tablou inclus în ofertă — un singur interlocutor de la audit la recepție.",
        ],
      },
    ],
    prosCons: {
      pros: ["Viteză maximă AC", "Ideal pentru vehicule premium", "Echilibru pe faze", "Scalabil pentru parcări multiple"],
      cons: ["Necesită trifazat la tablou", "Cost cablaj superior monofazat"],
    },
    faq: [
      {
        question: "Am trifazat la contor dar monofazat în apartament?",
        answer: "Unele blocuri au trifazat doar la contor general. Verificați cu administratorul — extinderea trifazat la locul de parcare poate necesita investiție în coloană.",
      },
    ],
    productFilter: { categorySlug: "statii-ac", phases: "THREE" },
    relatedLandingSlugs: ["statie-incarcare-monofazata", "statie-incarcare-11kw", "statie-incarcare-22kw"],
    relatedArticleSlugs: ["comparatie-statii-7kw-vs-22kw-acasa"],
    relatedProductLinks: [BASE_LINKS.mono, { href: "/statie-incarcare-22kw", label: "Stație 22 kW" }],
    catalogCtaHref: "/produse/categorie/statii-ac",
    catalogCtaLabel: "Stații trifazate",
    imageAlt: "Stație încărcare trifazată 22 kW",
  },
];

export { BASE_LINKS };
