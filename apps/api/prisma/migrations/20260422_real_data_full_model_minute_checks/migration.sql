-- AddCheckConstraints
ALTER TABLE "VenueAvailabilitySlot"
  ADD CONSTRAINT "VenueAvailabilitySlot_startTime_minutes_check" CHECK ("startTime" >= 0 AND "startTime" < 1440),
  ADD CONSTRAINT "VenueAvailabilitySlot_endTime_minutes_check" CHECK ("endTime" >= 0 AND "endTime" < 1440),
  ADD CONSTRAINT "VenueAvailabilitySlot_timeRange_check" CHECK ("startTime" < "endTime");
