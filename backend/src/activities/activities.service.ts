import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { ManagementService } from '../management/management.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityResponseDto, TimelineResponseDto } from './dto/activity-response.dto';
import { ActivityType, XpSource } from '@prisma/client';

@Injectable()
export class ActivitiesService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
    @Inject(forwardRef(() => ManagementService))
    private managementService: ManagementService,
  ) {}

  /**
   * Calcula XP baseado no tipo de atividade
   */
  private calculateXP(type: ActivityType): number {
    const xpMap = {
      [ActivityType.ONE_ON_ONE]: 0, // XP calculado dinamicamente no calculateOneOnOneXP()
      [ActivityType.MENTORING]: 35, // Mentoria = 35 XP
      [ActivityType.CERTIFICATION]: 100, // Certificação = 100 XP
      [ActivityType.GOAL_UPDATE]: 0, // XP já calculado no goal.service
      [ActivityType.COMPETENCY_UPDATE]: 0, // XP já calculado no competency.service
    };
    return xpMap[type] || 0;
  }

  /**
   * Calcula XP para atividades 1:1 baseado no conteúdo preenchido:
   * - Base: 300 XP
   * - Itens de trabalho: +50 XP se preenchido
   * - Pontos positivos: +50 XP se preenchido
   * - Pontos de melhoria: +50 XP se preenchido
   * - Próximos passos: +50 XP se preenchido
   * - Anotações detalhadas: +50 XP se >50 caracteres
   * Total máximo: 550 XP
   */
  private calculateOneOnOneXP(oneOnOneData: any): number {
    let totalXP = 300; // Base 1:1

    // Bônus por conteúdo preenchido
    if (oneOnOneData.workingOn && oneOnOneData.workingOn.length > 0) {
      totalXP += 50; // Itens de trabalho
    }
    if (oneOnOneData.positivePoints && oneOnOneData.positivePoints.length > 0) {
      totalXP += 50; // Pontos positivos
    }
    if (oneOnOneData.improvementPoints && oneOnOneData.improvementPoints.length > 0) {
      totalXP += 50; // Pontos de melhoria
    }
    if (oneOnOneData.nextSteps && oneOnOneData.nextSteps.length > 0) {
      totalXP += 50; // Próximos passos
    }
    if (oneOnOneData.generalNotes && oneOnOneData.generalNotes.length > 50) {
      totalXP += 50; // Anotações detalhadas
    }

    return totalXP;
  }

  /**
   * Verifica se o usuário já criou uma atividade 1:1 que gerou XP na semana atual
   * Limitação: Máximo 1 1:1 por semana que pode gerar XP
   */
  private async canEarnXPThisWeek(userId: string): Promise<boolean> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo da semana atual
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Próximo domingo

    const oneOnOneWithXPThisWeek = await this.prisma.activity.findFirst({
      where: {
        userId,
        type: ActivityType.ONE_ON_ONE,
        xpEarned: { gt: 0 }, // Só considera atividades que geraram XP
        createdAt: {
          gte: startOfWeek,
          lt: endOfWeek,
        },
        deletedAt: null,
      },
    });

    return !oneOnOneWithXPThisWeek; // Retorna true se não encontrou nenhuma atividade 1:1 com XP esta semana
  }

  /**
   * Formata atividade com dados específicos do tipo
   */
  private formatActivity(activity: any): ActivityResponseDto {
    const formatted: ActivityResponseDto = {
      id: activity.id,
      cycleId: activity.cycleId,
      userId: activity.userId,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      xpEarned: activity.xpEarned,
      duration: activity.duration,
      createdAt: activity.createdAt,
    };

    // Adiciona dados específicos do tipo
    if (activity.oneOnOne) {
      formatted.oneOnOne = activity.oneOnOne;
    }
    if (activity.mentoring) {
      formatted.mentoring = activity.mentoring;
    }
    if (activity.certification) {
      formatted.certification = activity.certification;
    }

    return formatted;
  }

  /**
   * Verifica permissão para criar/visualizar atividade
   * Regra: Própria pessoa OU seu gerente (INDIVIDUAL ou TEAM)
   * Usa a mesma lógica do ManagerGuard
   */
  private async checkPermission(
    currentUserId: string,
    targetUserId: string,
    workspaceId: string,
  ): Promise<void> {
    console.log('🔍 [ActivitiesService] Verificando permissão:', {
      currentUserId,
      targetUserId,
      workspaceId,
    });

    // Se é a própria pessoa, permite
    if (currentUserId === targetUserId) {
      console.log('✅ [ActivitiesService] Próprio usuário - permissão concedida');
      return;
    }

    // Verifica se o usuário logado gerencia o targetUserId (INDIVIDUAL ou TEAM)
    const isManaged = await this.managementService.isUserManagedBy(
      targetUserId,
      currentUserId,
      workspaceId,
    );

    console.log('🔍 [ActivitiesService] Resultado da verificação:', {
      isManaged,
      currentUserId,
      targetUserId,
    });

    if (!isManaged) {
      throw new ForbiddenException(
        'Você não tem permissão para gerenciar atividades deste usuário',
      );
    }

    console.log('✅ [ActivitiesService] Gerente do usuário - permissão concedida');
  }

  /**
   * Cria nova atividade
   */
  async create(
    createActivityDto: CreateActivityDto,
    currentUserId: string,
  ): Promise<ActivityResponseDto> {
    const {
      cycleId,
      userId,
      type,
      title,
      description,
      duration,
      oneOnOneData,
      mentoringData,
      certificationData,
    } = createActivityDto;

    // Valida se o ciclo existe e pertence ao usuário PRIMEIRO
    const cycle = await this.prisma.cycle.findFirst({
      where: {
        id: cycleId,
        userId,
        deletedAt: null,
      },
    });

    if (!cycle) {
      throw new BadRequestException('Ciclo não encontrado ou não pertence a este usuário');
    }

    // Verifica permissão usando o workspaceId do ciclo
    await this.checkPermission(currentUserId, userId, cycle.workspaceId);

    // Valida que dados específicos foram fornecidos para o tipo
    if (type === ActivityType.ONE_ON_ONE && !oneOnOneData) {
      throw new BadRequestException(
        'Dados de 1:1 são obrigatórios para atividades do tipo ONE_ON_ONE',
      );
    }
    if (type === ActivityType.MENTORING && !mentoringData) {
      throw new BadRequestException(
        'Dados de mentoria são obrigatórios para atividades do tipo MENTORING',
      );
    }
    if (type === ActivityType.CERTIFICATION && !certificationData) {
      throw new BadRequestException(
        'Dados de certificação são obrigatórios para atividades do tipo CERTIFICATION',
      );
    }

    // Calcula XP baseado no tipo e conteúdo
    let xpEarned = this.calculateXP(type);

    // Para atividades 1:1, calcula XP baseado no conteúdo e verifica limite semanal
    if (type === ActivityType.ONE_ON_ONE && oneOnOneData) {
      const canEarnXP = await this.canEarnXPThisWeek(userId);
      if (canEarnXP) {
        xpEarned = this.calculateOneOnOneXP(oneOnOneData);
      } else {
        xpEarned = 0; // Não ganha XP se já criou 1:1 esta semana
      }
    }

    // Cria atividade base e dados específicos em uma transação
    const activity = await this.prisma.$transaction(async (tx) => {
      // Cria activity base
      const baseActivity = await tx.activity.create({
        data: {
          cycleId,
          userId,
          type,
          title,
          description,
          duration,
          xpEarned,
        },
      });

      // Cria dados específicos
      if (type === ActivityType.ONE_ON_ONE && oneOnOneData) {
        await tx.oneOnOneActivity.create({
          data: {
            activityId: baseActivity.id,
            participantId: oneOnOneData.participantId,
            participantName: oneOnOneData.participantName,
            completedAt: oneOnOneData.completedAt ? new Date(oneOnOneData.completedAt) : null,
            workingOn: oneOnOneData.workingOn,
            generalNotes: oneOnOneData.generalNotes,
            positivePoints: oneOnOneData.positivePoints,
            improvementPoints: oneOnOneData.improvementPoints,
            nextSteps: oneOnOneData.nextSteps,
          },
        });
      } else if (type === ActivityType.MENTORING && mentoringData) {
        await tx.mentoringActivity.create({
          data: {
            activityId: baseActivity.id,
            menteeName: mentoringData.menteeName,
            topics: mentoringData.topics,
            progressFrom: mentoringData.progressFrom,
            progressTo: mentoringData.progressTo,
            outcomes: mentoringData.outcomes,
            nextSteps: mentoringData.nextSteps,
          },
        });
      } else if (type === ActivityType.CERTIFICATION && certificationData) {
        await tx.certificationActivity.create({
          data: {
            activityId: baseActivity.id,
            certificationName: certificationData.certificationName,
            topics: certificationData.topics,
            outcomes: certificationData.outcomes,
            rating: certificationData.rating,
            nextSteps: certificationData.nextSteps,
          },
        });
      }

      return baseActivity;
    });

    // Adiciona XP ao usuário e verifica level up
    let leveledUp = false;
    let previousLevel = 0;
    let newLevel = 0;

    if (xpEarned > 0) {
      // Buscar nível atual antes de adicionar XP
      const currentProfile = await this.gamificationService.getProfile(userId, cycle.workspaceId);
      previousLevel = currentProfile.level;

      // Determina a fonte do XP baseada no tipo de atividade
      let xpSource: XpSource;
      switch (type) {
        case ActivityType.ONE_ON_ONE:
          xpSource = XpSource.ACTIVITY_ONE_ON_ONE;
          break;
        case ActivityType.MENTORING:
          xpSource = XpSource.ACTIVITY_MENTORING;
          break;
        case ActivityType.CERTIFICATION:
          xpSource = XpSource.ACTIVITY_CERTIFICATION;
          break;
        default:
          xpSource = XpSource.MANUAL;
      }

      const updatedProfile = await this.gamificationService.addXP({
        userId,
        workspaceId: cycle.workspaceId,
        xpAmount: xpEarned,
        reason: `Atividade: ${title}`,
        source: xpSource,
        sourceId: activity.id,
      });

      newLevel = updatedProfile.level;
      leveledUp = newLevel > previousLevel;

      if (leveledUp) {
        console.log(`🎉 LEVEL UP! Usuário ${userId}: ${previousLevel} → ${newLevel}`);
      }
    }

    // Busca atividade completa com dados específicos
    const fullActivity = await this.findOne(activity.id, currentUserId, cycle.workspaceId);

    // Adiciona informações de level up se ocorreu
    if (leveledUp) {
      (fullActivity as any).leveledUp = true;
      (fullActivity as any).previousLevel = previousLevel;
      (fullActivity as any).newLevel = newLevel;
    }

    return fullActivity;
  }

  /**
   * Lista atividades (timeline) com paginação
   */
  async findTimeline(
    userId: string,
    workspaceId: string,
    cycleId?: string,
    type?: ActivityType,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<TimelineResponseDto> {
    const skip = (page - 1) * pageSize;

    const [activities, total] = await Promise.all([
      this.prisma.activity.findMany({
        where: {
          userId,
          ...(cycleId && { cycleId }),
          ...(type && { type }),
          deletedAt: null,
        },
        include: {
          oneOnOne: true,
          mentoring: true,
          certification: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: pageSize,
      }),
      this.prisma.activity.count({
        where: {
          userId,
          ...(cycleId && { cycleId }),
          ...(type && { type }),
          deletedAt: null,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const hasMore = page < totalPages;

    return {
      activities: activities.map((activity) => this.formatActivity(activity)),
      page,
      pageSize,
      total,
      totalPages,
      hasMore,
    };
  }

  /**
   * Retorna detalhes de uma atividade específica
   */
  async findOne(
    id: string,
    currentUserId: string,
    workspaceId: string,
  ): Promise<ActivityResponseDto> {
    const activity = await this.prisma.activity.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        oneOnOne: true,
        mentoring: true,
        certification: true,
      },
    });

    if (!activity) {
      throw new NotFoundException(`Atividade com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, activity.userId, workspaceId);

    return this.formatActivity(activity);
  }

  /**
   * Atualiza atividade existente
   */
  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
    currentUserId: string,
    workspaceId: string,
  ): Promise<ActivityResponseDto> {
    // Busca atividade existente
    const activity = await this.prisma.activity.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        oneOnOne: true,
        mentoring: true,
        certification: true,
      },
    });

    if (!activity) {
      throw new NotFoundException(`Atividade com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, activity.userId, workspaceId);

    const { title, description, duration, oneOnOneData, mentoringData, certificationData } =
      updateActivityDto;

    // Atualiza dados principais
    const updatedActivity = await this.prisma.activity.update({
      where: { id },
      data: {
        title: title ?? activity.title,
        description: description ?? activity.description,
        duration: duration ?? activity.duration,
      },
      include: {
        oneOnOne: true,
        mentoring: true,
        certification: true,
      },
    });

    // Atualiza dados específicos do tipo se fornecidos
    if (oneOnOneData && activity.type === ActivityType.ONE_ON_ONE && activity.oneOnOne) {
      await this.prisma.oneOnOneActivity.update({
        where: { id: activity.oneOnOne.id },
        data: {
          participantId: oneOnOneData.participantId ?? activity.oneOnOne.participantId,
          participantName: oneOnOneData.participantName ?? activity.oneOnOne.participantName,
          completedAt:
            oneOnOneData.completedAt !== undefined
              ? oneOnOneData.completedAt
                ? new Date(oneOnOneData.completedAt)
                : null
              : activity.oneOnOne.completedAt,
          workingOn:
            oneOnOneData.workingOn !== undefined
              ? oneOnOneData.workingOn
              : (activity.oneOnOne.workingOn as any),
          generalNotes: oneOnOneData.generalNotes ?? activity.oneOnOne.generalNotes,
          positivePoints:
            oneOnOneData.positivePoints !== undefined
              ? oneOnOneData.positivePoints
              : (activity.oneOnOne.positivePoints as any),
          improvementPoints:
            oneOnOneData.improvementPoints !== undefined
              ? oneOnOneData.improvementPoints
              : (activity.oneOnOne.improvementPoints as any),
          nextSteps:
            oneOnOneData.nextSteps !== undefined
              ? oneOnOneData.nextSteps
              : (activity.oneOnOne.nextSteps as any),
        },
      });
    }

    if (mentoringData && activity.type === ActivityType.MENTORING && activity.mentoring) {
      await this.prisma.mentoringActivity.update({
        where: { id: activity.mentoring.id },
        data: {
          menteeName: mentoringData.menteeName ?? activity.mentoring.menteeName,
          topics:
            mentoringData.topics !== undefined
              ? mentoringData.topics
              : (activity.mentoring.topics as any),
          progressFrom: mentoringData.progressFrom ?? activity.mentoring.progressFrom,
          progressTo: mentoringData.progressTo ?? activity.mentoring.progressTo,
          outcomes: mentoringData.outcomes ?? activity.mentoring.outcomes,
        },
      });
    }

    if (
      certificationData &&
      activity.type === ActivityType.CERTIFICATION &&
      activity.certification
    ) {
      await this.prisma.certificationActivity.update({
        where: { id: activity.certification.id },
        data: {
          certificationName:
            certificationData.certificationName ?? activity.certification.certificationName,
          topics:
            certificationData.topics !== undefined
              ? certificationData.topics
              : (activity.certification.topics as any),
          outcomes: certificationData.outcomes ?? activity.certification.outcomes,
          rating: certificationData.rating ?? activity.certification.rating,
        },
      });
    }

    // Recarrega atividade com todas as relações
    const reloadedActivity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        oneOnOne: true,
        mentoring: true,
        certification: true,
      },
    });

    return this.formatActivity(reloadedActivity);
  }

  /**
   * Deleta atividade (soft delete)
   */
  async remove(id: string, currentUserId: string, workspaceId: string): Promise<void> {
    const activity = await this.prisma.activity.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!activity) {
      throw new NotFoundException(`Atividade com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, activity.userId, workspaceId);

    // Soft delete
    await this.prisma.activity.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Retorna estatísticas de atividades do usuário
   */
  async getStats(userId: string, cycleId?: string): Promise<any> {
    const where = {
      userId,
      ...(cycleId && { cycleId }),
      deletedAt: null,
    };

    const [total, byType, totalXP] = await Promise.all([
      this.prisma.activity.count({ where }),
      this.prisma.activity.groupBy({
        by: ['type'],
        where,
        _count: {
          type: true,
        },
      }),
      this.prisma.activity.aggregate({
        where,
        _sum: {
          xpEarned: true,
        },
      }),
    ]);

    const stats = {
      total,
      totalXP: totalXP._sum.xpEarned || 0,
      byType: byType.reduce(
        (acc, item) => {
          acc[item.type] = item._count.type;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };

    return stats;
  }

  /**
   * 🆕 Cria Activity automaticamente a partir de atualização de Goal
   * (Método interno, não exposto via API)
   */
  async createFromGoalUpdate(data: {
    cycleId: string;
    userId: string;
    goalId: string;
    goalTitle: string;
    previousValue: number | null;
    newValue: number | null;
    notes?: string;
    xpEarned: number;
  }): Promise<void> {
    const { cycleId, userId, goalTitle, previousValue, newValue, notes, xpEarned } = data;

    // Monta descrição informativa
    const parts: string[] = [];

    if (previousValue !== null && newValue !== null) {
      parts.push(`Progresso: ${previousValue} → ${newValue}`);
    } else if (newValue !== null) {
      parts.push(`Novo valor: ${newValue}`);
    }

    if (xpEarned > 0) {
      parts.push(`+${xpEarned} XP`);
    }

    if (notes) {
      parts.push(notes);
    }

    const description = parts.length > 0 ? parts.join(' | ') : 'Meta atualizada';

    // Cria Activity na timeline
    await this.prisma.activity.create({
      data: {
        cycleId,
        userId,
        type: ActivityType.GOAL_UPDATE,
        title: `🎯 ${goalTitle}`,
        description,
        xpEarned,
      },
    });
  }

  /**
   * 🆕 Cria Activity automaticamente a partir de evolução de Competency
   * (Método interno, não exposto via API)
   */
  async createFromCompetencyUpdate(data: {
    cycleId: string;
    userId: string;
    competencyId: string;
    competencyName: string;
    previousLevel: number;
    newLevel: number;
    previousProgress: number;
    newProgress: number;
    notes?: string;
    xpEarned: number;
  }): Promise<void> {
    const {
      cycleId,
      userId,
      competencyName,
      previousLevel,
      newLevel,
      previousProgress,
      newProgress,
      notes,
      xpEarned,
    } = data;

    // Monta descrição informativa
    const parts: string[] = [];

    // Se subiu de nível, destaca isso
    if (newLevel > previousLevel) {
      parts.push(`🚀 Subiu para Nível ${newLevel}`);
    } else {
      parts.push(`Progresso: ${previousProgress}% → ${newProgress}%`);
    }

    if (xpEarned > 0) {
      parts.push(`+${xpEarned} XP`);
    }

    if (notes) {
      parts.push(notes);
    }

    const description = parts.join(' | ');

    // Cria Activity na timeline
    await this.prisma.activity.create({
      data: {
        cycleId,
        userId,
        type: ActivityType.COMPETENCY_UPDATE,
        title: `🧠 ${competencyName}`,
        description,
        xpEarned,
      },
    });
  }
}
