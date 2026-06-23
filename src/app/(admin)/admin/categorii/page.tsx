import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { listAdminCategories } from "@/lib/services/admin/admin.service";
import { isExternalImageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Categorii — Admin",
};

export default async function AdminCategoriesPage() {
  const ctx = await requirePermission(PERMISSIONS.PRODUCTS_READ);
  const categories = await listAdminCategories();
  const canWrite =
    ctx.permissions.includes(PERMISSIONS.PRODUCTS_WRITE) ||
    ctx.permissions.includes(PERMISSIONS.ALL);

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Categorii"
      description={`${categories.length} categorii`}
    >
      {canWrite && (
        <div className="mb-6">
          <Link href="/admin/categorii/nou">
            <Button>
              <Plus className="h-4 w-4" />
              Categorie nouă
            </Button>
          </Link>
        </div>
      )}
      <DataTable
        data={categories}
        keyField="id"
        columns={[
          {
            key: "image",
            header: "Imagine",
            render: (c) => (
              <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-surface-100">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover"
                    unoptimized={isExternalImageUrl(c.image)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-surface-400">
                    Fără imagine
                  </div>
                )}
              </div>
            ),
          },
          { key: "name", header: "Nume" },
          { key: "slug", header: "Slug" },
          {
            key: "description",
            header: "Descriere",
            render: (c) => (
              <span className="line-clamp-1 max-w-xs text-surface-500">
                {c.description}
              </span>
            ),
          },
          {
            key: "productCount",
            header: "Produse",
            className: "text-center",
          },
          {
            key: "actions",
            header: "",
            render: (c) =>
              canWrite ? (
                <Link href={`/admin/categorii/${c.id}`}>
                  <Button size="sm" variant="outline">
                    <Pencil className="h-3.5 w-3.5" />
                    Editează
                  </Button>
                </Link>
              ) : null,
          },
        ]}
      />
    </AdminShell>
  );
}
