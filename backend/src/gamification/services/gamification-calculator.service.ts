import { Injectable } from '@nestjs/common';

/**
 * Gamification Calculator Service
 * Serviço responsável por cálculos relacionados ao sistema de gamificação
 */
@Injectable()
export class GamificationCalculatorService {
  /**
   * Calcula o nível baseado no totalXP
   *
   * Fórmula: level = floor(sqrt(totalXP / 100))
   *
   * @param totalXP - XP total acumulado
   * @returns Nível calculado
   */
  calculateLevel(totalXP: number): number {
    return Math.floor(Math.sqrt(totalXP / 100));
  }

  /**
   * Calcula XP necessário para próximo nível e progresso
   *
   * @param totalXP - XP total do usuário
   * @param currentLevel - Nível atual
   * @returns { currentXP, nextLevelXP, progressToNextLevel }
   */
  calculateProgress(
    totalXP: number,
    currentLevel: number,
  ): { currentXP: number; nextLevelXP: number; progressToNextLevel: number } {
    const nextLevel = currentLevel + 1;
    const xpForNextLevel = Math.pow(nextLevel, 2) * 100;
    const xpForCurrentLevel = Math.pow(currentLevel, 2) * 100;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const xpProgress = totalXP - xpForCurrentLevel;
    const progress = Math.min(100, Math.floor((xpProgress / xpNeeded) * 100));

    return {
      currentXP: xpProgress, // XP no nível atual
      nextLevelXP: xpNeeded, // XP necessário para subir de nível
      progressToNextLevel: progress,
    };
  }

  /**
   * Verifica o status do streak (ativo ou perdido)
   *
   * @param lastActiveAt - Data da última atividade
   * @returns 'active' se <24h, 'lost' se >24h
   */
  checkStreakStatus(lastActiveAt: Date): 'active' | 'lost' {
    const now = new Date();
    const hoursSinceLastActive = (now.getTime() - lastActiveAt.getTime()) / (1000 * 60 * 60);

    return hoursSinceLastActive <= 24 ? 'active' : 'lost';
  }
}
