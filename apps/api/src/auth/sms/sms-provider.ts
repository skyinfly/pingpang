// SMS delivery contract. Each concrete provider must implement send(); the
// auth flow stays oblivious to the carrier behind it.
//
// Add a new provider by:
//   1. Implement SmsProvider in apps/api/src/auth/sms/<name>.provider.ts
//   2. Wire it in apps/api/src/auth/sms/sms.module.ts (resolveSmsProvider)
//   3. Set SMS_PROVIDER=<name> + the provider-specific env vars in your
//      production config.

export interface SmsProvider {
  readonly name: string;
  send(phone: string, code: string): Promise<{ delivered: boolean; messageId?: string }>;
}
