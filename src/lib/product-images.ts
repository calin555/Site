import type { ProductImage } from "@/types/product";

export function dedupeImageUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  return urls.filter((url) => {
    const normalized = url.trim();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

export function dedupeProductImages(images: ProductImage[]): ProductImage[] {
  const seen = new Set<string>();
  return images.filter((img) => {
    const url = img.url.trim();
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
