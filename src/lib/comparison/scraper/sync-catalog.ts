import {
  dbRecomputeMarketClusters,
  dbSeedScrapedOffers,
  dbSyncCatalogToMarketOffers,
  dbVerifyAllMarketOfferUrls,
} from "@/lib/db/market-offer.repository";
import { SAMPLE_MARKET_OFFERS } from "@/lib/comparison/sample-data";

export interface MarketRefreshResult {
  catalogSynced: number;
  sampleSeeded: number;
  clustersRecomputed: number;
  urlsVerified: number;
  urlsBroken: number;
  refreshedAt: string;
}

export async function refreshMarketData(): Promise<MarketRefreshResult> {
  const catalogSynced = await dbSyncCatalogToMarketOffers();

  const existingCount = catalogSynced;
  let sampleSeeded = 0;
  if (existingCount === 0) {
    sampleSeeded = await dbSeedScrapedOffers(SAMPLE_MARKET_OFFERS);
  }

  const urlCheck = await dbVerifyAllMarketOfferUrls();
  const clustersRecomputed = await dbRecomputeMarketClusters();

  return {
    catalogSynced,
    sampleSeeded,
    clustersRecomputed,
    urlsVerified: urlCheck.checked,
    urlsBroken: urlCheck.broken,
    refreshedAt: new Date().toISOString(),
  };
}
