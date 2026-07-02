export type EvPhase = "SINGLE" | "THREE";
export type EvConnector = "Type 2" | "CCS2" | "CHAdeMO" | "Tesla";

export interface EvVehicle {
  slug: string;
  brand: string;
  model: string;
  yearFrom: number;
  yearTo?: number;
  batteryKwh: number;
  acMaxKw: number;
  dcMaxKw: number;
  acConnector: EvConnector;
  dcConnector: EvConnector;
  phases: EvPhase;
  recommendedChargerKw: number;
  recommendedHomeChargerKw: number;
  recommendedPortableCharger: string;
  recommendedAccessories: string[];
  installationNote: string;
  image: string;
  relatedLanding?: string;
}

export type CompatibilityBadge =
  | "perfect_match"
  | "recommended"
  | "fast_charging"
  | "best_value"
  | "professional_installation";

export interface MatchedProduct {
  productId: string;
  badges: CompatibilityBadge[];
  matchScore: number;
  matchReasons: string[];
}

export interface CompatibilityMatch {
  vehicle: EvVehicle;
  stations: MatchedProduct[];
  accessories: MatchedProduct[];
  chargingTimeHome: string;
  chargingTimeFast: string;
  relatedVehicles: EvVehicle[];
  faq: { question: string; answer: string }[];
}

export interface VehicleSearchResult {
  slug: string;
  label: string;
  brand: string;
  model: string;
  subtitle: string;
}

export const BADGE_LABELS: Record<CompatibilityBadge, string> = {
  perfect_match: "Perfect Match",
  recommended: "Recomandat",
  fast_charging: "Fast Charging",
  best_value: "Best Value",
  professional_installation: "Instalare profesională",
};
