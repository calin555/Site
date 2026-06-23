import type { CatalogProduct } from "@/types/catalog";
import {
  getAllCatalogProductsAdmin,
  getAllCatalogProducts,
} from "@/lib/services/catalog.service";
import {
  listAdminCategories as fetchAdminCategories,
  updateCategory,
} from "@/lib/services/category.service";
import { brands } from "@/lib/mock-data";
import { getAllArticles } from "@/lib/services/blog.service";
import type { Category, Brand } from "@/lib/mock-data";
import { orderStore } from "@/lib/orders/order.store";
import { updateOrderStatus } from "@/lib/services/order.service";
import { listAllUsers } from "@/lib/services/user.service";
import {
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
  type AdminReview,
  type ReviewStatus,
} from "@/lib/admin/review-store";
import {
  getAdminCoupons,
  saveCoupon,
  deleteCoupon,
} from "@/lib/admin/coupon-store";
import type { CouponDefinition } from "@/config/commerce";
import type { OrderRecord, OrderStatus } from "@/types/order";
import type { PublicUser } from "@/types/user";

export async function listAdminProducts(): Promise<CatalogProduct[]> {
  return getAllCatalogProductsAdmin();
}

export async function getAdminProduct(
  id: string
): Promise<CatalogProduct | undefined> {
  const products = await getAllCatalogProductsAdmin();
  return products.find((p) => p.id === id);
}

export async function updateAdminProduct(
  id: string,
  patch: Partial<CatalogProduct>
): Promise<CatalogProduct | null> {
  const products = await getAllCatalogProductsAdmin();
  const idx = products.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  products[idx] = { ...products[idx], ...patch };
  return products[idx];
}

export async function listAdminCategories(): Promise<Category[]> {
  return fetchAdminCategories();
}

export async function listAdminBrands(): Promise<Brand[]> {
  const products = await getAllCatalogProducts();
  const counts = new Map<string, number>();

  for (const product of products) {
    counts.set(product.brandSlug, (counts.get(product.brandSlug) ?? 0) + 1);
  }

  return brands.map((brand) => ({
    ...brand,
    productCount: counts.get(brand.slug) ?? 0,
  }));
}

export async function updateAdminCategory(
  id: string,
  patch: Partial<Category>
): Promise<Category | null> {
  return updateCategory(id, {
    name: patch.name,
    description: patch.description,
    image: patch.image,
  });
}

export function updateAdminBrand(id: string, patch: Partial<Brand>): Brand | null {
  const idx = brands.findIndex((b) => b.id === id);
  if (idx < 0) return null;
  brands[idx] = { ...brands[idx], ...patch };
  return brands[idx];
}

export function listAdminOrders(): OrderRecord[] {
  return orderStore.list();
}

export function getAdminOrder(orderNumber: string): OrderRecord | null {
  return orderStore.getByNumber(orderNumber);
}

export async function updateAdminOrderStatus(
  orderNumber: string,
  status: OrderStatus
): Promise<OrderRecord | null> {
  return updateOrderStatus(orderNumber, status);
}

export async function listAdminCustomers(): Promise<PublicUser[]> {
  const users = await listAllUsers();
  return users.filter((u) => u.roleSlug === "customer");
}

export function listAdminReviews(): AdminReview[] {
  return getAdminReviews();
}

export function moderateReview(
  id: string,
  status: ReviewStatus
): AdminReview | null {
  return updateReviewStatus(id, status);
}

export function removeReview(id: string): boolean {
  return deleteReview(id);
}

export function listAdminBlogPosts() {
  return getAllArticles();
}

export function updateAdminBlogPost(
  id: string,
  patch: { title?: string; excerpt?: string; category?: string }
) {
  const articles = getAllArticles();
  const article = articles.find((a) => a.id === id);
  return article;
}

export function listAdminCoupons(): CouponDefinition[] {
  return getAdminCoupons();
}

export function upsertAdminCoupon(coupon: CouponDefinition): void {
  saveCoupon({ ...coupon, code: coupon.code.toUpperCase() });
}

export function removeAdminCoupon(code: string): boolean {
  return deleteCoupon(code);
}
