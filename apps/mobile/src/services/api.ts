import { useAuthStore } from '../stores/auth';
import { http, resolveApiBaseUrl } from './http';
import type {
  ChatThreadDetail,
  ChatThreadSummary,
  CreateMatchPayload,
  MatchApplication,
  MatchCard,
  MatchListResponse,
  HostedMatchApplicationsResponse,
  MatchOptionsResponse,
  MyMatchApplicationStatus,
  MessagePreview,
  MessageSummary,
  PublicUserProfile,
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
  return http<SessionPayload>('/auth/verify-code', {
    method: 'POST',
    data: { phone, code },
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

export function listMatches(filters: { city?: string; level?: string } = {}) {
  const query = buildQuery(filters);
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

export function fetchMatchById(id: string) {
  return http<MatchCard>(`/matches/${encodeURIComponent(id)}`);
}

export function fetchMatchOptions() {
  return http<MatchOptionsResponse>('/match-options');
}

export function createMatch(payload: CreateMatchPayload) {
  return http<MatchCard>('/matches', {
    method: 'POST',
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
  applyToMatch,
  cancelHostedMatch,
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
