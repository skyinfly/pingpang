import { defineStore } from 'pinia';
import type { SessionPayload, SessionUser } from '../services/types';

export const AUTH_SESSION_STORAGE_KEY = 'pingpang.auth.session';

function readStoredSession() {
  if (typeof uni === 'undefined' || typeof uni.getStorageSync !== 'function') {
    return null;
  }

  const raw = uni.getStorageSync(AUTH_SESSION_STORAGE_KEY);

  if (!raw || typeof raw !== 'string') {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionPayload;
  } catch {
    return null;
  }
}

function persistSession(session: SessionPayload | null) {
  if (typeof uni === 'undefined') {
    return;
  }

  if (!session) {
    if (typeof uni.removeStorageSync === 'function') {
      uni.removeStorageSync(AUTH_SESSION_STORAGE_KEY);
    }
    return;
  }

  if (typeof uni.setStorageSync === 'function') {
    uni.setStorageSync(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: null as SessionUser | null,
    hydrated: false,
  }),
  actions: {
    hydrateSession() {
      const session = readStoredSession();

      if (session) {
        this.token = session.token;
        this.user = session.user;
      }

      this.hydrated = true;
    },
    setSession(payload: SessionPayload) {
      this.token = payload.token;
      this.user = payload.user;
      this.hydrated = true;
      persistSession(payload);
    },
    clearSession() {
      this.token = '';
      this.user = null;
      this.hydrated = true;
      persistSession(null);
    },
  },
});
