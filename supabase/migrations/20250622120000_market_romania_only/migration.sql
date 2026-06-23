ALTER TABLE "market_offers" ADD COLUMN "marketCountry" VARCHAR(2) NOT NULL DEFAULT 'RO';
CREATE INDEX "market_offers_marketCountry_isActive_idx" ON "market_offers"("marketCountry", "isActive");

-- Dezactivează ofertele non-RO existente (surse .eu, .de, .com etc.)
UPDATE "market_offers"
SET "isActive" = false
WHERE "sourceUrl" IS NOT NULL
  AND "sourceUrl" NOT LIKE '%.ro%'
  AND "sourceUrl" NOT LIKE '/%'
  AND "sourceType" != 'INTERNAL';
