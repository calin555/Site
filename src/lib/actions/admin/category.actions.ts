"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { createCategory, updateCategory } from "@/lib/services/category.service";

const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, "Numele este prea scurt"),
  description: z.string().min(5, "Descrierea este prea scurtă"),
  image: z.string().min(1, "Imaginea este obligatorie"),
});

const createCategorySchema = z.object({
  name: z.string().min(2, "Numele este prea scurt"),
  description: z.string().min(5, "Descrierea este prea scurtă"),
  image: z.string().min(1, "Imaginea este obligatorie"),
});

function revalidateCategoryPaths(slug: string) {
  revalidatePath("/categorii");
  revalidatePath("/");
  revalidatePath("/admin/categorii");
  revalidatePath(`/categorii/${slug}`);
  revalidatePath(`/produse/categorie/${slug}`);
}

export async function saveCategoryAction(
  data: unknown
): Promise<
  | { success: true }
  | { success: false; errors: Record<string, string> }
> {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.map(String).join(".")] = issue.message;
    }
    return { success: false, errors };
  }

  const result = await updateCategory(parsed.data.id, {
    name: parsed.data.name,
    description: parsed.data.description,
    image: parsed.data.image,
  });

  if (!result) {
    return { success: false, errors: { form: "Categoria nu a fost găsită." } };
  }

  revalidateCategoryPaths(result.slug);

  return { success: true };
}

export async function createCategoryAction(
  data: unknown
): Promise<
  | { success: true }
  | { success: false; errors: Record<string, string> }
> {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);

  const parsed = createCategorySchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.map(String).join(".")] = issue.message;
    }
    return { success: false, errors };
  }

  const result = await createCategory(parsed.data);

  if (!result) {
    return {
      success: false,
      errors: {
        form: "Nu s-a putut crea categoria. Verifică dacă există deja una cu același nume.",
      },
    };
  }

  revalidateCategoryPaths(result.slug);

  return { success: true };
}
