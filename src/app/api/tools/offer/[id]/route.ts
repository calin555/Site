import { NextResponse } from "next/server";
import { getQuote, generateOfferHtml } from "@/lib/services/quote.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const quote = getQuote(id);

  if (!quote) {
    return NextResponse.json({ error: "Oferta nu a fost găsită" }, { status: 404 });
  }

  const html = await generateOfferHtml(quote);
  const filename = `oferta-${quote.reference}.html`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
