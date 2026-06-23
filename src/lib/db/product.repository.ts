import { getSupabase } from "@/lib/supabase/server";
import { isDatabaseEnabled } from "@/lib/db/config";
import {
  connectorsToDb,
  phasesToDb,
  productFromDb,
  skuFromSlug,
} from "@/lib/db/product.mapper";
import type { ProductWithRelations } from "@/types/database";
import type { CatalogProduct } from "@/types/catalog";
import type { ProductInput } from "@/lib/services/product-admin.service";

const PRODUCT_SELECT = `
  *,
  category:categories!products_categoryId_fkey(name, slug),
  brand:brands!products_brandId_fkey(name, slug),
  images:product_images(*)
`;

function mapProductRow(row: ProductWithRelations): CatalogProduct {
  const images = Array.isArray(row.images) ? row.images : [];
  return productFromDb({ ...row, images });
}

export async function dbFindAllProducts(
  publishedOnly = false
): Promise<CatalogProduct[]> {
  if (!isDatabaseEnabled()) return [];

  const supabase = getSupabase();
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("createdAt", { ascending: false });

  if (publishedOnly) {
    query = query.eq("isPublished", true);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data as ProductWithRelations[]).map(mapProductRow);
}

export async function dbFindProductById(
  id: string
): Promise<CatalogProduct | null> {
  if (!isDatabaseEnabled()) return null;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProductRow(data as ProductWithRelations) : null;
}

export async function dbUpsertProduct(
  input: ProductInput
): Promise<CatalogProduct> {
  const supabase = getSupabase();

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", input.categorySlug)
    .maybeSingle();

  if (categoryError) throw categoryError;
  if (!category) throw new Error("Categorie invalidă");

  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("id")
    .eq("slug", input.brandSlug)
    .maybeSingle();

  if (brandError) throw brandError;
  if (!brand) throw new Error("Brand invalid");

  const slug =
    input.slug?.trim() ||
    input.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const { data: existing } = input.id
    ? await supabase.from("products").select("*").eq("id", input.id).maybeSingle()
    : { data: null };

  const existingSmart =
    (existing?.smartFeatures as Record<string, unknown> | null) ?? {};

  const features: Record<string, unknown> = {
    ...existingSmart,
    isNew: input.isNew ?? false,
  };

  if (input.catalogPdfUrl !== undefined) {
    if (input.catalogPdfUrl.trim()) {
      features.catalogPdfUrl = input.catalogPdfUrl.trim();
    } else {
      delete features.catalogPdfUrl;
    }
  }

  const now = new Date().toISOString();
  const productData = {
    name: input.name.trim(),
    slug,
    shortDescription: input.shortDescription.trim(),
    description: input.description?.trim() || input.shortDescription.trim(),
    sku: existing?.sku ?? skuFromSlug(slug),
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    stock: input.stock,
    categoryId: category.id,
    brandId: brand.id,
    powerKw: input.powerKw,
    phases: phasesToDb(input.phases),
    connectorTypes: connectorsToDb(input.connectorTypes),
    isFeatured: input.isFeatured ?? false,
    isPublished: true,
    smartFeatures: features,
    updatedAt: now,
  };

  let productId: string;

  if (existing) {
    const { data: updated, error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", existing.id)
      .select("id, images:product_images(*)")
      .single();

    if (error) throw error;
    productId = updated.id;

    const images = updated.images ?? [];
    const primary = images.find(
      (i: { isPrimary: boolean }) => i.isPrimary
    );

    if (primary) {
      const { error: imageError } = await supabase
        .from("product_images")
        .update({ url: input.image.trim(), alt: input.name })
        .eq("id", primary.id);

      if (imageError) throw imageError;
    } else {
      const { error: imageError } = await supabase.from("product_images").insert({
        productId,
        url: input.image.trim(),
        alt: input.name,
        isPrimary: true,
        sortOrder: 0,
      });

      if (imageError) throw imageError;
    }
  } else {
    const { data: created, error } = await supabase
      .from("products")
      .insert({
        ...productData,
        createdAt: now,
      })
      .select("id")
      .single();

    if (error) throw error;
    productId = created.id;

    const { error: imageError } = await supabase.from("product_images").insert({
      productId,
      url: input.image.trim(),
      alt: input.name,
      isPrimary: true,
      sortOrder: 0,
    });

    if (imageError) throw imageError;
  }

  const refreshed = await dbFindProductById(productId);
  if (!refreshed) throw new Error("Produs negăsit după actualizare");
  return refreshed;
}

export async function dbDeleteProduct(id: string): Promise<boolean> {
  if (!isDatabaseEnabled()) return false;

  const supabase = getSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function dbDeleteAllProducts(): Promise<number> {
  if (!isDatabaseEnabled()) return 0;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .delete()
    .neq("id", "")
    .select("id");

  if (error) throw error;
  return data?.length ?? 0;
}
