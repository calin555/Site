import type { CatalogProduct } from "@/types/catalog";

export type UseCase = "home" | "business" | "fleet" | "public";
export type PhaseType = "SINGLE" | "THREE";
export type ConnectorType = "Type 2" | "CCS2" | "Type 1" | "CHAdeMO";

export interface RecommendationInput {
  useCase: UseCase;
  phases: PhaseType;
  availableAmps: number;
  connector: ConnectorType;
  dailyKm: number;
  batteryKwh: number;
  budgetMax: number;
  needsOcpp: boolean;
  outdoorInstall: boolean;
}

export interface RecommendationResult {
  recommendedPowerKw: number;
  dailyEnergyKwh: number;
  estimatedChargeHours: number;
  products: Array<CatalogProduct & { score: number; matchReasons: string[] }>;
  tips: string[];
}

export interface AfmCalculatorInput {
  entityType: "company" | "municipality" | "ngo" | "individual";
  stationCount: number;
  totalPowerKw: number;
  hasOcpp: boolean;
  isPublicAccess: boolean;
  county: string;
  projectValueRon: number;
}

export interface AfmCalculatorResult {
  eligible: boolean;
  eligibilityScore: number;
  maxGrantRon: number;
  grantPercent: number;
  coFinancingRon: number;
  requirements: string[];
  blockers: string[];
  nextSteps: string[];
}

export interface ElectricUpInput {
  companyAgeYears: number;
  employeeCount: number;
  annualRevenueRon: number;
  stationCount: number;
  chargerPowerKw: number;
  projectValueRon: number;
  hasGreenCertificate: boolean;
}

export interface ElectricUpResult {
  eligible: boolean;
  maxGrantRon: number;
  grantPercent: number;
  coFinancingRon: number;
  estimatedProcessingDays: number;
  requirements: string[];
  blockers: string[];
}

export interface SolarEvInput {
  dailyKm: number;
  consumptionKwhPer100: number;
  roofAreaSqm: number;
  chargerPowerKw: number;
  electricityPriceRon: number;
  solarRadiationKwhPerSqm: number;
}

export interface SolarEvResult {
  dailyEvEnergyKwh: number;
  recommendedSolarKw: number;
  panelCount: number;
  annualSolarProductionKwh: number;
  selfConsumptionPercent: number;
  annualSavingsRon: number;
  recommendedChargerKw: number;
  notes: string[];
}

export interface RoiInput {
  chargerCostRon: number;
  installationCostRon: number;
  grantAmountRon: number;
  electricityPriceRon: number;
  sessionsPerMonth: number;
  kwhPerSession: number;
  revenuePerKwh?: number;
  maintenanceAnnualRon: number;
}

export interface ChargingTimeInput {
  batteryKwh: number;
  fromSocPercent: number;
  toSocPercent: number;
  chargerPowerKw: number;
  efficiencyPercent: number;
}

export interface ChargingTimeResult {
  energyKwh: number;
  hours: number;
  hoursFormatted: string;
  notes: string[];
}

export interface ChargingCostInput {
  monthlyKm: number;
  consumptionKwhPer100: number;
  homePriceRon: number;
  publicPriceRon: number;
  chargerPowerKw: number;
  chargeAtHomePercent: number;
}

export interface ChargingCostResult {
  monthlyKwh: number;
  monthlyHomeCostRon: number;
  monthlyPublicCostRon: number;
  monthlyTotalRon: number;
  annualTotalRon: number;
  savingsVsAllPublicRon: number;
  notes: string[];
}

export interface RecommendedPowerInput {
  dailyKm: number;
  batteryKwh: number;
  availableHours: number;
  phases: PhaseType;
  maxAmps: number;
}

export interface RecommendedPowerResult {
  recommendedKw: number;
  dailyEnergyKwh: number;
  estimatedHours: number;
  rationale: string[];
}

export interface RoiResult {
  totalInvestmentRon: number;
  netInvestmentRon: number;
  monthlyEnergyCostRon: number;
  monthlyRevenueRon: number;
  monthlyNetBenefitRon: number;
  paybackMonths: number;
  fiveYearRoiPercent: number;
  breakdown: { label: string; value: string }[];
}

export interface BusinessAmortizationInput extends RoiInput {
  employeeCount: number;
  benefitPerEmployeeRon: number;
  taxDeductionPercent: number;
}

export interface BusinessAmortizationResult extends RoiResult {
  annualEmployeeBenefitRon: number;
  annualTaxSavingRon: number;
  adjustedPaybackMonths: number;
}

export interface QuoteLineItem {
  productSlug?: string;
  name: string;
  quantity: number;
  unitPriceRon: number;
  description?: string;
}

export interface QuoteRequest {
  id: string;
  reference: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  county: string;
  city: string;
  notes: string;
  items: QuoteLineItem[];
  installationRon: number;
  grantDiscountRon: number;
  validUntil: string;
}

export interface Installer {
  id: string;
  name: string;
  slug: string;
  county: string;
  city: string;
  rating: number;
  reviewCount: number;
  certifications: string[];
  services: string[];
  minProjectRon: number;
  responseTimeHours: number;
  phone: string;
  email: string;
  description: string;
  completedProjects: number;
}

export interface InstallerFilter {
  county?: string;
  service?: string;
  minRating?: number;
}
