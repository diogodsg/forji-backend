export interface CompetenceUpdateData {
  competenceId: string;
  competenceName: string;
  category: "leadership" | "technical" | "behavioral";
  currentLevel: number;
  targetLevel: number;
  currentProgress: number;
  newProgress: number;
}

export interface CompetenceData {
  id: string;
  name: string;
  category: "leadership" | "technical" | "behavioral";
  currentLevel: number;
  targetLevel: number;
  currentProgress: number;
  nextMilestone: string;
}
