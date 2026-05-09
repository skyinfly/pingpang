import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

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

@Injectable()
export class MatchOptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMatchOptions() {
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

    return {
      venues: venues.map((venue) => ({
        id: venue.id,
        name: venue.name,
        city: venue.city,
        district: venue.district,
        distanceKm: venue.distanceKm,
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
