import { BlogCard } from "@/components/shop/BlogCard";
import { toLegacyPost } from "@/types/blog";
import type { BlogArticleWithRelations } from "@/types/blog";

interface RelatedArticlesProps {
  articles: BlogArticleWithRelations[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12 border-t border-surface-200 pt-10">
      <h2 className="mb-6 text-xl font-bold text-surface-900">
        Articole similare
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <BlogCard key={article.id} post={toLegacyPost(article)} />
        ))}
      </div>
    </section>
  );
}
