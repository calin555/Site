import { formatPrice } from "@/lib/utils";
import type { OrderTotals } from "@/types/checkout";

interface OrderSummaryProps {
  totals: OrderTotals;
  showVatBreakdown?: boolean;
  className?: string;
}

export function OrderSummary({
  totals,
  showVatBreakdown = true,
  className,
}: OrderSummaryProps) {
  return (
    <dl className={`space-y-3 text-sm ${className ?? ""}`}>
      <div className="flex justify-between">
        <dt className="text-surface-500">Subtotal produse</dt>
        <dd className="font-medium text-surface-900">
          {formatPrice(totals.subtotal)}
        </dd>
      </div>

      {totals.discount > 0 && (
        <div className="flex justify-between text-brand-600">
          <dt>
            Reducere
            {totals.couponLabel && (
              <span className="ml-1 text-xs">({totals.couponCode})</span>
            )}
          </dt>
          <dd className="font-medium">-{formatPrice(totals.discount)}</dd>
        </div>
      )}

      <div className="flex justify-between">
        <dt className="text-surface-500">Transport</dt>
        <dd className="font-medium">
          {totals.shipping === 0 ? (
            <span className="text-brand-600">Gratuit</span>
          ) : (
            formatPrice(totals.shipping)
          )}
        </dd>
      </div>

      {showVatBreakdown && (
        <div className="flex justify-between text-surface-500">
          <dt>TVA inclus ({Math.round(totals.vatRate * 100)}%)</dt>
          <dd>{formatPrice(totals.vatAmount)}</dd>
        </div>
      )}

      <div className="border-t border-surface-200 pt-3">
        <div className="flex justify-between text-base">
          <dt className="font-bold text-surface-900">Total de plată</dt>
          <dd className="font-bold text-surface-900">
            {formatPrice(totals.total)}
          </dd>
        </div>
        <p className="mt-1 text-xs text-surface-400">
          Prețurile includ TVA {Math.round(totals.vatRate * 100)}%
        </p>
      </div>
    </dl>
  );
}
