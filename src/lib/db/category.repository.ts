import { getSupabase } from "@/lib/supabase/server";
import { isDatabaseEnabled } from "@/lib/db/config";
import { slugifyText } from "@/lib/utils";
import type { Category } from "@/lib/mock-data";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

async function countProductsByCategory(
  publishedOnly: boolean
): Promise<Map<string, number>> {
  const supabase = getSupabase();
  let query = supabase.from("products").select("categoryId");

  if (publishedOnly) {
    query = query.eq("isPublished", true);
  }

  const { data, error } = await query;
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.categoryId, (counts.get(row.categoryId) ?? 0) + 1);
  }
  return counts;
}

function mapCategory(row: CategoryRow, productCount = 0): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    image: row.image ?? "",
    productCount,
  };
}

export async function dbFindAllCategories(): Promise<Category[]> {
  if (!isDatabaseEnabled()) return [];

  const supabase = getSupabase();
  const [categoriesResult, counts] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, description, image")
      .eq("isActive", true)
      .order("sortOrder", { ascending: true }),
    countProductsByCategory(true),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;

  return (categoriesResult.data ?? []).map((row) =>
    mapCategory(row, counts.get(row.id) ?? 0)
  );
}

export async function dbFindAllCategoriesAdmin(): Promise<Category[]> {
  if (!isDatabaseEnabled()) return [];

  const supabase = getSupabase();
  const [categoriesResult, counts] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, description, image")
      .order("sortOrder", { ascending: true }),
    countProductsByCategory(false),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;

  return (categoriesResult.data ?? []).map((row) =>
    mapCategory(row, counts.get(row.id) ?? 0)
  );
}

export async function dbFindCategoryById(id: string): Promise<Category | null> {
  if (!isDatabaseEnabled()) return null;

  const supabase = getSupabase();
  const [categoryResult, counts] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, description, image")
      .eq("id", id)
      .maybeSingle(),
    countProductsByCategory(false),
  ]);

  if (categoryResult.error) throw categoryResult.error;
  if (!categoryResult.data) return null;

  return mapCategory(categoryResult.data, counts.get(id) ?? 0);
}

export async function dbFindCategoryBySlug(
  slug: string
): Promise<Category | null> {
  if (!isDatabaseEnabled()) return null;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, image")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const counts = await countProductsByCategory(true);
  return mapCategory(data, counts.get(data.id) ?? 0);
}

export async function dbUpdateCategory(
  id: string,
  data: {
    name?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
  }
): Promise<Category | null> {
  if (!isDatabaseEnabled()) return null;

  const supabase = getSupabase();
  const { data: row, error } = await supabase
    .from("categories")
    .update({
      name: data.name?.trim(),
      description: data.description?.trim(),
      image: data.image?.trim() || null,
      isActive: data.isActive,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, name, slug, description, image")
    .maybeSingle();

  if (error) throw error;
  if (!row) return null;

  const counts = await countProductsByCategory(false);
  return mapCategory(row, counts.get(id) ?? 0);
}

function generateCategoryId(): string {
  return `cat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function dbCreateCategory(data: {
  name: string;
  description: string;
  image: string;
}): Promise<Category | null> {
  if (!isDatabaseEnabled()) return null;

  const supabase = getSupabase();
  const slug = slugifyText(data.name);
  if (!slug) return null;

  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) return null;

  const { data: lastCategory } = await supabase
    .from("categories")
    .select("sortOrder")
    .order("sortOrder", { ascending: false })
    .limit(1)
    .maybeSingle();

  const now = new Date().toISOString();
  const { data: row, error } = await supabase
    .from("categories")
    .insert({
      id: generateCategoryId(),
      name: data.name.trim(),
      slug,
      description: data.description.trim(),
      image: data.image.trim(),
      sortOrder: (lastCategory?.sortOrder ?? 0) + 1,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })
    .select("id, name, slug, description, image")
    .single();

  if (error) throw error;
  return mapCategory(row, 0);
}
