import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Use Case: Update Streak
 * Atualiza o streak do usuário baseado na última atividade
 */
@Injectable()
export class UpdateStreakUseCase {
  private readonly logger = new Logger(UpdateStreakUseCase.name);

  constructor(private readonly prisma: PrismaService) {}

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
  async execute(userId: string, workspaceId: string): Promise<void> {
    const profile = await this.prisma.gamificationProfile.findUnique({
      where: {
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        },
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
          },
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
          },
        },
        data: {
          streak: { increment: 1 },
          lastActiveAt: now,
        },
      });
    }
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
}
