import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { haversineKm, roundDistanceKm } from '../common/geo/geo';

function assertValidMinuteValue(value: number, label: string, slotId: string) {
  if (!Number.isInteger(value) || value < 0 || value >= 24 * 60) {
    throw new Error(`Invalid ${label} for venue availability slot ${slotId}`);
  }
}

function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

export type UpsertVenueFromPoiInput = {
  amapPoiId: string;
  name: string;
  city: string;
  district: string | null;
  address: string;
  lat: number;
  lng: number;
};

@Injectable()
export class MatchOptionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find or create a Venue + default court + default slot from an AMap
   * POI pick. Same POI id always resolves to the same Venue so two
   * different users selecting the same place reuse the row.
   *
   * The first user to pick a POI seeds it with a single court (`默认台`)
   * and a single open-ended slot (`随时开打 09:00-22:00`) so subsequent
   * /matches POSTs have valid courtId + slotId to attach.
   */
  async upsertVenueFromPoi(input: UpsertVenueFromPoiInput) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.venue.findUnique({
        where: { amapPoiId: input.amapPoiId },
        include: {
          courts: { where: { isActive: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] },
          availabilitySlots: {
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
          },
        },
      });

      if (existing) {
        // Refresh coords / address in case AMap moved the pin.
        const refreshed = await tx.venue.update({
          where: { id: existing.id },
          data: {
            name: input.name,
            city: input.city || existing.city,
            district: input.district ?? existing.district,
            address: input.address,
            latitude: input.lat,
            longitude: input.lng,
          },
          include: {
            courts: { where: { isActive: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] },
            availabilitySlots: {
              where: { isActive: true },
              orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
            },
          },
        });
        return this.serializeUpsertResult(refreshed);
      }

      const created = await tx.venue.create({
        data: {
          name: input.name,
          city: input.city || '上海',
          district: input.district,
          address: input.address,
          latitude: input.lat,
          longitude: input.lng,
          amapPoiId: input.amapPoiId,
          // distanceKm is a stale-default the legacy callers expect;
          // real distance is computed via Haversine at request time.
          distanceKm: 0,
          sortOrder: 100,
          courts: {
            create: [{ name: '默认台', sortOrder: 1, isActive: true }],
          },
          availabilitySlots: {
            create: [
              {
                label: '随时开打',
                // 09:00 - 22:00 covers most ping-pong club hours.
                startTime: 9 * 60,
                endTime: 22 * 60,
                sortOrder: 1,
                isActive: true,
              },
            ],
          },
        },
        include: {
          courts: { where: { isActive: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] },
          availabilitySlots: {
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
          },
        },
      });
      return this.serializeUpsertResult(created);
    });
  }

  private serializeUpsertResult(venue: {
    id: string;
    name: string;
    city: string;
    district: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    courts: Array<{ id: string; name: string; sortOrder: number }>;
    availabilitySlots: Array<{
      id: string;
      label: string;
      startTime: number;
      endTime: number;
      sortOrder: number;
    }>;
  }) {
    return {
      id: venue.id,
      name: venue.name,
      city: venue.city,
      district: venue.district,
      address: venue.address,
      latitude: venue.latitude,
      longitude: venue.longitude,
      courts: venue.courts.map((court) => ({
        id: court.id,
        name: court.name,
        sortOrder: court.sortOrder,
      })),
      timeSlots: venue.availabilitySlots.map((slot) => ({
        slotId: slot.id,
        id: slot.id,
        venueId: venue.id,
        venueName: venue.name,
        label: slot.label,
        startTime: formatMinutes(slot.startTime),
        endTime: formatMinutes(slot.endTime),
        sortOrder: slot.sortOrder,
      })),
    };
  }

  async getMatchOptions(userLocation?: { lat: number; lng: number } | null) {
    const [venues, timeSlots, levels, playerCounts] = await Promise.all([
      this.prisma.venue.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        select: {
          id: true,
          name: true,
          city: true,
          district: true,
          distanceKm: true,
          latitude: true,
          longitude: true,
          address: true,
          sortOrder: true,
          courts: {
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
            select: {
              id: true,
              name: true,
              sortOrder: true,
            },
          },
        },
      }),
      this.prisma.venueAvailabilitySlot.findMany({
        where: {
          isActive: true,
          venue: { isActive: true },
        },
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        select: {
          id: true,
          venueId: true,
          label: true,
          startTime: true,
          endTime: true,
          sortOrder: true,
          venue: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.optionPreset.findMany({
        where: { kind: 'LEVEL', isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        select: {
          id: true,
          value: true,
          label: true,
          sortOrder: true,
        },
      }),
      this.prisma.optionPreset.findMany({
        where: { kind: 'PLAYER_COUNT', isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        select: {
          id: true,
          value: true,
          label: true,
          sortOrder: true,
        },
      }),
    ]);

    // Distance: if the caller passed coordinates AND the venue has real
    // geo, compute live; otherwise fall back to the stored static distance
    // so legacy clients keep working unchanged.
    const enrichedVenues = venues.map((venue) => {
      const liveDistanceKm =
        userLocation && venue.latitude != null && venue.longitude != null
          ? roundDistanceKm(
              haversineKm(userLocation, { lat: venue.latitude, lng: venue.longitude }),
            )
          : venue.distanceKm;
      return { venue, liveDistanceKm };
    });

    // Sort by live distance when we computed one; otherwise preserve the
    // explicit sortOrder defined by ops.
    if (userLocation) {
      enrichedVenues.sort((a, b) => a.liveDistanceKm - b.liveDistanceKm);
    }

    return {
      venues: enrichedVenues.map(({ venue, liveDistanceKm }) => ({
        id: venue.id,
        name: venue.name,
        city: venue.city,
        district: venue.district,
        distanceKm: liveDistanceKm,
        latitude: venue.latitude,
        longitude: venue.longitude,
        address: venue.address,
        sortOrder: venue.sortOrder,
        courts: venue.courts.map((court) => ({
          id: court.id,
          name: court.name,
          sortOrder: court.sortOrder,
        })),
      })),
      timeSlots: timeSlots.map((slot) => {
        assertValidMinuteValue(slot.startTime, 'startTime', slot.id);
        assertValidMinuteValue(slot.endTime, 'endTime', slot.id);

        if (slot.startTime >= slot.endTime) {
          throw new Error(`Invalid time range for venue availability slot ${slot.id}`);
        }

        return {
          slotId: slot.id,
          id: slot.id,
          venueId: slot.venueId,
          venueName: slot.venue.name,
          label: slot.label,
          startTime: formatMinutes(slot.startTime),
          endTime: formatMinutes(slot.endTime),
          sortOrder: slot.sortOrder,
        };
      }),
      levels: levels.map((level) => ({
        id: level.id,
        value: level.value,
        label: level.label,
        sortOrder: level.sortOrder,
      })),
      playerCounts: playerCounts.map((playerCount) => ({
        id: playerCount.id,
        value: Number(playerCount.value),
        label: playerCount.label,
        sortOrder: playerCount.sortOrder,
      })),
    };
  }
}
