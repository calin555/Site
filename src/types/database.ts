export type PhaseType = "SINGLE" | "THREE";
export type ConnectorType = "TYPE1" | "TYPE2" | "CCS2" | "CHADEMO" | "TESLA";
export type ChargerType = "AC" | "DC";
export type OcppVersion = "NONE" | "OCPP_1_6J" | "OCPP_2_0_1";
export type ChargerTier = "RESIDENTIAL" | "COMMERCIAL" | "ENTERPRISE";
export type MarketSourceType = "INTERNAL" | "SCRAPED" | "MANUAL";
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";
export type AddressType = "SHIPPING" | "BILLING" | "BOTH";

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  sku: string;
  price: number | string;
  compareAtPrice: number | string | null;
  stock: number;
  categoryId: string;
  brandId: string;
  powerKw: number | string;
  phases: PhaseType;
  connectorTypes: ConnectorType[];
  isFeatured: boolean;
  isPublished: boolean;
  smartFeatures: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImageRow {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductWithRelations extends ProductRow {
  category: { name: string; slug: string };
  brand: { name: string; slug: string };
  images: ProductImageRow[];
}

export interface MarketOfferRow {
  id: string;
  productId: string | null;
  sourceType: MarketSourceType;
  sourceUrl: string | null;
  specFingerprint: string;
  powerKw: number | string;
  phase: PhaseType;
  currentAmps: number | string | null;
  chargerType: ChargerType;
  connectorTypes: ConnectorType[];
  ipRating: string | null;
  mountingType: string | null;
  ocppVersion: OcppVersion;
  loadBalancing: boolean;
  smartCharging: boolean;
  rfidControl: boolean;
  appControl: boolean;
  backendConnectivity: boolean;
  remoteManagement: boolean;
  firmwareOta: boolean;
  ocppConfidence: number;
  ocppClaimSuspicious: boolean;
  tier: ChargerTier;
  price: number | string;
  currency: string;
  marketCountry: string;
  sourceUrlActive: boolean;
  sourceUrlCheckedAt: string | null;
  rawText: string | null;
  isActive: boolean;
  lastScrapedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MarketClusterRow {
  id: string;
  powerClass: string;
  ocppVersion: OcppVersion;
  chargerType: ChargerType;
  avgPrice: number | string;
  minPrice: number | string;
  maxPrice: number | string;
  sampleCount: number;
  computedAt: string;
}
