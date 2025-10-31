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
import { ManagementService } from '../management/management.service';
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
    @Inject(forwardRef(() => ManagementService))
    private managementService: ManagementService,
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
  private async enrichGoal(goal: any): Promise<GoalResponseDto> {
    const progress = this.calculateProgress(
      goal.type,
      goal.startValue,
      goal.currentValue,
      goal.targetValue,
    );

    // Verifica se pode atualizar (limite de 1 atualização por semana)
    const lastUpdate = await this.prisma.goalUpdate.findFirst({
      where: {
        goalId: goal.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let canUpdateNow = true;
    let nextUpdateDate: string | undefined;

    if (lastUpdate) {
      const daysSinceLastUpdate = Math.floor(
        (Date.now() - lastUpdate.createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysSinceLastUpdate < 7) {
        canUpdateNow = false;
        const nextDate = new Date(lastUpdate.createdAt);
        nextDate.setDate(nextDate.getDate() + 7);
        nextUpdateDate = nextDate.toISOString();
      }
    }

    return {
      ...goal,
      progress,
      canUpdateNow,
      nextUpdateDate,
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
   * Verifica permissão para criar/editar meta
   * Regra: Própria pessoa OU seu gerente (INDIVIDUAL ou TEAM)
   * Usa a mesma lógica do ManagerGuard
   */
  private async checkPermission(
    currentUserId: string,
    targetUserId: string,
    workspaceId: string,
  ): Promise<void> {
    console.log('🔍 [GoalsService] Verificando permissão:', {
      currentUserId,
      targetUserId,
      workspaceId,
    });

    // Se é a própria pessoa, permite
    if (currentUserId === targetUserId) {
      console.log('✅ [GoalsService] Próprio usuário - permissão concedida');
      return;
    }

    // Verifica se o usuário logado gerencia o targetUserId (INDIVIDUAL ou TEAM)
    const isManaged = await this.managementService.isUserManagedBy(
      targetUserId,
      currentUserId,
      workspaceId,
    );

    console.log('🔍 [GoalsService] Resultado da verificação:', {
      isManaged,
      currentUserId,
      targetUserId,
    });

    if (!isManaged) {
      throw new ForbiddenException('Você não tem permissão para gerenciar metas deste usuário');
    }

    console.log('✅ [GoalsService] Gerente do usuário - permissão concedida');
  }

  /**
   * Cria nova meta
   */
  /**
   * Calcula o XP de uma meta baseado nos critérios de qualidade
   */
  private calculateGoalXP(
    title: string,
    description: string | null,
    type: GoalType,
    startValue: number | null,
    targetValue: number | null,
    unit: string,
  ): number {
    const BASE_XP = 40;
    let total = BASE_XP;

    // Bonus: Descrição detalhada (8 XP)
    if (description && description.length > 100) {
      total += 8;
      console.log('🎯 Bonus XP: Descrição detalhada (+8 XP)');
    }

    // Bonus: Critério bem definido (12 XP)
    let hasGoodCriterion = false;
    if (type === 'INCREASE' || type === 'DECREASE' || type === 'PERCENTAGE') {
      hasGoodCriterion = !!(
        startValue !== undefined &&
        startValue !== null &&
        targetValue !== undefined &&
        targetValue !== null
      );
    } else {
      hasGoodCriterion = true; // Binary sempre tem critério bem definido
    }

    if (hasGoodCriterion) {
      total += 12;
      console.log('🎯 Bonus XP: Critério bem definido (+12 XP)');
    }

    // Bonus: Meta ambiciosa (15 XP) - para increase/decrease
    if (
      (type === 'INCREASE' || type === 'DECREASE') &&
      startValue &&
      targetValue &&
      startValue > 0
    ) {
      const change = Math.abs(((targetValue - startValue) / startValue) * 100);
      if (change >= 50) {
        total += 15;
        console.log(`🎯 Bonus XP: Meta ambiciosa (${change.toFixed(1)}% ≥ 50%) (+15 XP)`);
      }
    }

    // Bonus: Meta ambiciosa (15 XP) - para percentage
    if (type === 'PERCENTAGE' && startValue !== null && targetValue !== null) {
      const improvement = targetValue - startValue;
      if (improvement >= 20) {
        total += 15;
        console.log(`🎯 Bonus XP: Meta ambiciosa (+${improvement}% ≥ +20%) (+15 XP)`);
      }
    }

    console.log(`🎯 XP Total da meta "${title}": ${total} XP`);
    return total;
  }

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

    // Valida limite de metas por ciclo (máximo 5)
    const goalsCount = await this.prisma.goal.count({
      where: {
        cycleId,
        deletedAt: null,
      },
    });

    if (goalsCount >= 5) {
      throw new BadRequestException('O ciclo já atingiu o limite máximo de 5 metas');
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

    // Calcular XP baseado nos critérios de qualidade da meta
    const calculatedXP = this.calculateGoalXP(
      title,
      description || null,
      type,
      startValue,
      targetValue,
      unit,
    );

    // Adicionar XP dinâmico por criar uma meta e detectar level-up
    let xpEarned = 0;
    let leveledUp = false;
    let previousLevel: number | undefined;
    let newLevel: number | undefined;

    try {
      // Buscar nível atual antes de adicionar XP
      const profileBefore = await this.gamificationService.getProfile(userId, workspaceId);
      previousLevel = profileBefore?.level;

      const xpResult = await this.gamificationService.addXP({
        userId,
        workspaceId,
        xpAmount: calculatedXP,
        reason: `Meta criada: "${title}" (${calculatedXP} XP)`,
        sourceId: goal.id, // Link para rastrear XP desta meta
      });

      xpEarned = calculatedXP;

      // Buscar nível atual depois de adicionar XP
      const profileAfter = await this.gamificationService.getProfile(userId, workspaceId);
      newLevel = profileAfter?.level;

      // Detectar level-up
      if (previousLevel && newLevel && newLevel > previousLevel) {
        leveledUp = true;
        console.log(`🆙 LEVEL UP DETECTADO! Meta criada: ${previousLevel} → ${newLevel}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar XP por criar meta:', error);
      // Não falha a criação da meta se XP falhar
    }

    const enrichedGoal = await this.enrichGoal(goal);

    // Adicionar informações de XP se houve ganho
    if (xpEarned > 0) {
      return {
        ...enrichedGoal,
        xpEarned,
        leveledUp,
        previousLevel,
        newLevel,
      };
    }

    return enrichedGoal;
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

    return Promise.all(goals.map((goal) => this.enrichGoal(goal)));
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

    return await this.enrichGoal(goal);
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

    const enrichedGoal = await this.enrichGoal(goal);

    return {
      ...enrichedGoal,
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

    const { type, title, description, targetValue, startValue, currentValue, unit, status } =
      updateGoalDto;

    // Valida valores se tipo, target ou start estiverem mudando
    const newType = type || goal.type;
    const newTarget = targetValue !== undefined ? targetValue : goal.targetValue || 0;
    const newStart = startValue !== undefined ? startValue : goal.startValue || 0;
    const newCurrent = currentValue !== undefined ? currentValue : goal.currentValue || 0;

    if (newType === 'INCREASE' && newTarget <= newStart) {
      throw new BadRequestException(
        'Para meta INCREASE, o valor alvo deve ser maior que o valor inicial',
      );
    }
    if (newType === 'DECREASE' && newTarget >= newStart) {
      throw new BadRequestException(
        'Para meta DECREASE, o valor alvo deve ser menor que o valor inicial',
      );
    }

    // Validações para currentValue se fornecido
    if (currentValue !== undefined) {
      if (newType === 'INCREASE' && newCurrent < newStart) {
        throw new BadRequestException(
          'Para meta INCREASE, o valor atual não pode ser menor que o valor inicial',
        );
      }
      if (newType === 'DECREASE' && newCurrent > newStart) {
        throw new BadRequestException(
          'Para meta DECREASE, o valor atual não pode ser maior que o valor inicial',
        );
      }
      if (newType === 'INCREASE' && newCurrent > newTarget) {
        throw new BadRequestException(
          'Para meta INCREASE, o valor atual não pode ser maior que o valor alvo',
        );
      }
      if (newType === 'DECREASE' && newCurrent < newTarget) {
        throw new BadRequestException(
          'Para meta DECREASE, o valor atual não pode ser menor que o valor alvo',
        );
      }
    }

    // Recalcular status automaticamente se valores foram alterados
    let calculatedStatus = status; // usar status fornecido se houver

    // Se qualquer valor crítico foi alterado, recalcular o status baseado no progresso
    if (targetValue !== undefined || startValue !== undefined || currentValue !== undefined) {
      const finalStart = newStart;
      const finalCurrent = newCurrent;
      const finalTarget = newTarget;

      // Calcular progresso baseado no tipo de meta
      let progress = 0;

      if (newType === 'BINARY') {
        progress = finalCurrent >= finalTarget ? 100 : 0;
      } else if (newType === 'PERCENTAGE') {
        progress = Math.min(100, Math.max(0, finalCurrent));
      } else if (newType === 'INCREASE') {
        if (finalTarget > finalStart) {
          progress = Math.min(
            100,
            Math.max(0, ((finalCurrent - finalStart) / (finalTarget - finalStart)) * 100),
          );
        }
      } else if (newType === 'DECREASE') {
        if (finalStart > finalTarget) {
          progress = Math.min(
            100,
            Math.max(0, ((finalStart - finalCurrent) / (finalStart - finalTarget)) * 100),
          );
        }
      }

      // Definir status baseado no progresso calculado
      calculatedStatus = progress >= 100 ? GoalStatus.COMPLETED : GoalStatus.ACTIVE;
    }

    // Atualiza meta
    const updatedGoal = await this.prisma.goal.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(targetValue !== undefined && { targetValue }),
        ...(startValue !== undefined && { startValue }),
        ...(currentValue !== undefined && { currentValue }),
        ...(unit && { unit }),
        ...(calculatedStatus && { status: calculatedStatus }),
      },
    });

    return await this.enrichGoal(updatedGoal);
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

    // 🆕 Verifica se já houve atualização nos últimos 7 dias
    const lastUpdate = await this.prisma.goalUpdate.findFirst({
      where: {
        goalId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (lastUpdate) {
      const daysSinceLastUpdate = Math.floor(
        (Date.now() - lastUpdate.createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysSinceLastUpdate < 7) {
        const nextDate = new Date(lastUpdate.createdAt);
        nextDate.setDate(nextDate.getDate() + 7);
        throw new BadRequestException(
          `Você já atualizou esta meta recentemente. Próxima atualização disponível em ${nextDate.toLocaleDateString('pt-BR')}.`,
        );
      }
    }

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

    // Adiciona XP se houve progresso e detecta level-up
    let xpEarned = 0;
    let leveledUp = false;
    let previousLevel: number | undefined;
    let newLevel: number | undefined;

    if (xpReward > 0) {
      // Busca workspace do ciclo
      const cycle = await this.prisma.cycle.findUnique({
        where: { id: goal.cycleId },
        select: { workspaceId: true },
      });

      if (cycle) {
        try {
          // Buscar nível atual antes de adicionar XP
          const profileBefore = await this.gamificationService.getProfile(
            goal.userId,
            cycle.workspaceId,
          );
          previousLevel = profileBefore?.level;

          await this.gamificationService.addXP({
            userId: goal.userId,
            workspaceId: cycle.workspaceId,
            xpAmount: xpReward,
            reason: `Meta: ${goal.title} (+${progressGain.toFixed(1)}% progresso)`,
            sourceId: goal.id, // Link para rastrear XP desta meta
          });

          xpEarned = xpReward;

          // Buscar nível atual depois de adicionar XP
          const profileAfter = await this.gamificationService.getProfile(
            goal.userId,
            cycle.workspaceId,
          );
          newLevel = profileAfter?.level;

          // Detectar level-up
          if (previousLevel && newLevel && newLevel > previousLevel) {
            leveledUp = true;
            console.log(`🆙 LEVEL UP DETECTADO! Progresso da meta: ${previousLevel} → ${newLevel}`);
          }
        } catch (error) {
          console.error('Erro ao adicionar XP por progresso da meta:', error);
        }
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

    const enrichedGoal = await this.enrichGoal(updatedGoal);

    // Adicionar informações de XP se houve ganho
    if (xpEarned > 0) {
      return {
        ...enrichedGoal,
        xpReward: xpEarned,
        xpEarned,
        leveledUp,
        previousLevel,
        newLevel,
      };
    }

    return enrichedGoal;
  }

  /**
   * Deleta meta (soft delete)
   */
  async remove(
    id: string,
    currentUserId: string,
    workspaceId: string,
  ): Promise<{ xpReverted: number; profile: any }> {
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

    // Buscar todas as transações de XP associadas a esta meta pelo sourceId
    const xpTransactions = await this.prisma.xpTransaction.findMany({
      where: {
        sourceId: id,
      },
      select: {
        amount: true,
      },
    });

    console.log(`🔍 Buscando XP para meta ${id}: encontradas ${xpTransactions.length} transações`);

    // Calcular total de XP para reverter
    const totalXpToRemove = xpTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    console.log(`💰 Total de XP a remover: ${totalXpToRemove} XP`);

    let profile = null;

    // Remover XP do usuário se houver XP associado
    if (totalXpToRemove > 0) {
      try {
        profile = await this.gamificationService.subtractXP({
          userId: goal.userId,
          workspaceId,
          xpAmount: totalXpToRemove,
          reason: `Meta excluída: "${goal.title}" (remoção de ${totalXpToRemove} XP)`,
        });

        console.log(
          `✅ XP revertido: ${totalXpToRemove} XP removido por exclusão da meta "${goal.title}"`,
        );
      } catch (error) {
        console.error('Erro ao remover XP por exclusão de meta:', error);
        // Continue com a exclusão mesmo se XP falhar
      }
    }

    // Soft delete
    await this.prisma.goal.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      xpReverted: totalXpToRemove,
      profile,
    };
  }
}
