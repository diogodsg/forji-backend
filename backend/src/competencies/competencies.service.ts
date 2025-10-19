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
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';
import { UpdateCompetencyProgressDto } from './dto/update-competency-progress.dto';
import {
  CompetencyResponseDto,
  CompetencyWithHistoryDto,
  PredefinedCompetencyDto,
} from './dto/competency-response.dto';
import { CompetencyCategory } from '@prisma/client';

// Biblioteca de competências predefinidas
const PREDEFINED_COMPETENCIES: PredefinedCompetencyDto[] = [
  // Technical
  {
    name: 'React & TypeScript',
    description: 'Desenvolvimento de aplicações web modernas com React e TypeScript',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'Vue.js',
    description: 'Framework progressivo para construção de interfaces',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'Angular',
    description: 'Framework completo para aplicações web enterprise',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'CSS/TailwindCSS',
    description: 'Estilização avançada e design responsivo',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'Node.js & NestJS',
    description: 'Desenvolvimento backend escalável com Node.js',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'Python & Django',
    description: 'Desenvolvimento backend com Python',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'API REST & GraphQL',
    description: 'Design e implementação de APIs',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'Microservices',
    description: 'Arquitetura de microserviços',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'SQL & PostgreSQL',
    description: 'Banco de dados relacional e otimização de queries',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'MongoDB & NoSQL',
    description: 'Banco de dados não-relacional',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'Redis & Caching',
    description: 'Estratégias de cache e performance',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'Docker & Kubernetes',
    description: 'Containerização e orquestração',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'CI/CD',
    description: 'Integração e deploy contínuo',
    category: CompetencyCategory.TECHNICAL,
  },
  {
    name: 'AWS/Azure/GCP',
    description: 'Cloud computing e infraestrutura',
    category: CompetencyCategory.TECHNICAL,
  },

  // Leadership
  {
    name: 'Liderança Técnica',
    description: 'Liderança de times e projetos técnicos',
    category: CompetencyCategory.LEADERSHIP,
  },
  {
    name: 'Gestão de Pessoas',
    description: 'Desenvolvimento e gestão de equipes',
    category: CompetencyCategory.LEADERSHIP,
  },
  {
    name: 'Tomada de Decisão',
    description: 'Decisões estratégicas e técnicas',
    category: CompetencyCategory.LEADERSHIP,
  },

  // Behavioral
  {
    name: 'Comunicação',
    description: 'Comunicação efetiva com stakeholders',
    category: CompetencyCategory.BEHAVIORAL,
  },
  {
    name: 'Mentoria',
    description: 'Orientação e desenvolvimento de outros desenvolvedores',
    category: CompetencyCategory.BEHAVIORAL,
  },
  {
    name: 'Gestão de Tempo',
    description: 'Priorização e organização de tarefas',
    category: CompetencyCategory.BEHAVIORAL,
  },
  {
    name: 'Trabalho em Equipe',
    description: 'Colaboração e sinergia com o time',
    category: CompetencyCategory.BEHAVIORAL,
  },
];

