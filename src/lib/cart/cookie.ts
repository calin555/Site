import { cookies } from "next/headers";
import type { Cart } from "@/types/cart";

export const CART_COOKIE = "cart";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getCartCookie(): Promise<Cart> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;
  if (!raw) return { items: [] };

  try {
    const parsed = JSON.parse(raw) as Cart;
    if (!Array.isArray(parsed.items)) return { items: [] };
    return {
      items: parsed.items.filter(
        (i) => i.productId && i.quantity > 0
      ),
      couponCode: parsed.couponCode,
    };
  } catch {
    return { items: [] };
  }
}

export async function setCartCookie(cart: Cart): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function clearCartCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}
