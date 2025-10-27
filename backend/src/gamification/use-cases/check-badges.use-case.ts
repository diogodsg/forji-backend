import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BadgeType } from '@prisma/client';

/**
 * Use Case: Check and Unlock Badges
 * Verifica e desbloqueia badges automaticamente baseado em conquistas
 */
@Injectable()
export class CheckBadgesUseCase {
  private readonly logger = new Logger(CheckBadgesUseCase.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, workspaceId: string): Promise<void> {
    this.logger.log(`Verificando badges para usuário ${userId} no workspace ${workspaceId}`);

    const profile = await this.prisma.gamificationProfile.findUnique({
      where: {
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        },
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
}
