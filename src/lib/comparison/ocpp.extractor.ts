import type { OcppVersionLabel } from "@/types/comparison";

export interface OcppExtraction {
  version: OcppVersionLabel;
  confidence: number;
  suspicious: boolean;
  loadBalancing: boolean;
  smartCharging: boolean;
  backendConnectivity: boolean;
  remoteManagement: boolean;
  firmwareOta: boolean;
  rfidControl: boolean;
  appControl: boolean;
  signals: string[];
}

const OCPP_2_PATTERNS = [
  /\bocpp\s*2\.0\.1\b/i,
  /\bocpp\s*2\.0\b/i,
  /\bocpp\s*2\b/i,
  /\bopen\s*charge\s*point\s*protocol\s*2/i,
];

const OCPP_16_PATTERNS = [
  /\bocpp\s*1\.6\s*j(?:son)?\b/i,
  /\bocpp\s*1\.6\b/i,
  /\bocpp\s*1\.5\b/i,
  /\bopen\s*charge\s*point\s*protocol\s*1\.6/i,
];

const GENERIC_OCPP = /\bocpp\b/i;
const NO_OCPP = /\b(fără|fara|without|no)\s+ocpp\b/i;

const LOAD_BAL = [
  /\bload\s*balanc/i,
  /\bdynamic\s*load/i,
  /\bbalansare\s*(dinamică|dinamica|încărcare|incarcare)/i,
  /\bsmart\s*load/i,
];

const SMART = [
  /\bsmart\s*charg/i,
  /\bîncărcare\s*inteligentă\b/i,
  /\bincarcare\s*inteligenta\b/i,
];

const BACKEND = [
  /\bcsms\b/i,
  /\bbackend\b/i,
  /\bcloud\s*(connect|management)/i,
  /\bcentral\s*management/i,
  /\bplatformă\s*cloud\b/i,
];

const REMOTE = [
  /\bremote\s*(management|control|monitor)/i,
  /\bmonitorizare\s*la\s*dist/i,
  /\bgestionare\s*la\s*dist/i,
];

const FIRMWARE = [
  /\bfirmware\s*(update|ota|over.?the.?air)/i,
  /\bota\s*update/i,
  /\bactualizare\s*firmware/i,
];

const RFID = [/\brfid\b/i, /\bcard\s*rfid/i, /\bautentificare\s*card/i];
const APP = [
  /\bmobile\s*app/i,
  /\baplicație\s*mobilă\b/i,
  /\baplicatie\s*mobila\b/i,
  /\bapp\s*control/i,
];

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function detectVersion(text: string): {
  version: OcppVersionLabel;
  confidence: number;
} {
  if (NO_OCPP.test(text)) {
    return { version: "none", confidence: 0.9 };
  }

  const has20 = hasAny(text, OCPP_2_PATTERNS);
  const has16 = hasAny(text, OCPP_16_PATTERNS);
  const hasGeneric = GENERIC_OCPP.test(text);

  if (has20 && has16) {
    return { version: "2.0.1", confidence: 0.55 };
  }
  if (has20) return { version: "2.0.1", confidence: 0.92 };
  if (has16) return { version: "1.6J", confidence: 0.9 };
  if (hasGeneric) return { version: "1.6J", confidence: 0.45 };

  return { version: "none", confidence: 0.85 };
}

function detectSuspicious(text: string, version: OcppVersionLabel): boolean {
  const claimsOcpp = version !== "none" || GENERIC_OCPP.test(text);
  const hasBackend = hasAny(text, BACKEND);
  const hasRemote = hasAny(text, REMOTE);
  const hasFirmware = hasAny(text, FIRMWARE);

  if (!claimsOcpp && (hasBackend || hasRemote || hasFirmware)) {
    return true;
  }

  const contradictory =
    hasAny(text, OCPP_2_PATTERNS) && hasAny(text, OCPP_16_PATTERNS);
  return contradictory;
}

export function extractOcppFromText(text: string): OcppExtraction {
  const normalized = text.replace(/\s+/g, " ").trim();
  const { version, confidence } = detectVersion(normalized);
  const suspicious = detectSuspicious(normalized, version);

  const signals: string[] = [];
  if (version !== "none") signals.push(`ocpp:${version}`);
  if (hasAny(normalized, LOAD_BAL)) signals.push("load_balancing");
  if (hasAny(normalized, SMART)) signals.push("smart_charging");
  if (hasAny(normalized, BACKEND)) signals.push("backend");
  if (hasAny(normalized, REMOTE)) signals.push("remote");
  if (hasAny(normalized, FIRMWARE)) signals.push("firmware_ota");
  if (hasAny(normalized, RFID)) signals.push("rfid");
  if (hasAny(normalized, APP)) signals.push("app");

  return {
    version: suspicious && confidence < 0.6 ? "none" : version,
    confidence: suspicious ? Math.min(confidence, 0.5) : confidence,
    suspicious,
    loadBalancing: hasAny(normalized, LOAD_BAL),
    smartCharging: hasAny(normalized, SMART) || version !== "none",
    backendConnectivity: hasAny(normalized, BACKEND) || version !== "none",
    remoteManagement: hasAny(normalized, REMOTE),
    firmwareOta: hasAny(normalized, FIRMWARE),
    rfidControl: hasAny(normalized, RFID),
    appControl: hasAny(normalized, APP),
    signals,
  };
}

export function ocppLabelToEnum(
  label: OcppVersionLabel
): "NONE" | "OCPP_1_6J" | "OCPP_2_0_1" {
  switch (label) {
    case "1.6J":
      return "OCPP_1_6J";
    case "2.0.1":
      return "OCPP_2_0_1";
    default:
      return "NONE";
  }
}

export function ocppEnumToLabel(
  value: "NONE" | "OCPP_1_6J" | "OCPP_2_0_1"
): OcppVersionLabel {
  switch (value) {
    case "OCPP_1_6J":
      return "1.6J";
    case "OCPP_2_0_1":
      return "2.0.1";
    default:
      return "none";
  }
}

export function formatOcppBadge(label: OcppVersionLabel): string | null {
  if (label === "none") return null;
  return `OCPP ${label}`;
}
