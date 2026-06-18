/**
 * Geo helpers shared by recommendation, search and admin endpoints.
 *
 * All coordinates are GCJ-02 ("mars" coords) — the legally-required system
 * for Chinese maps. WeChat's wx.getLocation({type:'gcj02'}) and Tencent
 * Maps both return / accept GCJ-02, so the backend never has to transform
 * on this path. The wgs84ToGcj02 helper exists for the H5 path where the
 * browser's navigator.geolocation API returns raw WGS84.
 */

const EARTH_RADIUS_KM = 6371.0088;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * Great-circle distance between two GCJ-02 points, in kilometers.
 *
 * Sub-millisecond on modern V8; safe to call per match row at the request
 * scale we have. Move to PostGIS GEOGRAPHY + GiST if the venue table ever
 * grows past ~50k rows or we start needing radius pre-filtering at the
 * database level.
 */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
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

/**
 * Rounds to one decimal so listings stay stable across paginated calls and
 * don't show "1.7384952km" noise. UI never needs more precision than that.
 */
export function roundDistanceKm(distanceKm: number): number {
  return Math.round(distanceKm * 10) / 10;
}

/**
 * Convert browser-origin WGS84 to GCJ-02 used by Chinese maps.
 *
 * Derived from the standard public formulas; only valid inside the China
 * mainland bounding box (lat 17~54, lng 73~135). Outside that, returns the
 * input unchanged because GCJ-02 obfuscation is not applied.
 */
export function wgs84ToGcj02(lat: number, lng: number): { lat: number; lng: number } {
  if (!isInsideChina(lat, lng)) {
    return { lat, lng };
  }
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

/** Conservative bounding box for mainland China. */
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

/**
 * Parse and validate a lat/lng pair coming from a request query string.
 * Returns null when either is missing or out of range — callers should fall
 * back to the venue's static distanceKm in that case.
 */
export function parseLatLngQuery(latRaw?: string, lngRaw?: string): { lat: number; lng: number } | null {
  if (!latRaw || !lngRaw) return null;
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}
