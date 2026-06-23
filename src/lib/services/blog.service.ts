import { blogStore } from "@/lib/blog/blog-store";
import type {
  BlogArticle,
  BlogArticleWithRelations,
  BlogCategory,
  BlogTag,
  LegacyBlogPost,
} from "@/types/blog";
import { toLegacyPost } from "@/types/blog";

function enrichArticle(article: BlogArticle): BlogArticleWithRelations | null {
  const category = blogStore.getCategoryById(article.categoryId);
  if (!category) return null;

  const tags = article.tagIds
    .map((id) => blogStore.getTags().find((t) => t.id === id))
    .filter((t): t is BlogTag => t !== undefined);

  return { ...article, category, tags };
}

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(words / 200));
}

export function getBlogCategories(): BlogCategory[] {
  return blogStore.getCategories();
}

export function getBlogCategoryBySlug(slug: string): BlogCategory | undefined {
  return blogStore.getCategoryBySlug(slug);
}

export function getBlogTags(): BlogTag[] {
  return blogStore.getTags();
}

export function getBlogTagBySlug(slug: string): BlogTag | undefined {
  return blogStore.getTagBySlug(slug);
}

export function getPublishedArticles(): BlogArticleWithRelations[] {
  return blogStore
    .getArticles(true)
    .map(enrichArticle)
    .filter((a): a is BlogArticleWithRelations => a !== null);
}

export function getAllArticles(): BlogArticleWithRelations[] {
  return blogStore
    .getArticles(false)
    .map(enrichArticle)
    .filter((a): a is BlogArticleWithRelations => a !== null);
}

export function getArticleBySlug(
  slug: string
): BlogArticleWithRelations | null {
  const article = blogStore.getArticleBySlug(slug);
  if (!article || !article.isPublished) return null;
  return enrichArticle(article);
}

export function getArticleById(id: string): BlogArticleWithRelations | null {
  const article = blogStore.getArticleById(id);
  if (!article) return null;
  return enrichArticle(article);
}

export function getArticlesByCategory(
  categorySlug: string
): BlogArticleWithRelations[] {
  const category = blogStore.getCategoryBySlug(categorySlug);
  if (!category) return [];
  return getPublishedArticles().filter((a) => a.categoryId === category.id);
}

export function getArticlesByTag(
  tagSlug: string
): BlogArticleWithRelations[] {
  const tag = blogStore.getTagBySlug(tagSlug);
  if (!tag) return [];
  return getPublishedArticles().filter((a) => a.tagIds.includes(tag.id));
}

export function getRelatedArticles(
  article: BlogArticleWithRelations,
  limit = 3
): BlogArticleWithRelations[] {
  const all = getPublishedArticles().filter((a) => a.id !== article.id);

  const scored = all.map((a) => {
    let score = 0;
    if (a.categoryId === article.categoryId) score += 3;
    const sharedTags = a.tagIds.filter((t) => article.tagIds.includes(t));
    score += sharedTags.length * 2;
    return { article: a, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.article);
}

export function getLegacyBlogPosts(): LegacyBlogPost[] {
  return getPublishedArticles().map(toLegacyPost);
}

export function getFeaturedPosts(limit = 3): BlogArticleWithRelations[] {
  return getPublishedArticles().slice(0, limit);
}

export function upsertArticle(
  data: Partial<BlogArticle> & { title: string; slug: string; content: string }
): BlogArticle {
  const existing = data.id ? blogStore.getArticleById(data.id) : undefined;
  const now = new Date().toISOString();

  const article: BlogArticle = {
    id: existing?.id ?? `art_${Date.now()}`,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt ?? "",
    content: data.content,
    coverImage: data.coverImage ?? existing?.coverImage ?? "",
    categoryId: data.categoryId ?? existing?.categoryId ?? "cat_ghiduri",
    tagIds: data.tagIds ?? existing?.tagIds ?? [],
    author: data.author ?? existing?.author ?? "Echipa ChargePro",
    publishedAt: data.publishedAt ?? existing?.publishedAt ?? now.split("T")[0],
    updatedAt: now,
    readTime: estimateReadTime(data.content),
    isPublished: data.isPublished ?? existing?.isPublished ?? false,
    seo: data.seo ?? existing?.seo ?? {},
  };

  blogStore.saveArticle(article);
  return article;
}

export function deleteArticle(id: string): boolean {
  return blogStore.deleteArticle(id);
}

export function generateStaticArticleParams(): { slug: string }[] {
  return blogStore.getArticles(true).map((a) => ({ slug: a.slug }));
}
