import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(): void {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env optional if vars are already in environment
  }
}

const BUCKET = "uploads";
const BUCKET_OPTIONS = {
  public: true,
  fileSizeLimit: 5242880,
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
  ],
} as const;

async function main(): Promise<void> {
  loadEnvFile();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Lipsesc NEXT_PUBLIC_SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY în .env"
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();
  if (listError) {
    console.error("Nu pot lista bucket-urile:", listError.message);
    process.exit(1);
  }

  const existing = buckets?.find((b) => b.id === BUCKET || b.name === BUCKET);

  if (existing) {
    const { error: updateError } = await supabase.storage.updateBucket(
      BUCKET,
      BUCKET_OPTIONS
    );
    if (updateError) {
      console.error("Bucket există, dar update a eșuat:", updateError.message);
      process.exit(1);
    }
    console.log(`Bucket "${BUCKET}" există — setări actualizate (public).`);
  } else {
    const { error: createError } = await supabase.storage.createBucket(
      BUCKET,
      BUCKET_OPTIONS
    );
    if (createError) {
      if (createError.message.includes("row-level security")) {
        console.error(`
Crearea bucket-ului a eșuat: cheia SUPABASE_SERVICE_ROLE_KEY pare greșită (anon în loc de service_role).

Pași manuali (2 minute):
1. Supabase Dashboard → Storage → New bucket
2. Nume: uploads
3. Public bucket: ON → Save

Apoi în Vercel → Environment Variables:
- SUPABASE_SERVICE_ROLE_KEY = cheia "service_role" din Supabase → Settings → API (secretă, NU publishable)
`);
        process.exit(1);
      }
      console.error("Crearea bucket-ului a eșuat:", createError.message);
      process.exit(1);
    }
    console.log(`Bucket "${BUCKET}" creat cu succes (public).`);
  }

  console.log(
    "Gata. Reîncearcă upload-ul din admin (local sau Vercel live)."
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
