"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { buildCatalogUrl } from "@/lib/catalog/urls";
import { cn } from "@/lib/utils";

export function HeaderSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;

    startTransition(() => {
      router.push(buildCatalogUrl("/produse", { sort: "popular" }, { q, page: 1 }));
      close();
    });
  }

  return (
    <>
      <button
        type="button"
        aria-label="Căutare produse"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="relative z-[1] rounded-xl p-2.5 text-surface-600 transition-colors hover:bg-surface-100"
      >
        <Search className="h-5 w-5" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[200]"
          role="dialog"
          aria-modal="true"
          aria-label="Căutare produse"
        >
          <button
            type="button"
            aria-label="Închide căutarea"
            className="absolute inset-0 bg-surface-900/60"
            onClick={close}
          />

          <div className="relative w-full border-b border-surface-200 bg-white shadow-lg">
            <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6">
              <form onSubmit={submit} className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                  <input
                    ref={inputRef}
                    type="search"
                    enterKeyHint="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Caută stații, branduri..."
                    className="h-11 w-full rounded-xl border border-surface-200 bg-surface-50 pl-10 pr-10 text-base text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    autoComplete="off"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600"
                      aria-label="Șterge căutarea"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={!query.trim() || isPending}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors",
                    query.trim()
                      ? "bg-brand-600 text-white hover:bg-brand-700"
                      : "cursor-not-allowed bg-surface-100 text-surface-400"
                  )}
                >
                  {isPending ? "..." : "Caută"}
                </button>

                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-800"
                  aria-label="Închide"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
