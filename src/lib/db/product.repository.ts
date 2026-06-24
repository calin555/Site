import { getSupabase } from "@/lib/supabase/server";
import { isDatabaseEnabled } from "@/lib/db/config";
import { dedupeImageUrls } from "@/lib/product-images";
import {
  connectorsToDb,
  phasesToDb,
  productFromDb,
  skuForProduct,
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

function generateProductId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

async function resolveProductSku(
  productId: string,
  slug: string,
  existingSku?: string | null
): Promise<string> {
  if (existingSku) return existingSku;

  const supabase = getSupabase();
  let sku = skuForProduct(productId, slug);

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("sku", sku)
      .maybeSingle();

    if (error) throw error;
    if (!data || data.id === productId) return sku;

    sku = skuForProduct(`${productId}_${attempt + 1}`, slug);
  }

  return `CP-${Date.now().toString(36).toUpperCase()}`.slice(0, 50);
}

async function syncProductImages(
  productId: string,
  urls: string[],
  alt: string
): Promise<void> {
  const supabase = getSupabase();
  const uniqueUrls = dedupeImageUrls(urls);
  if (uniqueUrls.length === 0) {
    throw new Error("Adaugă cel puțin o imagine.");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("product_images")
    .select("id, url")
    .eq("productId", productId);

  if (fetchError) throw fetchError;

  const existingByUrl = new Map(
    (existing ?? []).map((row) => [row.url, row.id])
  );
  const urlSet = new Set(uniqueUrls);

  for (const row of existing ?? []) {
    if (!urlSet.has(row.url)) {
      const { error } = await supabase
        .from("product_images")
        .delete()
        .eq("id", row.id);
      if (error) throw error;
    }
  }

  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    const existingId = existingByUrl.get(url);

    if (existingId) {
      const { error } = await supabase
        .from("product_images")
        .update({
          sortOrder: i,
          isPrimary: i === 0,
          alt,
        })
        .eq("id", existingId);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("product_images").insert({
        id: generateImageId(),
        productId,
        url,
        alt,
        isPrimary: i === 0,
        sortOrder: i,
      });

      if (error) throw error;
    }
  }
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
    stockStatus: input.stockStatus,
  };

  if (input.catalogPdfUrl !== undefined) {
    if (input.catalogPdfUrl.trim()) {
      features.catalogPdfUrl = input.catalogPdfUrl.trim();
    } else {
      delete features.catalogPdfUrl;
    }
  }

  const now = new Date().toISOString();
  const productId = existing?.id ?? generateProductId();
  const sku = await resolveProductSku(productId, slug, existing?.sku);

  const productData = {
    name: input.name.trim(),
    slug,
    shortDescription: input.shortDescription.trim(),
    description: input.description?.trim() || input.shortDescription.trim(),
    sku,
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

  let savedProductId: string;

  if (existing) {
    const { data: updated, error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", existing.id)
      .select("id")
      .single();

    if (error) throw error;
    savedProductId = updated.id;
    await syncProductImages(savedProductId, input.images, input.name.trim());
  } else {
    const { data: created, error } = await supabase
      .from("products")
      .insert({
        id: productId,
        ...productData,
        createdAt: now,
      })
      .select("id")
      .single();

    if (error) throw error;
    savedProductId = created.id;
    await syncProductImages(savedProductId, input.images, input.name.trim());
  }

  const refreshed = await dbFindProductById(savedProductId);
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
