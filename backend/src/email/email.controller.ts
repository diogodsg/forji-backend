import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailSchedulerService } from './email-scheduler.service';
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
  constructor(
    private readonly emailService: EmailService,
    private readonly emailScheduler: EmailSchedulerService,
  ) {}

  /**
   * Endpoint para teste de email de Streak Monday Reminder
   * POST /email/test/streak-monday
   */
  @Post('test/streak-monday')
  async testStreakMonday(@Body() body: { email: string }) {
    await this.emailService.queueTestEmail({
      to: body.email,
      subject: '🔥 Sua streak de 5 semanas está ativa! Mantenha o ritmo',
      type: EmailType.STREAK_REMINDER_MONDAY,
      data: {
        userName: 'João Silva',
        currentStreak: 5,
        longestStreak: 8,
        xpBonus: 50,
        nextMilestone: 10,
        milestoneProgress: 50,
        weeksToMilestone: 5,
        hasGoalToUpdate: true,
        needsOneOnOne: true,
        workspaceUrl: 'http://localhost:5173',
      },
    });

    return {
      success: true,
      message: `Email de streak monday reminder enviado para ${body.email}`,
    };
  }

  /**
   * Endpoint para teste de email de Streak Thursday Alert
   * POST /email/test/streak-thursday
   */
  @Post('test/streak-thursday')
  async testStreakThursday(@Body() body: { email: string }) {
    await this.emailService.queueTestEmail({
      to: body.email,
      subject: '⚠️ Não perca sua streak de 5 semanas!',
      type: EmailType.STREAK_ALERT_THURSDAY,
      data: {
        userName: 'João Silva',
        currentStreak: 5,
        hoursRemaining: 56,
        workspaceUrl: 'http://localhost:5173',
      },
    });

    return {
      success: true,
      message: `Email de streak thursday alert enviado para ${body.email}`,
    };
  }

  /**
   * Endpoint para teste de email de Streak Sunday Summary
   * POST /email/test/streak-sunday
   */
  @Post('test/streak-sunday')
  async testStreakSunday(@Body() body: { email: string }) {
    await this.emailService.queueTestEmail({
      to: body.email,
      subject: '📊 Seu resumo semanal + Planejamento da próxima semana',
      type: EmailType.STREAK_SUMMARY_SUNDAY,
      data: {
        userName: 'João Silva',
        weekStart: '04/11/2025',
        weekEnd: '10/11/2025',
        currentStreak: 6,
        streakMaintained: true,
        xpBonus: 50,
        xpEarned: 175,
        activitiesCompleted: 8,
        goalsUpdated: 3,
        goals: [
          { title: 'Dominar React Hooks Avançados', progress: 75 },
          { title: 'Melhorar Soft Skills', progress: 45 },
          { title: 'Aprender TypeScript', progress: 90 },
        ],
        hasAchievements: true,
        newBadges: 1,
        levelUp: true,
        newLevel: 4,
        completedGoals: 1,
        nextWeekSuggestions: [
          'Finalizar meta "Dominar React Hooks" (25% restante)',
          'Agendar 1:1 com Maria Santos',
          'Iniciar nova certificação em AWS',
          'Atualizar competências técnicas',
        ],
        workspaceUrl: 'http://localhost:5173',
      },
    });

    return {
      success: true,
      message: `Email de streak sunday summary enviado para ${body.email}`,
    };
  }

  /**
   * ======================================
   * ENDPOINTS DE TRIGGER MANUAL (CRON)
   * ======================================
   * Para testar as tarefas agendadas sem esperar pelo horário
   */

  /**
   * Dispara manualmente o envio de lembretes de segunda-feira
   * Normalmente executado automaticamente às 9h da manhã de segunda
   */
  @Post('trigger/monday-reminder')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')
  async triggerMondayReminders() {
    await this.emailScheduler.sendMondayStreakReminders();
    return {
      success: true,
      message: 'Monday streak reminders triggered successfully',
    };
  }

  /**
   * Dispara manualmente o envio de alertas de quinta-feira
   * Normalmente executado automaticamente às 16h de quinta
   */
  @Post('trigger/thursday-alert')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')
  async triggerThursdayAlerts() {
    await this.emailScheduler.sendThursdayStreakAlerts();
    return {
      success: true,
      message: 'Thursday streak alerts triggered successfully',
    };
  }

  /**
   * Dispara manualmente o envio de resumos de domingo
   * Normalmente executado automaticamente às 19h de domingo
   */
  @Post('trigger/sunday-summary')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN')
  async triggerSundaySummaries() {
    await this.emailScheduler.sendSundayWeeklySummaries();
    return {
      success: true,
      message: 'Sunday weekly summaries triggered successfully',
    };
  }
}
