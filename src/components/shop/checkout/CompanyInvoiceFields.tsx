"use client";

import { Input } from "@/components/ui/Input";
import { ROMANIAN_COUNTIES } from "@/config/commerce";
import type { CompanyInvoice } from "@/types/checkout";

interface CompanyInvoiceFieldsProps {
  value: CompanyInvoice;
  onChange: (value: CompanyInvoice) => void;
  errors?: Record<string, string>;
}

export function CompanyInvoiceFields({
  value,
  onChange,
  errors = {},
}: CompanyInvoiceFieldsProps) {
  function update(field: keyof CompanyInvoice, fieldValue: string | boolean) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <div className="space-y-5">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={value.enabled}
          onChange={(e) => update("enabled", e.target.checked)}
          className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm font-medium text-surface-900">
          Doresc factură pe firmă
        </span>
      </label>

      {value.enabled && (
        <div className="space-y-5 rounded-xl border border-surface-200 bg-surface-50 p-5">
          <p className="text-sm text-surface-500">
            Completează datele firmei pentru emiterea facturii fiscale.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Denumire firmă *"
              value={value.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              error={errors["companyInvoice.companyName"]}
              className="sm:col-span-2"
            />
            <Input
              label="CUI *"
              placeholder="RO12345678"
              value={value.cui}
              onChange={(e) => update("cui", e.target.value.toUpperCase())}
              error={errors["companyInvoice.cui"]}
            />
            <Input
              label="Nr. Reg. Comerțului"
              placeholder="J40/1234/2020"
              value={value.registrationNumber ?? ""}
              onChange={(e) => update("registrationNumber", e.target.value)}
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-surface-700">
              Adresă facturare (opțional — dacă diferă de livrare)
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Stradă"
                value={value.billingStreet ?? ""}
                onChange={(e) => update("billingStreet", e.target.value)}
                className="sm:col-span-2"
              />
              <Input
                label="Oraș"
                value={value.billingCity ?? ""}
                onChange={(e) => update("billingCity", e.target.value)}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-800">
                  Județ
                </label>
                <select
                  value={value.billingCounty ?? ""}
                  onChange={(e) => update("billingCounty", e.target.value)}
                  className="h-11 w-full rounded-xl border border-surface-200 bg-white px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="">Selectează județul</option>
                  {ROMANIAN_COUNTIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Cod poștal"
                value={value.billingPostalCode ?? ""}
                onChange={(e) => update("billingPostalCode", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
