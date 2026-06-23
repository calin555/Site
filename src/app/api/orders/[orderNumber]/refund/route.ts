import { NextRequest, NextResponse } from "next/server";
import { refundOrder } from "@/lib/services/refund.service";

export const runtime = "nodejs";

interface RefundRequestBody {
  amount?: number;
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const apiSecret = process.env.REFUND_API_SECRET;
  if (!apiSecret) {
    return NextResponse.json(
      { error: "Refund API not configured" },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${apiSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderNumber } = await params;
  let body: RefundRequestBody = {};

  try {
    const text = await request.text();
    if (text) body = JSON.parse(text) as RefundRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await refundOrder({
    orderNumber,
    amount: body.amount,
    reason: body.reason,
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error, status: result.status },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    refundId: result.refundId,
    amount: result.amount,
    orderNumber: result.orderNumber,
    status: result.status,
  });
}
