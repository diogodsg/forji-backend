import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { EmailType } from './interfaces/email.interface';

@Injectable()
export class EmailSchedulerService {
  private readonly logger = new Logger(EmailSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * MONDAY 09:00 - Lembrete positivo para usuários com streak ativa
   * Cron: "0 9 * * 1" = Segundas-feiras às 9h (America/Sao_Paulo)
   */
  @Cron('0 9 * * 1', {
    name: 'monday-streak-reminder',
    timeZone: 'America/Sao_Paulo',
  })
  async sendMondayStreakReminders() {
    this.logger.log('🔥 Starting Monday Streak Reminder emails...');

    try {
      const weekStart = this.getWeekStart(new Date());
      const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

      // Query SQL: usuários com atividade no último ano MAS não esta semana
      const usersWithPastActivity = await this.prisma.$queryRaw<
        Array<{
          id: string;
          email: string;
          name: string;
          workspaceId: string;
        }>
      >`
        SELECT DISTINCT
          u.id,
          u.email,
          u.name,
          wm.workspace_id as "workspaceId"
        FROM users u
        INNER JOIN workspace_members wm ON wm.user_id = u.id AND wm.deleted_at IS NULL
        INNER JOIN activities a ON a.user_id = u.id AND a.created_at >= ${oneYearAgo}
        WHERE NOT EXISTS (
          SELECT 1 FROM activities a2
          WHERE a2.user_id = u.id
          AND a2.created_at >= ${weekStart}
        )
        LIMIT 1000
      `;

      let emailsSent = 0;
      console.log(usersWithPastActivity);
      for (const user of usersWithPastActivity) {
        if (user.email != 'diogo.gouveia@driva.com.br') continue;
        const streakData = await this.calculateUserStreak(user.id, user.workspaceId);

        // Enviar lembrete motivacional para retomar as atividades
        const milestones = [3, 5, 10, 20, 50];
        const nextMilestone = milestones.find((m) => m > streakData.longestStreak) || null;
        const xpBonus = this.calculateStreakXPBonus(streakData.longestStreak);

        await this.emailService.queueEmail(
          {
            to: user.email,
            subject: `Comece a semana registrando suas atividades! 🔥`,
            type: EmailType.STREAK_REMINDER_MONDAY,
            data: {
              userName: user.name,
              currentStreak: 0, // Streak quebrou
              longestStreak: streakData.longestStreak,
              xpBonus,
              nextMilestone,
              progressPercentage: nextMilestone
                ? Math.round((streakData.longestStreak / (nextMilestone as number)) * 100)
                : 100,
              workspaceUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
            },
          },
          7,
        );

        emailsSent++;
      }

      this.logger.log(`✅ Monday Streak Reminder: ${emailsSent} emails queued`);
    } catch (error) {
      this.logger.error(`❌ Failed to send Monday reminders: ${error.message}`, error.stack);
    }
  }

  /**
   * THURSDAY 16:00 - Alerta de urgência para usuários sem atividade esta semana
   * Cron: "0 16 * * 4" = Quintas-feiras às 16h (America/Sao_Paulo)
   */
  // @Cron('0 16 * * 4', {
  //   name: 'thursday-streak-alert',
  //   timeZone: 'America/Sao_Paulo',
  // })
  async sendThursdayStreakAlerts() {
    this.logger.log('⚠️  Starting Thursday Streak Alert emails...');

    try {
      const weekStart = this.getWeekStart(new Date());
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      // Query SQL: usuários com notificações PDI, atividade nas últimas 2 semanas MAS não esta semana
      const users = await this.prisma.$queryRaw<
        Array<{
          id: string;
          email: string;
          name: string;
          workspaceId: string;
        }>
      >`
        SELECT DISTINCT
          u.id,
          u.email,
          u.name
        FROM users u
        INNER JOIN workspace_members wm ON wm.user_id = u.id AND wm.deleted_at IS NULL
        INNER JOIN activities a ON a.user_id = u.id AND a.created_at >= ${twoWeeksAgo}
        WHERE NOT EXISTS (
          SELECT 1 FROM activities a2
          WHERE a2.user_id = u.id
          AND a2.created_at >= ${weekStart}
        )
        LIMIT 1000
      `;

      let emailsSent = 0;
      for (const user of users) {
        this.logger.log(`Processing user: ${user.email}`);
        const streakData = await this.calculateUserStreak(user.id, user.workspaceId);
        this.logger.debug(`Streak data for user ${user.email}: ${JSON.stringify(streakData)}`);
        if (streakData.currentStreak >= 1) {
          // Calcular horas até domingo 23:59
          const now = new Date();
          const sundayEnd = new Date(now);
          sundayEnd.setDate(now.getDate() + (7 - now.getDay()));
          sundayEnd.setHours(23, 59, 59, 999);
          const hoursRemaining = Math.round(
            (sundayEnd.getTime() - now.getTime()) / (1000 * 60 * 60),
          );

          await this.emailService.queueEmail(
            {
              to: user.email,
              subject: `⚠️ Não perca sua streak de ${streakData.currentStreak} semanas!`,
              type: EmailType.STREAK_ALERT_THURSDAY,
              data: {
                userName: user.name,
                currentStreak: streakData.currentStreak,
                hoursRemaining,
                workspaceUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
              },
            },
            9,
          );

          emailsSent++;
        }
      }

      this.logger.log(`✅ Thursday Streak Alert: ${emailsSent} emails queued`);
    } catch (error) {
      this.logger.error(`❌ Failed to send Thursday alerts: ${error.message}`, error.stack);
    }
  }

  /**
   * SUNDAY 19:00 - Resumo semanal para todos os usuários
   * Cron: "0 19 * * 0" = Domingos às 19h (America/Sao_Paulo)
   */
  // @Cron('0 19 * * 0', {
  //   name: 'sunday-weekly-summary',
  //   timeZone: 'America/Sao_Paulo',
  // })
  async sendSundayWeeklySummaries() {
    this.logger.log('📊 Starting Sunday Weekly Summary emails...');

    try {
      const weekStart = this.getWeekStart(new Date());

      // Query SQL: usuários com notificações de relatório semanal
      const users = await this.prisma.$queryRaw<
        Array<{
          id: string;
          email: string;
          name: string;
          workspaceId: string;
        }>
      >`
        SELECT DISTINCT
          u.id,
          u.email,
          u.name,
          wm.workspace_id as "workspaceId"
        FROM users u
        INNER JOIN notification_preferences np ON np.user_id = u.id AND np.weekly_report = true
        INNER JOIN workspace_members wm ON wm.user_id = u.id AND wm.deleted_at IS NULL
        LIMIT 1000
      `;

      let emailsSent = 0;

      for (const user of users) {
        const streakData = await this.calculateUserStreak(user.id, user.workspaceId);

        // Buscar atividades da semana
        const weekActivities = await this.prisma.activity.findMany({
          where: {
            userId: user.id,
            createdAt: {
              gte: weekStart,
            },
          },
          select: {
            xpEarned: true,
          },
        });

        // XP ganho na semana
        const weekXP = weekActivities.reduce((sum: number, activity) => {
          return sum + (activity.xpEarned || 0);
        }, 0);

        // Buscar metas ativas
        const goals = await this.prisma.goal.findMany({
          where: {
            userId: user.id,
            cycle: {
              workspaceId: user.workspaceId,
              endDate: {
                gte: new Date(),
              },
            },
          },
          select: {
            title: true,
            currentValue: true,
            targetValue: true,
          },
        });

        // Top 3 metas com mais progresso
        const topGoals = goals
          .map((goal: any) => ({
            title: goal.title,
            progress: this.calculateGoalProgress(goal),
          }))
          .sort((a: { progress: number }, b: { progress: number }) => b.progress - a.progress)
          .slice(0, 3);

        const streakMaintained = weekActivities.length > 0;

        await this.emailService.queueEmail(
          {
            to: user.email,
            subject: 'Seu resumo semanal no Forji 📊',
            type: EmailType.STREAK_SUMMARY_SUNDAY,
            data: {
              userName: user.name,
              weekStart: weekStart.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
              }),
              weekEnd: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
              currentStreak: streakData.currentStreak,
              streakMaintained,
              xpEarned: weekXP,
              xpBonus: streakMaintained ? this.calculateStreakXPBonus(streakData.currentStreak) : 0,
              activitiesCompleted: weekActivities.length,
              goalsUpdated: topGoals.length,
              goals: topGoals,
              workspaceUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
            },
          },
          5,
        );

        emailsSent++;
      }

      this.logger.log(`✅ Sunday Weekly Summary: ${emailsSent} emails queued`);
    } catch (error) {
      this.logger.error(`❌ Failed to send Sunday summaries: ${error.message}`, error.stack);
    }
  }

  /**
   * Calcula o streak atual do usuário baseado nas atividades semanais
   */
  async calculateUserStreak(userId: string, workspaceId: string) {
    // Query SQL para buscar semanas com atividades
    const weeklyActivities = await this.prisma.$queryRaw<Array<{ week_num: number; year: number }>>`
      SELECT DISTINCT
        EXTRACT(WEEK FROM a.created_at)::int as week_num,
        EXTRACT(YEAR FROM a.created_at)::int as year
      FROM activities a
      INNER JOIN cycles c ON c.id = a.cycle_id AND c.workspace_id::text = ${workspaceId}
      WHERE a.user_id::text = ${userId}
      ORDER BY year DESC, week_num DESC
    `;

    if (weeklyActivities.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Converter para Set de chaves "year-week"
    const weekSet = new Set(weeklyActivities.map((w) => `${w.year}-${w.week_num}`));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Obter semana atual
    const today = new Date();
    const currentWeekNum = this.getWeekNumber(today);
    const currentYear = today.getFullYear();

    // Começar verificando da semana atual para trás
    // Se tem atividade esta semana, conta. Se não, começa da semana passada
    let checkDate = new Date(today);
    let foundGap = false;
    let startedCounting = false;

    for (let i = 0; i < 52; i++) {
      const year = checkDate.getFullYear();
      const weekNum = this.getWeekNumber(checkDate);
      const weekKey = `${year}-${weekNum}`;
      const isCurrentWeek = year === currentYear && weekNum === currentWeekNum;

      // Pular semana atual (não conta para streak)
      if (isCurrentWeek) {
        checkDate.setDate(checkDate.getDate() - 7);
        continue;
      }

      if (weekSet.has(weekKey)) {
        startedCounting = true;
        if (!foundGap) currentStreak++;
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (startedCounting) {
          foundGap = true;
        }
        tempStreak = 0;
      }

      checkDate.setDate(checkDate.getDate() - 7);
    }

    console.log({ currentStreak, longestStreak });
    return { currentStreak, longestStreak };
  }

  /**
   * Calcula o número da semana no ano (1-53)
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  /**
   * Retorna o início da semana (segunda-feira 00:00)
   */
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(d.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  }

  /**
   * Retorna chave única da semana (YYYY-WW)
   */
  private getWeekKey(date: Date): string {
    const weekStart = this.getWeekStart(date);
    const weekNumber = Math.ceil(
      (weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) /
        (7 * 24 * 60 * 60 * 1000),
    );
    return `${weekStart.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
  }

  /**
   * Calcula XP bônus baseado no streak
   */
  private calculateStreakXPBonus(streak: number): number {
    if (streak >= 50) return 500;
    if (streak >= 20) return 200;
    if (streak >= 10) return 100;
    if (streak >= 5) return 50;
    if (streak >= 3) return 25;
    return 0;
  }

  /**
   * Calcula progresso de uma meta (0-100%)
   */
  private calculateGoalProgress(goal: any): number {
    // Goals no schema não têm keyResults, têm valores diretos
    if (!goal.targetValue || goal.targetValue === 0) return 0;

    const progress = ((goal.currentValue || 0) / goal.targetValue) * 100;
    return Math.round(Math.min(progress, 100));
  }
}
