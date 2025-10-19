import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityResponseDto, TimelineResponseDto } from './dto/activity-response.dto';
import { ActivityType } from '@prisma/client';

@Injectable()
export class ActivitiesService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
  ) {}

  /**
   * Calcula XP baseado no tipo de atividade
   */
  private calculateXP(type: ActivityType): number {
    const xpMap = {
      [ActivityType.ONE_ON_ONE]: 50, // 1:1 = 50 XP
      [ActivityType.MENTORING]: 35, // Mentoria = 35 XP
      [ActivityType.CERTIFICATION]: 100, // Certificação = 100 XP
      [ActivityType.GOAL_UPDATE]: 0, // XP já calculado no goal.service
      [ActivityType.COMPETENCY_UPDATE]: 0, // XP já calculado no competency.service
    };
    return xpMap[type] || 0;
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
   * Verifica se usuário é gerente do dono da atividade
   */
  private async isManager(
    currentUserId: string,
    targetUserId: string,
    workspaceId: string,
  ): Promise<boolean> {
    const rule = await this.prisma.managementRule.findFirst({
      where: {
        subordinateId: targetUserId,
        managerId: currentUserId,
        workspaceId,
        deletedAt: null,
      },
    });
    return !!rule;
  }

  /**
   * Verifica permissão para criar/visualizar atividade
   * Regra: Própria pessoa OU seu gerente
   */
  private async checkPermission(
    currentUserId: string,
    targetUserId: string,
    workspaceId: string,
  ): Promise<void> {
    if (currentUserId === targetUserId) {
      return;
    }

    const isManagerOfUser = await this.isManager(currentUserId, targetUserId, workspaceId);
    if (isManagerOfUser) {
      return;
    }

    throw new ForbiddenException('Você não tem permissão para gerenciar atividades deste usuário');
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

    // Verifica permissão
    await this.checkPermission(currentUserId, userId, 'workspace'); // workspaceId será validado pelo ciclo

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

    // Valida se o ciclo existe e pertence ao usuário
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

    // Calcula XP
    const xpEarned = this.calculateXP(type);

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
            participantName: oneOnOneData.participantName,
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

    // Adiciona XP ao usuário
    if (xpEarned > 0) {
      await this.gamificationService.addXP({
        userId,
        workspaceId: cycle.workspaceId, // ✅ Workspace do ciclo
        xpAmount: xpEarned,
        reason: `Atividade: ${title}`,
      });
    }

    // Busca atividade completa com dados específicos
    return this.findOne(activity.id, currentUserId, 'workspace');
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
