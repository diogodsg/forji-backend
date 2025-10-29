/**
 * 📆 Cycles Types - DTOs compartilhados Backend/Frontend
 *
 * Baseado em:
 * - backend/src/cycles/dto/
 * - backend/prisma/schema.prisma
 */

// ==========================================
// ENUMS
// ==========================================

export const CycleType = {
  TRIMESTRAL: "TRIMESTRAL",
  SEMESTRAL: "SEMESTRAL",
  ANUAL: "ANUAL",
} as const;

export type CycleType = (typeof CycleType)[keyof typeof CycleType];

export const GoalType = {
  INCREASE: "INCREASE",
  DECREASE: "DECREASE",
  PERCENTAGE: "PERCENTAGE",
  BINARY: "BINARY",
} as const;

export type GoalType = (typeof GoalType)[keyof typeof GoalType];

export const GoalStatus = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  BLOCKED: "BLOCKED",
  CANCELLED: "CANCELLED",
} as const;

export type GoalStatus = (typeof GoalStatus)[keyof typeof GoalStatus];

export const CompetencyCategory = {
  TECHNICAL: "TECHNICAL",
  LEADERSHIP: "LEADERSHIP",
  BEHAVIORAL: "BEHAVIORAL",
} as const;

export type CompetencyCategory =
  (typeof CompetencyCategory)[keyof typeof CompetencyCategory];

