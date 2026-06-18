import { Injectable, Logger } from '@nestjs/common';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { wgs84ToGcj02 } from '../common/geo/geo';

/**
 * Fallback IP→city lookup for clients that can't use the browser
 * geolocation API (HTTP origins, denied permission, missing sensor).
 *
 * Backed by ip-api.com — free, no API key, 45 req/min per source IP.
 * We deliberately keep the call server-side: ip-api is HTTP-only on the
 * free tier and would otherwise break the page on an HTTPS origin once
 * we move there, and the server can also enforce per-process rate
 * limiting + caching layers in the future.
 */

const IP_API_HOST = 'ip-api.com';
const IP_API_TIMEOUT_MS = 4000;

export type LocationLookup = {
  lat: number;
  lng: number;
  city: string | null;
  country: string | null;
  source: 'ip';
  ip: string;
};

/**
 * Result of an AMap reverse-geocode call. We keep both the structured
 * address components (so the FE can pick which part to render) and a
 * pre-formatted address string for direct display in the header.
 */
export type ReverseLookup = {
  province: string | null;
  city: string | null;
  district: string | null;
  township: string | null;
  street: string | null;
  /** Human-readable full address — what AMap calls `formatted_address`. */
  formattedAddress: string;
  /** Closest POI name (eg. nearest landmark/business), if available. */
  nearestPoi: string | null;
};

/**
 * One AMap POI we returned to the client. Stable across calls thanks to
 * `amapPoiId` so the FE can dedupe / cache by id.
 */
