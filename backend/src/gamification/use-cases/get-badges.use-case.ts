import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BadgeType } from '@prisma/client';
import { BadgeResponseDto } from '../dto/badge-response.dto';
import { BadgeHelperService } from '../services/badge-helper.service';

/**
 * Use Case: Get Badges
 * Lista todas as badges (conquistadas e não conquistadas)
 */
@Injectable()
export class GetBadgesUseCase {
  private readonly logger = new Logger(GetBadgesUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly badgeHelper: BadgeHelperService,
  ) {}

  async execute(userId: string, workspaceId: string): Promise<BadgeResponseDto[]> {
    this.logger.log(`Listando badges para usuário ${userId} no workspace ${workspaceId}`);

    const profile = await this.prisma.gamificationProfile.findUnique({
      where: {
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        },
      },
      include: {
        badges: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Perfil de gamificação não encontrado para usuário ${userId} no workspace ${workspaceId}`,
      );
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
        name: this.badgeHelper.getBadgeName(type),
        description: this.badgeHelper.getBadgeDescription(type),
        earnedAt: null as any, // Não conquistada
        earned: false,
      }));

    return [...earnedBadges, ...notEarnedBadges];
  }
}
