import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { MultiplierService } from "./multiplier.service";
import {
  PlayerProfileDto,
  BadgeDto,
  XPGainDto,
  LeaderboardEntryDto,
  AddXPDto,
  WeeklyChallengeDto,
  TeamLeaderboardEntryDto,
  TeamProfileDto,
  TeamMemberDto,
  TeamBadgeDto,
  ActionSubmissionDto,
} from "./dto/gamification.dto";
import {
  XP_SYSTEM,
  calculateLevel,
  getXPForNextLevel,
  getLevelTitle,
  BADGE_DEFINITIONS,
  BadgeId,
  XPAction,
  WEEKLY_XP_CAPS,
  COOLDOWNS,
  VALIDATION_REQUIREMENTS,
  XP_CATEGORIES,
} from "./constants";

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    private prisma: PrismaService,
    private multiplierService: MultiplierService
  ) {}

  // Adicionar XP para um usuário com validações anti-gaming
  async addXP(data: AddXPDto): Promise<XPGainDto> {
    const { userId, action, points: customPoints, description } = data;

    // Validar ação e calcular pontos base
    const basePoints = customPoints ?? XP_SYSTEM[action as XPAction] ?? 0;

    if (basePoints <= 0) {
      this.logger.warn(`Invalid XP action or points: ${action}`);
      return {
        action,
        points: 0,
        category: "development",
        description: "Invalid action",
      };
    }

    // � SPRINT 2: Aplicar multiplicadores baseados no perfil
    const multiplierResult = await this.multiplierService.applyMultipliers(
      userId,
      action,
      basePoints
    );
    const finalPoints = multiplierResult.finalXP;

    // 🛡️ Aplicar validações anti-gaming
    await this.validateAntiGaming(userId, action as XPAction, basePoints);

    const category = this.getCategoryForAction(action);

    try {
      // Buscar perfil atual ou criar se não existir
      let profile = await this.prisma.gamificationProfile.findUnique({
        where: { userId: BigInt(userId) },
      });

      if (!profile) {
        profile = await this.prisma.gamificationProfile.create({
          data: {
            userId: BigInt(userId),
            totalXP: finalPoints,
            weeklyXP: finalPoints,
            lastActivityDate: new Date(),
          },
        });
      } else {
        // Reset weekly XP se mudou de semana
        const needsWeeklyReset = await this.shouldResetWeeklyXP(
          profile.lastActivityDate
        );
        const weeklyXP = needsWeeklyReset
          ? finalPoints
          : profile.weeklyXP + finalPoints;

        profile = await this.prisma.gamificationProfile.update({
          where: { userId: BigInt(userId) },
          data: {
            totalXP: profile.totalXP + finalPoints,
            weeklyXP,
            lastActivityDate: new Date(),
          },
        });
      }

      // Registrar o ganho de XP no histórico
      await this.prisma.xpHistory.create({
        data: {
          userId: BigInt(userId),
          action,
          points: finalPoints,
          category,
          description: description || `Gained ${finalPoints} XP for ${action}`,
        },
      });

      // Verificar se desbloqueou novos badges
      await this.checkAndUnlockBadges(userId);

      this.logger.log(
        `User ${userId} gained ${finalPoints} XP for action: ${action}`
      );

      return {
        action,
        points: finalPoints,
        category,
        description: description || `+${finalPoints} XP`,
      };
    } catch (error) {
      this.logger.error(`Failed to add XP for user ${userId}:`, error);
      throw error;
    }
  }

  // Obter perfil completo do jogador
  async getPlayerProfile(userId: number): Promise<PlayerProfileDto> {
    let profile = await this.prisma.gamificationProfile.findUnique({
      where: { userId: BigInt(userId) },
      include: {
        badges: true,
      },
    });

    if (!profile) {
      // Criar perfil inicial
      profile = await this.prisma.gamificationProfile.create({
        data: {
          userId: BigInt(userId),
          totalXP: 0,
          weeklyXP: 0,
          lastActivityDate: new Date(),
        },
        include: {
          badges: true,
        },
      });
    }

    const level = calculateLevel(profile.totalXP);
    const nextLevelXP = getXPForNextLevel(level);
    const currentXP = profile.totalXP - getXPForNextLevel(level - 1);
    const title = getLevelTitle(level);

    // Converter badges para DTO
    const badges: BadgeDto[] = profile.badges.map((badge) => ({
      id: badge.badgeId,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      rarity: badge.rarity as any,
      category: badge.category,
      unlockedAt: badge.unlockedAt,
      progress: badge.progress ?? undefined,
      maxProgress: badge.maxProgress ?? undefined,
    }));

    return {
      userId,
      level,
      currentXP,
      totalXP: profile.totalXP,
      nextLevelXP,
      title,
      badges,
    };
  }

  // Obter leaderboard
  async getLeaderboard(
    limit: number = 10,
    period: "week" | "month" | "all" = "week",
    offset: number = 0
  ): Promise<LeaderboardEntryDto[]> {
    let orderByField: "totalXP" | "weeklyXP" = "totalXP";

    // Para período semanal, usamos weeklyXP
    // Para mensal e todos os tempos, usamos totalXP (por enquanto)
    if (period === "week") {
      orderByField = "weeklyXP";
    } else {
      orderByField = "totalXP";
    }

    const profiles = await this.prisma.gamificationProfile.findMany({
      skip: offset,
      take: limit,
      orderBy: { [orderByField]: "desc" },
      include: {
        User: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return profiles.map((profile, index) => ({
      userId: Number(profile.userId),
      name: profile.User.name,
      level: calculateLevel(profile.totalXP),
      totalXP: profile.totalXP,
      weeklyXP: profile.weeklyXP,
      rank: offset + index + 1, // Ajustar rank baseado no offset
      trend: "stable", // TODO: Calcular trend baseado em histórico
    }));
  }

  // Obter leaderboard por categoria
  async getLeaderboardByCategory(
    category: "badges" | "teams",
    limit: number = 10
  ): Promise<LeaderboardEntryDto[]> {
    switch (category) {
      case "badges":
        return this.getBadgeLeaderboard(limit);
      case "teams":
        return this.getTeamLeaderboard(limit);
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }

  private async getBadgeLeaderboard(
    limit: number
  ): Promise<LeaderboardEntryDto[]> {
    const usersWithBadgeCounts = await this.prisma.user.findMany({
      take: limit,
      include: {
        gamificationProfile: {
          include: {
            badges: true,
            User: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Filtrar usuários que têm perfil de gamificação e ordenar por número de badges
    const validUsers = usersWithBadgeCounts
      .filter((user) => user.gamificationProfile)
      .map((user) => ({
        profile: user.gamificationProfile!,
        badgeCount: user.gamificationProfile!.badges.length,
      }))
      .sort((a, b) => b.badgeCount - a.badgeCount)
      .slice(0, limit);

    return validUsers.map((item, index) => ({
      userId: Number(item.profile.userId),
      name: item.profile.User.name,
      level: calculateLevel(item.profile.totalXP),
      totalXP: item.profile.totalXP,
      weeklyXP: item.profile.weeklyXP,
      rank: index + 1,
      trend: "stable",
      badgeCount: item.badgeCount,
    }));
  }

  private async getTeamLeaderboard(
    limit: number
  ): Promise<LeaderboardEntryDto[]> {
    // Get teams with their members and XP data
    const teams = await this.prisma.team.findMany({
      include: {
        TeamMembership: {
          where: { deleted_at: null },
          include: {
            User: {
              include: {
                gamificationProfile: true,
              },
            },
          },
        },
      },
      where: { deleted_at: null },
      take: limit,
    });

    // Calculate team scores
    const teamScores = teams.map((team) => {
      const members = team.TeamMembership.filter(
        (membership) => membership.User.gamificationProfile !== null
      );

      const totalXP = members.reduce(
        (sum, membership) =>
          sum + (membership.User.gamificationProfile?.totalXP || 0),
        0
      );

      const weeklyXP = members.reduce(
        (sum, membership) =>
          sum + (membership.User.gamificationProfile?.weeklyXP || 0),
        0
      );

      return {
        teamId: Number(team.id),
        teamName: team.name,
        totalXP,
        weeklyXP,
        memberCount: members.length,
        averageXP: members.length > 0 ? totalXP / members.length : 0,
      };
    });

    // Sort by total XP (descending)
    teamScores.sort((a, b) => b.totalXP - a.totalXP);

    // Convert to LeaderboardEntryDto format for compatibility
    return teamScores.map((team, index) => ({
      userId: team.teamId, // Using teamId as userId for compatibility
      name: team.teamName,
      level: Math.floor(team.averageXP / 100), // Calculate team "level" from average XP
      totalXP: team.totalXP,
      weeklyXP: team.weeklyXP,
      rank: index + 1,
      trend: "stable",
      badgeCount: 0, // TODO: Implement team badges
    }));
  }

  // Get team-focused leaderboard
  async getTeamLeaderboardDetailed(
    limit: number = 10,
    period: "week" | "month" | "all" = "week"
  ): Promise<TeamLeaderboardEntryDto[]> {
    const teams = await this.prisma.team.findMany({
      include: {
        TeamMembership: {
          where: { deleted_at: null },
          include: {
            User: {
              include: {
                gamificationProfile: true,
              },
            },
          },
        },
      },
      where: { deleted_at: null },
      take: limit,
    });

    // Calculate team scores
    const teamScores = teams.map((team) => {
      const members = team.TeamMembership.filter(
        (membership) => membership.User.gamificationProfile !== null
      );

      const totalXP = members.reduce(
        (sum, membership) =>
          sum + (membership.User.gamificationProfile?.totalXP || 0),
        0
      );

      const weeklyXP = members.reduce(
        (sum, membership) =>
          sum + (membership.User.gamificationProfile?.weeklyXP || 0),
        0
      );

      // Get top 3 contributors
      const sortedMembers = members
        .map((membership) => ({
          userId: Number(membership.User.id),
          name: membership.User.name,
          xp:
            period === "week"
              ? membership.User.gamificationProfile?.weeklyXP || 0
              : membership.User.gamificationProfile?.totalXP || 0,
        }))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 3);

      return {
        teamId: Number(team.id),
        teamName: team.name,
        totalXP,
        weeklyXP,
        memberCount: members.length,
        averageXP: members.length > 0 ? totalXP / members.length : 0,
        topContributors: sortedMembers,
      };
    });

    // Sort by appropriate metric based on period
    const sortField = period === "week" ? "weeklyXP" : "totalXP";
    teamScores.sort((a, b) => b[sortField] - a[sortField]);

    // Convert to DTOs
    return teamScores.map((team, index) => ({
      teamId: team.teamId,
      teamName: team.teamName,
      totalXP: team.totalXP,
      weeklyXP: team.weeklyXP,
      averageXP: team.averageXP,
      memberCount: team.memberCount,
      rank: index + 1,
      trend: "stable", // TODO: Calculate trend based on historical data
      topContributors: team.topContributors,
    }));
  }

  // Obter desafio semanal
  async getWeeklyChallenge(userId: number): Promise<WeeklyChallengeDto> {
    // Por enquanto, retorna um desafio fixo
    // TODO: Implementar sistema de desafios dinâmicos no banco

    // Simular progresso baseado em dados reais (se disponível)
    const profile = await this.prisma.gamificationProfile.findUnique({
      where: { userId: BigInt(userId) },
    });

    const current = profile ? Math.min(profile.weeklyXP / 100, 5) : 0; // Simular milestones
    const target = 5;

    return {
      id: "weekly-milestones",
      title: "Desafio Semanal",
      description: "Complete 5 milestones de PDI esta semana",
      target,
      current: Math.floor(current),
      reward: 'Badge "Conquistador Semanal"',
      progress: (current / target) * 100,
      isCompleted: current >= target,
      expiresAt: this.getEndOfWeek(),
    };
  }

  private getEndOfWeek(): Date {
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }

  // Verificar e desbloquear badges
  private async checkAndUnlockBadges(userId: number): Promise<void> {
    const profile = await this.prisma.gamificationProfile.findUnique({
      where: { userId: BigInt(userId) },
      include: { badges: true },
    });

    if (!profile) return;

    const unlockedBadgeIds = new Set(profile.badges.map((b) => b.badgeId));

    for (const badgeDef of BADGE_DEFINITIONS) {
      if (unlockedBadgeIds.has(badgeDef.id)) continue;

      const shouldUnlock = await this.checkBadgeCriteria(
        userId,
        badgeDef.criteria
      );

      if (shouldUnlock) {
        await this.prisma.userBadge.create({
          data: {
            userId: BigInt(userId),
            badgeId: badgeDef.id,
            name: badgeDef.name,
            description: badgeDef.description,
            icon: badgeDef.icon,
            rarity: badgeDef.rarity,
            category: badgeDef.category,
            unlockedAt: new Date(),
          },
        });

        this.logger.log(`User ${userId} unlocked badge: ${badgeDef.name}`);
      }
    }
  }

  // Verificar critérios de badge
  private async checkBadgeCriteria(
    userId: number,
    criteria: any
  ): Promise<boolean> {
    switch (criteria.type) {
      case "milestone_count":
        // TODO: Contar milestones completados do PDI
        const milestoneCount = await this.countUserMilestones(userId);
        return milestoneCount >= criteria.target;

      case "competency_count":
        // TODO: Contar competências desenvolvidas
        return false; // Implementar depois

      case "feedback_count":
        // TODO: Contar feedbacks dados
        return false; // Implementar depois

      case "collaboration_count":
        // TODO: Contar atividades colaborativas
        return false; // Implementar depois

      case "peer_feedback_count":
        // TODO: Contar feedbacks dados para colegas de equipe
        return false; // Implementar depois

      case "knowledge_sharing_count":
        // TODO: Contar sessões de compartilhamento de conhecimento
        return false; // Implementar depois

      case "team_ranking":
        // Verificar se a equipe do usuário está no top N
        const userTeam = await this.getUserTeam(userId);
        if (!userTeam) return false;

        const teamRanking = await this.getTeamLeaderboardDetailed(10, "all");
        const teamRank =
          teamRanking.find((team) => team.teamId === userTeam.teamId)?.rank ||
          999;
        return teamRank <= criteria.target;

      case "team_top_contributor":
        // Verificar se o usuário é o maior contribuidor da equipe
        const userTeamForContributor = await this.getUserTeam(userId);
        if (!userTeamForContributor) return false;

        const teamMembers = await this.getTeamMembers(
          userTeamForContributor.teamId
        );
        const topContributor = teamMembers.sort(
          (a, b) => b.weeklyXP - a.weeklyXP
        )[0];
        return topContributor?.userId === userId;

      case "team_mentoring":
        // TODO: Contar colegas de equipe mentorados
        return false; // Implementar depois

      case "cross_team_collaboration":
        // TODO: Contar colaborações com outras equipes
        return false; // Implementar depois

      case "team_first_place":
        // Verificar se a equipe está em primeiro lugar
        const userTeamForFirst = await this.getUserTeam(userId);
        if (!userTeamForFirst) return false;

        const teamRankingForFirst = await this.getTeamLeaderboardDetailed(
          1,
          "all"
        );
        return teamRankingForFirst[0]?.teamId === userTeamForFirst.teamId;

      case "user_rank":
        // Badge especial para primeiros usuários
        const userCount = await this.prisma.gamificationProfile.count();
        return userCount <= criteria.target;

      default:
        return false;
    }
  }

  // Helper: contar milestones do usuário
  private async countUserMilestones(userId: number): Promise<number> {
    try {
      const pdiPlan = await this.prisma.pdiPlan.findUnique({
        where: { userId: BigInt(userId) },
      });

      if (!pdiPlan?.milestones) return 0;

      const milestones = Array.isArray(pdiPlan.milestones)
        ? pdiPlan.milestones
        : [];

      return milestones.length;
    } catch {
      return 0;
    }
  }

  // Helper: verificar se é o mesmo dia
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  // Helper: obter categoria da ação atualizada
  private getCategoryForAction(
    action: string
  ): "development" | "collaboration" | "teamwork" | "bonus" {
    // Usar as categorias definidas em XP_CATEGORIES
    for (const [category, actions] of Object.entries(XP_CATEGORIES)) {
      if ((actions as readonly string[]).includes(action)) {
        return category as
          | "development"
          | "collaboration"
          | "teamwork"
          | "bonus";
      }
    }

    // Fallback para categorização legacy
    if (
      action.startsWith("pdi_") ||
      action.includes("competency") ||
      action.includes("milestone") ||
      action.includes("assessment") ||
      action.includes("learning")
    ) {
      return "development";
    }
    if (
      action.includes("team_") ||
      action.includes("feedback") ||
      action.includes("mentoring") ||
      action.includes("collaboration") ||
      action.includes("knowledge") ||
      action.includes("coaching")
    ) {
      return "collaboration";
    }
    if (
      action.includes("goal") ||
      action.includes("process") ||
      action.includes("culture") ||
      action.includes("documentation")
    ) {
      return "teamwork";
    }
    return "development";
  }

  // 🛡️ Validações Anti-Gaming
  private async validateAntiGaming(
    userId: number,
    action: XPAction,
    points: number
  ): Promise<void> {
    // Verificar caps semanais
    await this.validateWeeklyCaps(userId, action, points);

    // Verificar cooldowns
    await this.validateCooldowns(userId, action);

    // TODO: Implementar validações de peer review conforme necessário
  }

  private async validateWeeklyCaps(
    userId: number,
    action: XPAction,
    points: number
  ): Promise<void> {
    const weekCap = WEEKLY_XP_CAPS[action as keyof typeof WEEKLY_XP_CAPS];
    if (!weekCap) return; // Ação sem cap

    // Obter XP já ganho esta semana para esta ação
    const startOfWeek = this.getStartOfWeek();
    const weeklyXPForAction = await this.prisma.xpHistory.aggregate({
      where: {
        userId: BigInt(userId),
        action: action,
        createdAt: { gte: startOfWeek },
      },
      _sum: { points: true },
    });

    const currentWeeklyXP = weeklyXPForAction._sum.points || 0;

    if (currentWeeklyXP + points > weekCap) {
      throw new BadRequestException(
        `Weekly XP cap reached for action ${action}. Current: ${currentWeeklyXP}, Cap: ${weekCap}`
      );
    }
  }

  private async validateCooldowns(
    userId: number,
    action: XPAction
  ): Promise<void> {
    const cooldownHours = COOLDOWNS[action as keyof typeof COOLDOWNS];
    if (!cooldownHours) return; // Ação sem cooldown

    const cooldownDate = new Date();
    cooldownDate.setHours(cooldownDate.getHours() - cooldownHours);

    const recentAction = await this.prisma.xpHistory.findFirst({
      where: {
        userId: BigInt(userId),
        action: action,
        createdAt: { gte: cooldownDate },
      },
      orderBy: { createdAt: "desc" },
    });

    if (recentAction) {
      const hoursLeft = Math.ceil(
        (cooldownDate.getTime() - recentAction.createdAt.getTime()) /
          (1000 * 60 * 60)
      );
      throw new BadRequestException(
        `Action ${action} is in cooldown. Try again in ${Math.abs(
          hoursLeft
        )} hours.`
      );
    }
  }

  // 📅 Helpers de Data
  private async shouldResetWeeklyXP(lastActivity: Date): Promise<boolean> {
    const startOfThisWeek = this.getStartOfWeek();
    return lastActivity < startOfThisWeek;
  }

  private getStartOfWeek(): Date {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day; // Domingo = 0
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  // Helper: obter equipe do usuário
  private async getUserTeam(userId: number) {
    const teamMembership = await this.prisma.teamMembership.findFirst({
      where: {
        userId: BigInt(userId),
        deleted_at: null,
      },
      include: {
        Team: true,
      },
    });

    return teamMembership
      ? {
          teamId: Number(teamMembership.Team.id),
          teamName: teamMembership.Team.name,
          role: teamMembership.role,
        }
      : null;
  }

  // Helper: obter membros da equipe com seus XPs
  private async getTeamMembers(teamId: number) {
    const teamMemberships = await this.prisma.teamMembership.findMany({
      where: {
        teamId: BigInt(teamId),
        deleted_at: null,
      },
      include: {
        User: {
          include: {
            gamificationProfile: true,
          },
        },
      },
    });

    return teamMemberships.map((membership) => ({
      userId: Number(membership.User.id),
      name: membership.User.name,
      level: calculateLevel(membership.User.gamificationProfile?.totalXP || 0),
      totalXP: membership.User.gamificationProfile?.totalXP || 0,
      weeklyXP: membership.User.gamificationProfile?.weeklyXP || 0,
      contributionScore: membership.User.gamificationProfile?.weeklyXP || 0,
      badges: [], // TODO: Load user badges
    }));
  }

  // 📋 SPRINT 1 - MÉTODOS PARA AÇÕES MANUAIS

  /**
   * Submete uma ação manual para o sistema
   */
  async submitManualAction(
    userId: number,
    action: string,
    data: ActionSubmissionDto & { metadata?: any }
  ): Promise<any> {
    // Calcular pontos base
    const basePoints = XP_SYSTEM[action] || 0;
    if (basePoints === 0) {
      throw new BadRequestException(`Ação '${action}' não é válida`);
    }

    // Criar submissão
    const submission = await this.prisma.actionSubmission.create({
      data: {
        userId,
        action,
        points: basePoints,
        evidence: data.evidence,
        metadata: data.metadata,
        description: data.description,
        status: "PENDING",
      },
    });

    // Se não requer validação, aprovar automaticamente
    const requiresValidation = VALIDATION_REQUIREMENTS[action];
    if (!requiresValidation) {
      await this.approveActionSubmission(submission.id);

      // Adicionar XP imediatamente
      const xpGain = await this.addXP({
        userId,
        action,
        points: basePoints,
        description: data.description || `Manual action: ${action}`,
      });

      return {
        success: true,
        submission: {
          id: submission.id.toString(),
          action: submission.action,
          points: submission.points,
          status: "APPROVED",
          createdAt: submission.createdAt,
        },
        xpGained: xpGain.points,
        message: "Ação submetida e aprovada automaticamente!",
      };
    }

    return {
      success: true,
      submission: {
        id: submission.id.toString(),
        action: submission.action,
        points: submission.points,
        status: submission.status,
        createdAt: submission.createdAt,
      },
      message: "Ação submetida para validação!",
    };
  }

  /**
   * Obtém submissões de ações de um usuário
   */
  async getUserActionSubmissions(
    userId: number,
    status?: "PENDING" | "APPROVED" | "REJECTED",
    limit: number = 20,
    offset: number = 0
  ): Promise<any[]> {
    const submissions = await this.prisma.actionSubmission.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        validator: {
          select: { id: true, name: true },
        },
      },
    });

    return submissions.map((submission) => ({
      id: submission.id.toString(),
      action: submission.action,
      points: submission.points,
      evidence: submission.evidence,
      rating: submission.rating,
      status: submission.status,
      description: submission.description,
      metadata: submission.metadata,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      validator: submission.validator,
    }));
  }

  /**
   * Obtém fila de validação de ações
   */
  async getActionValidationQueue(limit: number = 10): Promise<any[]> {
    const pendingSubmissions = await this.prisma.actionSubmission.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: { createdAt: "asc" },
      take: limit,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return pendingSubmissions.map((submission) => ({
      id: submission.id.toString(),
      action: submission.action,
      points: submission.points,
      evidence: submission.evidence,
      description: submission.description,
      metadata: submission.metadata,
      createdAt: submission.createdAt,
      user: submission.user,
    }));
  }

  /**
   * Valida uma submissão de ação
   */
  async validateActionSubmission(
    submissionId: string,
    validatorId: number,
    validation: {
      rating: number;
      status: "APPROVED" | "REJECTED" | "REQUIRES_EVIDENCE";
      feedback?: string;
    }
  ): Promise<any> {
    const submission = await this.prisma.actionSubmission.findUnique({
      where: { id: BigInt(submissionId) },
      include: { user: true },
    });

    if (!submission) {
      throw new BadRequestException("Submissão não encontrada");
    }

    if (submission.status !== "PENDING") {
      throw new BadRequestException("Submissão já foi validada");
    }

    // Atualizar submissão
    const updatedSubmission = await this.prisma.actionSubmission.update({
      where: { id: BigInt(submissionId) },
      data: {
        status: validation.status,
        rating: validation.rating,
        validatedBy: BigInt(validatorId),
      },
    });

    // Se aprovada, adicionar XP
    if (validation.status === "APPROVED") {
      await this.addXP({
        userId: Number(submission.userId),
        action: submission.action,
        points: submission.points,
        description: `Validated action: ${submission.action}`,
      });
    }

    return {
      success: true,
      submission: {
        id: updatedSubmission.id.toString(),
        status: updatedSubmission.status,
        rating: updatedSubmission.rating,
        validatedBy: validatorId,
      },
      message:
        validation.status === "APPROVED"
          ? "Ação aprovada e XP adicionado!"
          : "Ação rejeitada",
    };
  }

  /**
   * Aprova automaticamente uma submissão
   */
  private async approveActionSubmission(submissionId: bigint): Promise<void> {
    await this.prisma.actionSubmission.update({
      where: { id: submissionId },
      data: {
        status: "APPROVED",
        rating: 5.0, // Auto-aprovação com rating máximo
      },
    });
  }
}
