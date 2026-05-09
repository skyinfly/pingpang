-- AlterTable
ALTER TABLE "VenueAvailabilitySlot"
ALTER COLUMN "startTime" TYPE INTEGER USING (
  (split_part("startTime", ':', 1)::integer * 60) + split_part("startTime", ':', 2)::integer
),
ALTER COLUMN "endTime" TYPE INTEGER USING (
  (split_part("endTime", ':', 1)::integer * 60) + split_part("endTime", ':', 2)::integer
);
