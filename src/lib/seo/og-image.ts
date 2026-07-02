import { getAllCatalogProducts } from "@/lib/services/catalog.service";
import type { CatalogProduct } from "@/types/catalog";
import { getSiteBaseUrl } from "@/lib/site-url";

function absoluteOrigin(path: string): string {
  const base = getSiteBaseUrl().replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getFeaturedAcStationProduct(): Promise<
  CatalogProduct | undefined
> {
  const products = await getAllCatalogProducts();
  return (
    products.find(
      (p) => p.categorySlug === "statii-ac" && p.isFeatured && p.image?.trim()
    ) ??
    products.find((p) => p.categorySlug === "statii-ac" && p.image?.trim()) ??
    products.find((p) => p.categorySlug === "statii-ac")
  );
}

export function getProduseOgImageUrl(): string {
  return absoluteOrigin("/produse/opengraph-image");
}

export function getSiteOgImageUrl(): string {
  return absoluteOrigin("/opengraph-image");
}

export function resolveOgImageUrl(image: string): string {
  if (/^https?:\/\//i.test(image)) return image;
  return absoluteOrigin(image.startsWith("/") ? image : `/${image}`);
}

export function isUsableRemoteImage(url: string | undefined): boolean {
  if (!url?.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}
