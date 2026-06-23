import fs from "fs";

const source = fs.readFileSync("src/lib/services/catalog.service.ts", "utf8");
const match = source.match(
  /const CATALOG_PRODUCTS: CatalogProduct\[\] = (\[[\s\S]*?\n\]);/
);
if (!match) throw new Error("Could not extract CATALOG_PRODUCTS");

const out = `import type { CatalogProduct } from "@/types/catalog";

export const SEED_CATALOG_PRODUCTS: CatalogProduct[] = ${match[1]};
`;

fs.mkdirSync("src/lib/catalog", { recursive: true });
fs.writeFileSync("src/lib/catalog/seed-products.ts", out);
console.log("Extracted seed products");
