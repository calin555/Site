import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryEditorForm } from "@/components/admin/CategoryEditorForm";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Categorie nouă — Admin",
};

export default async function AdminCategoryNewPage() {
  const ctx = await requirePermission(PERMISSIONS.PRODUCTS_WRITE);

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Categorie nouă"
      description="Adaugă o categorie în catalog (ex. baterii, panouri solare)"
    >
      <div className="mb-6">
        <Link href="/admin/categorii">
          <Button variant="outline" size="sm">
            Înapoi la categorii
          </Button>
        </Link>
      </div>
      <CategoryEditorForm />
    </AdminShell>
  );
}
