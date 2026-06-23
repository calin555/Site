import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { confirmPayment } from "@/lib/services/payment.service";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const orderNumber = params.get("order");

  if (!orderNumber) {
    return NextResponse.redirect(new URL("/cos", request.url));
  }

  if (params.get("redirect_status") === "failed") {
    return NextResponse.redirect(
      new URL(`/checkout/cancel?order=${orderNumber}`, request.url)
    );
  }

  const result = await confirmPayment({
    orderNumber,
    paymentIntentId: params.get("payment_intent") ?? undefined,
    mock: params.get("mock") === "1",
  });

  if (result.confirmed) {
    revalidatePath("/cos");
    revalidatePath("/checkout");
    revalidatePath("/", "layout");
  }

  const successUrl = new URL(`/checkout/success`, request.url);
  successUrl.searchParams.set("order", orderNumber);
  if (params.get("mock") === "1" && result.confirmed) {
    successUrl.searchParams.set("demo", "1");
  }
  if (!result.confirmed) {
    successUrl.searchParams.set("error", "1");
  }

  return NextResponse.redirect(successUrl);
}
