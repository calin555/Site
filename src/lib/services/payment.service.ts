import Stripe from "stripe";
import type { CheckoutFormData, OrderTotals } from "@/types/checkout";
import type { CartLineItem } from "@/types/cart";
import {
  getCartSummary,
  calculateOrderTotals,
  generateOrderNumber,
  clearCart,
} from "@/lib/services/cart.service";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  createPendingOrder,
  getOrderByNumber,
  getOrderByPaymentIntentId,
  markOrderPaid,
  markOrderFailed,
  attachPaymentIntent,
  markOrderRefunded,
} from "@/lib/services/order.service";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-05-27.dahlia",
      typescript: true,
    });
  }
  return stripeInstance;
}

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}

export interface CreateCheckoutResult {
  orderNumber: string;
  clientSecret: string | null;
  totals: OrderTotals;
  mockPayment: boolean;
  items: CartLineItem[];
}

export async function createCheckoutPayment(
  formData: CheckoutFormData
): Promise<CreateCheckoutResult> {
  const summary = await getCartSummary();

  if (summary.items.length === 0) {
    throw new Error("Coșul este gol.");
  }

  const totals = calculateOrderTotals(
    summary.items,
    summary.couponError ? undefined : summary.couponCode
  );

  const orderNumber = generateOrderNumber();
  const stripe = getStripe();
  const currentUser = await getCurrentUser();

  await createPendingOrder({
    orderNumber,
    formData,
    items: summary.items,
    totals,
    couponCode: summary.couponError ? undefined : summary.couponCode,
    userId: currentUser?.id,
  });

  if (!stripe) {
    return {
      orderNumber,
      clientSecret: null,
      totals,
      mockPayment: true,
      items: summary.items,
    };
  }

  const amountInBani = Math.round(totals.total * 100);

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: amountInBani,
      currency: "ron",
      payment_method_types: ["card"],
      metadata: {
        orderNumber,
        email: formData.email,
        phone: formData.phone,
        customerName: `${formData.shipping.firstName} ${formData.shipping.lastName}`,
        companyInvoice: formData.companyInvoice.enabled ? "true" : "false",
        cui: formData.companyInvoice.cui || "",
        companyName: formData.companyInvoice.companyName || "",
      },
      receipt_email: formData.email,
      description: `Comandă ${orderNumber} — ChargePro`,
    },
    { idempotencyKey: `checkout-${orderNumber}` }
  );

  await attachPaymentIntent(orderNumber, paymentIntent.id);

  return {
    orderNumber,
    clientSecret: paymentIntent.client_secret,
    totals,
    mockPayment: false,
    items: summary.items,
  };
}

export interface ConfirmPaymentResult {
  confirmed: boolean;
  orderNumber: string;
  status: string;
  alreadyPaid?: boolean;
  error?: string;
}

export async function confirmPayment(params: {
  orderNumber: string;
  paymentIntentId?: string;
  mock?: boolean;
}): Promise<ConfirmPaymentResult> {
  const { orderNumber, paymentIntentId, mock } = params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    return {
      confirmed: false,
      orderNumber,
      status: "UNKNOWN",
      error: "Comanda nu a fost găsită.",
    };
  }

  if (order.status === "PAID" || order.status === "PROCESSING") {
    await clearCart();
    return {
      confirmed: true,
      orderNumber,
      status: order.status,
      alreadyPaid: true,
    };
  }

  if (mock) {
    const paid = await markOrderPaid(orderNumber);
    if (!paid) {
      return {
        confirmed: false,
        orderNumber,
        status: order.status,
        error: "Nu am putut marca comanda ca plătită.",
      };
    }
    await clearCart();
    return { confirmed: true, orderNumber, status: "PAID" };
  }

  const stripe = getStripe();
  if (!stripe) {
    return {
      confirmed: false,
      orderNumber,
      status: order.status,
      error: "Stripe nu este configurat.",
    };
  }

  const piId = paymentIntentId ?? order.stripePaymentIntentId;
  if (!piId) {
    return {
      confirmed: false,
      orderNumber,
      status: order.status,
      error: "PaymentIntent lipsă.",
    };
  }

  const intent = await stripe.paymentIntents.retrieve(piId);

  if (intent.status !== "succeeded") {
    return {
      confirmed: false,
      orderNumber,
      status: order.status,
      error: `Plata nu este confirmată (status: ${intent.status}).`,
    };
  }

  const chargeId =
    typeof intent.latest_charge === "string"
      ? intent.latest_charge
      : intent.latest_charge?.id;

  await markOrderPaid(orderNumber, piId, chargeId);
  await clearCart();

  return { confirmed: true, orderNumber, status: "PAID" };
}

export async function handlePaymentSucceeded(
  paymentIntentId: string
): Promise<void> {
  const stripe = getStripe();
  if (!stripe) return;

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (intent.status !== "succeeded") return;

  const orderNumber = intent.metadata.orderNumber;
  const order =
    (orderNumber ? await getOrderByNumber(orderNumber) : null) ??
    (await getOrderByPaymentIntentId(paymentIntentId));

  if (!order) return;

  const chargeId =
    typeof intent.latest_charge === "string"
      ? intent.latest_charge
      : intent.latest_charge?.id;

  await markOrderPaid(order.orderNumber, paymentIntentId, chargeId);
}

export async function handlePaymentFailed(
  paymentIntentId: string
): Promise<void> {
  const order = await getOrderByPaymentIntentId(paymentIntentId);
  if (!order) return;
  await markOrderFailed(order.orderNumber);
}

export async function handlePaymentCanceled(
  paymentIntentId: string
): Promise<void> {
  const order = await getOrderByPaymentIntentId(paymentIntentId);
  if (!order) return;
  await markOrderFailed(order.orderNumber);
}

export async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!paymentIntentId) return;

  const order = await getOrderByPaymentIntentId(paymentIntentId);
  if (!order) return;

  const refundedAmount = charge.amount_refunded / 100;
  const fullRefund = charge.refunded && refundedAmount >= order.totals.total;

  await markOrderRefunded(order.orderNumber, refundedAmount, fullRefund);
}

export async function verifyPaymentIntentStatus(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent.Status | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return intent.status;
}
