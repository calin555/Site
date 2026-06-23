"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Cloud,
  ExternalLink,
  Globe,
  Shield,
  TrendingDown,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToolSelect } from "@/components/tools/ToolFormFields";
import { ToolResultPanel, StatBox } from "@/components/tools/ToolResultPanel";
import { formatPrice } from "@/lib/utils";
import type { CompareResult } from "@/types/comparison";
import { formatOcppBadge } from "@/lib/comparison/ocpp.extractor";
import { siteConfig } from "@/config/site";

const defaultQuery: {
  power_kw: number;
  phase: "1-phase" | "3-phase";
  connector: string;
  ocpp: "none" | "1.6J" | "2.0.1";
  reference_price: string;
} = {
  power_kw: 11,
  phase: "3-phase",
  connector: "Type 2",
  ocpp: "1.6J",
  reference_price: "",
};

function tierLabel(tier: CompareResult["tier_detected"]) {
  const map = {
    residential: "Rezidențial",
    commercial: "Comercial",
    enterprise: "Enterprise",
  };
  return map[tier];
}

function positionLabel(position: CompareResult["position"]) {
  const map = {
    "below market": "Sub piață",
    "at market": "La nivel de piață",
    "above market": "Peste piață",
    unknown: "Necunoscut",
  };
  return map[position];
}

function MatchBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-surface-500">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-200">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function TechnicalCompareWidget() {
  const [form, setForm] = useState(defaultQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);

  async function handleCompare() {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      power_kw: String(form.power_kw),
      phase: form.phase,
      connector: form.connector,
      ocpp: form.ocpp,
    });
    if (form.reference_price) {
      params.set("reference_price", form.reference_price);
    }

    try {
      const res = await fetch(`/api/compare?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Eroare la comparare");
        setResult(null);
        return;
      }
      setResult(data);
    } catch {
      setError("Nu s-a putut contacta serverul");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const topMatch =
    result?.matches.find((m) => m.is_own_site) ?? result?.matches[0];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card padding="lg" className="space-y-5">
        <p className="text-sm text-surface-500">
          Comparare tehnică pe piața românească (.ro, RON) — doar specificații
          electrice, conector și protocol OCPP.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Putere (kW)"
            type="number"
            min={3.7}
            step={0.1}
            value={form.power_kw}
            onChange={(e) =>
              setForm((f) => ({ ...f, power_kw: Number(e.target.value) }))
            }
          />
          <ToolSelect
            label="Fazaj"
            value={form.phase}
            onChange={(v) =>
              setForm((f) => ({
                ...f,
                phase: v as "1-phase" | "3-phase",
              }))
            }
            options={[
              { value: "1-phase", label: "Monofazat" },
              { value: "3-phase", label: "Trifazat" },
            ]}
          />
        </div>

        <ToolSelect
          label="Conector"
          value={form.connector}
          onChange={(v) => setForm((f) => ({ ...f, connector: v }))}
          options={[
            { value: "Type 2", label: "Type 2 (AC)" },
            { value: "CCS", label: "CCS (DC)" },
            { value: "CHAdeMO", label: "CHAdeMO (DC)" },
          ]}
        />

        <ToolSelect
          label="Protocol OCPP"
          value={form.ocpp}
          onChange={(v) =>
            setForm((f) => ({
              ...f,
              ocpp: v as "none" | "1.6J" | "2.0.1",
            }))
          }
          options={[
            { value: "none", label: "Fără OCPP" },
            { value: "1.6J", label: "OCPP 1.6J (JSON)" },
            { value: "2.0.1", label: "OCPP 2.0.1" },
          ]}
        />

        <Input
          label="Preț de referință (RON, opțional)"
          type="number"
          min={0}
          placeholder="ex. 1899"
          value={form.reference_price}
          onChange={(e) =>
            setForm((f) => ({ ...f, reference_price: e.target.value }))
          }
        />

        <Button onClick={handleCompare} disabled={loading} className="w-full">
          {loading ? "Se analizează..." : "Compară pe piață"}
        </Button>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </Card>

      <div className="space-y-6">
        {result ? (
          <>
            <ToolResultPanel title={`Poziție pe piață — ${result.market_label}`}>
              <div className="grid gap-4 sm:grid-cols-2">
                <StatBox
                  label="Preț mediu piață"
                  value={formatPrice(result.market_avg)}
                />
                <StatBox
                  label="Interval piață"
                  value={`${formatPrice(result.market_min)} – ${formatPrice(result.market_max)}`}
                />
                <StatBox
                  label="Poziție"
                  value={positionLabel(result.position)}
                />
                <StatBox
                  label="Clasă detectată"
                  value={tierLabel(result.tier_detected)}
                />
              </div>

              {result.best_price && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                        {result.best_price.is_own_site
                          ? `Cel mai bun preț pe ${siteConfig.name}`
                          : "Cel mai bun preț găsit"}
                      </p>
                      <p className="mt-1 text-2xl font-bold text-emerald-900">
                        {formatPrice(result.best_price.price)}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-emerald-800">
                        <Globe className="h-4 w-4 shrink-0" />
                        {result.best_price.source_url ? (
                          <a
                            href={result.best_price.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium underline-offset-2 hover:underline"
                          >
                            {result.best_price.source_site}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="font-medium">
                            {result.best_price.source_site}
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-emerald-700">
                        Similaritate {Math.round(result.best_price.similarity * 100)}%
                        {result.best_price.ocpp_match ? " · OCPP compatibil" : ""}
                        {!result.best_price.source_link_active
                          ? " · preț estimat (fără link extern)"
                          : ""}
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 shrink-0 text-emerald-600" />
                  </div>
                </div>
              )}

              {result.ocpp_cluster_avg && (
                <p className="mt-4 text-sm text-surface-600">
                  Index preț cluster OCPP {form.ocpp} / {form.power_kw} kW:{" "}
                  <strong>{formatPrice(result.ocpp_cluster_avg)}</strong>
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {formatOcppBadge(form.ocpp) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {formatOcppBadge(form.ocpp)}
                  </span>
                )}
                {result.compatible_backend && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                    <Cloud className="h-3.5 w-3.5" />
                    Backend compatibil
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-200 px-3 py-1 text-xs font-medium text-surface-700">
                  <Globe className="h-3.5 w-3.5" />
                  Piață {result.market_label} · RON
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-200 px-3 py-1 text-xs font-medium text-surface-700">
                  {form.power_kw} kW · {form.phase} · {form.connector}
                </span>
              </div>

              <p className="mt-3 text-sm text-surface-500">
                Tip potrivire: <strong>{result.best_match_type}</strong>
              </p>

              {result.alerts.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-amber-700">
                  {result.alerts.map((a) => (
                    <li key={a}>• {a}</li>
                  ))}
                </ul>
              )}
            </ToolResultPanel>

            {topMatch && (
              <Card padding="lg" className="space-y-4">
                <h3 className="font-semibold text-surface-900">
                  {topMatch.is_own_site
                    ? `Oferta ta pe ${siteConfig.name}`
                    : "Cel mai bun match tehnic"}
                </h3>
                <div className="grid gap-3">
                  <MatchBar
                    label="Specificații electrice"
                    value={topMatch.electrical_match}
                  />
                  <MatchBar
                    label="Conector"
                    value={topMatch.connector_match}
                  />
                  <MatchBar label="OCPP" value={topMatch.ocpp_score} />
                  <MatchBar label="Funcții smart" value={topMatch.smart_score} />
                  <MatchBar label="Protecție IP" value={topMatch.ip_score} />
                </div>
                <div className="flex items-center justify-between border-t border-surface-200 pt-4">
                  <div>
                    <p className="text-2xl font-bold text-surface-900">
                      {formatPrice(topMatch.price)}
                    </p>
                    <p className="text-sm text-surface-500">
                      Similaritate {Math.round(topMatch.similarity * 100)}%
                      {topMatch.ocpp_match ? " · OCPP OK" : " · OCPP diferit"}
                      {topMatch.source_site ? ` · ${topMatch.source_site}` : ""}
                    </p>
                    {topMatch.source_url && (
                      <a
                        href={topMatch.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs text-brand-600 hover:underline"
                      >
                        Vezi oferta
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  {topMatch.savings_vs_market != null &&
                    topMatch.savings_vs_market > 0 && (
                      <div className="text-right text-sm text-emerald-700">
                        <TrendingDown className="mb-1 inline h-4 w-4" />
                        <br />
                        {formatPrice(topMatch.savings_vs_market)} sub medie
                      </div>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-surface-600">
                  {topMatch.specs.load_balancing && (
                    <span className="rounded bg-surface-100 px-2 py-1">
                      Load balancing
                    </span>
                  )}
                  {topMatch.specs.remote_management && (
                    <span className="rounded bg-surface-100 px-2 py-1">
                      Remote management
                    </span>
                  )}
                  {topMatch.specs.firmware_ota && (
                    <span className="rounded bg-surface-100 px-2 py-1">
                      Firmware OTA
                    </span>
                  )}
                  {topMatch.specs.ip_rating && (
                    <span className="inline-flex items-center gap-1 rounded bg-surface-100 px-2 py-1">
                      <Shield className="h-3 w-3" />
                      {topMatch.specs.ip_rating}
                    </span>
                  )}
                </div>
              </Card>
            )}

            {result.matches.some((m) => !m.is_own_site) && (
              <Card padding="lg">
                <h3 className="mb-4 font-semibold text-surface-900">
                  Alte referințe piață ({result.matches.length})
                </h3>
                <div className="space-y-3">
                  {result.matches
                    .filter((m) => !m.is_own_site)
                    .slice(0, 5)
                    .map((m) => (
                    <div
                      key={m.ref_id}
                      className="flex items-center justify-between rounded-lg border border-surface-200 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-surface-900">
                          {m.specs.power_kw} kW · {m.specs.type} ·{" "}
                          {m.specs.connector}
                          {m.is_own_site ? (
                            <span className="ml-2 rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-800">
                              {siteConfig.name}
                            </span>
                          ) : null}
                        </p>
                        <p className="text-xs text-surface-500">
                          {formatOcppBadge(m.specs.ocpp) ?? "Fără OCPP"} ·{" "}
                          {Math.round(m.similarity * 100)}% match
                          {m.source_site ? ` · ${m.source_site}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(m.price)}</p>
                        {m.source_url ? (
                          <a
                            href={m.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-brand-600 hover:underline"
                          >
                            Vezi oferta
                          </a>
                        ) : (
                          <span className="text-xs text-surface-400">
                            Estimare
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        ) : (
          <ToolResultPanel title="Rezultate">
            <p className="text-surface-500">
              Configurează specificațiile tehnice și apasă „Compară pe piață”
              pentru analiză OCPP pe magazine .ro din România.
            </p>
          </ToolResultPanel>
        )}
      </div>
    </div>
  );
}
