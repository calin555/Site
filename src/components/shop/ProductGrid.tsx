import type { CatalogProduct } from "@/types/catalog";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: CatalogProduct[];
  columns?: 2 | 3 | 4;
}

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export function ProductGrid({ products, columns = 3 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-300 bg-surface-50 py-16 text-center">
        <p className="text-surface-500">Nu am găsit produse în această categorie.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${columnClasses[columns]}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
