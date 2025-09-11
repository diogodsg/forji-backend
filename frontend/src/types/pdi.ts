export interface PdiCompetencyRecord {
  area: string; // e.g., 'Front - React'
  levelBefore?: number; // 1-5
  levelAfter?: number; // 1-5
  evidence?: string; // free text / markdown
}

export interface PdiMilestone {
  id: string;
  date: string; // ISO date of meeting
  title: string; // e.g., 'Primeiro encontro'
  summary: string; // markdown block
  improvements?: string[]; // bullet list of action points
  positives?: string[]; // bullet list
  resources?: string[]; // links or references
  tasks?: PdiTask[]; // actionable tasks until next meeting
  suggestions?: string[]; // AI generated suggestions (commits analysis)
}

export interface PdiTask {
  id: string;
  title: string;
  done?: boolean;
}

export interface PdiKeyResult {
  id: string;
  description: string; // descrição da KR
  successCriteria: string; // noção de sucesso (definição do que é sucesso)
  currentStatus?: string; // estado ou sucesso atual
  improvementActions?: string[]; // ações sugeridas para melhoria
}

export interface PdiPlan {
  userId: string;
  competencies: string[]; // list of competencies to develop
  milestones: PdiMilestone[];
  krs?: PdiKeyResult[]; // key results opcionais
  records: PdiCompetencyRecord[];
  createdAt: string;
  updatedAt: string;
}
