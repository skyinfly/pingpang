export type SessionUser = {
  id: string;
  phone: string;
  nickname: string;
  city: string;
  level: string;
  creditScore: number;
};

export type SessionPayload = {
  token: string;
  user: SessionUser;
};

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
  hostCreditScore: number;
  level: string;
  matchRate: number;
  city: string;
  score: number;
};

export type MatchListResponse = {
  items: MatchCard[];
};

export type CreateMatchPayload = {
  title: string;
  venueId: string;
  courtId: string;
  slotId: string;
  level: string;
  maxPlayers: number;
};

export type MatchOptionVenue = {
  id: string;
  name: string;
  city: string;
  district: string;
  distanceKm: number;
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
