import { createHash } from "crypto";
import type { ConnectorType } from "@/types/database";
import type {
  ChargerTypeLabel,
  NormalizedChargerSpec,
  OcppVersionLabel,
  PhaseLabel,
  PowerClass,
  ScrapedOfferInput,
} from "@/types/comparison";
import { extractOcppFromText } from "./ocpp.extractor";

export function powerToClass(kw: number): PowerClass {
  if (kw >= 50) return "50+";
  if (kw >= 22) return "22";
  if (kw >= 11) return "11";
  return "7";
}

export function phaseFromDb(value: string): PhaseLabel {
  return value === "THREE" ? "3-phase" : "1-phase";
}

export function phaseToDb(value: PhaseLabel): "SINGLE" | "THREE" {
  return value === "3-phase" ? "THREE" : "SINGLE";
}

export function connectorFromDb(values: string[]): string {
  const map: Record<string, string> = {
    TYPE2: "Type 2",
    TYPE1: "Type 1",
    CCS2: "CCS",
    CHADEMO: "CHAdeMO",
    TESLA: "Tesla",
  };
  return values.map((v) => map[v] ?? v).join(", ") || "Type 2";
}

export function connectorToEnum(connector: string): ConnectorType {
  const c = connector.toLowerCase();
  if (c.includes("ccs")) return "CCS2";
  if (c.includes("chademo")) return "CHADEMO";
  if (c.includes("type 1") || c.includes("type1")) return "TYPE1";
  if (c.includes("tesla")) return "TESLA";
  return "TYPE2";
}

export function inferChargerType(
  powerKw: number,
  connectors: string[],
  explicit?: ChargerTypeLabel
): ChargerTypeLabel {
  if (explicit) return explicit;
  const dcConnectors = connectors.some((c) =>
    /ccs|chademo|gb\/t/i.test(c)
  );
  if (dcConnectors || powerKw >= 50) return "DC";
  return "AC";
}

export function classifyTier(spec: {
  power_kw: number;
  ocpp: OcppVersionLabel;
  load_balancing: boolean;
  backend_connectivity: boolean;
  remote_management: boolean;
  type: ChargerTypeLabel;
}): "residential" | "commercial" | "enterprise" {
  if (
    spec.type === "DC" &&
    spec.power_kw >= 50 &&
    spec.ocpp !== "none" &&
    spec.backend_connectivity
  ) {
    return "enterprise";
  }
  if (
    spec.ocpp !== "none" &&
    (spec.load_balancing || spec.remote_management || spec.power_kw >= 22)
  ) {
    return "commercial";
  }
  return "residential";
}

export function buildSpecFingerprint(parts: {
  power_kw: number;
  phase: PhaseLabel;
  type: ChargerTypeLabel;
  connector: string;
  ocpp: OcppVersionLabel;
}): string {
  const raw = [
    parts.power_kw,
    parts.phase,
    parts.type,
    parts.connector.toLowerCase(),
    parts.ocpp,
  ].join("|");
  return createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

export function normalizeFromScraped(
  input: ScrapedOfferInput
): NormalizedChargerSpec {
  const text = input.raw_text ?? "";
  const ocppExtract = text
    ? extractOcppFromText(text)
    : {
        version: (input.ocpp ?? "none") as OcppVersionLabel,
        confidence: input.ocpp ? 0.8 : 0.7,
        suspicious: false,
        loadBalancing: input.load_balancing ?? false,
        smartCharging: false,
        backendConnectivity: false,
        remoteManagement: false,
        firmwareOta: false,
        rfidControl: false,
        appControl: false,
        signals: [],
      };

  const connectors = input.connector.split(/[,+/]/).map((c) => c.trim());
  const type = inferChargerType(input.power_kw, connectors, input.type);

  const spec: NormalizedChargerSpec = {
    power_kw: input.power_kw,
    power_class: powerToClass(input.power_kw),
    phase: input.phase,
    current_amps: input.current_amps,
    connector: connectors[0] ?? "Type 2",
    connectors,
    type,
    ocpp: input.ocpp ?? ocppExtract.version,
    load_balancing: input.load_balancing ?? ocppExtract.loadBalancing,
    smart_charging: ocppExtract.smartCharging,
    rfid_control: ocppExtract.rfidControl,
    app_control: ocppExtract.appControl,
    backend_connectivity: ocppExtract.backendConnectivity,
    remote_management: ocppExtract.remoteManagement,
    firmware_ota: ocppExtract.firmwareOta,
    ip_rating: input.ip_rating,
    mounting_type: input.mounting_type,
    price: input.price,
    currency: "RON",
    tier: "residential",
    ocpp_confidence: ocppExtract.confidence,
    ocpp_claim_suspicious: ocppExtract.suspicious,
  };

  spec.tier = classifyTier({
    power_kw: spec.power_kw,
    ocpp: spec.ocpp,
    load_balancing: spec.load_balancing,
    backend_connectivity: spec.backend_connectivity,
    remote_management: spec.remote_management,
    type: spec.type,
  });

  return spec;
}

export interface ProductLike {
  id: string;
  powerKw: number;
  phases: string;
  connectorTypes: string[];
  price: number;
  description?: string | null;
  shortDescription?: string | null;
  ipRating?: string | null;
  mountingType?: string | null;
  smartFeatures?: Record<string, unknown> | null;
}

export function normalizeFromProduct(product: ProductLike): NormalizedChargerSpec {
  const text = [
    product.description,
    product.shortDescription,
    JSON.stringify(product.smartFeatures ?? {}),
  ]
    .filter(Boolean)
    .join(" ");

  const ocppExtract = extractOcppFromText(text);
  const sf = product.smartFeatures ?? {};
  const connectors = connectorFromDb(product.connectorTypes).split(", ");

  const ocppFromFeatures = sf.ocpp as OcppVersionLabel | undefined;
  const ocpp: OcppVersionLabel =
    ocppFromFeatures && ocppFromFeatures !== "none"
      ? ocppFromFeatures
      : ocppExtract.version;

  const type = inferChargerType(product.powerKw, connectors);

  const spec: NormalizedChargerSpec = {
    power_kw: product.powerKw,
    power_class: powerToClass(product.powerKw),
    phase: phaseFromDb(product.phases),
    connector: connectors[0] ?? "Type 2",
    connectors,
    type,
    ocpp,
    load_balancing:
      Boolean(sf.loadBalancing) || ocppExtract.loadBalancing,
    smart_charging:
      Boolean(sf.smartCharging) || ocppExtract.smartCharging,
    rfid_control: Boolean(sf.rfidControl) || ocppExtract.rfidControl,
    app_control: Boolean(sf.appControl) || ocppExtract.appControl,
    backend_connectivity:
      Boolean(sf.backendConnectivity) || ocppExtract.backendConnectivity,
    remote_management:
      Boolean(sf.remoteManagement) || ocppExtract.remoteManagement,
    firmware_ota: Boolean(sf.firmwareOta) || ocppExtract.firmwareOta,
    ip_rating: product.ipRating ?? undefined,
    mounting_type: product.mountingType ?? undefined,
    price: product.price,
    currency: "RON",
    tier: "residential",
    ocpp_confidence: ocppExtract.confidence,
    ocpp_claim_suspicious: ocppExtract.suspicious,
  };

  spec.tier = classifyTier({
    power_kw: spec.power_kw,
    ocpp: spec.ocpp,
    load_balancing: spec.load_balancing,
    backend_connectivity: spec.backend_connectivity,
    remote_management: spec.remote_management,
    type: spec.type,
  });

  return spec;
}
