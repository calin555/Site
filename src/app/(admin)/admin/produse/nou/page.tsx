import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductEditorForm } from "@/components/admin/ProductEditorForm";
import { getCategoriesForSelect } from "@/lib/services/category.service";
import { brands } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Produs nou — Admin",
};

export default async function AdminProductNewPage() {
  const ctx = await requirePermission(PERMISSIONS.PRODUCTS_WRITE);

  const categories = await getCategoriesForSelect();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Produs nou"
      description="Adaugă un produs în catalog"
    >
      <div className="max-w-3xl">
        <ProductEditorForm categories={categories} brands={brands} />
      </div>
    </AdminShell>
  );
}
