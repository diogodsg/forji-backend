import type { XPBonus } from "../shared/XPBreakdown";
import type { CompetenceUpdateData } from "./types";

// Calcular XP de level-up (mesmo cálculo do backend)
function calculateLevelUpXP(level: number): number {
  return 33 * level; // 33 XP por nível
}

export function calculateBonuses(data: CompetenceUpdateData): XPBonus[] {
  const bonuses: XPBonus[] = [];

  const progressIncrease = data.newProgress - data.currentProgress;

  // ✅ XP Base por atualização (só se houver progresso)
  if (progressIncrease > 0) {
    bonuses.push({
      label: "Update de competência",
      value: 30, // ✅ Alinhado com backend
    });

    // Bonus para progresso significativo (20%+)
    if (progressIncrease >= 20) {
      bonuses.push({
        label: "Progresso significativo",
        value: 15, // ✅ Alinhado com backend
      });
    }
  }

  // Bonus para completar nível (atingir 100%)
  if (data.newProgress === 100 && data.currentProgress < 100) {
    // Calcular bônus de level-up baseado no nível alvo
    const nextLevel = data.currentLevel + 1;
    const levelUpBonus = calculateLevelUpXP(nextLevel);

    bonuses.push({
      label: "Nível alcançado!",
      value: levelUpBonus, // ✅ Dinâmico baseado no nível
    });
  }

  return bonuses;
}

export function isFormValid(data: CompetenceUpdateData): boolean {
  return (
    data.newProgress >= 0 &&
    data.newProgress <= 100 &&
    data.newProgress >= data.currentProgress
  );
}
