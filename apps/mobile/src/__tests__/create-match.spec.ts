import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import CreateMatchPage from '../pages/create-match/index.vue';
import { useAuthStore } from '../stores/auth';
import { useLocationStore } from '../stores/location';

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

const matchOptionsResponse = {
  // Venues + timeSlots are no longer used by the create-match page
  // (POI-driven now) — kept empty so legacy code paths see a clean shape.
  venues: [],
  timeSlots: [],
  levels: [
    { id: 'level-beginner', value: 'beginner', label: '初级', sortOrder: 1 },
    { id: 'level-intermediate', value: 'intermediate', label: '中级', sortOrder: 2 },
    { id: 'level-advanced', value: 'advanced', label: '高级', sortOrder: 3 },
  ],
  playerCounts: [
    { id: 'player-count-2', value: 2, label: '2 人局', sortOrder: 1 },
    { id: 'player-count-4', value: 4, label: '4 人局', sortOrder: 2 },
    { id: 'player-count-6', value: 6, label: '6 人局', sortOrder: 3 },
  ],
};

const poiSearchResponse = {
  items: [
    {
      amapPoiId: 'poi-1',
      name: '徐家汇活力馆',
      address: '上海市徐汇区肇嘉浜路 1 号',
      city: '上海',
      district: '徐汇',
      lat: 31.193,
      lng: 121.434,
      distanceMeters: 480,
    },
    {
      amapPoiId: 'poi-2',
      name: '静安体育馆',
      address: '上海市静安区南京西路 999 号',
      city: '上海',
      district: '静安',
      lat: 31.227,
      lng: 121.448,
      distanceMeters: 1800,
    },
    {
      amapPoiId: 'poi-3',
      name: '徐汇社区球馆',
      address: '上海市徐汇区漕溪北路 100 号',
      city: '上海',
      district: '徐汇',
      lat: 31.198,
      lng: 121.438,
      distanceMeters: 2500,
    },
    {
      amapPoiId: 'poi-4',
      name: '浦东全民健身中心',
      address: '上海市浦东新区世纪大道 1 号',
      city: '上海',
      district: '浦东',
      lat: 31.231,
      lng: 121.499,
      distanceMeters: 6100,
    },
  ],
};

const upsertResponse = {
  id: 'venue-poi-1',
  name: '徐家汇活力馆',
  city: '上海',
  district: '徐汇',
  address: '上海市徐汇区肇嘉浜路 1 号',
  latitude: 31.193,
  longitude: 121.434,
  courts: [{ id: 'court-default', name: '默认台', sortOrder: 1 }],
  timeSlots: [],
};

function stubUni(extra: Record<string, unknown> = {}) {
  const requests: Array<{
    url: string;
    method?: string;
    data?: Record<string, unknown>;
    header?: Record<string, string>;
  }> = [];
  vi.stubGlobal('uni', {
    request: ({
      url,
      method,
      data,
      header,
      success,
    }: {
      url: string;
      method?: string;
      data?: Record<string, unknown>;
      header?: Record<string, string>;
      success: (response: { statusCode: number; data: unknown }) => void;
    }) => {
      requests.push({ url, method, data, header });
      if (url.includes('/match-options')) {
        success({ statusCode: 200, data: matchOptionsResponse });
        return;
      }
      if (url.includes('/location/poi/search')) {
        success({ statusCode: 200, data: poiSearchResponse });
        return;
      }
      if (url.endsWith('/matches/venues/from-poi')) {
        success({ statusCode: 200, data: upsertResponse });
        return;
      }
      if (url.endsWith('/matches')) {
        success({
          statusCode: 201,
          data: {
            id: 'match-created-1',
            title: '徐家汇活力馆 · 19:30约球',
            venueName: '徐家汇活力馆',
            startTime: '2099-01-01T19:30:00+08:00',
            city: '上海',
            level: 'intermediate',
            maxPlayers: 4,
            openSlots: 3,
            hostCreditScore: 100,
            distanceKm: 0.5,
            matchRate: 90,
            score: 80,
          },
        });
        return;
      }
      throw new Error(`Unexpected request: ${url}`);
    },
    setStorageSync: vi.fn(),
    getStorageSync: vi.fn(() => ''),
    removeStorageSync: vi.fn(),
    ...extra,
  });
  return requests;
}

