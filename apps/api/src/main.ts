import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { getAppConfig } from './common/env/app-config';
import { initSentry, captureBootstrapError } from './common/observability/sentry';
import { UploadsService } from './uploads/uploads.service';

async function bootstrap() {
  const config = getAppConfig();
  initSentry({ dsn: process.env.SENTRY_DSN, environment: config.nodeEnv });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const allowed = (process.env.CORS_ALLOW_ORIGIN ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  app.enableCors({
    origin: allowed.length > 0 ? allowed : true,
    credentials: true,
  });

  // Standard security headers via helmet (X-Content-Type-Options, X-Frame-
  // Options, Referrer-Policy, HSTS, a conservative default CSP, etc.). The
  // API serves JSON only, so the default `default-src 'self'` CSP is a safe
  // no-op for API consumers while still signalling a locked-down policy.
  // The static SPA bundles (admin / H5) are served by nginx and carry their
  // own headers there.
  app.use(helmet());

  // Serve local-disk uploads when running with the default storage adapter.
  // When STORAGE_PROVIDER=oss is wired this becomes a no-op and the OSS
  // public URLs are served by the bucket / CDN directly.
  const uploads = app.get(UploadsService);
  const localInfo = uploads.getLocalStorageInfo();
  if (localInfo) {
    app.useStaticAssets(localInfo.rootPath, { prefix: localInfo.publicBase });
  }

  app.enableShutdownHooks();
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

bootstrap().catch((error) => {
  captureBootstrapError(error);
  // eslint-disable-next-line no-console
  console.error('Bootstrap failed', error);
  process.exit(1);
});
