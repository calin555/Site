"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToolResultPanel, StatBox } from "@/components/tools/ToolResultPanel";
import { calculateSolarEvSizing } from "@/lib/tools/calculators";
import type { SolarEvInput } from "@/types/tools";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Sun } from "lucide-react";

const defaultInput: SolarEvInput = {
  dailyKm: 50,
  consumptionKwhPer100: 18,
  roofAreaSqm: 40,
  chargerPowerKw: 11,
  electricityPriceRon: 1.2,
  solarRadiationKwhPerSqm: 4.5,
};

export function SolarEvCalculator() {
  const [input, setInput] = useState<SolarEvInput>(defaultInput);
  const [result, setResult] = useState<ReturnType<typeof calculateSolarEvSizing> | null>(null);

  function update<K extends keyof SolarEvInput>(key: K, value: SolarEvInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card padding="lg" className="space-y-5">
        <Input
          label="Kilometri parcurși zilnic"
          type="number"
          min={5}
          value={input.dailyKm}
          onChange={(e) => update("dailyKm", Number(e.target.value))}
        />
        <Input
          label="Consum vehicul (kWh/100 km)"
          type="number"
          min={10}
          max={35}
          step={0.5}
          value={input.consumptionKwhPer100}
          onChange={(e) => update("consumptionKwhPer100", Number(e.target.value))}
          hint="Medie EV: 15–22 kWh/100 km"
        />
        <Input
          label="Suprafață acoperiș disponibilă (m²)"
          type="number"
          min={10}
          value={input.roofAreaSqm}
          onChange={(e) => update("roofAreaSqm", Number(e.target.value))}
        />
        <Input
          label="Preț energie (RON/kWh)"
          type="number"
          min={0.5}
          step={0.05}
          value={input.electricityPriceRon}
          onChange={(e) => update("electricityPriceRon", Number(e.target.value))}
        />
        <Button onClick={() => setResult(calculateSolarEvSizing(input))} size="lg" className="w-full">
          Dimensionează sistemul
        </Button>
      </Card>

      <div>
        {result ? (
          <div className="space-y-4">
            <ToolResultPanel title="Dimensionare Solar + EV" variant="success">
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <StatBox label="Sistem solar" value={`${result.recommendedSolarKw} kWp`} highlight />
                <StatBox label="Panouri" value={`${result.panelCount} × 450W`} />
                <StatBox label="Stație EV" value={`${result.recommendedChargerKw} kW`} />
                <StatBox label="Consum EV/zi" value={`${result.dailyEvEnergyKwh} kWh`} />
                <StatBox label="Producție/an" value={`${result.annualSolarProductionKwh.toLocaleString("ro-RO")} kWh`} />
                <StatBox label="Economii/an" value={formatPrice(result.annualSavingsRon)} highlight />
              </div>
              <p className="mb-4 text-sm text-surface-600">
                Autoconsum estimat: <strong>{result.selfConsumptionPercent}%</strong> din producția solară
              </p>
              <ul className="space-y-2 text-sm text-surface-600">
                {result.notes.map((note) => (
                  <li key={note} className="flex gap-2">
                    <Sun className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {note}
                  </li>
                ))}
              </ul>
            </ToolResultPanel>
            <Link href="/blog/solar-plus-ev-charging-integrare" className="text-sm font-medium text-brand-600 hover:underline">
              Citește ghidul Solar + EV →
            </Link>
          </div>
        ) : (
          <Card padding="lg" className="flex h-full min-h-[300px] items-center justify-center text-center text-surface-500">
            Introdu datele de consum și suprafața disponibilă.
          </Card>
        )}
      </div>
    </div>
  );
}