export type PoiHit = {
  amapPoiId: string;
  name: string;
  address: string;
  city: string;
  district: string | null;
  lat: number;
  lng: number;
  /** Distance from the search anchor in metres, when AMap returned it. */
  distanceMeters: number | null;
  /** AMap "type" string, eg. "体育休闲服务;运动场馆;乒乓球馆". */
  category: string | null;
};

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  async lookupByIp(ip: string): Promise<LocationLookup | null> {
    const cleanIp = this.normalizeIp(ip);
    if (!cleanIp) return null;
    // ip-api returns WGS84 lat/lon. We convert to GCJ-02 to match what
    // the rest of the app (Tencent maps, match distance, etc.) uses.
    const raw = await this.fetchFromIpApi(cleanIp);
    if (!raw || raw.status !== 'success') return null;
    const gcj = wgs84ToGcj02(raw.lat, raw.lon);
    return {
      lat: gcj.lat,
      lng: gcj.lng,
      city: this.translateCity(raw.city),
      country: raw.country ?? null,
      source: 'ip',
      ip: cleanIp,
    };
  }

  private normalizeIp(raw: string | undefined | null): string | null {
    if (!raw) return null;
    // X-Forwarded-For can carry a comma-separated chain; first entry is
    // the closest-to-origin client per RFC 7239.
    const first = raw.split(',')[0]?.trim();
    if (!first) return null;
    // IPv6-mapped IPv4: ::ffff:1.2.3.4 → 1.2.3.4
    const mapped = first.replace(/^::ffff:/i, '');
    // Don't bother querying for private / loopback ranges; ip-api returns
    // failure status and we'd spend a network roundtrip for nothing.
    if (/^(10\.|127\.|0\.|::1)/.test(mapped)) return null;
    if (/^192\.168\./.test(mapped)) return null;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(mapped)) return null;
    return mapped;
  }

  /**
   * ip-api returns English city names. We translate the common ones to
   * Chinese so the header reads natively. Names not in the map fall
   * through unchanged — the FE will display the English name as-is,
   * which is still way better than "其他城市".
   */
  private translateCity(name: string | null | undefined): string | null {
    if (!name) return null;
    const lookup: Record<string, string> = {
      // Tier-1 + venue cities
      Beijing: '北京',
      Shanghai: '上海',
      Hangzhou: '杭州',
      Guangzhou: '广州',
      Shenzhen: '深圳',
      // Other big metros (extend as we add venues)
      Chengdu: '成都',
      Chongqing: '重庆',
      Wuhan: '武汉',
      "Xi'an": '西安',
      Xian: '西安',
      Nanjing: '南京',
      Tianjin: '天津',
      Suzhou: '苏州',
      Changsha: '长沙',
      Qingdao: '青岛',
      Shenyang: '沈阳',
      Dalian: '大连',
      Xiamen: '厦门',
      Fuzhou: '福州',
      Ningbo: '宁波',
      Wuxi: '无锡',
      Zhengzhou: '郑州',
      Jinan: '济南',
      Hefei: '合肥',
      Nanchang: '南昌',
      Kunming: '昆明',
      Guiyang: '贵阳',
      Lanzhou: '兰州',
      Urumqi: '乌鲁木齐',
      Lhasa: '拉萨',
      Hohhot: '呼和浩特',
      'Hong Kong': '香港',
      Macau: '澳门',
      Taipei: '台北',
      Dongguan: '东莞',
      Foshan: '佛山',
      Zhuhai: '珠海',
    };
    return lookup[name] ?? name;
  }

  /**
   * Reverse-geocode GCJ-02 coords to a Chinese address via AMap's
   * Web Service API. Returns null when the key is missing (so the FE
   * can degrade to the IP-derived city label) or AMap rejected the
   * request.
   *
   * Coordinates passed in are expected to be GCJ-02 — same as what
   * wx.getLocation / wgs84ToGcj02 produce — which is the only system
   * AMap accepts on this endpoint.
   */
  async reverseGeocode(lat: number, lng: number): Promise<ReverseLookup | null> {
    const key = process.env.AMAP_KEY?.trim();
    if (!key) {
      this.logger.warn('reverseGeocode called but AMAP_KEY is not set');
      return null;
    }
    const path =
      `/v3/geocode/regeo?key=${encodeURIComponent(key)}` +
      `&location=${lng.toFixed(6)},${lat.toFixed(6)}` +
      '&extensions=base&poi=1&output=json';
    const body = await this.fetchHttps('restapi.amap.com', path);
    if (!body) return null;
    if (body.status !== '1' || !body.regeocode) {
      this.logger.warn(`AMap reverse failed: ${body.info ?? 'unknown'} (infocode=${body.infocode ?? '?'})`);
      return null;
    }
    const ac = body.regeocode.addressComponent ?? {};
    const pois: Array<{ name?: string; distance?: string }> = body.regeocode.pois ?? [];
    return {
      // AMap returns empty array `[]` instead of empty string when a
      // field is missing (eg. township in some districts). Normalize.
      province: this.normalizeAmapField(ac.province),
      city: this.normalizeAmapField(ac.city) ?? this.normalizeAmapField(ac.province),
      district: this.normalizeAmapField(ac.district),
      township: this.normalizeAmapField(ac.township),
      street: this.normalizeAmapField(ac.streetNumber?.street),
      formattedAddress: typeof body.regeocode.formatted_address === 'string'
        ? body.regeocode.formatted_address
        : '',
      nearestPoi: pois[0]?.name ?? null,
    };
  }

  /**
   * Search AMap POIs around the given GCJ-02 anchor. We bias toward
   * ping-pong venues by passing a curated category list when the caller
   * doesn't specify a keyword. Returns up to `limit` hits sorted by
   * distance (AMap's default for around-search).
   *
   * AMap docs: https://lbs.amap.com/api/webservice/guide/api/search
   */
  async searchPoi(args: {
    lat: number;
    lng: number;
    keyword?: string;
    radiusMeters?: number;
    limit?: number;
  }): Promise<PoiHit[]> {
    const key = process.env.AMAP_KEY?.trim();
    if (!key) {
      this.logger.warn('searchPoi called but AMAP_KEY is not set');
      return [];
    }
    const keyword = (args.keyword?.trim() ?? '').slice(0, 64);
    const radius = Math.min(Math.max(args.radiusMeters ?? 5000, 500), 50000);
    const limit = Math.min(Math.max(args.limit ?? 20, 1), 25);
    // Place around endpoint. `types` filters by AMap's category tree —
    // 080302 == 乒乓球馆 (table tennis halls) under 体育休闲服务/运动场馆.
    // If the caller supplies a keyword we drop the types filter so we
    // don't accidentally exclude relevant POIs that AMap classified
    // under another bucket.
    const params = new URLSearchParams({
      key,
      location: `${args.lng.toFixed(6)},${args.lat.toFixed(6)}`,
      radius: String(radius),
      offset: String(limit),
      page: '1',
      extensions: 'base',
      output: 'json',
    });
    // AMap's typeCode filter for sports venues (0803xx) leaks in KTVs
    // and general entertainment spots, so we just use the keyword path
    // every time. When the user didn't type anything we seed with
    // "乒乓球" — the highest-recall query for the venues this app cares
    // about (covers 乒乓球馆 / 乒乓球俱乐部 / 乒乓球训练中心 etc).
    params.set('keywords', keyword || '乒乓球');
    const body = await this.fetchHttps('restapi.amap.com', `/v3/place/around?${params.toString()}`);
    if (!body || body.status !== '1') {
      this.logger.warn(`AMap POI search failed: ${body?.info ?? 'unknown'} (infocode=${body?.infocode ?? '?'})`);
      return [];
    }
    const raw = Array.isArray(body.pois) ? body.pois : [];
    const hits: PoiHit[] = [];
    for (const item of raw) {
      const id = this.normalizeAmapField(item.id);
      const name = this.normalizeAmapField(item.name);
      const loc = typeof item.location === 'string' ? item.location.split(',') : [];
      const lng = loc.length === 2 ? Number(loc[0]) : NaN;
      const lat = loc.length === 2 ? Number(loc[1]) : NaN;
      if (!id || !name || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      const distance = Number(item.distance);
      hits.push({
        amapPoiId: id,
        name,
        address:
          this.normalizeAmapField(item.address) ??
          this.normalizeAmapField(item.pname) ??
          name,
        city:
          this.normalizeAmapField(item.cityname) ??
          this.normalizeAmapField(item.pname) ??
          '',
        district: this.normalizeAmapField(item.adname),
        lat,
        lng,
        distanceMeters: Number.isFinite(distance) ? distance : null,
        category: this.normalizeAmapField(item.type),
      });
    }
    return hits;
  }

  private normalizeAmapField(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private fetchHttps(host: string, path: string): Promise<any | null> {
    return new Promise((resolve) => {
      const req = httpsRequest(
        { host, path, method: 'GET', timeout: IP_API_TIMEOUT_MS },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => {
            try {
              resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
            } catch {
              resolve(null);
            }
          });
          res.on('error', () => resolve(null));
        },
      );
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
      req.on('error', (err) => {
        this.logger.warn(`HTTPS request to ${host} failed: ${err.message}`);
        resolve(null);
      });
      req.end();
    });
  }

  private fetchFromIpApi(ip: string): Promise<{
    status: string;
    lat: number;
    lon: number;
    city?: string;
    country?: string;
  } | null> {
    const path = `/json/${encodeURIComponent(ip)}?fields=status,country,city,lat,lon`;
    return new Promise((resolve) => {
      const req = httpRequest(
        { host: IP_API_HOST, path, method: 'GET', timeout: IP_API_TIMEOUT_MS },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => {
            try {
              const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
              resolve(parsed);
            } catch {
              resolve(null);
            }
          });
          res.on('error', () => resolve(null));
        },
      );
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
      req.on('error', (err) => {
        this.logger.warn(`ip-api lookup failed for ${ip}: ${err.message}`);
        resolve(null);
      });
      req.end();
    });
  }
}
