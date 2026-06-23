"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CartItemRow } from "./CartItemRow";
import { CouponInput } from "./CouponInput";
import { OrderSummary } from "./OrderSummary";
import type { CartSummary } from "@/types/cart";
import type { OrderTotals } from "@/types/checkout";

interface CartViewProps {
  summary: CartSummary;
  totals: OrderTotals;
}

export function CartView({ summary, totals }: CartViewProps) {
  if (summary.items.length === 0) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-surface-300" />
        <h2 className="mt-4 text-xl font-bold text-surface-900">
          Coșul tău este gol
        </h2>
        <p className="mt-2 text-surface-500">
          Explorează catalogul și adaugă produse.
        </p>
        <Link href="/produse" className="mt-6 inline-block">
          <Button>Vezi produsele</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {summary.items.map((item) => (
          <CartItemRow key={item.productId} item={item} />
        ))}
      </div>

      <div>
        <Card padding="lg" className="sticky top-28 space-y-6">
          <h2 className="text-lg font-bold text-surface-900">Sumar comandă</h2>

          <CouponInput
            appliedCode={summary.couponError ? undefined : summary.couponCode}
            error={summary.couponError}
          />

          <OrderSummary totals={totals} />

          <Link href="/checkout" className="block">
            <Button fullWidth size="lg">
              Continuă spre checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link
            href="/produse"
            className="block text-center text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Continuă cumpărăturile
          </Link>
        </Card>
      </div>
    </div>
  );
}
