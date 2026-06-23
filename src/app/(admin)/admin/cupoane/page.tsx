import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { listAdminCoupons } from "@/lib/services/admin/admin.service";
import { Badge } from "@/components/ui/Badge";

const TYPE_LABELS = {
  PERCENTAGE: "Procent",
  FIXED_AMOUNT: "Sumă fixă",
  FREE_SHIPPING: "Transport gratuit",
};

export const metadata: Metadata = {
  title: "Cupoane — Admin",
};

export default async function AdminCouponsPage() {
  const ctx = await requirePermission(PERMISSIONS.COUPONS_WRITE);
  const coupons = listAdminCoupons();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Cupoane reducere"
      description={`${coupons.length} cupoane active`}
    >
      <DataTable
        data={coupons}
        keyField="code"
        columns={[
          {
            key: "code",
            header: "Cod",
            render: (c) => (
              <span className="font-mono font-bold text-surface-900">
                {c.code}
              </span>
            ),
          },
          { key: "label", header: "Descriere" },
          {
            key: "type",
            header: "Tip",
            render: (c) => (
              <Badge variant="outline">{TYPE_LABELS[c.type]}</Badge>
            ),
          },
          {
            key: "value",
            header: "Valoare",
            render: (c) =>
              c.type === "PERCENTAGE"
                ? `${c.value}%`
                : c.type === "FIXED_AMOUNT"
                  ? `${c.value} RON`
                  : "—",
          },
          {
            key: "minOrderAmount",
            header: "Min. comandă",
            render: (c) =>
              c.minOrderAmount ? `${c.minOrderAmount} RON` : "—",
          },
          {
            key: "maxDiscount",
            header: "Max. reducere",
            render: (c) =>
              c.maxDiscount ? `${c.maxDiscount} RON` : "—",
          },
        ]}
      />
    </AdminShell>
  );
}
