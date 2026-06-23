import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { listAdminCustomers } from "@/lib/services/admin/admin.service";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Clienți — Admin",
};

export default async function AdminCustomersPage() {
  const ctx = await requirePermission(PERMISSIONS.CUSTOMERS_READ);
  const customers = await listAdminCustomers();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Clienți"
      description={`${customers.length} clienți înregistrați`}
    >
      <DataTable
        data={customers}
        keyField="id"
        columns={[
          { key: "name", header: "Nume" },
          { key: "email", header: "Email" },
          {
            key: "phone",
            header: "Telefon",
            render: (c) => c.phone ?? "—",
          },
          {
            key: "roleSlug",
            header: "Rol",
            render: () => <Badge variant="outline">customer</Badge>,
          },
          {
            key: "createdAt",
            header: "Înregistrat",
            render: (c) => formatDate(c.createdAt),
          },
        ]}
      />
    </AdminShell>
  );
}
