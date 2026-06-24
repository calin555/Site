const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];

export function isVideoUrl(url: string): boolean {
  const lower = url.toLowerCase().split("?")[0];
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function dedupeVideoUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of urls) {
    const url = raw.trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    result.push(url);
  }

  return result;
}

export function normalizeVideoUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return dedupeVideoUrls(
    value.filter((item): item is string => typeof item === "string")
  );
}
