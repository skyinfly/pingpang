-- Ensure all surfaced venues have a usable distance for create-match and match-options.
UPDATE "Venue"
SET "distanceKm" = CASE
  WHEN "id" = 'venue-seed-1' THEN 1.8
  WHEN "id" = 'venue-seed-2' THEN 3.2
  WHEN "id" = 'venue-inactive-1' THEN 4.9
  ELSE "distanceKm"
END
WHERE "distanceKm" IS NULL OR "id" IN ('venue-seed-1', 'venue-seed-2', 'venue-inactive-1');

ALTER TABLE "Venue"
ALTER COLUMN "distanceKm" SET NOT NULL;
