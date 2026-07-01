export interface GscPerformanceRow {
  query: string;
  page: string;
  position: number;
  ctr: number;
  impressions: number;
  clicks: number;
}

export type OptimizationAction =
  | "rewrite_title"
  | "rewrite_meta"
  | "improve_h1"
  | "add_cta"
  | "add_internal_links"
  | "enrich_content";

export interface SeoOpportunity {
  page: string;
  query: string;
  position: number;
  ctr: number;
  expectedCtr: number;
  ctrGap: number;
  impressions: number;
  priorityScore: number;
  suggestedActions: OptimizationAction[];
  rationale: string;
}

/** CTR așteptat aproximativ după poziție (benchmark SERP EV România). */
export function expectedCtrForPosition(position: number): number {
  if (position <= 1) return 0.28;
  if (position <= 3) return 0.12;
  if (position <= 5) return 0.07;
  if (position <= 10) return 0.04;
  if (position <= 15) return 0.025;
  if (position <= 20) return 0.018;
  return 0.01;
}

export interface OpportunityEngineOptions {
  minPosition?: number;
  maxPosition?: number;
  minImpressions?: number;
  ctrGapThreshold?: number;
}

const DEFAULT_OPTIONS: Required<OpportunityEngineOptions> = {
  minPosition: 8,
  maxPosition: 20,
  minImpressions: 50,
  ctrGapThreshold: 0.005,
};

/**
 * Identifică pagini cu poziții 8–20 și CTR sub benchmark — candidate pentru optimizare CTR.
 * Import CSV GSC: query, page, position, ctr, impressions, clicks
 */
export function identifyOptimizationOpportunities(
  rows: GscPerformanceRow[],
  options: OpportunityEngineOptions = {}
): SeoOpportunity[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const opportunities: SeoOpportunity[] = [];

  for (const row of rows) {
    if (row.position < opts.minPosition || row.position > opts.maxPosition) continue;
    if (row.impressions < opts.minImpressions) continue;

    const expected = expectedCtrForPosition(row.position);
    const ctrGap = expected - row.ctr;
    if (ctrGap < opts.ctrGapThreshold) continue;

    const suggestedActions: OptimizationAction[] = [];
    if (ctrGap >= 0.02) {
      suggestedActions.push("rewrite_title", "rewrite_meta");
    } else {
      suggestedActions.push("rewrite_meta");
    }
    if (row.position <= 12) {
      suggestedActions.push("improve_h1", "add_cta");
    }
    suggestedActions.push("add_internal_links");

    const priorityScore = Math.round(
      ctrGap * 1000 + row.impressions * 0.01 + (21 - row.position) * 2
    );

    opportunities.push({
      page: row.page,
      query: row.query,
      position: row.position,
      ctr: row.ctr,
      expectedCtr: expected,
      ctrGap: Math.round(ctrGap * 1000) / 1000,
      impressions: row.impressions,
      priorityScore,
      suggestedActions,
      rationale: `Poziția ${row.position.toFixed(1)} cu CTR ${(row.ctr * 100).toFixed(1)}% vs așteptat ${(expected * 100).toFixed(1)}% — ${row.impressions} impresii neconvertite.`,
    });
  }

  return opportunities.sort((a, b) => b.priorityScore - a.priorityScore);
}

/** Parsează CSV export GSC (header: Query, Page, Position, CTR, Impressions, Clicks). */
export function parseGscCsv(csv: string): GscPerformanceRow[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase();
  const hasHeader =
    header.includes("query") && header.includes("page") && header.includes("position");

  const dataLines = hasHeader ? lines.slice(1) : lines;
  const rows: GscPerformanceRow[] = [];

  for (const line of dataLines) {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length < 6) continue;

    const ctrRaw = cols[3].replace("%", "");
    const ctr = parseFloat(ctrRaw) > 1 ? parseFloat(ctrRaw) / 100 : parseFloat(ctrRaw);

    rows.push({
      query: cols[0],
      page: cols[1],
      position: parseFloat(cols[2]),
      ctr: isNaN(ctr) ? 0 : ctr,
      impressions: parseInt(cols[4], 10) || 0,
      clicks: parseInt(cols[5], 10) || 0,
    });
  }

  return rows;
}

export function mapOpportunityToLandingOverride(
  opp: SeoOpportunity
): { slug: string; actions: OptimizationAction[] } | null {
  try {
    const url = new URL(opp.page);
    const slug = url.pathname.replace(/^\//, "").replace(/\/$/, "");
    if (!slug.startsWith("statie-incarcare")) return null;
    return { slug, actions: opp.suggestedActions };
  } catch {
    return null;
  }
}
