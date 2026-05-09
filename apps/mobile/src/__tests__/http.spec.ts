import { describe, expect, it } from 'vitest';
import { resolveApiBaseUrl } from '../services/http';

describe('http service environment resolution', () => {
  it('uses the H5 localhost base url by default', () => {
    expect(resolveApiBaseUrl('h5')).toBe('http://localhost:3000');
  });

  it('uses the simulator-safe base url for mp-weixin by default', () => {
    expect(resolveApiBaseUrl('mp-weixin')).toBe('http://127.0.0.1:3000');
  });

  it('requires an explicit HTTPS API url for production mp-weixin builds', () => {
    expect(() => resolveApiBaseUrl('mp-weixin', '', '', 'production')).toThrow(
      'VITE_API_BASE_URL_MP_WEIXIN must be an HTTPS URL for production mp-weixin builds',
    );
  });

  it('accepts an explicit HTTPS API url for production mp-weixin builds', () => {
    expect(resolveApiBaseUrl('mp-weixin', '', 'https://api.pingpang.test', 'production')).toBe(
      'https://api.pingpang.test',
    );
  });

  it('prefers a shared explicit env base url over platform defaults', () => {
    expect(resolveApiBaseUrl('mp-weixin', 'https://api.pingpang.test')).toBe('https://api.pingpang.test');
  });

  it('prefers a platform-specific base url when the shared env is missing', () => {
    expect(resolveApiBaseUrl('mp-weixin', '', 'http://192.168.0.12:3000')).toBe('http://192.168.0.12:3000');
  });
});