function seedLocation() {
  const locationStore = useLocationStore();
  // Force a ready, fresh-cached state so the page's `ensure()` call short
  // circuits (no real geolocation in jsdom) and the auto-search watcher
  // sees coords immediately. State uses lat/lng — coords is a getter.
  locationStore.$patch({
    lat: 31.193,
    lng: 121.434,
    source: 'browser',
    city: '上海',
    district: '徐汇',
    address: '上海市徐汇区肇嘉浜路 1 号',
    updatedAt: Date.now(),
    status: 'ready',
  });
}

describe('CreateMatchPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('auto-runs POI search on entry and shows the top 3 nearby venues with a 展开 toggle', async () => {
    stubUni({ navigateTo: vi.fn() });
    seedLocation();

    const wrapper = mount(CreateMatchPage);
    await flushPromises();
    await flushPromises();

    expect(wrapper.text()).toContain('发布约局');
    expect(wrapper.text()).toContain('球馆');
    expect(wrapper.text()).toContain('开局日期');
    expect(wrapper.text()).toContain('开局时间');
    expect(wrapper.text()).toContain('登录后发布');

    // The top 3 venues are visible by default; the 4th is hidden until 展开.
    expect(wrapper.text()).toContain('徐家汇活力馆');
    expect(wrapper.text()).toContain('静安体育馆');
    expect(wrapper.text()).toContain('徐汇社区球馆');
    expect(wrapper.text()).not.toContain('浦东全民健身中心');
    expect(wrapper.text()).toContain('展开全部 (4)');

    await wrapper.get('[data-testid="poi-expand"]').trigger('click');
    expect(wrapper.text()).toContain('浦东全民健身中心');
    expect(wrapper.text()).toContain('收起列表');
  });

  it('redirects to login when the user is not signed in', async () => {
    const navigateTo = vi.fn();
    stubUni({ navigateTo });
    seedLocation();

    const wrapper = mount(CreateMatchPage);
    await flushPromises();
    await flushPromises();

    await wrapper.get('[data-testid="publish-match"]').trigger('click');
    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/login/index?redirect=%2Fpages%2Fcreate-match%2Findex',
    });
  });

  it('publishes a match using the chosen POI venue + custom ISO startTime', async () => {
    const authStore = useAuthStore();
    const navigateTo = vi.fn();
    const switchTab = vi.fn();
    const requests = stubUni({ navigateTo, switchTab });
    seedLocation();

    authStore.setSession({
      token: 'dev-token-13800138000',
      user: {
        id: 'user-13800138000',
        phone: '13800138000',
        nickname: '球友1380013',
        city: '上海',
        level: 'intermediate',
        creditScore: 100,
      },
    });

    const wrapper = mount(CreateMatchPage);
    await flushPromises();
    await flushPromises();

    // Pick the first POI, which upserts a Venue server-side and locks
    // it in as the selected venue.
    await wrapper.get('[data-testid="poi-result-poi-1"]').trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('已选'); // toast hook; not asserted strongly

    // Pick the second day chip + a player count so we know the form is
    // wired through to the request payload.
    await wrapper.get('[data-testid="players-option-2"]').trigger('click');

    await wrapper.get('[data-testid="publish-match"]').trigger('click');
    await flushPromises();

    expect(requests).toContainEqual(
      expect.objectContaining({
        url: 'http://localhost:3000/matches',
        method: 'POST',
        header: { Authorization: 'Bearer dev-token-13800138000' },
        data: expect.objectContaining({
          venueId: 'venue-poi-1',
          level: 'intermediate',
          maxPlayers: 2,
          startTime: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\+08:00$/),
        }),
      }),
    );
    // Custom-time payload no longer sends courtId / slotId — those are
    // optional and filled in later via PATCH /matches/:id.
    const createCall = requests.find((r) => r.url.endsWith('/matches') && r.method === 'POST');
    expect(createCall?.data).not.toHaveProperty('courtId');
    expect(createCall?.data).not.toHaveProperty('slotId');

    expect(switchTab).toHaveBeenCalledWith({ url: '/pages/profile/index' });
    expect(navigateTo).not.toHaveBeenCalled();
  });
});
