import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getAdminContext } from "@/lib/auth/require-admin";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/config/permissions";
import {
  isCloudStorageEnabled,
  uploadFileToStorage,
  type UploadFolder,
} from "@/lib/supabase/storage";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

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
      { error: "Nu ai permisiunea de a încărca imagini." },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folderRaw = formData.get("folder");
  const folder: UploadFolder =
    folderRaw === "categories" ? "categories" : "products";

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Niciun fișier trimis" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Format invalid. Folosește JPG, PNG, WebP sau GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Fișierul depășește 5 MB." },
      { status: 400 }
    );
  }

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 40);
  const filename = `${Date.now()}-${safeName || "imagine"}.${ext}`;

  const bytes = Buffer.from(await file.arrayBuffer());

  try {
    if (isCloudStorageEnabled()) {
      const url = await uploadFileToStorage({
        folder,
        filename,
        bytes,
        contentType: file.type,
      });
      return NextResponse.json({ success: true, url });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);

    const url = `/uploads/${folder}/${filename}`;
    return NextResponse.json({ success: true, url });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Încărcarea imaginii a eșuat.",
      },
      { status: 500 }
    );
  }
}
