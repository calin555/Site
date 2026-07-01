export type CaseStudySegment = "firma" | "hotel" | "bloc";

export interface CaseStudy {
  slug: string;
  title: string;
  segment: CaseStudySegment;
  location: string;
  summary: string;
  clientProfile: string;
  problem: string;
  solution: string;
  equipment: string;
  timeline: string;
  metrics: { label: string; value: string }[];
  challenges: string[];
  lessons: string[];
  relatedLanding: string;
  relatedTools: { href: string; label: string }[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "firma-logistica-timisoara",
    title: "Flotă curierat — 6 stații AC + 1 DC",
    segment: "firma",
    location: "Timișoara",
    summary:
      "Operator logistic cu 40 vehicule electrice — infrastructură mixtă AC overnight + DC rapid pentru rotație.",
    clientProfile: "Firmă logistică, 120 angajați, flotă 40 EV",
    problem:
      "Vehiculele reveneau descărcate după ture de 200+ km. Stațiile publice generau timp mort și costuri imprevizibile.",
    solution:
      "6× ChargePro Pro 22 kW în depozit + 1× VoltEdge DC 60 kW la rampă. OCPP centralizat, rapoarte consum per vehicul.",
    equipment: "6× AC 22 kW OCPP + 1× DC 60 kW CCS2",
    timeline: "Proiect 6 săptămâni — audit, avize, execuție, test flotă",
    metrics: [
      { label: "Reducere timp mort", value: "−35%" },
      { label: "Cost/kWh mediu", value: "1,15 RON" },
      { label: "Payback estimat", value: "31 luni" },
    ],
    challenges: [
      "Putere contractată insuficientă — negociere upgrade cu distribuitor",
      "Programare încărcare pe ture de noapte",
    ],
    lessons: [
      "Mix AC+DC este optim când 70% din vehicule stau >8h dar 30% necesită rotație rapidă.",
      "OCPP obligatoriu pentru flote >10 vehicule.",
    ],
    relatedLanding: "/statie-incarcare-firma",
    relatedTools: [
      { href: "/tools/calculator-amortizare-firma", label: "Calculator amortizare" },
      { href: "/tools/calculator-electric-up", label: "Electric Up" },
    ],
  },
  {
    slug: "hotel-boutique-cluj",
    title: "Hotel boutique — perk premium oaspeți EV",
    segment: "hotel",
    location: "Cluj-Napoca",
    summary:
      "Hotel 32 camere adaugă 2 wallbox-uri 11 kW și pachet cameră EV — diferențiator pe Booking.",
    clientProfile: "Hotel boutique 4*, 32 camere, parcare 20 locuri",
    problem:
      "Oaspeții EV aleg competitori cu încărcare. Recenzii negative menționau lipsa infrastructurii.",
    solution:
      "2× ChargePro Wall 11 kW cu rezervare recepție. Pachet cameră + încărcare overnight 59 RON.",
    equipment: "2× AC 11 kW Type 2, smart scheduling",
    timeline: "10 zile de la contract la recepție activă",
    metrics: [
      { label: "Ocupare posturi EV", value: "68%" },
      { label: "Venit ancillary / lună", value: "~2.400 RON" },
      { label: "Rating Booking EV", value: "+0,3 stele" },
    ],
    challenges: [
      "Parcare deschisă — protecție IP55 și iluminat",
      "Comunicare clară tarif în confirmare rezervare",
    ],
    lessons: [
      "Overnight AC este suficient pentru 95% din oaspeți hotel — DC rar justificat sub 50 camere.",
      "Integrarea în pachet cameră simplifică facturarea.",
    ],
    relatedLanding: "/statie-incarcare-hotel",
    relatedTools: [{ href: "/tools/calculator-roi", label: "Calculator ROI" }],
  },
  {
    slug: "bloc-bucuresti",
    title: "Condominiu București — 12 locuri cu load balancing",
    segment: "bloc",
    location: "București, Sector 3",
    summary:
      "Asociație de proprietari aprobă 12 locuri EV cu facturare individuală și load balancing dinamic.",
    clientProfile: "Bloc 120 apartamente, parcare subterană",
    problem:
      "12 proprietari EV fără soluție legală de încărcare. Risc fire provizorii și dezacord în AGA.",
    solution:
      "Documentație AGA, 6× stații 22 kW cu 2 conectori, subcontorizare, platformă facturare.",
    equipment: "6× EcoWatt Business 22 kW + gateway load balancing",
    timeline: "AGA → avize → execuție: 10 săptămâni",
    metrics: [
      { label: "Locuri deservite", value: "12" },
      { label: "Cost mediu/loc/lună", value: "195 RON" },
      { label: "Incidente rețea", value: "0" },
    ],
    challenges: [
      "Consens AGA — prezentare ROI individual per apartament",
      "Coloană 150 kW shared — algoritm prioritizare",
    ],
    lessons: [
      "Documentația pentru AGA trebuie pregătită înainte de vot — reduce obiecțiile.",
      "Load balancing evită upgrade costisitor de putere contractată.",
    ],
    relatedLanding: "/statie-incarcare-bloc",
    relatedTools: [
      { href: "/tools/calculator-cost-incarcare", label: "Cost vs public" },
    ],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export function getCaseStudiesBySegment(
  segment: CaseStudySegment
): CaseStudy[] {
  return CASE_STUDIES.filter((c) => c.segment === segment);
}
