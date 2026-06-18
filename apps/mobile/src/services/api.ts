import { useAuthStore } from '../stores/auth';
import { http, resolveApiBaseUrl } from './http';
import type {
  ChatThreadDetail,
  ChatThreadSummary,
  CreateMatchPayload,
  LoginEmailPayload,
  MatchApplication,
  MatchCard,
  MatchListResponse,
  HostedMatchApplicationsResponse,
  MatchOptionsResponse,
  MyMatchApplicationStatus,
  MessagePreview,
  MessageSummary,
  PublicUserProfile,
  RegisterEmailPayload,
  RegisterPayload,
  ReviewProfile,
  SubmitReviewPayload,
  SubmitReviewResponse,
  SessionPayload,
  SessionUser,
  UpdateProfilePayload,
  UploadKind,
  UploadResponse,
  ThreadMessagesResponse,
  ThreadReadResponse,
  VerifyCodeResponse,
} from './types';

function withAuthHeaders(headers: Record<string, string> = {}) {
  const authStore = useAuthStore();

  if (!authStore.token) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${authStore.token}`,
  };
}

function buildQuery(params: Record<string, string | undefined>) {
  return Object.entries(params)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}

export function requestLoginCode(phone: string) {
  return http<{ ok: boolean; phone: string; devCode?: string }>('/auth/request-code', {
    method: 'POST',
    data: { phone },
  });
}

export function verifyLoginCode(phone: string, code: string) {
  // Response is union-typed: existing users get { token, user }; new
  // numbers get { requiresRegistration: true, phone } so the caller can
  // route into the register form without prompting for a fresh SMS.
  return http<VerifyCodeResponse>('/auth/verify-code', {
    method: 'POST',
    data: { phone, code },
  });
}

export function registerUser(payload: RegisterPayload) {
  return http<SessionPayload>('/auth/register', {
    method: 'POST',
    data: payload,
  });
}

// ---- Email + password auth (H5) ----

export function registerEmailUser(payload: RegisterEmailPayload) {
  return http<SessionPayload>('/auth/email/register', {
    method: 'POST',
    data: payload,
  });
}

export function loginEmailUser(payload: LoginEmailPayload) {
  return http<SessionPayload>('/auth/email/login', {
    method: 'POST',
    data: payload,
  });
}

/**
 * IP-based geolocation fallback. The store calls this when the browser
 * geolocation API isn't usable (HTTP origin, denied permission, missing
 * sensor) so we can still show a sensible city in the header. Always
 * resolves — returns { available: false } when ip-api couldn't help.
 */
export type IpLocation =
  | { available: true; lat: number; lng: number; city: string | null; country: string | null; source: 'ip'; ip: string }
  | { available: false };

export function lookupLocationByIp() {
  return http<IpLocation>('/location/ip');
}

/**
 * Reverse-geocode GCJ-02 coords (from browser/wechat GPS) to a Chinese
 * street/POI address. Backed by AMap on the server. Coords are passed
 * with 6-decimal precision — AMap rejects anything finer.
 */
export type ReverseLocation =
  | {
      available: true;
      province: string | null;
      city: string | null;
      district: string | null;
      township: string | null;
      street: string | null;
      formattedAddress: string;
      nearestPoi: string | null;
    }
  | { available: false };

export function reverseLookupLocation(coords: { lat: number; lng: number }) {
  const query = buildQuery({ lat: coords.lat.toFixed(6), lng: coords.lng.toFixed(6) });
  return http<ReverseLocation>(`/location/reverse?${query}`);
}

export type PoiHit = {
  amapPoiId: string;
  name: string;
  address: string;
  city: string;
  district: string | null;
  lat: number;
  lng: number;
  distanceMeters: number | null;
  category: string | null;
};

/**
 * Search nearby venues via the AMap-backed POI endpoint. With no
 * keyword the backend returns 乒乓球馆 (table-tennis halls) by default.
 */
export function searchVenuePois(args: {
  lat: number;
  lng: number;
  keyword?: string;
  radiusMeters?: number;
}) {
  const query = buildQuery({
    lat: args.lat.toFixed(6),
    lng: args.lng.toFixed(6),
    keyword: args.keyword,
    radiusMeters: args.radiusMeters != null ? String(args.radiusMeters) : undefined,
  });
  return http<{ items: PoiHit[] }>(`/location/poi/search?${query}`);
}

export type UpsertedVenue = {
  id: string;
  name: string;
  city: string;
  district: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  courts: Array<{ id: string; name: string; sortOrder: number }>;
  timeSlots: Array<{
    slotId: string;
    id: string;
    venueId: string;
    venueName: string;
    label: string;
    startTime: string;
    endTime: string;
    sortOrder: number;
  }>;
};

export function upsertVenueFromPoi(poi: PoiHit) {
  return http<UpsertedVenue>('/matches/venues/from-poi', {
    method: 'POST',
    data: {
      amapPoiId: poi.amapPoiId,
      name: poi.name,
      city: poi.city,
      district: poi.district ?? undefined,
      address: poi.address,
      lat: poi.lat,
      lng: poi.lng,
    },
    headers: withAuthHeaders(),
  });
}

export function loginWithWechat(code: string) {
  return http<SessionPayload>('/auth/wechat-login', {
    method: 'POST',
    data: { code },
  });
}

export function uploadFile(kind: UploadKind, filePath: string): Promise<UploadResponse> {
  const authStore = useAuthStore();
  const baseUrl = resolveApiBaseUrl();

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${baseUrl}/uploads/${kind}`,
      filePath,
      name: 'file',
      header: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {},
      success: (res) => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const parsed = JSON.parse(res.data) as UploadResponse;
            resolve(parsed);
            return;
          }
          reject(new Error(`upload failed: ${res.statusCode}`));
        } catch (error) {
          reject(error instanceof Error ? error : new Error('upload response parse failed'));
        }
      },
      fail: (err: { errMsg?: string } = {}) => {
        reject(new Error(err.errMsg ?? 'upload failed'));
      },
    });
  });
}

