import type { ConnectorType, PhaseType, ProductWithRelations } from "@/types/database";
import type { CatalogProduct } from "@/types/catalog";
import { normalizeStockStatus } from "@/lib/catalog/stock-status";
import { normalizeVideoUrls } from "@/lib/product-videos";

const CONNECTOR_TO_APP: Record<ConnectorType, string> = {
  TYPE1: "Type 1",
  TYPE2: "Type 2",
  CCS2: "CCS2",
  CHADEMO: "CHAdeMO",
  TESLA: "Tesla",
};

const CONNECTOR_TO_DB: Record<string, ConnectorType> = {
  "type 1": "TYPE1",
  type1: "TYPE1",
  "type 2": "TYPE2",
  type2: "TYPE2",
  ccs2: "CCS2",
  chademo: "CHADEMO",
  tesla: "TESLA",
};

export function connectorsToDb(types: string[]): ConnectorType[] {
  return types
    .map((t) => CONNECTOR_TO_DB[t.toLowerCase().replace(/\s+/g, " ")])
    .filter((t): t is ConnectorType => t !== undefined);
}

export function connectorsFromDb(types: ConnectorType[]): string[] {
  return types.map((t) => CONNECTOR_TO_APP[t]);
}

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export function productFromDb(row: ProductWithRelations): CatalogProduct {
  const primaryImage =
    row.images.find((i) => i.isPrimary)?.url ??
    row.images.sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url ??
    "";

  const smart = row.smartFeatures as {
    isNew?: boolean;
    catalogPdfUrl?: string;
    stockStatus?: unknown;
    videoUrls?: unknown;
  } | null;

  const createdAtDate = toDate(row.createdAt);
  const createdAt = createdAtDate.toISOString().split("T")[0];
  const isRecent = Date.now() - createdAtDate.getTime() < 60 * 24 * 60 * 60 * 1000;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.shortDescription ?? "",
    description: row.description,
    price: Number(row.price),
    compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : undefined,
    image: primaryImage,
    galleryImages: row.images
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((i) => i.url),
    category: row.category.name,
    categorySlug: row.category.slug,
    brand: row.brand.name,
    brandSlug: row.brand.slug,
    powerKw: Number(row.powerKw),
    phases: row.phases as "SINGLE" | "THREE",
    connectorTypes: connectorsFromDb(row.connectorTypes),
    isFeatured: row.isFeatured,
    isNew: smart?.isNew ?? isRecent,
    stock: row.stock,
    stockStatus: normalizeStockStatus(smart?.stockStatus),
    videoUrls: normalizeVideoUrls(smart?.videoUrls),
    createdAt,
    catalogPdfUrl: smart?.catalogPdfUrl,
  };
}

const SKU_MAX_LENGTH = 50;

/** SKU unic derivat din slug + id produs (evită coliziuni products_sku_key). */
export function skuForProduct(productId: string, slug: string): string {
  const slugPart =
    slug
      .replace(/-/g, "")
      .replace(/[^a-z0-9]/gi, "")
      .slice(0, 10)
      .toUpperCase() || "PROD";
  const idPart =
    productId
      .replace(/[^a-z0-9]/gi, "")
      .slice(-10)
      .toUpperCase() || "001";

  return `CP-${slugPart}-${idPart}`.slice(0, SKU_MAX_LENGTH);
}

/** @deprecated Folosește skuForProduct(productId, slug) */
export function skuFromSlug(slug: string): string {
  return skuForProduct(`tmp_${Date.now()}`, slug);
}

export function phasesToDb(phases: "SINGLE" | "THREE"): PhaseType {
  return phases;
}
