import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getAllArticles } from "@/lib/services/blog.service";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog — Admin",
};

export default async function AdminBlogPage() {
  const ctx = await requirePermission(PERMISSIONS.CONTENT_WRITE);
  const posts = getAllArticles();

  return (
    <AdminShell
      userName={ctx.user.name}
      roleSlug={ctx.roleSlug}
      permissions={ctx.permissions}
      title="Blog"
      description={`${posts.length} articole`}
    >
      <div className="mb-6">
        <Link href="/admin/blog/nou">
          <Button>
            <Plus className="h-4 w-4" />
            Articol nou
          </Button>
        </Link>
      </div>

      <DataTable
        data={posts}
        keyField="id"
        columns={[
          {
            key: "title",
            header: "Titlu",
            render: (p) => (
              <div>
                <Link
                  href={`/admin/blog/${p.id}`}
                  className="font-medium text-brand-600 hover:underline"
                >
                  {p.title}
                </Link>
                <p className="text-xs text-surface-400">{p.slug}</p>
              </div>
            ),
          },
          {
            key: "category",
            header: "Categorie",
            render: (p) => p.category.name,
          },
          {
            key: "tags",
            header: "Tag-uri",
            render: (p) => (
              <div className="flex flex-wrap gap-1">
                {p.tags.slice(0, 2).map((t) => (
                  <Badge key={t.id} variant="outline">
                    {t.name}
                  </Badge>
                ))}
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (p) => (
              <Badge variant={p.isPublished ? "brand" : "outline"}>
                {p.isPublished ? "Publicat" : "Draft"}
              </Badge>
            ),
          },
          {
            key: "publishedAt",
            header: "Data",
            render: (p) => formatDate(p.publishedAt),
          },
          {
            key: "actions",
            header: "",
            render: (p) =>
              p.isPublished ? (
                <Link
                  href={`/blog/${p.slug}`}
                  target="_blank"
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  Vezi
                </Link>
              ) : null,
          },
        ]}
      />
    </AdminShell>
  );
}
