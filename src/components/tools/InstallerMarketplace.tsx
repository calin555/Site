"use client";

import { useState, useTransition } from "react";
import { Star, MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { ToolSelect } from "@/components/tools/ToolFormFields";
import { ToolResultPanel } from "@/components/tools/ToolResultPanel";
import {
  getInstallers,
  getInstallerCounties,
  getInstallerServices,
} from "@/lib/tools/installers";
import { requestInstallerAction } from "@/lib/actions/tools.actions";
import type { Installer } from "@/types/tools";
import { formatPrice } from "@/lib/utils";

export function InstallerMarketplace() {
  const counties = getInstallerCounties();
  const services = getInstallerServices();
  const [county, setCounty] = useState("");
  const [service, setService] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selected, setSelected] = useState<Installer | null>(null);
  const [form, setForm] = useState({ clientName: "", clientEmail: "", clientPhone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const installers = getInstallers({
    county: county || undefined,
    service: service || undefined,
    minRating: minRating || undefined,
  });

  function handleRequest() {
    if (!selected) return;
    startTransition(async () => {
      const result = await requestInstallerAction({
        installerId: selected.id,
        county: selected.county,
        ...form,
      });
      if (result.success) {
        setSubmitted(true);
        setErrors({});
      } else {
        setErrors(result.errors);
      }
    });
  }

  if (submitted && selected) {
    return (
      <ToolResultPanel title="Cerere trimisă" variant="success">
        <p className="text-surface-600">
          Cererea ta a fost transmisă către <strong>{selected.name}</strong>.
          Vei fi contactat în maximum {selected.responseTimeHours} ore.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => { setSubmitted(false); setSelected(null); }}>
          Înapoi la listă
        </Button>
      </ToolResultPanel>
    );
  }

  return (
    <div className="space-y-6">
      <Card padding="md">
        <div className="grid gap-4 sm:grid-cols-3">
          <ToolSelect
            label="Județ"
            value={county}
            onChange={setCounty}
            options={[{ value: "", label: "Toate județele" }, ...counties.map((c) => ({ value: c, label: c }))]}
          />
          <ToolSelect
            label="Serviciu"
            value={service}
            onChange={setService}
            options={[{ value: "", label: "Toate serviciile" }, ...services.map((s) => ({ value: s, label: s }))]}
          />
          <ToolSelect
            label="Rating minim"
            value={String(minRating)}
            onChange={(v) => setMinRating(Number(v))}
            options={[
              { value: "0", label: "Orice rating" },
              { value: "4.5", label: "4.5+" },
              { value: "4.7", label: "4.7+" },
              { value: "4.8", label: "4.8+" },
            ]}
          />
        </div>
      </Card>

      {selected ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card padding="lg">
            <CardTitle className="mb-4">{selected.name}</CardTitle>
            <p className="mb-4 text-sm text-surface-600">{selected.description}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {selected.certifications.map((c) => (
                <Badge key={c} variant="brand">{c}</Badge>
              ))}
            </div>
            <div className="space-y-2 text-sm text-surface-600">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{selected.city}, {selected.county}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{selected.phone}</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{selected.email}</p>
              <p className="flex items-center gap-2"><Clock className="h-4 w-4" />Răspuns în ~{selected.responseTimeHours}h</p>
            </div>
          </Card>
          <Card padding="lg" className="space-y-4">
            <h3 className="font-bold text-surface-900">Solicită ofertă instalare</h3>
            <Input label="Nume" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} error={errors.clientName} />
            <Input label="Email" type="email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} error={errors.clientEmail} />
            <Input label="Telefon" value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} error={errors.clientPhone} />
            <Textarea label="Detalii proiect" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} error={errors.message} rows={4}
              placeholder="Tip stație, locație, termen dorit..." />
            <div className="flex gap-3">
              <Button onClick={handleRequest} disabled={pending}>{pending ? "Se trimite..." : "Trimite cererea"}</Button>
              <Button variant="outline" onClick={() => setSelected(null)}>Anulează</Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {installers.map((inst) => (
            <Card key={inst.id} padding="md" hover className="flex flex-col">
              <div className="mb-3 flex items-start justify-between">
                <CardTitle className="text-base">{inst.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {inst.rating}
                </div>
              </div>
              <p className="mb-2 flex items-center gap-1 text-xs text-surface-500">
                <MapPin className="h-3.5 w-3.5" />{inst.city}, {inst.county}
              </p>
              <p className="mb-3 flex-1 text-sm text-surface-600 line-clamp-2">{inst.description}</p>
              <div className="mb-3 flex flex-wrap gap-1">
                {inst.services.slice(0, 2).map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                ))}
              </div>
              <div className="mb-4 flex items-center justify-between text-xs text-surface-500">
                <span>{inst.completedProjects} proiecte</span>
                <span>de la {formatPrice(inst.minProjectRon)}</span>
              </div>
              <Button size="sm" onClick={() => setSelected(inst)} className="w-full">
                <CheckCircle2 className="h-4 w-4" /> Solicită ofertă
              </Button>
            </Card>
          ))}
        </div>
      )}

      {installers.length === 0 && !selected && (
        <Card padding="lg" className="text-center text-surface-500">
          Niciun instalator nu corespunde filtrelor selectate.
        </Card>
      )}
    </div>
  );
}
