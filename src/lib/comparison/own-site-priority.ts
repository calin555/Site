import type { CompareQuery } from "@/types/comparison";
import { powerToClass } from "./normalize";
import type { MatchScoreBreakdown } from "./matching.engine";
import type { NormalizedChargerSpec } from "@/types/comparison";

export type ComparableOffer = {
  id: string;
  spec: NormalizedChargerSpec;
  sourceSite: string;
  sourceUrl?: string;
  sourceLinkActive: boolean;
  isOwnSite: boolean;
} & MatchScoreBreakdown;

function filterOwnSiteCandidates(
  internal: ComparableOffer[],
  query: CompareQuery
): ComparableOffer[] {
  const queryClass = powerToClass(query.power_kw);

  let candidates = internal.filter(
    (m) =>
      m.similarity >= 0.45 &&
      m.electrical_match >= 0.6 &&
      m.spec.power_class === queryClass
  );

  if (query.ocpp && query.ocpp !== "none") {
    const ocppMatches = candidates.filter((m) => m.ocpp_match);
    if (ocppMatches.length > 0) candidates = ocppMatches;
  }

  if (candidates.length === 0) {
    candidates = internal.filter(
      (m) => m.similarity >= 0.35 && m.electrical_match >= 0.5
    );
  }

  return candidates;
}

export function pickBestOwnSiteOffer(
  internal: ComparableOffer[],
  query: CompareQuery
): ComparableOffer | null {
  const candidates = filterOwnSiteCandidates(internal, query);
  if (candidates.length === 0) return null;

  return [...candidates].sort((a, b) => {
    if (b.similarity !== a.similarity) return b.similarity - a.similarity;
    return a.spec.price - b.spec.price;
  })[0];
}

/** Ascunde ofertele externe mai ieftine decât produsul nostru. */
export function applyOwnSitePriority(
  ranked: ComparableOffer[],
  query: CompareQuery
): {
  visible: ComparableOffer[];
  bestOwn: ComparableOffer | null;
} {
  const internal = ranked.filter((o) => o.isOwnSite);
  const external = ranked.filter((o) => !o.isOwnSite);
  const bestOwn = pickBestOwnSiteOffer(internal, query);

  if (!bestOwn) {
    return { visible: ranked, bestOwn: null };
  }

  const floorPrice = bestOwn.spec.price;
  const visibleExternal = external.filter((o) => o.spec.price >= floorPrice);
  const visibleInternal = internal.filter((o) => o.similarity >= 0.35);

  const visible = [...visibleInternal, ...visibleExternal].sort((a, b) => {
    if (a.isOwnSite !== b.isOwnSite) return a.isOwnSite ? -1 : 1;
    return b.similarity - a.similarity;
  });

  return { visible, bestOwn };
}