export function fetchMyProfile() {
  return http<SessionUser>('/users/me', {
    headers: withAuthHeaders(),
  });
}

export function updateMyProfile(payload: UpdateProfilePayload) {
  return http<SessionUser>('/users/me', {
    method: 'PATCH',
    data: payload,
    headers: withAuthHeaders(),
  });
}

export function fetchPublicProfile(userId: string) {
  return http<PublicUserProfile>(`/users/${encodeURIComponent(userId)}`);
}

export function listMatches(
  filters: { city?: string; level?: string; lat?: number; lng?: number; radiusKm?: number } = {},
) {
  const query = buildQuery({
    city: filters.city,
    level: filters.level,
    lat: filters.lat != null ? String(filters.lat) : undefined,
    lng: filters.lng != null ? String(filters.lng) : undefined,
    radiusKm: filters.radiusKm != null ? String(filters.radiusKm) : undefined,
  });
  return http<MatchListResponse>(query ? `/matches?${query}` : '/matches');
}

export function listMyMatches() {
  return http<MatchListResponse>('/matches/mine', {
    headers: withAuthHeaders(),
  });
}

export function listJoinedMatches() {
  return http<MatchListResponse>('/matches/joined', {
    headers: withAuthHeaders(),
  });
}

export function listHostedApplications(matchId: string) {
  return http<HostedMatchApplicationsResponse>(`/matches/${encodeURIComponent(matchId)}/applications`, {
    headers: withAuthHeaders(),
  });
}

export function fetchMyMatchApplicationStatus(matchId: string) {
  return http<MyMatchApplicationStatus>(`/matches/${encodeURIComponent(matchId)}/my-application`, {
    headers: withAuthHeaders(),
  });
}

export function approveHostedApplication(matchId: string, applicationId: string) {
  return http(`/matches/${encodeURIComponent(matchId)}/applications/${encodeURIComponent(applicationId)}/approve`, {
    method: 'POST',
    data: {},
    headers: withAuthHeaders(),
  });
}

export function rejectHostedApplication(matchId: string, applicationId: string, reason: string) {
  return http(`/matches/${encodeURIComponent(matchId)}/applications/${encodeURIComponent(applicationId)}/reject`, {
    method: 'POST',
    data: { reason },
    headers: withAuthHeaders(),
  });
}

export function fetchMatchById(id: string, location?: { lat: number; lng: number }) {
  const query = location
    ? `?${buildQuery({ lat: String(location.lat), lng: String(location.lng) })}`
    : '';
  return http<MatchCard>(`/matches/${encodeURIComponent(id)}${query}`);
}

export function fetchMatchOptions(location?: { lat: number; lng: number }) {
  const query = location
    ? `?${buildQuery({ lat: String(location.lat), lng: String(location.lng) })}`
    : '';
  return http<MatchOptionsResponse>(`/match-options${query}`);
}

export function createMatch(payload: CreateMatchPayload) {
  return http<MatchCard>('/matches', {
    method: 'POST',
    data: payload,
    headers: withAuthHeaders(),
  });
}

export function updateHostedMatch(matchId: string, payload: { courtName?: string }) {
  return http<MatchCard>(`/matches/${encodeURIComponent(matchId)}`, {
    method: 'PATCH',
    data: payload,
    headers: withAuthHeaders(),
  });
}

export function applyToMatch(id: string) {
  return http<MatchApplication>(`/matches/${encodeURIComponent(id)}/applications`, {
    method: 'POST',
    data: {},
    headers: withAuthHeaders(),
  });
}

export function cancelHostedMatch(matchId: string, reason?: string) {
  return http<MatchCard>(`/matches/${encodeURIComponent(matchId)}/cancel`, {
    method: 'POST',
    data: reason ? { reason } : {},
    headers: withAuthHeaders(),
  });
}

/**
 * Hard delete a match record. The backend refuses if the match is still
 * live or has joined members; safe to call on cancelled / abandoned ones.
 */
