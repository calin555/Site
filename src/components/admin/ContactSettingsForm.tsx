"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { saveSiteContactAction } from "@/lib/actions/admin/site-contact.actions";
import type { SiteContactSettings } from "@/types/site-contact";

interface ContactSettingsFormProps {
  settings: SiteContactSettings;
}

export function ContactSettingsForm({ settings }: ContactSettingsFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(settings);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof SiteContactSettings>(
    key: K,
    value: SiteContactSettings[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    startTransition(async () => {
      const result = await saveSiteContactAction(form);

      if (result.success) {
        router.refresh();
      } else {
        setErrors(result.errors);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {errors.form && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.form}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-500">
          Footer — secțiunea Contact
        </h2>
        <Input
          label="Titlu secțiune"
          value={form.sectionTitle}
          onChange={(e) => updateField("sectionTitle", e.target.value)}
          error={errors.sectionTitle}
          placeholder="Contact"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Etichetă telefon comenzi"
            value={form.phoneOrdersLabel}
            onChange={(e) => updateField("phoneOrdersLabel", e.target.value)}
            error={errors.phoneOrdersLabel}
            placeholder="Comenzi"
          />
          <Input
            label="Telefon comenzi"
            value={form.phoneOrders}
            onChange={(e) => updateField("phoneOrders", e.target.value)}
            error={errors.phoneOrders}
            placeholder="0773 985 486"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Etichetă telefon tehnic"
            value={form.phoneTechnicalLabel}
            onChange={(e) => updateField("phoneTechnicalLabel", e.target.value)}
            error={errors.phoneTechnicalLabel}
            placeholder="Tehnic"
          />
          <Input
            label="Telefon tehnic"
            value={form.phoneTechnical}
            onChange={(e) => updateField("phoneTechnical", e.target.value)}
            error={errors.phoneTechnical}
            placeholder="0759 046 201"
          />
        </div>
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
          placeholder="contact@chargepro.ro"
        />
        <Input
          label="Adresă / locație"
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
          error={errors.address}
          placeholder="București, România"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-500">
          Header — bara de sus
        </h2>
        <Input
          label="Program"
          value={form.hours}
          onChange={(e) => updateField("hours", e.target.value)}
          error={errors.hours}
          placeholder="Luni – Vineri: 08:30 – 17:00"
        />
        <Input
          label="Text promoțional"
          value={form.headerTagline}
          onChange={(e) => updateField("headerTagline", e.target.value)}
          error={errors.headerTagline}
          placeholder="Consultanță tehnică gratuită · Livrare în toată țara"
        />
      </section>

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Salvează setările
      </Button>
    </form>
  );
}
