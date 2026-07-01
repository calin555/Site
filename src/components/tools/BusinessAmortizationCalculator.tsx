"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToolResultPanel, StatBox } from "@/components/tools/ToolResultPanel";
import { calculateBusinessAmortization } from "@/lib/tools/calculators";
import type { BusinessAmortizationInput } from "@/types/tools";
import { formatPrice } from "@/lib/utils";

const defaultInput: BusinessAmortizationInput = {
  chargerCostRon: 12000,
  installationCostRon: 8000,
  grantAmountRon: 6000,
  electricityPriceRon: 1.1,
  sessionsPerMonth: 120,
  kwhPerSession: 18,
  revenuePerKwh: 0,
  maintenanceAnnualRon: 800,
  employeeCount: 15,
  benefitPerEmployeeRon: 150,
  taxDeductionPercent: 16,
};

export function BusinessAmortizationCalculator() {
  const [input, setInput] = useState(defaultInput);
  const [result, setResult] = useState<ReturnType<
    typeof calculateBusinessAmortization
  > | null>(null);

  function update<K extends keyof BusinessAmortizationInput>(
    key: K,
    value: BusinessAmortizationInput[K]
  ) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card padding="lg" className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Cost echipament (RON)"
            type="number"
            min={0}
            value={input.chargerCostRon}
            onChange={(e) => update("chargerCostRon", Number(e.target.value))}
          />
          <Input
            label="Instalare (RON)"
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
            label="Angajați EV"
            type="number"
            min={1}
            value={input.employeeCount}
            onChange={(e) => update("employeeCount", Number(e.target.value))}
          />
          <Input
            label="Beneficiu / angajat / lună (RON)"
            type="number"
            min={0}
            value={input.benefitPerEmployeeRon}
            onChange={(e) => update("benefitPerEmployeeRon", Number(e.target.value))}
          />
        </div>
        <Input
          label="Deducere fiscală estimată (%)"
          type="number"
          min={0}
          max={50}
          value={input.taxDeductionPercent}
          onChange={(e) => update("taxDeductionPercent", Number(e.target.value))}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Sesiuni / lună"
            type="number"
            min={1}
            value={input.sessionsPerMonth}
            onChange={(e) => update("sessionsPerMonth", Number(e.target.value))}
          />
          <Input
            label="kWh / sesiune"
            type="number"
            min={1}
            value={input.kwhPerSession}
            onChange={(e) => update("kwhPerSession", Number(e.target.value))}
          />
        </div>
        <Button
          onClick={() => setResult(calculateBusinessAmortization(input))}
          size="lg"
          className="w-full"
        >
          Calculează amortizare
        </Button>
      </Card>

      <div>
        {result ? (
          <ToolResultPanel
            title={
              result.adjustedPaybackMonths > 0
                ? `Amortizare: ${result.adjustedPaybackMonths} luni`
                : "ROI insuficient"
            }
            variant={
              result.adjustedPaybackMonths > 0 && result.adjustedPaybackMonths <= 36
                ? "success"
                : "warning"
            }
          >
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <StatBox label="Investiție netă" value={formatPrice(result.netInvestmentRon)} />
              <StatBox
                label="Amortizare (cu beneficii)"
                value={`${result.adjustedPaybackMonths} luni`}
                highlight
              />
              <StatBox
                label="Beneficiu angajați / an"
                value={formatPrice(result.annualEmployeeBenefitRon)}
              />
              <StatBox
                label="Economie fiscală / an"
                value={formatPrice(result.annualTaxSavingRon)}
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
            <p className="mt-4 text-sm">
              <Link href="/statie-incarcare-firma" className="font-semibold text-brand-600 hover:underline">
                Audit gratuit infrastructură firmă
              </Link>
            </p>
          </ToolResultPanel>
        ) : (
          <Card padding="lg" className="flex h-full min-h-[300px] items-center justify-center text-center text-surface-500">
            Estimează amortizarea incluzând beneficii angajați și deduceri fiscale.
          </Card>
        )}
      </div>
    </div>
  );
}
