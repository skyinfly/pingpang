import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAdminApiClient } from '../services/admin-api';
import { clearAdminToken, getStoredAdminToken, saveAdminToken } from '../services/admin-token';

describe('admin token storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists and clears the admin token', () => {
    saveAdminToken('release-token');

    expect(getStoredAdminToken()).toBe('release-token');

    clearAdminToken();

    expect(getStoredAdminToken()).toBe('');
  });
});

describe('admin api client', () => {
  it('sends the admin token header when requesting summary data', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ users: 1 }),
    });
    const client = createAdminApiClient({
      baseUrl: 'http://localhost:3000',
      tokenProvider: () => 'release-token',
      fetchImpl,
    });

    await client.getSummary();

    expect(fetchImpl).toHaveBeenCalledWith('http://localhost:3000/admin/summary', {
      headers: {
        'X-Admin-Token': 'release-token',
      },
    });
  });

  it('throws a friendly error when the admin token is rejected', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    });
    const client = createAdminApiClient({
      baseUrl: 'http://localhost:3000',
      tokenProvider: () => '',
      fetchImpl,
    });

    await expect(client.getSummary()).rejects.toThrow('后台访问令牌无效，请重新填写');
  });

  it('creates a venue with JSON payload and admin token', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'venue-admin-1' }),
    });
    const client = createAdminApiClient({
      baseUrl: 'http://localhost:3000',
      tokenProvider: () => 'release-token',
      fetchImpl,
    });

    await client.createVenue({
      name: '虹口训练馆',
      city: '上海',
      district: '虹口',
      distanceKm: 5.6,
      isActive: true,
    });

    expect(fetchImpl).toHaveBeenCalledWith('http://localhost:3000/admin/venues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': 'release-token',
      },
      body: JSON.stringify({
        name: '虹口训练馆',
        city: '上海',
        district: '虹口',
        distanceKm: 5.6,
        isActive: true,
      }),
    });
  });

  it('updates a user and deletes a match through admin endpoints', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    const client = createAdminApiClient({
      baseUrl: 'http://localhost:3000',
      tokenProvider: () => 'release-token',
      fetchImpl,
    });

    await client.updateUser('user-1', { nickname: '新昵称', creditScore: 96 });
    await client.deleteMatch('match-1');

    expect(fetchImpl).toHaveBeenNthCalledWith(1, 'http://localhost:3000/admin/users/user-1', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': 'release-token',
      },
      body: JSON.stringify({ nickname: '新昵称', creditScore: 96 }),
    });
    expect(fetchImpl).toHaveBeenNthCalledWith(2, 'http://localhost:3000/admin/matches/match-1', {
      method: 'DELETE',
      headers: {
        'X-Admin-Token': 'release-token',
      },
    });
  });
});
