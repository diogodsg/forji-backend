import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Use Case: Create Gamification Profile
 * Cria perfil de gamificação inicial para um usuário
 */
@Injectable()
export class CreateProfileUseCase {
  private readonly logger = new Logger(CreateProfileUseCase.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, workspaceId: string): Promise<void> {
    this.logger.log(
      `Criando perfil de gamificação para usuário ${userId} no workspace ${workspaceId}`,
    );

    // Verificar se já existe perfil
    const existingProfile = await this.prisma.gamificationProfile.findUnique({
      where: {
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        },
      },
    });

    if (existingProfile) {
      this.logger.log(`Perfil de gamificação já existe para usuário ${userId}`);
      return;
    }

    // Criar perfil inicial
    await this.prisma.gamificationProfile.create({
      data: {
        userId,
        workspaceId,
        totalXP: 0,
        level: 1,
        streak: 0,
        lastActiveAt: new Date(),
      },
    });

    this.logger.log(`✅ Perfil de gamificação criado para usuário ${userId}`);
  }

  /**
   * Cria perfil de gamificação se não existir (upsert)
   */
  async createIfNotExists(userId: string, workspaceId: string): Promise<void> {
    await this.prisma.gamificationProfile.upsert({
      where: {
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        },
      },
      update: {
        // Se existe, apenas atualizar lastActiveAt
        lastActiveAt: new Date(),
      },
      create: {
        userId,
        workspaceId,
        totalXP: 0,
        level: 1,
        streak: 0,
        lastActiveAt: new Date(),
      },
    });

    this.logger.log(`✅ Perfil de gamificação garantido para usuário ${userId}`);
  }
}
