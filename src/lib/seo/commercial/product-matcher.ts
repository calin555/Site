import type { CatalogProduct } from "@/types/catalog";
import type { ProductFilter } from "@/lib/seo/commercial/types";
import { getAllCatalogProducts } from "@/lib/services/catalog.service";

export async function getProductsForLanding(
  filter: ProductFilter,
  limit = 6
): Promise<CatalogProduct[]> {
  const all = await getAllCatalogProducts();
  let result = all.filter((p) => p.stock >= 0);

  if (filter.categorySlug) {
    result = result.filter((p) => p.categorySlug === filter.categorySlug);
  }
  if (filter.brandSlug) {
    result = result.filter((p) => p.brandSlug === filter.brandSlug);
  }
  if (filter.phases) {
    result = result.filter((p) => p.phases === filter.phases);
  }
  if (filter.powerKwMin !== undefined) {
    result = result.filter((p) => p.powerKw >= filter.powerKwMin!);
  }
  if (filter.powerKwMax !== undefined) {
    result = result.filter((p) => p.powerKw <= filter.powerKwMax!);
  }
  if (filter.connectorTypes?.length) {
    result = result.filter((p) =>
      filter.connectorTypes!.some((c) =>
        p.connectorTypes.some(
          (pc) => pc.toLowerCase().replace(/\s/g, "") === c.toLowerCase()
        )
      )
    );
  }

  return result
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    .slice(0, limit);
}
