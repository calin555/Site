import type {
  AfmCalculatorInput,
  AfmCalculatorResult,
  ElectricUpInput,
  ElectricUpResult,
} from "@/types/tools";

const AFM_MAX_GRANT_PERCENT = 0.8;
const AFM_MAX_PER_STATION_RON = 120_000;
const AFM_MIN_POWER_KW = 22;
const AFM_MIN_STATIONS = 2;

const ELECTRIC_UP_MAX_GRANT_PERCENT = 0.5;
const ELECTRIC_UP_MAX_GRANT_RON = 200_000;
const ELECTRIC_UP_MAX_EMPLOYEES = 250;
const ELECTRIC_UP_MAX_REVENUE_RON = 50_000_000;

export function calculateAfmEligibility(
  input: AfmCalculatorInput
): AfmCalculatorResult {
  const requirements: string[] = [];
  const blockers: string[] = [];
  let score = 0;

  if (input.entityType === "individual") {
    blockers.push("Persoanele fizice nu sunt eligibile pentru finanțarea AFM infrastructură publică.");
  } else {
    score += 25;
    requirements.push("Entitate juridică înregistrată în România.");
  }

  if (input.stationCount >= AFM_MIN_STATIONS) {
    score += 20;
    requirements.push(`Minimum ${AFM_MIN_STATIONS} stații în proiect.`);
  } else {
    blockers.push(`Proiectul necesită minimum ${AFM_MIN_STATIONS} stații de încărcare.`);
  }

  if (input.totalPowerKw / input.stationCount >= AFM_MIN_POWER_KW) {
    score += 15;
    requirements.push(`Putere medie minimum ${AFM_MIN_POWER_KW} kW per stație.`);
  } else {
    blockers.push(`Puterea medie per stație trebuie să fie minimum ${AFM_MIN_POWER_KW} kW.`);
  }

  if (input.hasOcpp) {
    score += 20;
    requirements.push("Stațiile trebuie să suporte protocol OCPP 1.6J sau superior.");
  } else {
    blockers.push("Obligatoriu: compatibilitate OCPP pentru management centralizat.");
  }

  if (input.isPublicAccess) {
    score += 10;
    requirements.push("Acces public sau semi-public la punctele de încărcare.");
  } else {
    blockers.push("Finanțarea AFM necesită acces public sau pentru flote deschise.");
  }

  if (input.projectValueRon >= 50_000) {
    score += 10;
    requirements.push("Valoare minimă proiect: 50.000 RON.");
  } else {
    blockers.push("Valoarea totală a proiectului este sub pragul minim de 50.000 RON.");
  }

  const eligible = blockers.length === 0;
  const grantPercent = eligible ? AFM_MAX_GRANT_PERCENT : 0;
  const rawGrant = input.projectValueRon * grantPercent;
  const stationCap = input.stationCount * AFM_MAX_PER_STATION_RON;
  const maxGrantRon = eligible ? Math.min(rawGrant, stationCap) : 0;
  const coFinancingRon = input.projectValueRon - maxGrantRon;

  const nextSteps = eligible
    ? [
        "Pregătește documentația tehnică (fișă proiect, amplasament, specificații stații).",
        "Obține avizele necesare de la distribuitorul de energie.",
        "Depune dosarul pe platforma AFM în perioada de înscriere activă.",
        "Contactează ChargePro pentru ofertă tehnică și suport la dosar.",
      ]
    : [
        "Remediază criteriile neîndeplinite listate mai sus.",
        "Consultă echipa ChargePro pentru reproiectare.",
      ];

  return {
    eligible,
    eligibilityScore: Math.min(100, score),
    maxGrantRon: Math.round(maxGrantRon),
    grantPercent: grantPercent * 100,
    coFinancingRon: Math.round(coFinancingRon),
    requirements,
    blockers,
    nextSteps,
  };
}

export function calculateElectricUp(
  input: ElectricUpInput
): ElectricUpResult {
  const requirements: string[] = [];
  const blockers: string[] = [];

  if (input.employeeCount > 0 && input.employeeCount <= ELECTRIC_UP_MAX_EMPLOYEES) {
    requirements.push(`IMM cu maximum ${ELECTRIC_UP_MAX_EMPLOYEES} angajați.`);
  } else if (input.employeeCount > ELECTRIC_UP_MAX_EMPLOYEES) {
    blockers.push("Compania depășește plafonul de angajați pentru IMM.");
  }

  if (input.annualRevenueRon > 0 && input.annualRevenueRon <= ELECTRIC_UP_MAX_REVENUE_RON) {
    requirements.push(`Cifră de afaceri sub ${(ELECTRIC_UP_MAX_REVENUE_RON / 1_000_000).toFixed(0)} mil. RON.`);
  } else if (input.annualRevenueRon > ELECTRIC_UP_MAX_REVENUE_RON) {
    blockers.push("Cifra de afaceri depășește plafonul programului.");
  }

  if (input.companyAgeYears >= 1) {
    requirements.push("Firmă activă minimum 12 luni.");
  } else {
    blockers.push("Firma trebuie să aibă minimum 1 an de activitate.");
  }

  if (input.stationCount >= 1 && input.stationCount <= 10) {
    requirements.push("Proiecte de 1–10 stații de încărcare AC/DC.");
  } else {
    blockers.push("Numărul de stații trebuie să fie între 1 și 10.");
  }

  if (input.chargerPowerKw >= 7.4) {
    requirements.push("Stații de minimum 7.4 kW.");
  } else {
    blockers.push("Puterea stației este sub pragul minim de 7.4 kW.");
  }

  if (input.projectValueRon >= 10_000) {
    requirements.push("Valoare minimă proiect: 10.000 RON.");
  } else {
    blockers.push("Valoarea proiectului este sub pragul minim.");
  }

  if (input.hasGreenCertificate) {
    requirements.push("Certificat verde / angajament sustenabilitate (punctaj bonus).");
  }

  const eligible = blockers.length === 0;
  const grantPercent = eligible ? ELECTRIC_UP_MAX_GRANT_PERCENT * 100 : 0;
  const rawGrant = input.projectValueRon * (eligible ? ELECTRIC_UP_MAX_GRANT_PERCENT : 0);
  const maxGrantRon = eligible
    ? Math.min(Math.round(rawGrant), ELECTRIC_UP_MAX_GRANT_RON)
    : 0;

  return {
    eligible,
    maxGrantRon,
    grantPercent,
    coFinancingRon: input.projectValueRon - maxGrantRon,
    estimatedProcessingDays: eligible ? 90 : 0,
    requirements,
    blockers,
  };
}
