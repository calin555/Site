import { isDatabaseEnabled } from "@/lib/db/config";
import { dbFindAllProducts } from "@/lib/db/product.repository";
import { productStore } from "@/lib/catalog/product.store";

let hydrated = false;

export async function hydrateProductCache(): Promise<void> {
  if (!isDatabaseEnabled()) return;
  if (hydrated) return;

  try {
    const products = await dbFindAllProducts();
    productStore.replaceAll(products);
    hydrated = true;
  } catch (error) {
    console.error("[product-cache] Failed to hydrate from database:", error);
  }
}

export function invalidateProductCache(): void {
  hydrated = false;
}

export async function refreshProductCache(): Promise<void> {
  if (!isDatabaseEnabled()) return;
  hydrated = false;
  await hydrateProductCache();
}
