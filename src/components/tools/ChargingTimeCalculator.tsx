"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToolResultPanel, StatBox } from "@/components/tools/ToolResultPanel";
import { calculateChargingTime } from "@/lib/tools/calculators";
import type { ChargingTimeInput } from "@/types/tools";

const defaultInput: ChargingTimeInput = {
  batteryKwh: 60,
  fromSocPercent: 20,
  toSocPercent: 80,
  chargerPowerKw: 11,
  efficiencyPercent: 92,
};

export function ChargingTimeCalculator() {
  const [input, setInput] = useState(defaultInput);
  const [result, setResult] = useState<ReturnType<typeof calculateChargingTime> | null>(
    null
  );

  function update<K extends keyof ChargingTimeInput>(key: K, value: ChargingTimeInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card padding="lg" className="space-y-5">
        <Input
          label="Capacitate baterie (kWh)"
          type="number"
          min={10}
          value={input.batteryKwh}
          onChange={(e) => update("batteryKwh", Number(e.target.value))}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="SOC start (%)"
            type="number"
            min={0}
            max={100}
            value={input.fromSocPercent}
            onChange={(e) => update("fromSocPercent", Number(e.target.value))}
          />
          <Input
            label="SOC țintă (%)"
            type="number"
            min={0}
            max={100}
            value={input.toSocPercent}
            onChange={(e) => update("toSocPercent", Number(e.target.value))}
          />
        </div>
        <Input
          label="Putere stație (kW)"
          type="number"
          min={3.7}
          step={0.1}
          value={input.chargerPowerKw}
          onChange={(e) => update("chargerPowerKw", Number(e.target.value))}
        />
        <Input
          label="Eficiență AC (%)"
          type="number"
          min={80}
          max={100}
          value={input.efficiencyPercent}
          onChange={(e) => update("efficiencyPercent", Number(e.target.value))}
        />
        <Button onClick={() => setResult(calculateChargingTime(input))} size="lg" className="w-full">
          Calculează timp
        </Button>
      </Card>

      <div>
        {result ? (
          <ToolResultPanel title={`Timp estimat: ${result.hoursFormatted}`} variant="success">
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <StatBox label="Energie de transferat" value={`${result.energyKwh} kWh`} />
              <StatBox label="Durată" value={result.hoursFormatted} highlight />
            </div>
            {result.notes.length > 0 && (
              <ul className="space-y-2 text-sm text-surface-600">
                {result.notes.map((n) => (
                  <li key={n}>• {n}</li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-sm">
              <Link href="/contact" className="font-semibold text-brand-600 hover:underline">
                Solicită ofertă wallbox
              </Link>{" "}
              dimensionat pentru vehiculul tău.
            </p>
          </ToolResultPanel>
        ) : (
          <Card padding="lg" className="flex h-full min-h-[280px] items-center justify-center text-center text-surface-500">
            Introdu datele bateriei și puterea stației.
          </Card>
        )}
      </div>
    </div>
  );
}
