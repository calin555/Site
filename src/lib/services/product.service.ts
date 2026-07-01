import type { CatalogProduct } from "@/types/catalog";
import type {
  ProductDetail,
  ProductDocument,
  ProductImage,
} from "@/types/product";
import {
  getCatalogProductBySlug,
  getAllCatalogProducts,
} from "@/lib/services/catalog.service";
import { dedupeImageUrls } from "@/lib/product-images";
import {
  buildProductSpecs,
  getIpRating,
  getWarrantyYears,
} from "@/lib/catalog/product-specs";
import { getApprovedReviewsForProduct } from "@/lib/admin/review-store";

const GALLERY_IMAGES: Record<string, ProductImage[]> = {
  "chargepro-home-7-4kw": [
    { url: "https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=900&h=900&fit=crop", alt: "ChargePro Home — vedere frontală" },
    { url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&h=900&fit=crop", alt: "ChargePro Home — montaj perete" },
    { url: "https://images.unsplash.com/photo-1558002038-1055907df827?w=900&h=900&fit=crop", alt: "ChargePro Home — conectivitate smart" },
    { url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&h=900&fit=crop", alt: "ChargePro Home — încărcare activă" },
  ],
  "chargepro-pro-22kw": [
    { url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&h=900&fit=crop", alt: "ChargePro Pro 22kW — vedere principală" },
    { url: "https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=900&h=900&fit=crop", alt: "ChargePro Pro — detaliu conector" },
    { url: "https://images.unsplash.com/photo-1558002038-1055907df827?w=900&h=900&fit=crop", alt: "ChargePro Pro — panou RFID" },
  ],
  "voltedge-dc-60kw": [
    { url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&h=900&fit=crop", alt: "VoltEdge DC 60kW — stație completă" },
    { url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&h=900&fit=crop", alt: "VoltEdge DC — ecran tactil" },
    { url: "https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=900&h=900&fit=crop", alt: "VoltEdge DC — conectori CCS2" },
  ],
};

function buildDocuments(product: CatalogProduct): ProductDocument[] {
  const base = `/api/products/${product.slug}/documents`;
  const docs: ProductDocument[] = [
    {
      id: `${product.slug}-datasheet`,
      title: "Fișă tehnică",
      description: "Specificații complete și catalog fotografic",
      url: `${base}/datasheet`,
      type: "datasheet",
    },
    {
      id: `${product.slug}-manual`,
      title: "Manual de instalare",
      description: "Ghid conform SR EN IEC 61851-1 și normelor ANRE",
      url: `${base}/manual`,
      type: "manual",
    },
  ];

  if (product.categorySlug !== "accesorii") {
    docs.push({
      id: `${product.slug}-ce`,
      title: "Certificat CE",
      description: "Declarație de conformitate europeană",
      url: `${base}/certificate`,
      type: "certificate",
    });
  }

  if (product.catalogPdfUrl) {
    docs.push({
      id: `${product.slug}-catalog`,
      title: "Catalog PDF",
      description: "Catalog și documentație produs",
      url: product.catalogPdfUrl,
      type: "brochure",
    });
  }

  return docs;
}

function buildImages(product: CatalogProduct): ProductImage[] {
  const custom = GALLERY_IMAGES[product.slug];
  if (custom) return custom;

  const urls = dedupeImageUrls([
    ...(product.galleryImages ?? []),
    product.image,
  ]);

  if (urls.length === 0) return [];

  return urls.map((url, index) => ({
    url,
    alt:
      index === 0 ? product.name : `${product.name} — imagine ${index + 1}`,
  }));
}

function buildDescription(product: CatalogProduct): string {
  if (product.description) return product.description;

  const parts = [
    product.shortDescription,
    `${product.name} este un produs ${product.brand} din categoria ${product.category}, conceput pentru piața din România.`,
  ];

  if (product.powerKw > 0) {
    parts.push(
      `Oferă putere de ${product.powerKw} kW (${product.phases === "SINGLE" ? "monofazat" : "trifazat"}), ideală pentru ${product.powerKw <= 11 ? "utilizare rezidențială" : "aplicații comerciale și flote"}.`
    );
  }

  parts.push(
    "Beneficiază de garanție extinsă, suport tehnic în limba română și posibilitatea instalării prin echipă autorizată ANRE."
  );

  return parts.join("\n\n");
}

function enrichProduct(product: CatalogProduct): ProductDetail {
  const reviews = getApprovedReviewsForProduct(product.id);
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10
        ) / 10
      : 0;

  return {
    ...product,
    sku: `CP-${product.id.padStart(4, "0")}`,
    description: buildDescription(product),
    images: buildImages(product),
    videos: product.videoUrls ?? [],
    warrantyYears: getWarrantyYears(product),
    ipRating: getIpRating(product),
    installationRequired: product.categorySlug !== "accesorii" && product.powerKw > 0,
    specs: buildProductSpecs(product),
    documents: buildDocuments(product),
    reviews,
    averageRating,
    reviewCount,
  };
}

export async function getProductDetail(
  slug: string
): Promise<ProductDetail | undefined> {
  const product = await getCatalogProductBySlug(slug);
  if (!product) return undefined;
  return enrichProduct(product);
}

export async function getRelatedProducts(
  slug: string,
  limit = 4
): Promise<CatalogProduct[]> {
  const product = await getCatalogProductBySlug(slug);
  if (!product) return [];

  const all = await getAllCatalogProducts();
  return all
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categorySlug === product.categorySlug || p.brandSlug === product.brandSlug)
    )
    .slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const all = await getAllCatalogProducts();
  return all.map((p) => p.slug);
}
