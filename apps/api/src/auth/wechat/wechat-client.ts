import { request as httpsRequest } from 'node:https';
import { createHash } from 'node:crypto';
import { Injectable, Logger, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';

/**
 * WeChat mini-program login client.
 *
 * Required env (production):
 *   WECHAT_APPID
 *   WECHAT_SECRET
 *
 * If either is unset and NODE_ENV !== 'production' the client falls back to a
 * deterministic mock that derives an openId from the incoming code so dev /
 * e2e flows can exercise the endpoint without hitting the real WeChat API.
 *
 * Production bootstrap throws if env is missing — same defence as the SMS
 * provider so a misconfigured deploy fails fast instead of silently using
 * a mock identity.
 */

export type WechatSession = {
  openId: string;
  unionId?: string;
  sessionKey: string;
};

@Injectable()
export class WechatClient {
  readonly name = 'wechat-mp';
  private readonly logger = new Logger(WechatClient.name);
  private readonly appId = process.env.WECHAT_APPID ?? '';
  private readonly secret = process.env.WECHAT_SECRET ?? '';
  private readonly endpoint = 'api.weixin.qq.com';

  isConfigured() {
    return Boolean(this.appId && this.secret);
  }

  enforceProduction() {
    if (!this.isConfigured() && process.env.NODE_ENV === 'production') {
      throw new Error('WECHAT_APPID and WECHAT_SECRET must be set in production');
    }
  }

  async exchangeCode(code: string): Promise<WechatSession> {
    if (!code || code.length > 256) {
      throw new UnauthorizedException('invalid wechat code');
    }

    if (!this.isConfigured()) {
      // Mock path: derive a stable openId from the code so dev flows are
      // reproducible. Same code always returns the same identity.
      const fingerprint = createHash('sha1').update(`mock:${code}`).digest('hex').slice(0, 28);
      this.logger.warn(`[wechat:mock] code=${code} -> openId=mock_${fingerprint}`);
      return {
        openId: `mock_${fingerprint}`,
        sessionKey: 'mock-session-key',
      };
    }

    const query = new URLSearchParams({
      appid: this.appId,
      secret: this.secret,
      js_code: code,
      grant_type: 'authorization_code',
    });
    const url = `https://${this.endpoint}/sns/jscode2session?${query.toString()}`;

    let response: { openid?: string; unionid?: string; session_key?: string; errcode?: number; errmsg?: string };

    try {
      response = await this.fetch(url);
    } catch (error) {
      this.logger.error(`code2session request failed: ${(error as Error).message}`);
      throw new ServiceUnavailableException('WeChat login is temporarily unavailable');
    }

    if (response.errcode && response.errcode !== 0) {
      this.logger.warn(`code2session rejected code=${code}: ${response.errcode} ${response.errmsg ?? ''}`);
      throw new UnauthorizedException(`wechat login failed: ${response.errcode}`);
    }

    if (!response.openid || !response.session_key) {
      throw new ServiceUnavailableException('WeChat login response missing openid/session_key');
    }

    return {
      openId: response.openid,
      unionId: response.unionid,
      sessionKey: response.session_key,
    };
  }

  private fetch(url: string): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      const req = httpsRequest(url, { method: 'GET', timeout: 5000 }, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          try {
            const body = Buffer.concat(chunks).toString('utf8');
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
        res.on('error', reject);
      });
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy(new Error('wechat code2session request timeout'));
      });
      req.end();
    });
  }
}
