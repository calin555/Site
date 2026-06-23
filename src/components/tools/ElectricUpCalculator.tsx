"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToolRadioGroup } from "@/components/tools/ToolFormFields";
import { ToolResultPanel, StatBox } from "@/components/tools/ToolResultPanel";
import { calculateElectricUp } from "@/lib/tools/grants";
import type { ElectricUpInput } from "@/types/tools";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const defaultInput: ElectricUpInput = {
  companyAgeYears: 3,
  employeeCount: 25,
  annualRevenueRon: 2_000_000,
  stationCount: 2,
  chargerPowerKw: 22,
  projectValueRon: 50_000,
  hasGreenCertificate: false,
};

export function ElectricUpCalculator() {
  const [input, setInput] = useState<ElectricUpInput>(defaultInput);
  const [result, setResult] = useState<ReturnType<typeof calculateElectricUp> | null>(null);

  function update<K extends keyof ElectricUpInput>(key: K, value: ElectricUpInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card padding="lg" className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Vechime firmă (ani)"
            type="number"
            min={0}
            value={input.companyAgeYears}
            onChange={(e) => update("companyAgeYears", Number(e.target.value))}
          />
          <Input
            label="Număr angajați"
            type="number"
            min={1}
            value={input.employeeCount}
            onChange={(e) => update("employeeCount", Number(e.target.value))}
          />
        </div>
        <Input
          label="Cifră de afaceri anuală (RON)"
          type="number"
          min={0}
          step={10000}
          value={input.annualRevenueRon}
          onChange={(e) => update("annualRevenueRon", Number(e.target.value))}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Număr stații"
            type="number"
            min={1}
            max={10}
            value={input.stationCount}
            onChange={(e) => update("stationCount", Number(e.target.value))}
          />
          <Input
            label="Putere stație (kW)"
            type="number"
            min={7.4}
            value={input.chargerPowerKw}
            onChange={(e) => update("chargerPowerKw", Number(e.target.value))}
          />
        </div>
        <Input
          label="Valoare proiect (RON)"
          type="number"
          min={10000}
          step={1000}
          value={input.projectValueRon}
          onChange={(e) => update("projectValueRon", Number(e.target.value))}
        />
        <ToolRadioGroup
          label="Certificat verde / angajament sustenabilitate"
          value={input.hasGreenCertificate ? "yes" : "no"}
          onChange={(v) => update("hasGreenCertificate", v === "yes")}
          options={[
            { value: "no", label: "Nu" },
            { value: "yes", label: "Da (+punctaj)" },
          ]}
        />
        <Button onClick={() => setResult(calculateElectricUp(input))} size="lg" className="w-full">
          Calculează finanțarea
        </Button>
      </Card>

      <div>
        {result ? (
          <div className="space-y-4">
            <ToolResultPanel
              title={result.eligible ? "Eligibil Electric Up" : "Neeligibil Electric Up"}
              variant={result.eligible ? "success" : "error"}
            >
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <StatBox label="Grant maxim" value={formatPrice(result.maxGrantRon)} highlight={result.eligible} />
                <StatBox label="Cofinanțare" value={formatPrice(result.coFinancingRon)} />
                <StatBox label="Procent finanțare" value={`${result.grantPercent}%`} />
                {result.eligible && (
                  <StatBox label="Timp procesare" value={`~${result.estimatedProcessingDays} zile`} />
                )}
              </div>
              {result.blockers.length > 0 && (
                <ul className="mb-4 list-inside list-disc text-sm text-red-600">
                  {result.blockers.map((b) => <li key={b}>{b}</li>)}
                </ul>
              )}
            </ToolResultPanel>
            <Link href="/blog/electric-up-ghid-finantare-statii-incarcare" className="text-sm font-medium text-brand-600 hover:underline">
              Citește ghidul Electric Up →
            </Link>
          </div>
        ) : (
          <Card padding="lg" className="flex h-full min-h-[300px] items-center justify-center text-center text-surface-500">
            Introdu datele firmei pentru estimarea finanțării Electric Up.
          </Card>
        )}
      </div>
    </div>
  );
}
