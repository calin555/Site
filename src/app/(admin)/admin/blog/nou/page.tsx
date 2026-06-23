import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditorForm } from "@/components/blog/BlogEditorForm";
import {
  getBlogCategories,
  getBlogTags,
} from "@/lib/services/blog.service";

export const metadata: Metadata = {
  title: "Articol nou — Admin Blog",
};

export default async function AdminBlogNewPage() {
  const ctx = await requirePermission(PERMISSIONS.CONTENT_WRITE);
  const categories = getBlogCategories();
  const tags = getBlogTags();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Articol nou"
      description="Creează un articol de blog"
    >
      <div className="max-w-4xl">
        <BlogEditorForm categories={categories} tags={tags} />
      </div>
    </AdminShell>
  );
}