export function deleteHostedMatch(matchId: string) {
  return http<{ ok: true; id: string }>(`/matches/${encodeURIComponent(matchId)}`, {
    method: 'DELETE',
    headers: withAuthHeaders(),
  });
}

export function fetchMessageSummary() {
  return http<MessageSummary>('/messages/summary', {
    headers: withAuthHeaders(),
  });
}

export function listMessages(filters: { kind?: string; matchId?: string } = {}) {
  const query = buildQuery(filters);
  return http<{ items: MessagePreview[] }>(query ? `/messages?${query}` : '/messages', {
    headers: withAuthHeaders(),
  });
}

export function markMessagesRead(filters: { kind?: string; matchId?: string } = {}) {
  return http<{ updatedCount: number }>('/messages/read', {
    method: 'POST',
    data: filters,
    headers: withAuthHeaders(),
  });
}

export function clearMessages(filters: { kind?: string } = {}) {
  const query = buildQuery(filters);
  return http<{ deletedCount: number }>(query ? `/messages?${query}` : '/messages', {
    method: 'DELETE',
    headers: withAuthHeaders(),
  });
}

export function listChatThreads() {
  return http<{ items: ChatThreadSummary[] }>('/chat-threads', {
    headers: withAuthHeaders(),
  });
}

export function fetchChatThreadDetail(threadId: string) {
  return http<ChatThreadDetail>(`/chat-threads/${encodeURIComponent(threadId)}`, {
    headers: withAuthHeaders(),
  });
}

export function listThreadMessages(threadId: string) {
  return http<ThreadMessagesResponse>(`/chat-threads/${encodeURIComponent(threadId)}/messages`, {
    headers: withAuthHeaders(),
  });
}

export function createThreadMessage(threadId: string, content: string) {
  return http<MessagePreview>(`/chat-threads/${encodeURIComponent(threadId)}/messages`, {
    method: 'POST',
    data: { content },
    headers: withAuthHeaders(),
  });
}

export function markChatThreadRead(threadId: string) {
  return http<ThreadReadResponse>(`/chat-threads/${encodeURIComponent(threadId)}/read`, {
    method: 'POST',
    data: {},
    headers: withAuthHeaders(),
  });
}

export function fetchReviewProfile(userId: string) {
  return http<ReviewProfile>(`/reviews/profile/${encodeURIComponent(userId)}`);
}

export function submitReview(payload: SubmitReviewPayload) {
  return http<SubmitReviewResponse>('/reviews', {
    method: 'POST',
    data: payload,
    headers: withAuthHeaders(),
  });
}

export function withdrawReview(reviewId: string) {
  return http<{ ok: true; id: string }>(`/reviews/${encodeURIComponent(reviewId)}`, {
    method: 'DELETE',
    headers: withAuthHeaders(),
  });
}

export function ensureMatchCheckInCode(matchId: string) {
  return http<{ code: string }>(`/matches/${encodeURIComponent(matchId)}/check-in-code`, {
    method: 'POST',
    data: {},
    headers: withAuthHeaders(),
  });
}

export function fetchMatchCheckIns(matchId: string) {
  return http<{
    items: Array<{
      userId: string;
      nickname: string;
      level: string;
      creditScore: number;
      role: string;
      checkedInAt: string | null;
    }>;
  }>(`/matches/${encodeURIComponent(matchId)}/check-ins`, {
    headers: withAuthHeaders(),
  });
}

export function submitMatchCheckIn(matchId: string, code: string) {
  return http<{ ok: true; checkedInAt: string; alreadyCheckedIn: boolean }>(
    `/matches/${encodeURIComponent(matchId)}/check-in`,
    {
      method: 'POST',
      data: { code },
      headers: withAuthHeaders(),
    },
  );
}

export function reportUser(payload: { targetUserId: string; reason: string; matchId?: string }) {
  return http<{ id: string; status: string; createdAt: string }>('/reports', {
    method: 'POST',
    data: payload,
    headers: withAuthHeaders(),
  });
}

export const apiClient = {
  requestLoginCode,
  verifyLoginCode,
  registerUser,
  registerEmailUser,
  loginEmailUser,
  loginWithWechat,
  fetchMyProfile,
  updateMyProfile,
  uploadFile,
  fetchPublicProfile,
  listMatches,
  listMyMatches,
  listJoinedMatches,
  listHostedApplications,
  fetchMyMatchApplicationStatus,
  approveHostedApplication,
  rejectHostedApplication,
  fetchMatchById,
  fetchMatchOptions,
  createMatch,
  updateHostedMatch,
  applyToMatch,
  cancelHostedMatch,
  deleteHostedMatch,
  fetchMessageSummary,
  listMessages,
  listChatThreads,
  fetchChatThreadDetail,
  listThreadMessages,
  createThreadMessage,
  markChatThreadRead,
  fetchReviewProfile,
  submitReview,
  withdrawReview,
  ensureMatchCheckInCode,
  fetchMatchCheckIns,
  submitMatchCheckIn,
  reportUser,
};
