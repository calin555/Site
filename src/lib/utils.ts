import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "RON"): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function isExternalImageUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Hosturi optimizate de next/image (trebuie să corespundă cu
 * `images.remotePatterns` din next.config.ts).
 */
const OPTIMIZED_IMAGE_HOSTS: RegExp[] = [
  /^images\.unsplash\.com$/i,
  /^sc04\.alicdn\.com$/i,
  /(^|\.)supabase\.co$/i,
  /^lh3\.googleusercontent\.com$/i,
];

/**
 * `true` doar când imaginea NU poate trece prin optimizatorul next/image
 * (host necunoscut, SVG, data:/blob:, URL gol). Imaginile din Supabase
 * Storage sunt optimizate (AVIF/WebP + srcset) în loc să fie servite brut.
 */
export function shouldSkipImageOptimization(url: string | null | undefined): boolean {
  const value = url?.trim();
  if (!value) return true;
  if (/^(data|blob):/i.test(value)) return true;
  if (/\.svg(\?|#|$)/i.test(value)) return true;
  if (!isExternalImageUrl(value)) return false;
  try {
    const host = new URL(value).hostname;
    return !OPTIMIZED_IMAGE_HOSTS.some((re) => re.test(host));
  } catch {
    return true;
  }
}

export function slugifyText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
