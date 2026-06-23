import type { SolarEvInput, SolarEvResult, RoiInput, RoiResult } from "@/types/tools";

const PANEL_WATT = 450;
const PANEL_AREA_SQM = 2.1;
const SYSTEM_LOSSES = 0.85;

export function calculateSolarEvSizing(input: SolarEvInput): SolarEvResult {
  const dailyEvEnergyKwh =
    (input.dailyKm * input.consumptionKwhPer100) / 100;

  const recommendedChargerKw = dailyEvEnergyKwh <= 12
    ? 7.4
    : dailyEvEnergyKwh <= 25
      ? 11
      : 22;

  const annualEvEnergyKwh = dailyEvEnergyKwh * 365;
  const targetSolarKwh = annualEvEnergyKwh * 1.2;

  const maxSolarFromRoof =
    (input.roofAreaSqm / PANEL_AREA_SQM) * (PANEL_WATT / 1000) * SYSTEM_LOSSES;

  const recommendedSolarKw = Math.min(
    Math.ceil(targetSolarKwh / (input.solarRadiationKwhPerSqm * 365 * SYSTEM_LOSSES) * 10) / 10,
    Math.round(maxSolarFromRoof * 10) / 10
  );

  const panelCount = Math.ceil((recommendedSolarKw * 1000) / PANEL_WATT);
  const annualSolarProductionKwh = Math.round(
    recommendedSolarKw * input.solarRadiationKwhPerSqm * 365 * SYSTEM_LOSSES
  );

  const selfConsumptionPercent = Math.min(
    95,
    Math.round((annualEvEnergyKwh / annualSolarProductionKwh) * 100) || 0
  );

  const gridSavingsKwh = Math.min(annualEvEnergyKwh, annualSolarProductionKwh * 0.7);
  const annualSavingsRon = Math.round(gridSavingsKwh * input.electricityPriceRon);

  const notes: string[] = [];
  if (recommendedSolarKw >= maxSolarFromRoof * 0.95) {
    notes.push("Suprafața disponibilă limitează capacitatea solară — consideră panouri de eficiență mai mare.");
  }
  if (dailyEvEnergyKwh > 30) {
    notes.push("Consum ridicat — evaluați stație trifazată 22 kW și eventual baterii de stocare.");
  }
  if (selfConsumptionPercent < 50) {
    notes.push("Producția solară depășește consumul EV — surplusul poate fi injectat în rețea.");
  }
  notes.push(`Stație recomandată: ${recommendedChargerKw} kW pentru încărcare completă în ~${Math.ceil(dailyEvEnergyKwh / recommendedChargerKw)} ore.`);

  return {
    dailyEvEnergyKwh: Math.round(dailyEvEnergyKwh * 10) / 10,
    recommendedSolarKw,
    panelCount,
    annualSolarProductionKwh,
    selfConsumptionPercent,
    annualSavingsRon,
    recommendedChargerKw,
    notes,
  };
}

export function calculateRoi(input: RoiInput): RoiResult {
  const totalInvestmentRon = input.chargerCostRon + input.installationCostRon;
  const netInvestmentRon = totalInvestmentRon - input.grantAmountRon;

  const monthlyKwh = input.sessionsPerMonth * input.kwhPerSession;
  const monthlyEnergyCostRon = monthlyKwh * input.electricityPriceRon;
  const monthlyRevenueRon = input.revenuePerKwh
    ? monthlyKwh * input.revenuePerKwh
    : 0;
  const monthlyMaintenanceRon = input.maintenanceAnnualRon / 12;
  const monthlyNetBenefitRon = monthlyRevenueRon - monthlyEnergyCostRon - monthlyMaintenanceRon;

  const paybackMonths =
    monthlyNetBenefitRon > 0
      ? Math.ceil(netInvestmentRon / monthlyNetBenefitRon)
      : Infinity;

  const fiveYearBenefit = monthlyNetBenefitRon * 60;
  const fiveYearRoiPercent =
    netInvestmentRon > 0
      ? Math.round(((fiveYearBenefit - netInvestmentRon) / netInvestmentRon) * 100)
      : 0;

  const breakdown = [
    { label: "Investiție totală", value: `${totalInvestmentRon.toLocaleString("ro-RO")} RON` },
    { label: "Grant / finanțare", value: `-${input.grantAmountRon.toLocaleString("ro-RO")} RON` },
    { label: "Investiție netă", value: `${netInvestmentRon.toLocaleString("ro-RO")} RON` },
    { label: "Consum lunar", value: `${monthlyKwh.toFixed(0)} kWh` },
    { label: "Cost energie lunar", value: `${Math.round(monthlyEnergyCostRon).toLocaleString("ro-RO")} RON` },
  ];

  if (input.revenuePerKwh) {
    breakdown.push({
      label: "Venit lunar estimat",
      value: `${Math.round(monthlyRevenueRon).toLocaleString("ro-RO")} RON`,
    });
  }

  return {
    totalInvestmentRon,
    netInvestmentRon,
    monthlyEnergyCostRon: Math.round(monthlyEnergyCostRon),
    monthlyRevenueRon: Math.round(monthlyRevenueRon),
    monthlyNetBenefitRon: Math.round(monthlyNetBenefitRon),
    paybackMonths: paybackMonths === Infinity ? 0 : paybackMonths,
    fiveYearRoiPercent,
    breakdown,
  };
}
