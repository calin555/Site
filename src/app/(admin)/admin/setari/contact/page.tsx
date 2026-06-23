import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { ContactSettingsForm } from "@/components/admin/ContactSettingsForm";
import { getSiteContactSettings } from "@/lib/services/site-contact.service";

export const metadata: Metadata = {
  title: "Setări contact — Admin",
};

export default async function AdminContactSettingsPage() {
  const ctx = await requirePermission(PERMISSIONS.CONTENT_WRITE);
  const settings = await getSiteContactSettings();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Setări contact"
      description="Datele de contact afișate în footer, header și pagina Contact"
    >
      <ContactSettingsForm settings={settings} />
    </AdminShell>
  );
}