export const ActivityType = {
  ONE_ON_ONE: "ONE_ON_ONE",
  MENTORING: "MENTORING",
  CERTIFICATION: "CERTIFICATION",
  GOAL_UPDATE: "GOAL_UPDATE",
  COMPETENCY_UPDATE: "COMPETENCY_UPDATE",
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

// ==========================================
// CYCLE DTOs
// ==========================================

export interface CreateCycleDto {
  name: string;
  type: CycleType;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  description?: string;
}

export interface UpdateCycleDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface CycleResponseDto {
  id: string;
  name: string;
  type: CycleType;
  startDate: string;
  endDate: string;
  description: string | null;
  isActive: boolean;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CycleStatsDto {
  cycleId: string;
  cycleName: string;
  totalGoals: number;
  completedGoals: number;
  totalCompetencies: number;
  totalActivities: number;
  totalUsers: number;
}

// ==========================================
// GOAL DTOs
// ==========================================

export interface CreateGoalDto {
  cycleId: string;
  userId: string;
  workspaceId: string;
  type: GoalType;
  title: string;
  description?: string;
  startValue: number;
  targetValue: number;
  unit: string;
}

export interface UpdateGoalDto {
  title?: string;
  description?: string;
  type?: GoalType;
  targetValue?: number;
  startValue?: number;
  currentValue?: number;
  unit?: string;
  deadline?: string;
  status?: GoalStatus;
}

export interface UpdateGoalProgressDto {
  newValue: number;
  notes?: string;
}

export interface GoalResponseDto {
  id: string;
  title: string;
  description: string | null;
  type: GoalType;
  status: GoalStatus;
  targetValue: number;
  initialValue: number;
  currentValue: number;
  progress: number; // Percentual calculado pelo backend (0-100)
  deadline: string;
  completedAt: string | null;
  xpReward: number;
  cycleId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Controle de atualização semanal
  canUpdateNow?: boolean; // Pode atualizar agora?
  nextUpdateDate?: string; // Próxima data disponível (ISO string)

  // Informações de XP e level-up para animações (apenas em operações que geram XP)
  xpEarned?: number;
  leveledUp?: boolean;
  previousLevel?: number;
  newLevel?: number;
}

export interface GoalUpdateHistoryDto {
  id: string;
  goalId: string;
  oldValue: number;
  newValue: number;
  notes: string | null;
  xpEarned: number;
  createdAt: string;
}

// ==========================================
// COMPETENCY DTOs
// ==========================================

export interface CreateCompetencyDto {
  cycleId: string;
  name: string;
  description?: string;
  category: CompetencyCategory;
  targetLevel: number; // 1-5
}

export interface UpdateCompetencyDto {
  name?: string;
  description?: string;
  targetLevel?: number;
}

export interface UpdateCompetencyProgressDto {
  progressPercentage: number; // 0-100 (progresso percentual dentro do nível atual)
  notes?: string;
}

export interface CompetencyResponseDto {
  id: string;
  name: string;
  description: string | null;
  category: CompetencyCategory;
  currentLevel: number;
  targetLevel: number;
  cycleId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Informações de XP e level-up para animações (apenas em operações que geram XP)
  xpEarned?: number;
  xpReward?: number;
  leveledUp?: boolean;
  previousLevel?: number;
  newLevel?: number;
  profile?: any; // ✅ Perfil de gamificação atualizado (quando há ganho de XP)

  // ✅ Informações de limite de atualização
  canUpdateNow?: boolean; // Pode atualizar agora?
  nextUpdateDate?: string; // Próxima data disponível (ISO string)
}

export interface CompetencyUpdateHistoryDto {
  id: string;
  competencyId: string;
  oldLevel: number;
  newLevel: number;
  notes: string | null;
  xpEarned: number;
  createdAt: string;
}

export interface CompetencyLibraryDto {
  id: string;
  name: string;
  description: string;
  category: CompetencyCategory;
  suggestedLevel: number;
}

// ==========================================
// ACTIVITY DTOs
// ==========================================

// Base Activity
export interface ActivityResponseDto {
  id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  xpEarned: number;
  userId: string;
  cycleId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Informações de level up para animações
  leveledUp?: boolean;
  previousLevel?: number;
  newLevel?: number;
}

// Activity DTOs alinhados com backend
export interface CreateOneOnOneDataDto {
  participantName: string;
  workingOn?: string[];
  generalNotes: string;
  positivePoints?: string[];
  improvementPoints?: string[];
  nextSteps: string[];
}

export interface CreateActivityDto {
  cycleId: string;
  userId: string;
  type: ActivityType;
  title: string;
  description?: string;
  duration?: number;
  oneOnOneData?: CreateOneOnOneDataDto;
  mentoringData?: any; // TODO: definir interface
  certificationData?: any; // TODO: definir interface
}

// Legacy - manter para compatibilidade
export interface CreateOneOnOneDto {
  cycleId: string;
  title: string;
  description?: string;
  participantId: string; // Manager/Mentor user ID
  meetingDate: string; // ISO 8601
  topics: string[];
  actionItems?: string[];
}

export interface OneOnOneActivityResponseDto extends ActivityResponseDto {
  type: "ONE_ON_ONE";
  participantId: string;
  meetingDate: string;
  topics: string[];
  actionItems: string[];
}

// Mentoring Activity
export interface CreateMentoringDto {
  cycleId: string;
  title: string;
  description?: string;
  mentorId: string;
  sessionDate: string; // ISO 8601
  topics: string[];
  nextSteps?: string[];
}

export interface MentoringActivityResponseDto extends ActivityResponseDto {
  type: "MENTORING";
  mentorId: string;
  sessionDate: string;
  topics: string[];
  nextSteps: string[];
}

// Certification Activity
export interface CreateCertificationDto {
  cycleId: string;
  title: string;
  description?: string;
  platform: string;
  completionDate: string; // ISO 8601
  certificateUrl?: string;
  skills: string[];
}

export interface CertificationActivityResponseDto extends ActivityResponseDto {
  type: "CERTIFICATION";
  platform: string;
  completionDate: string;
  certificateUrl: string | null;
  skills: string[];
}

// Timeline Response (union type)
export type ActivityTimelineDto =
  | OneOnOneActivityResponseDto
  | MentoringActivityResponseDto
  | CertificationActivityResponseDto
  | ActivityResponseDto;

// ==========================================
// PAGINATION & FILTERS
// ==========================================

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface GoalFiltersDto extends PaginationDto {
  cycleId?: string;
  status?: GoalStatus;
  type?: GoalType;
}

export interface CompetencyFiltersDto extends PaginationDto {
  cycleId?: string;
  category?: CompetencyCategory;
}

export interface ActivityFiltersDto extends PaginationDto {
  cycleId?: string;
  type?: ActivityType;
  startDate?: string;
  endDate?: string;
}

// ==========================================
// PAGINATED RESPONSE
// ==========================================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==========================================
// GAMIFICATION TYPES
// ==========================================

export type BadgeType =
  | "STREAK_7"
  | "STREAK_30"
  | "GOAL_MASTER"
  | "FAST_LEARNER"
  | "MENTOR"
  | "CERTIFIED"
  | "TEAM_PLAYER";

export interface GamificationProfileResponseDto {
  id: string;
  userId: string;
  level: number;
  currentXP: number;
  totalXP: number;
  nextLevelXP: number; // Corrigir para corresponder ao backend
  progressToNextLevel: number;
  streak: number;
  streakStatus: "active" | "broken" | "new";
  lastActiveAt: string;
  badges: BadgeResponseDto[];
  totalBadges: number;
  rank: string | null;
}

export interface BadgeResponseDto {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  earnedAt: string | null;
  isEarned: boolean;
}
