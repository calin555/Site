"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import {
  upsertProduct,
  deleteProduct,
  deleteAllProducts,
} from "@/lib/services/product-admin.service";
import { dedupeImageUrls } from "@/lib/product-images";
import { dedupeVideoUrls } from "@/lib/product-videos";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null || value === undefined ? undefined : value;

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Numele este prea scurt"),
  slug: z.string().optional(),
  shortDescription: z.string().min(5, "Descrierea scurtă este prea scurtă"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Prețul trebuie să fie mai mare decât 0"),
  compareAtPrice: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number()
      .positive("Prețul vechi trebuie să fie mai mare decât 0")
      .optional()
  ),
  image: z.string().min(1).optional(),
  images: z.array(z.string().min(1)).min(1, "Adaugă cel puțin o imagine").optional(),
  categorySlug: z.string().min(1),
  brandSlug: z.string().min(1),
  powerKw: z.coerce.number().positive("Puterea (kW) trebuie să fie mai mare decât 0"),
  phases: z.enum(["SINGLE", "THREE"]),
  connectorTypes: z.array(z.string()).default([]),
  stock: z.coerce.number().min(0, "Stocul nu poate fi negativ"),
  stockStatus: z.enum(["IN_STOCK", "MANUFACTURER", "PREORDER"]).default("IN_STOCK"),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  catalogPdfUrl: z.string().optional(),
  videos: z.array(z.string().min(1)).optional(),
}).transform((data) => ({
  ...data,
  images: dedupeImageUrls(
    data.images?.length
      ? data.images
      : data.image
        ? [data.image]
        : []
  ),
  videos: dedupeVideoUrls(data.videos ?? []),
})).refine((data) => data.images.length > 0, {
  message: "Adaugă cel puțin o imagine",
  path: ["images"],
});

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "";
}

function formatProductSaveError(err: unknown): string {
  const message = errorMessage(err);

  if (message.includes("product_price_positive")) {
    return "Prețul trebuie să fie mai mare decât 0.";
  }
  if (message.includes("product_power_positive")) {
    return "Puterea (kW) trebuie să fie mai mare decât 0.";
  }
  if (message.includes("product_compare_price_positive")) {
    return "Prețul vechi trebuie să fie mai mare decât 0.";
  }
  if (message.includes("Unique constraint") || message.includes("products_slug_key")) {
    return "Un produs cu acest slug există deja.";
  }
  if (message.includes("products_sku_key")) {
    return "SKU duplicat — reîncearcă salvarea.";
  }
  if (message.includes("JWT") || message.includes("Invalid API key")) {
    return "Cheie Supabase invalidă pe server. Verifică SUPABASE_SERVICE_ROLE_KEY în Vercel.";
  }
  if (message.includes("row-level security") || message.includes("RLS")) {
    return "Acces refuzat la baza de date. Folosește SUPABASE_SERVICE_ROLE_KEY (service_role), nu cheia publică.";
  }

  return message || "Eroare la salvare";
}

export async function saveProductAction(
  data: unknown
): Promise<
  | { success: true; id: string }
  | { success: false; errors: Record<string, string> }
> {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.map(String).join(".")] = issue.message;
    }
    return { success: false, errors };
  }

  try {
    const product = await upsertProduct(parsed.data);
    revalidatePath("/produse");
    revalidatePath("/admin/produse");
    revalidatePath(`/produse/${product.slug}`);
    return { success: true, id: product.id };
  } catch (err) {
    return {
      success: false,
      errors: { form: formatProductSaveError(err) },
    };
  }
}

export async function deleteProductAction(id: string) {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);
  await deleteProduct(id);
  revalidatePath("/produse");
  revalidatePath("/admin/produse");
  return { success: true };
}

export async function deleteAllProductsAction() {
  await requirePermission(PERMISSIONS.PRODUCTS_WRITE);
  const count = await deleteAllProducts();
  revalidatePath("/produse");
  revalidatePath("/admin/produse");
  return { success: true, count };
}
