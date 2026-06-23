import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryImage } from "@/components/shop/CategoryImage";
import type { Category } from "@/lib/mock-data";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/produse/categorie/${category.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-900">
        <CategoryImage
          src={category.image}
          alt={category.name}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-surface-900/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-lg font-bold text-white">{category.name}</h3>
        <p className="mt-1 text-sm text-surface-300 line-clamp-2">
          {category.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-medium text-brand-300">
            {category.productCount} produse
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
            Vezi produse <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
