import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import SquarePage from '../pages/square/index.vue';

describe('SquarePage', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('renders real match cards in friendly Chinese copy', async () => {
    const navigateTo = vi.fn();
    const requestedUrls: string[] = [];
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-23T10:00:00+08:00'));

    vi.stubGlobal('uni', {
      request: ({
        url,
        success,
      }: {
        url: string;
        success: (response: { statusCode: number; data: { items: unknown[] } }) => void;
      }) => {
        requestedUrls.push(url);
        const isBeginner = url.includes('level=beginner');

        success({
          statusCode: 200,
          data: {
            items: isBeginner
              ? [
                  {
                    id: 'match-beginner-1',
                    title: '新手友好练习局',
                    venueName: '徐家汇活力馆 5 号台',
                    startTime: '2026-04-24T18:30:00+08:00',
                    distanceKm: 1.8,
                    maxPlayers: 4,
                    openSlots: 1,
                    hostCreditScore: 99,
                    level: 'beginner',
                    matchRate: 88,
                    city: '上海',
                    score: 62.6,
                  },
                ]
              : [
                  {
                    id: 'match-seed-1',
                    title: '徐汇今晚练球局',
                    venueName: '徐家汇活力馆 3 号台',
                    startTime: '2026-04-23T19:30:00+08:00',
                    distanceKm: 1.8,
                    maxPlayers: 4,
                    openSlots: 2,
                    hostCreditScore: 97,
                    level: 'intermediate',
                    matchRate: 93,
                    city: '上海',
                    score: 66.06,
                  },
                  {
                    id: 'match-seed-2',
                    title: '静安明日午休快打局',
                    venueName: '静安寺白领馆 2 号台',
                    startTime: '2026-04-24T12:30:00+08:00',
                    distanceKm: 3.2,
                    maxPlayers: 2,
                    openSlots: 1,
                    hostCreditScore: 95,
                    level: 'intermediate',
                    matchRate: 87,
                    city: '上海',
                    score: 61.44,
                  },
                ],
          },
        });
      },
      navigateTo,
    });

    const wrapper = mount(SquarePage, {
      global: {
        // Pinia: useMatchesQuery reads the shared location store.
        plugins: [createPinia(), [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('约局广场');
      expect(wrapper.text()).toContain('上海');
      expect(wrapper.text()).toContain('中级');
      expect(wrapper.text()).toContain('徐汇今晚练球局');
      expect(wrapper.text()).toContain('徐家汇活力馆 3 号台');
      expect(wrapper.text()).toContain('今晚 19:30 开局');
      expect(wrapper.text()).toContain('还差 2 人');
      expect(wrapper.text()).toContain('静安明日午休快打局');
      expect(wrapper.text()).toContain('12:30 开局');
    });

    // Default filters are now '全部' / '全部' (no server-side city or
    // level filter) so a new user sees activity from every region.
    expect(requestedUrls[0]).not.toContain('city=');
    expect(requestedUrls[0]).not.toContain('level=');

    await wrapper.get('.card').trigger('click');

    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/match-detail/index?id=match-seed-1',
    });

    await wrapper.get('[data-filter-level="beginner"]').trigger('click');

    await vi.waitFor(() => {
      expect(requestedUrls.some((url) => url.includes('level=beginner'))).toBe(true);
      expect(wrapper.text()).toContain('新手友好练习局');
      expect(wrapper.text()).toContain('新手');
    });

    await wrapper.get('[data-filter-time="tomorrow"]').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('明天 18:30 开局');
    });
  });
});
