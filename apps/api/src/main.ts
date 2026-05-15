import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { getAppConfig } from './common/env/app-config';
import { initSentry, captureBootstrapError } from './common/observability/sentry';

async function bootstrap() {
  const config = getAppConfig();
  initSentry({ dsn: process.env.SENTRY_DSN, environment: config.nodeEnv });

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const allowed = (process.env.CORS_ALLOW_ORIGIN ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  app.enableCors({
    origin: allowed.length > 0 ? allowed : true,
    credentials: true,
  });
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

bootstrap().catch((error) => {
  captureBootstrapError(error);
  // eslint-disable-next-line no-console
  console.error('Bootstrap failed', error);
  process.exit(1);
});
