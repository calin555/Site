import type {
  CatalogParams,
  CatalogPageContext,
  ConnectorFilter,
  PowerFilter,
  SortOption,
} from "@/types/catalog";
import {
  CONNECTOR_OPTIONS,
  POWER_OPTIONS,
  SORT_OPTIONS,
  CATALOG_PAGE_SIZE,
} from "@/config/catalog";

const VALID_SORT = new Set(SORT_OPTIONS.map((o) => o.value));
const VALID_POWER = new Set(POWER_OPTIONS.map((o) => o.value));
const VALID_CONNECTOR = new Set(CONNECTOR_OPTIONS.map((o) => o.value));

function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function parseList<T extends string>(
  value: string | string[] | undefined,
  valid: Set<T>
): T[] | undefined {
  if (!value) return undefined;
  const raw = Array.isArray(value) ? value.join(",") : value;
  const items = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => valid.has(s as T)) as T[];
  return items.length > 0 ? items : undefined;
}

export function parseCatalogSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
  context?: Pick<CatalogPageContext, "categorySlug" | "brandSlug">
): CatalogParams {
  const q = typeof searchParams.cauta === "string" ? searchParams.cauta.trim() : undefined;

  const sortRaw = typeof searchParams.sort === "string" ? searchParams.sort : undefined;
  const sort = sortRaw && VALID_SORT.has(sortRaw as SortOption)
    ? (sortRaw as SortOption)
    : "popular";

  const pageRaw = parseNumber(
    typeof searchParams.pagina === "string" ? searchParams.pagina : undefined
  );
  const page = pageRaw && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

  const categoryFromQuery =
    typeof searchParams.categorie === "string" ? searchParams.categorie : undefined;
  const brandFromQuery =
    typeof searchParams.brand === "string" ? searchParams.brand : undefined;

  return {
    q: q || undefined,
    categorySlug: context?.categorySlug ?? categoryFromQuery,
    brandSlug: context?.brandSlug ?? brandFromQuery,
    power: parseList(
      searchParams.putere,
      VALID_POWER as Set<PowerFilter>
    ),
    connectors: parseList(
      searchParams.conector,
      VALID_CONNECTOR as Set<ConnectorFilter>
    ),
    priceMin: parseNumber(
      typeof searchParams["pret-min"] === "string" ? searchParams["pret-min"] : undefined
    ),
    priceMax: parseNumber(
      typeof searchParams["pret-max"] === "string" ? searchParams["pret-max"] : undefined
    ),
    sort,
    page,
    pageSize: CATALOG_PAGE_SIZE,
  };
}

export function buildCatalogUrl(
  basePath: string,
  params: CatalogParams,
  overrides?: Partial<CatalogParams>
): string {
  const merged = { ...params, ...overrides };
  const search = new URLSearchParams();

  if (merged.q) search.set("cauta", merged.q);

  if (!basePath.includes("/categorie/") && merged.categorySlug) {
    search.set("categorie", merged.categorySlug);
  }
  if (!basePath.includes("/brand/") && merged.brandSlug) {
    search.set("brand", merged.brandSlug);
  }

  if (merged.power?.length) search.set("putere", merged.power.join(","));
  if (merged.connectors?.length) search.set("conector", merged.connectors.join(","));
  if (merged.priceMin !== undefined) search.set("pret-min", String(merged.priceMin));
  if (merged.priceMax !== undefined) search.set("pret-max", String(merged.priceMax));
  if (merged.sort && merged.sort !== "popular") search.set("sort", merged.sort);
  if (merged.page && merged.page > 1) search.set("pagina", String(merged.page));

  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function getCatalogBasePath(context: CatalogPageContext): string {
  if (context.categorySlug) {
    return `/produse/categorie/${context.categorySlug}`;
  }
  if (context.brandSlug) {
    return `/produse/brand/${context.brandSlug}`;
  }
  return "/produse";
}

export function resolveCategoryPath(categorySlug: string, params: CatalogParams): string {
  const { categorySlug: _removed, page: _page, ...rest } = params;
  return buildCatalogUrl(`/produse/categorie/${categorySlug}`, {
    ...rest,
    categorySlug,
    page: 1,
  });
}

export function resolveBrandPath(brandSlug: string, params: CatalogParams): string {
  const { brandSlug: _removed, page: _page, ...rest } = params;
  return buildCatalogUrl(`/produse/brand/${brandSlug}`, {
    ...rest,
    brandSlug,
    page: 1,
  });
}
