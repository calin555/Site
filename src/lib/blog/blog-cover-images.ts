/** Unsplash IDs verificate (HTTP 200) — EV, business, solar, auto. */
const BLOG_COVER_IMAGES = [
  "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=630&fit=crop",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop",
] as const;

/** ID-uri Unsplash inexistente / 404 din generarea inițială SEO. */
const BROKEN_UNSplash_IDS = [
  "photo-1593941707882-a5bba14938ca",
  "photo-1593941707874-ef2499d7847b",
  "photo-1646144145048-1879cbe1a8f8",
  "photo-1615904780036-6a3489a0486c",
  "photo-1628009365241-1a000fa5774e",
  "photo-1571127896587-793b737d266d",
  "photo-1655271743965-5c9d7f3e6a0a",
  "photo-1712222352426-3e3c5b3c5b3c",
];

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash + slug.charCodeAt(i) * (i + 1)) % 1_000_000;
  }
  return hash;
}

export function isBrokenCoverImage(url: string | undefined | null): boolean {
  if (!url?.trim()) return true;
  return BROKEN_UNSplash_IDS.some((id) => url.includes(id));
}

export function getBlogCoverImage(slug: string, preferred?: string): string {
  if (preferred && !isBrokenCoverImage(preferred)) return preferred;
  return BLOG_COVER_IMAGES[hashSlug(slug) % BLOG_COVER_IMAGES.length];
}

export function getBlogCoverImageByIndex(index: number): string {
  return BLOG_COVER_IMAGES[Math.abs(index) % BLOG_COVER_IMAGES.length];
}

export { BLOG_COVER_IMAGES };
