import Link from "next/link";
import type { BlogTag } from "@/types/blog";

interface BlogTagsProps {
  tags: BlogTag[];
  size?: "sm" | "md";
}

export function BlogTags({ tags, size = "md" }: BlogTagsProps) {
  if (tags.length === 0) return null;

  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/blog/tag/${tag.slug}`}
          className={`rounded-full border border-surface-200 bg-surface-50 font-medium text-surface-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 ${sizeClass}`}
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
}
