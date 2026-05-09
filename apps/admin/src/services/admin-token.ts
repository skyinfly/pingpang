export const ADMIN_TOKEN_STORAGE_KEY = 'pingpang-admin-token';
export const DEFAULT_ADMIN_TOKEN = 'dev-admin-token';

export function getStoredAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? '';
}

export function saveAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token.trim());
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}
