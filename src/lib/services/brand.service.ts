import { brands as brandRegistry, type Brand } from "@/lib/mock-data";
import { getAllCatalogProducts } from "@/lib/services/catalog.service";

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || name.slice(0, 2).toUpperCase()
  );
}

/**
 * Branduri cu numărul REAL de produse publicate (calculat din catalog / DB).
 * Include și brandurile care apar pe produse dar lipsesc din registrul static.
 */
export async function getShopBrands(): Promise<Brand[]> {
  const products = await getAllCatalogProducts();
  const counts = new Map<string, { name: string; count: number }>();

  for (const product of products) {
    if (!product.brandSlug) continue;
    const current = counts.get(product.brandSlug);
    counts.set(product.brandSlug, {
      name: current?.name ?? product.brand,
      count: (current?.count ?? 0) + 1,
    });
  }

  const known = brandRegistry.map((brand) => ({
    ...brand,
    productCount: counts.get(brand.slug)?.count ?? 0,
  }));

  const knownSlugs = new Set(known.map((b) => b.slug));
  const discovered: Brand[] = [...counts.entries()]
    .filter(([slug]) => !knownSlugs.has(slug))
    .map(([slug, { name, count }]) => ({
      id: `brand_${slug}`,
      name,
      slug,
      logo: initials(name),
      productCount: count,
    }));

  return [...known, ...discovered];
}

/** Doar brandurile care au cel puțin un produs publicat. */
export async function getShopBrandsWithProducts(): Promise<Brand[]> {
  const all = await getShopBrands();
  return all
    .filter((b) => b.productCount > 0)
    .sort((a, b) => b.productCount - a.productCount);
}

export async function getShopBrandBySlug(slug: string): Promise<Brand | undefined> {
  const all = await getShopBrands();
  return all.find((b) => b.slug === slug);
}
