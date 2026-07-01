import { absoluteUrl } from "@/lib/seo/metadata";
import { getAllCatalogProducts } from "@/lib/services/catalog.service";
import { getPublishedArticles } from "@/lib/services/blog.service";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [products, articles] = await Promise.all([
    getAllCatalogProducts(),
    Promise.resolve(getPublishedArticles()),
  ]);

  const entries: string[] = [];

  for (const product of products) {
    const pageUrl = absoluteUrl(`/produse/${product.slug}`);
    const images = [product.image].filter(Boolean);
    for (const image of images) {
      entries.push(`  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
      <image:title>${escapeXml(product.name)}</image:title>
    </image:image>
  </url>`);
    }
  }

  for (const post of articles) {
    if (!post.coverImage) continue;
    entries.push(`  <url>
    <loc>${escapeXml(absoluteUrl(`/blog/${post.slug}`))}</loc>
    <image:image>
      <image:loc>${escapeXml(post.coverImage)}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
    </image:image>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
