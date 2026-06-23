import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductEditorForm } from "@/components/admin/ProductEditorForm";
import { getCategoriesForSelect } from "@/lib/services/category.service";
import { brands } from "@/lib/mock-data";
import { getProductForAdmin } from "@/lib/services/product-admin.service";

interface AdminProductEditPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminProductEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductForAdmin(id);
  return { title: product ? `Editează ${product.name}` : "Produs — Admin" };
}

export default async function AdminProductEditPage({
  params,
}: AdminProductEditPageProps) {
  const ctx = await requirePermission(PERMISSIONS.PRODUCTS_WRITE);
  const { id } = await params;
  const product = await getProductForAdmin(id);

  if (!product) notFound();

  const categories = await getCategoriesForSelect();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Editează produs"
      description={product.name}
    >
      <div className="max-w-3xl">
        <ProductEditorForm
          product={product}
          categories={categories}
          brands={brands}
        />
      </div>
    </AdminShell>
  );
}
