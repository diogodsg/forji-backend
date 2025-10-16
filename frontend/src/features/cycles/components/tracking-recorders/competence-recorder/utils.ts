import type { CompetenceData } from "./types";
import type { XPBonus } from "../shared/XPBreakdown";

export function calculateBonuses(data: CompetenceData): XPBonus[] {
  const bonuses: XPBonus[] = [];

  // Bônus por progressão de nível
  const levelMap = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };

  const initialLevelValue = levelMap[data.initialLevel];
  const targetLevelValue = levelMap[data.targetLevel];
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

  // Bonus por evidências
  if (data.evidences && data.evidences.length >= 2) {
    bonuses.push({
      label: "Evidências documentadas",
      value: 30,
    });
  }

  // Bonus por descrição detalhada
  if (data.description && data.description.length > 100) {
    bonuses.push({
      label: "Descrição detalhada",
      value: 15,
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

  const levelMap = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };

  // Target deve ser maior que initial
  return levelMap[data.targetLevel] > levelMap[data.initialLevel];
}
