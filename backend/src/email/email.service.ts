import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EmailType } from './interfaces/email.interface';
import { SendEmailDto } from './dto/send-email.dto';
import { PrismaService } from '../prisma/prisma.service';

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
    if (!preferences) return true; // Default: enviar

    const categoryMap = {
      [EmailType.WORKSPACE_INVITE]: 'onboarding',
      [EmailType.WELCOME]: 'onboarding',
      [EmailType.BADGE_EARNED]: 'gamification',
      [EmailType.LEVEL_UP]: 'gamification',
      [EmailType.GOAL_REMINDER]: 'pdi',
      [EmailType.GOAL_ASSIGNED]: 'pdi',
      [EmailType.ONE_ON_ONE_SCHEDULED]: 'management',
      [EmailType.ONE_ON_ONE_FEEDBACK]: 'management',
      [EmailType.WEEKLY_REPORT]: 'weeklyReport',
      [EmailType.MONTHLY_REPORT]: 'weeklyReport',
      [EmailType.SUBORDINATE_NEEDS_ATTENTION]: 'management',
      [EmailType.CYCLE_ENDING_SOON]: 'pdi',
    };

    const category = categoryMap[emailType];
    return category ? preferences[category] : true;
  }

  /**
   * Retorna o template HTML do email
   */
  private async getEmailTemplate(type: EmailType, data: any): Promise<string> {
    switch (type) {
      case EmailType.BADGE_EARNED:
        return this.getBadgeEarnedTemplate(data);
      case EmailType.LEVEL_UP:
        return this.getLevelUpTemplate(data);
      case EmailType.GOAL_REMINDER:
        return this.getGoalReminderTemplate(data);
      case EmailType.WELCOME:
        return this.getWelcomeTemplate(data);
      case EmailType.WORKSPACE_INVITE:
        return this.getWorkspaceInviteTemplate(data);
      case EmailType.ONE_ON_ONE_SCHEDULED:
        return this.getOneOnOneScheduledTemplate(data);
      case EmailType.WEEKLY_REPORT:
        return this.getWeeklyReportTemplate(data);
      default:
        return this.getDefaultTemplate(data);
    }
  }

  /**
   * Template: Badge Conquistado
   */
  private getBadgeEarnedTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Badge Conquistado!</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .badge-icon { font-size: 80px; margin: 20px 0; }
            .content { padding: 40px 30px; }
            .badge-name { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
            .badge-description { color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
            .stats { background: #f9fafb; border-radius: 12px; padding: 20px; margin: 30px 0; }
            .stat { display: flex; justify-content: space-between; margin: 10px 0; }
            .stat-label { color: #6b7280; }
            .stat-value { font-weight: bold; color: #7c3aed; }
            .cta { text-align: center; margin: 30px 0; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Parabéns, ${data.userName}!</h1>
              <div class="badge-icon">${data.badgeIcon}</div>
            </div>
            <div class="content">
              <div class="badge-name">Badge "${data.badgeName}" conquistado!</div>
              <div class="badge-description">${data.badgeDescription}</div>
              
              <div class="stats">
                <div class="stat">
                  <span class="stat-label">Total de Badges</span>
                  <span class="stat-value">${data.totalBadges}</span>
                </div>
              </div>

              <div class="cta">
                <a href="${data.workspaceUrl}" class="button">Ver Perfil Completo</a>
              </div>

              <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                Continue assim! Cada conquista te aproxima do próximo nível.
              </p>
            </div>
            <div class="footer">
              <p>Forji - Plataforma Gamificada para Desenvolvimento de Times</p>
              <p><a href="${data.workspaceUrl}/settings/notifications" style="color: #7c3aed;">Gerenciar preferências de email</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Template: Level Up
   */
  private getLevelUpTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Level Up!</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .level-display { font-size: 72px; color: white; font-weight: bold; margin: 20px 0; }
            .content { padding: 40px 30px; text-align: center; }
            .message { font-size: 18px; color: #1f2937; margin: 20px 0; }
            .xp-display { background: #f9fafb; border-radius: 12px; padding: 30px; margin: 30px 0; }
            .xp-value { font-size: 48px; font-weight: bold; color: #7c3aed; }
            .xp-label { color: #6b7280; margin-top: 10px; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⭐ Level Up!</h1>
              <div class="level-display">Nível ${data.newLevel}</div>
            </div>
            <div class="content">
              <div class="message">
                Parabéns, ${data.userName}! Você subiu do nível ${data.oldLevel} para o nível ${data.newLevel}!
              </div>
              
              <div class="xp-display">
                <div class="xp-value">${data.totalXP} XP</div>
                <div class="xp-label">Total de Experiência</div>
              </div>

              <p style="color: #6b7280;">
                Seu esforço e dedicação estão sendo recompensados. Continue evoluindo!
              </p>

              <a href="${data.workspaceUrl}" class="button">Ver Meu Perfil</a>
            </div>
            <div class="footer">
              <p>Forji - Plataforma Gamificada para Desenvolvimento de Times</p>
              <p><a href="${data.workspaceUrl}/settings/notifications" style="color: #7c3aed;">Gerenciar preferências de email</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Template: Lembrete de Meta
   */
  private getGoalReminderTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lembrete de Meta</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .goal-title { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 20px; }
            .urgency { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .urgency-text { color: #92400e; font-weight: 600; }
            .progress-bar { background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; margin: 20px 0; }
            .progress-fill { background: linear-gradient(90deg, #7c3aed 0%, #5b21b6 100%); height: 100%; transition: width 0.3s; }
            .progress-label { text-align: center; color: #6b7280; margin-top: 10px; font-size: 14px; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Lembrete de Meta</h1>
            </div>
            <div class="content">
              <div class="goal-title">${data.goalTitle}</div>
              
              <div class="urgency">
                <div class="urgency-text">⚠️ Faltam apenas ${data.daysRemaining} dias para o prazo!</div>
              </div>

              <div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${data.currentProgress}%"></div>
                </div>
                <div class="progress-label">${data.currentProgress}% concluído</div>
              </div>

              <p style="color: #6b7280; margin: 20px 0;">
                Olá ${data.userName}, sua meta está próxima do prazo final (${data.dueDate}). 
                Que tal dar aquele empurrão final?
              </p>

              <a href="${data.workspaceUrl}" class="button">Atualizar Meta</a>
            </div>
            <div class="footer">
              <p>Forji - Plataforma Gamificada para Desenvolvimento de Times</p>
              <p><a href="${data.workspaceUrl}/settings/notifications" style="color: #7c3aed;">Gerenciar preferências de email</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Template: Boas-vindas
   */
  private getWelcomeTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bem-vindo ao Forji!</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 32px; }
            .logo { font-size: 80px; margin: 20px 0; }
            .content { padding: 40px 30px; }
            .welcome-message { font-size: 18px; color: #1f2937; line-height: 1.8; margin: 20px 0; }
            .features { margin: 30px 0; }
            .feature { display: flex; margin: 20px 0; align-items: flex-start; }
            .feature-icon { font-size: 32px; margin-right: 15px; }
            .feature-text { flex: 1; }
            .feature-title { font-weight: bold; color: #1f2937; margin-bottom: 5px; }
            .feature-desc { color: #6b7280; font-size: 14px; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🚀</div>
              <h1>Bem-vindo ao Forji!</h1>
            </div>
            <div class="content">
              <div class="welcome-message">
                Olá ${data.userName}, seja muito bem-vindo ao <strong>${data.workspaceName}</strong>!
                ${data.managerName ? `Seu gestor <strong>${data.managerName}</strong> te adicionou à equipe.` : ''}
              </div>

              <p style="color: #6b7280;">
                O Forji é uma plataforma gamificada que transforma desenvolvimento profissional em uma experiência engajante e colaborativa.
              </p>

              <div class="features">
                <div class="feature">
                  <div class="feature-icon">🎯</div>
                  <div class="feature-text">
                    <div class="feature-title">PDI Interativo</div>
                    <div class="feature-desc">Crie e acompanhe suas metas de desenvolvimento com Key Results personalizados</div>
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon">🎮</div>
                  <div class="feature-text">
                    <div class="feature-title">Sistema de XP</div>
                    <div class="feature-desc">Ganhe experiência e suba de nível conforme evolui profissionalmente</div>
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon">🏆</div>
                  <div class="feature-text">
                    <div class="feature-title">Badges & Conquistas</div>
                    <div class="feature-desc">Desbloqueie badges especiais ao completar desafios e marcos importantes</div>
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon">👥</div>
                  <div class="feature-text">
                    <div class="feature-title">Team-First</div>
                    <div class="feature-desc">Rankings colaborativos que promovem crescimento coletivo</div>
                  </div>
                </div>
              </div>

              <div style="text-align: center;">
                <a href="${data.workspaceUrl}" class="button">Começar Minha Jornada</a>
              </div>
            </div>
            <div class="footer">
              <p>Forji - Plataforma Gamificada para Desenvolvimento de Times</p>
              <p><a href="${data.workspaceUrl}/settings/notifications" style="color: #7c3aed;">Gerenciar preferências de email</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Template: Convite para Workspace
   */
  private getWorkspaceInviteTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Convite para ${data.workspaceName}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .icon { font-size: 80px; margin: 20px 0; }
            .content { padding: 40px 30px; }
            .invite-message { font-size: 18px; color: #1f2937; line-height: 1.8; margin: 20px 0; text-align: center; }
            .workspace-name { font-weight: bold; color: #7c3aed; font-size: 24px; margin: 20px 0; }
            .button { display: inline-block; background: #10b981; color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; font-size: 16px; }
            .expiry { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">✉️</div>
              <h1>Você foi convidado!</h1>
            </div>
            <div class="content">
              <div class="invite-message">
                <strong>${data.invitedByName}</strong> te convidou para se juntar ao workspace:
              </div>
              
              <div class="workspace-name">${data.workspaceName}</div>

              <p style="color: #6b7280; text-align: center; margin: 30px 0;">
                Clique no botão abaixo para aceitar o convite e começar sua jornada de desenvolvimento gamificada!
              </p>

              <div style="text-align: center;">
                <a href="${data.inviteUrl}" class="button">Aceitar Convite</a>
              </div>

              <div class="expiry">
                ⏰ Este convite expira em ${data.expiresIn}
              </div>
            </div>
            <div class="footer">
              <p>Forji - Plataforma Gamificada para Desenvolvimento de Times</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Template: 1:1 Agendado
   */
  private getOneOnOneScheduledTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>1:1 Agendado</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .meeting-details { background: #f9fafb; border-radius: 12px; padding: 25px; margin: 30px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { color: #6b7280; font-weight: 600; }
            .detail-value { color: #1f2937; font-weight: bold; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 1:1 Agendado</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px; color: #1f2937;">
                Olá! Uma reunião 1:1 foi agendada:
              </p>

              <div class="meeting-details">
                <div class="detail-row">
                  <span class="detail-label">Participantes</span>
                  <span class="detail-value">${data.participantName} & ${data.managerName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Data</span>
                  <span class="detail-value">${data.scheduledDate}</span>
                </div>
                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">Horário</span>
                  <span class="detail-value">${data.scheduledTime}</span>
                </div>
              </div>

              <p style="color: #6b7280;">
                Prepare-se para uma conversa produtiva sobre desenvolvimento, metas e próximos passos!
              </p>

              <div style="text-align: center;">
                <a href="${data.workspaceUrl}" class="button">Ver Detalhes</a>
              </div>
            </div>
            <div class="footer">
              <p>Forji - Plataforma Gamificada para Desenvolvimento de Times</p>
              <p><a href="${data.workspaceUrl}/settings/notifications" style="color: #7c3aed;">Gerenciar preferências de email</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Template: Relatório Semanal
   */
  private getWeeklyReportTemplate(data: any): string {
    const topContributorsHTML = data.topContributors
      .map(
        (contributor: any, index: number) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: ${
          index === 0 ? '#fef3c7' : '#f9fafb'
        }; border-radius: 8px; margin: 10px 0;">
          <div style="display: flex; align-items: center;">
            <span style="font-size: 24px; margin-right: 15px;">${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
            <span style="font-weight: 600; color: #1f2937;">${contributor.name}</span>
          </div>
          <span style="color: #7c3aed; font-weight: bold;">+${contributor.xp} XP</span>
        </div>
      `,
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Relatório Semanal</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 30px 0; }
            .stat-card { background: #f9fafb; border-radius: 12px; padding: 20px; text-align: center; }
            .stat-value { font-size: 32px; font-weight: bold; color: #7c3aed; }
            .stat-label { color: #6b7280; font-size: 14px; margin-top: 5px; }
            .section-title { font-size: 20px; font-weight: bold; color: #1f2937; margin: 30px 0 20px 0; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Relatório Semanal</h1>
              <p style="color: white; opacity: 0.9; margin-top: 10px;">Resumo da semana - ${data.teamName}</p>
            </div>
            <div class="content">
              <p style="font-size: 18px; color: #1f2937;">
                Olá ${data.userName}, confira o desempenho da sua equipe esta semana!
              </p>

              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">${data.weekXP}</div>
                  <div class="stat-label">XP Ganho</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${data.activitiesCompleted}</div>
                  <div class="stat-label">Atividades</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${data.goalsCompleted}</div>
                  <div class="stat-label">Metas</div>
                </div>
              </div>

              <div class="section-title">🏆 Top Contributors</div>
              ${topContributorsHTML}

              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <div style="color: #1e40af; font-weight: 600; margin-bottom: 5px;">Ranking da Equipe</div>
                <div style="color: #1e3a8a; font-size: 24px; font-weight: bold;">#${data.teamRank} no Workspace</div>
              </div>

              <p style="color: #6b7280; text-align: center;">
                Continue assim! Colaboração e crescimento coletivo fazem a diferença.
              </p>

              <div style="text-align: center;">
                <a href="${data.workspaceUrl}" class="button">Ver Dashboard Completo</a>
              </div>
            </div>
            <div class="footer">
              <p>Forji - Plataforma Gamificada para Desenvolvimento de Times</p>
              <p><a href="${data.workspaceUrl}/settings/notifications" style="color: #7c3aed;">Gerenciar preferências de email</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Template padrão (fallback)
   */
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
