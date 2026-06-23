"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateOrderStatusAction } from "@/lib/actions/admin/admin.actions";
import type { OrderStatus } from "@/types/order";

const STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

interface OrderStatusSelectProps {
  orderNumber: string;
  current: OrderStatus;
}

export function OrderStatusSelect({
  orderNumber,
  current,
}: OrderStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as OrderStatus;
    startTransition(async () => {
      await updateOrderStatusAction(orderNumber, status);
    });
  }

  return (
    <div className="relative">
      <select
        value={current}
        onChange={handleChange}
        disabled={isPending}
        className="h-9 rounded-lg border border-surface-200 bg-white px-3 text-xs font-medium disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {isPending && (
        <Loader2 className="absolute -right-6 top-2 h-4 w-4 animate-spin text-brand-600" />
      )}
    </div>
  );
}
