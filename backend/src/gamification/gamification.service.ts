import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationProfileResponseDto } from './dto/gamification-profile-response.dto';
import { BadgeResponseDto } from './dto/badge-response.dto';
import { AddXpDto } from './dto/add-xp.dto';
import {
  GetProfileUseCase,
  GetBadgesUseCase,
  AddXpUseCase,
  CreateProfileUseCase,
} from './use-cases';

/**
 * GamificationService - Refactored
 * Facade pattern that delegates to use cases
 */
@Injectable()
export class GamificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly getBadgesUseCase: GetBadgesUseCase,
    private readonly addXpUseCase: AddXpUseCase,
    private readonly createProfileUseCase: CreateProfileUseCase,
  ) {}

  /**
   * Busca o perfil de gamificação de um usuário
   */
  async getProfile(userId: string, workspaceId: string): Promise<GamificationProfileResponseDto> {
    // Garantir que o perfil existe antes de buscar
    await this.createProfileUseCase.createIfNotExists(userId, workspaceId);
    return this.getProfileUseCase.execute(userId, workspaceId);
  }

  /**
   * Lista todas as badges (conquistadas e não conquistadas)
   */
  async getBadges(userId: string, workspaceId: string): Promise<BadgeResponseDto[]> {
    // Garantir que o perfil existe antes de buscar badges
    await this.createProfileUseCase.createIfNotExists(userId, workspaceId);
    return this.getBadgesUseCase.execute(userId, workspaceId);
  }

  /**
   * Adiciona XP ao usuário e verifica badges automáticas
   */
  async addXP(addXpDto: AddXpDto): Promise<GamificationProfileResponseDto> {
    // Garantir que o perfil existe antes de adicionar XP
    await this.createProfileUseCase.createIfNotExists(addXpDto.userId, addXpDto.workspaceId);
    return this.addXpUseCase.execute(addXpDto);
  }

  /**
   * Subtrai XP do perfil (usado para reverter ações deletadas)
   */
  async subtractXP(subtractXpDto: {
    userId: string;
    workspaceId: string;
    xpAmount: number;
    reason: string;
  }): Promise<GamificationProfileResponseDto> {
    const { userId, workspaceId, xpAmount, reason } = subtractXpDto;

    const profile = await this.prisma.gamificationProfile.findUnique({
      where: {
        unique_user_workspace_gamification: {
          userId,
          workspaceId,
        },
      },
    });

    if (!profile) {
      throw new Error(`Perfil de gamificação não encontrado para o usuário ${userId}`);
    }

    const previousXP = profile.totalXP;
    const previousLevel = profile.level;

    // Calcular novo XP (não pode ser negativo)
    const newTotalXP = Math.max(0, profile.totalXP - xpAmount);
    const newCurrentXP = Math.max(0, profile.currentXP - xpAmount);

    // Recalcular nível baseado no novo totalXP (1000 XP por nível)
    const newLevel = Math.floor(newTotalXP / 1000) + 1;

    // Atualizar perfil
    await this.prisma.gamificationProfile.update({
      where: { id: profile.id },
      data: {
        currentXP: newCurrentXP,
        totalXP: newTotalXP,
        level: newLevel,
      },
    });

    console.log(
      `✅ Subtraído ${xpAmount} XP de ${userId}: ${previousXP} → ${newTotalXP} (Level ${previousLevel} → ${newLevel})`,
    );

    // Retornar perfil atualizado usando o GetProfileUseCase
    return this.getProfileUseCase.execute(userId, workspaceId);
  }

  /**
   * Cria perfil de gamificação para um usuário
   * Método público para ser usado durante criação de usuário
   */
  async createProfile(userId: string, workspaceId: string): Promise<void> {
    return this.createProfileUseCase.execute(userId, workspaceId);
  }
}
