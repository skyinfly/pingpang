import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { UnauthorizedException } from '@nestjs/common';
import type { SessionUser } from '../../auth/dev-auth';
import { getAppConfig } from '../env/app-config';

export type SessionTokenPayload = {
  sub: string;
  phone: string;
  jti: string;
  iat: number;
  exp: number;
};

function toBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function fromBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signPayload(encodedPayload: string, secret: string) {
  return createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

export function issueSessionToken(user: SessionUser) {
  const config = getAppConfig();
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionTokenPayload = {
    sub: user.id,
    phone: user.phone,
    jti: randomBytes(12).toString('base64url'),
    iat: now,
    exp: now + config.authTokenTtlSeconds,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, config.authTokenSecret);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionTokenPayload {
  const [encodedPayload, encodedSignature] = token.split('.');

  if (!encodedPayload || !encodedSignature) {
    throw new UnauthorizedException('invalid token');
  }

  const { authTokenSecret } = getAppConfig();
  const expectedSignature = signPayload(encodedPayload, authTokenSecret);

  if (
    encodedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(Buffer.from(encodedSignature), Buffer.from(expectedSignature))
  ) {
    throw new UnauthorizedException('invalid token');
  }

  let payload: SessionTokenPayload;

  try {
    payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionTokenPayload;
  } catch {
    throw new UnauthorizedException('invalid token');
  }

  const now = Math.floor(Date.now() / 1000);

  if (!payload.sub || !payload.phone || !payload.exp || payload.exp <= now) {
    throw new UnauthorizedException('expired token');
  }

  return payload;
}