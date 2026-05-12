import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import App from '../App.vue';

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('Admin App', () => {
  it('renders the operating dashboard with CRUD actions after loading admin data', async () => {
    localStorage.setItem('pingpang-admin-token', 'dev-admin-token');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        const payloads: Record<string, unknown> = {
          'http://localhost:3000/admin/summary': {
            users: 2,
            matches: 2,
            pendingApplications: 0,
            activeVenues: 2,
            unreadMessages: 6,
            reviews: 2,
          },
          'http://localhost:3000/admin/matches': {
            items: [
              {
                id: 'match-seed-1',
                title: '徐汇今晚练球局',
                venueName: '徐家汇活力馆 3 号台',
                city: '上海',
                level: 'intermediate',
                maxPlayers: 4,
                openSlots: 2,
                startTime: '2026-04-23T11:30:00.000Z',
                hostUserId: 'user-reviewee-1',
                hostNickname: '球友里卡',
                hostPhone: '13900139000',
                status: 'open', applicationCounts: { pending: 0, approved: 0, rejected: 0 },
              },
            ],
          },
          'http://localhost:3000/admin/applications?status=pending': { items: [] },
          'http://localhost:3000/admin/users': {
            items: [
              {
                id: 'user-reviewee-1',
                phone: '13900139000',
                nickname: '球友里卡',
                city: '上海',
                level: 'intermediate',
                creditScore: 100,
                createdAt: '2026-04-23T11:30:00.000Z',
                hostedMatches: 2,
                joinedMatches: 0,
              },
            ],
          },
          'http://localhost:3000/admin/venues': {
            items: [
              {
                id: 'venue-seed-1',
                name: '徐家汇活力馆',
                city: '上海',
                district: '徐汇',
                distanceKm: 1.8,
                isActive: true,
                courtCount: 2,
                slotCount: 2,
                matchCount: 1,
                courts: [
                  { id: 'venue-court-1', name: '3号台', sortOrder: 1, isActive: true },
                  { id: 'venue-court-2', name: '5号台', sortOrder: 2, isActive: true },
                ],
                slots: [
                  {
                    id: 'venue-slot-1',
                    label: '工作日晚间',
                    startTime: 19 * 60 + 30,
                    endTime: 20 * 60 + 30,
                    sortOrder: 1,
                    isActive: true,
                  },
                ],
              },
            ],
          },
        };

        return {
          ok: true,
          json: async () => payloads[url],
        };
      }),
    );

    const wrapper = mount(App);
    await flushPromises();
    await flushPromises();

    expect(wrapper.text()).toContain('Pingpang 后台管理');
    expect(wrapper.text()).toContain('用户总数');
    expect(wrapper.text()).toContain('暂无待处理报名');

    await wrapper.get('[data-testid="tab-matches"]').trigger('click');
    expect(wrapper.text()).toContain('徐汇今晚练球局');
    expect(wrapper.text()).toContain('新增球局');
    expect(wrapper.text()).toContain('编辑');
    expect(wrapper.text()).toContain('删除');

    await wrapper.get('[data-testid="tab-users"]').trigger('click');
    expect(wrapper.text()).toContain('球友里卡');

    await wrapper.get('[data-testid="tab-venues"]').trigger('click');
    expect(wrapper.text()).toContain('徐家汇活力馆');
  });

  it('creates a venue from the admin page and refreshes the venue table', async () => {
    localStorage.setItem('pingpang-admin-token', 'dev-admin-token');
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url === 'http://localhost:3000/admin/venues' && init?.method === 'POST') {
        return {
          ok: true,
          json: async () => ({
            id: 'venue-admin-1',
            name: '虹口训练馆',
            city: '上海',
            district: '虹口',
            distanceKm: 5.6,
            isActive: true,
            courtCount: 0,
            slotCount: 0,
            matchCount: 0,
            courts: [],
            slots: [],
          }),
        };
      }

      const payloads: Record<string, unknown> = {
        'http://localhost:3000/admin/summary': {
          users: 2,
          matches: 2,
          pendingApplications: 0,
          activeVenues: 2,
          unreadMessages: 6,
          reviews: 2,
        },
        'http://localhost:3000/admin/matches': { items: [] },
        'http://localhost:3000/admin/applications?status=pending': { items: [] },
        'http://localhost:3000/admin/users': { items: [] },
        'http://localhost:3000/admin/venues': {
          items: [
            {
              id: 'venue-seed-1',
              name: '徐家汇活力馆',
              city: '上海',
              district: '徐汇',
              distanceKm: 1.8,
              isActive: true,
              courtCount: 2,
              slotCount: 2,
              matchCount: 1,
              courts: [
                { id: 'venue-court-1', name: '3号台', sortOrder: 1, isActive: true },
                { id: 'venue-court-2', name: '5号台', sortOrder: 2, isActive: true },
              ],
              slots: [
                {
                  id: 'venue-slot-1',
                  label: '工作日晚间',
                  startTime: 19 * 60 + 30,
                  endTime: 20 * 60 + 30,
                  sortOrder: 1,
                  isActive: true,
                },
              ],
            },
          ],
        },
      };

      return {
        ok: true,
        json: async () => payloads[url],
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    const wrapper = mount(App);
    await flushPromises();
    await flushPromises();

    await wrapper.get('[data-testid="tab-venues"]').trigger('click');
    await wrapper.get('[data-testid="create-venues"]').trigger('click');
    await wrapper.get('[data-testid="venue-name"]').setValue('虹口训练馆');
    await wrapper.get('[data-testid="venue-city"]').setValue('上海');
    await wrapper.get('[data-testid="venue-district"]').setValue('虹口');
    await wrapper.get('[data-testid="venue-distance"]').setValue('5.6');
    await wrapper.get('[data-testid="submit-editor"]').trigger('submit');
    await flushPromises();
    await flushPromises();

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/admin/venues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': 'dev-admin-token',
      },
      body: JSON.stringify({
        name: '虹口训练馆',
        city: '上海',
        district: '虹口',
        distanceKm: 5.6,
        isActive: true,
      }),
    });
    expect(wrapper.text()).toContain('虹口训练馆');
  });

  it('expands a venue and creates a court inline through the admin endpoint', async () => {
    localStorage.setItem('pingpang-admin-token', 'dev-admin-token');
    const baseVenue = {
      id: 'venue-seed-1',
      name: '徐家汇活力馆',
      city: '上海',
      district: '徐汇',
      distanceKm: 1.8,
      isActive: true,
      courtCount: 2,
      slotCount: 2,
      matchCount: 1,
      courts: [
        { id: 'venue-court-1', name: '3号台', sortOrder: 1, isActive: true },
        { id: 'venue-court-2', name: '5号台', sortOrder: 2, isActive: true },
      ],
      slots: [
        {
          id: 'venue-slot-1',
          label: '工作日晚间',
          startTime: 19 * 60 + 30,
          endTime: 20 * 60 + 30,
          sortOrder: 1,
          isActive: true,
        },
      ],
    };
    const updatedVenue = {
      ...baseVenue,
      courtCount: 3,
      courts: [
        ...baseVenue.courts,
        { id: 'venue-court-new', name: '7号台', sortOrder: 3, isActive: true },
      ],
    };
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url === 'http://localhost:3000/admin/venues/venue-seed-1/courts' && init?.method === 'POST') {
        return {
          ok: true,
          json: async () => updatedVenue,
        };
      }

      const payloads: Record<string, unknown> = {
        'http://localhost:3000/admin/summary': {
          users: 2,
          matches: 2,
          pendingApplications: 0,
          activeVenues: 2,
          unreadMessages: 6,
          reviews: 2,
        },
        'http://localhost:3000/admin/matches': { items: [] },
        'http://localhost:3000/admin/applications?status=pending': { items: [] },
        'http://localhost:3000/admin/users': { items: [] },
        'http://localhost:3000/admin/venues': { items: [baseVenue] },
      };

      return {
        ok: true,
        json: async () => payloads[url],
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    const wrapper = mount(App);
    await flushPromises();
    await flushPromises();

    await wrapper.get('[data-testid="tab-venues"]').trigger('click');
    await wrapper.get('[data-testid="expand-venue-seed-1"]').trigger('click');
    await wrapper.get('[data-testid="create-court-venue-seed-1"]').trigger('click');
    await wrapper.get('[data-testid="court-name-venue-seed-1"]').setValue('7号台');
    await wrapper.get('[data-testid="court-form-venue-seed-1"]').trigger('submit');
    await flushPromises();
    await flushPromises();

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/admin/venues/venue-seed-1/courts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': 'dev-admin-token',
      },
      body: JSON.stringify({ name: '7号台', sortOrder: 0, isActive: true }),
    });
    expect(wrapper.text()).toContain('7号台');
  });

  it('approves a pending application from the applications tab', async () => {
    localStorage.setItem('pingpang-admin-token', 'dev-admin-token');
    const pendingApplication = {
      id: 'app-1',
      matchId: 'match-seed-1',
      userId: 'user-13800138000',
      status: 'pending' as const,
      createdAt: '2026-04-23T11:00:00.000Z',
      matchTitle: '徐汇今晚练球局',
      matchVenueName: '徐家汇活力馆 3号台',
      matchStartTime: '2026-04-23T11:30:00.000Z',
      matchOpenSlots: 2,
      matchMaxPlayers: 4,
      hostUserId: 'user-reviewee-1',
      hostNickname: '球友里卡',
      hostPhone: '13900139000',
      applicantNickname: '球友1380013',
      applicantPhone: '13800138000',
      applicantCity: '上海',
      applicantLevel: 'intermediate',
      applicantCreditScore: 100,
    };
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url === 'http://localhost:3000/admin/applications/app-1/approve' && init?.method === 'POST') {
        return { ok: true, json: async () => ({ items: [] }) };
      }

      const payloads: Record<string, unknown> = {
        'http://localhost:3000/admin/summary': {
          users: 2,
          matches: 2,
          pendingApplications: 1,
          activeVenues: 2,
          unreadMessages: 6,
          reviews: 2,
        },
        'http://localhost:3000/admin/matches': { items: [] },
        'http://localhost:3000/admin/applications?status=pending': { items: [pendingApplication] },
        'http://localhost:3000/admin/users': { items: [] },
        'http://localhost:3000/admin/venues': { items: [] },
      };

      return {
        ok: true,
        json: async () => payloads[url],
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    const wrapper = mount(App);
    await flushPromises();
    await flushPromises();

    expect(wrapper.text()).toContain('球友1380013');
    expect(wrapper.text()).toContain('徐汇今晚练球局');

    await wrapper.get('[data-testid="approve-app-1"]').trigger('click');
    await flushPromises();
    await flushPromises();

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/admin/applications/app-1/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': 'dev-admin-token',
      },
      body: JSON.stringify({}),
    });
    expect(wrapper.text()).toContain('暂无待处理报名');
  });
});
