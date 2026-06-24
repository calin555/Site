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

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function extensionForType(type: string): string {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "video/mp4":
      return "mp4";
    case "video/webm":
      return "webm";
    case "video/quicktime":
      return "mov";
    default:
      return "bin";
  }
}

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
      { error: "Nu ai permisiunea de a încărca fișiere." },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folderRaw = formData.get("folder");
  const mediaTypeRaw = formData.get("mediaType");
  const isVideoRequest = mediaTypeRaw === "video";

  const folder: UploadFolder =
    folderRaw === "categories"
      ? "categories"
      : isVideoRequest
        ? "products/videos"
        : "products";

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Niciun fișier trimis" }, { status: 400 });
  }

  const isVideo = VIDEO_TYPES.has(file.type);
  const isImage = IMAGE_TYPES.has(file.type);

  if (isVideoRequest && !isVideo) {
    return NextResponse.json(
      { error: "Format video invalid. Folosește MP4, WebM sau MOV." },
      { status: 400 }
    );
  }

  if (!isVideoRequest && !isImage) {
    return NextResponse.json(
      { error: "Format invalid. Folosește JPG, PNG, WebP sau GIF." },
      { status: 400 }
    );
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    return NextResponse.json(
      {
        error: isVideo
          ? "Videoclipul depășește 50 MB."
          : "Fișierul depășește 5 MB.",
      },
      { status: 400 }
    );
  }

  const ext = extensionForType(file.type);
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 40);
  const filename = `${Date.now()}-${safeName || (isVideo ? "video" : "imagine")}.${ext}`;

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
            : "Încărcarea fișierului a eșuat.",
      },
      { status: 500 }
    );
  }
}
