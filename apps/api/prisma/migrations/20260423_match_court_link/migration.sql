ALTER TABLE "Match"
ADD COLUMN "courtId" TEXT;

ALTER TABLE "Match"
ADD CONSTRAINT "Match_courtId_fkey"
FOREIGN KEY ("courtId") REFERENCES "VenueCourt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Match_courtId_idx" ON "Match"("courtId");
