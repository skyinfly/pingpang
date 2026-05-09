ALTER TABLE "Match"
ADD COLUMN "slotId" TEXT;

ALTER TABLE "Match"
ADD CONSTRAINT "Match_slotId_fkey"
FOREIGN KEY ("slotId") REFERENCES "VenueAvailabilitySlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Match_slotId_idx" ON "Match"("slotId");