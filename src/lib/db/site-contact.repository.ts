import { getSupabase } from "@/lib/supabase/server";
import { isDatabaseEnabled } from "@/lib/db/config";
import type { SiteContactSettings } from "@/types/site-contact";

const SETTINGS_ID = "default";

function mapRow(row: {
  sectionTitle: string;
  phoneOrdersLabel: string;
  phoneOrders: string;
  phoneTechnicalLabel: string;
  phoneTechnical: string;
  email: string;
  address: string;
  hours: string;
  headerTagline: string;
}): SiteContactSettings {
  return {
    sectionTitle: row.sectionTitle,
    phoneOrdersLabel: row.phoneOrdersLabel,
    phoneOrders: row.phoneOrders,
    phoneTechnicalLabel: row.phoneTechnicalLabel,
    phoneTechnical: row.phoneTechnical,
    email: row.email,
    address: row.address,
    hours: row.hours,
    headerTagline: row.headerTagline,
  };
}

export async function dbGetSiteContactSettings(): Promise<SiteContactSettings | null> {
  if (!isDatabaseEnabled()) return null;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("site_contact_settings")
    .select(
      "sectionTitle, phoneOrdersLabel, phoneOrders, phoneTechnicalLabel, phoneTechnical, email, address, hours, headerTagline"
    )
    .eq("id", SETTINGS_ID)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function dbUpsertSiteContactSettings(
  data: SiteContactSettings
): Promise<SiteContactSettings> {
  const supabase = getSupabase();
  const now = new Date().toISOString();

  const { data: row, error } = await supabase
    .from("site_contact_settings")
    .upsert(
      {
        id: SETTINGS_ID,
        ...data,
        updatedAt: now,
      },
      { onConflict: "id" }
    )
    .select(
      "sectionTitle, phoneOrdersLabel, phoneOrders, phoneTechnicalLabel, phoneTechnical, email, address, hours, headerTagline"
    )
    .single();

  if (error) throw error;
  return mapRow(row);
}
