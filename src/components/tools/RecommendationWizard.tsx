"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { WizardStepper } from "@/components/tools/WizardStepper";
import { ToolRadioGroup } from "@/components/tools/ToolFormFields";
import { ToolResultPanel, StatBox } from "@/components/tools/ToolResultPanel";
import { getChargerRecommendations } from "@/lib/services/recommendation.service";
import type { CatalogProduct } from "@/types/catalog";
import type { RecommendationInput, UseCase, PhaseType, ConnectorType } from "@/types/tools";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const STEPS = ["Utilizare", "Instalație", "Vehicul", "Buget", "Rezultate"];

const defaultInput: RecommendationInput = {
  useCase: "home",
  phases: "SINGLE",
  availableAmps: 32,
  connector: "Type 2",
  dailyKm: 40,
  batteryKwh: 60,
  budgetMax: 5000,
  needsOcpp: false,
  outdoorInstall: false,
};

interface RecommendationWizardProps {
  catalogProducts: CatalogProduct[];
}

export function RecommendationWizard({ catalogProducts }: RecommendationWizardProps) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<RecommendationInput>(defaultInput);

  const result = step === 4 ? getChargerRecommendations(input, catalogProducts) : null;

  function update<K extends keyof RecommendationInput>(key: K, value: RecommendationInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-8">
      <WizardStepper steps={STEPS} currentStep={step} />

      {step === 0 && (
        <Card padding="lg">
          <ToolRadioGroup<UseCase>
            label="Pentru ce vei folosi stația?"
            value={input.useCase}
            onChange={(v) => update("useCase", v)}
            columns={2}
            options={[
              { value: "home", label: "Acasă", description: "Garaj sau curte rezidențială" },
              { value: "business", label: "Business", description: "Parcare firmă, birouri" },
              { value: "fleet", label: "Flotă", description: "Vehicule comerciale, logistică" },
              { value: "public", label: "Public", description: "Stație rapidă DC, acces public" },
            ]}
          />
        </Card>
      )}

      {step === 1 && (
        <Card padding="lg" className="space-y-6">
          <ToolRadioGroup<PhaseType>
            label="Tip racordare electrică"
            value={input.phases}
            onChange={(v) => update("phases", v)}
            options={[
              { value: "SINGLE", label: "Monofazat", description: "Max ~7.4 kW" },
              { value: "THREE", label: "Trifazat", description: "Până la 22 kW AC" },
            ]}
          />
          <Input
            label="Amperaj disponibil (A)"
            type="number"
            min={16}
            max={63}
            value={input.availableAmps}
            onChange={(e) => update("availableAmps", Number(e.target.value))}
            hint="Verifică în tabloul electric — de obicei 16A, 32A sau 63A"
          />
          <ToolRadioGroup
            label="Locație instalare"
            value={input.outdoorInstall ? "outdoor" : "indoor"}
            onChange={(v) => update("outdoorInstall", v === "outdoor")}
            options={[
              { value: "indoor", label: "Interior (garaj)" },
              { value: "outdoor", label: "Exterior (curte/parcare)" },
            ]}
          />
        </Card>
      )}

      {step === 2 && (
        <Card padding="lg" className="space-y-6">
          <ToolRadioGroup<ConnectorType>
            label="Tip conector vehicul"
            value={input.connector}
            onChange={(v) => update("connector", v)}
            columns={2}
            options={[
              { value: "Type 2", label: "Type 2", description: "Standard Europa" },
              { value: "CCS2", label: "CCS2", description: "Încărcare rapidă DC" },
              { value: "Type 1", label: "Type 1", description: "Vehicule mai vechi" },
              { value: "CHAdeMO", label: "CHAdeMO", description: "Nissan, Mitsubishi" },
            ]}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Kilometri zilnici"
              type="number"
              min={5}
              max={500}
              value={input.dailyKm}
              onChange={(e) => update("dailyKm", Number(e.target.value))}
            />
            <Input
              label="Capacitate baterie (kWh)"
              type="number"
              min={20}
              max={150}
              value={input.batteryKwh}
              onChange={(e) => update("batteryKwh", Number(e.target.value))}
            />
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card padding="lg" className="space-y-6">
          <Input
            label="Buget maxim (RON)"
            type="number"
            min={1000}
            step={500}
            value={input.budgetMax}
            onChange={(e) => update("budgetMax", Number(e.target.value))}
          />
          <ToolRadioGroup
            label="Ai nevoie de management OCPP?"
            value={input.needsOcpp ? "yes" : "no"}
            onChange={(v) => update("needsOcpp", v === "yes")}
            options={[
              { value: "no", label: "Nu", description: "Uz personal sau firmă mică" },
              { value: "yes", label: "Da", description: "Flote, billing, monitorizare" },
            ]}
          />
        </Card>
      )}

      {step === 4 && result && (
        <div className="space-y-6">
          <ToolResultPanel title="Recomandarea ta" variant="success">
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <StatBox label="Putere recomandată" value={`${result.recommendedPowerKw} kW`} highlight />
              <StatBox label="Consum zilnic EV" value={`${result.dailyEnergyKwh} kWh`} />
              <StatBox label="Timp încărcare" value={`~${result.estimatedChargeHours}h`} />
            </div>
            {result.tips.length > 0 && (
              <ul className="mb-6 space-y-2 text-sm text-surface-600">
                {result.tips.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {tip}
                  </li>
                ))}
              </ul>
            )}
          </ToolResultPanel>

          {result.products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {result.products.map((product) => (
                <Card key={product.id} padding="md" hover>
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="brand" className="mb-1">{product.powerKw} kW</Badge>
                      <h3 className="font-bold text-surface-900">{product.name}</h3>
                      <p className="text-sm font-semibold text-brand-600">{formatPrice(product.price)}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {product.matchReasons.slice(0, 2).map((r) => (
                          <span key={r} className="text-xs text-surface-500">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link href={`/produse/${product.slug}`} className="mt-3 block">
                    <Button variant="outline" size="sm" className="w-full">Vezi produsul</Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card padding="lg" className="text-center text-surface-500">
              Nu am găsit produse exacte — contactează-ne pentru recomandare personalizată.
            </Card>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4" /> Înapoi
        </Button>
        {step < 4 ? (
          <Button onClick={() => setStep((s) => s + 1)}>
            Continuă <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" onClick={() => { setStep(0); setInput(defaultInput); }}>
            Reîncepe
          </Button>
        )}
      </div>
    </div>
  );
}
