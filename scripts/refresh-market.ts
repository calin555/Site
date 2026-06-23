import { refreshMarketData } from "../src/lib/comparison/scraper/sync-catalog";

async function main() {
  const result = await refreshMarketData();
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
