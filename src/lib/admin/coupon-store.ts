import type { CouponDefinition } from "@/config/commerce";
import { COUPONS } from "@/config/commerce";

let coupons: CouponDefinition[] = [...COUPONS];

export function getAdminCoupons(): CouponDefinition[] {
  return coupons;
}

export function getCouponById(code: string): CouponDefinition | undefined {
  return coupons.find((c) => c.code === code.toUpperCase());
}

export function saveCoupon(coupon: CouponDefinition): void {
  const idx = coupons.findIndex((c) => c.code === coupon.code);
  if (idx >= 0) coupons[idx] = coupon;
  else coupons.push(coupon);
}

export function deleteCoupon(code: string): boolean {
  const before = coupons.length;
  coupons = coupons.filter((c) => c.code !== code.toUpperCase());
  return coupons.length < before;
}

export function setCoupons(data: CouponDefinition[]): void {
  coupons = data;
}
