import type {
  CatalogProduct,
  CatalogParams,
  CatalogResult,
  CatalogFilters,
  ConnectorFilter,
  PowerFilter,
} from "@/types/catalog";
import {
  CONNECTOR_OPTIONS,
  POWER_OPTIONS,
  CATALOG_PAGE_SIZE,
} from "@/config/catalog";
import { brands } from "@/lib/mock-data";
import { getShopCategories } from "@/lib/services/category.service";
import { productStore } from "@/lib/catalog/product.store";
import { isDatabaseEnabled } from "@/lib/db/config";
import { dbFindAllProducts } from "@/lib/db/product.repository";

async function loadProducts(publishedOnly = true): Promise<CatalogProduct[]> {
  if (isDatabaseEnabled()) {
    return dbFindAllProducts(publishedOnly);
  }
  return productStore.getAll();
}

function normalizeConnector(c: string): ConnectorFilter | null {
  const map: Record<string, ConnectorFilter> = {
    "type 1": "type1",
    type1: "type1",
    "type 2": "type2",
    type2: "type2",
    ccs2: "ccs2",
    chademo: "chademo",
    tesla: "tesla",
  };
  return map[c.toLowerCase()] ?? null;
}

function productHasConnector(product: CatalogProduct, connector: ConnectorFilter): boolean {
  return product.connectorTypes.some(
    (c) => normalizeConnector(c) === connector
  );
}

function matchesPower(product: CatalogProduct, power: PowerFilter): boolean {
  if (power === "60+") return product.powerKw >= 60;
  const target = parseFloat(power);
  return product.powerKw === target;
}

function filterProducts(all: CatalogProduct[], params: CatalogParams): CatalogProduct[] {
  let result = all.filter((p) => p.stock >= 0);

  if (params.q) {
    const q = params.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (params.categorySlug) {
    result = result.filter((p) => p.categorySlug === params.categorySlug);
  }

  if (params.brandSlug) {
    result = result.filter((p) => p.brandSlug === params.brandSlug);
  }

  if (params.power?.length) {
    result = result.filter((p) =>
      params.power!.some((pw) => matchesPower(p, pw))
    );
  }

  if (params.connectors?.length) {
    result = result.filter((p) =>
      params.connectors!.some((c) => productHasConnector(p, c))
    );
  }

  if (params.priceMin !== undefined) {
    result = result.filter((p) => p.price >= params.priceMin!);
  }

  if (params.priceMax !== undefined) {
    result = result.filter((p) => p.price <= params.priceMax!);
  }

  return result;
}

function sortProducts(products: CatalogProduct[], sort: CatalogParams["sort"]): CatalogProduct[] {
  const sorted = [...products];
  switch (sort) {
    case "pret-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "pret-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "nou":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "putere-asc":
      return sorted.sort((a, b) => a.powerKw - b.powerKw);
    case "putere-desc":
      return sorted.sort((a, b) => b.powerKw - a.powerKw);
    case "popular":
    default:
      return sorted.sort((a, b) => {
        const scoreA = (a.isFeatured ? 2 : 0) + (a.isNew ? 1 : 0);
        const scoreB = (b.isFeatured ? 2 : 0) + (b.isNew ? 1 : 0);
        return scoreB - scoreA || b.stock - a.stock;
      });
  }
}

function buildFilterCounts(
  all: CatalogProduct[],
  categoryList: Awaited<ReturnType<typeof getShopCategories>>
): CatalogFilters {
  const prices = all.map((p) => p.price);
  const priceMin = prices.length ? Math.min(...prices) : 0;
  const priceMax = prices.length ? Math.max(...prices) : 0;

  const categoryCounts = new Map<string, number>();
  const brandCounts = new Map<string, number>();
  const powerCounts = new Map<PowerFilter, number>();
  const connectorCounts = new Map<ConnectorFilter, number>();

  for (const p of all) {
    categoryCounts.set(p.categorySlug, (categoryCounts.get(p.categorySlug) ?? 0) + 1);
    brandCounts.set(p.brandSlug, (brandCounts.get(p.brandSlug) ?? 0) + 1);

    for (const opt of POWER_OPTIONS) {
      if (matchesPower(p, opt.value)) {
        powerCounts.set(opt.value, (powerCounts.get(opt.value) ?? 0) + 1);
      }
    }

    for (const opt of CONNECTOR_OPTIONS) {
      if (productHasConnector(p, opt.value)) {
        connectorCounts.set(opt.value, (connectorCounts.get(opt.value) ?? 0) + 1);
      }
    }
  }

  return {
    categories: categoryList.map((c) => ({
      slug: c.slug,
      name: c.name,
      count: categoryCounts.get(c.slug) ?? 0,
    })),
    brands: brands.map((b) => ({
      slug: b.slug,
      name: b.name,
      count: brandCounts.get(b.slug) ?? 0,
    })),
    powerOptions: POWER_OPTIONS.map((o) => ({
      ...o,
      count: powerCounts.get(o.value) ?? 0,
    })),
    connectorOptions: CONNECTOR_OPTIONS.map((o) => ({
      ...o,
      count: connectorCounts.get(o.value) ?? 0,
    })),
    priceRange: { min: priceMin, max: priceMax },
  };
}

export async function getCatalogProducts(
  params: CatalogParams
): Promise<CatalogResult> {
  const pageSize = params.pageSize ?? CATALOG_PAGE_SIZE;
  const page = params.page ?? 1;

  const all = await loadProducts(true);
  const categoryList = await getShopCategories();
  const filtered = filterProducts(all, params);
  const sorted = sortProducts(filtered, params.sort ?? "popular");
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const products = sorted.slice(start, start + pageSize);

  return {
    products,
    total,
    page: safePage,
    pageSize,
    totalPages,
    filters: buildFilterCounts(all, categoryList),
    params: { ...params, page: safePage, pageSize },
  };
}

export async function getCatalogProductBySlug(
  slug: string
): Promise<CatalogProduct | undefined> {
  const all = await loadProducts(true);
  return all.find((p) => p.slug === slug);
}

export async function getAllCatalogProducts(): Promise<CatalogProduct[]> {
  return loadProducts(true);
}

export async function getAllCatalogProductsAdmin(): Promise<CatalogProduct[]> {
  return loadProducts(false);
}
