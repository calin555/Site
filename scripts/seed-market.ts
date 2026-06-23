import type { ChargerTier, ChargerType } from "../src/types/database";
import { getSupabase } from "../src/lib/supabase/server";
import { SAMPLE_MARKET_OFFERS } from "../src/lib/comparison/sample-data";
import {
  normalizeFromScraped,
  buildSpecFingerprint,
  connectorToEnum,
  phaseToDb,
} from "../src/lib/comparison/normalize";
import { ocppLabelToEnum } from "../src/lib/comparison/ocpp.extractor";

async function seedMarketOffers() {
  const supabase = getSupabase();
  const now = new Date().toISOString();

  console.log("Seeding Romanian market comparison offers...");

  const { error: resetError } = await supabase
    .from("market_offers")
    .update({
      sourceUrl: null,
      sourceUrlActive: false,
      isActive: true,
      updatedAt: now,
    })
    .eq("sourceType", "SCRAPED")
    .not("sourceUrl", "is", null);

  if (resetError) throw resetError;

  for (const input of SAMPLE_MARKET_OFFERS) {
    const spec = normalizeFromScraped(input);
    const fingerprint = buildSpecFingerprint({
      power_kw: spec.power_kw,
      phase: spec.phase,
      type: spec.type,
      connector: spec.connector,
      ocpp: spec.ocpp,
    });

    const { data: existing, error: findError } = await supabase
      .from("market_offers")
      .select("id")
      .eq("specFingerprint", fingerprint)
      .eq("sourceType", "SCRAPED")
      .maybeSingle();

    if (findError) throw findError;

    const tier: ChargerTier =
      spec.tier === "enterprise"
        ? "ENTERPRISE"
        : spec.tier === "commercial"
          ? "COMMERCIAL"
          : "RESIDENTIAL";

    const data = {
      specFingerprint: fingerprint,
      powerKw: spec.power_kw,
      phase: phaseToDb(spec.phase),
      chargerType: spec.type as ChargerType,
      connectorTypes: spec.connectors.map((c) => connectorToEnum(c)),
      ocppVersion: ocppLabelToEnum(spec.ocpp),
      loadBalancing: spec.load_balancing,
      smartCharging: spec.smart_charging,
      rfidControl: spec.rfid_control,
      appControl: spec.app_control,
      backendConnectivity: spec.backend_connectivity,
      remoteManagement: spec.remote_management,
      firmwareOta: spec.firmware_ota,
      ocppConfidence: spec.ocpp_confidence,
      ocppClaimSuspicious: spec.ocpp_claim_suspicious,
      tier,
      price: spec.price,
      ipRating: spec.ip_rating ?? null,
      rawText: input.raw_text ?? null,
      sourceUrl: null,
      sourceType: "SCRAPED" as const,
      marketCountry: "RO",
      currency: "RON",
      sourceUrlActive: false,
      isActive: true,
      updatedAt: now,
    };

    if (existing) {
      const { error } = await supabase
        .from("market_offers")
        .update(data)
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      const { data: created, error } = await supabase
        .from("market_offers")
        .insert({ ...data, createdAt: now })
        .select("id")
        .single();

      if (error) throw error;

      const { error: historyError } = await supabase
        .from("market_offer_price_history")
        .insert({ offerId: created.id, price: spec.price });

      if (historyError) throw historyError;
    }
  }

  const { data: offers, error: offersError } = await supabase
    .from("market_offers")
    .select("powerKw, ocppVersion, chargerType, price")
    .eq("isActive", true)
    .eq("marketCountry", "RO")
    .eq("currency", "RON");

  if (offersError) throw offersError;

  const groups = new Map<string, number[]>();

  for (const o of offers ?? []) {
    const kw = Number(o.powerKw);
    const pc = kw >= 50 ? "50+" : kw >= 22 ? "22" : kw >= 11 ? "11" : "7";
    const key = `${pc}|${o.ocppVersion}|${o.chargerType}`;
    const arr = groups.get(key) ?? [];
    arr.push(Number(o.price));
    groups.set(key, arr);
  }

  const { error: deleteError } = await supabase
    .from("market_clusters")
    .delete()
    .neq("id", "");

  if (deleteError) throw deleteError;

  for (const [key, prices] of groups) {
    const [powerClass, ocppVersion, chargerType] = key.split("|");
    const sorted = prices.sort((a, b) => a - b);
    const avg = sorted.reduce((s, p) => s + p, 0) / sorted.length;

    const { error } = await supabase.from("market_clusters").insert({
      powerClass,
      ocppVersion: ocppVersion as "NONE" | "OCPP_1_6J" | "OCPP_2_0_1",
      chargerType: chargerType as "AC" | "DC",
      avgPrice: avg,
      minPrice: sorted[0],
      maxPrice: sorted[sorted.length - 1],
      sampleCount: sorted.length,
      computedAt: now,
    });

    if (error) throw error;
  }

  console.log(`Seeded ${offers?.length ?? 0} market offers, ${groups.size} clusters.`);
}

seedMarketOffers().catch(console.error);
