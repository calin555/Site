import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { ReviewActions } from "@/components/admin/ReviewActions";
import { listAdminReviews } from "@/lib/services/admin/admin.service";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const STATUS_VARIANT = {
  PENDING: "accent" as const,
  APPROVED: "brand" as const,
  REJECTED: "outline" as const,
};

const STATUS_LABEL = {
  PENDING: "În așteptare",
  APPROVED: "Aprobată",
  REJECTED: "Respinsă",
};

export const metadata: Metadata = {
  title: "Recenzii — Admin",
};

export default async function AdminReviewsPage() {
  const ctx = await requirePermission(PERMISSIONS.REVIEWS_MODERATE);
  const reviews = listAdminReviews();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Recenzii"
      description={`${reviews.filter((r) => r.status === "PENDING").length} în așteptare`}
    >
      <DataTable
        data={reviews}
        keyField="id"
        columns={[
          { key: "productName", header: "Produs" },
          { key: "author", header: "Autor" },
          {
            key: "rating",
            header: "Rating",
            render: (r) => (
              <span className="font-semibold text-amber-600">
                {"★".repeat(r.rating)}
              </span>
            ),
          },
          {
            key: "content",
            header: "Comentariu",
            render: (r) => (
              <span className="line-clamp-2 max-w-xs text-surface-500">
                {r.content}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => (
              <Badge variant={STATUS_VARIANT[r.status]}>
                {STATUS_LABEL[r.status]}
              </Badge>
            ),
          },
          {
            key: "createdAt",
            header: "Data",
            render: (r) => formatDate(r.createdAt),
          },
          {
            key: "actions",
            header: "Acțiuni",
            render: (r) =>
              r.status === "PENDING" ? (
                <ReviewActions reviewId={r.id} />
              ) : (
                <span className="text-xs text-surface-400">—</span>
              ),
          },
        ]}
      />
    </AdminShell>
  );
}
