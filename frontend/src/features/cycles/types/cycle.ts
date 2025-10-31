// Tipos para o sistema simplificado de Ciclos de Desenvolvimento
// Foco em velocidade de preenchimento (5-10 minutos)

export type CycleStatus =
  | "planned"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type CycleDuration = "1month" | "3months" | "6months";

// Apenas 3 tipos simples de metas para velocidade
export type GoalType = "quantity" | "deadline" | "improvement";

export interface CycleGoal {
  id: string;
  type: GoalType;
  title: string;
  description: string;

  // Para metas de quantidade: "Completar [X] projetos"
  targetNumber?: number;
  currentNumber?: number;
  unit?: string; // "projetos", "pessoas", "features"

  // Para metas de prazo: "Aprender React Native até março"
  deadline?: string; // ISO date
  completed?: boolean;

  // Para metas de melhoria: "Aumentar satisfação de 7 para 8.5"
  initialValue?: number;
  targetValue?: number;
  currentValue?: number;
  metric?: string; // "satisfação", "cobertura de testes", "bugs"

  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  id: string;
  name: string;
  description?: string;
  duration: CycleDuration;
  status: CycleStatus;

  startDate: string; // ISO date
  endDate: string; // ISO date

  goals: CycleGoal[];

  // Gamificação
  xpEarned: number;
  xpTarget?: number;

  // Métricas de progresso
  progressPercentage: number; // 0-100
  daysRemaining: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Relação com usuário
  userId: string;
}

// Templates rápidos por perfil
export type UserProfile = "developer" | "tech-lead" | "manager" | "custom";

export interface CycleTemplate {
  id: string;
  name: string;
  description: string;
  profile: UserProfile;
  icon: string; // Lucide icon name
  estimatedTime: string; // "2 min", "5 min"

  // Metas pré-definidas que o usuário só personaliza
  defaultGoals: Omit<CycleGoal, "id" | "createdAt" | "updatedAt">[];

  // Sugestões contextuais
  suggestions: {
    technologies?: string[];
    skills?: string[];
    teamSize?: number;
  };
}

// Para o wizard de criação rápida
export interface CycleCreationStep {
  step: number;
  title: string;
  description: string;
  isValid: boolean;
}

export interface CycleCreationState {
  currentStep: number;
  selectedProfile?: UserProfile;
  selectedTemplate?: CycleTemplate;
  duration: CycleDuration;
  customGoals: Partial<CycleGoal>[];
  isComplete: boolean;
}

// Próximas ações sugeridas baseadas no ciclo atual
export interface NextAction {
  id: string;
  type:
    | "milestone"
    | "update"
    | "feedback"
    | "celebration"
    | "competency"
    | "one-on-one";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimatedTime: string; // "5 min", "30 min"
  xpReward: number;
  icon: string; // Lucide icon name
  actionUrl?: string;
}

// Métricas da visão geral do ciclo
export interface CycleOverview {
  daysRemaining: number;
  activeGoals: number;
  completedGoals: number;
  currentStreak: number;
  teamRanking: number;
  xpThisCycle: number;
}

// Sistema de Competências
export type CompetencyCategory =
  | "technical"
  | "leadership"
  | "behavioral"
  | "business";

export interface CompetencyLevel {
  level: 1 | 2 | 3 | 4 | 5; // Básico, Intermediário, Avançado, Expert, Master
  name: string;
  description: string;
  behaviors: string[]; // Comportamentos esperados neste nível
  evidence: string[]; // Como demonstrar este nível
  timeEstimate: string; // "3-6 meses", "6-12 meses"
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  category: CompetencyCategory;
  subCategory?: string;
  levels: CompetencyLevel[];
  isCore: boolean; // Competência essencial para a empresa
  isCustom: boolean; // Criada pela empresa vs padrão
  relatedCompetencies: string[]; // IDs de competências relacionadas
  icon: string; // Lucide icon name
}

export interface UserCompetencyProgress {
  competencyId: string;
  currentLevel: number;
  targetLevel: number;
  progress: number; // 0-100 percentage
  evidences: CompetencyEvidence[];
  startDate: string;
  targetDate?: string;
  isActiveInCycle: boolean;
}

export interface CompetencyEvidence {
  id: string;
  type:
    | "project"
    | "course"
    | "certification"
    | "feedback"
    | "1on1"
    | "milestone";
  title: string;
  description: string;
  date: string;
  verifiedBy?: string; // User ID who verified
  attachments?: string[]; // URLs or file IDs
  xpAwarded: number;
}

// Sistema de 1:1s
export type OneOnOneParticipantRole =
  | "manager"
  | "mentor"
  | "mentee"
  | "peer"
  | "senior"
  | "junior";
export type OneOnOneMood = "great" | "good" | "neutral" | "challenging";

// Opções para "No que estava trabalhando" (multi-select)
export interface WorkingOnOption {
  id: string;
  label: string;
  category: "project" | "learning" | "competency" | "process" | "other";
  icon: string;
}

export interface OneOnOneRecord {
  id: string;
  date: string; // ISO date
  completedAt?: string; // ISO date - data de realização
  participantName: string;
  participantId: string; // User ID
  participantRole: OneOnOneParticipantRole;
  workingOn: string[]; // Array of WorkingOnOption IDs selected
  workingOnOther?: string; // Free text for "other" option
  generalNotes: string;
  positivePoints: string[];
  improvementPoints: string[];
  nextSteps: string[];
  relatedCompetencies: string[]; // Competency IDs
  mood: OneOnOneMood;
  duration?: number; // minutes
  location?: string; // "presencial", "remoto", "híbrido"
  followUpRequired: boolean;
  actionItems: ActionItem[];
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User ID who created the record
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: "self" | "participant" | "both";
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  relatedCompetency?: string; // Competency ID if applicable
}

// Templates para diferentes tipos de 1:1
export interface OneOnOneTemplate {
  id: string;
  name: string;
  role: OneOnOneParticipantRole;
  icon: string;
  description: string;
  suggestedTopics: string[];
  defaultWorkingOn: string[]; // Default WorkingOnOption IDs
  questionPrompts: {
    section: string;
    questions: string[];
  }[];
}
