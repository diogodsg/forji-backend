import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';
import { CycleResponseDto, CycleStatsDto } from './dto/cycle-response.dto';
import { CycleStatus } from '@prisma/client';

@Injectable()
export class CyclesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calcula dias restantes até o fim do ciclo
   */
  private calculateDaysRemaining(endDate: Date): number {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Calcula percentual de progresso do ciclo baseado nas datas
   */
  private calculateCycleProgress(startDate: Date, endDate: Date): number {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 0;
    if (now > end) return 100;

    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    const progress = (elapsed / total) * 100;

    return Math.min(100, Math.max(0, Math.round(progress * 10) / 10));
  }

  /**
   * Enriquece ciclo com dados calculados (daysRemaining, progress)
   */
  private enrichCycle(cycle: any): CycleResponseDto {
    return {
      ...cycle,
      daysRemaining: this.calculateDaysRemaining(cycle.endDate),
      progress: this.calculateCycleProgress(cycle.startDate, cycle.endDate),
    };
  }

  /**
   * Verifica se usuário é gerente do dono do ciclo
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
   * Verifica permissão para criar/editar ciclo
   * Regra: Própria pessoa OU seu gerente
   */
  private async checkPermission(
    currentUserId: string,
    targetUserId: string,
    workspaceId: string,
  ): Promise<void> {
    // Se for a própria pessoa, pode
    if (currentUserId === targetUserId) {
      return;
    }

    // Se for gerente da pessoa, pode
    const isManagerOfUser = await this.isManager(currentUserId, targetUserId, workspaceId);
    if (isManagerOfUser) {
      return;
    }

    throw new ForbiddenException('Você não tem permissão para gerenciar ciclos deste usuário');
  }

  /**
   * Cria novo ciclo de PDI
   */
  async create(createCycleDto: CreateCycleDto, currentUserId: string): Promise<CycleResponseDto> {
    const { name, description, startDate, endDate, userId, workspaceId } = createCycleDto;

    // Verifica permissão (própria pessoa ou gerente)
    await this.checkPermission(currentUserId, userId, workspaceId);

    // Valida datas
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      throw new BadRequestException('Data de fim deve ser posterior à data de início');
    }

    // Verifica se já existe ciclo ACTIVE para este usuário no workspace
    const existingActiveCycle = await this.prisma.cycle.findFirst({
      where: {
        userId,
        workspaceId,
        status: CycleStatus.ACTIVE,
        deletedAt: null,
      },
    });

    if (existingActiveCycle) {
      throw new BadRequestException(
        `Já existe um ciclo ativo para este usuário: "${existingActiveCycle.name}". ` +
          `Finalize-o antes de criar um novo.`,
      );
    }

    // Cria ciclo
    const cycle = await this.prisma.cycle.create({
      data: {
        name,
        description,
        startDate: start,
        endDate: end,
        status: CycleStatus.ACTIVE,
        userId,
        workspaceId,
      },
    });

    return this.enrichCycle(cycle);
  }

  /**
   * Calcula o quarter atual e retorna datas de início e fim
   */
  private getCurrentQuarter(): { startDate: Date; endDate: Date; name: string } {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11

    let quarter: number;
    let startMonth: number;
    let endMonth: number;

    if (month >= 0 && month <= 2) {
      // Q1: Janeiro - Março
      quarter = 1;
      startMonth = 0;
      endMonth = 2;
    } else if (month >= 3 && month <= 5) {
      // Q2: Abril - Junho
      quarter = 2;
      startMonth = 3;
      endMonth = 5;
    } else if (month >= 6 && month <= 8) {
      // Q3: Julho - Setembro
      quarter = 3;
      startMonth = 6;
      endMonth = 8;
    } else {
      // Q4: Outubro - Dezembro
      quarter = 4;
      startMonth = 9;
      endMonth = 11;
    }

    const startDate = new Date(year, startMonth, 1);
    const endDate = new Date(year, endMonth + 1, 0); // Último dia do mês final

    return {
      startDate,
      endDate,
      name: `Q${quarter} ${year} - Desenvolvimento`,
    };
  }

  /**
   * Cria automaticamente um ciclo trimestral para o usuário
   */
  private async createAutomaticQuarterCycle(userId: string, workspaceId: string) {
    const quarter = this.getCurrentQuarter();

    console.log('✨ [CyclesService] Criando ciclo automático para o quarter atual:', quarter.name);

    const cycle = await this.prisma.cycle.create({
      data: {
        name: quarter.name,
        description: 'Ciclo criado automaticamente para acompanhamento de metas e desenvolvimento',
        startDate: quarter.startDate,
        endDate: quarter.endDate,
        status: CycleStatus.ACTIVE,
        userId,
        workspaceId,
      },
    });

    console.log('✅ [CyclesService] Ciclo automático criado:', cycle.id);

    return cycle;
  }

  /**
   * Retorna ciclo ativo do usuário atual
   * Se não existir, cria automaticamente um ciclo para o quarter atual
   */
  async getCurrentCycle(userId: string, workspaceId: string): Promise<CycleResponseDto | null> {
    console.log('🔍 [CyclesService.getCurrentCycle] Query params:', {
      userId,
      workspaceId,
      status: CycleStatus.ACTIVE,
    });

    let cycle = await this.prisma.cycle.findFirst({
      where: {
        userId,
        workspaceId,
        status: CycleStatus.ACTIVE,
        deletedAt: null,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    if (!cycle) {
      console.log('⚠️ [CyclesService.getCurrentCycle] Nenhum ciclo ativo encontrado');

      // Verifica se existe algum ciclo (independente de status)
      const anyCycle = await this.prisma.cycle.findFirst({
        where: {
          userId,
          workspaceId,
          deletedAt: null,
        },
      });

      if (!anyCycle) {
        console.log('🚀 [CyclesService.getCurrentCycle] Criando primeiro ciclo automaticamente...');
        // Primeira vez do usuário - cria ciclo automático
        cycle = await this.createAutomaticQuarterCycle(userId, workspaceId);
      } else {
        console.log('ℹ️ [CyclesService.getCurrentCycle] Usuário tem ciclos mas nenhum ACTIVE');
        return null;
      }
    } else {
      console.log('✅ [CyclesService.getCurrentCycle] Ciclo encontrado:', cycle.id);
    }

    return this.enrichCycle(cycle);
  }

  /**
   * Lista ciclos com paginação e filtros
   */
  async findAll(
    userId: string,
    workspaceId: string,
    status?: CycleStatus,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: CycleResponseDto[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const where = {
      userId,
      workspaceId,
      deletedAt: null,
      ...(status && { status }),
    };

    const [cycles, total] = await Promise.all([
      this.prisma.cycle.findMany({
        where,
        orderBy: {
          startDate: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.cycle.count({ where }),
    ]);

    return {
      data: cycles.map((cycle) => this.enrichCycle(cycle)),
      total,
      page,
      limit,
    };
  }

  /**
   * Retorna detalhes de um ciclo específico
   */
  async findOne(id: string, currentUserId: string, workspaceId: string): Promise<CycleResponseDto> {
    const cycle = await this.prisma.cycle.findFirst({
      where: {
        id,
        workspaceId,
        deletedAt: null,
      },
    });

    if (!cycle) {
      throw new NotFoundException(`Ciclo com ID ${id} não encontrado`);
    }

    // Verifica permissão (própria pessoa ou gerente)
    await this.checkPermission(currentUserId, cycle.userId, workspaceId);

    return this.enrichCycle(cycle);
  }

  /**
   * Atualiza ciclo
   */
  async update(
    id: string,
    updateCycleDto: UpdateCycleDto,
    currentUserId: string,
    workspaceId: string,
  ): Promise<CycleResponseDto> {
    // Busca ciclo existente
    const existingCycle = await this.prisma.cycle.findFirst({
      where: {
        id,
        workspaceId,
        deletedAt: null,
      },
    });

    if (!existingCycle) {
      throw new NotFoundException(`Ciclo com ID ${id} não encontrado`);
    }

    // Verifica permissão (própria pessoa ou gerente)
    await this.checkPermission(currentUserId, existingCycle.userId, workspaceId);

    const { name, description, startDate, endDate, status } = updateCycleDto;

    // Valida datas se ambas forem fornecidas ou atualizadas
    const newStartDate = startDate ? new Date(startDate) : existingCycle.startDate;
    const newEndDate = endDate ? new Date(endDate) : existingCycle.endDate;

    if (newEndDate <= newStartDate) {
      throw new BadRequestException('Data de fim deve ser posterior à data de início');
    }

    // Se estiver mudando para ACTIVE, verifica se já existe outro ciclo ativo
    if (status === CycleStatus.ACTIVE && existingCycle.status !== CycleStatus.ACTIVE) {
      const otherActiveCycle = await this.prisma.cycle.findFirst({
        where: {
          userId: existingCycle.userId,
          workspaceId,
          status: CycleStatus.ACTIVE,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (otherActiveCycle) {
        throw new BadRequestException(
          `Já existe um ciclo ativo para este usuário: "${otherActiveCycle.name}". ` +
            `Finalize-o antes de ativar outro.`,
        );
      }
    }

    // Atualiza ciclo
    const updatedCycle = await this.prisma.cycle.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(startDate && { startDate: newStartDate }),
        ...(endDate && { endDate: newEndDate }),
        ...(status && { status }),
      },
    });

    return this.enrichCycle(updatedCycle);
  }

  /**
   * Deleta ciclo (soft delete)
   */
  async remove(id: string, currentUserId: string, workspaceId: string): Promise<void> {
    const cycle = await this.prisma.cycle.findFirst({
      where: {
        id,
        workspaceId,
        deletedAt: null,
      },
    });

    if (!cycle) {
      throw new NotFoundException(`Ciclo com ID ${id} não encontrado`);
    }

    // Verifica permissão (própria pessoa ou gerente)
    await this.checkPermission(currentUserId, cycle.userId, workspaceId);

    // Soft delete
    await this.prisma.cycle.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Retorna estatísticas completas do ciclo
   */
  async getStats(id: string, currentUserId: string, workspaceId: string): Promise<CycleStatsDto> {
    const cycle = await this.prisma.cycle.findFirst({
      where: {
        id,
        workspaceId,
        deletedAt: null,
      },
    });

    if (!cycle) {
      throw new NotFoundException(`Ciclo com ID ${id} não encontrado`);
    }

    // Verifica permissão (própria pessoa ou gerente)
    await this.checkPermission(currentUserId, cycle.userId, workspaceId);

    // Busca estatísticas em paralelo
    const [goals, competencies, activities] = await Promise.all([
      this.prisma.goal.findMany({
        where: {
          cycleId: id,
          deletedAt: null,
        },
        select: {
          status: true,
          currentValue: true,
          targetValue: true,
          type: true,
        },
      }),
      this.prisma.competency.count({
        where: {
          cycleId: id,
          deletedAt: null,
        },
      }),
      this.prisma.activity.count({
        where: {
          cycleId: id,
          deletedAt: null,
        },
      }),
    ]);

    // Calcula metas completadas
    const completedGoals = goals.filter((g) => g.status === 'COMPLETED').length;

    // Calcula progresso médio das metas
    let totalProgress = 0;
    goals.forEach((goal) => {
      const current = goal.currentValue || 0;
      const target = goal.targetValue || 1;

      let progress = 0;
      if (goal.type === 'INCREASE') {
        progress = Math.min(100, (current / target) * 100);
      } else if (goal.type === 'DECREASE') {
        progress = Math.min(100, Math.max(0, (1 - current / target) * 100));
      } else if (goal.type === 'PERCENTAGE') {
        progress = Math.min(100, current);
      } else if (goal.type === 'BINARY') {
        progress = current >= 1 ? 100 : 0;
      }

      totalProgress += progress;
    });

    const averageGoalProgress = goals.length > 0 ? Math.round(totalProgress / goals.length) : 0;

    return {
      cycleId: cycle.id,
      cycleName: cycle.name,
      totalGoals: goals.length,
      completedGoals,
      totalCompetencies: competencies,
      totalActivities: activities,
      daysRemaining: this.calculateDaysRemaining(cycle.endDate),
      cycleProgress: this.calculateCycleProgress(cycle.startDate, cycle.endDate),
      averageGoalProgress,
    };
  }
}
