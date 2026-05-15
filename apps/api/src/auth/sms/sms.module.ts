import { Module, Logger } from '@nestjs/common';
import type { Provider } from '@nestjs/common';
import { AliyunSmsProvider } from './aliyun-sms.provider';
import { LogSmsProvider } from './log-sms.provider';
import type { SmsProvider } from './sms-provider';

export const SMS_PROVIDER_TOKEN = 'SMS_PROVIDER';

const smsProviderFactory: Provider = {
  provide: SMS_PROVIDER_TOKEN,
  useFactory: (aliyun: AliyunSmsProvider, log: LogSmsProvider): SmsProvider => {
    const requested = (process.env.SMS_PROVIDER ?? '').toLowerCase().trim();
    const logger = new Logger('SmsModule');

    if (requested === 'aliyun') {
      if (!aliyun.isConfigured()) {
        throw new Error(
          'SMS_PROVIDER=aliyun but ALIYUN_SMS_* env vars are missing; set them or use SMS_PROVIDER=log for dev.',
        );
      }
      logger.log('SMS provider: aliyun');
      return aliyun;
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'SMS_PROVIDER must be a real carrier in production (e.g. aliyun); refusing to fall back to LogSmsProvider.',
      );
    }

    logger.warn('SMS provider: log (dev fallback). Set SMS_PROVIDER=aliyun for staging/production.');
    return log;
  },
  inject: [AliyunSmsProvider, LogSmsProvider],
};

@Module({
  providers: [AliyunSmsProvider, LogSmsProvider, smsProviderFactory],
  exports: [SMS_PROVIDER_TOKEN],
})
export class SmsModule {}
