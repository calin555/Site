import { getSupabase } from "@/lib/supabase/server";
import { orderStore } from "@/lib/orders/order.store";
import type { CheckoutFormData, OrderTotals } from "@/types/checkout";
import type { CartLineItem } from "@/types/cart";
import {
  type OrderRecord,
  type OrderStatus,
  cartItemsToOrderLines,
} from "@/types/order";

function generateId(): string {
  return `ord_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function mapBilling(formData: CheckoutFormData) {
  const { companyInvoice, shipping } = formData;
  if (!companyInvoice.enabled) {
    return {
      billingFirstName: null,
      billingLastName: null,
      billingStreet: null,
      billingCity: null,
      billingCounty: null,
      billingPostalCode: null,
      billingCountry: null,
    };
  }

  return {
    billingFirstName: companyInvoice.companyName,
    billingLastName: companyInvoice.registrationNumber ?? null,
    billingStreet: companyInvoice.billingStreet ?? shipping.street,
    billingCity: companyInvoice.billingCity ?? shipping.city,
    billingCounty: companyInvoice.billingCounty ?? shipping.county,
    billingPostalCode: companyInvoice.billingPostalCode ?? shipping.postalCode,
    billingCountry: shipping.country,
  };
}

function mapDbOrderToRecord(
  dbOrder: {
    id: string;
    orderNumber: string;
    userId: string | null;
    status: string;
    email: string;
    phone: string | null;
    shippingFirstName: string;
    shippingLastName: string;
    shippingStreet: string;
    shippingCity: string;
    shippingCounty: string;
    shippingPostalCode: string;
    shippingCountry: string;
    billingFirstName: string | null;
    billingLastName: string | null;
    billingStreet: string | null;
    billingCity: string | null;
    billingCounty: string | null;
    billingPostalCode: string | null;
    billingCountry: string | null;
    subtotal: number | string;
    shippingCost: number | string;
    discountAmount: number | string;
    taxAmount: number | string;
    total: number | string;
    currency: string;
    couponCode: string | null;
    notes: string | null;
    stripePaymentIntentId: string | null;
    createdAt: string;
    updatedAt: string;
    items: Array<{
      productId: string | null;
      sku: string;
      name: string;
      price: number | string;
      quantity: number;
      total: number | string;
    }>;
  }
): OrderRecord {
  return {
    id: dbOrder.id,
    orderNumber: dbOrder.orderNumber,
    userId: dbOrder.userId ?? undefined,
    status: dbOrder.status as OrderStatus,
    email: dbOrder.email,
    phone: dbOrder.phone ?? "",
    shipping: {
      firstName: dbOrder.shippingFirstName,
      lastName: dbOrder.shippingLastName,
      street: dbOrder.shippingStreet,
      city: dbOrder.shippingCity,
      county: dbOrder.shippingCounty,
      postalCode: dbOrder.shippingPostalCode,
      country: dbOrder.shippingCountry,
    },
    companyInvoice: {
      enabled: Boolean(dbOrder.billingFirstName),
      companyName: dbOrder.billingFirstName ?? "",
      cui: "",
      registrationNumber: dbOrder.billingLastName ?? undefined,
      billingStreet: dbOrder.billingStreet ?? undefined,
      billingCity: dbOrder.billingCity ?? undefined,
      billingCounty: dbOrder.billingCounty ?? undefined,
      billingPostalCode: dbOrder.billingPostalCode ?? undefined,
    },
    items: dbOrder.items.map((item) => ({
      productId: item.productId ?? "",
      sku: item.sku,
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity,
      total: Number(item.total),
    })),
    totals: {
      subtotal: Number(dbOrder.subtotal),
      discount: Number(dbOrder.discountAmount),
      shipping: Number(dbOrder.shippingCost),
      subtotalAfterDiscount:
        Number(dbOrder.subtotal) - Number(dbOrder.discountAmount),
      vatRate: 0.19,
      vatAmount: Number(dbOrder.taxAmount),
      total: Number(dbOrder.total),
      couponCode: dbOrder.couponCode ?? undefined,
      freeShipping: Number(dbOrder.shippingCost) === 0,
    },
    couponCode: dbOrder.couponCode ?? undefined,
    notes: dbOrder.notes ?? undefined,
    stripePaymentIntentId: dbOrder.stripePaymentIntentId ?? undefined,
    refundedAmount: 0,
    currency: dbOrder.currency,
    createdAt: dbOrder.createdAt,
    updatedAt: dbOrder.updatedAt,
  };
}

async function persistOrderToDb(order: OrderRecord): Promise<void> {
  try {
    const supabase = getSupabase();
    const billing = order.companyInvoice.enabled
      ? {
          billingFirstName: order.companyInvoice.companyName,
          billingLastName: order.companyInvoice.registrationNumber ?? null,
          billingStreet:
            order.companyInvoice.billingStreet ?? order.shipping.street,
          billingCity: order.companyInvoice.billingCity ?? order.shipping.city,
          billingCounty:
            order.companyInvoice.billingCounty ?? order.shipping.county,
          billingPostalCode:
            order.companyInvoice.billingPostalCode ??
            order.shipping.postalCode,
          billingCountry: order.shipping.country,
        }
      : {
          billingFirstName: null,
          billingLastName: null,
          billingStreet: null,
          billingCity: null,
          billingCounty: null,
          billingPostalCode: null,
          billingCountry: null,
        };

    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("orderNumber", order.orderNumber)
      .maybeSingle();

    const now = new Date().toISOString();

    if (existing) {
      const { error } = await supabase
        .from("orders")
        .update({
          status: order.status,
          stripePaymentIntentId: order.stripePaymentIntentId ?? null,
          updatedAt: now,
        })
        .eq("orderNumber", order.orderNumber);

      if (error) throw error;
      return;
    }

    const { data: created, error: orderError } = await supabase
      .from("orders")
      .insert({
        orderNumber: order.orderNumber,
        userId: order.userId ?? null,
        status: order.status,
        email: order.email,
        phone: order.phone,
        shippingFirstName: order.shipping.firstName,
        shippingLastName: order.shipping.lastName,
        shippingStreet: order.shipping.street,
        shippingCity: order.shipping.city,
        shippingCounty: order.shipping.county,
        shippingPostalCode: order.shipping.postalCode,
        shippingCountry: order.shipping.country,
        ...billing,
        subtotal: order.totals.subtotal,
        shippingCost: order.totals.shipping,
        discountAmount: order.totals.discount,
        taxAmount: order.totals.vatAmount,
        total: order.totals.total,
        currency: order.currency,
        couponCode: order.couponCode ?? null,
        notes: order.notes ?? null,
        stripePaymentIntentId: order.stripePaymentIntentId ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    const orderItems = order.items.map((item) => ({
      orderId: created.id,
      sku: item.sku,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;
  } catch {
    // DB unavailable — in-memory store remains source of truth
  }
}

export async function createPendingOrder(params: {
  orderNumber: string;
  formData: CheckoutFormData;
  items: CartLineItem[];
  totals: OrderTotals;
  couponCode?: string;
  stripePaymentIntentId?: string;
  userId?: string;
}): Promise<OrderRecord> {
  const now = new Date().toISOString();
  const order: OrderRecord = {
    id: generateId(),
    orderNumber: params.orderNumber,
    userId: params.userId,
    status: "PENDING",
    email: params.formData.email,
    phone: params.formData.phone,
    shipping: params.formData.shipping,
    companyInvoice: params.formData.companyInvoice,
    items: cartItemsToOrderLines(params.items),
    totals: params.totals,
    couponCode: params.couponCode,
    notes: params.formData.notes,
    stripePaymentIntentId: params.stripePaymentIntentId,
    refundedAmount: 0,
    currency: "RON",
    createdAt: now,
    updatedAt: now,
  };

  orderStore.save(order);
  await persistOrderToDb(order);
  return order;
}

const ORDER_SELECT = `
  *,
  items:order_items(*)
`;

export async function getOrderByNumber(
  orderNumber: string
): Promise<OrderRecord | null> {
  const fromStore = orderStore.getByNumber(orderNumber);
  if (fromStore) return fromStore;

  try {
    const supabase = getSupabase();
    const { data: dbOrder, error } = await supabase
      .from("orders")
      .select(ORDER_SELECT)
      .eq("orderNumber", orderNumber)
      .maybeSingle();

    if (error) throw error;
    if (!dbOrder) return null;

    const order = mapDbOrderToRecord(dbOrder);
    orderStore.save(order);
    return order;
  } catch {
    return null;
  }
}

export async function getOrderByPaymentIntentId(
  paymentIntentId: string
): Promise<OrderRecord | null> {
  const fromStore = orderStore.getByPaymentIntentId(paymentIntentId);
  if (fromStore) return fromStore;

  try {
    const supabase = getSupabase();
    const { data: dbOrder, error } = await supabase
      .from("orders")
      .select("orderNumber")
      .eq("stripePaymentIntentId", paymentIntentId)
      .maybeSingle();

    if (error) throw error;
    if (!dbOrder) return null;
    return getOrderByNumber(dbOrder.orderNumber);
  } catch {
    return null;
  }
}

export async function updateOrderStatus(
  orderNumber: string,
  status: OrderStatus,
  extra?: Partial<Pick<OrderRecord, "stripeChargeId" | "paidAt" | "refundedAt" | "refundedAmount">>
): Promise<OrderRecord | null> {
  const existing = await getOrderByNumber(orderNumber);
  if (!existing) return null;

  const updated = orderStore.update(orderNumber, { status, ...extra });
  if (!updated) return null;

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("orders")
      .update({
        status,
        stripePaymentIntentId: updated.stripePaymentIntentId ?? null,
        updatedAt: new Date().toISOString(),
      })
      .eq("orderNumber", orderNumber);

    if (error) throw error;
  } catch {
    // in-memory only
  }

  return updated;
}

export async function attachPaymentIntent(
  orderNumber: string,
  paymentIntentId: string
): Promise<OrderRecord | null> {
  const existing = await getOrderByNumber(orderNumber);
  if (!existing) return null;

  const updated = orderStore.update(orderNumber, {
    stripePaymentIntentId: paymentIntentId,
  });
  if (!updated) return null;

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("orders")
      .update({
        stripePaymentIntentId: paymentIntentId,
        updatedAt: new Date().toISOString(),
      })
      .eq("orderNumber", orderNumber);

    if (error) throw error;
  } catch {
    // in-memory only
  }

  return updated;
}

export async function markOrderPaid(
  orderNumber: string,
  paymentIntentId?: string,
  chargeId?: string
): Promise<OrderRecord | null> {
  const existing = await getOrderByNumber(orderNumber);
  if (!existing) return null;
  if (existing.status === "PAID" || existing.status === "PROCESSING") {
    return existing;
  }

  const paidAt = new Date().toISOString();
  const updated = orderStore.update(orderNumber, {
    status: "PAID",
    stripePaymentIntentId: paymentIntentId ?? existing.stripePaymentIntentId,
    stripeChargeId: chargeId ?? existing.stripeChargeId,
    paidAt,
  });

  if (!updated) return null;

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("orders")
      .update({
        status: "PAID",
        stripePaymentIntentId: updated.stripePaymentIntentId ?? null,
        updatedAt: new Date().toISOString(),
      })
      .eq("orderNumber", orderNumber);

    if (error) throw error;
  } catch {
    // in-memory only
  }

  return updated;
}

export async function markOrderFailed(
  orderNumber: string
): Promise<OrderRecord | null> {
  const existing = await getOrderByNumber(orderNumber);
  if (!existing || existing.status === "PAID") return existing;

  return updateOrderStatus(orderNumber, "CANCELLED");
}

export async function markOrderRefunded(
  orderNumber: string,
  refundedAmount: number,
  fullRefund: boolean
): Promise<OrderRecord | null> {
  const existing = await getOrderByNumber(orderNumber);
  if (!existing) return null;

  const updated = orderStore.update(orderNumber, {
    status: fullRefund ? "REFUNDED" : existing.status,
    refundedAmount,
    refundedAt: new Date().toISOString(),
  });

  if (!updated) return null;

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("orders")
      .update({
        status: fullRefund ? "REFUNDED" : existing.status,
        updatedAt: new Date().toISOString(),
      })
      .eq("orderNumber", orderNumber);

    if (error) throw error;
  } catch {
    // in-memory only
  }

  return updated;
}

export async function listOrdersForUser(
  userId: string,
  email: string
): Promise<OrderRecord[]> {
  const fromStore = orderStore.listByUser(userId, email);
  if (fromStore.length > 0) return fromStore;

  try {
    const supabase = getSupabase();
    const { data: dbOrders, error } = await supabase
      .from("orders")
      .select("orderNumber")
      .or(`userId.eq.${userId},email.eq.${email}`)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    for (const dbOrder of dbOrders ?? []) {
      await getOrderByNumber(dbOrder.orderNumber);
    }

    return orderStore.listByUser(userId, email);
  } catch {
    return fromStore;
  }
}

export async function userOwnsOrder(
  order: OrderRecord,
  userId: string,
  email: string
): Promise<boolean> {
  return (
    order.userId === userId ||
    order.email.toLowerCase() === email.toLowerCase()
  );
}

export { mapBilling };
