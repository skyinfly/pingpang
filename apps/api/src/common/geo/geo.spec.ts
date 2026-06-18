import { haversineKm, parseLatLngQuery, roundDistanceKm, wgs84ToGcj02 } from './geo';

describe('haversineKm', () => {
  it('returns 0 for the same point', () => {
    const p = { lat: 31.2238, lng: 121.448 };
    expect(haversineKm(p, p)).toBe(0);
  });

  it('matches the published Shanghai → Beijing distance within ~2%', () => {
    const shanghai = { lat: 31.2238, lng: 121.448 };
    const beijing = { lat: 39.9042, lng: 116.4074 };
    const km = haversineKm(shanghai, beijing);
    // Published great-circle distance Shanghai-Beijing ≈ 1067km.
    expect(km).toBeGreaterThan(1050);
    expect(km).toBeLessThan(1090);
  });

  it('sorts venues by proximity to the caller', () => {
    const user = { lat: 31.2, lng: 121.44 };
    const xujiahui = { lat: 31.1949, lng: 121.4374 };
    const jingan = { lat: 31.2238, lng: 121.448 };
    expect(haversineKm(user, xujiahui)).toBeLessThan(haversineKm(user, jingan));
  });
});

describe('roundDistanceKm', () => {
  it('rounds to one decimal', () => {
    expect(roundDistanceKm(1.7384952)).toBe(1.7);
    expect(roundDistanceKm(0.04)).toBe(0);
    expect(roundDistanceKm(0.06)).toBe(0.1);
  });
});

describe('wgs84ToGcj02', () => {
  it('shifts coordinates inside China by ~hundreds of metres', () => {
    const wgs = { lat: 31.2238, lng: 121.448 };
    const gcj = wgs84ToGcj02(wgs.lat, wgs.lng);
    const drift = haversineKm({ lat: wgs.lat, lng: wgs.lng }, gcj);
    // Real GCJ-02 offset around Shanghai is ~300-700m.
    expect(drift).toBeGreaterThan(0.1);
    expect(drift).toBeLessThan(1);
  });

  it('passes through coordinates outside the China bounding box', () => {
    const tokyo = wgs84ToGcj02(35.6762, 139.6503);
    expect(tokyo).toEqual({ lat: 35.6762, lng: 139.6503 });
  });
});

describe('parseLatLngQuery', () => {
  it('returns null for missing values', () => {
    expect(parseLatLngQuery(undefined, '121.4')).toBeNull();
    expect(parseLatLngQuery('31.2', undefined)).toBeNull();
  });

  it('rejects non-numeric or out-of-range input', () => {
    expect(parseLatLngQuery('abc', '121.4')).toBeNull();
    expect(parseLatLngQuery('200', '0')).toBeNull();
    expect(parseLatLngQuery('0', '200')).toBeNull();
  });

  it('parses a valid pair', () => {
    expect(parseLatLngQuery('31.2', '121.4')).toEqual({ lat: 31.2, lng: 121.4 });
  });
});
