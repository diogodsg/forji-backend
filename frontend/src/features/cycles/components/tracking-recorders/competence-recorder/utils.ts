import type { CompetenceData } from "./types";
import type { XPBonus } from "../shared/XPBreakdown";

export function calculateBonuses(data: CompetenceData): XPBonus[] {
  const bonuses: XPBonus[] = [];

  // Bônus por progressão de nível
  const initialLevelValue = data.initialLevel || 1;
  const targetLevelValue = data.targetLevel || 1;
  const levelDifference = targetLevelValue - initialLevelValue;

  if (levelDifference > 0) {
    const levelBonus = levelDifference * 33; // 33 pontos por nível de progressão
    bonuses.push({
      label: `Progressão de ${levelDifference} ${
        levelDifference === 1 ? "nível" : "níveis"
      }`,
      value: levelBonus,
    });
  }

  return bonuses;
}

export function isFormValid(data: Partial<CompetenceData>): boolean {
  if (!data.name?.trim() || !data.category?.trim()) {
    return false;
  }

  if (!data.initialLevel || !data.targetLevel) {
    return false;
  }

  // Target deve ser maior que initial
  return (data.targetLevel || 1) > (data.initialLevel || 1);
}
