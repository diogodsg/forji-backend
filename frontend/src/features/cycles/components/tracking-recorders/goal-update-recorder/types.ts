export interface GoalUpdateData {
  goalId: string;
  goalTitle: string;
  goalType?: "increase" | "decrease" | "percentage" | "binary";
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
  type?: "increase" | "decrease" | "percentage" | "binary";
  // Campos para metas de increase/decrease
  currentValue?: number;
  targetValue?: number;
  startValue?: number;
  unit?: string;
}
