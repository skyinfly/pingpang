import { createHmac, randomUUID } from 'node:crypto';
import { request as httpsRequest } from 'node:https';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import type { SmsProvider } from './sms-provider';

/**
 * Aliyun SMS provider — talks to dysmsapi.aliyuncs.com via the v1 RPC API.
 * Avoids the @alicloud/dysmsapi20170525 SDK so we do not pull a heavy
 * dependency tree just for one HTTP call.
 *
 * Required env:
 *   ALIYUN_SMS_ACCESS_KEY_ID
 *   ALIYUN_SMS_ACCESS_KEY_SECRET
 *   ALIYUN_SMS_SIGN_NAME       (signed sign name on the Aliyun console)
 *   ALIYUN_SMS_TEMPLATE_CODE   (template containing ${code})
 * Optional:
 *   ALIYUN_SMS_REGION (default: cn-hangzhou)
 */
@Injectable()
export class AliyunSmsProvider implements SmsProvider {
  readonly name = 'aliyun';
  private readonly logger = new Logger(AliyunSmsProvider.name);

  private readonly accessKeyId = process.env.ALIYUN_SMS_ACCESS_KEY_ID ?? '';
  private readonly accessKeySecret = process.env.ALIYUN_SMS_ACCESS_KEY_SECRET ?? '';
  private readonly signName = process.env.ALIYUN_SMS_SIGN_NAME ?? '';
  private readonly templateCode = process.env.ALIYUN_SMS_TEMPLATE_CODE ?? '';
  private readonly region = process.env.ALIYUN_SMS_REGION ?? 'cn-hangzhou';
  private readonly endpoint = `dysmsapi.aliyuncs.com`;

  isConfigured() {
    return Boolean(this.accessKeyId && this.accessKeySecret && this.signName && this.templateCode);
  }

  async send(phone: string, code: string) {
    if (!this.isConfigured()) {
      throw new ServiceUnavailableException('Aliyun SMS provider is not configured');
    }

    const params: Record<string, string> = {
      AccessKeyId: this.accessKeyId,
      Action: 'SendSms',
      Format: 'JSON',
      PhoneNumbers: phone,
      RegionId: this.region,
      SignName: this.signName,
      SignatureMethod: 'HMAC-SHA1',
      SignatureNonce: randomUUID(),
      SignatureVersion: '1.0',
      TemplateCode: this.templateCode,
      TemplateParam: JSON.stringify({ code }),
      Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
      Version: '2017-05-25',
    };

    const signature = this.signRequest('GET', params);
    const query = this.encodeQuery({ ...params, Signature: signature });
    const url = `https://${this.endpoint}/?${query}`;

    try {
      const response = await this.fetch(url);
      if (response.Code !== 'OK') {
        this.logger.error(`Aliyun SMS rejected: ${response.Code} ${response.Message ?? ''}`);
        return { delivered: false };
      }
      return { delivered: true, messageId: response.BizId };
    } catch (error) {
      this.logger.error(`Aliyun SMS request failed: ${(error as Error).message}`);
      throw new ServiceUnavailableException('SMS provider unreachable');
    }
  }

  private signRequest(method: string, params: Record<string, string>) {
    const canonical = Object.keys(params)
      .sort()
      .map((key) => `${this.percentEncode(key)}=${this.percentEncode(params[key])}`)
      .join('&');
    const stringToSign = `${method}&${this.percentEncode('/')}&${this.percentEncode(canonical)}`;
    return createHmac('sha1', `${this.accessKeySecret}&`).update(stringToSign).digest('base64');
  }

  private encodeQuery(params: Record<string, string>) {
    return Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }

  private percentEncode(value: string) {
    return encodeURIComponent(value)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
  }

  private fetch(url: string): Promise<{ Code: string; Message?: string; BizId?: string }> {
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
        req.destroy(new Error('aliyun sms request timeout'));
      });
      req.end();
    });
  }
}
