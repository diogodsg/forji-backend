import type { XPBonus } from "../shared/XPBreakdown";
import type { GoalUpdateData } from "./types";

export function calculateBonuses(data: GoalUpdateData): XPBonus[] {
  const bonuses: XPBonus[] = [];

  // Base XP for update
  bonuses.push({
    label: "Update de meta",
    value: 15,
  });

  // Bonus for significant progress (20%+ increase)
  const progressIncrease = data.newProgress - data.currentProgress;
  if (progressIncrease >= 20) {
    bonuses.push({
      label: "Progresso significativo",
      value: 15,
    });
  }

  // Bonus for completing the goal (reaching 100%)
  if (data.newProgress === 100 && data.currentProgress < 100) {
    bonuses.push({
      label: "Meta concluída!",
      value: 50,
    });
  }

  return bonuses;
}

export function isFormValid(data: GoalUpdateData): boolean {
  return (
    data.newProgress >= 0 &&
    data.newProgress <= 100 &&
    data.newProgress >= data.currentProgress
  );
}
