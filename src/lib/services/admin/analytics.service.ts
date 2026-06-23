import { orderStore } from "@/lib/orders/order.store";
import { getAllCatalogProducts } from "@/lib/services/catalog.service";
import { listAllUsers } from "@/lib/services/user.service";
import { getAdminReviews } from "@/lib/admin/review-store";
import { getAdminCoupons } from "@/lib/admin/coupon-store";
import { categories, brands, blogPosts } from "@/lib/mock-data";
import type { OrderRecord } from "@/types/order";
import { formatPrice } from "@/lib/utils";

export interface DashboardStats {
  revenue: number;
  revenueChange: number;
  ordersCount: number;
  ordersToday: number;
  customersCount: number;
  productsCount: number;
  lowStockCount: number;
  pendingReviews: number;
  activeCoupons: number;
}

export interface SalesDataPoint {
  label: string;
  value: number;
}

export interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
}

function isPaidOrder(order: OrderRecord): boolean {
  return ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(
    order.status
  );
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const orders = orderStore.list();
  const paidOrders = orders.filter(isPaidOrder);
  const revenue = paidOrders.reduce((s, o) => s + o.totals.total, 0);

  const today = new Date().toDateString();
  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  ).length;

  const products = await getAllCatalogProducts();
  const lowStock = products.filter((p) => p.stock <= 5).length;
  const pendingReviews = getAdminReviews().filter(
    (r) => r.status === "PENDING"
  ).length;

  const users = await listAllUsers();
  const customers = users.filter((u) => u.roleSlug === "customer").length;

  return {
    revenue,
    revenueChange: 12.4,
    ordersCount: orders.length,
    ordersToday,
    customersCount: customers,
    productsCount: products.length,
    lowStockCount: lowStock,
    pendingReviews,
    activeCoupons: getAdminCoupons().length,
  };
}

export function getRecentOrders(limit = 5): OrderRecord[] {
  return orderStore.list().slice(0, limit);
}

export function getSalesChartData(): SalesDataPoint[] {
  const orders = orderStore.list().filter(isPaidOrder);
  const days: SalesDataPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("ro-RO", { weekday: "short" });
    const dayTotal = orders
      .filter((o) => new Date(o.createdAt).toDateString() === d.toDateString())
      .reduce((s, o) => s + o.totals.total, 0);
    days.push({ label, value: dayTotal });
  }

  return days;
}

export function getTopProducts(limit = 5): TopProduct[] {
  const orders = orderStore.list().filter(isPaidOrder);
  const map = new Map<string, TopProduct>();

  for (const order of orders) {
    for (const item of order.items) {
      const existing = map.get(item.productId) ?? {
        name: item.name,
        sold: 0,
        revenue: 0,
      };
      existing.sold += item.quantity;
      existing.revenue += item.total;
      map.set(item.productId, existing);
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function getCatalogSummary() {
  return {
    categories: categories.length,
    brands: brands.length,
    blogPosts: blogPosts.length,
  };
}

export { formatPrice };
