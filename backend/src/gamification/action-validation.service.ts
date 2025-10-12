import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { ACTION_CONFIG, XP_SYSTEM, ACTION_TYPES } from "./constants";
import {
  ActionSubmissionDto,
  ActionCooldownDto,
  WeeklyCapDto,
  ActionTypeDto,
} from "./dto/gamification.dto";

@Injectable()
export class ActionValidationService {
  private readonly logger = new Logger(ActionValidationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Verifica se o usuário pode submeter uma ação específica
   */
  async canSubmitAction(
    userId: number,
    action: string
  ): Promise<{
    canSubmit: boolean;
    reasons: string[];
    cooldownInfo?: ActionCooldownDto;
    capInfo?: WeeklyCapDto;
  }> {
    const reasons: string[] = [];
    let cooldownInfo: ActionCooldownDto | undefined;
    let capInfo: WeeklyCapDto | undefined;

    // Verificar se a ação existe
    if (!XP_SYSTEM[action]) {
      reasons.push(`Ação '${action}' não é válida`);
      return { canSubmit: false, reasons };
    }

    // Verificar cooldown
    const cooldownCheck = await this.checkCooldown(userId, action);
    if (!cooldownCheck.canSubmit && cooldownCheck.expiresAt) {
      reasons.push(
        `Ação em cooldown. Aguarde ${cooldownCheck.remainingMinutes} minutos`
      );
      cooldownInfo = {
        action,
        expiresAt: cooldownCheck.expiresAt,
        remainingTime: cooldownCheck.remainingMinutes,
      };
    }

    // Verificar cap semanal
    const capCheck = await this.checkWeeklyCap(userId, action);
    if (!capCheck.canSubmit) {
      reasons.push(
        `Limite semanal atingido (${capCheck.count}/${capCheck.maxCount})`
      );
      capInfo = {
        action,
        count: capCheck.count,
        maxCount: capCheck.maxCount,
        weekStart: capCheck.weekStart,
        canSubmit: false,
      };
    }

    return {
      canSubmit: reasons.length === 0,
      reasons,
      cooldownInfo,
      capInfo,
    };
  }

  /**
   * Verifica cooldown de uma ação
   */
  private async checkCooldown(
    userId: number,
    action: string
  ): Promise<{
    canSubmit: boolean;
    expiresAt?: Date;
    remainingMinutes: number;
  }> {
    const cooldownHours = ACTION_CONFIG.COOLDOWNS[action];
    if (!cooldownHours) {
      return { canSubmit: true, remainingMinutes: 0 };
    }

    const cooldown = await this.prisma.actionCooldown.findUnique({
      where: {
        userId_action: { userId, action },
      },
    });

    if (!cooldown) {
      return { canSubmit: true, remainingMinutes: 0 };
    }

    const now = new Date();
    if (now >= cooldown.expiresAt) {
      // Cooldown expirado, remover registro
      await this.prisma.actionCooldown.delete({
        where: { id: cooldown.id },
      });
      return { canSubmit: true, remainingMinutes: 0 };
    }

    const remainingMs = cooldown.expiresAt.getTime() - now.getTime();
    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));

