import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductDeleteButton } from "@/components/admin/ProductDeleteButton";
import { DeleteAllProductsButton } from "@/components/admin/DeleteAllProductsButton";
import { listAdminProducts } from "@/lib/services/admin/admin.service";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Produse — Admin",
};

export default async function AdminProductsPage() {
  const ctx = await requirePermission(PERMISSIONS.PRODUCTS_READ);
  const products = await listAdminProducts();
  const canWrite = ctx.permissions.includes(PERMISSIONS.PRODUCTS_WRITE) ||
    ctx.permissions.includes(PERMISSIONS.ALL);

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Produse"
      description={`${products.length} produse în catalog`}
    >
      {canWrite && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link href="/admin/produse/nou">
            <Button>
              <Plus className="h-4 w-4" />
              Produs nou
            </Button>
          </Link>
          <DeleteAllProductsButton count={products.length} />
        </div>
      )}

      <DataTable
        data={products}
        keyField="id"
        columns={[
          {
            key: "name",
            header: "Produs",
            render: (p) => (
              <div>
                {canWrite ? (
                  <Link
                    href={`/admin/produse/${p.id}`}
                    className="font-medium text-brand-600 hover:underline"
                  >
                    {p.name}
                  </Link>
                ) : (
                  <p className="font-medium text-surface-900">{p.name}</p>
                )}
                <p className="text-xs text-surface-400">{p.slug}</p>
              </div>
            ),
          },
          { key: "brand", header: "Brand" },
          { key: "category", header: "Categorie" },
          {
            key: "price",
            header: "Preț",
            render: (p) => formatPrice(p.price),
          },
          {
            key: "stock",
            header: "Stoc",
            render: (p) => (
              <Badge variant={p.stock <= 5 ? "accent" : "outline"}>
                {p.stock}
              </Badge>
            ),
          },
          {
            key: "flags",
            header: "Flag-uri",
            render: (p) => (
              <div className="flex gap-1">
                {p.isFeatured && <Badge variant="brand">Featured</Badge>}
                {p.isNew && <Badge variant="default">Nou</Badge>}
              </div>
            ),
          },
          {
            key: "actions",
            header: "",
            render: (p) => (
              <div className="flex items-center gap-2">
                <Link
                  href={`/produse/${p.slug}`}
                  className="text-xs font-medium text-brand-600 hover:underline"
                  target="_blank"
                >
                  Vezi
                </Link>
                {canWrite && (
                  <ProductDeleteButton productId={p.id} productName={p.name} />
                )}
              </div>
            ),
          },
        ]}
      />
    </AdminShell>
  );
}
