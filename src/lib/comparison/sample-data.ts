import type { ScrapedOfferInput } from "@/types/comparison";

/**
 * Estimări de piață RO (fără URL-uri fictive).
 * Linkurile reale provin doar din catalogul ChargePro (sync intern).
 */
export const SAMPLE_MARKET_OFFERS: ScrapedOfferInput[] = [
  {
    power_kw: 7.4,
    phase: "1-phase",
    connector: "Type 2",
    type: "AC",
    ocpp: "none",
    price: 1299,
    ip_rating: "IP54",
    raw_text: "Wallbox AC 7.4 kW monofazat, Type 2, protecție IP54. Fără OCPP.",
  },
  {
    power_kw: 11,
    phase: "3-phase",
    connector: "Type 2",
    type: "AC",
    ocpp: "1.6J",
    load_balancing: true,
    price: 1899,
    ip_rating: "IP54",
    raw_text:
      "Stație AC 11 kW trifazată Type 2. OCPP 1.6J JSON, load balancing dinamic, RFID, aplicație mobilă, backend cloud CSMS.",
  },
  {
    power_kw: 11,
    phase: "3-phase",
    connector: "Type 2",
    type: "AC",
    ocpp: "2.0.1",
    load_balancing: true,
    price: 2199,
    ip_rating: "IP55",
    raw_text:
      "Smart charger 11kW 3-phase Type2. OCPP 2.0.1, remote management, firmware OTA update, smart charging.",
  },
  {
    power_kw: 22,
    phase: "3-phase",
    connector: "Type 2",
    type: "AC",
    ocpp: "1.6J",
    load_balancing: true,
    price: 2499,
    ip_rating: "IP55",
    raw_text:
      "22 kW AC trifazat Type 2. OCPP 1.6J, balansare dinamică încărcare, monitorizare la distanță.",
  },
  {
    power_kw: 22,
    phase: "3-phase",
    connector: "Type 2",
    type: "AC",
    ocpp: "2.0.1",
    load_balancing: true,
    price: 2799,
    ip_rating: "IP56",
    raw_text:
      "22kW commercial AC charger OCPP 2.0.1 Type 2. Backend connectivity, load balancing, firmware update OTA.",
  },
  {
    power_kw: 11,
    phase: "3-phase",
    connector: "Type 2",
    type: "AC",
    ocpp: "1.6J",
    price: 1750,
    ip_rating: "IP54",
    raw_text:
      "11 kW Type 2 trifazat. Menționează cloud management dar fără OCPP explicit — posibil claim inconsistent.",
  },
  {
    power_kw: 50,
    phase: "3-phase",
    connector: "CCS",
    type: "DC",
    ocpp: "1.6J",
    load_balancing: true,
    price: 18500,
    ip_rating: "IP54",
    raw_text:
      "DC fast charger 50 kW CCS. OCPP 1.6J, CSMS backend, remote management, load balancing.",
  },
  {
    power_kw: 60,
    phase: "3-phase",
    connector: "CCS, CHAdeMO",
    type: "DC",
    ocpp: "2.0.1",
    load_balancing: true,
    price: 24500,
    ip_rating: "IP55",
    raw_text:
      "60kW DC station dual connector CCS CHAdeMO. OCPP 2.0.1 enterprise, firmware OTA, central management platform.",
  },
  {
    power_kw: 22,
    phase: "3-phase",
    connector: "Type 2",
    type: "AC",
    ocpp: "none",
    price: 1599,
    ip_rating: "IP44",
    raw_text: "22 kW AC Type 2 basic charger. RFID local, fără OCPP, fără cloud.",
  },
  {
    power_kw: 7.4,
    phase: "1-phase",
    connector: "Type 2",
    type: "AC",
    ocpp: "1.6J",
    price: 1499,
    ip_rating: "IP55",
    raw_text:
      "7.4 kW monofazat Type 2 cu OCPP 1.6J, app control, smart charging rezidențial.",
  },
];
