import { absoluteUrl } from "@/lib/seo/metadata";
import { getAllCatalogProducts } from "@/lib/services/catalog.service";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const products = await getAllCatalogProducts();

  // lastmod = data reală a ultimei modificări din DB (nu ora cererii).
  const lastmodFor = (updatedAt?: string, createdAt?: string): string => {
    const raw = updatedAt ?? createdAt;
    if (!raw) return "";
    const d = new Date(raw);
    return Number.isNaN(d.getTime())
      ? ""
      : `<lastmod>${d.toISOString()}</lastmod>`;
  };

  const urls = products
    .map(
      (p) =>
        `  <url><loc>${escapeXml(absoluteUrl(`/produse/${p.slug}`))}</loc>${lastmodFor(p.updatedAt, p.createdAt)}<changefreq>weekly</changefreq><priority>0.8</priority></url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
