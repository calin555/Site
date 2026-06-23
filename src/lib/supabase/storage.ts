import { getSupabase } from "@/lib/supabase/server";
import { isDatabaseEnabled } from "@/lib/db/config";

const BUCKET = "uploads";

export type UploadFolder = "products" | "categories" | "catalogs";

export function isCloudStorageEnabled(): boolean {
  return (
    isDatabaseEnabled() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

export async function uploadFileToStorage(params: {
  folder: UploadFolder;
  filename: string;
  bytes: Buffer;
  contentType: string;
}): Promise<string> {
  const supabase = getSupabase();
  const objectPath = `${params.folder}/${params.filename}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, params.bytes, {
      contentType: params.contentType,
      upsert: true,
    });

  if (error) {
    const hint =
      error.message.includes("row-level security") ||
      error.message.includes("Bucket not found")
        ? ' Verifică SUPABASE_SERVICE_ROLE_KEY (cheia service_role, nu anon). Bucket-ul poate fi creat manual în Supabase → Storage → New bucket → "uploads" (public).'
        : "";
    throw new Error(
      error.message.includes("Bucket not found")
        ? `Bucket-ul "${BUCKET}" lipsește în Supabase.${hint}`
        : `${error.message}${hint}`
    );
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}