    return {
      canSubmit: false,
      expiresAt: cooldown.expiresAt,
      remainingMinutes,
    };
  }

  /**
   * Verifica cap semanal de uma ação
   */
  private async checkWeeklyCap(
    userId: number,
    action: string
  ): Promise<{
    canSubmit: boolean;
    count: number;
    maxCount: number;
    weekStart: Date;
  }> {
    const weeklyLimit = ACTION_CONFIG.WEEKLY_CAPS[action];
    if (!weeklyLimit) {
      return { canSubmit: true, count: 0, maxCount: 0, weekStart: new Date() };
    }

    const weekStart = this.getWeekStart(new Date());

    let weeklyCap = await this.prisma.weeklyCap.findUnique({
      where: {
        userId_action_weekStart: { userId, action, weekStart },
      },
    });

    if (!weeklyCap) {
      weeklyCap = await this.prisma.weeklyCap.create({
        data: {
          userId,
          action,
          weekStart,
          count: 0,
          maxCount: weeklyLimit,
        },
      });
    }

    return {
      canSubmit: weeklyCap.count < weeklyCap.maxCount,
      count: weeklyCap.count,
      maxCount: weeklyCap.maxCount,
      weekStart,
    };
  }

  /**
   * Aplica cooldown após submissão de ação
   */
  async applyCooldown(userId: number, action: string): Promise<void> {
    const cooldownHours = ACTION_CONFIG.COOLDOWNS[action];
    if (!cooldownHours) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + cooldownHours * 60 * 60 * 1000);

    await this.prisma.actionCooldown.upsert({
      where: {
        userId_action: { userId, action },
      },
      update: {
        lastSubmission: now,
        expiresAt,
      },
      create: {
        userId,
        action,
        lastSubmission: now,
        expiresAt,
      },
    });

    this.logger.debug(
      `Cooldown aplicado para usuário ${userId}, ação ${action}, expira em ${expiresAt}`
    );
  }

  /**
   * Incrementa contador semanal
   */
  async incrementWeeklyCap(userId: number, action: string): Promise<void> {
    const weeklyLimit = ACTION_CONFIG.WEEKLY_CAPS[action];
    if (!weeklyLimit) return;

    const weekStart = this.getWeekStart(new Date());

    await this.prisma.weeklyCap.upsert({
      where: {
        userId_action_weekStart: { userId, action, weekStart },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        userId,
        action,
        weekStart,
        count: 1,
        maxCount: weeklyLimit,
      },
    });

    this.logger.debug(
      `Cap semanal incrementado para usuário ${userId}, ação ${action}`
    );
  }

  /**
   * Valida rating (deve ser entre 1-5 e >= 4.0 para aprovação)
   */
  validateRating(rating: number): boolean {
    return rating >= 1 && rating <= 5 && rating >= ACTION_CONFIG.MIN_RATING;
  }

  /**
   * Detecta possível spam ou gaming do sistema
   */
  async detectGaming(userId: number): Promise<{
    isGaming: boolean;
    reasons: string[];
    confidence: number; // 0-1
  }> {
    const reasons: string[] = [];
    let confidence = 0;

    // Verificar submissões muito frequentes (mais de 10 por dia)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSubmissions = await this.prisma.actionSubmission.count({
      where: {
        userId,
        createdAt: { gte: oneDayAgo },
      },
    });

    if (recentSubmissions > 10) {
      reasons.push("Muitas submissões em 24h");
      confidence += 0.3;
    }

    // Verificar se está sempre submetendo as mesmas ações
    const last10Submissions = await this.prisma.actionSubmission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { action: true },
    });

    if (last10Submissions.length >= 5) {
      const uniqueActions = new Set(last10Submissions.map((s) => s.action));
      if (uniqueActions.size <= 2) {
        reasons.push("Padrão repetitivo de ações");
        confidence += 0.4;
      }
    }

    // Verificar taxa de rejeição alta
    const totalSubmissions = await this.prisma.actionSubmission.count({
      where: { userId },
    });

    if (totalSubmissions >= 10) {
      const rejectedSubmissions = await this.prisma.actionSubmission.count({
        where: {
          userId,
          status: "REJECTED",
        },
      });

      const rejectionRate = rejectedSubmissions / totalSubmissions;
      if (rejectionRate > 0.5) {
        reasons.push("Alta taxa de rejeição");
        confidence += 0.3;
      }
    }

    return {
      isGaming: confidence > 0.6,
      reasons,
      confidence,
    };
  }

  /**
   * Obtém o início da semana (segunda-feira 00:00)
   */
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajusta para segunda-feira
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  /**
   * Obtém informações de cooldown para um usuário
   */
  async getUserCooldowns(userId: number): Promise<ActionCooldownDto[]> {
    const cooldowns = await this.prisma.actionCooldown.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
    });

    return cooldowns.map((cooldown) => {
      const remainingMs = cooldown.expiresAt.getTime() - Date.now();
      const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));

      return {
        action: cooldown.action,
        expiresAt: cooldown.expiresAt,
        remainingTime: remainingMinutes,
      };
    });
  }

  /**
   * Obtém informações de caps semanais para um usuário
   */
  async getUserWeeklyCaps(userId: number): Promise<WeeklyCapDto[]> {
    const weekStart = this.getWeekStart(new Date());

    const caps = await this.prisma.weeklyCap.findMany({
      where: {
        userId,
        weekStart,
      },
    });

    return caps.map((cap) => ({
      action: cap.action,
      count: cap.count,
      maxCount: cap.maxCount,
      weekStart: cap.weekStart,
      canSubmit: cap.count < cap.maxCount,
    }));
  }

  /**
   * Obtém todos os tipos de ação disponíveis com metadados
   */
  getActionTypes(): ActionTypeDto[] {
    return Object.entries(ACTION_TYPES).map(([key, config]) => ({
      key,
      name: config.name,
      description: config.description,
      baseXP: XP_SYSTEM[key] || 0,
      category: config.category as
        | "collaboration"
        | "mentoring"
        | "team"
        | "process",
      cooldownHours: config.cooldownHours,
      weeklyLimit: config.weeklyLimit,
      requiresEvidence: config.requiresEvidence,
      requiresValidation: config.requiresValidation,
      multiplierEligible: config.multiplierEligible,
    }));
  }
}
