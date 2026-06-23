"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  createCategoryAction,
  saveCategoryAction,
} from "@/lib/actions/admin/category.actions";
import { slugifyText } from "@/lib/utils";
import type { Category } from "@/lib/mock-data";

interface CategoryEditorFormProps {
  category?: Category;
}

export function CategoryEditorForm({ category }: CategoryEditorFormProps) {
  const isNew = !category;
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  const [isPending, startTransition] = useTransition();

  const slugPreview = useMemo(
    () => (isNew ? slugifyText(name) : category.slug),
    [isNew, name, category?.slug]
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    startTransition(async () => {
      const payload = { name, description, image };
      const result = isNew
        ? await createCategoryAction(payload)
        : await saveCategoryAction({ id: category.id, ...payload });

      if (result.success) {
        router.push("/admin/categorii");
        router.refresh();
      } else {
        setErrors(result.errors);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {errors.form && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.form}
        </p>
      )}

      <Input
        label="Nume categorie"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ex. Baterii, Panouri solare"
        error={errors.name}
        required
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-surface-800">
          Slug
        </label>
        <p className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-surface-600">
          {slugPreview || "—"}
        </p>
        {isNew && (
          <p className="mt-1 text-xs text-surface-500">
            Se generează automat din nume (ex. „Panouri solare” → panouri-solare)
          </p>
        )}
      </div>

      <Textarea
        label="Descriere"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        error={errors.description}
        required
      />

      <ImageUploadField
        name="image"
        defaultValue={image}
        onValueChange={setImage}
        uploadFolder="categories"
        error={errors.image}
        required
      />

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isNew ? "Adaugă categoria" : "Salvează categoria"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categorii")}
        >
          Anulează
        </Button>
      </div>
    </form>
  );
}
