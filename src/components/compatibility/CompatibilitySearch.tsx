"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchVehicles } from "@/lib/compatibility/search";
import type { VehicleSearchResult } from "@/lib/compatibility/types";

interface CompatibilitySearchProps {
  autoFocus?: boolean;
  size?: "default" | "large";
  className?: string;
}

export function CompatibilitySearch({
  autoFocus = false,
  size = "default",
  className,
}: CompatibilitySearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VehicleSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback((value: string) => {
    const found = searchVehicles(value);
    setResults(found);
    setOpen(found.length > 0 && value.trim().length > 0);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 120);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectVehicle(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/compatibilitate/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      selectVehicle(results[activeIndex].slug);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const isLarge = size === "large";

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "compat-search-glow energy-border-live relative flex items-center gap-3 rounded-2xl border border-surface-200/80 bg-white shadow-elev-2 transition-shadow duration-300 focus-within:border-brand-400/60 focus-within:shadow-elev-3",
          isLarge ? "px-5 py-4" : "px-4 py-3"
        )}
      >
        <Search
          className={cn(
            "shrink-0 text-brand-500",
            isLarge ? "h-6 w-6" : "h-5 w-5"
          )}
        />
        <input
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls="compat-search-list"
          autoFocus={autoFocus}
          placeholder="Caută vehicul — ex. Tesla Model Y, BMW i4, Dacia Spring..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0 && query.trim()) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full bg-transparent text-surface-900 placeholder:text-surface-400 focus:outline-none",
            isLarge ? "text-lg" : "text-base"
          )}
        />
      </div>

      {open && results.length > 0 && (
        <ul
          id="compat-search-list"
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-auto rounded-2xl border border-surface-200 bg-white py-2 shadow-elev-3"
        >
          {results.map((result, index) => (
            <li key={result.slug} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onClick={() => selectVehicle(result.slug)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                  index === activeIndex
                    ? "bg-brand-50 text-brand-900"
                    : "text-surface-800 hover:bg-surface-50"
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  <Car className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{result.label}</span>
                  <span className="block text-sm text-surface-500">
                    {result.subtitle}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
