"use client";

import { useRef, useState } from "react";
import { Upload, Link as LinkIcon, Loader2, X, Film } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { dedupeVideoUrls } from "@/lib/product-videos";

interface ProductVideosFieldProps {
  videos: string[];
  onChange: (videos: string[]) => void;
  error?: string;
  productName?: string;
}

export function ProductVideosField({
  videos,
  onChange,
  error,
  productName,
}: ProductVideosFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function addVideos(urls: string[]) {
    onChange(dedupeVideoUrls([...videos, ...urls]));
  }

  function removeVideo(index: number) {
    onChange(videos.filter((_, i) => i !== index));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadError("");
    setUploading(true);

    try {
      const uploaded: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "products");
        formData.append("mediaType", "video");

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
          setUploadError(data.error ?? "Upload eșuat");
          break;
        }

        uploaded.push(data.url);
      }

      if (uploaded.length) addVideos(uploaded);
    } catch {
      setUploadError("Eroare la încărcare. Încearcă din nou.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleAddUrl() {
    const url = urlInput.trim();
    if (!url) return;
    addVideos([url]);
    setUrlInput("");
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-surface-800">
          Video produs <span className="font-normal text-surface-400">(opțional)</span>
        </label>
        <p className="mt-1 text-xs text-surface-500">
          Încarcă unul sau mai multe clipuri video (demo, montaj, prezentare) — apar pe pagina
          produsului sub galeria foto.
        </p>
      </div>

      {videos.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {videos.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative rounded-xl border border-surface-200 bg-white p-2"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg bg-surface-900">
                <video
                  src={url}
                  controls
                  preload="metadata"
                  className="h-full w-full object-contain"
                  aria-label={
                    productName ? `Video ${productName} ${index + 1}` : `Video produs ${index + 1}`
                  }
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-surface-500">
                  <Film className="h-3.5 w-3.5" />
                  Video {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="rounded-lg p-1 text-surface-400 hover:bg-red-50 hover:text-red-500"
                  aria-label="Șterge video"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-surface-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-surface-800">Adaugă video</p>
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

        {mode === "upload" ? (
          <div
            className={cn(
              "relative rounded-xl border-2 border-dashed p-5 text-center transition-colors",
              uploading
                ? "border-brand-300 bg-brand-50/50"
                : "border-surface-200 hover:border-brand-300"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-surface-600">
                <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
                <p className="text-sm">Se încarcă videoclipul...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Film className="h-7 w-7 text-surface-400" />
                <p className="text-sm font-medium text-surface-700">
                  Click sau trage un fișier video
                </p>
                <p className="text-xs text-surface-500">MP4, WebM, MOV — max 50 MB</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://exemplu.ro/video.mp4"
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={handleAddUrl}>
              Adaugă URL
            </Button>
          </div>
        )}

        {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
