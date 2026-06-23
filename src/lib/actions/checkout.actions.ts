"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkoutFormSchema } from "@/lib/validators/checkout";
import { createCheckoutPayment, confirmPayment } from "@/lib/services/payment.service";
import { getCartSummary } from "@/lib/services/cart.service";
import { getOrderByNumber } from "@/lib/services/order.service";
import type { OrderRecord } from "@/types/order";

export async function initiateCheckoutAction(
  formData: unknown
): Promise<
  | { success: true; orderNumber: string; clientSecret: string | null; mockPayment: boolean }
  | { success: false; errors: Record<string, string> }
> {
  const summary = await getCartSummary();
  if (summary.items.length === 0) {
    return { success: false, errors: { _form: "Coșul este gol." } };
  }

  const parsed = checkoutFormSchema.safeParse(formData);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      errors[path] = issue.message;
    }
    return { success: false, errors };
  }

  try {
    const result = await createCheckoutPayment(parsed.data);
    return {
      success: true,
      orderNumber: result.orderNumber,
      clientSecret: result.clientSecret,
      mockPayment: result.mockPayment,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        _form:
          error instanceof Error ? error.message : "Eroare la procesare.",
      },
    };
  }
}

export async function confirmCheckoutAction(params: {
  orderNumber: string;
  paymentIntentId?: string;
  mock?: boolean;
}): Promise<{
  confirmed: boolean;
  order: OrderRecord | null;
  error?: string;
}> {
  const result = await confirmPayment(params);

  if (result.confirmed) {
    revalidatePath("/cos");
    revalidatePath("/checkout");
    revalidatePath("/", "layout");
  }

  const order = await getOrderByNumber(params.orderNumber);

  return {
    confirmed: result.confirmed,
    order,
    error: result.error,
  };
}

export async function getOrderAction(
  orderNumber: string
): Promise<OrderRecord | null> {
  return getOrderByNumber(orderNumber);
}

export async function redirectToCheckoutSuccess(orderNumber: string) {
  redirect(`/checkout/success?order=${orderNumber}`);
}
