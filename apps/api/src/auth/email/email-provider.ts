/**
 * Email OTP delivery contract. Same shape as SmsProvider so the auth
 * layer can switch on the requested channel without caring about the
 * carrier behind it.
 *
 * To add a real provider:
 *   1. Implement EmailProvider in apps/api/src/auth/email/<name>.provider.ts
 *   2. Wire it in email.module.ts (resolveEmailProvider)
 *   3. Set EMAIL_PROVIDER=<name> + provider env vars in your deploy config.
 */
export interface EmailProvider {
  readonly name: string;
  send(email: string, code: string): Promise<{ delivered: boolean; messageId?: string }>;
}
