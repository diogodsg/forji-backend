import type { OneOnOneData } from "./types";
import type { XPBonus } from "../shared/XPBreakdown";

export function calculateBonuses(data: OneOnOneData): XPBonus[] {
  const bonuses: XPBonus[] = [];

  // Base XP
  bonuses.push({ label: "Base 1:1", value: 300 });

  // Bonus for working on items
  if (data.workingOn.length > 0) {
    bonuses.push({ label: "Itens de trabalho", value: 50 });
  }

  // Bonus for positive points
  if (data.positivePoints.length > 0) {
    bonuses.push({ label: "Pontos positivos", value: 50 });
  }

  // Bonus for improvement points
  if (data.improvementPoints.length > 0) {
    bonuses.push({ label: "Pontos de melhoria", value: 50 });
  }

  // Bonus for next steps
  if (data.nextSteps.length > 0) {
    bonuses.push({ label: "Próximos passos", value: 50 });
  }

  // Bonus for detailed notes
  if (data.generalNotes.length > 50) {
    bonuses.push({ label: "Anotações detalhadas", value: 50 });
  }

  return bonuses;
}

export function calculateCompleteness(data: OneOnOneData): number {
  let score = 0;
  const fields = 7;

  if (data.participant) score++;
  if (data.date) score++;
  if (data.workingOn.length > 0) score++;
  if (data.generalNotes.length >= 50) score++;
  if (data.positivePoints.length > 0) score++;
  if (data.improvementPoints.length > 0) score++;
  if (data.nextSteps.length > 0) score++;

  return Math.round((score / fields) * 100);
}

export function isFormValid(data: OneOnOneData): boolean {
  return !!(
    data.participant &&
    data.date &&
    data.workingOn.length > 0 &&
    data.generalNotes.trim()
  );
}
