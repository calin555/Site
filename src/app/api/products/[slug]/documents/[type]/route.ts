import { NextRequest, NextResponse } from "next/server";
import { getProductDetail } from "@/lib/services/product.service";
import {
  DOCUMENT_FILENAMES,
  generateProductDocumentPdf,
  type ProductDocumentType,
} from "@/lib/documents/generate-product-documents";

export const runtime = "nodejs";

const VALID_TYPES = new Set<ProductDocumentType>([
  "datasheet",
  "manual",
  "certificate",
]);

interface RouteParams {
  params: Promise<{ slug: string; type: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { slug, type } = await params;

  if (!VALID_TYPES.has(type as ProductDocumentType)) {
    return NextResponse.json({ error: "Tip document invalid" }, { status: 400 });
  }

  const product = await getProductDetail(slug);
  if (!product) {
    return NextResponse.json({ error: "Produs negăsit" }, { status: 404 });
  }

  if (type === "certificate" && product.categorySlug === "accesorii") {
    return NextResponse.json(
      { error: "Certificatul CE nu este disponibil pentru accesorii" },
      { status: 404 }
    );
  }

  try {
    const pdfBytes = await generateProductDocumentPdf(
      type as ProductDocumentType,
      product
    );
    const filename = `${DOCUMENT_FILENAMES[type as ProductDocumentType]}-${slug}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Eroare necunoscută";
    console.error("PDF generation failed:", message, err);
    return NextResponse.json(
      { error: "Generarea PDF a eșuat. Încearcă din nou.", detail: message },
      { status: 500 }
    );
  }
}
