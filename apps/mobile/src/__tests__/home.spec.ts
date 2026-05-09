import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
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
        plugins: [[VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('今晚推荐');
      expect(wrapper.text()).toContain('徐汇晚间上分局');
      expect(wrapper.text()).toContain('徐家汇活力馆 3 号台');
      expect(wrapper.text()).toContain('今晚 19:30 开局');
      expect(wrapper.text()).toContain('发起约球');
    });

    await wrapper.get('[data-testid="create-match-entry"]').trigger('click');

    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/create-match/index',
    });
  });
});
