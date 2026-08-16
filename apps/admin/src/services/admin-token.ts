export const ADMIN_TOKEN_STORAGE_KEY = 'pingpang-admin-token';
// No hardcoded default token — an empty default forces the operator to log
// in with real credentials. A dev convenience token can still be injected
// at build time via VITE_DEFAULT_ADMIN_TOKEN if desired.
export const DEFAULT_ADMIN_TOKEN = (import.meta.env.VITE_DEFAULT_ADMIN_TOKEN as string | undefined) ?? '';

export function getStoredAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? '';
}

export function saveAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token.trim());
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}
