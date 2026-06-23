import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/services/user.service";
import {
  getOrderByNumber,
  userOwnsOrder,
} from "@/lib/services/order.service";
import {
  canDownloadInvoice,
  generateInvoiceHtml,
} from "@/lib/invoices/generate-invoice";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  const user = await getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "Utilizator negăsit" }, { status: 401 });
  }

  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    return NextResponse.json({ error: "Comanda nu există" }, { status: 404 });
  }

  const owns = await userOwnsOrder(order, user.id, user.email);
  if (!owns) {
    return NextResponse.json({ error: "Acces interzis" }, { status: 403 });
  }

  if (!canDownloadInvoice(order)) {
    return NextResponse.json(
      { error: "Factura nu este disponibilă pentru această comandă" },
      { status: 400 }
    );
  }

  const html = await generateInvoiceHtml(order);
  const filename = `factura-${orderNumber}.html`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
