export type SessionUser = {
  id: string;
  // Phone is null for users who registered via email or WeChat without
  // linking a phone number.
  phone: string | null;
  email?: string | null;
  nickname: string;
  city: string;
  level: string;
  avatarUrl?: string | null;
  creditScore: number;
};

export type PublicUserProfile = {
  id: string;
  nickname: string;
  city: string;
  level: string;
  avatarUrl?: string | null;
  creditScore: number;
  createdAt: string;
  hostedMatches: number;
  joinedMatches: number;
};

export type UpdateProfilePayload = {
  nickname?: string;
  city?: string;
  level?: string;
  avatarUrl?: string;
};

export type SessionPayload = {
  token: string;
  user: SessionUser;
};

/**
 * /auth/verify-code returns this when the phone isn't in the system yet,
 * so the client can transition straight into the registration form
 * without making the user request a second SMS.
 */
export type RegistrationHintPayload = {
  requiresRegistration: true;
  phone: string;
};

export type VerifyCodeResponse = SessionPayload | RegistrationHintPayload;

export type RegisterPayload = {
  phone: string;
  code: string;
  nickname: string;
  city?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
};

// ---- Email + password auth (H5 primary channel) ----
export type LoginEmailPayload = {
  email: string;
  password: string;
};

export type RegisterEmailPayload = {
  email: string;
  password: string;
  nickname: string;
  city?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
};

export type MatchLifecycle = 'upcoming' | 'live' | 'completed' | 'cancelled';

export type MatchCard = {
  id: string;
  title: string;
  hostUserId?: string;
  courtId?: string | null;
  slotId?: string | null;
  venueName: string;
  startTime: string;
  distanceKm: number;
  maxPlayers: number;
  openSlots: number;
  status?: 'open' | 'cancelled';
  /** Derived phase: 'upcoming' | 'live' | 'completed' | 'cancelled'. */
  lifecycle?: MatchLifecycle;
  coverUrl?: string | null;
  hostCreditScore: number;
  level: string;
  matchRate: number;
  city: string;
  score: number;
  /** Populated by /matches and /matches/:id; absent on /matches/mine etc. */
  venueLatitude?: number | null;
  venueLongitude?: number | null;
  venueAddress?: string | null;
};

export type MatchListResponse = {
  items: MatchCard[];
};

export type CreateMatchPayload = {
  title: string;
  venueId: string;
  /** Either slotId (preset venue slot) or startTime (custom ISO) must be set. */
  slotId?: string;
  startTime?: string;
  courtId?: string;
  /** Free-text court label; can be filled in later via PATCH /matches/:id. */
  courtName?: string;
  level: string;
  maxPlayers: number;
  startDate?: string;
  coverUrl?: string;
};

export type UpdateMatchPayload = {
  courtName?: string;
};

export type UploadKind = 'avatar' | 'match-cover';

export type UploadResponse = {
  key: string;
  url: string;
};

export type MatchOptionVenue = {
  id: string;
  name: string;
  city: string;
  district: string;
  distanceKm: number;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  sortOrder: number;
  courts: Array<{
    id: string;
    name: string;
    sortOrder: number;
  }>;
};

export type MatchOptionTimeSlot = {
  id: string;
  slotId: string;
  venueId: string;
  venueName: string;
  label: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
};

export type MatchOptionPreset<TValue extends string | number = string | number> = {
  id: string;
  value: TValue;
  label: string;
  sortOrder: number;
};

export type MatchOptionsResponse = {
  venues: MatchOptionVenue[];
  timeSlots: MatchOptionTimeSlot[];
  levels: Array<MatchOptionPreset<string>>;
  playerCounts: Array<MatchOptionPreset<number>>;
};

export type MatchApplication = {
  matchId: string;
  userId: string;
  status: string;
};

export type MyMatchApplicationStatus = {
  status: 'none' | 'pending' | 'approved' | 'rejected';
  applicationId?: string;
  matchId?: string;
  userId?: string;
  reason?: string;
};

export type HostedMatchApplication = {
  id: string;
  matchId: string;
  userId: string;
  status: string;
  createdAt: string;
  decisionReason?: string;
  applicantNickname: string;
  applicantCity: string;
  applicantLevel: string;
  applicantCreditScore: number;
};

export type HostedMatchApplicationsResponse = {
  items: HostedMatchApplication[];
};

export type MessagePreview = {
  id: string;
  kind: string;
  title: string;
  content: string;
  senderId?: string | null;
  senderName?: string | null;
  isRead: boolean;
  status?: string | null;
  matchId?: string | null;
  threadId?: string | null;
  createdAt: string;
};

export type MessageSummary = {
  unreadSystemCount: number;
  unreadChatCount: number;
  pendingInvitesCount: number;
};

export type ChatThreadSummary = {
  id: string;
  matchId: string;
  title: string;
  venueName: string;
  scheduledAt: string;
  hostUserId: string;
  status: string;
  latestMessagePreview: string;
  latestMessageAt: string;
  lastMessageSenderId?: string | null;
  lastMessageSenderName?: string | null;
  unreadCount: number;
  participantCount: number;
  lastReadAt: string | null;
};

export type ChatThreadParticipant = {
  userId: string;
  nickname: string;
  city: string;
  level: string;
  creditScore: number;
  role: string;
  joinedAt: string;
  lastReadAt: string | null;
};

export type ChatThreadDetail = {
  thread: ChatThreadSummary;
  participants: ChatThreadParticipant[];
};

export type ThreadMessagesResponse = {
  participantCount: number;
  items: MessagePreview[];
};

export type ThreadReadResponse = {
  threadId: string;
  updatedCount: number;
  lastReadAt: string;
};

export type ReviewSummary = {
  id: string;
  matchId: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  score: number;
  tags: string[];
  anonymous?: boolean;
  createdAt: string;
};

export type ReviewProfile = {
  user: {
    id: string;
    nickname: string;
    city: string;
    level: string;
    creditScore: number;
  };
  stats: {
    totalReviews: number;
    positiveReviews: number;
    averageScore: number;
  };
  tags: Array<{
    tag: string;
    count: number;
  }>;
  items: ReviewSummary[];
};

export type SubmitReviewPayload = {
  matchId: string;
  revieweeId: string;
  score: number;
  tags: string[];
  anonymous?: boolean;
};

export type SubmitReviewResponse = {
  review: {
    id: string;
    matchId: string;
    reviewerId: string;
    revieweeId: string;
    score: number;
    tags: string[];
    createdAt: string;
  };
  reviewee: {
    id: string;
    creditScore: number;
  };
};
