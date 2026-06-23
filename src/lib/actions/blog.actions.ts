"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { upsertArticle } from "@/lib/services/blog.service";

const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Titlul este prea scurt"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug invalid (doar litere mici, cifre, cratimă)"),
  excerpt: z.string().min(20, "Extrasul este prea scurt"),
  content: z.string().min(50, "Conținutul este prea scurt"),
  coverImage: z.string().optional(),
  categoryId: z.string().min(1),
  tagIds: z.array(z.string()).optional(),
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  isPublished: z.boolean().optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
});

export async function saveBlogArticleAction(
  data: unknown
): Promise<
  | { success: true; id: string }
  | { success: false; errors: Record<string, string> }
> {
  await requirePermission(PERMISSIONS.CONTENT_WRITE);

  const parsed = articleSchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.map(String).join(".")] = issue.message;
    }
    return { success: false, errors };
  }

  const article = upsertArticle({
    ...parsed.data,
    coverImage: parsed.data.coverImage || "",
    author: parsed.data.author || "Echipa ChargePro",
    tagIds: parsed.data.tagIds ?? [],
    seo: parsed.data.seo ?? {},
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath(`/blog/${article.slug}`);

  return { success: true, id: article.id };
}

export async function deleteBlogArticleAction(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_WRITE);
  const { deleteArticle } = await import("@/lib/services/blog.service");
  deleteArticle(id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { success: true };
}
