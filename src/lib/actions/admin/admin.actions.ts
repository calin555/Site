"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import {
  updateAdminProduct,
  updateAdminCategory,
  updateAdminBrand,
  updateAdminOrderStatus,
  moderateReview,
  removeReview,
  updateAdminBlogPost,
  upsertAdminCoupon,
  removeAdminCoupon,
} from "@/lib/services/admin/admin.service";
import type { OrderStatus } from "@/types/order";
import type { ReviewStatus } from "@/lib/admin/review-store";
import type { CouponDefinition } from "@/config/commerce";

function revalidateAdmin() {
  revalidatePath("/admin", "layout");
}

export async function updateProductAction(
  id: string,
  data: Record<string, unknown>
) {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);
  const result = await updateAdminProduct(id, {
    name: data.name as string | undefined,
    price: data.price !== undefined ? Number(data.price) : undefined,
    stock: data.stock !== undefined ? Number(data.stock) : undefined,
    isFeatured: data.isFeatured as boolean | undefined,
    isNew: data.isNew as boolean | undefined,
  });
  revalidateAdmin();
  revalidatePath("/produse");
  return { success: !!result };
}

export async function updateCategoryAction(
  id: string,
  data: { name?: string; description?: string; image?: string; isActive?: boolean }
) {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);
  await updateAdminCategory(id, data);
  revalidateAdmin();
  revalidatePath("/categorii");
  revalidatePath("/");
  return { success: true };
}

export async function updateBrandAction(
  id: string,
  data: { name?: string; productCount?: number }
) {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);
  updateAdminBrand(id, data);
  revalidateAdmin();
  return { success: true };
}

export async function updateOrderStatusAction(
  orderNumber: string,
  status: OrderStatus
) {
  await requirePermission(PERMISSIONS.ORDERS_WRITE);
  await updateAdminOrderStatus(orderNumber, status);
  revalidateAdmin();
  return { success: true };
}

export async function moderateReviewAction(id: string, status: ReviewStatus) {
  await requirePermission(PERMISSIONS.REVIEWS_MODERATE);
  moderateReview(id, status);
  revalidateAdmin();
  return { success: true };
}

export async function deleteReviewAction(id: string) {
  await requirePermission(PERMISSIONS.REVIEWS_MODERATE);
  removeReview(id);
  revalidateAdmin();
  return { success: true };
}

export async function updateBlogPostAction(
  id: string,
  data: { title?: string; excerpt?: string; category?: string }
) {
  await requirePermission(PERMISSIONS.CONTENT_WRITE);
  updateAdminBlogPost(id, data);
  revalidateAdmin();
  revalidatePath("/blog");
  return { success: true };
}

export async function saveCouponAction(coupon: CouponDefinition) {
  await requirePermission(PERMISSIONS.COUPONS_WRITE);
  upsertAdminCoupon(coupon);
  revalidateAdmin();
  return { success: true };
}

export async function deleteCouponAction(code: string) {
  await requirePermission(PERMISSIONS.COUPONS_WRITE);
  removeAdminCoupon(code);
  revalidateAdmin();
  return { success: true };
}
