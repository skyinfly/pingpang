import { defineStore } from 'pinia';

export const useMatchDraftStore = defineStore('match-draft', {
  state: () => ({
    title: '徐家汇活力馆 3号台 · 工作日晚间约球',
    venueId: 'venue-seed-1',
    courtId: 'venue-court-1',
    slotId: 'venue-slot-1',
    venueName: '徐家汇活力馆 3号台',
    startTime: '19:30',
    city: '上海',
    level: 'intermediate',
    maxPlayers: 4,
  }),
  actions: {
    patchDraft(
      payload: Partial<{
        title: string;
        venueId: string;
        courtId: string;
        slotId: string;
        venueName: string;
        startTime: string;
        city: string;
        level: string;
        maxPlayers: number;
      }>,
    ) {
      Object.assign(this, payload);
    },
  },
});
