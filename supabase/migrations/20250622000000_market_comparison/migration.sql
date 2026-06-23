-- CreateEnum
CREATE TYPE "ChargerType" AS ENUM ('AC', 'DC');
CREATE TYPE "OcppVersion" AS ENUM ('NONE', 'OCPP_1_6J', 'OCPP_2_0_1');
CREATE TYPE "MarketSourceType" AS ENUM ('INTERNAL', 'SCRAPED', 'MANUAL');
CREATE TYPE "ChargerTier" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'ENTERPRISE');

-- CreateTable
CREATE TABLE "market_offers" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "sourceType" "MarketSourceType" NOT NULL DEFAULT 'MANUAL',
    "sourceUrl" VARCHAR(500),
    "specFingerprint" VARCHAR(64) NOT NULL,
    "powerKw" DECIMAL(5,2) NOT NULL,
    "phase" "PhaseType" NOT NULL,
    "currentAmps" DECIMAL(6,2),
    "chargerType" "ChargerType" NOT NULL,
    "connectorTypes" "ConnectorType"[],
    "ipRating" VARCHAR(10),
    "mountingType" "MountingType",
    "ocppVersion" "OcppVersion" NOT NULL DEFAULT 'NONE',
    "loadBalancing" BOOLEAN NOT NULL DEFAULT false,
    "smartCharging" BOOLEAN NOT NULL DEFAULT false,
    "rfidControl" BOOLEAN NOT NULL DEFAULT false,
    "appControl" BOOLEAN NOT NULL DEFAULT false,
    "backendConnectivity" BOOLEAN NOT NULL DEFAULT false,
    "remoteManagement" BOOLEAN NOT NULL DEFAULT false,
    "firmwareOta" BOOLEAN NOT NULL DEFAULT false,
    "ocppConfidence" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "ocppClaimSuspicious" BOOLEAN NOT NULL DEFAULT false,
    "tier" "ChargerTier" NOT NULL DEFAULT 'RESIDENTIAL',
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'RON',
    "rawText" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastScrapedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_offers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "market_offer_price_history" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'RON',
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_offer_price_history_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "market_clusters" (
    "id" TEXT NOT NULL,
    "powerClass" VARCHAR(10) NOT NULL,
    "ocppVersion" "OcppVersion" NOT NULL,
    "chargerType" "ChargerType" NOT NULL,
    "avgPrice" DECIMAL(10,2) NOT NULL,
    "minPrice" DECIMAL(10,2) NOT NULL,
    "maxPrice" DECIMAL(10,2) NOT NULL,
    "sampleCount" INTEGER NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_clusters_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "market_offers_productId_key" ON "market_offers"("productId");
CREATE INDEX "market_offers_powerKw_ocppVersion_chargerType_isActive_idx" ON "market_offers"("powerKw", "ocppVersion", "chargerType", "isActive");
CREATE INDEX "market_offers_specFingerprint_idx" ON "market_offers"("specFingerprint");
CREATE INDEX "market_offers_isActive_chargerType_idx" ON "market_offers"("isActive", "chargerType");
CREATE INDEX "market_offer_price_history_offerId_recordedAt_idx" ON "market_offer_price_history"("offerId", "recordedAt" DESC);
CREATE UNIQUE INDEX "market_clusters_powerClass_ocppVersion_chargerType_key" ON "market_clusters"("powerClass", "ocppVersion", "chargerType");
CREATE INDEX "market_clusters_computedAt_idx" ON "market_clusters"("computedAt" DESC);

ALTER TABLE "market_offer_price_history" ADD CONSTRAINT "market_offer_price_history_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "market_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "market_offers" ADD CONSTRAINT "market_offer_price_positive" CHECK ("price" > 0);
