import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { fetchMyProfile } from '../services/api';
import { AUTH_SESSION_STORAGE_KEY, useAuthStore } from '../stores/auth';

describe('auth services and store', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    setActivePinia(createPinia());
    vi.stubGlobal('uni', {
      request: vi.fn(),
      setStorageSync: vi.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
      getStorageSync: vi.fn((key: string) => storage.get(key) ?? ''),
      removeStorageSync: vi.fn((key: string) => {
        storage.delete(key);
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('passes the bearer token from the auth store when fetching the profile', async () => {
    const request = vi.fn(({ success }) => {
      success({
        statusCode: 200,
        data: {
          id: 'user-13800138000',
          phone: '13800138000',
          nickname: '球友1380013',
          city: '上海',
          level: 'intermediate',
          creditScore: 100,
        },
      });
    });

    vi.stubGlobal('uni', {
      request,
      setStorageSync: vi.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
      getStorageSync: vi.fn((key: string) => storage.get(key) ?? ''),
      removeStorageSync: vi.fn((key: string) => {
        storage.delete(key);
      }),
    });

    const store = useAuthStore();
    store.setSession({
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

    const profile = await fetchMyProfile();

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        header: {
          Authorization: 'Bearer dev-token-13800138000',
        },
      }),
    );
    expect(profile.nickname).toBe('球友1380013');
  });

  it('persists and hydrates the auth session through local storage', () => {
    const store = useAuthStore();

    store.setSession({
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

    expect(storage.get(AUTH_SESSION_STORAGE_KEY)).toContain('dev-token-13800138000');

    setActivePinia(createPinia());
    const hydratedStore = useAuthStore();
    hydratedStore.hydrateSession();

    expect(hydratedStore.token).toBe('dev-token-13800138000');
    expect(hydratedStore.user?.nickname).toBe('球友1380013');
  });
});
