import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { listAdminOrders } from "@/lib/services/admin/admin.service";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Comenzi — Admin",
};

export default async function AdminOrdersPage() {
  const ctx = await requirePermission(PERMISSIONS.ORDERS_READ);
  const orders = await listAdminOrders();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Comenzi"
      description={`${orders.length} comenzi în total`}
    >
      <DataTable
        data={orders}
        keyField="orderNumber"
        columns={[
          {
            key: "orderNumber",
            header: "Comandă",
            render: (o) => (
              <Link
                href={`/admin/comenzi/${o.orderNumber}`}
                className="font-medium text-brand-600 hover:underline"
              >
                {o.orderNumber}
              </Link>
            ),
          },
          { key: "email", header: "Email" },
          {
            key: "createdAt",
            header: "Data",
            render: (o) => formatDate(o.createdAt),
          },
          {
            key: "status",
            header: "Status",
            render: (o) =>
              ctx.permissions.includes("orders:write") ||
              ctx.permissions.includes("*") ? (
                <OrderStatusSelect
                  orderNumber={o.orderNumber}
                  current={o.status}
                />
              ) : (
                ORDER_STATUS_LABELS[o.status]
              ),
          },
          {
            key: "total",
            header: "Total",
            className: "text-right",
            render: (o) => (
              <span className="font-semibold">
                {formatPrice(o.totals.total)}
              </span>
            ),
          },
        ]}
      />
    </AdminShell>
  );
}
