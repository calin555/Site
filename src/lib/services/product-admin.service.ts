import type { CatalogProduct } from "@/types/catalog";
import { productStore, slugify } from "@/lib/catalog/product.store";
import { categories, brands } from "@/lib/mock-data";
import { isDatabaseEnabled } from "@/lib/db/config";
import {
  dbDeleteAllProducts,
  dbDeleteProduct,
  dbFindProductById,
  dbUpsertProduct,
} from "@/lib/db/product.repository";

export interface ProductInput {
  id?: string;
  name: string;
  slug?: string;
  shortDescription: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  categorySlug: string;
  brandSlug: string;
  powerKw: number;
  phases: "SINGLE" | "THREE";
  connectorTypes: string[];
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  catalogPdfUrl?: string;
}

function resolveCategory(slug: string) {
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) throw new Error("Categorie invalidă");
  return { name: cat.name, slug: cat.slug };
}

function resolveBrand(slug: string) {
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) throw new Error("Brand invalid");
  return { name: brand.name, slug: brand.slug };
}

function upsertInMemory(input: ProductInput): CatalogProduct {
  const category = resolveCategory(input.categorySlug);
  const brand = resolveBrand(input.brandSlug);
  const existing = input.id ? productStore.getById(input.id) : undefined;
  const slug = input.slug?.trim() || slugify(input.name);

  const product: CatalogProduct = {
    id: existing?.id ?? `prod_${Date.now()}`,
    name: input.name.trim(),
    slug,
    shortDescription: input.shortDescription.trim(),
    description: input.description?.trim() || existing?.description,
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    image: input.image.trim(),
    category: category.name,
    categorySlug: category.slug,
    brand: brand.name,
    brandSlug: brand.slug,
    powerKw: input.powerKw,
    phases: input.phases,
    connectorTypes: input.connectorTypes,
    stock: input.stock,
    isFeatured: input.isFeatured ?? false,
    isNew: input.isNew ?? false,
    createdAt: existing?.createdAt ?? new Date().toISOString().split("T")[0],
    catalogPdfUrl: input.catalogPdfUrl ?? existing?.catalogPdfUrl,
  };

  return productStore.save(product);
}

export async function upsertProduct(input: ProductInput): Promise<CatalogProduct> {
  if (isDatabaseEnabled()) {
    const product = await dbUpsertProduct(input);
    productStore.save(product);
    return product;
  }
  return upsertInMemory(input);
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isDatabaseEnabled()) {
    await dbDeleteProduct(id);
    return true;
  }
  return productStore.delete(id);
}

export async function deleteAllProducts(): Promise<number> {
  if (isDatabaseEnabled()) {
    const count = await dbDeleteAllProducts();
    productStore.replaceAll([]);
    return count;
  }
  return productStore.deleteAll();
}

export async function getProductForAdmin(
  id: string
): Promise<CatalogProduct | undefined> {
  if (isDatabaseEnabled()) {
    const product = await dbFindProductById(id);
    return product ?? undefined;
  }
  return productStore.getById(id);
}
