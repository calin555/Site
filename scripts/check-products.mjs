import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Setează NEXT_PUBLIC_SUPABASE_URL și SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: products, error } = await supabase
  .from("products")
  .select(`
    *,
    category:categories!products_categoryId_fkey(name, slug),
    brand:brands!products_brandId_fkey(name, slug),
    images:product_images(*)
  `);

if (error) {
  console.error(error);
  process.exit(1);
}

console.log("DB products:", products?.length ?? 0);
for (const p of products ?? []) {
  const images = p.images ?? [];
  console.log("-", p.name, p.isPublished, images[0]?.url ?? "no image");
}
