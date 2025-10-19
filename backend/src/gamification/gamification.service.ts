import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeType } from '@prisma/client';
import { GamificationProfileResponseDto } from './dto/gamification-profile-response.dto';
import { BadgeResponseDto } from './dto/badge-response.dto';
import { AddXpDto } from './dto/add-xp.dto';

/**
 * GamificationService
 *
 * Serviço responsável por gerenciar o sistema de gamificação:
 * - Cálculo de níveis e XP
 * - Sistema de streaks
 * - Desbloqueio automático de badges
 * - Profile de gamificação
 */
@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca o perfil de gamificação de um usuário
   *
   * @param userId - ID do usuário
   * @param workspaceId - ID do workspace
   * @returns Perfil de gamificação completo com badges
   */
  async getProfile(userId: string, workspaceId: string): Promise<GamificationProfileResponseDto> {
    this.logger.log(`Buscando perfil de gamificação para usuário ${userId} no workspace ${workspaceId}`);

    const profile = await this.prisma.gamificationProfile.findUnique({
      where: { 
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        }
      },
      include: {
        badges: {
          orderBy: { earnedAt: 'desc' },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(`Perfil de gamificação não encontrado para usuário ${userId} no workspace ${workspaceId}`);
    }

    // Atualizar streak (verificar se perdeu)
    await this.updateStreak(userId, workspaceId);

    // Recalcular nível baseado em totalXP
    const level = this.calculateLevel(profile.totalXP);
    const { nextLevelXP, progressToNextLevel } = this.calculateProgress(profile.totalXP, level);

    // Verificar status do streak
    const streakStatus = this.checkStreakStatus(profile.lastActiveAt);

    return {
      id: profile.id,
      userId: profile.userId,
      level,
      currentXP: profile.currentXP,
      totalXP: profile.totalXP,
      nextLevelXP,
      progressToNextLevel,
      streak: profile.streak,
      streakStatus,
      lastActiveAt: profile.lastActiveAt,
      badges: profile.badges,
      totalBadges: profile.badges.length,
      rank: null, // TODO: Implementar ranking no futuro
    };
  }

  /**
   * Lista todas as badges (conquistadas e não conquistadas)
   *
   * @param userId - ID do usuário
   * @param workspaceId - ID do workspace
   * @returns Array de badges com status de conquista
   */
  async getBadges(userId: string, workspaceId: string): Promise<BadgeResponseDto[]> {
    this.logger.log(`Listando badges para usuário ${userId} no workspace ${workspaceId}`);

    const profile = await this.prisma.gamificationProfile.findUnique({
      where: { 
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        }
      },
      include: {
        badges: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(`Perfil de gamificação não encontrado para usuário ${userId} no workspace ${workspaceId}`);
    }

    // Badges disponíveis no sistema
    const allBadgeTypes = Object.values(BadgeType);
    const earnedBadgeTypes = new Set(profile.badges.map((b) => b.type));

    // Mapear badges conquistadas
    const earnedBadges: BadgeResponseDto[] = profile.badges.map((badge) => ({
      id: badge.id,
      type: badge.type,
      name: badge.name,
      description: badge.description,
      earnedAt: badge.earnedAt,
      earned: true,
    }));

    // Mapear badges não conquistadas (para UI mostrar como "locked")
    const notEarnedBadges: BadgeResponseDto[] = allBadgeTypes
      .filter((type) => !earnedBadgeTypes.has(type))
      .map((type) => ({
        id: `not-earned-${type}`,
        type,
        name: this.getBadgeName(type),
        description: this.getBadgeDescription(type),
        earnedAt: null as any, // Não conquistada
        earned: false,
      }));

    return [...earnedBadges, ...notEarnedBadges];
  }

  /**
   * Adiciona XP ao usuário e verifica badges automáticas
   *
   * @param addXpDto - Dados para adicionar XP
   * @returns Perfil atualizado
   */
  async addXP(addXpDto: AddXpDto): Promise<GamificationProfileResponseDto> {
    const { userId, workspaceId, xpAmount, reason } = addXpDto;

    this.logger.log(
      `Adicionando ${xpAmount} XP ao usuário ${userId} no workspace ${workspaceId} (razão: ${reason || 'não especificada'})`,
    );

    const profile = await this.prisma.gamificationProfile.findUnique({
      where: { 
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        }
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Perfil de gamificação não encontrado para usuário ${userId} no workspace ${workspaceId}`
      );
    }

    const newTotalXP = profile.totalXP + xpAmount;
    const newLevel = this.calculateLevel(newTotalXP);
    const leveledUp = newLevel > profile.level;

    // Se subiu de nível, resetar currentXP
    const newCurrentXP = leveledUp ? 0 : profile.currentXP + xpAmount;

    // Atualizar perfil
    const updatedProfile = await this.prisma.gamificationProfile.update({
      where: { 
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        }
      },
      data: {
        totalXP: newTotalXP,
        currentXP: newCurrentXP,
        level: newLevel,
        lastActiveAt: new Date(),
      },
    });

    if (leveledUp) {
      this.logger.log(`🎉 Usuário ${userId} subiu de nível! Nível ${profile.level} → ${newLevel}`);
    }

    // Atualizar streak
    await this.updateStreak(userId, workspaceId);

    // Verificar e desbloquear badges automáticas
    await this.checkAndUnlockBadges(userId, workspaceId);

    // Retornar perfil atualizado
    return this.getProfile(userId, workspaceId);
  }

  /**
   * Atualiza o streak do usuário
   *
   * Lógica:
   * - Se última atividade foi há menos de 24h: mantém streak
   * - Se última atividade foi há mais de 24h: reseta streak para 1
   * - Se atividade é hoje (mesmo dia): mantém streak
   *
   * @param userId - ID do usuário
   * @param workspaceId - ID do workspace
   */
  async updateStreak(userId: string, workspaceId: string): Promise<void> {
    const profile = await this.prisma.gamificationProfile.findUnique({
      where: { 
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        }
      },
    });

    if (!profile) return;

    const now = new Date();
    const lastActive = new Date(profile.lastActiveAt);
    const hoursSinceLastActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

    // Se última atividade foi há mais de 24h, resetar streak
    if (hoursSinceLastActive > 24) {
      this.logger.log(`Resetando streak do usuário ${userId} (>24h inativo)`);
      await this.prisma.gamificationProfile.update({
        where: { 
          unique_user_workspace_gamification: {
            userId,
            workspaceId,
          }
        },
        data: {
          streak: 1,
          lastActiveAt: now,
        },
      });
    }
    // Se última atividade foi hoje (mesmo dia), mantém streak
    else if (this.isSameDay(lastActive, now)) {
      // Não faz nada, mantém streak
    }
    // Se última atividade foi ontem, incrementa streak
    else if (hoursSinceLastActive <= 24) {
      this.logger.log(`Incrementando streak do usuário ${userId}`);
      await this.prisma.gamificationProfile.update({
        where: { 
          unique_user_workspace_gamification: {
            userId,
            workspaceId,
          }
        },
        data: {
          streak: { increment: 1 },
          lastActiveAt: now,
        },
      });
    }
  }

  /**
   * Verifica e desbloqueia badges automaticamente baseado em conquistas
   *
   * @param userId - ID do usuário
   * @param workspaceId - ID do workspace
   */
  async checkAndUnlockBadges(userId: string, workspaceId: string): Promise<void> {
    this.logger.log(`Verificando badges para usuário ${userId} no workspace ${workspaceId}`);

    const profile = await this.prisma.gamificationProfile.findUnique({
      where: { 
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        }
      },
      include: {
        badges: true,
        user: {
          include: {
            goals: {
              where: {
                status: 'COMPLETED',
                deletedAt: null,
              },
            },
            activities: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    if (!profile) return;

    const earnedBadgeTypes = new Set(profile.badges.map((b) => b.type));
    const newBadges: Array<{
      type: BadgeType;
      name: string;
      description: string;
    }> = [];

    // STREAK_7: 7 dias consecutivos
    if (profile.streak >= 7 && !earnedBadgeTypes.has(BadgeType.STREAK_7)) {
      newBadges.push({
        type: BadgeType.STREAK_7,
        name: '7 Dias de Fogo 🔥',
        description: 'Manteve streak de 7 dias consecutivos',
      });
    }

    // STREAK_30: 30 dias consecutivos
    if (profile.streak >= 30 && !earnedBadgeTypes.has(BadgeType.STREAK_30)) {
      newBadges.push({
        type: BadgeType.STREAK_30,
        name: '30 Dias de Chama 🔥🔥',
        description: 'Manteve streak de 30 dias consecutivos',
      });
    }

    // STREAK_100: 100 dias consecutivos
    if (profile.streak >= 100 && !earnedBadgeTypes.has(BadgeType.STREAK_100)) {
      newBadges.push({
        type: BadgeType.STREAK_100,
        name: '100 Dias Imparável 🔥🔥🔥',
        description: 'Manteve streak de 100 dias consecutivos',
      });
    }

    // GOAL_MASTER: 10 metas completadas
    const completedGoals = profile.user.goals.length;
    if (completedGoals >= 10 && !earnedBadgeTypes.has(BadgeType.GOAL_MASTER)) {
      newBadges.push({
        type: BadgeType.GOAL_MASTER,
        name: 'Mestre das Metas 🎯',
        description: 'Completou 10 metas',
      });
    }

    // MENTOR: 5 mentorias realizadas
    const mentoringSessions = profile.user.activities.filter((a) => a.type === 'MENTORING').length;
    if (mentoringSessions >= 5 && !earnedBadgeTypes.has(BadgeType.MENTOR)) {
      newBadges.push({
        type: BadgeType.MENTOR,
        name: 'Mentor Dedicado 🎓',
        description: 'Realizou 5 sessões de mentoria',
      });
    }

    // CERTIFIED: 3 certificações obtidas
    const certifications = profile.user.activities.filter((a) => a.type === 'CERTIFICATION').length;
    if (certifications >= 3 && !earnedBadgeTypes.has(BadgeType.CERTIFIED)) {
      newBadges.push({
        type: BadgeType.CERTIFIED,
        name: 'Certificado 📜',
        description: 'Obteve 3 certificações',
      });
    }

    // TEAM_PLAYER: 10 reuniões 1:1
    const oneOnOnes = profile.user.activities.filter((a) => a.type === 'ONE_ON_ONE').length;
    if (oneOnOnes >= 10 && !earnedBadgeTypes.has(BadgeType.TEAM_PLAYER)) {
      newBadges.push({
        type: BadgeType.TEAM_PLAYER,
        name: 'Jogador de Equipe 🤝',
        description: 'Realizou 10 reuniões 1:1',
      });
    }

    // Criar badges desbloqueadas
    if (newBadges.length > 0) {
      await this.prisma.badge.createMany({
        data: newBadges.map((badge) => ({
          gamificationProfileId: profile.id,
          type: badge.type,
          name: badge.name,
          description: badge.description,
        })),
      });

      this.logger.log(
        `🏆 ${newBadges.length} nova(s) badge(s) desbloqueada(s) para usuário ${userId}: ${newBadges.map((b) => b.type).join(', ')}`,
      );
    }
  }

  /**
   * Calcula o nível baseado no totalXP
   *
   * Fórmula: level = floor(sqrt(totalXP / 100))
   *
   * @param totalXP - XP total acumulado
   * @returns Nível calculado
   */
  private calculateLevel(totalXP: number): number {
    return Math.floor(Math.sqrt(totalXP / 100));
  }

  /**
   * Calcula XP necessário para próximo nível e progresso
   *
   * @param totalXP - XP total do usuário
   * @param currentLevel - Nível atual
   * @returns { nextLevelXP, progressToNextLevel }
   */
  private calculateProgress(
    totalXP: number,
    currentLevel: number,
  ): { nextLevelXP: number; progressToNextLevel: number } {
    const nextLevel = currentLevel + 1;
    const xpForNextLevel = Math.pow(nextLevel, 2) * 100;
    const xpForCurrentLevel = Math.pow(currentLevel, 2) * 100;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const xpProgress = totalXP - xpForCurrentLevel;
    const progress = Math.min(100, Math.floor((xpProgress / xpNeeded) * 100));

    return {
      nextLevelXP: xpNeeded,
      progressToNextLevel: progress,
    };
  }

  /**
   * Verifica o status do streak (ativo ou perdido)
   *
   * @param lastActiveAt - Data da última atividade
   * @returns 'active' se <24h, 'lost' se >24h
   */
  private checkStreakStatus(lastActiveAt: Date): 'active' | 'lost' {
    const now = new Date();
    const hoursSinceLastActive = (now.getTime() - lastActiveAt.getTime()) / (1000 * 60 * 60);

    return hoursSinceLastActive <= 24 ? 'active' : 'lost';
  }

  /**
   * Verifica se duas datas são do mesmo dia
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Retorna nome amigável da badge
   */
  private getBadgeName(type: BadgeType): string {
    const names: Record<BadgeType, string> = {
      STREAK_7: '7 Dias de Fogo 🔥',
      STREAK_30: '30 Dias de Chama 🔥🔥',
      STREAK_100: '100 Dias Imparável 🔥🔥🔥',
      GOAL_MASTER: 'Mestre das Metas 🎯',
      MENTOR: 'Mentor Dedicado 🎓',
      CERTIFIED: 'Certificado 📜',
      TEAM_PLAYER: 'Jogador de Equipe 🤝',
      FAST_LEARNER: 'Aprendiz Rápido 🚀',
      CONSISTENT: 'Consistente ⭐',
    };
    return names[type] || type;
  }

  /**
   * Retorna descrição da badge
   */
  private getBadgeDescription(type: BadgeType): string {
    const descriptions: Record<BadgeType, string> = {
      STREAK_7: 'Manteve streak de 7 dias consecutivos',
      STREAK_30: 'Manteve streak de 30 dias consecutivos',
      STREAK_100: 'Manteve streak de 100 dias consecutivos',
      GOAL_MASTER: 'Completou 10 metas',
      MENTOR: 'Realizou 5 sessões de mentoria',
      CERTIFIED: 'Obteve 3 certificações',
      TEAM_PLAYER: 'Realizou 10 reuniões 1:1',
      FAST_LEARNER: 'Subiu 3 níveis em uma competência',
      CONSISTENT: 'Atualizou metas por 30 dias seguidos',
    };
    return descriptions[type] || '';
  }
}
