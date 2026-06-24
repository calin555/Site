const PRODUCTION_FALLBACK = "https://incarcareauto.ro";
const DEVELOPMENT_FALLBACK = "http://localhost:3000";

/** URL de bază valid — evită build fail când env var e lipsă sau gol. */
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
    ? PRODUCTION_FALLBACK
    : DEVELOPMENT_FALLBACK;
}
