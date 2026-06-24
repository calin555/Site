import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { CheckoutForm } from "@/components/shop/checkout/CheckoutForm";
import { OrderSummary } from "@/components/shop/cart/OrderSummary";
import { formatPrice } from "@/lib/utils";
import {
  getCartSummary,
  calculateOrderTotals,
} from "@/lib/services/cart.service";
import { getCheckoutPrefill } from "@/lib/checkout/get-checkout-prefill";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Checkout",
  description: "Finalizează comanda de stații încărcare EV.",
  path: "/checkout",
  noIndex: true,
});

interface CheckoutPageProps {
  searchParams: Promise<{ auth_error?: string; auth?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const summary = await getCartSummary();

  if (summary.items.length === 0) {
    redirect("/cos");
  }

  const params = await searchParams;
  const prefill = await getCheckoutPrefill();
  const totals = calculateOrderTotals(
    summary.items,
    summary.couponError ? undefined : summary.couponCode
  );

  return (
    <>
      <PageHeader
        title="Checkout"
        description="Conectează-te cu Google pentru date precompletate sau completează manual livrarea."
      />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Coș", href: "/cos" },
            { label: "Checkout" },
          ]}
          className="mb-8"
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CheckoutForm
              initialForm={prefill.initialForm}
              user={prefill.user}
              addresses={prefill.addresses}
              googleEnabled={prefill.googleEnabled}
              authError={params.auth_error ?? null}
              authSuccess={params.auth === "success"}
            />
          </div>

          <div>
            <Card padding="lg" className="sticky top-28 space-y-4">
              <h2 className="text-lg font-bold text-surface-900">
                Comanda ta
              </h2>
              <ul className="space-y-3 text-sm">
                {summary.items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex justify-between gap-2"
                  >
                    <span className="text-surface-600 line-clamp-2">
                      {item.name}{" "}
                      <span className="text-surface-400">×{item.quantity}</span>
                    </span>
                    <span className="shrink-0 font-medium">
                      {formatPrice(item.lineTotal)}
                    </span>
                  </li>
                ))}
              </ul>
              <OrderSummary totals={totals} />
              <p className="text-center text-xs text-surface-400">
                Plată securizată prin Stripe
              </p>
              <Link
                href="/cos"
                className="block text-center text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Înapoi la coș
              </Link>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
