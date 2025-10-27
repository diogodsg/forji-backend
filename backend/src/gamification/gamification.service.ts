import { Injectable } from '@nestjs/common';
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
   * Cria perfil de gamificação para um usuário
   * Método público para ser usado durante criação de usuário
   */
  async createProfile(userId: string, workspaceId: string): Promise<void> {
    return this.createProfileUseCase.execute(userId, workspaceId);
  }
}
