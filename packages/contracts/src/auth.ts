import { z } from 'zod';

export const authSessionSchema = z.object({
  accessToken: z.string(),
  userId: z.string(),
});

export type AuthSession = z.infer<typeof authSessionSchema>;
