"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToolRadioGroup } from "@/components/tools/ToolFormFields";
import { ToolResultPanel, StatBox } from "@/components/tools/ToolResultPanel";
import { calculateRoi } from "@/lib/tools/calculators";
import type { RoiInput } from "@/types/tools";
import { formatPrice } from "@/lib/utils";

const defaultInput: RoiInput = {
  chargerCostRon: 5500,
  installationCostRon: 2500,
  grantAmountRon: 2750,
  electricityPriceRon: 1.2,
  sessionsPerMonth: 60,
  kwhPerSession: 25,
  revenuePerKwh: 2.5,
  maintenanceAnnualRon: 500,
};

export function RoiCalculator() {
  const [input, setInput] = useState<RoiInput>(defaultInput);
  const [useRevenue, setUseRevenue] = useState(true);
  const [result, setResult] = useState<ReturnType<typeof calculateRoi> | null>(null);

  function update<K extends keyof RoiInput>(key: K, value: RoiInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  function handleCalculate() {
    const calcInput = {
      ...input,
      revenuePerKwh: useRevenue ? input.revenuePerKwh : undefined,
    };
    setResult(calculateRoi(calcInput));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card padding="lg" className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Cost stație (RON)"
            type="number"
            min={0}
            value={input.chargerCostRon}
            onChange={(e) => update("chargerCostRon", Number(e.target.value))}
          />
          <Input
            label="Cost instalare (RON)"
            type="number"
            min={0}
            value={input.installationCostRon}
            onChange={(e) => update("installationCostRon", Number(e.target.value))}
          />
        </div>
        <Input
          label="Grant / finanțare (RON)"
          type="number"
          min={0}
          value={input.grantAmountRon}
          onChange={(e) => update("grantAmountRon", Number(e.target.value))}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Sesiuni încărcare / lună"
            type="number"
            min={1}
            value={input.sessionsPerMonth}
            onChange={(e) => update("sessionsPerMonth", Number(e.target.value))}
          />
          <Input
            label="kWh per sesiune"
            type="number"
            min={1}
            value={input.kwhPerSession}
            onChange={(e) => update("kwhPerSession", Number(e.target.value))}
          />
        </div>
        <Input
          label="Preț energie (RON/kWh)"
          type="number"
          min={0.1}
          step={0.05}
          value={input.electricityPriceRon}
          onChange={(e) => update("electricityPriceRon", Number(e.target.value))}
        />
        <ToolRadioGroup
          label="Model utilizare"
          value={useRevenue ? "commercial" : "private"}
          onChange={(v) => setUseRevenue(v === "commercial")}
          options={[
            { value: "private", label: "Uz privat", description: "Doar cost energie" },
            { value: "commercial", label: "Comercial", description: "Cu venit din încărcare" },
          ]}
        />
        {useRevenue && (
          <Input
            label="Tarif încărcare clienți (RON/kWh)"
            type="number"
            min={0.5}
            step={0.1}
            value={input.revenuePerKwh ?? 2.5}
            onChange={(e) => update("revenuePerKwh", Number(e.target.value))}
          />
        )}
        <Input
          label="Mentenanță anuală (RON)"
          type="number"
          min={0}
          value={input.maintenanceAnnualRon}
          onChange={(e) => update("maintenanceAnnualRon", Number(e.target.value))}
        />
        <Button onClick={handleCalculate} size="lg" className="w-full">
          Calculează ROI
        </Button>
      </Card>

      <div>
        {result ? (
          <ToolResultPanel
            title={result.paybackMonths > 0 ? `Amortizare în ${result.paybackMonths} luni` : "ROI negativ"}
            variant={result.paybackMonths > 0 && result.paybackMonths <= 36 ? "success" : "warning"}
          >
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <StatBox label="Investiție netă" value={formatPrice(result.netInvestmentRon)} />
              <StatBox
                label="Beneficiu net / lună"
                value={formatPrice(result.monthlyNetBenefitRon)}
                highlight={result.monthlyNetBenefitRon > 0}
              />
              <StatBox label="ROI 5 ani" value={`${result.fiveYearRoiPercent}%`} highlight />
              <StatBox
                label="Perioadă amortizare"
                value={result.paybackMonths > 0 ? `${result.paybackMonths} luni` : "N/A"}
              />
            </div>
            <div className="space-y-2 rounded-xl bg-white/60 p-4">
              {result.breakdown.map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-surface-600">{row.label}</span>
                  <span className="font-medium text-surface-900">{row.value}</span>
                </div>
              ))}
            </div>
          </ToolResultPanel>
        ) : (
          <Card padding="lg" className="flex h-full min-h-[300px] items-center justify-center text-center text-surface-500">
            Configurează investiția și modelul de utilizare.
          </Card>
        )}
      </div>
    </div>
  );
}
