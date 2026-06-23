/**
 * robots.txt checker — respects crawl rules before scraping.
 * Uses simple fetch; no Playwright dependency required for MVP.
 */

export interface RobotsRule {
  path: string;
  allowed: boolean;
}

export async function fetchRobotsTxt(
  origin: string
): Promise<{ rules: RobotsRule[]; crawlDelayMs?: number }> {
  const base = new URL(origin).origin;
  const res = await fetch(`${base}/robots.txt`, {
    headers: { "User-Agent": "ChargePro-MarketBot/1.0" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return { rules: [{ path: "/", allowed: false }] };
  }

  const text = await res.text();
  const lines = text.split("\n");
  let inUserAgent = false;
  const rules: RobotsRule[] = [];
  let crawlDelayMs: number | undefined;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();

    if (key.toLowerCase() === "user-agent") {
      inUserAgent = value === "*" || value.toLowerCase().includes("chargepro");
    } else if (inUserAgent && key.toLowerCase() === "disallow") {
      rules.push({ path: value || "/", allowed: false });
    } else if (inUserAgent && key.toLowerCase() === "allow") {
      rules.push({ path: value, allowed: true });
    } else if (inUserAgent && key.toLowerCase() === "crawl-delay") {
      const sec = parseFloat(value);
      if (!Number.isNaN(sec)) crawlDelayMs = sec * 1000;
    }
  }

  if (rules.length === 0) {
    rules.push({ path: "/", allowed: true });
  }

  return { rules, crawlDelayMs };
}

export function isPathAllowed(path: string, rules: RobotsRule[]): boolean {
  const sorted = [...rules].sort((a, b) => b.path.length - a.path.length);
  for (const rule of sorted) {
    if (path.startsWith(rule.path)) return rule.allowed;
  }
  const hasDisallowAll = rules.some((r) => r.path === "/" && !r.allowed);
  return !hasDisallowAll;
}

export async function assertScrapeAllowed(url: string): Promise<void> {
  const parsed = new URL(url);
  const { rules } = await fetchRobotsTxt(parsed.origin);
  if (!isPathAllowed(parsed.pathname, rules)) {
    throw new Error(`Scraping disallowed by robots.txt: ${parsed.pathname}`);
  }
}
