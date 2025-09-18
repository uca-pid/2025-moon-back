import { IEmailService } from 'src/domain/interfaces/email-service.interface';
import { Transporter, createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name, { timestamp: true });
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.getOrThrow<string>('SMTP_HOST');
    const port = this.configService.getOrThrow<number>('SMTP_PORT');
    const user = this.configService.getOrThrow<string>('SMTP_USER');
    const pass = this.configService.getOrThrow<string>('SMTP_PASS');

    this.from = `"Estaller" <${user}>`;

    this.transporter = createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  async sendPasswordRecovery(url: string, to: string): Promise<void> {
    const mailOptions = {
      from: this.from,
      to,
      subject: 'Recuperar tu contraseña',
      html: `
        <h3>Recuperar tu contraseña</h3>
        <p>Clickea en el siguiente link para recuperar tu contraseña:</p>
        <a href="${url}" target="_blank">${url}</a>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password recovery email sent to ${to}`);
    } catch (err: unknown) {
      this.logger.error(
        'Error sending password recovery email:',
        (err && (err as Error)?.message) || err,
      );
      throw err;
    }
  }
}
