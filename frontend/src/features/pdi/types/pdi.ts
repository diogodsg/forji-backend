// MOVED from src/types/pdi.ts
export interface PdiCompetencyRecord {
  area: string;
  levelBefore?: number;
  levelAfter?: number;
  evidence?: string;
}
export interface PdiMilestone {
  id: string;
  date: string;
  title: string;
  summary: string;
  improvements?: string[];
  positives?: string[];
  resources?: string[];
  tasks?: PdiTask[];
  suggestions?: string[];
}
export interface PdiTask {
  id: string;
  title: string;
  done?: boolean;
}
export interface PdiKeyResult {
  id: string;
  description: string;
  successCriteria: string;
  currentStatus?: string;
  improvementActions?: string[];
}
export interface PdiPlan {
  userId: string;
  competencies: string[];
  milestones: PdiMilestone[];
  krs?: PdiKeyResult[];
  records: PdiCompetencyRecord[];
  createdAt: string;
  updatedAt: string;
}
