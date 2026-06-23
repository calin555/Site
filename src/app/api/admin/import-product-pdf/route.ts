import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getAdminContext } from "@/lib/auth/require-admin";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/config/permissions";
import { importDescriptionFromPdf } from "@/lib/import/pdf-catalog-import";
import {
  isCloudStorageEnabled,
  uploadFileToStorage,
} from "@/lib/supabase/storage";

const MAX_SIZE = 20 * 1024 * 1024;

export async function POST(request: Request) {
  const ctx = await getAdminContext();
  if (!ctx) {
    return NextResponse.json(
      { error: "Trebuie să fii autentificat ca admin." },
      { status: 401 }
    );
  }
  if (!hasPermission(ctx.permissions, PERMISSIONS.PRODUCTS_WRITE)) {
    return NextResponse.json(
      { error: "Nu ai permisiunea de a importa cataloage." },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const productName = String(formData.get("productName") ?? "").trim();

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Niciun PDF trimis." }, { status: 400 });
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json(
      { error: "Fișierul trebuie să fie PDF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "PDF-ul depășește 20 MB." },
      { status: 400 }
    );
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const imported = await importDescriptionFromPdf({
      buffer: bytes,
      productName: productName || undefined,
    });

    const safeName = file.name
      .replace(/\.pdf$/i, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 40);
    const filename = `${Date.now()}-${safeName || "catalog"}.pdf`;
    let catalogPdfUrl: string;

    if (isCloudStorageEnabled()) {
      catalogPdfUrl = await uploadFileToStorage({
        folder: "catalogs",
        filename,
        bytes: Buffer.from(bytes),
        contentType: "application/pdf",
      });
    } else {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "catalogs");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));
      catalogPdfUrl = `/uploads/catalogs/${filename}`;
    }

    return NextResponse.json({
      success: true,
      data: {
        catalogPdfUrl,
        description: imported.description,
        shortDescription: imported.shortDescription,
        descriptionEn: imported.descriptionEn,
        warning: imported.warning,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Importul din PDF a eșuat. Încearcă din nou.",
      },
      { status: 422 }
    );
  }
}
