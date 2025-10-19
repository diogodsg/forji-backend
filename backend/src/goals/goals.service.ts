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
import { ActivitiesService } from '../activities/activities.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { UpdateGoalProgressDto } from './dto/update-goal-progress.dto';
import { GoalResponseDto, GoalWithHistoryDto } from './dto/goal-response.dto';
import { GoalStatus, GoalType } from '@prisma/client';

@Injectable()
export class GoalsService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
    @Inject(forwardRef(() => ActivitiesService))
    private activitiesService: ActivitiesService,
  ) {}

  /**
   * Calcula percentual de progresso da meta baseado no tipo
   */
  private calculateProgress(
    type: GoalType,
    start: number | null,
    current: number | null,
    target: number | null,
  ): number {
    // Se não tiver valores, retorna 0
    if (start === null || current === null || target === null) return 0;

    if (type === 'INCREASE') {
      // Meta de aumento: progresso = (current - start) / (target - start) * 100
      if (target <= start) return 0;
      const progress = ((current - start) / (target - start)) * 100;
      return Math.min(100, Math.max(0, Math.round(progress * 10) / 10));
    } else if (type === 'DECREASE') {
      // Meta de redução: progresso = (start - current) / (start - target) * 100
      if (start <= target) return 0;
      const progress = ((start - current) / (start - target)) * 100;
      return Math.min(100, Math.max(0, Math.round(progress * 10) / 10));
    } else if (type === 'PERCENTAGE') {
      // Meta percentual: current já é o percentual
      return Math.min(100, Math.max(0, Math.round(current * 10) / 10));
    } else if (type === 'BINARY') {
      // Meta binária: 0% ou 100%
      return current >= 1 ? 100 : 0;
    }
    return 0;
  }

  /**
   * Enriquece meta com progresso calculado
   */
  private enrichGoal(goal: any): GoalResponseDto {
    const progress = this.calculateProgress(
      goal.type,
      goal.startValue,
      goal.currentValue,
      goal.targetValue,
    );

    return {
      ...goal,
      progress,
    };
  }

  /**
   * Calcula XP a ser dado baseado no progresso ganho
   */
  private calculateXpReward(progressGain: number): number {
    if (progressGain >= 50) return 200; // Completion or huge jump
    if (progressGain >= 25) return 100;
    if (progressGain >= 10) return 50;
    if (progressGain >= 5) return 25;
    return 0;
  }

  /**
   * Verifica se usuário é gerente do dono da meta
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
   * Verifica permissão para criar/editar meta
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

    throw new ForbiddenException('Você não tem permissão para gerenciar metas deste usuário');
  }

  /**
   * Cria nova meta
   */
  async create(createGoalDto: CreateGoalDto, currentUserId: string): Promise<GoalResponseDto> {
    const {
      cycleId,
      userId,
      workspaceId,
      type,
      title,
      description,
      startValue,
      targetValue,
      unit,
    } = createGoalDto;

    // Verifica permissão
    await this.checkPermission(currentUserId, userId, workspaceId);

    // Valida se o ciclo existe e pertence ao usuário
    const cycle = await this.prisma.cycle.findFirst({
      where: {
        id: cycleId,
        userId,
        workspaceId,
        deletedAt: null,
      },
    });

    if (!cycle) {
      throw new BadRequestException('Ciclo não encontrado ou não pertence a este usuário');
    }

    // Valida valores baseado no tipo
    if (type === 'INCREASE' && targetValue <= startValue) {
      throw new BadRequestException(
        'Para meta INCREASE, o valor alvo deve ser maior que o valor inicial',
      );
    }
    if (type === 'DECREASE' && targetValue >= startValue) {
      throw new BadRequestException(
        'Para meta DECREASE, o valor alvo deve ser menor que o valor inicial',
      );
    }

    // Cria meta
    const goal = await this.prisma.goal.create({
      data: {
        cycleId,
        userId,
        type,
        title,
        description,
        startValue,
        currentValue: startValue,
        targetValue,
        unit,
        status: GoalStatus.ACTIVE,
      },
    });

    return this.enrichGoal(goal);
  }

  /**
   * Lista todas as metas do usuário no ciclo
   */
  async findAll(
    userId: string,
    workspaceId: string,
    cycleId?: string,
    status?: GoalStatus,
  ): Promise<GoalResponseDto[]> {
    const goals = await this.prisma.goal.findMany({
      where: {
        userId,
        ...(cycleId && { cycleId }),
        ...(status && { status }),
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return goals.map((goal) => this.enrichGoal(goal));
  }

  /**
   * Retorna detalhes de uma meta específica
   */
  async findOne(id: string, currentUserId: string, workspaceId: string): Promise<GoalResponseDto> {
    const goal = await this.prisma.goal.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!goal) {
      throw new NotFoundException(`Meta com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, goal.userId, workspaceId);

    return this.enrichGoal(goal);
  }

  /**
   * Retorna meta com histórico completo de atualizações
   */
  async findOneWithHistory(
    id: string,
    currentUserId: string,
    workspaceId: string,
  ): Promise<GoalWithHistoryDto> {
    const goal = await this.prisma.goal.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        updates: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!goal) {
      throw new NotFoundException(`Meta com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, goal.userId, workspaceId);

    return {
      ...this.enrichGoal(goal),
      updates: goal.updates,
    };
  }

  /**
   * Atualiza meta
   */
  async update(
    id: string,
    updateGoalDto: UpdateGoalDto,
    currentUserId: string,
    workspaceId: string,
  ): Promise<GoalResponseDto> {
    const goal = await this.prisma.goal.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!goal) {
      throw new NotFoundException(`Meta com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, goal.userId, workspaceId);

    const { type, title, description, targetValue, unit, status } = updateGoalDto;

    // Valida valores se tipo ou target estiverem mudando
    const newType = type || goal.type;
    const newTarget = targetValue !== undefined ? targetValue : goal.targetValue || 0;
    const start = goal.startValue || 0;

    if (newType === 'INCREASE' && newTarget <= start) {
      throw new BadRequestException(
        'Para meta INCREASE, o valor alvo deve ser maior que o valor inicial',
      );
    }
    if (newType === 'DECREASE' && newTarget >= start) {
      throw new BadRequestException(
        'Para meta DECREASE, o valor alvo deve ser menor que o valor inicial',
      );
    }

    // Atualiza meta
    const updatedGoal = await this.prisma.goal.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(targetValue !== undefined && { targetValue }),
        ...(unit && { unit }),
        ...(status && { status }),
      },
    });

    return this.enrichGoal(updatedGoal);
  }

  /**
   * Atualiza progresso da meta e registra no histórico
   * Também calcula e adiciona XP baseado no progresso ganho
   */
  async updateProgress(
    id: string,
    updateProgressDto: UpdateGoalProgressDto,
    currentUserId: string,
    workspaceId: string,
  ): Promise<GoalResponseDto> {
    const { newValue, notes } = updateProgressDto;

    const goal = await this.prisma.goal.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!goal) {
      throw new NotFoundException(`Meta com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, goal.userId, workspaceId);

    // Calcula progresso anterior e novo
    const oldProgress = this.calculateProgress(
      goal.type,
      goal.startValue,
      goal.currentValue,
      goal.targetValue,
    );
    const newProgress = this.calculateProgress(
      goal.type,
      goal.startValue,
      newValue,
      goal.targetValue,
    );
    const progressGain = newProgress - oldProgress;

    // Determina novo status baseado no progresso
    let newStatus = goal.status;
    if (newProgress >= 100) {
      newStatus = GoalStatus.COMPLETED;
    } else if (newProgress > 0 && goal.status === GoalStatus.ACTIVE) {
      newStatus = GoalStatus.ACTIVE; // Mantém ativo
    }

    // Calcula XP a ser dado
    const xpReward = progressGain > 0 ? this.calculateXpReward(progressGain) : 0;

    // Atualiza meta e cria registro de update em uma transação
    const [updatedGoal] = await this.prisma.$transaction([
      this.prisma.goal.update({
        where: { id },
        data: {
          currentValue: newValue,
          status: newStatus,
          lastUpdateAt: new Date(),
        },
      }),
      this.prisma.goalUpdate.create({
        data: {
          goalId: id,
          previousValue: goal.currentValue,
          newValue,
          notes,
          xpEarned: xpReward,
        },
      }),
    ]);

    // Adiciona XP se houve progresso
    if (xpReward > 0) {
      // Busca workspace do ciclo
      const cycle = await this.prisma.cycle.findUnique({
        where: { id: goal.cycleId },
        select: { workspaceId: true },
      });

      if (cycle) {
        await this.gamificationService.addXP({
          userId: goal.userId,
          workspaceId: cycle.workspaceId, // ✅ Workspace do ciclo
          xpAmount: xpReward,
          reason: `Meta: ${goal.title} (+${progressGain.toFixed(1)}% progresso)`,
        });
      }
    }

    // 🆕 Cria Activity automaticamente na timeline
    await this.activitiesService.createFromGoalUpdate({
      cycleId: goal.cycleId,
      userId: goal.userId,
      goalId: goal.id,
      goalTitle: goal.title,
      previousValue: goal.currentValue,
      newValue,
      notes,
      xpEarned: xpReward,
    });

    return this.enrichGoal(updatedGoal);
  }

  /**
   * Deleta meta (soft delete)
   */
  async remove(id: string, currentUserId: string, workspaceId: string): Promise<void> {
    const goal = await this.prisma.goal.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!goal) {
      throw new NotFoundException(`Meta com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, goal.userId, workspaceId);

    // Soft delete
    await this.prisma.goal.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
