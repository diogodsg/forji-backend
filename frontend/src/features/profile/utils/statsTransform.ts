import type { ProfileStats } from "../types/profile";
import type { OrganizedProfileStats } from "../types/profileStats";

/**
 * Calcula o progresso do nível de forma segura
 * @param current - XP atual no nível
 * @param required - XP necessário para próximo nível
 * @returns Porcentagem clamped entre 0 e 100
 */
function calculateLevelProgress(current: number, required: number): number {
  if (required <= 0) return 0;
  const percentage = Math.round((current / required) * 100);
  return Math.min(Math.max(percentage, 0), 100); // Clamp entre 0-100%
}

/**
 * Debug helper - Explica o sistema de progresso de XP
 * @param totalXP - XP total acumulado
 * @param level - Nível atual
 * @param currentXP - XP no nível atual
 * @param requiredXP - XP necessário para próximo nível
 */
export function debugXPSystem(
  totalXP: number,
  level: number,
  currentXP: number,
  requiredXP: number
) {
  console.log("🎮 Sistema de XP - Debug Info:");
  console.log(`Total XP: ${totalXP.toLocaleString()}`);
  console.log(`Level: ${level}`);
  console.log(`XP no nível atual: ${currentXP.toLocaleString()}`);
  console.log(
    `XP necessário para level ${level + 1}: ${requiredXP.toLocaleString()}`
  );
  console.log(
    `Progresso: ${currentXP}/${requiredXP} = ${calculateLevelProgress(
      currentXP,
      requiredXP
    )}%`
  );

  // Validações
  if (currentXP > requiredXP) {
    console.warn("⚠️ ATENÇÃO: currentXP não deveria ser maior que requiredXP!");
    console.warn(
      "💡 currentXP deve ser o XP restante no nível atual, não o total"
    );
  }

  if (currentXP < 0) {
    console.warn("⚠️ ATENÇÃO: currentXP não pode ser negativo!");
  }
}

/**
 * Transforma ProfileStats (formato antigo) em OrganizedProfileStats (formato organizado)
 * @param stats - Stats no formato antigo
 * @returns Stats organizados por contexto
 */
export function transformProfileStats(
  stats: ProfileStats
): OrganizedProfileStats {
  // Recalcula o progresso para garantir consistência
  const safePercentage = calculateLevelProgress(
    stats.levelProgress.current,
    stats.levelProgress.required
  );

  return {
    gamification: {
      totalXP: stats.totalXP,
      level: stats.currentLevel,
      levelProgress: {
        current: stats.levelProgress.current,
        required: stats.levelProgress.required,
        percentage: safePercentage, // Usa o valor seguro
      },
      badgesEarned: stats.badgesEarned,
    },
    pdi: {
      completedPDIs: stats.completedPDIs,
      activePDIs: stats.activePDIs,
      completionRate: stats.completionRate,
    },
    team: {
      teamContributions: stats.teamContributions,
      collaborations: stats.teamContributions, // Assumindo que colaborations é igual a contributions por enquanto
    },
  };
}

/**
 * Mock data para desenvolvimento - novo formato organizado
 */
export const mockOrganizedProfileStats: OrganizedProfileStats = {
  gamification: {
    totalXP: 2500,
    level: 8,
    levelProgress: {
      current: 250, // XP atual no nível (não total)
      required: 1000, // XP necessário para próximo nível
      percentage: 25, // 250/1000 = 25%
    },
    badgesEarned: 8,
  },
  pdi: {
    completedPDIs: 3,
    activePDIs: 1,
    completionRate: 85,
  },
  team: {
    teamContributions: 12,
    collaborations: 8,
  },
};
