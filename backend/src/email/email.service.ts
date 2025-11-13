import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EmailType } from './interfaces/email.interface';
import { SendEmailDto } from './dto/send-email.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {
    const apiKey = this.configService.get<string>('SENDGRID_TOKEN');
    if (!apiKey) {
      this.logger.warn('SENDGRID_TOKEN not configured - emails will not be sent');
    } else {
      sgMail.setApiKey(apiKey);
      this.logger.log('SendGrid configured successfully');
    }
  }

  /**
   * Lê template HTML da pasta templates e substitui variáveis
   */
  private loadTemplate(templateName: string, data: any): string {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);

    try {
      let html = fs.readFileSync(templatePath, 'utf-8');

      // Substituir variáveis simples {{variable}}
      Object.keys(data).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, data[key] ?? '');
      });

      // Processar condicionais {{#if variable}}...{{/if}}
      html = html.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
        return data[condition] ? content : '';
      });

      // Processar condicionais negados {{#unless variable}}...{{/unless}}
      html = html.replace(
        /{{#unless\s+(\w+)}}([\s\S]*?){{\/unless}}/g,
        (match, condition, content) => {
          return !data[condition] ? content : '';
        },
      );

      // Processar loops {{#each array}}...{{/each}}
      html = html.replace(/{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g, (match, arrayName, content) => {
        const array = data[arrayName];
        if (!Array.isArray(array)) return '';

        return array
          .map((item) => {
            let itemHtml = content;
            Object.keys(item).forEach((key) => {
              const regex = new RegExp(`{{${key}}}`, 'g');
              itemHtml = itemHtml.replace(regex, item[key] ?? '');
            });
            return itemHtml;
          })
          .join('');
      });

      return html;
    } catch (error) {
      this.logger.error(`Error loading template ${templateName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Adiciona email na fila para envio assíncrono
   */
  async queueEmail(emailDto: SendEmailDto, priority: number = 5): Promise<void> {
    try {
      // Verificar se usuário tem notificações habilitadas
      const user = await this.prisma.user.findUnique({
        where: { email: emailDto.to },
        include: { notificationPreference: true },
      });

      if (!user) {
        this.logger.warn(`User not found for email: ${emailDto.to}`);
        return;
      }

      // Verificar se usuário desabilitou esta categoria
      if (!this.shouldSendEmail(user.notificationPreference, emailDto.type)) {
        this.logger.log(
          `Email skipped due to user preferences: ${emailDto.type} to ${emailDto.to}`,
        );
        return;
      }

      // Adicionar na fila
      await this.emailQueue.add('send-email', emailDto, {
        priority,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      });

      // Log do email na database
      await this.prisma.emailLog.create({
        data: {
          userId: user.id,
          to: emailDto.to,
          subject: emailDto.subject,
          template: emailDto.type,
          status: 'QUEUED',
        },
      });

      this.logger.log(`Email queued: ${emailDto.type} to ${emailDto.to}`);
    } catch (error) {
      this.logger.error(`Failed to queue email: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Adiciona email na fila para testes (sem verificação de usuário)
   * Use apenas em desenvolvimento!
   */
  async queueTestEmail(emailDto: SendEmailDto, priority: number = 5): Promise<void> {
    try {
      const apiKey = this.configService.get<string>('SENDGRID_TOKEN');
      if (!apiKey) {
        this.logger.warn('SENDGRID_TOKEN not configured - email not sent');
        throw new Error('SendGrid not configured. Please set SENDGRID_TOKEN in .env');
      }

      // Adicionar na fila
      await this.emailQueue.add('send-email', emailDto, {
        priority,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      });

      this.logger.log(`Test email queued: ${emailDto.type} to ${emailDto.to}`);
    } catch (error) {
      this.logger.error(`Failed to queue test email: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Envia email diretamente via SendGrid
   */
  async sendEmail(emailDto: SendEmailDto): Promise<void> {
    const apiKey = this.configService.get<string>('SENDGRID_TOKEN');
    if (!apiKey) {
      this.logger.warn('SENDGRID_TOKEN not configured - email not sent');
      return;
    }

    const fromEmail =
      this.configService.get<string>('SENDGRID_FROM_EMAIL') || 'noreply@forji.com.br';
    const fromName = this.configService.get<string>('SENDGRID_FROM_NAME') || 'Forji';

    try {
      const html = await this.getEmailTemplate(emailDto.type, emailDto.data);
      if (!html) {
        this.logger.warn(`No email template found for type: ${emailDto.type}`);
        return;
      }

      const msg = {
        to: emailDto.to,
        from: {
          email: fromEmail,
          name: fromName,
        },
        subject: emailDto.subject,
        html,
      };
      const res = await sgMail.send(msg);

      // Log detalhado da resposta do SendGrid
      this.logger.log(
        `SendGrid response for ${emailDto.to}:`,
        JSON.stringify(
          {
            statusCode: res[0]?.statusCode,
            messageId: res[0]?.headers?.['x-message-id'],
            body: res[0]?.body,
          },
          null,
          2,
        ),
      );

      // Atualizar log do email
      await this.prisma.emailLog.updateMany({
        where: {
          to: emailDto.to,
          subject: emailDto.subject,
          status: 'QUEUED',
        },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      this.logger.log(`Email sent successfully: ${emailDto.type} to ${emailDto.to}`);
    } catch (error) {
      // Log detalhado do erro do SendGrid
      const sendgridError = error.response?.body?.errors || error.response?.body;
      this.logger.error(
        `SendGrid error for ${emailDto.to}:`,
        JSON.stringify(
          {
            message: error.message,
            statusCode: error.code,
            sendgridErrors: sendgridError,
            fullError: error.response?.body,
          },
          null,
          2,
        ),
      );

      // Atualizar log com erro detalhado
      await this.prisma.emailLog.updateMany({
        where: {
          to: emailDto.to,
          subject: emailDto.subject,
          status: 'QUEUED',
        },
        data: {
          status: 'FAILED',
          error: JSON.stringify({
            message: error.message,
            code: error.code,
            sendgridError: sendgridError,
          }),
        },
      });

      throw error;
    }
  }

  /**
   * Verifica se deve enviar email baseado nas preferências do usuário
   */
  private shouldSendEmail(preferences: any, emailType: EmailType): boolean {
    if (!preferences) return true;

    const categoryMap = {
      [EmailType.STREAK_REMINDER_MONDAY]: 'pdi',
      [EmailType.STREAK_ALERT_THURSDAY]: 'pdi',
      [EmailType.STREAK_SUMMARY_SUNDAY]: 'weeklyReport',
    };

    const category = categoryMap[emailType];
    return category ? preferences[category] : true;
  }

  /**
   * Retorna o template HTML do email
   */
  private async getEmailTemplate(type: EmailType, data: any): Promise<string | null> {
    switch (type) {
      case EmailType.STREAK_REMINDER_MONDAY:
        return this.getStreakMondayReminderTemplate(data);
      case EmailType.STREAK_ALERT_THURSDAY:
        return this.getStreakThursdayAlertTemplate(data);
      case EmailType.STREAK_SUMMARY_SUNDAY:
        return this.getStreakSundaySummaryTemplate(data);
      default:
        return null;
    }
  }

  /**
   * Template padrão (fallback)
   */
  /**
   * Template: Streak Reminder Monday
   */
  private getStreakMondayReminderTemplate(data: any): string {
    const progressPercentage = data.nextMilestone
      ? Math.min(100, (data.currentStreak / data.nextMilestone) * 100)
      : 0;

    return this.loadTemplate('streak-monday-reminder', {
      ...data,
      progressPercentage: progressPercentage.toFixed(0),
    });
  }

  /**
   * Template: Streak Alert Thursday
   */
  private getStreakThursdayAlertTemplate(data: any): string {
    return this.loadTemplate('streak-thursday-alert', data);
  }

  /**
   * Template: Streak Summary Sunday
   */
  private getStreakSundaySummaryTemplate(data: any): string {
    return this.loadTemplate('streak-sunday-summary', data);
  }

  private getDefaultTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Forji</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Forji</h1>
            </div>
            <div class="content">
              <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
            <div class="footer">
              <p>Forji - Plataforma Gamificada para Desenvolvimento de Times</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
