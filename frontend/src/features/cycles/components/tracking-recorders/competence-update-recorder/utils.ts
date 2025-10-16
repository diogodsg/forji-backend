import type { XPBonus } from "../shared/XPBreakdown";
import type { CompetenceUpdateData } from "./types";

export function calculateBonuses(data: CompetenceUpdateData): XPBonus[] {
  const bonuses: XPBonus[] = [];

  // Base XP for update
  bonuses.push({
    label: "Update de competência",
    value: 20,
  });

  // Bonus for significant progress (15% or more)
  const progressIncrease = data.newProgress - data.currentProgress;
  if (progressIncrease >= 15) {
    bonuses.push({
      label: "Progresso significativo",
      value: 15,
    });
  }

  // Bonus for completing level (reaching 100%)
  if (data.newProgress === 100 && data.currentProgress < 100) {
    bonuses.push({
      label: "Nível alcançado!",
      value: 40,
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
