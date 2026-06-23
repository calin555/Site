"use client";

import { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface StripePaymentFormProps {
  clientSecret: string;
  orderNumber: string;
  onSuccess: () => void;
}

function PaymentForm({ clientSecret, orderNumber, onSuccess }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/api/checkout/confirm?order=${orderNumber}`,
      },
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message ?? "Plata a eșuat.");
      setProcessing(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
          paymentMethodOrder: ["card"],
        }}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" fullWidth size="lg" disabled={!stripe || processing}>
        {processing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
        {processing ? "Se procesează..." : "Plătește acum"}
      </Button>
    </form>
  );
}

export function StripePayment({
  clientSecret,
  orderNumber,
  onSuccess,
}: StripePaymentFormProps) {
  if (!stripePromise) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Stripe nu este configurat. Adaugă cheile API în `.env` pentru plăți live.
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#059669",
            borderRadius: "12px",
          },
        },
        locale: "ro",
      }}
    >
      <PaymentForm
        clientSecret={clientSecret}
        orderNumber={orderNumber}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}
