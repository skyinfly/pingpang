-- Adds geo columns to Venue so /matches can sort by real Haversine distance
-- when the caller supplies user coordinates (mp-weixin or H5 geolocation).
-- All three are nullable: existing seed data without coordinates falls back
-- to the static Venue.distanceKm value already shown today.
ALTER TABLE "Venue"
  ADD COLUMN IF NOT EXISTS "latitude"  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "address"   TEXT;
