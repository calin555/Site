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

/**
 * Verifică dacă imaginea remote chiar există și e o imagine (evită ca o
 * imagine ștearsă/404 să strice generarea OG la build).
 */
export async function resolveOgBackgroundImage(
  url: string | undefined
): Promise<string | null> {
  if (!isUsableRemoteImage(url)) return null;
  try {
    const res = await fetch(url!.trim(), {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    const type = res.headers.get("content-type") ?? "";
    return res.ok && /^image\//i.test(type) ? url!.trim() : null;
  } catch {
    return null;
  }
}
