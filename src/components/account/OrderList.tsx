import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type OrderRecord } from "@/types/order";

function statusVariant(status: OrderRecord["status"]) {
  if (status === "PAID" || status === "DELIVERED" || status === "COMPLETED") {
    return "brand" as const;
  }
  if (status === "CANCELLED" || status === "REFUNDED") {
    return "outline" as const;
  }
  return "default" as const;
}

interface OrderListProps {
  orders: OrderRecord[];
  showAll?: boolean;
}

export function OrderList({ orders, showAll = true }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <p className="text-surface-500">Nu ai comenzi încă.</p>
        <Link
          href="/produse"
          className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Explorează produsele
        </Link>
      </Card>
    );
  }

  const displayOrders = showAll ? orders : orders.slice(0, 3);

  return (
    <div className="space-y-3">
      {displayOrders.map((order) => (
        <Link
          key={order.orderNumber}
          href={`/cont/comenzi/${order.orderNumber}`}
          className="block"
        >
          <Card
            padding="md"
            className="flex items-center justify-between transition-colors hover:border-brand-200 hover:bg-brand-50/30"
          >
            <div>
              <p className="font-semibold text-surface-900">{order.orderNumber}</p>
              <p className="text-sm text-surface-500">
                {formatDate(order.createdAt)} · {order.items.length}{" "}
                {order.items.length === 1 ? "produs" : "produse"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={statusVariant(order.status)}>
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
              <span className="font-bold text-surface-900">
                {formatPrice(order.totals.total)}
              </span>
              <ChevronRight className="h-4 w-4 text-surface-400" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
