"use server";

import { revalidatePath } from "next/cache";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  getCartSummary,
} from "@/lib/services/cart.service";

function revalidateCart() {
  revalidatePath("/cos");
  revalidatePath("/checkout");
  revalidatePath("/", "layout");
}

export async function addToCartAction(productId: string, quantity: number) {
  try {
    const summary = await addToCart(productId, quantity);
    revalidateCart();
    return { success: true as const, summary };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Eroare necunoscută",
    };
  }
}

export async function updateQuantityAction(
  productId: string,
  quantity: number
) {
  const summary = await updateCartQuantity(productId, quantity);
  revalidateCart();
  return { success: true as const, summary };
}

export async function removeItemAction(productId: string) {
  const summary = await removeFromCart(productId);
  revalidateCart();
  return { success: true as const, summary };
}

export async function applyCouponAction(code: string) {
  const summary = await applyCoupon(code);
  revalidateCart();
  return {
    success: !summary.couponError,
    summary,
    error: summary.couponError,
  };
}

export async function removeCouponAction() {
  const summary = await removeCoupon();
  revalidateCart();
  return { success: true as const, summary };
}

export async function getCartCountAction() {
  const summary = await getCartSummary();
  return summary.itemCount;
}
