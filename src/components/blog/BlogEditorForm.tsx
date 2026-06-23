"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/blog/RichTextEditor";
import { saveBlogArticleAction } from "@/lib/actions/blog.actions";
import type { BlogArticleWithRelations, BlogCategory, BlogTag } from "@/types/blog";

interface BlogEditorFormProps {
  article?: BlogArticleWithRelations;
  categories: BlogCategory[];
  tags: BlogTag[];
}

export function BlogEditorForm({
  article,
  categories,
  tags,
}: BlogEditorFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [content, setContent] = useState(article?.content ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    article?.tagIds ?? []
  );
  const [isPending, startTransition] = useTransition();

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId]
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    setErrors({});
    startTransition(async () => {
      const result = await saveBlogArticleAction({
        id: article?.id,
        title: form.get("title"),
        slug: form.get("slug"),
        excerpt: form.get("excerpt"),
        content,
        coverImage: form.get("coverImage"),
        categoryId: form.get("categoryId"),
        tagIds: selectedTags,
        author: form.get("author"),
        publishedAt: form.get("publishedAt"),
        isPublished: form.get("isPublished") === "on",
        seo: {
          metaTitle: form.get("metaTitle"),
          metaDescription: form.get("metaDescription"),
          keywords: String(form.get("keywords") ?? "")
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        },
      });

      if (!result.success) {
        setErrors(result.errors);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors._form && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors._form}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <Input
          label="Titlu *"
          name="title"
          defaultValue={article?.title}
          error={errors.title}
          required
        />
        <Input
          label="Slug *"
          name="slug"
          defaultValue={article?.slug}
          error={errors.slug}
          required
        />
      </div>

      <Input
        label="Extras *"
        name="excerpt"
        defaultValue={article?.excerpt}
        error={errors.excerpt}
        required
      />

      <Input
        label="Imagine copertă (URL)"
        name="coverImage"
        defaultValue={article?.coverImage}
        error={errors.coverImage}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-surface-800">
            Categorie *
          </label>
          <select
            name="categoryId"
            defaultValue={article?.categoryId ?? categories[0]?.id}
            required
            className="h-11 w-full rounded-xl border border-surface-200 px-4 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Autor"
          name="author"
          defaultValue={article?.author ?? "Echipa ChargePro"}
        />
        <Input
          label="Data publicării"
          name="publishedAt"
          type="date"
          defaultValue={article?.publishedAt}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-surface-800">
          Tag-uri
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedTags.includes(tag.id)
                  ? "bg-brand-600 text-white"
                  : "border border-surface-200 text-surface-600 hover:border-brand-300"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-surface-800">
          Conținut *
        </label>
        <RichTextEditor value={content} onChange={setContent} />
        {errors.content && (
          <p className="mt-1 text-xs text-red-600">{errors.content}</p>
        )}
      </div>

      <div className="rounded-xl border border-surface-200 bg-surface-50 p-5">
        <h3 className="mb-4 font-bold text-surface-900">SEO Metadata</h3>
        <div className="space-y-4">
          <Input
            label="Meta Title"
            name="metaTitle"
            defaultValue={article?.seo.metaTitle}
            hint="Max 70 caractere recomandat"
          />
          <Input
            label="Meta Description"
            name="metaDescription"
            defaultValue={article?.seo.metaDescription}
            hint="Max 160 caractere recomandat"
          />
          <Input
            label="Keywords (separate prin virgulă)"
            name="keywords"
            defaultValue={article?.seo.keywords?.join(", ")}
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={article?.isPublished ?? false}
          className="h-4 w-4 rounded text-brand-600"
        />
        <span className="text-sm font-medium">Publicat</span>
      </label>

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {article ? "Salvează modificările" : "Publică articolul"}
      </Button>
    </form>
  );
}
