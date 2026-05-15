// Sentry init wrapper. The package is loaded lazily so the API can run without
// Sentry installed in dev / test (we only depend on it in production).
//
// To wire Sentry in production:
//   1. corepack pnpm --filter @pingpang/api add @sentry/node
//   2. Set SENTRY_DSN in the runtime env.
//
// initSentry is a no-op when SENTRY_DSN is unset or the package is missing,
// so dev workflows keep working without any extra setup.

type SentryLike = {
  init: (options: Record<string, unknown>) => void;
  captureException: (error: unknown) => void;
  setupExpressErrorHandler?: (app: unknown) => void;
};

let sentryInstance: SentryLike | null = null;

export function initSentry(options: { dsn?: string; environment: string }) {
  if (!options.dsn) {
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const sentry = require('@sentry/node') as SentryLike;
    sentry.init({
      dsn: options.dsn,
      environment: options.environment,
      tracesSampleRate: 0.1,
    });
    sentryInstance = sentry;
  } catch {
    // Package not installed; silently skip. Production deployments must add
    // @sentry/node explicitly.
  }
}

export function captureBootstrapError(error: unknown) {
  if (!sentryInstance) {
    return;
  }
  try {
    sentryInstance.captureException(error);
  } catch {
    // ignore
  }
}

export function getSentry(): SentryLike | null {
  return sentryInstance;
}
