import type { BlogArticle, BlogCategory, BlogTag } from "@/types/blog";
import {
  BLOG_CATEGORIES,
  BLOG_TAGS,
  buildInitialArticles,
} from "@/lib/blog/templates";

class BlogStore {
  private categories: BlogCategory[] = [...BLOG_CATEGORIES];
  private tags: BlogTag[] = [...BLOG_TAGS];
  private articles: BlogArticle[] = buildInitialArticles();

  getCategories(): BlogCategory[] {
    return this.categories;
  }

  getCategoryBySlug(slug: string): BlogCategory | undefined {
    return this.categories.find((c) => c.slug === slug);
  }

  getCategoryById(id: string): BlogCategory | undefined {
    return this.categories.find((c) => c.id === id);
  }

  getTags(): BlogTag[] {
    return this.tags;
  }

  getTagBySlug(slug: string): BlogTag | undefined {
    return this.tags.find((t) => t.slug === slug);
  }

  getArticles(publishedOnly = true): BlogArticle[] {
    const list = publishedOnly
      ? this.articles.filter((a) => a.isPublished)
      : [...this.articles];
    return list.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  getArticleBySlug(slug: string): BlogArticle | undefined {
    return this.articles.find((a) => a.slug === slug);
  }

  getArticleById(id: string): BlogArticle | undefined {
    return this.articles.find((a) => a.id === id);
  }

  saveArticle(article: BlogArticle): void {
    const idx = this.articles.findIndex((a) => a.id === article.id);
    if (idx >= 0) this.articles[idx] = article;
    else this.articles.push(article);
  }

  deleteArticle(id: string): boolean {
    const before = this.articles.length;
    this.articles = this.articles.filter((a) => a.id !== id);
    return this.articles.length < before;
  }

  saveCategory(category: BlogCategory): void {
    const idx = this.categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) this.categories[idx] = category;
    else this.categories.push(category);
  }

  saveTag(tag: BlogTag): void {
    const idx = this.tags.findIndex((t) => t.id === tag.id);
    if (idx >= 0) this.tags[idx] = tag;
    else this.tags.push(tag);
  }
}

export const blogStore = new BlogStore();
