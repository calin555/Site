import type { EvVehicle } from "@/lib/compatibility/types";

export function buildVehicleMetaTitle(vehicle: EvVehicle): string {
  return `Stație încărcare ${vehicle.brand} ${vehicle.model} — compatibilitate EV`;
}

export function buildVehicleMetaDescription(vehicle: EvVehicle): string {
  return `Găsește stații de încărcare compatibile cu ${vehicle.brand} ${vehicle.model}. Conector ${vehicle.acConnector}, max ${vehicle.acMaxKw} kW AC, ${vehicle.dcMaxKw} kW DC. Produse verificate din catalog ChargePro.`;
}

export function buildVehicleKeywords(vehicle: EvVehicle): string[] {
  return [
    `stație încărcare ${vehicle.brand}`,
    `wallbox ${vehicle.model}`,
    `încărcare ${vehicle.brand} acasă`,
    `compatibilitate ${vehicle.brand} ${vehicle.model}`,
    `stație EV ${vehicle.brand} România`,
    `încărcător ${vehicle.model}`,
  ];
}

export function buildVehicleFaq(
  vehicle: EvVehicle
): { question: string; answer: string }[] {
  const fullName = `${vehicle.brand} ${vehicle.model}`;
  const yearLabel = vehicle.yearTo
    ? `${vehicle.yearFrom}–${vehicle.yearTo}`
    : `din ${vehicle.yearFrom}`;

  return [
    {
      question: `Ce conector folosește ${fullName}?`,
      answer: `${fullName} (${yearLabel}) folosește ${vehicle.acConnector} pentru încărcare AC (acasă, wallbox) și ${vehicle.dcConnector} pentru încărcare rapidă DC la stații publice.`,
    },
    {
      question: `Ce putere AC acceptă ${fullName}?`,
      answer: `Onboard charger-ul acceptă până la ${vehicle.acMaxKw} kW AC. Recomandăm o stație de ${vehicle.recommendedHomeChargerKw} kW pentru echilibrul optim între viteză, cost instalare și consum rețea.`,
    },
    {
      question: `Cât durează încărcarea completă acasă?`,
      answer: `Cu o stație de ${vehicle.recommendedHomeChargerKw} kW, de la 20% la 80% SOC durează aproximativ ${Math.round((vehicle.batteryKwh * 0.6) / vehicle.recommendedHomeChargerKw)} ore. Încărcarea completă 0–100% durează mai mult din cauza taper-ului bateriei.`,
    },
    {
      question: `Am nevoie de monofazat sau trifazat?`,
      answer:
        vehicle.phases === "SINGLE"
          ? `${fullName} se încarcă optim pe monofazat (7,4 kW max). Un wallbox trifazat de 22 kW nu va accelera încărcarea — vehiculul limitează la ${vehicle.acMaxKw} kW.`
          : `${fullName} beneficiază de trifazat pentru ${vehicle.recommendedHomeChargerKw} kW AC. Verificați branșamentul — minim 16A pe fază pentru 11 kW.`,
    },
    {
      question: `Ce stații din catalog sunt compatibile?`,
      answer: `Filtrăm automat produsele după conector ${vehicle.acConnector}, putere AC/DC și specificații tehnice. Vezi secțiunea „Încărcătoare compatibile” pentru stațiile potrivite ${fullName}.`,
    },
    {
      question: `Este necesară instalare profesională?`,
      answer: `Da, pentru orice wallbox peste priza standard este obligatorie instalare de către electrician autorizat ANRE, cu RCBO Tip A și circuit dedicat. ChargePro oferă consultanță și coordonare instalare.`,
    },
  ];
}

export function buildChargingGuideParagraphs(vehicle: EvVehicle): string[] {
  const fullName = `${vehicle.brand} ${vehicle.model}`;
  return [
    `${fullName} are o baterie de ${vehicle.batteryKwh} kWh și acceptă până la ${vehicle.acMaxKw} kW AC și ${vehicle.dcMaxKw} kW DC rapid.`,
    `Pentru uz zilnic acasă, recomandăm stație wallbox ${vehicle.recommendedHomeChargerKw} kW cu conector ${vehicle.acConnector}. ${vehicle.recommendedPortableCharger} este util pentru încărcare la priză sau în deplasare.`,
    vehicle.installationNote,
  ];
}
