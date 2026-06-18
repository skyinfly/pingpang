-- Stable identifier when a venue row was upserted from an AMap POI
-- pick. Unique so a second user selecting the same physical place
-- reuses the existing row instead of creating a duplicate.
ALTER TABLE "Venue" ADD COLUMN IF NOT EXISTS "amapPoiId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Venue_amapPoiId_key" ON "Venue"("amapPoiId");
