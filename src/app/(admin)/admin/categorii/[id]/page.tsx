import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryEditorForm } from "@/components/admin/CategoryEditorForm";
import { getCategoryForAdmin } from "@/lib/services/category.service";
import { Button } from "@/components/ui/Button";

interface AdminCategoryEditPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminCategoryEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryForAdmin(id);
  return {
    title: category ? `${category.name} — Categorii Admin` : "Categorie — Admin",
  };
}

export default async function AdminCategoryEditPage({
  params,
}: AdminCategoryEditPageProps) {
  const ctx = await requirePermission(PERMISSIONS.PRODUCTS_WRITE);
  const { id } = await params;
  const category = await getCategoryForAdmin(id);

  if (!category) notFound();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title={`Editează: ${category.name}`}
      description="Actualizează descrierea și imaginea categoriei"
    >
      <div className="mb-6">
        <Link href="/admin/categorii">
          <Button variant="outline" size="sm">
            Înapoi la categorii
          </Button>
        </Link>
      </div>
      <CategoryEditorForm category={category} />
    </AdminShell>
  );
}
