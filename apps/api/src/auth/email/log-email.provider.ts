import { Injectable, Logger } from '@nestjs/common';
import type { EmailProvider } from './email-provider';

/**
 * Default fallback for dev/staging — writes the OTP to stdout so QA can
 * "receive" the code without wiring real SMTP. Production must use a
 * concrete provider (SmtpEmailProvider, etc.) — see email.module.ts which
 * refuses to fall back to this in NODE_ENV=production.
 */
@Injectable()
export class LogEmailProvider implements EmailProvider {
  readonly name = 'log';
  private readonly logger = new Logger(LogEmailProvider.name);

  async send(email: string, code: string) {
    this.logger.warn(`[EMAIL:log] to=${email} code=${code} — wire a real provider before going live.`);
    return { delivered: true, messageId: 'log-only' };
  }
}
