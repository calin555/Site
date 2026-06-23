ALTER TABLE "market_offers" ADD COLUMN "sourceUrlActive" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "market_offers" ADD COLUMN "sourceUrlCheckedAt" TIMESTAMP(3);

UPDATE "market_offers"
SET "sourceUrlActive" = true
WHERE "sourceType" = 'INTERNAL' OR "sourceUrl" LIKE '/%';

UPDATE "market_offers"
SET "isActive" = false, "sourceUrlActive" = false
WHERE "sourceUrl" IS NOT NULL
  AND "sourceUrl" NOT LIKE '/%'
  AND "sourceType" = 'SCRAPED';
