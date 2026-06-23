import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, Package, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OrderSummary } from "@/components/shop/cart/OrderSummary";
import { getOrderByNumber } from "@/lib/services/order.service";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Comandă confirmată",
  description: "Comanda ta a fost plasată cu succes.",
};

interface SuccessPageProps {
  searchParams: Promise<{
    order?: string;
    demo?: string;
    payment_intent?: string;
    redirect_status?: string;
    error?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order;

  if (!orderNumber) {
    redirect("/cos");
  }

  const order = await getOrderByNumber(orderNumber);
  const isPaid =
    order?.status === "PAID" || order?.status === "PROCESSING";

  if (!isPaid) {
    if (params.redirect_status === "failed") {
      redirect(`/checkout/cancel?order=${orderNumber}`);
    }

    if (params.payment_intent) {
      const qs = new URLSearchParams();
      qs.set("order", orderNumber);
      qs.set("payment_intent", params.payment_intent);
      if (params.redirect_status) {
        qs.set("redirect_status", params.redirect_status);
      }
      redirect(`/api/checkout/confirm?${qs.toString()}`);
    }
  }

  const confirmed = isPaid && params.error !== "1";

  if (!confirmed) {
    return (
      <>
        <PageHeader title="Confirmare plată" />
        <Container className="py-12">
          <Card padding="lg" className="mx-auto max-w-lg text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-amber-500" />
            <h2 className="mt-4 text-2xl font-bold text-surface-900">
              Plata nu este confirmată
            </h2>
            <p className="mt-2 text-surface-500">
              Nu am putut confirma plata. Dacă suma a fost debitată,
              contactează-ne.
            </p>
            <div className="mt-6 rounded-xl bg-surface-50 px-4 py-3">
              <p className="text-sm text-surface-500">Număr comandă</p>
              <p className="text-lg font-bold text-surface-900">{orderNumber}</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/checkout">
                <Button>Încearcă din nou</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Contactează-ne</Button>
              </Link>
            </div>
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Comandă confirmată!" />
      <Container className="py-12">
        <Card padding="lg" className="mx-auto max-w-lg">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-brand-600" />
            <h2 className="mt-4 text-2xl font-bold text-surface-900">
              Mulțumim pentru comandă!
            </h2>
            <p className="mt-2 text-surface-500">
              Plata a fost confirmată și comanda ta este înregistrată.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-surface-50 px-4 py-3 text-center">
              <p className="text-sm text-surface-500">Număr comandă</p>
              <p className="text-lg font-bold text-surface-900">{orderNumber}</p>
              {order && (
                <p className="mt-1 text-sm font-medium text-brand-600">
                  Status: {ORDER_STATUS_LABELS[order.status]}
                </p>
              )}
            </div>

            {order && (
              <>
                <div className="border-t border-surface-200 pt-4">
                  <h3 className="mb-3 text-sm font-bold text-surface-900">
                    Produse comandate
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {order.items.map((item) => (
                      <li
                        key={`${item.sku}-${item.quantity}`}
                        className="flex justify-between gap-2"
                      >
                        <span className="text-surface-600">
                          {item.name}{" "}
                          <span className="text-surface-400">
                            ×{item.quantity}
                          </span>
                        </span>
                        <span className="shrink-0 font-medium">
                          {formatPrice(item.total)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <OrderSummary totals={order.totals} />
                <p className="text-center text-sm text-surface-500">
                  Confirmare trimisă la{" "}
                  <span className="font-medium">{order.email}</span>
                </p>
              </>
            )}

            {params.demo === "1" && (
              <p className="text-center text-xs text-amber-600">
                Mod demonstrativ — Stripe nu este configurat.
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/produse">
              <Button variant="outline">
                <Package className="h-4 w-4" />
                Continuă cumpărăturile
              </Button>
            </Link>
            <Link href="/">
              <Button>Înapoi acasă</Button>
            </Link>
          </div>
        </Card>
      </Container>
    </>
  );
}
