import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { OrderSummary } from "@/components/shop/cart/OrderSummary";
import { getAdminOrder } from "@/lib/services/admin/admin.service";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface Props {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `Comandă ${orderNumber} — Admin` };
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;
  const ctx = await requirePermission(PERMISSIONS.ORDERS_READ);
  const order = await getAdminOrder(orderNumber);
  if (!order) notFound();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title={`Comandă ${order.orderNumber}`}
      description={`Plasată pe ${formatDate(order.createdAt)}`}
    >
      <div className="space-y-6">
        <Link
          href="/admin/comenzi"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi la comenzi
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <Badge variant="outline">
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
                {(ctx.permissions.includes("orders:write") ||
                  ctx.permissions.includes("*")) && (
                  <OrderStatusSelect
                    orderNumber={order.orderNumber}
                    current={order.status}
                  />
                )}
              </div>
              <h3 className="font-bold text-surface-900">Produse</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {order.items.map((item) => (
                  <li key={item.sku} className="flex justify-between">
                    <span>
                      {item.name} ×{item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.total)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-surface-900">Livrare</h3>
                <p className="mt-2 text-sm text-surface-600">
                  {order.shipping.firstName} {order.shipping.lastName}
                  <br />
                  {order.shipping.street}
                  <br />
                  {order.shipping.city}, {order.shipping.county}
                </p>
              </div>
              <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-surface-900">Contact</h3>
                <p className="mt-2 text-sm text-surface-600">
                  {order.email}
                  <br />
                  {order.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <OrderSummary totals={order.totals} />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
