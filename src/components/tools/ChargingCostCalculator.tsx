"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToolResultPanel, StatBox } from "@/components/tools/ToolResultPanel";
import { calculateChargingCost } from "@/lib/tools/calculators";
import type { ChargingCostInput } from "@/types/tools";
import { formatPrice } from "@/lib/utils";

const defaultInput: ChargingCostInput = {
  monthlyKm: 1500,
  consumptionKwhPer100: 18,
  homePriceRon: 0.85,
  publicPriceRon: 2.4,
  chargerPowerKw: 11,
  chargeAtHomePercent: 85,
};

export function ChargingCostCalculator() {
  const [input, setInput] = useState(defaultInput);
  const [result, setResult] = useState<ReturnType<typeof calculateChargingCost> | null>(
    null
  );

  function update<K extends keyof ChargingCostInput>(key: K, value: ChargingCostInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card padding="lg" className="space-y-5">
        <Input
          label="Km parcurși / lună"
          type="number"
          min={100}
          value={input.monthlyKm}
          onChange={(e) => update("monthlyKm", Number(e.target.value))}
        />
        <Input
          label="Consum (kWh/100 km)"
          type="number"
          min={10}
          step={0.5}
          value={input.consumptionKwhPer100}
          onChange={(e) => update("consumptionKwhPer100", Number(e.target.value))}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Preț acasă (RON/kWh)"
            type="number"
            min={0.1}
            step={0.05}
            value={input.homePriceRon}
            onChange={(e) => update("homePriceRon", Number(e.target.value))}
          />
          <Input
            label="Preț public (RON/kWh)"
            type="number"
            min={0.5}
            step={0.1}
            value={input.publicPriceRon}
            onChange={(e) => update("publicPriceRon", Number(e.target.value))}
          />
        </div>
        <Input
          label="Încărcare acasă (%)"
          type="number"
          min={0}
          max={100}
          value={input.chargeAtHomePercent}
          onChange={(e) => update("chargeAtHomePercent", Number(e.target.value))}
        />
        <Button onClick={() => setResult(calculateChargingCost(input))} size="lg" className="w-full">
          Calculează cost
        </Button>
      </Card>

      <div>
        {result ? (
          <ToolResultPanel
            title={`Cost lunar: ${formatPrice(result.monthlyTotalRon)}`}
            variant="success"
          >
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <StatBox label="Consum lunar" value={`${result.monthlyKwh} kWh`} />
              <StatBox label="Cost anual" value={formatPrice(result.annualTotalRon)} highlight />
              <StatBox label="Acasă" value={formatPrice(result.monthlyHomeCostRon)} />
              <StatBox label="Public" value={formatPrice(result.monthlyPublicCostRon)} />
              <StatBox
                label="Economie vs 100% public"
                value={formatPrice(result.savingsVsAllPublicRon)}
                highlight
              />
            </div>
            <ul className="space-y-2 text-sm text-surface-600">
              {result.notes.map((n) => (
                <li key={n}>• {n}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <Link href="/statie-incarcare-acasa" className="font-semibold text-brand-600 hover:underline">
                Vezi pachete wallbox acasă
              </Link>
            </p>
          </ToolResultPanel>
        ) : (
          <Card padding="lg" className="flex h-full min-h-[280px] items-center justify-center text-center text-surface-500">
            Compară costul încărcării acasă vs stații publice.
          </Card>
        )}
      </div>
    </div>
  );
}
