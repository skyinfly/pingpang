import { Controller, Get, Query, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { parseLatLngQuery } from '../common/geo/geo';
import { LocationService } from './location.service';

// Tiny shape — we don't want to pull in @types/express, and only need
// the request fields nginx populates for us.
type IncomingRequest = {
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
  ip?: string;
};

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  /**
   * IP-based geo fallback. Called by the H5 client when the browser
   * geolocation API is unavailable (HTTP origin) or denied. Returns
   * GCJ-02 coords so the response can be passed straight into the
   * existing match/distance flows.
   */
  @Get('ip')
  // Lenient throttle: any one user calls this at most once per page load,
  // but the API host shares ip-api's 45 req/min limit so a noisy bot
  // could starve everyone else without this cap.
  @Throttle({ default: { ttl: 60_000, limit: 60 } })
  async lookupByIp(@Req() req: IncomingRequest) {
    const xff = req.headers['x-forwarded-for'];
    const ip =
      (Array.isArray(xff) ? xff[0] : xff) ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      req.ip;
    const result = await this.locationService.lookupByIp(
      (Array.isArray(ip) ? ip[0] : ip) ?? '',
    );
    if (!result) {
      // Don't 404 — the FE treats this as "no location" without retry.
      return { available: false as const };
    }
    return { available: true as const, ...result };
  }

  /**
   * Reverse-geocode GCJ-02 coordinates to a Chinese street/POI address
   * via AMap. Used after the H5 client grabs a precise GPS fix from the
   * browser, so the LocationHeader can display "上海市徐汇区肇嘉浜路 1065 号"
   * instead of just a coarse city name.
   */
  @Get('reverse')
  @Throttle({ default: { ttl: 60_000, limit: 120 } })
  async reverse(@Query('lat') latRaw?: string, @Query('lng') lngRaw?: string) {
    const coords = parseLatLngQuery(latRaw, lngRaw);
    if (!coords) return { available: false as const };
    const result = await this.locationService.reverseGeocode(coords.lat, coords.lng);
    if (!result) return { available: false as const };
    return { available: true as const, ...result };
  }

  /**
   * Search nearby table-tennis venues. Used by the create-match flow's
   * "搜索附近球馆" panel. With no keyword we return AMap's curated
   * 乒乓球馆 category (typeCode 080302); with a keyword we let the user
   * widen the search to general queries like "羽毛球" or a venue name.
   */
  @Get('poi/search')
  @Throttle({ default: { ttl: 60_000, limit: 60 } })
  async searchPoi(
    @Query('lat') latRaw?: string,
    @Query('lng') lngRaw?: string,
    @Query('keyword') keyword?: string,
    @Query('radiusMeters') radiusRaw?: string,
    @Query('limit') limitRaw?: string,
  ) {
    const coords = parseLatLngQuery(latRaw, lngRaw);
    if (!coords) return { items: [] as const };
    const radius = radiusRaw ? Number(radiusRaw) : undefined;
    const limit = limitRaw ? Number(limitRaw) : undefined;
    const hits = await this.locationService.searchPoi({
      lat: coords.lat,
      lng: coords.lng,
      keyword,
      radiusMeters: Number.isFinite(radius) ? radius : undefined,
      limit: Number.isFinite(limit) ? limit : undefined,
    });
    return { items: hits };
  }
}
