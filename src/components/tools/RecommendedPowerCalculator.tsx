"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToolRadioGroup } from "@/components/tools/ToolFormFields";
import { ToolResultPanel, StatBox } from "@/components/tools/ToolResultPanel";
import { calculateRecommendedPower } from "@/lib/tools/calculators";
import type { RecommendedPowerInput } from "@/types/tools";

const defaultInput: RecommendedPowerInput = {
  dailyKm: 50,
  batteryKwh: 60,
  availableHours: 8,
  phases: "THREE",
  maxAmps: 32,
};

export function RecommendedPowerCalculator() {
  const [input, setInput] = useState(defaultInput);
  const [result, setResult] = useState<ReturnType<
    typeof calculateRecommendedPower
  > | null>(null);

  function update<K extends keyof RecommendedPowerInput>(
    key: K,
    value: RecommendedPowerInput[K]
  ) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card padding="lg" className="space-y-5">
        <Input
          label="Km zilnici"
          type="number"
          min={5}
          value={input.dailyKm}
          onChange={(e) => update("dailyKm", Number(e.target.value))}
        />
        <Input
          label="Capacitate baterie (kWh)"
          type="number"
          min={20}
          value={input.batteryKwh}
          onChange={(e) => update("batteryKwh", Number(e.target.value))}
        />
        <Input
          label="Ore disponibile încărcare"
          type="number"
          min={2}
          max={14}
          value={input.availableHours}
          onChange={(e) => update("availableHours", Number(e.target.value))}
        />
        <ToolRadioGroup
          label="Tip rețea"
          value={input.phases}
          onChange={(v) => update("phases", v as RecommendedPowerInput["phases"])}
          options={[
            { value: "SINGLE", label: "Monofazat", description: "Max ~7,4 kW" },
            { value: "THREE", label: "Trifazat", description: "Până la 22 kW" },
          ]}
        />
        <Input
          label="Amperaj circuit disponibil (A)"
          type="number"
          min={16}
          max={63}
          value={input.maxAmps}
          onChange={(e) => update("maxAmps", Number(e.target.value))}
        />
        <Button
          onClick={() => setResult(calculateRecommendedPower(input))}
          size="lg"
          className="w-full"
        >
          Recomandă putere
        </Button>
      </Card>

      <div>
        {result ? (
          <ToolResultPanel
            title={`Putere recomandată: ${result.recommendedKw} kW`}
            variant="success"
          >
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <StatBox label="Putere recomandată" value={`${result.recommendedKw} kW`} highlight />
              <StatBox label="Timp estimat" value={`${result.estimatedHours} h`} />
              <StatBox label="Energie zilnică" value={`${result.dailyEnergyKwh} kWh`} />
            </div>
            <ul className="space-y-2 text-sm text-surface-600">
              {result.rationale.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <Link
                href={`/produse/categorie/statii-ac?power=${result.recommendedKw}`}
                className="font-semibold text-brand-600 hover:underline"
              >
                Vezi stații {result.recommendedKw} kW
              </Link>
              {" · "}
              <Link href="/tools/recomandare-statie" className="font-semibold text-brand-600 hover:underline">
                Wizard complet
              </Link>
            </p>
          </ToolResultPanel>
        ) : (
          <Card padding="lg" className="flex h-full min-h-[280px] items-center justify-center text-center text-surface-500">
            Dimensionează wallbox-ul după km și rețeaua electrică.
          </Card>
        )}
      </div>
    </div>
  );
}
