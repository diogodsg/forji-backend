// Goal Wizard Types

export type GoalType = "increase" | "decrease" | "percentage" | "binary";

export interface GoalData {
  // Step 1: Informações Básicas
  title: string;
  description: string;
  type: GoalType;

  // Step 2: Planejamento & Critério (depende do tipo)
  successCriterion: {
    type: GoalType;
    // Para increase/decrease/percentage
    currentValue?: number;
    targetValue?: number;
    unit?: string;
    // Para binary
    completed?: boolean;
  };
}

export interface GoalTypeConfig {
  id: GoalType;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  example: string;
}