@Injectable()
export class CompetenciesService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
    @Inject(forwardRef(() => ActivitiesService))
    private activitiesService: ActivitiesService,
  ) {}

  /**
   * Calcula progresso geral até o nível alvo
   * Exemplo: Nível 2 (75%) → Nível 4 = 62.5% do total
   */
  private calculateOverallProgress(
    currentLevel: number,
    currentProgress: number,
    targetLevel: number,
  ): number {
    // Total de níveis a percorrer
    const totalLevels = targetLevel - 1; // Começamos do nível 1

    // Níveis completos (currentLevel - 1)
    const completedLevels = currentLevel - 1;

    // Progresso do nível atual em decimal (ex: 75% = 0.75)
    const currentLevelProgress = currentProgress / 100;

    // Progresso total = (níveis completos + progresso atual) / total de níveis
    const overall = ((completedLevels + currentLevelProgress) / totalLevels) * 100;

    return Math.min(100, Math.max(0, Math.round(overall * 10) / 10));
  }

  /**
   * Enriquece competência com progresso geral calculado
   */
  private enrichCompetency(competency: any): CompetencyResponseDto {
    const overallProgress = this.calculateOverallProgress(
      competency.currentLevel,
      competency.currentProgress,
      competency.targetLevel,
    );

    return {
      ...competency,
      overallProgress,
    };
  }

  /**
   * Calcula XP baseado no nível atingido
   * Fórmula: nível * 100 XP
   */
  private calculateLevelUpXP(newLevel: number): number {
    return newLevel * 100; // Level 2 = 200 XP, Level 3 = 300 XP, etc.
  }

  /**
   * Verifica se usuário é gerente do dono da competência
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
   * Verifica permissão para criar/editar competência
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

    throw new ForbiddenException(
      'Você não tem permissão para gerenciar competências deste usuário',
    );
  }

  /**
   * Retorna biblioteca de competências predefinidas
   */
  async getPredefinedCompetencies(
    category?: CompetencyCategory,
  ): Promise<PredefinedCompetencyDto[]> {
    if (category) {
      return PREDEFINED_COMPETENCIES.filter((c) => c.category === category);
    }
    return PREDEFINED_COMPETENCIES;
  }

  /**
   * Cria nova competência
   */
  async create(
    createCompetencyDto: CreateCompetencyDto,
    currentUserId: string,
  ): Promise<CompetencyResponseDto> {
    const { cycleId, userId, name, category, currentLevel, targetLevel } = createCompetencyDto;

    // Verifica permissão
    await this.checkPermission(currentUserId, userId, 'workspace'); // workspaceId será validado pelo ciclo

    // Valida níveis
    if (targetLevel <= currentLevel) {
      throw new BadRequestException('Nível alvo deve ser maior que o nível atual');
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

    // Cria competência
    const competency = await this.prisma.competency.create({
      data: {
        cycleId,
        userId,
        name,
        category,
        currentLevel,
        targetLevel,
        currentProgress: 0, // Começa com 0% no nível atual
      },
    });

    return this.enrichCompetency(competency);
  }

  /**
   * Lista todas as competências do usuário
   */
  async findAll(
    userId: string,
    workspaceId: string,
    cycleId?: string,
    category?: CompetencyCategory,
  ): Promise<CompetencyResponseDto[]> {
    const competencies = await this.prisma.competency.findMany({
      where: {
        userId,
        ...(cycleId && { cycleId }),
        ...(category && { category }),
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return competencies.map((comp) => this.enrichCompetency(comp));
  }

  /**
   * Retorna detalhes de uma competência específica
   */
  async findOne(
    id: string,
    currentUserId: string,
    workspaceId: string,
  ): Promise<CompetencyResponseDto> {
    const competency = await this.prisma.competency.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!competency) {
      throw new NotFoundException(`Competência com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, competency.userId, workspaceId);

    return this.enrichCompetency(competency);
  }

  /**
   * Retorna competência com histórico completo
   */
  async findOneWithHistory(
    id: string,
    currentUserId: string,
    workspaceId: string,
  ): Promise<CompetencyWithHistoryDto> {
    const competency = await this.prisma.competency.findFirst({
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

    if (!competency) {
      throw new NotFoundException(`Competência com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, competency.userId, workspaceId);

    return {
      ...this.enrichCompetency(competency),
      updates: competency.updates,
    };
  }

  /**
   * Atualiza competência
   */
  async update(
    id: string,
    updateCompetencyDto: UpdateCompetencyDto,
    currentUserId: string,
    workspaceId: string,
  ): Promise<CompetencyResponseDto> {
    const competency = await this.prisma.competency.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!competency) {
      throw new NotFoundException(`Competência com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, competency.userId, workspaceId);

    const { name, category, targetLevel } = updateCompetencyDto;

    // Valida target level se fornecido
    if (targetLevel !== undefined && targetLevel <= competency.currentLevel) {
      throw new BadRequestException('Nível alvo deve ser maior que o nível atual');
    }

    // Atualiza competência
    const updatedCompetency = await this.prisma.competency.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(targetLevel !== undefined && { targetLevel }),
      },
    });

    return this.enrichCompetency(updatedCompetency);
  }

  /**
   * Atualiza progresso da competência
   * Quando atinge 100%, sobe de nível automaticamente e ganha XP
   */
  async updateProgress(
    id: string,
    updateProgressDto: UpdateCompetencyProgressDto,
    currentUserId: string,
    workspaceId: string,
  ): Promise<CompetencyResponseDto> {
    const { progressPercentage, notes } = updateProgressDto;

    const competency = await this.prisma.competency.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!competency) {
      throw new NotFoundException(`Competência com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, competency.userId, workspaceId);

    const previousLevel = competency.currentLevel;
    const previousProgress = competency.currentProgress;

    let newLevel = previousLevel;
    let newProgress = progressPercentage;
    let xpEarned = 0;

    // Se atingiu 100%, sobe de nível
    if (progressPercentage >= 100 && newLevel < competency.targetLevel) {
      newLevel = previousLevel + 1;
      newProgress = 0; // Reseta progresso no novo nível
      xpEarned = this.calculateLevelUpXP(newLevel);

      // Se atingiu o nível alvo, mantém 100%
      if (newLevel >= competency.targetLevel) {
        newProgress = 100;
      }
    }

    // Atualiza competência e cria registro em uma transação
    const [updatedCompetency] = await this.prisma.$transaction([
      this.prisma.competency.update({
        where: { id },
        data: {
          currentLevel: newLevel,
          currentProgress: newProgress,
          totalXP: { increment: xpEarned },
        },
      }),
      this.prisma.competencyUpdate.create({
        data: {
          competencyId: id,
          previousProgress,
          newProgress,
          notes,
          xpEarned,
        },
      }),
    ]);

    // Adiciona XP ao usuário se subiu de nível
    if (xpEarned > 0) {
      // Busca workspace do ciclo
      const cycle = await this.prisma.cycle.findUnique({
        where: { id: competency.cycleId },
        select: { workspaceId: true },
      });

      if (cycle) {
        await this.gamificationService.addXP({
          userId: competency.userId,
          workspaceId: cycle.workspaceId, // ✅ Workspace do ciclo
          xpAmount: xpEarned,
          reason: `Competência: ${competency.name} (Nível ${newLevel})`,
        });
      }
    }

    // 🆕 Cria Activity automaticamente na timeline
    await this.activitiesService.createFromCompetencyUpdate({
      cycleId: competency.cycleId,
      userId: competency.userId,
      competencyId: competency.id,
      competencyName: competency.name,
      previousLevel,
      newLevel,
      previousProgress,
      newProgress,
      notes,
      xpEarned,
    });

    return this.enrichCompetency(updatedCompetency);
  }

  /**
   * Deleta competência (soft delete)
   */
  async remove(id: string, currentUserId: string, workspaceId: string): Promise<void> {
    const competency = await this.prisma.competency.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!competency) {
      throw new NotFoundException(`Competência com ID ${id} não encontrada`);
    }

    // Verifica permissão
    await this.checkPermission(currentUserId, competency.userId, workspaceId);

    // Soft delete
    await this.prisma.competency.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
