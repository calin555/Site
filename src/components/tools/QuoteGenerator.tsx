"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Trash2, Download, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ToolSelect } from "@/components/tools/ToolFormFields";
import { ToolResultPanel } from "@/components/tools/ToolResultPanel";
import { ROMANIAN_COUNTIES } from "@/config/tools";
import type { CatalogProduct } from "@/types/catalog";
import { createQuoteAction } from "@/lib/actions/tools.actions";
import { calculateQuoteTotals } from "@/lib/services/quote.service";
import type { QuoteLineItem } from "@/types/tools";
import { formatPrice } from "@/lib/utils";

interface QuoteGeneratorProps {
  stationProducts: CatalogProduct[];
}

export function QuoteGenerator({ stationProducts }: QuoteGeneratorProps) {
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState<QuoteLineItem[]>([
    { name: stationProducts[0]?.name ?? "Stație EV", quantity: 1, unitPriceRon: stationProducts[0]?.price ?? 3000, productSlug: stationProducts[0]?.slug },
  ]);
  const [installationRon, setInstallationRon] = useState(2500);
  const [grantDiscountRon, setGrantDiscountRon] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [county, setCounty] = useState("București");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const previewTotals = calculateQuoteTotals({
    id: "", reference: "", createdAt: "", clientName, clientEmail, clientPhone,
    county, city, notes, items, installationRon, grantDiscountRon, validUntil: "",
  });

  function addItem() {
    const product = stationProducts[items.length % stationProducts.length];
    setItems((prev) => [
      ...prev,
      { name: product.name, quantity: 1, unitPriceRon: product.price, productSlug: product.slug },
    ]);
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, patch: Partial<QuoteLineItem>) {
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await createQuoteAction({
        clientName, clientEmail, clientPhone, companyName: companyName || undefined,
        county, city, notes, items, installationRon, grantDiscountRon,
      });
      if (result.success) {
        setQuoteId(result.quoteId);
        setReference(result.reference);
        setErrors({});
      } else {
        setErrors(result.errors);
      }
    });
  }

  if (quoteId && reference) {
    return (
      <ToolResultPanel title="Cerere ofertă generată" variant="success">
        <div className="mb-6 flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-brand-600" />
          <div>
            <p className="text-lg font-bold text-surface-900">Referință: {reference}</p>
            <p className="text-sm text-surface-600">Echipa ChargePro te va contacta în 24h.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={`/api/tools/offer/${quoteId}`} download>
            <Button><Download className="h-4 w-4" /> Descarcă oferta</Button>
          </a>
          <Link href="/tools/oferta-pdf">
            <Button variant="outline">Generator PDF</Button>
          </Link>
        </div>
      </ToolResultPanel>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <Card padding="lg" className="space-y-4">
          <h3 className="font-bold text-surface-900">Produse și servicii</h3>
          {items.map((item, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-surface-200 p-4 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <ToolSelect
                  label={i === 0 ? "Produs" : undefined}
                  value={item.productSlug ?? ""}
                  onChange={(slug) => {
                    const p = stationProducts.find((pr) => pr.slug === slug);
                    if (p) updateItem(i, { name: p.name, unitPriceRon: p.price, productSlug: slug });
                  }}
                  options={stationProducts.map((p) => ({ value: p.slug, label: p.name }))}
                />
              </div>
              <div className="sm:col-span-2">
                <Input label={i === 0 ? "Cant." : undefined} type="number" min={1} value={item.quantity}
                  onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })} />
              </div>
              <div className="sm:col-span-3">
                <Input label={i === 0 ? "Preț" : undefined} type="number" min={0} value={item.unitPriceRon}
                  onChange={(e) => updateItem(i, { unitPriceRon: Number(e.target.value) })} />
              </div>
              <div className="flex items-end sm:col-span-2">
                {items.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4" /> Adaugă produs
          </Button>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Instalare (RON)" type="number" min={0} value={installationRon}
              onChange={(e) => setInstallationRon(Number(e.target.value))} />
            <Input label="Grant / finanțare (RON)" type="number" min={0} value={grantDiscountRon}
              onChange={(e) => setGrantDiscountRon(Number(e.target.value))} />
          </div>
        </Card>

        <Card padding="lg" className="space-y-4">
          <h3 className="font-bold text-surface-900">Date contact</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nume" value={clientName} onChange={(e) => setClientName(e.target.value)} error={errors.clientName} required />
            <Input label="Email" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} error={errors.clientEmail} required />
            <Input label="Telefon" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} error={errors.clientPhone} required />
            <Input label="Companie (opțional)" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <ToolSelect label="Județ" value={county} onChange={setCounty}
              options={ROMANIAN_COUNTIES.map((c) => ({ value: c, label: c }))} />
            <Input label="Oraș" value={city} onChange={(e) => setCity(e.target.value)} error={errors.city} required />
          </div>
          <Textarea label="Note suplimentare" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            placeholder="Detalii instalare, termene, finanțare..." />
          <Button onClick={handleSubmit} size="lg" disabled={pending} className="w-full">
            {pending ? "Se generează..." : "Generează cerere ofertă"}
          </Button>
        </Card>
      </div>

      <Card padding="lg" className="h-fit lg:col-span-2">
        <h3 className="mb-4 font-bold text-surface-900">Previzualizare</h3>
        <div className="space-y-2 text-sm">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-surface-600">{item.quantity}× {item.name}</span>
              <span className="font-medium">{formatPrice(item.unitPriceRon * item.quantity)}</span>
            </div>
          ))}
          {installationRon > 0 && (
            <div className="flex justify-between">
              <span className="text-surface-600">Instalare</span>
              <span>{formatPrice(installationRon)}</span>
            </div>
          )}
          {grantDiscountRon > 0 && (
            <div className="flex justify-between text-brand-600">
              <span>Finanțare</span>
              <span>-{formatPrice(grantDiscountRon)}</span>
            </div>
          )}
          <div className="border-t border-surface-200 pt-2">
            <div className="flex justify-between font-bold text-lg text-brand-700">
              <span>Total cu TVA</span>
              <span>{formatPrice(previewTotals.total)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
