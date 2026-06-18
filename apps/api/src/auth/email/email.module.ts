import { Module, Logger } from '@nestjs/common';
import type { Provider } from '@nestjs/common';
import { LogEmailProvider } from './log-email.provider';
import { SmtpEmailProvider } from './smtp-email.provider';
import type { EmailProvider } from './email-provider';

export const EMAIL_PROVIDER_TOKEN = 'EMAIL_PROVIDER';

/**
 * Resolves the active EmailProvider from EMAIL_PROVIDER env var.
 *
 * - EMAIL_PROVIDER=smtp → SmtpEmailProvider (must have SMTP_* set)
 * - EMAIL_PROVIDER=log  → LogEmailProvider  (writes to stdout; dev only)
 * - unset and NODE_ENV != production → log fallback
 * - unset and NODE_ENV == production → throw to fail-fast at boot
 */
const emailProviderFactory: Provider = {
  provide: EMAIL_PROVIDER_TOKEN,
  useFactory: (smtp: SmtpEmailProvider, log: LogEmailProvider): EmailProvider => {
    const requested = (process.env.EMAIL_PROVIDER ?? '').toLowerCase().trim();
    const logger = new Logger('EmailModule');

    if (requested === 'smtp') {
      if (!smtp.isConfigured()) {
        throw new Error(
          'EMAIL_PROVIDER=smtp but SMTP_HOST/SMTP_USER/SMTP_PASS/SMTP_FROM are missing; ' +
            'set them or use EMAIL_PROVIDER=log for dev.',
        );
      }
      logger.log('Email provider: smtp');
      return smtp;
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'EMAIL_PROVIDER must be set to a real provider in production (e.g. smtp); ' +
          'refusing to fall back to LogEmailProvider.',
      );
    }

    logger.warn('Email provider: log (dev fallback). Set EMAIL_PROVIDER=smtp for staging/production.');
    return log;
  },
  inject: [SmtpEmailProvider, LogEmailProvider],
};

@Module({
  providers: [SmtpEmailProvider, LogEmailProvider, emailProviderFactory],
  exports: [EMAIL_PROVIDER_TOKEN],
})
export class EmailModule {}
