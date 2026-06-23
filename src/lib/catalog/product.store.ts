import type { CatalogProduct } from "@/types/catalog";
import { SEED_CATALOG_PRODUCTS } from "@/lib/catalog/seed-products";
import { isDatabaseEnabled } from "@/lib/db/config";

const products = new Map<string, CatalogProduct>();

if (!isDatabaseEnabled()) {
  for (const p of SEED_CATALOG_PRODUCTS) {
    products.set(p.id, { ...p });
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const productStore = {
  getAll(): CatalogProduct[] {
    return Array.from(products.values());
  },

  getById(id: string): CatalogProduct | undefined {
    return products.get(id);
  },

  getBySlug(slug: string): CatalogProduct | undefined {
    return Array.from(products.values()).find((p) => p.slug === slug);
  },

  save(product: CatalogProduct): CatalogProduct {
    const slugTaken = Array.from(products.values()).some(
      (p) => p.slug === product.slug && p.id !== product.id
    );
    if (slugTaken) {
      throw new Error("Un produs cu acest slug există deja.");
    }
    products.set(product.id, product);
    return product;
  },

  delete(id: string): boolean {
    return products.delete(id);
  },

  deleteAll(): number {
    const count = products.size;
    products.clear();
    return count;
  },

  replaceAll(items: CatalogProduct[]): void {
    products.clear();
    for (const p of items) {
      products.set(p.id, { ...p });
    }
  },
};
