import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const globalForSupabase = globalThis as unknown as {
  supabase: SupabaseClient | undefined;
};

function createServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("[PROJECT_REF]")) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSupabase(): SupabaseClient {
  const client = globalForSupabase.supabase ?? createServerClient();
  if (!client) {
    throw new Error(
      "Supabase nu este configurat. Setează NEXT_PUBLIC_SUPABASE_URL și SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  if (process.env.NODE_ENV !== "production") {
    globalForSupabase.supabase = client;
  }

  return client;
}

export function tryGetSupabase(): SupabaseClient | null {
  try {
    return getSupabase();
  } catch {
    return null;
  }
}
