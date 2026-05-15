import { Injectable, Logger } from '@nestjs/common';
import type { SmsProvider } from './sms-provider';

/**
 * Default fallback when no real carrier is configured.
 * Logs the OTP code so developers can see it locally; never use in prod.
 */
@Injectable()
export class LogSmsProvider implements SmsProvider {
  readonly name = 'log';
  private readonly logger = new Logger(LogSmsProvider.name);

  async send(phone: string, code: string) {
    this.logger.warn(`[SMS:log] phone=${phone} code=${code} — wire a real provider before going live.`);
    return { delivered: true, messageId: 'log-only' };
  }
}
