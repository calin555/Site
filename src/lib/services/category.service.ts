import { categories as mockCategories } from "@/lib/mock-data";
import type { Category } from "@/lib/mock-data";
import { isDatabaseEnabled } from "@/lib/db/config";
import { getAllCatalogProductsAdmin } from "@/lib/services/catalog.service";
import {
  dbFindAllCategories,
  dbFindAllCategoriesAdmin,
  dbFindCategoryById,
  dbFindCategoryBySlug,
  dbUpdateCategory,
  dbCreateCategory,
} from "@/lib/db/category.repository";
import { slugifyText } from "@/lib/utils";

async function withMockCounts(items: Category[]): Promise<Category[]> {
  const products = await getAllCatalogProductsAdmin();
  const counts = new Map<string, number>();

  for (const product of products) {
    counts.set(
      product.categorySlug,
      (counts.get(product.categorySlug) ?? 0) + 1
    );
  }

  return items.map((category) => ({
    ...category,
    productCount: counts.get(category.slug) ?? 0,
  }));
}

export async function getShopCategories(): Promise<Category[]> {
  if (isDatabaseEnabled()) {
    return dbFindAllCategories();
  }
  return withMockCounts(mockCategories);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  if (isDatabaseEnabled()) {
    const category = await dbFindCategoryBySlug(slug);
    return category ?? undefined;
  }
  const items = await withMockCounts(mockCategories);
  return items.find((c) => c.slug === slug);
}

export async function listAdminCategories(): Promise<Category[]> {
  if (isDatabaseEnabled()) {
    return dbFindAllCategoriesAdmin();
  }
  return withMockCounts(mockCategories);
}

export async function getCategoryForAdmin(
  id: string
): Promise<Category | undefined> {
  if (isDatabaseEnabled()) {
    const category = await dbFindCategoryById(id);
    return category ?? undefined;
  }
  const items = await withMockCounts(mockCategories);
  return items.find((c) => c.id === id);
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
  }
): Promise<Category | null> {
  if (isDatabaseEnabled()) {
    return dbUpdateCategory(id, data);
  }

  const idx = mockCategories.findIndex((c) => c.id === id);
  if (idx < 0) return null;

  mockCategories[idx] = {
    ...mockCategories[idx],
    ...data,
    name: data.name ?? mockCategories[idx].name,
    description: data.description ?? mockCategories[idx].description,
    image: data.image ?? mockCategories[idx].image,
  };

  return mockCategories[idx];
}

export async function createCategory(data: {
  name: string;
  description: string;
  image: string;
}): Promise<Category | null> {
  if (isDatabaseEnabled()) {
    return dbCreateCategory(data);
  }

  const slug = slugifyText(data.name);
  if (!slug || mockCategories.some((c) => c.slug === slug)) {
    return null;
  }

  const category: Category = {
    id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: data.name.trim(),
    slug,
    description: data.description.trim(),
    image: data.image.trim(),
    productCount: 0,
  };

  mockCategories.push(category);
  return category;
}

export async function getCategoriesForSelect(): Promise<Category[]> {
  return listAdminCategories();
}
