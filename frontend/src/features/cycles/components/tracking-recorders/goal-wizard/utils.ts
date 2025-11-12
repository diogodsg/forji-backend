import type { GoalData } from "./types";
import type { XPBonus } from "../shared/XPBreakdown";

export const validateStep1 = (data: Partial<GoalData>): boolean => {
  return !!(data.title?.trim() && data.description?.trim());
};

export const validateStep2 = (data: Partial<GoalData>): boolean => {
  if (!data.type || !data.successCriterion) return false;

  const criterion = data.successCriterion;

  switch (data.type) {
    case "increase":
      // Para aumentar: valor atual deve ser menor que valor meta
      return !!(
        criterion.currentValue !== undefined &&
        criterion.targetValue !== undefined &&
        criterion.unit?.trim() &&
        criterion.currentValue < criterion.targetValue
      );

    case "decrease":
      // Para diminuir: valor atual deve ser maior que valor meta
      return !!(
        criterion.currentValue !== undefined &&
        criterion.targetValue !== undefined &&
        criterion.unit?.trim() &&
        criterion.currentValue > criterion.targetValue
      );

    case "percentage":
      // Para percentuais: valor meta deve estar entre 0 e 100
      return !!(
        criterion.currentValue !== undefined &&
        criterion.targetValue !== undefined &&
        criterion.unit?.trim() &&
        criterion.targetValue >= 0 &&
        criterion.targetValue <= 100 &&
        criterion.currentValue >= 0 &&
        criterion.currentValue <= 100
      );

    case "binary":
      return true; // Binary não precisa validação extra

    default:
      return false;
  }
};

export const calculateGoalXP = (
  data: Partial<GoalData>
): { total: number; bonuses: XPBonus[] } => {
  const BASE_XP = 40;
  const bonuses: XPBonus[] = [];
  let total = BASE_XP;

  // Bonus: Descrição detalhada (8 XP)
  if (data.description && data.description.length > 100) {
    bonuses.push({ label: "Descrição detalhada", value: 8 });
    total += 8;
  }

  // Bonus: Critério bem definido (12 XP)
  if (data.successCriterion) {
    const criterion = data.successCriterion;
    let hasGoodCriterion = false;

    if (
      data.type === "increase" ||
      data.type === "decrease" ||
      data.type === "percentage"
    ) {
      hasGoodCriterion = !!(
        criterion.currentValue !== undefined &&
        criterion.targetValue !== undefined
      );
    } else {
      hasGoodCriterion = true;
    }

    if (hasGoodCriterion) {
      bonuses.push({ label: "Critério bem definido", value: 12 });
      total += 12;
    }
  }

  // Bonus: Meta ambiciosa (15 XP) - para increase/decrease
  if (data.type === "increase" || data.type === "decrease") {
    const criterion = data.successCriterion;
    if (
      criterion?.currentValue !== undefined &&
      criterion?.targetValue !== undefined &&
      criterion.currentValue > 0
    ) {
      const change = Math.abs(
        ((criterion.targetValue - criterion.currentValue) /
          criterion.currentValue) *
          100
      );
      if (change >= 50) {
        bonuses.push({ label: "Meta ambiciosa (≥50%)", value: 15 });
        total += 15;
      }
    }
  }

  // Bonus: Meta ambiciosa (15 XP) - para percentage
  if (data.type === "percentage") {
    const criterion = data.successCriterion;
    if (
      criterion?.currentValue !== undefined &&
      criterion?.targetValue !== undefined
    ) {
      const improvement = criterion.targetValue - criterion.currentValue;
      if (improvement >= 20) {
        bonuses.push({ label: "Meta ambiciosa (+20%)", value: 15 });
        total += 15;
      }
    }
  }

  return { total, bonuses };
};
