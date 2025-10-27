import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GamificationProfileResponseDto } from '../dto/gamification-profile-response.dto';
import { UpdateStreakUseCase } from './update-streak.use-case';
import { GamificationCalculatorService } from '../services/gamification-calculator.service';

/**
 * Use Case: Get Gamification Profile
 * Busca o perfil de gamificação de um usuário com dados calculados
 */
@Injectable()
export class GetProfileUseCase {
  private readonly logger = new Logger(GetProfileUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly updateStreakUseCase: UpdateStreakUseCase,
    private readonly calculator: GamificationCalculatorService,
  ) {}

  async execute(userId: string, workspaceId: string): Promise<GamificationProfileResponseDto> {
    this.logger.log(
      `Buscando perfil de gamificação para usuário ${userId} no workspace ${workspaceId}`,
    );

    const profile = await this.prisma.gamificationProfile.findUnique({
      where: {
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        },
      },
      include: {
        badges: {
          orderBy: { earnedAt: 'desc' },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Perfil de gamificação não encontrado para usuário ${userId} no workspace ${workspaceId}`,
      );
    }

    // Atualizar streak (verificar se perdeu)
    await this.updateStreakUseCase.execute(userId, workspaceId);

    // Recalcular nível baseado em totalXP
    const level = this.calculator.calculateLevel(profile.totalXP);
    const { nextLevelXP, progressToNextLevel, currentXP } = this.calculator.calculateProgress(
      profile.totalXP,
      level,
    );

    // Verificar status do streak
    const streakStatus = this.calculator.checkStreakStatus(profile.lastActiveAt);

    return {
      id: profile.id,
      userId: profile.userId,
      level,
      currentXP, // XP no nível atual (calculado dinamicamente)
      totalXP: profile.totalXP,
      nextLevelXP, // XP necessário para próximo nível
      progressToNextLevel,
      streak: profile.streak,
      streakStatus,
      lastActiveAt: profile.lastActiveAt,
      badges: profile.badges,
      totalBadges: profile.badges.length,
      rank: null, // TODO: Implementar ranking no futuro
    };
  }
}
