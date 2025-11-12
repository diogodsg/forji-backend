import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EmailType } from './interfaces/email.interface';

/**
 * Controller para testes e gestão de emails
 * Apenas administradores podem acessar estes endpoints
 */
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Endpoint para teste de email de Badge Conquistado
   * POST /email/test/badge-earned
   */
  @Post('test/badge-earned')
  async testBadgeEarned(@Body() body: { email: string }) {
    await this.emailService.queueTestEmail({
      to: body.email,
      subject: '🎉 Parabéns! Você conquistou um novo badge!',
      type: EmailType.BADGE_EARNED,
      data: {
        userName: 'João Silva',
        badgeName: 'First Steps',
        badgeDescription: 'Complete sua primeira meta de desenvolvimento',
        badgeIcon: '🏆',
        totalBadges: 5,
        workspaceUrl: 'http://localhost:5173',
      },
    });

    return {
      success: true,
      message: `Email de badge conquistado enviado para ${body.email}`,
    };
  }

  /**
   * Endpoint para teste de email de Level Up
   * POST /email/test/level-up
   */
  @Post('test/level-up')
  async testLevelUp(@Body() body: { email: string }) {
    await this.emailService.queueTestEmail({
      to: body.email,
      subject: '⭐ Level Up! Você subiu de nível!',
      type: EmailType.LEVEL_UP,
      data: {
        userName: 'João Silva',
        oldLevel: 2,
        newLevel: 3,
        totalXP: 900,
        workspaceUrl: 'http://localhost:5173',
      },
    });

    return {
      success: true,
      message: `Email de level up enviado para ${body.email}`,
    };
  }

  /**
   * Endpoint para teste de email de Lembrete de Meta
   * POST /email/test/goal-reminder
   */
  @Post('test/goal-reminder')
  async testGoalReminder(@Body() body: { email: string }) {
    await this.emailService.queueTestEmail({
      to: body.email,
      subject: '⏰ Lembrete: Meta próxima do prazo final',
      type: EmailType.GOAL_REMINDER,
      data: {
        userName: 'João Silva',
        goalTitle: 'Dominar React Hooks Avançados',
        dueDate: '15/11/2025',
        daysRemaining: 7,
        currentProgress: 65,
        workspaceUrl: 'http://localhost:5173',
      },
    });

    return {
      success: true,
      message: `Email de lembrete de meta enviado para ${body.email}`,
    };
  }

  /**
   * Endpoint para teste de email de Boas-vindas
   * POST /email/test/welcome
   */
  @Post('test/welcome')
  async testWelcome(@Body() body: { email: string }) {
    await this.emailService.queueTestEmail({
      to: body.email,
      subject: '🚀 Bem-vindo ao Forji!',
      type: EmailType.WELCOME,
      data: {
        userName: 'João Silva',
        workspaceName: 'Tech Corp',
        managerName: 'Maria Santos',
        workspaceUrl: 'http://localhost:5173',
      },
    });

    return {
      success: true,
      message: `Email de boas-vindas enviado para ${body.email}`,
    };
  }

  /**
   * Endpoint para teste de email de Convite para Workspace
   * POST /email/test/workspace-invite
   */
  @Post('test/workspace-invite')
  async testWorkspaceInvite(@Body() body: { email: string }) {
    await this.emailService.queueTestEmail({
      to: body.email,
      subject: '✉️ Você foi convidado para Tech Corp',
      type: EmailType.WORKSPACE_INVITE,
      data: {
        invitedByName: 'Maria Santos',
        workspaceName: 'Tech Corp',
        inviteUrl: 'http://localhost:5173/invite/abc123',
        expiresIn: '7 dias',
      },
    });

    return {
      success: true,
      message: `Email de convite para workspace enviado para ${body.email}`,
    };
  }

  /**
   * Endpoint para teste de email de 1:1 Agendado
   * POST /email/test/one-on-one
   */
  @Post('test/one-on-one')
  async testOneOnOne(@Body() body: { email: string }) {
    await this.emailService.queueTestEmail({
      to: body.email,
      subject: '📅 1:1 Agendado',
      type: EmailType.ONE_ON_ONE_SCHEDULED,
      data: {
        participantName: 'João Silva',
        managerName: 'Maria Santos',
        scheduledDate: '15/11/2025',
        scheduledTime: '14:00',
        workspaceUrl: 'http://localhost:5173',
      },
    });

    return {
      success: true,
      message: `Email de 1:1 agendado enviado para ${body.email}`,
    };
  }

  /**
   * Endpoint para teste de email de Relatório Semanal
   * POST /email/test/weekly-report
   */
  @Post('test/weekly-report')
  async testWeeklyReport(@Body() body: { email: string }) {
    await this.emailService.queueTestEmail({
      to: body.email,
      subject: '📊 Relatório Semanal - Tech Corp',
      type: EmailType.WEEKLY_REPORT,
      data: {
        userName: 'João Silva',
        teamName: 'Tech Corp',
        weekXP: 450,
        activitiesCompleted: 12,
        goalsCompleted: 3,
        topContributors: [
          { name: 'Ana Costa', xp: 250 },
          { name: 'Pedro Lima', xp: 180 },
          { name: 'João Silva', xp: 150 },
        ],
        teamRank: 2,
        workspaceUrl: 'http://localhost:5173',
      },
    });

    return {
      success: true,
      message: `Email de relatório semanal enviado para ${body.email}`,
    };
  }

  /**
   * Endpoint para testar todos os templates de uma vez
   * POST /email/test/all
   */
  @Post('test/all')
  async testAllEmails(@Body() body: { email: string }) {
    const results = [];

    // Badge Earned
    await this.testBadgeEarned(body);
    results.push('Badge Conquistado');

    // Level Up
    await this.testLevelUp(body);
    results.push('Level Up');

    // Goal Reminder
    await this.testGoalReminder(body);
    results.push('Lembrete de Meta');

    // Welcome
    await this.testWelcome(body);
    results.push('Boas-vindas');

    // Workspace Invite
    await this.testWorkspaceInvite(body);
    results.push('Convite para Workspace');

    // One on One
    await this.testOneOnOne(body);
    results.push('1:1 Agendado');

    // Weekly Report
    await this.testWeeklyReport(body);
    results.push('Relatório Semanal');

    return {
      success: true,
      message: `Todos os ${results.length} templates de email foram enviados para ${body.email}`,
      templates: results,
    };
  }
}
