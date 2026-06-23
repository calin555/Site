"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToolRadioGroup, ToolSelect } from "@/components/tools/ToolFormFields";
import { ToolResultPanel, StatBox } from "@/components/tools/ToolResultPanel";
import { calculateAfmEligibility } from "@/lib/tools/grants";
import { ROMANIAN_COUNTIES } from "@/config/tools";
import type { AfmCalculatorInput } from "@/types/tools";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const defaultInput: AfmCalculatorInput = {
  entityType: "company",
  stationCount: 4,
  totalPowerKw: 88,
  hasOcpp: true,
  isPublicAccess: true,
  county: "București",
  projectValueRon: 200_000,
};

export function AfmCalculator() {
  const [input, setInput] = useState<AfmCalculatorInput>(defaultInput);
  const [result, setResult] = useState<ReturnType<typeof calculateAfmEligibility> | null>(null);

  function update<K extends keyof AfmCalculatorInput>(key: K, value: AfmCalculatorInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  function handleCalculate() {
    setResult(calculateAfmEligibility(input));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card padding="lg" className="space-y-5">
        <ToolRadioGroup
          label="Tip entitate"
          value={input.entityType}
          onChange={(v) => update("entityType", v)}
          columns={2}
          options={[
            { value: "company", label: "Companie" },
            { value: "municipality", label: "Administrație publică" },
            { value: "ngo", label: "ONG" },
            { value: "individual", label: "Persoană fizică" },
          ]}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Număr stații"
            type="number"
            min={1}
            value={input.stationCount}
            onChange={(e) => update("stationCount", Number(e.target.value))}
          />
          <Input
            label="Putere totală (kW)"
            type="number"
            min={7}
            value={input.totalPowerKw}
            onChange={(e) => update("totalPowerKw", Number(e.target.value))}
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
        <ToolSelect
          label="Județ"
          value={input.county}
          onChange={(v) => update("county", v)}
          options={ROMANIAN_COUNTIES.map((c) => ({ value: c, label: c }))}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <ToolRadioGroup
            label="OCPP"
            value={input.hasOcpp ? "yes" : "no"}
            onChange={(v) => update("hasOcpp", v === "yes")}
            options={[
              { value: "yes", label: "Da" },
              { value: "no", label: "Nu" },
            ]}
          />
          <ToolRadioGroup
            label="Acces public"
            value={input.isPublicAccess ? "yes" : "no"}
            onChange={(v) => update("isPublicAccess", v === "yes")}
            options={[
              { value: "yes", label: "Da" },
              { value: "no", label: "Nu" },
            ]}
          />
        </div>
        <Button onClick={handleCalculate} size="lg" className="w-full">
          Calculează eligibilitatea
        </Button>
      </Card>

      <div>
        {result ? (
          <div className="space-y-4">
            <ToolResultPanel
              title={result.eligible ? "Proiect eligibil AFM" : "Proiect neeligibil"}
              variant={result.eligible ? "success" : "error"}
            >
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <StatBox label="Scor eligibilitate" value={`${result.eligibilityScore}%`} />
                <StatBox
                  label="Grant estimat"
                  value={formatPrice(result.maxGrantRon)}
                  highlight={result.eligible}
                />
                <StatBox label="Cofinanțare" value={formatPrice(result.coFinancingRon)} />
                <StatBox label="Procent finanțare" value={`${result.grantPercent}%`} />
              </div>
              {result.blockers.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-sm font-semibold text-red-700">Blocaje:</p>
                  <ul className="list-inside list-disc text-sm text-red-600">
                    {result.blockers.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              )}
              {result.nextSteps.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-surface-800">Pași următori:</p>
                  <ol className="list-inside list-decimal text-sm text-surface-600">
                    {result.nextSteps.map((s) => <li key={s}>{s}</li>)}
                  </ol>
                </div>
              )}
            </ToolResultPanel>
            <Link href="/blog/programul-afm-pentru-statii-incarcare-ev" className="text-sm font-medium text-brand-600 hover:underline">
              Citește ghidul complet AFM →
            </Link>
          </div>
        ) : (
          <Card padding="lg" className="flex h-full min-h-[300px] items-center justify-center text-center text-surface-500">
            Completează datele proiectului și apasă „Calculează eligibilitatea”.
          </Card>
        )}
      </div>
    </div>
  );
}
