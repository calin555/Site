import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { listAdminBrands } from "@/lib/services/admin/admin.service";

export const metadata: Metadata = {
  title: "Branduri — Admin",
};

export default async function AdminBrandsPage() {
  const ctx = await requirePermission(PERMISSIONS.PRODUCTS_READ);
  const brands = await listAdminBrands();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Branduri"
      description={`${brands.length} branduri partenere`}
    >
      <DataTable
        data={brands}
        keyField="id"
        columns={[
          {
            key: "logo",
            header: "Logo",
            render: (b) => (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-xs font-bold text-brand-700">
                {b.logo}
              </span>
            ),
          },
          { key: "name", header: "Nume" },
          { key: "slug", header: "Slug" },
          {
            key: "productCount",
            header: "Produse",
            className: "text-center",
          },
        ]}
      />
    </AdminShell>
  );
}
