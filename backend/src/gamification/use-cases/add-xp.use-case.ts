import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GamificationProfileResponseDto } from '../dto/gamification-profile-response.dto';
import { AddXpDto } from '../dto/add-xp.dto';
import { UpdateStreakUseCase } from './update-streak.use-case';
import { CheckBadgesUseCase } from './check-badges.use-case';
import { GetProfileUseCase } from './get-profile.use-case';
import { GamificationCalculatorService } from '../services/gamification-calculator.service';

/**
 * Use Case: Add XP
 * Adiciona XP ao usuário e verifica badges automáticas
 */
@Injectable()
export class AddXpUseCase {
  private readonly logger = new Logger(AddXpUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly updateStreakUseCase: UpdateStreakUseCase,
    private readonly checkBadgesUseCase: CheckBadgesUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly calculator: GamificationCalculatorService,
  ) {}

  async execute(addXpDto: AddXpDto): Promise<GamificationProfileResponseDto> {
    const { userId, workspaceId, xpAmount, reason, source, sourceId } = addXpDto;

    this.logger.log(
      `Adicionando ${xpAmount} XP ao usuário ${userId} no workspace ${workspaceId} (razão: ${reason || 'não especificada'})`,
    );

    const profile = await this.prisma.gamificationProfile.findUnique({
      where: {
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Perfil de gamificação não encontrado para usuário ${userId} no workspace ${workspaceId}`,
      );
    }

    const previousXP = profile.totalXP;
    const previousLevel = profile.level;
    const newTotalXP = profile.totalXP + xpAmount;
    const newLevel = this.calculator.calculateLevel(newTotalXP);
    const leveledUp = newLevel > profile.level;

    // Usar transação para garantir consistência
    await this.prisma.$transaction(async (tx) => {
      // Atualizar perfil de gamificação
      await tx.gamificationProfile.update({
        where: {
          unique_user_workspace_gamification: {
            userId,
            workspaceId,
          },
        },
        data: {
          totalXP: newTotalXP,
          level: newLevel,
          lastActiveAt: new Date(),
        },
      });

      // Registrar transação de XP
      await tx.xpTransaction.create({
        data: {
          gamificationProfileId: profile.id,
          amount: xpAmount,
          source: source || 'MANUAL', // Default para MANUAL se não especificado
          sourceId: sourceId || null,
          reason: reason || 'XP adicionado',
          previousXP,
          newXP: newTotalXP,
          previousLevel,
          newLevel,
          leveledUp,
        },
      });
    });

    if (leveledUp) {
      this.logger.log(`🎉 Usuário ${userId} subiu de nível! Nível ${previousLevel} → ${newLevel}`);
    }

    this.logger.log(
      `✅ XP registrado: ${xpAmount} XP (${previousXP} → ${newTotalXP}) - Transação salva em xp_transactions`,
    );

    // Atualizar streak
    await this.updateStreakUseCase.execute(userId, workspaceId);

    // Verificar e desbloquear badges automáticas
    await this.checkBadgesUseCase.execute(userId, workspaceId);

    // Retornar perfil atualizado
    return this.getProfileUseCase.execute(userId, workspaceId);
  }
}
