"use client";

import { useState, useTransition } from "react";
import { CreditCard, Truck, Loader2, Lock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CompanyInvoiceFields } from "./CompanyInvoiceFields";
import { StripePayment } from "./StripePayment";
import { initiateCheckoutAction } from "@/lib/actions/checkout.actions";
import { ROMANIAN_COUNTIES } from "@/config/commerce";
import type { CheckoutFormData, CompanyInvoice } from "@/types/checkout";

const defaultCompanyInvoice: CompanyInvoice = {
  enabled: false,
  companyName: "",
  cui: "",
};

const defaultForm: CheckoutFormData = {
  email: "",
  phone: "",
  shipping: {
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    county: "",
    postalCode: "",
    country: "RO",
  },
  companyInvoice: defaultCompanyInvoice,
  notes: "",
};

function goToPaymentConfirm(orderNumber: string, mock = false) {
  const params = new URLSearchParams({ order: orderNumber });
  if (mock) params.set("mock", "1");
  window.location.assign(`/api/checkout/confirm?${params.toString()}`);
}

export function CheckoutForm() {
  const [form, setForm] = useState<CheckoutFormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentStep, setPaymentStep] = useState<{
    orderNumber: string;
    clientSecret: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof CheckoutFormData>(
    key: K,
    value: CheckoutFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateShipping(
    field: keyof CheckoutFormData["shipping"],
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, [field]: value },
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    startTransition(async () => {
      const result = await initiateCheckoutAction(form);

      if (!result.success) {
        setErrors(result.errors);
        return;
      }

      if (result.mockPayment) {
        goToPaymentConfirm(result.orderNumber, true);
        return;
      }

      if (result.clientSecret) {
        setPaymentStep({
          orderNumber: result.orderNumber,
          clientSecret: result.clientSecret,
        });
        return;
      }

      setErrors({
        _form: "Nu am putut inițializa plata. Verifică configurarea Stripe.",
      });
    });
  }

  function handlePaymentSuccess() {
    if (!paymentStep) return;
    goToPaymentConfirm(paymentStep.orderNumber);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors._form && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors._form}
        </div>
      )}

      <Card padding="lg">
        <h2 className="mb-5 text-lg font-bold text-surface-900">
          Date de contact
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Email *"
            type="email"
            placeholder="ion@exemplu.ro"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
            required
          />
          <Input
            label="Telefon *"
            type="tel"
            placeholder="07xxxxxxxx"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            error={errors.phone}
            required
          />
        </div>
      </Card>

      <Card padding="lg">
        <div className="mb-5 flex items-center gap-2">
          <Truck className="h-5 w-5 text-brand-600" />
          <h2 className="text-lg font-bold text-surface-900">
            Adresă de livrare
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Prenume *"
            value={form.shipping.firstName}
            onChange={(e) => updateShipping("firstName", e.target.value)}
            error={errors["shipping.firstName"]}
            required
          />
          <Input
            label="Nume *"
            value={form.shipping.lastName}
            onChange={(e) => updateShipping("lastName", e.target.value)}
            error={errors["shipping.lastName"]}
            required
          />
          <Input
            label="Stradă *"
            className="sm:col-span-2"
            value={form.shipping.street}
            onChange={(e) => updateShipping("street", e.target.value)}
            error={errors["shipping.street"]}
            required
          />
          <Input
            label="Oraș *"
            value={form.shipping.city}
            onChange={(e) => updateShipping("city", e.target.value)}
            error={errors["shipping.city"]}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-800">
              Județ *
            </label>
            <select
              value={form.shipping.county}
              onChange={(e) => updateShipping("county", e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-surface-200 bg-white px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Selectează județul</option>
              {ROMANIAN_COUNTIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors["shipping.county"] && (
              <p className="text-xs text-red-600">{errors["shipping.county"]}</p>
            )}
          </div>
          <Input
            label="Cod poștal *"
            placeholder="010101"
            value={form.shipping.postalCode}
            onChange={(e) => updateShipping("postalCode", e.target.value)}
            error={errors["shipping.postalCode"]}
            required
          />
          <Input label="Țară" value="România" disabled />
        </div>
      </Card>

      <Card padding="lg">
        <h2 className="mb-5 text-lg font-bold text-surface-900">
          Facturare firmă
        </h2>
        <CompanyInvoiceFields
          value={form.companyInvoice}
          onChange={(v) => updateField("companyInvoice", v)}
          errors={errors}
        />
      </Card>

      <Card padding="lg">
        <Input
          label="Observații comandă (opțional)"
          placeholder="Instrucțiuni speciale de livrare..."
          value={form.notes ?? ""}
          onChange={(e) => updateField("notes", e.target.value)}
          error={errors.notes}
        />
      </Card>

      <Card padding="lg">
        <div className="mb-5 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-brand-600" />
          <h2 className="text-lg font-bold text-surface-900">Plată</h2>
        </div>

        {paymentStep ? (
          <StripePayment
            clientSecret={paymentStep.clientSecret}
            orderNumber={paymentStep.orderNumber}
            onSuccess={handlePaymentSuccess}
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-surface-500">
              După validarea datelor, vei putea introduce detaliile cardului
              securizat prin Stripe.
            </p>
            <Button type="submit" fullWidth size="lg" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {isPending ? "Se procesează..." : "Continuă spre plată"}
            </Button>
          </>
        )}
      </Card>
    </form>
  );
}
