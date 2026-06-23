import type { CheckoutFormData, OrderTotals } from "@/types/checkout";
import type { CartLineItem } from "@/types/cart";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderLineItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId?: string;
  status: OrderStatus;
  email: string;
  phone: string;
  shipping: CheckoutFormData["shipping"];
  companyInvoice: CheckoutFormData["companyInvoice"];
  items: OrderLineItem[];
  totals: OrderTotals;
  couponCode?: string;
  notes?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  refundedAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  refundedAt?: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "În așteptare",
  PAID: "Plătită",
  PROCESSING: "În procesare",
  SHIPPED: "Expediată",
  DELIVERED: "Livrată",
  COMPLETED: "Finalizată",
  CANCELLED: "Anulată",
  REFUNDED: "Rambursată",
};

export function cartItemsToOrderLines(items: CartLineItem[]): OrderLineItem[] {
  return items.map((item) => ({
    productId: item.productId,
    sku: item.sku,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    total: item.lineTotal,
  }));
}
