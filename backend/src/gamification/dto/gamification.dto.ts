export interface PlayerProfileDto {
  userId: number;
  level: number;
  currentXP: number;
  totalXP: number;
  nextLevelXP: number;
  title: string;
  badges: BadgeDto[];
  rank?: number;
}

export interface BadgeDto {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  category: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface XPGainDto {
  action: string;
  points: number;
  multiplier?: number;
  category: "development" | "collaboration" | "teamwork" | "bonus";
  description?: string;
}

export interface LeaderboardEntryDto {
  userId: number;
  name: string;
  level: number;
  totalXP: number;
  weeklyXP: number;
  rank: number;
  trend: "up" | "down" | "stable";
  avatar?: string;
  badgeCount?: number;
}

export interface AddXPDto {
  userId: number;
  action: string;
  points?: number; // opcional, calculado automaticamente se não fornecido
  description?: string;
}

export interface ActionSubmissionDto {
  action: string;
  evidence?: string;
  metadata?: Record<string, any>;
  description?: string;
}

export interface ActionSubmissionResponseDto {
  id: string;
  action: string;
  points: number;
  evidence?: string;
  rating?: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "REQUIRES_EVIDENCE";
  validatedBy?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionValidationDto {
  submissionId: string;
  rating: number; // 1-5
  status: "APPROVED" | "REJECTED" | "REQUIRES_EVIDENCE";
  feedback?: string;
}

export interface ActionCooldownDto {
  action: string;
  expiresAt: Date;
  remainingTime: number; // em minutos
}

export interface WeeklyCapDto {
  action: string;
  count: number;
  maxCount: number;
  weekStart: Date;
  canSubmit: boolean;
}

export interface ActionTypeDto {
  key: string;
  name: string;
  description: string;
  baseXP: number;
  category: "collaboration" | "mentoring" | "team" | "process";
  cooldownHours?: number;
  weeklyLimit?: number;
  requiresEvidence: boolean;
  requiresValidation: boolean;
  multiplierEligible: boolean;
}

export interface SubmitActionResponseDto {
  success: boolean;
  submission?: ActionSubmissionResponseDto;
  xpGained?: number;
  message: string;
  cooldownInfo?: ActionCooldownDto;
  capInfo?: WeeklyCapDto;
}

export interface WeeklyChallengeDto {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  progress: number; // 0-100
  isCompleted: boolean;
  expiresAt: Date;
}

// Team-focused DTOs
export interface TeamLeaderboardEntryDto {
  teamId: number;
  teamName: string;
  totalXP: number;
  weeklyXP: number;
  averageXP: number;
  memberCount: number;
  rank: number;
  trend: "up" | "down" | "stable";
  topContributors: {
    userId: number;
    name: string;
    xp: number;
  }[];
}

export interface TeamProfileDto {
  teamId: number;
  teamName: string;
  totalXP: number;
  weeklyXP: number;
  averageXP: number;
  memberCount: number;
  members: TeamMemberDto[];
  badges: TeamBadgeDto[];
  rank?: number;
}

export interface TeamMemberDto {
  userId: number;
  name: string;
  level: number;
  totalXP: number;
  weeklyXP: number;
  contributionScore: number;
  badges: BadgeDto[];
}

export interface TeamBadgeDto {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  category: "teamwork" | "collaboration" | "achievement" | "milestone";
  unlockedAt: Date;
  contributingMembers: number;
}
