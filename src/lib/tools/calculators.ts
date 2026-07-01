import type {
  SolarEvInput,
  SolarEvResult,
  RoiInput,
  RoiResult,
  ChargingTimeInput,
  ChargingTimeResult,
  ChargingCostInput,
  ChargingCostResult,
  RecommendedPowerInput,
  RecommendedPowerResult,
  BusinessAmortizationInput,
  BusinessAmortizationResult,
} from "@/types/tools";

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

export function calculateChargingTime(input: ChargingTimeInput): ChargingTimeResult {
  const socDelta = Math.max(0, input.toSocPercent - input.fromSocPercent);
  const energyKwh = Math.round((input.batteryKwh * socDelta) / 100 * 10) / 10;
  const effectivePower = input.chargerPowerKw * (input.efficiencyPercent / 100);
  const hours = effectivePower > 0 ? energyKwh / effectivePower : 0;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  const notes: string[] = [];
  if (input.chargerPowerKw > 11 && input.batteryKwh <= 30) {
    notes.push("Vehiculul poate limita puterea AC sub valoarea stației — verificați onboard charger.");
  }
  if (input.efficiencyPercent < 95) {
    notes.push("Pierderi tipice AC: 5–10% (căldură cablu + conversie).");
  }

  return {
    energyKwh,
    hours: Math.round(hours * 100) / 100,
    hoursFormatted: m > 0 ? `${h} h ${m} min` : `${h} h`,
    notes,
  };
}

export function calculateChargingCost(input: ChargingCostInput): ChargingCostResult {
  const monthlyKwh = Math.round(
    ((input.monthlyKm * input.consumptionKwhPer100) / 100) * 10
  ) / 10;
  const homeKwh = monthlyKwh * (input.chargeAtHomePercent / 100);
  const publicKwh = monthlyKwh - homeKwh;
  const monthlyHomeCostRon = Math.round(homeKwh * input.homePriceRon);
  const monthlyPublicCostRon = Math.round(publicKwh * input.publicPriceRon);
  const monthlyTotalRon = monthlyHomeCostRon + monthlyPublicCostRon;
  const allPublicCost = Math.round(monthlyKwh * input.publicPriceRon);

  const notes: string[] = [];
  if (input.chargeAtHomePercent >= 80) {
    notes.push("Încărcare predominant acasă — cost/kWh cu 50–70% sub stațiile publice.");
  }
  notes.push(
    `Stație ${input.chargerPowerKw} kW — încărcare zilnică estimată ~${Math.ceil(monthlyKwh / 30 / input.chargerPowerKw)} h.`
  );

  return {
    monthlyKwh,
    monthlyHomeCostRon,
    monthlyPublicCostRon,
    monthlyTotalRon,
    annualTotalRon: monthlyTotalRon * 12,
    savingsVsAllPublicRon: allPublicCost - monthlyTotalRon,
    notes,
  };
}

export function calculateRecommendedPower(
  input: RecommendedPowerInput
): RecommendedPowerResult {
  const dailyEnergyKwh =
    Math.round(((input.dailyKm * 18) / 100) * 10) / 10 || input.batteryKwh * 0.3;

  const maxKwFromAmps =
    input.phases === "THREE"
      ? Math.round(((input.maxAmps * 400 * 1.732) / 1000) * 10) / 10
      : Math.round(((input.maxAmps * 230) / 1000) * 10) / 10;

  const neededKw =
    input.availableHours > 0
      ? Math.ceil((dailyEnergyKwh / input.availableHours) * 10) / 10
      : 7.4;

  let recommendedKw = neededKw <= 7.4 ? 7.4 : neededKw <= 11 ? 11 : 22;
  recommendedKw = Math.min(recommendedKw, maxKwFromAmps);

  const rationale: string[] = [
    `Consum zilnic estimat: ${dailyEnergyKwh} kWh (${input.dailyKm} km).`,
    `Limită rețea: ~${maxKwFromAmps} kW (${input.phases === "THREE" ? "trifazat" : "monofazat"} ${input.maxAmps}A).`,
  ];
  if (recommendedKw < neededKw) {
    rationale.push(
      "Puterea disponibilă limitează viteza — extindeți timpul de încărcare sau upgrade tablou."
    );
  }

  return {
    recommendedKw,
    dailyEnergyKwh,
    estimatedHours:
      recommendedKw > 0
        ? Math.round((dailyEnergyKwh / recommendedKw) * 10) / 10
        : 0,
    rationale,
  };
}

export function calculateBusinessAmortization(
  input: BusinessAmortizationInput
): BusinessAmortizationResult {
  const base = calculateRoi(input);
  const annualEmployeeBenefitRon =
    input.employeeCount * input.benefitPerEmployeeRon * 12;
  const annualTaxSavingRon = Math.round(
    (base.netInvestmentRon * input.taxDeductionPercent) / 100 / 5
  );
  const monthlyExtraBenefit =
    (annualEmployeeBenefitRon + annualTaxSavingRon) / 12;
  const adjustedMonthly = base.monthlyNetBenefitRon + monthlyExtraBenefit;
  const adjustedPaybackMonths =
    adjustedMonthly > 0
      ? Math.ceil(base.netInvestmentRon / adjustedMonthly)
      : 0;

  return {
    ...base,
    annualEmployeeBenefitRon,
    annualTaxSavingRon,
    adjustedPaybackMonths,
    breakdown: [
      ...base.breakdown,
      {
        label: "Beneficiu angajați / an",
        value: `${annualEmployeeBenefitRon.toLocaleString("ro-RO")} RON`,
      },
      {
        label: "Economie fiscală estimată / an",
        value: `${annualTaxSavingRon.toLocaleString("ro-RO")} RON`,
      },
    ],
  };
}
