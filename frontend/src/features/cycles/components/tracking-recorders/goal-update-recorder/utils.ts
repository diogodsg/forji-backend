import type { XPBonus } from "../shared/XPBreakdown";
import type { GoalUpdateData } from "./types";

export function calculateBonuses(data: GoalUpdateData): XPBonus[] {
  const bonuses: XPBonus[] = [];
  const progressChange = data.newProgress - data.currentProgress;

  // Base XP for update (always given for tracking)
  bonuses.push({
    label: "Update de meta",
    value: 15,
  });

  // Bonus for significant progress (20%+ increase)
  if (progressChange >= 20) {
    bonuses.push({
      label: "Progresso significativo",
      value: 15,
    });
  }

  // Penalty for regression (losing progress)
  if (progressChange < 0) {
    bonuses.push({
      label: "Retrocesso registrado",
      value: -5,
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
  // Allow both progress and regression, just validate the range
  return (
    data.newProgress >= 0 &&
    data.newProgress <= 100 &&
    data.newProgress !== data.currentProgress // Must be different from current
  );
}
