import { loadLocalEnvFile } from './load-local-env';

export type AppConfig = {
  nodeEnv: string;
  allowDevLogin: boolean;
  authTokenSecret: string;
  authTokenTtlSeconds: number;
  adminToken: string;
  adminUsername: string;
  adminPassword: string;
};

function readBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  return value === 'true';
}

function readNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getAppConfig(): AppConfig {
  loadLocalEnvFile();

  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const allowDevLogin = readBoolean(process.env.ALLOW_DEV_LOGIN, nodeEnv !== 'production');
  const authTokenSecret =
    process.env.AUTH_TOKEN_SECRET || (nodeEnv === 'production' ? '' : 'pingpang-dev-session-secret');
  const adminToken = process.env.ADMIN_TOKEN || (nodeEnv === 'production' ? '' : 'dev-admin-token');
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

  if (nodeEnv === 'production' && allowDevLogin) {
    throw new Error('ALLOW_DEV_LOGIN must be false in production');
  }

  if (!authTokenSecret) {
    throw new Error('AUTH_TOKEN_SECRET is required in production');
  }

  if (!adminToken) {
    throw new Error('ADMIN_TOKEN is required in production');
  }

  return {
    nodeEnv,
    allowDevLogin,
    authTokenSecret,
    authTokenTtlSeconds: readNumber(process.env.AUTH_TOKEN_TTL_SECONDS, 60 * 60 * 24 * 7),
    adminToken,
    adminUsername,
    adminPassword,
  };
}
