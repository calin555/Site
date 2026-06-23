"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Link as LinkIcon, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  name?: string;
  defaultValue?: string;
  onValueChange?: (url: string) => void;
  uploadFolder?: "products" | "categories";
  error?: string;
  required?: boolean;
}

export function ImageUploadField({
  name = "image",
  defaultValue = "",
  onValueChange,
  uploadFolder = "products",
  error,
  required,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const [mode, setMode] = useState<"upload" | "url">(defaultValue ? "url" : "upload");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    setImageUrl(defaultValue);
    if (defaultValue) setMode("url");
  }, [defaultValue]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", uploadFolder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Upload eșuat");
        return;
      }

      setImageUrl(data.url);
      onValueChange?.(data.url);
    } catch {
      setUploadError("Eroare la încărcare. Încearcă din nou.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-surface-800">
          Imagine produs {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex gap-1 rounded-lg border border-surface-200 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 transition-colors",
              mode === "upload"
                ? "bg-brand-100 font-medium text-brand-700"
                : "text-surface-500 hover:text-surface-800"
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            Din PC
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 transition-colors",
              mode === "url"
                ? "bg-brand-100 font-medium text-brand-700"
                : "text-surface-500 hover:text-surface-800"
            )}
          >
            <LinkIcon className="h-3.5 w-3.5" />
            URL
          </button>
        </div>
      </div>

      {!imageUrl && required && (
        <p className="text-xs text-surface-600">
          Obligatoriu — încarcă o poză cu produsul. Catalogul PDF completează doar
          descrierea, nu și imaginea.
        </p>
      )}

      {mode === "upload" ? (
        <div
          className={cn(
            "relative rounded-xl border-2 border-dashed p-6 text-center transition-colors",
            uploading
              ? "border-brand-300 bg-brand-50/50"
              : "border-surface-200 hover:border-brand-300"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-surface-600">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
              <p className="text-sm">Se încarcă imaginea...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-surface-400" />
              <p className="text-sm font-medium text-surface-700">
                Click sau trage imaginea aici
              </p>
              <p className="text-xs text-surface-500">JPG, PNG, WebP, GIF — max 5 MB</p>
            </div>
          )}
        </div>
      ) : (
        <Input
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value);
            onValueChange?.(e.target.value);
          }}
          placeholder="https://exemplu.ro/imagine.jpg"
          error={error}
        />
      )}

      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
      {error && mode === "upload" && !imageUrl && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {imageUrl && (
        <div className="flex items-start gap-4 rounded-xl border border-brand-200 bg-brand-50/30 p-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white">
            <Image
              src={imageUrl}
              alt="Previzualizare"
              fill
              className="object-cover"
              unoptimized={
                imageUrl.startsWith("/uploads/") || imageUrl.includes("alicdn.com") || imageUrl.startsWith("http")
              }
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-surface-500">Previzualizare</p>
            <p className="truncate text-sm text-surface-700">{imageUrl}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setImageUrl("");
              onValueChange?.("");
            }}
            className="rounded-lg p-1.5 text-surface-400 hover:bg-white hover:text-red-500"
            aria-label="Șterge imagine"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <input type="hidden" name={name} value={imageUrl} required={required} />
    </div>
  );
}
