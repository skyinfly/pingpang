import { Injectable, Logger } from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';
import type { EmailProvider } from './email-provider';

/**
 * Generic SMTP provider. Works against anything that speaks plain SMTP —
 * SendGrid, Tencent Cloud SES, Mailgun, an internal Postfix, or a Gmail
 * app password during early testing.
 *
 * Required env (production):
 *   SMTP_HOST           e.g. smtp.qcloudmail.com
 *   SMTP_PORT           465 (TLS) / 587 (STARTTLS)
 *   SMTP_USER
 *   SMTP_PASS
 *   SMTP_FROM           "PingPang <no-reply@pingpang.app>"
 *   SMTP_SECURE         "true" for 465, "false" for 587 (default true)
 */
@Injectable()
export class SmtpEmailProvider implements EmailProvider {
  readonly name = 'smtp';
  private readonly logger = new Logger(SmtpEmailProvider.name);
  private transporter: Transporter | null = null;

  isConfigured() {
    return Boolean(
      process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS &&
        process.env.SMTP_FROM,
    );
  }

  private ensureTransporter(): Transporter {
    if (this.transporter) return this.transporter;
    const port = Number(process.env.SMTP_PORT ?? 465);
    // Default to implicit TLS on 465; explicit override via SMTP_SECURE.
    const secure = (process.env.SMTP_SECURE ?? 'true').toLowerCase() !== 'false';
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });
    return this.transporter;
  }

  async send(email: string, code: string) {
    const from = process.env.SMTP_FROM as string;
    const subject = '【乒乓约球】登录验证码';
    const text = `你的乒乓约球登录验证码是 ${code}，5 分钟内有效。\n\n如果不是你本人操作，可忽略此邮件。`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px;">
        <h2 style="color: #0f1c2e; margin: 0 0 16px;">乒乓约球</h2>
        <p style="color: #4a5670;">你的登录验证码是：</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #ff6a3d; margin: 16px 0;">${code}</p>
        <p style="color: #7a8699; font-size: 14px;">5 分钟内有效。如果不是你本人操作，可忽略此邮件。</p>
      </div>
    `;
    try {
      const info = await this.ensureTransporter().sendMail({ from, to: email, subject, text, html });
      return { delivered: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error(`SMTP send failed for ${email}: ${(error as Error).message}`);
      throw error;
    }
  }
}
