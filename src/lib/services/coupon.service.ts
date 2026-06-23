import type { CouponDefinition } from "@/config/commerce";
import { getAdminCoupons } from "@/lib/admin/coupon-store";

export interface CouponValidation {
  valid: boolean;
  coupon?: CouponDefinition;
  error?: string;
}

export function validateCoupon(
  code: string,
  subtotal: number
): CouponValidation {
  const normalized = code.trim().toUpperCase();
  const coupon = getAdminCoupons().find((c) => c.code === normalized);

  if (!coupon) {
    return { valid: false, error: "Codul de reducere nu este valid." };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `Comanda minimă pentru acest cupon este ${coupon.minOrderAmount} RON.`,
    };
  }

  return { valid: true, coupon };
}

export function calculateDiscount(
  coupon: CouponDefinition,
  subtotal: number,
  shipping: number
): { discount: number; freeShipping: boolean } {
  switch (coupon.type) {
    case "PERCENTAGE": {
      let discount = Math.round(subtotal * (coupon.value / 100));
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
      return { discount, freeShipping: false };
    }
    case "FIXED_AMOUNT":
      return {
        discount: Math.min(coupon.value, subtotal),
        freeShipping: false,
      };
    case "FREE_SHIPPING":
      return { discount: 0, freeShipping: true };
    default:
      return { discount: 0, freeShipping: false };
  }
}

export function getCouponByCode(code: string): CouponDefinition | undefined {
  return getAdminCoupons().find((c) => c.code === code.trim().toUpperCase());
}
