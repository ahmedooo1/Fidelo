import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter() {
    if (!process.env.SMTP_HOST) return null;
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    return this.transporter;
  }

  async sendLoyaltyCard(params: {
    to: string;
    memberName: string;
    businessName: string;
    programName: string;
    rewardDescription: string;
    cardUrl: string;
  }) {
    const transporter = this.getTransporter();
    if (!transporter) {
      throw new ServiceUnavailableException(
        "L'envoi d'email n'est pas configure sur ce serveur.",
      );
    }

    const greetingName = params.memberName ? params.memberName : 'Bonjour';
    const html = `
      <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #122325;">
        <p style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #C9A227; margin: 0 0 12px;">${params.businessName}</p>
        <h1 style="font-size: 22px; margin: 0 0 16px;">${greetingName}, voici votre carte de fidelite</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #444; margin: 0 0 24px;">
          Programme <strong>${params.programName}</strong> &mdash; ${params.rewardDescription}.
          Gardez ce lien, il vous permet de suivre vos tampons a tout moment.
        </p>
        <a href="${params.cardUrl}" style="display: inline-block; background: #C9A227; color: #122325; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 999px; font-size: 14px;">
          Voir ma carte
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #999; word-break: break-all;">${params.cardUrl}</p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: params.to,
        subject: `Votre carte de fidelite ${params.businessName}`,
        html,
      });
    } catch (err) {
      this.logger.error(`Failed to send loyalty card email to ${params.to}`, err as Error);
      throw new ServiceUnavailableException("L'envoi de l'email a echoue.");
    }
  }
}
