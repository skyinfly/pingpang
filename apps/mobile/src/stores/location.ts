import { defineStore } from 'pinia';
import { wgs84ToGcj02, type LatLng } from '../utils/geo';
import { lookupLocationByIp, reverseLookupLocation } from '../services/api';

/**
 * Shared user-location store. The discovery feed, the create-match flow
 * and the match detail page all read from here, so we only ever trigger
 * one location prompt per session unless the user explicitly refreshes.
 *
 * Resolution order on a fresh fetch:
 *   1. mp-weixin path uses wx.getLocation (GCJ-02 direct)
 *   2. H5 path tries navigator.geolocation (WGS84 → GCJ-02)
 *   3. on failure (HTTP origin, denied permission, no sensor) we fall
 *      back to /location/ip on the server, which queries ip-api.com.
 *      This keeps a meaningful city in the header even on plain HTTP.
 *
 * Coordinates are always cached in GCJ-02 so the rest of the app can
 * treat all coords uniformly. The cache survives for CACHE_TTL_MS so a
 * returning user gets fresh distance numbers without re-prompting.
 */

const CACHE_TTL_MS = 5 * 60 * 1000;
// v3: schema now includes district + formatted address from AMap. Old
// caches without these fields are still valid but the header would
// re-paint with the new street-level info on next refresh; bumping the
// key just forces a clean rebuild on first load after the upgrade.
const STORAGE_KEY = 'pingpang.location.cache.v3';

export type LocationStatus = 'idle' | 'requesting' | 'ready' | 'denied' | 'unavailable';
export type LocationSource = 'wechat' | 'browser' | 'ip';

type StoredCache = {
  lat: number;
  lng: number;
  source: LocationSource;
  city?: string | null;
  district?: string | null;
  /**
   * Full street-level address from AMap reverse geocode (eg. "上海市
   * 徐汇区肇嘉浜路 1065 号"). Populated when we have precise GPS coords
   * AND the AMAP_KEY is wired on the server; null otherwise.
   */
  address?: string | null;
  updatedAt: number;
};

function readCachedLocation(): StoredCache | null {
  if (typeof uni === 'undefined' || typeof uni.getStorageSync !== 'function') return null;
  const raw = uni.getStorageSync(STORAGE_KEY);
  if (!raw || typeof raw !== 'string') return null;
  try {
    const parsed = JSON.parse(raw) as StoredCache;
    if (!parsed || typeof parsed.lat !== 'number') return null;
    if (Date.now() - parsed.updatedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistCache(cache: StoredCache | null) {
  if (typeof uni === 'undefined') return;
  if (!cache) {
    uni.removeStorageSync?.(STORAGE_KEY);
    return;
  }
  uni.setStorageSync?.(STORAGE_KEY, JSON.stringify(cache));
}

async function fetchWechatLocation(): Promise<LatLng> {
  return new Promise<LatLng>((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      isHighAccuracy: false,
      success: (res) => resolve({ lat: res.latitude, lng: res.longitude }),
      fail: (err) => reject(new Error(err.errMsg ?? 'getLocation failed')),
    });
  });
}

async function fetchBrowserLocation(): Promise<LatLng> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('navigator.geolocation unavailable');
  }
  return new Promise<LatLng>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const gcj = wgs84ToGcj02(coords.latitude, coords.longitude);
        resolve(gcj);
      },
      (err) => reject(new Error(err.message || 'geolocation failed')),
      { timeout: 8000, maximumAge: 60_000, enableHighAccuracy: false },
    );
  });
}

/**
 * Last-resort fallback: ask the backend to look up our IP via ip-api.com.
 * Returns the city string alongside coords so the header can render it
 * directly without re-snapping to the nearest supported city.
 */
async function fetchIpLocation(): Promise<{ coords: LatLng; city: string | null } | null> {
  try {
    const response = await lookupLocationByIp();
    if (!response.available) return null;
    return { coords: { lat: response.lat, lng: response.lng }, city: response.city };
  } catch {
    return null;
  }
}

export const useLocationStore = defineStore('location', {
  state: () => {
    const cached = readCachedLocation();
    return {
      lat: cached?.lat as number | null,
      lng: cached?.lng as number | null,
      source: (cached?.source ?? null) as LocationSource | null,
      city: (cached?.city ?? null) as string | null,
      district: (cached?.district ?? null) as string | null,
      address: (cached?.address ?? null) as string | null,
      updatedAt: cached?.updatedAt ?? 0,
      status: (cached ? 'ready' : 'idle') as LocationStatus,
      error: null as string | null,
    };
  },
  getters: {
    hasLocation: (state) => state.lat != null && state.lng != null,
    coords: (state): LatLng | null =>
      state.lat != null && state.lng != null ? { lat: state.lat, lng: state.lng } : null,
    isStale: (state) => Date.now() - state.updatedAt > CACHE_TTL_MS,
  },
  actions: {
    async refresh() {
      return this.ensure(true);
    },
    async ensure(force = false) {
      if (!force && this.hasLocation && !this.isStale) return this.coords;
      if (this.status === 'requesting') return this.coords;
      this.status = 'requesting';
      this.error = null;

      let coords: LatLng | null = null;
      let source: LocationSource | null = null;
      let city: string | null = null;
      let district: string | null = null;
      let address: string | null = null;

      try {
        // #ifdef MP-WEIXIN
        coords = await fetchWechatLocation();
        source = 'wechat';
        // #endif
        // #ifndef MP-WEIXIN
        coords = await fetchBrowserLocation();
        source = 'browser';
        // #endif
      } catch (err) {
        this.error = err instanceof Error ? err.message : String(err);
      }

      if (!coords) {
        // Browser / wechat both unusable — fall back to IP-level lookup.
        const ip = await fetchIpLocation();
        if (ip) {
          coords = ip.coords;
          source = 'ip';
          city = ip.city;
        }
      } else {
        // Got precise coords. Try the AMap reverse geocode for a real
        // street/POI address; if AMap is unavailable, fall back to the
        // IP lookup just for a city label so the header isn't empty.
        try {
          const reverse = await reverseLookupLocation(coords);
          if (reverse.available) {
            city = reverse.city ?? city;
            district = reverse.district;
            address = reverse.formattedAddress || reverse.nearestPoi || null;
          }
        } catch {
          // AMap call failed; we'll fall through to IP below.
        }
        if (!city) {
          const ip = await fetchIpLocation();
          if (ip) city = ip.city;
        }
      }

      if (coords && source) {
        this.lat = coords.lat;
        this.lng = coords.lng;
        this.source = source;
        this.city = city;
        this.district = district;
        this.address = address;
        this.updatedAt = Date.now();
        this.status = 'ready';
        persistCache({
          lat: coords.lat,
          lng: coords.lng,
          source,
          city,
          district,
          address,
          updatedAt: this.updatedAt,
        });
        return this.coords;
      }

      // Pick the more user-friendly status: "denied" if the browser told
      // us so, otherwise "unavailable" (network down, ip-api throttled).
      this.status = this.error && /denied|permission/i.test(this.error) ? 'denied' : 'unavailable';
      return null;
    },
    clear() {
      this.lat = null;
      this.lng = null;
      this.source = null;
      this.city = null;
      this.district = null;
      this.address = null;
      this.updatedAt = 0;
      this.status = 'idle';
      this.error = null;
      persistCache(null);
    },
  },
});
