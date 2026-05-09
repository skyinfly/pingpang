-- CreateEnum
CREATE TYPE "OptionPresetKind" AS ENUM ('LEVEL', 'PLAYER_COUNT');

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueCourt" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueCourt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueAvailabilitySlot" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueAvailabilitySlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionPreset" (
    "id" TEXT NOT NULL,
    "kind" "OptionPresetKind" NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionPreset_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "venueId" TEXT;

-- CreateIndex
CREATE INDEX "Venue_isActive_sortOrder_idx" ON "Venue"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "VenueCourt_venueId_isActive_sortOrder_idx" ON "VenueCourt"("venueId", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "VenueAvailabilitySlot_venueId_isActive_sortOrder_idx" ON "VenueAvailabilitySlot"("venueId", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "OptionPreset_kind_isActive_sortOrder_idx" ON "OptionPreset"("kind", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "Match_venueId_idx" ON "Match"("venueId");

-- AddForeignKey
ALTER TABLE "VenueCourt" ADD CONSTRAINT "VenueCourt_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueAvailabilitySlot" ADD CONSTRAINT "VenueAvailabilitySlot_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
