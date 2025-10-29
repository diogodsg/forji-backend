export interface GoalUpdateData {
  goalId: string;
  goalTitle: string;
  goalType?: "INCREASE" | "DECREASE" | "PERCENTAGE" | "BINARY";
  currentProgress: number;
  newProgress: number;
  description: string;
  // Campos para metas de increase/decrease
  currentValue?: number;
  targetValue?: number;
  startValue?: number;
  unit?: string;
}

export interface GoalData {
  id: string;
  title: string;
  description: string;
  currentProgress: number;
  type?: "INCREASE" | "DECREASE" | "PERCENTAGE" | "BINARY";
  // Campos para metas de increase/decrease
  currentValue?: number;
  targetValue?: number;
  startValue?: number;
  unit?: string;
}
