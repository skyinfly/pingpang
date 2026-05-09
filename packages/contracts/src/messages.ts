import { z } from 'zod';

export const messagePreviewSchema = z.object({
  id: z.string(),
  kind: z.string(),
  title: z.string(),
  content: z.string(),
  senderId: z.string().nullable().optional(),
  senderName: z.string().nullable().optional(),
  isRead: z.boolean(),
  createdAt: z.string(),
  status: z.string().nullable().optional(),
  matchId: z.string().nullable().optional(),
});

export const messageSummarySchema = z.object({
  unreadSystemCount: z.number().int().nonnegative(),
  unreadChatCount: z.number().int().nonnegative(),
  pendingInvitesCount: z.number().int().nonnegative(),
});

export const createMessagePayloadSchema = z.object({
  userId: z.string(),
  kind: z.string(),
  title: z.string(),
  content: z.string(),
  senderId: z.string().optional(),
  senderName: z.string().optional(),
  status: z.string().optional(),
  matchId: z.string().optional(),
});

export const markMessagesReadPayloadSchema = z.object({
  userId: z.string(),
  kind: z.string().optional(),
  matchId: z.string().optional(),
});

export type MessagePreview = z.infer<typeof messagePreviewSchema>;
export type MessageSummary = z.infer<typeof messageSummarySchema>;
export type CreateMessagePayload = z.infer<typeof createMessagePayloadSchema>;
export type MarkMessagesReadPayload = z.infer<typeof markMessagesReadPayloadSchema>;
