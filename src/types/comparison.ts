export type PhaseLabel = "1-phase" | "3-phase";
export type ChargerTypeLabel = "AC" | "DC";
export type OcppVersionLabel = "none" | "1.6J" | "2.0.1";
export type PowerClass = "7" | "11" | "22" | "50+";

export interface NormalizedChargerSpec {
  power_kw: number;
  power_class: PowerClass;
  phase: PhaseLabel;
  current_amps?: number;
  connector: string;
  connectors: string[];
  type: ChargerTypeLabel;
  ocpp: OcppVersionLabel;
  load_balancing: boolean;
  smart_charging: boolean;
  rfid_control: boolean;
  app_control: boolean;
  backend_connectivity: boolean;
  remote_management: boolean;
  firmware_ota: boolean;
  ip_rating?: string;
  mounting_type?: string;
  price: number;
  currency: string;
  tier: "residential" | "commercial" | "enterprise";
  ocpp_confidence: number;
  ocpp_claim_suspicious: boolean;
}

export interface CompareQuery {
  power_kw: number;
  phase: PhaseLabel;
  connector: string;
  ocpp?: OcppVersionLabel;
  type?: ChargerTypeLabel;
  current_amps?: number;
  ip_rating?: string;
  load_balancing?: boolean;
  reference_price?: number;
}

export interface CompareMatch {
  ref_id: string;
  price: number;
  currency: string;
  similarity: number;
  ocpp_match: boolean;
  electrical_match: number;
  connector_match: number;
  ocpp_score: number;
  smart_score: number;
  ip_score: number;
  source_site: string;
  source_url?: string;
  source_link_active: boolean;
  is_own_site: boolean;
  specs: NormalizedChargerSpec;
  savings_vs_market?: number;
  savings_percent?: number;
}

export interface BestPriceInfo {
  price: number;
  currency: string;
  source_site: string;
  source_url?: string;
  source_link_active: boolean;
  is_own_site: boolean;
  similarity: number;
  ocpp_match: boolean;
}

export interface CompareResult {
  query: CompareQuery;
  matches: CompareMatch[];
  best_price: BestPriceInfo | null;
  market: "RO";
  market_label: string;
  market_avg: number;
  market_min: number;
  market_max: number;
  market_sample_count: number;
  position: "below market" | "at market" | "above market" | "unknown";
  best_match_type: string;
  ocpp_cluster_avg?: number;
  compatible_backend: boolean;
  tier_detected: "residential" | "commercial" | "enterprise";
  alerts: string[];
}

export interface ScrapedOfferInput {
  power_kw: number;
  phase: PhaseLabel;
  connector: string;
  type: ChargerTypeLabel;
  ocpp?: OcppVersionLabel;
  load_balancing?: boolean;
  price: number;
  source_url?: string;
  raw_text?: string;
  current_amps?: number;
  ip_rating?: string;
  mounting_type?: string;
}
