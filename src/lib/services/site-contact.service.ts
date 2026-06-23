import {
  dbGetSiteContactSettings,
  dbUpsertSiteContactSettings,
} from "@/lib/db/site-contact.repository";
import { isDatabaseEnabled } from "@/lib/db/config";
import {
  DEFAULT_SITE_CONTACT,
  type SiteContactSettings,
} from "@/types/site-contact";

export async function getSiteContactSettings(): Promise<SiteContactSettings> {
  const fromDb = await dbGetSiteContactSettings();
  return fromDb ?? DEFAULT_SITE_CONTACT;
}

export async function saveSiteContactSettings(
  data: SiteContactSettings
): Promise<SiteContactSettings | null> {
  if (!isDatabaseEnabled()) return null;
  return dbUpsertSiteContactSettings(data);
}
