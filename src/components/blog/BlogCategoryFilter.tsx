"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { BlogCategory } from "@/types/blog";

interface BlogCategoryFilterProps {
  categories: BlogCategory[];
}

export function BlogCategoryFilter({ categories }: BlogCategoryFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("categorie");

  const isAllActive = pathname === "/blog" && !activeCategory;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          isAllActive
            ? "bg-brand-600 text-white"
            : "border border-surface-200 text-surface-600 hover:border-brand-300 hover:text-brand-700"
        )}
      >
        Toate
      </Link>
      {categories.map((cat) => {
        const href = `/blog/categorie/${cat.slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={cat.id}
            href={href}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-600 text-white"
                : "border border-surface-200 text-surface-600 hover:border-brand-300 hover:text-brand-700"
            )}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
