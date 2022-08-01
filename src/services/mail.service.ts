import nodemailer from 'nodemailer';

import {
  MAILSERVICE_HOST,
  MAILSERVICE_PORT,
  MAILSERVICE_USER,
  MAILSERVICE_PASSWORD,
  RECOVER_TOKEN_DURATION,
} from '@config';
import { logger } from '@/utils/logger';

class MailService {
  private transport = nodemailer.createTransport({
    host: `${MAILSERVICE_HOST}`,
    port: parseInt(MAILSERVICE_PORT),
    auth: {
      user: MAILSERVICE_USER,
      pass: MAILSERVICE_PASSWORD,
    },
  });

  public async sendRecoverEmail(email: string, resetUrl: string) {
    const enlace = resetUrl;
    const duration = parseInt(RECOVER_TOKEN_DURATION);
    const message = {
      from: 'MyRoute App',
      to: email,
      subject: 'Restore Password',
      html: `
        <h1>Restore Password</h1>
        <p>Click on the <a href='${enlace}'>link to restore the password</a></p>
        <p>Note: This link expires in ${duration} minutes</p>
      `,
    };

    this.transport.sendMail(message, function (error) {
      if (error) {
        logger.error('Email sending error:', error);
      }
    });
  }
}

export default MailService;
