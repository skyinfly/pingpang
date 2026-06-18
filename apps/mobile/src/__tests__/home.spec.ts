import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import HomePage from '../pages/home/index.vue';

describe('HomePage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the featured recommendation from live match data', async () => {
    const navigateTo = vi.fn();

    vi.stubGlobal('uni', {
      request: ({
        success,
      }: {
        success: (response: { statusCode: number; data: { items: unknown[] } }) => void;
      }) => {
        success({
          statusCode: 200,
          data: {
            items: [
              {
                id: 'match-seed-1',
                title: '徐汇晚间上分局',
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
            ],
          },
        });
      },
      navigateTo,
      switchTab: vi.fn(),
    });

    const wrapper = mount(HomePage, {
      global: {
        // Pinia is needed because useMatchesQuery now reads the shared
        // location store to attach lat/lng to /matches calls.
        plugins: [createPinia(), [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    const expectedDate = new Date('2026-04-23T19:30:00+08:00');
    const hours = String(expectedDate.getHours()).padStart(2, '0');
    const minutes = String(expectedDate.getMinutes()).padStart(2, '0');

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('今晚推荐');
      expect(wrapper.text()).toContain('徐汇晚间上分局');
      expect(wrapper.text()).toContain('徐家汇活力馆 3 号台');
      expect(wrapper.text()).toContain(`今晚 ${hours}:${minutes} 开局`);
      expect(wrapper.text()).toContain('发起约球');
    });

    await wrapper.get('[data-testid="create-match-entry"]').trigger('click');

    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/create-match/index',
    });
  });
});
