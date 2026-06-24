import type { Cart, CartLineItem, CartSummary } from "@/types/cart";
import type { OrderTotals } from "@/types/checkout";
import { VAT_RATE, SHIPPING_CONFIG } from "@/config/commerce";
import { getAllCatalogProducts } from "@/lib/services/catalog.service";
import {
  getMaxOrderQuantity,
  isProductPurchasable,
} from "@/lib/catalog/stock-status";
import {
  validateCoupon,
  calculateDiscount,
  getCouponByCode,
} from "@/lib/services/coupon.service";
import { getCartCookie, setCartCookie } from "@/lib/cart/cookie";

async function resolveLineItems(cart: Cart): Promise<CartLineItem[]> {
  const products = await getAllCatalogProducts();
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lines = cart.items
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;

      const maxQty = getMaxOrderQuantity(product.stockStatus, product.stock);
      const quantity = Math.min(item.quantity, maxQty);
      if (!isProductPurchasable(product.stockStatus, product.stock) || quantity <= 0) {
        return null;
      }

      const line: CartLineItem = {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.image,
        price: product.price,
        quantity,
        lineTotal: product.price * quantity,
        stock: product.stock,
        stockStatus: product.stockStatus,
        sku: `CP-${product.id.padStart(4, "0")}`,
      };
      if (product.compareAtPrice !== undefined) {
        line.compareAtPrice = product.compareAtPrice;
      }
      return line;
    })
    .filter((item): item is CartLineItem => item !== null);

  return lines;
}

export function calculateShipping(
  items: CartLineItem[],
  subtotal: number,
  freeShipping = false
): number {
  if (freeShipping || subtotal >= SHIPPING_CONFIG.freeThreshold) {
    return 0;
  }

  const hasHeavyItem = items.some(
    (i) => i.price >= SHIPPING_CONFIG.heavyItemThreshold
  );
  if (hasHeavyItem) {
    return SHIPPING_CONFIG.heavyItemRate;
  }

  return SHIPPING_CONFIG.flatRate;
}

export function calculateOrderTotals(
  items: CartLineItem[],
  couponCode?: string
): OrderTotals {
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);

  let discount = 0;
  let freeShipping = false;
  let couponLabel: string | undefined;
  let appliedCoupon: string | undefined;

  if (couponCode) {
    const validation = validateCoupon(couponCode, subtotal);
    if (validation.valid && validation.coupon) {
      const result = calculateDiscount(validation.coupon, subtotal, 0);
      discount = result.discount;
      freeShipping = result.freeShipping;
      couponLabel = validation.coupon.label;
      appliedCoupon = validation.coupon.code;
    }
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discount);
  const shipping = calculateShipping(items, subtotalAfterDiscount, freeShipping);

  // Prices include VAT — extract VAT component from gross total
  const grossTotal = subtotalAfterDiscount + shipping;
  const vatAmount = Math.round((grossTotal * VAT_RATE) / (1 + VAT_RATE) * 100) / 100;
  const total = grossTotal;

  return {
    subtotal,
    discount,
    shipping,
    subtotalAfterDiscount,
    vatRate: VAT_RATE,
    vatAmount,
    total,
    couponCode: appliedCoupon,
    couponLabel,
    freeShipping: freeShipping || shipping === 0,
  };
}

export async function getCartSummary(): Promise<CartSummary> {
  const cart = await getCartCookie();
  const items = await resolveLineItems(cart);

  let couponError: string | undefined;
  if (cart.couponCode) {
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const validation = validateCoupon(cart.couponCode, subtotal);
    if (!validation.valid) {
      couponError = validation.error;
    }
  }

  return {
    items,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    couponCode: cart.couponCode,
    couponError,
  };
}

export async function addToCart(
  productId: string,
  quantity: number
): Promise<CartSummary> {
  const cart = await getCartCookie();
  const products = await getAllCatalogProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) throw new Error("Produsul nu a fost găsit.");

  if (!isProductPurchasable(product.stockStatus, product.stock)) {
    throw new Error("Produsul nu este disponibil pentru comandă.");
  }

  const maxQty = getMaxOrderQuantity(product.stockStatus, product.stock);
  const existing = cart.items.find((i) => i.productId === productId);
  const newQty = Math.min(
    (existing?.quantity ?? 0) + quantity,
    maxQty
  );

  if (newQty <= 0) throw new Error("Cantitate invalidă.");

  if (existing) {
    existing.quantity = newQty;
  } else {
    cart.items.push({ productId, quantity: newQty });
  }

  await setCartCookie(cart);
  return getCartSummary();
}

export async function updateCartQuantity(
  productId: string,
  quantity: number
): Promise<CartSummary> {
  const cart = await getCartCookie();

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.productId !== productId);
  } else {
    const products = await getAllCatalogProducts();
    const product = products.find((p) => p.id === productId);
    const maxQty = product
      ? getMaxOrderQuantity(product.stockStatus, product.stock)
      : 10;
    const item = cart.items.find((i) => i.productId === productId);
    if (item) {
      item.quantity = Math.min(quantity, maxQty);
    }
  }

  await setCartCookie(cart);
  return getCartSummary();
}

export async function removeFromCart(
  productId: string
): Promise<CartSummary> {
  const cart = await getCartCookie();
  cart.items = cart.items.filter((i) => i.productId !== productId);
  await setCartCookie(cart);
  return getCartSummary();
}

export async function applyCoupon(code: string): Promise<CartSummary> {
  const cart = await getCartCookie();
  const items = await resolveLineItems(cart);
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);

  const validation = validateCoupon(code, subtotal);
  if (!validation.valid) {
    return {
      items,
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
      couponCode: cart.couponCode,
      couponError: validation.error,
    };
  }

  cart.couponCode = validation.coupon!.code;
  await setCartCookie(cart);
  return getCartSummary();
}

export async function removeCoupon(): Promise<CartSummary> {
  const cart = await getCartCookie();
  delete cart.couponCode;
  await setCartCookie(cart);
  return getCartSummary();
}

export async function clearCart(): Promise<void> {
  const cart: Cart = { items: [] };
  await setCartCookie(cart);
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 90000) + 10000;
  return `EV-${year}-${seq}`;
}
