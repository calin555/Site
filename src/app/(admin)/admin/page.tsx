import type { Metadata } from "next";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Star,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { DataTable } from "@/components/admin/DataTable";
import {
  getDashboardStats,
  getRecentOrders,
  getSalesChartData,
  getTopProducts,
} from "@/lib/services/admin/analytics.service";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const ctx = await requireAdmin();
  const [stats, recentOrders, salesData, topProducts] = await Promise.all([
    getDashboardStats(),
    Promise.resolve(getRecentOrders()),
    Promise.resolve(getSalesChartData()),
    Promise.resolve(getTopProducts()),
  ]);

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Dashboard"
      description="Prezentare generală a magazinului ChargePro"
    >
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <StatCard
            label="Venituri totale"
            value={formatPrice(stats.revenue)}
            change={`+${stats.revenueChange}% vs luna trecută`}
            trend="up"
            icon={DollarSign}
          />
          <StatCard
            label="Comenzi"
            value={stats.ordersCount}
            change={`${stats.ordersToday} astăzi`}
            icon={ShoppingCart}
          />
          <StatCard
            label="Clienți"
            value={stats.customersCount}
            icon={Users}
          />
          <StatCard
            label="Produse"
            value={stats.productsCount}
            icon={Package}
          />
          <StatCard
            label="Stoc redus"
            value={stats.lowStockCount}
            change="≤ 5 unități"
            trend={stats.lowStockCount > 0 ? "down" : "neutral"}
            icon={AlertTriangle}
          />
          <StatCard
            label="Recenzii în așteptare"
            value={stats.pendingReviews}
            icon={Star}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-surface-900">
              Vânzări — ultimele 7 zile
            </h2>
            <SalesChart data={salesData} />
          </div>

          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-surface-900">Top produse</h2>
            {topProducts.length === 0 ? (
              <p className="text-sm text-surface-500">Nicio vânzare încă.</p>
            ) : (
              <ul className="space-y-3">
                {topProducts.map((p, i) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-surface-700">
                      <span className="mr-2 font-bold text-brand-600">
                        {i + 1}.
                      </span>
                      {p.name}
                      <span className="ml-2 text-surface-400">
                        ({p.sold} buc.)
                      </span>
                    </span>
                    <span className="font-semibold">{formatPrice(p.revenue)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-surface-900">Comenzi recente</h2>
            <Link
              href="/admin/comenzi"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Vezi toate
            </Link>
          </div>
          <DataTable
            data={recentOrders}
            keyField="orderNumber"
            emptyMessage="Nicio comandă."
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
              {
                key: "email",
                header: "Client",
              },
              {
                key: "createdAt",
                header: "Data",
                render: (o) => formatDate(o.createdAt),
              },
              {
                key: "status",
                header: "Status",
                render: (o) => (
                  <Badge variant="outline">
                    {ORDER_STATUS_LABELS[o.status]}
                  </Badge>
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
        </div>
      </div>
    </AdminShell>
  );
}
