"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROMANIAN_COUNTIES } from "@/config/commerce";
import { saveAddressAction } from "@/lib/actions/account.actions";
import type { SavedAddress } from "@/types/address";

interface AddressFormProps {
  address?: SavedAddress;
  onCancel: () => void;
  onSaved: () => void;
}

export function AddressForm({ address, onCancel, onSaved }: AddressFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setErrors({});
    startTransition(async () => {
      const result = await saveAddressAction(
        {
          type: formData.get("type"),
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          company: formData.get("company") || undefined,
          street: formData.get("street"),
          city: formData.get("city"),
          county: formData.get("county"),
          postalCode: formData.get("postalCode"),
          country: "RO",
          phone: formData.get("phone"),
          isDefault: formData.get("isDefault") === "on",
        },
        address?.id
      );

      if (!result.success) {
        setErrors(result.errors);
        return;
      }
      onSaved();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors._form && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors._form}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-surface-800">Tip adresă</label>
        <select
          name="type"
          defaultValue={address?.type ?? "BOTH"}
          className="h-11 w-full rounded-xl border border-surface-200 bg-white px-4 text-sm"
        >
          <option value="SHIPPING">Livrare</option>
          <option value="BILLING">Facturare</option>
          <option value="BOTH">Livrare & facturare</option>
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Prenume"
          name="firstName"
          defaultValue={address?.firstName}
          error={errors.firstName}
          required
        />
        <Input
          label="Nume"
          name="lastName"
          defaultValue={address?.lastName}
          error={errors.lastName}
          required
        />
        <Input
          label="Companie (opțional)"
          name="company"
          defaultValue={address?.company ?? ""}
          className="sm:col-span-2"
        />
        <Input
          label="Stradă"
          name="street"
          defaultValue={address?.street}
          error={errors.street}
          className="sm:col-span-2"
          required
        />
        <Input
          label="Oraș"
          name="city"
          defaultValue={address?.city}
          error={errors.city}
          required
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-surface-800">Județ</label>
          <select
            name="county"
            defaultValue={address?.county ?? ""}
            required
            className="h-11 w-full rounded-xl border border-surface-200 bg-white px-4 text-sm"
          >
            <option value="">Selectează</option>
            {ROMANIAN_COUNTIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.county && <p className="text-xs text-red-600">{errors.county}</p>}
        </div>
        <Input
          label="Cod poștal"
          name="postalCode"
          defaultValue={address?.postalCode}
          error={errors.postalCode}
          required
        />
        <Input
          label="Telefon"
          name="phone"
          type="tel"
          defaultValue={address?.phone}
          error={errors.phone}
          required
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={address?.isDefault}
          className="h-4 w-4 rounded border-surface-300 text-brand-600"
        />
        Setează ca adresă principală
      </label>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Salvează
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Anulează
        </Button>
      </div>
    </form>
  );
}
