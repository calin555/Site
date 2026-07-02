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
      className="group card-lift energy-border relative block overflow-hidden rounded-2xl border border-surface-200/80 bg-white shadow-elev-1 hover:border-brand-300/60"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-900">
        <CategoryImage
          src={category.image}
          alt={category.name}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/85 via-surface-950/25 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-display text-lg font-bold tracking-tight text-white">{category.name}</h3>
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
