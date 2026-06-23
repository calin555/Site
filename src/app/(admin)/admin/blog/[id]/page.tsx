import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditorForm } from "@/components/blog/BlogEditorForm";
import {
  getArticleById,
  getBlogCategories,
  getBlogTags,
} from "@/lib/services/blog.service";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleById(id);
  return { title: article ? `Edit: ${article.title}` : "Articol — Admin" };
}

export default async function AdminBlogEditPage({ params }: Props) {
  const { id } = await params;
  const ctx = await requirePermission(PERMISSIONS.CONTENT_WRITE);
  const article = getArticleById(id);
  if (!article) notFound();

  const categories = getBlogCategories();
  const tags = getBlogTags();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Editează articol"
      description={article.title}
    >
      <Link
        href="/admin/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Înapoi la listă
      </Link>
      <div className="max-w-4xl">
        <BlogEditorForm
          article={article}
          categories={categories}
          tags={tags}
        />
      </div>
    </AdminShell>
  );
}
