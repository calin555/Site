import type { CatalogProduct } from "@/types/catalog";
import type {
  ProductDetail,
  ProductDocument,
  ProductImage,
  ProductReview,
  ProductSpec,
} from "@/types/product";
import {
  getCatalogProductBySlug,
  getAllCatalogProducts,
} from "@/lib/services/catalog.service";
import { dedupeImageUrls } from "@/lib/product-images";

const DEFAULT_REVIEWS: ProductReview[] = [
  {
    id: "r1",
    author: "Alexandru M.",
    rating: 5,
    title: "Instalare rapidă, funcționează perfect",
    content:
      "Am montat stația în garaj în câteva ore. Aplicația mobilă e intuitivă și îmi arată consumul în timp real. Recomand!",
    date: "2026-04-12",
    verified: true,
  },
  {
    id: "r2",
    author: "Elena P.",
    rating: 5,
    title: "Calitate premium",
    content:
      "Construcție solidă, design elegant. Suportul tehnic ChargePro m-a ajutat cu dimensionarea cablajului înainte de comandă.",
    date: "2026-03-28",
    verified: true,
  },
  {
    id: "r3",
    author: "Mihai I.",
    rating: 4,
    title: "Foarte bun, livrare promptă",
    content:
      "Produs conform descrierii. Un singur punct: manualul ar putea fi mai detaliat pentru configurarea WiFi.",
    date: "2026-02-15",
    verified: true,
  },
];

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

function buildSpecs(product: CatalogProduct): ProductSpec[] {
  const specs: ProductSpec[] = [
    { label: "SKU", value: `CP-${product.id.padStart(4, "0")}`, group: "General" },
    { label: "Brand", value: product.brand, group: "General" },
    { label: "Categorie", value: product.category, group: "General" },
  ];

  if (product.powerKw > 0) {
    specs.push(
      { label: "Putere nominală", value: `${product.powerKw} kW`, group: "Performanță" },
      { label: "Fază", value: product.phases === "SINGLE" ? "Monofazat" : "Trifazat", group: "Performanță" }
    );
  }

  if (product.connectorTypes.length > 0) {
    specs.push({
      label: "Tip conector",
      value: product.connectorTypes.join(", "),
      group: "Performanță",
    });
  }

  const ipRating = getIpRating(product);
  if (ipRating) {
    specs.push({ label: "Protecție IP", value: ipRating, group: "Construcție" });
  }

  specs.push(
    { label: "Garanție", value: `${getWarrantyYears(product)} ani`, group: "Construcție" },
    { label: "Certificare", value: "CE, RoHS", group: "Construcție" },
    { label: "Temperatură operare", value: "-25°C ~ +50°C", group: "Mediu" },
    { label: "Umiditate relativă", value: "5% ~ 95% (fără condens)", group: "Mediu" }
  );

  if (product.powerKw >= 11) {
    specs.push({ label: "Protocol OCPP", value: "1.6J (opțional 2.0.1)", group: "Smart" });
  }

  if (product.categorySlug !== "accesorii") {
    specs.push(
      { label: "Conectivitate", value: "WiFi / Ethernet / 4G (opțional)", group: "Smart" },
      { label: "Aplicație mobilă", value: "iOS & Android", group: "Smart" }
    );
  }

  return specs;
}

function getIpRating(product: CatalogProduct): string | undefined {
  if (product.categorySlug === "accesorii") return undefined;
  return product.powerKw >= 22 ? "IP54" : "IP65";
}

function getWarrantyYears(product: CatalogProduct): number {
  if (product.price >= 50000) return 5;
  if (product.price >= 5000) return 3;
  return 2;
}

function buildDocuments(product: CatalogProduct): ProductDocument[] {
  const docs: ProductDocument[] = [];

  if (product.catalogPdfUrl) {
    docs.push({
      id: `${product.slug}-catalog`,
      title: "Catalog PDF",
      description: "Catalog și documentație produs",
      url: product.catalogPdfUrl,
      type: "brochure",
    });
    return docs;
  }

  const base = product.slug;
  const fallbackDocs: ProductDocument[] = [
    {
      id: `${base}-datasheet`,
      title: "Fișă tehnică",
      description: "Specificații complete și dimensiuni",
      url: `#datasheet-${base}`,
      type: "datasheet",
      fileSize: "1.2 MB",
    },
    {
      id: `${base}-manual`,
      title: "Manual de instalare",
      description: "Ghid pas cu pas pentru montaj",
      url: `#manual-${base}`,
      type: "manual",
      fileSize: "3.4 MB",
    },
  ];

  if (product.categorySlug !== "accesorii") {
    fallbackDocs.push({
      id: `${base}-ce`,
      title: "Certificat CE",
      description: "Declarație de conformitate europeană",
      url: `#ce-${base}`,
      type: "certificate",
      fileSize: "0.5 MB",
    });
  }

  if (product.price >= 5000) {
    fallbackDocs.push({
      id: `${base}-brochure`,
      title: "Broșură comercială",
      description: "Prezentare produs pentru proiecte B2B",
      url: `#brochure-${base}`,
      type: "brochure",
      fileSize: "2.8 MB",
    });
  }

  return fallbackDocs;
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
  const reviews = DEFAULT_REVIEWS;
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return {
    ...product,
    sku: `CP-${product.id.padStart(4, "0")}`,
    description: buildDescription(product),
    images: buildImages(product),
    warrantyYears: getWarrantyYears(product),
    ipRating: getIpRating(product),
    installationRequired: product.categorySlug !== "accesorii" && product.powerKw > 0,
    specs: buildSpecs(product),
    documents: buildDocuments(product),
    reviews,
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length,
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
