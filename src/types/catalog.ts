import type { StockStatus } from "@/lib/catalog/stock-status";

export type SortOption =
  | "popular"
  | "pret-asc"
  | "pret-desc"
  | "nou"
  | "putere-asc"
  | "putere-desc";

export type ConnectorFilter = "type1" | "type2" | "ccs2" | "chademo" | "tesla";

export type PowerFilter = "7.4" | "11" | "22" | "60+";

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: string;
  categorySlug: string;
  brand: string;
  brandSlug: string;
  powerKw: number;
  phases: "SINGLE" | "THREE";
  connectorTypes: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  stock: number;
  stockStatus: StockStatus;
  videoUrls?: string[];
  createdAt: string;
  catalogPdfUrl?: string;
  galleryImages?: string[];
}

export interface CatalogFilters {
  categories: { slug: string; name: string; count: number }[];
  brands: { slug: string; name: string; count: number }[];
  powerOptions: { value: PowerFilter; label: string; count: number }[];
  connectorOptions: { value: ConnectorFilter; label: string; count: number }[];
  priceRange: { min: number; max: number };
}

export interface CatalogParams {
  q?: string;
  categorySlug?: string;
  brandSlug?: string;
  power?: PowerFilter[];
  connectors?: ConnectorFilter[];
  priceMin?: number;
  priceMax?: number;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface CatalogResult {
  products: CatalogProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: CatalogFilters;
  params: CatalogParams;
}

export interface CatalogPageContext {
  basePath: string;
  categorySlug?: string;
  brandSlug?: string;
  categoryName?: string;
  brandName?: string;
}
