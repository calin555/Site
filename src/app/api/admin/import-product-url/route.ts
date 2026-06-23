import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminContext } from "@/lib/auth/require-admin";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/config/permissions";
import { importProductFromUrl } from "@/lib/import/product-url-import";

const bodySchema = z.object({
  url: z.string().url("URL invalid"),
});

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
      { error: "Nu ai permisiunea de a importa produse." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "URL invalid" },
      { status: 400 }
    );
  }

  try {
    const data = await importProductFromUrl(parsed.data.url);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Import eșuat. Încearcă din nou sau completează manual.",
      },
      { status: 422 }
    );
  }
}
