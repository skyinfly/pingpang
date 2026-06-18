/**
 * Front-end mirror of apps/api/src/common/geo/geo.ts. We can't share the
 * file directly because the api package compiles to CommonJS and depends on
 * Nest's reflect-metadata path, but the math is small enough to dupe.
 *
 * Coordinate system note: backend expects GCJ-02. Tencent Maps / WeChat
 * return GCJ-02 directly. Browser navigator.geolocation returns WGS84, so
 * the H5 path calls wgs84ToGcj02 before sending coordinates to the API.
 */

export type LatLng = { lat: number; lng: number };

const EARTH_RADIUS_KM = 6371.0088;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const aTerm =
    sinDLat * sinDLat +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(aTerm), Math.sqrt(1 - aTerm));
  return EARTH_RADIUS_KM * c;
}

export function formatDistance(km: number): string {
  if (!Number.isFinite(km)) return '';
  if (km < 1) return `${Math.round(km * 1000)}m`;
  if (km < 10) return `${km.toFixed(1)}km`;
  return `${Math.round(km)}km`;
}

// GCJ-02 centroids of the cities we currently surface in match-options.
// Used to pick a reasonable default city from raw coords without spending
// a Tencent LBS reverse-geocode call. Order matters only for tie-breaks.
const CITY_CENTROIDS: Array<{ name: string; lat: number; lng: number }> = [
  { name: '北京', lat: 39.9042, lng: 116.4074 },
  { name: '上海', lat: 31.2304, lng: 121.4737 },
  { name: '杭州', lat: 30.2741, lng: 120.1551 },
  { name: '广州', lat: 23.1291, lng: 113.2644 },
  { name: '深圳', lat: 22.5431, lng: 114.0579 },
];

/**
 * Pick the nearest city in our supported list to a coordinate.
 * Returns null when the coord is more than `maxKm` from every city — at
 * that point the user is somewhere we don't have venues for and the
 * caller should fall back to a sensible default ("北京") instead of
 * forcing them into the closest supported city.
 */
export function nearestCity(coord: LatLng, maxKm = 200): string | null {
  let best: { name: string; km: number } | null = null;
  for (const city of CITY_CENTROIDS) {
    const km = haversineKm(coord, city);
    if (!best || km < best.km) best = { name: city.name, km };
  }
  if (!best) return null;
  return best.km <= maxKm ? best.name : null;
}

function isInsideChina(lat: number, lng: number) {
  return lng >= 72.004 && lng <= 137.8347 && lat >= 0.8293 && lat <= 55.8271;
}

function transformLat(x: number, y: number) {
  let ret = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += ((20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2) / 3;
  ret += ((20 * Math.sin(y * Math.PI) + 40 * Math.sin((y / 3) * Math.PI)) * 2) / 3;
  ret += ((160 * Math.sin((y / 12) * Math.PI) + 320 * Math.sin((y * Math.PI) / 30.0)) * 2) / 3;
  return ret;
}

function transformLng(x: number, y: number) {
  let ret = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += ((20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2) / 3;
  ret += ((20 * Math.sin(x * Math.PI) + 40 * Math.sin((x / 3) * Math.PI)) * 2) / 3;
  ret += ((150 * Math.sin((x / 12) * Math.PI) + 300 * Math.sin((x / 30) * Math.PI)) * 2) / 3;
  return ret;
}

export function wgs84ToGcj02(lat: number, lng: number): LatLng {
  if (!isInsideChina(lat, lng)) return { lat, lng };
  const dLat = transformLat(lng - 105, lat - 35);
  const dLng = transformLng(lng - 105, lat - 35);
  const radLat = (lat / 180) * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - 0.00669342162296594323 * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  const correctedLat =
    (dLat * 180) /
    (((6378245 * (1 - 0.00669342162296594323)) / (magic * sqrtMagic)) * Math.PI);
  const correctedLng =
    (dLng * 180) / ((6378245 / sqrtMagic) * Math.cos(radLat) * Math.PI);
  return { lat: lat + correctedLat, lng: lng + correctedLng };
}
