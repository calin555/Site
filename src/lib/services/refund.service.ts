import { getStripe } from "@/lib/services/payment.service";
import {
  getOrderByNumber,
  markOrderRefunded,
} from "@/lib/services/order.service";

export interface RefundResult {
  success: boolean;
  refundId?: string;
  amount?: number;
  orderNumber: string;
  status: string;
  error?: string;
}

export async function refundOrder(params: {
  orderNumber: string;
  amount?: number;
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
}): Promise<RefundResult> {
  const { orderNumber, amount, reason = "requested_by_customer" } = params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    return {
      success: false,
      orderNumber,
      status: "UNKNOWN",
      error: "Comanda nu a fost găsită.",
    };
  }

  if (order.status !== "PAID" && order.status !== "PROCESSING") {
    return {
      success: false,
      orderNumber,
      status: order.status,
      error: `Rambursarea nu este permisă pentru statusul „${order.status}".`,
    };
  }

  if (!order.stripePaymentIntentId) {
    if (order.status === "PAID") {
      const refundTotal = amount ?? order.totals.total;
      const fullRefund = refundTotal >= order.totals.total;
      await markOrderRefunded(orderNumber, refundTotal, fullRefund);
      return {
        success: true,
        orderNumber,
        amount: refundTotal,
        status: fullRefund ? "REFUNDED" : order.status,
      };
    }
    return {
      success: false,
      orderNumber,
      status: order.status,
      error: "Comanda nu are un PaymentIntent Stripe asociat.",
    };
  }

  const stripe = getStripe();
  if (!stripe) {
    return {
      success: false,
      orderNumber,
      status: order.status,
      error: "Stripe nu este configurat.",
    };
  }

  const remaining = order.totals.total - order.refundedAmount;
  if (remaining <= 0) {
    return {
      success: false,
      orderNumber,
      status: order.status,
      error: "Comanda a fost deja rambursată integral.",
    };
  }

  const refundAmount = amount ?? remaining;
  if (refundAmount > remaining) {
    return {
      success: false,
      orderNumber,
      status: order.status,
      error: `Suma maximă rambursabilă este ${remaining} RON.`,
    };
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId,
      amount: Math.round(refundAmount * 100),
      reason,
      metadata: { orderNumber },
    });

    const newRefundedTotal = order.refundedAmount + refundAmount;
    const fullRefund = newRefundedTotal >= order.totals.total;
    await markOrderRefunded(orderNumber, newRefundedTotal, fullRefund);

    return {
      success: true,
      refundId: refund.id,
      amount: refundAmount,
      orderNumber,
      status: fullRefund ? "REFUNDED" : order.status,
    };
  } catch (error) {
    return {
      success: false,
      orderNumber,
      status: order.status,
      error: error instanceof Error ? error.message : "Rambursarea a eșuat.",
    };
  }
}
