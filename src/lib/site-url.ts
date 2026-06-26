import { PRIMARY_DOMAIN, SITE_DOMAINS } from "@/config/domains";

const DEVELOPMENT_FALLBACK = "http://localhost:3000";

const SITE_DOMAIN_SET = new Set<string>(SITE_DOMAINS);

/** Elimină portul și normalizează hostname-ul. */
export function normalizeHost(host: string): string {
  return host.split(":")[0]?.toLowerCase().trim() ?? "";
}

export function isSiteDomain(host: string): boolean {
  const normalized = normalizeHost(host);
  return SITE_DOMAIN_SET.has(normalized);
}

export function isAllowedSiteHost(host: string): boolean {
  const normalized = normalizeHost(host);

  if (!normalized) return false;
  if (normalized === "localhost") return true;
  if (isSiteDomain(normalized)) return true;
  if (normalized.startsWith("www.") && isSiteDomain(normalized.slice(4))) {
    return true;
  }
  if (normalized.endsWith(".vercel.app")) return true;

  return false;
}

/** URL de bază canonical (SEO, sitemap, JSON-LD). */
export function getSiteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      // URL invalid în env — continuă cu fallback
    }
  }

  return process.env.NODE_ENV === "production"
    ? `https://${PRIMARY_DOMAIN}`
    : DEVELOPMENT_FALLBACK;
}

/** Origin din request — pentru OAuth, redirect-uri, link-uri dinamice. */
export function getRequestOrigin(request: Request | URL): string {
  const url = request instanceof URL ? request : new URL(request.url);
  const host = normalizeHost(
    request instanceof Request
      ? (request.headers.get("x-forwarded-host") ??
          request.headers.get("host") ??
          url.host)
      : url.host
  );

  if (isAllowedSiteHost(host)) {
    const protocol =
      request instanceof Request &&
      (request.headers.get("x-forwarded-proto") === "https" ||
        url.protocol === "https:")
        ? "https"
        : url.protocol === "https:"
          ? "https"
          : process.env.NODE_ENV === "production"
            ? "https"
            : "http";

    return `${protocol}://${host}`;
  }

  return getSiteBaseUrl();
}
