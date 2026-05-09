-- Add venue-backed distance for create-match derivation and match-options display.
ALTER TABLE "Venue"
ADD COLUMN "distanceKm" DOUBLE PRECISION;
