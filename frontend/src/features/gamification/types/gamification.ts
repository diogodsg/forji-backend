export interface PlayerProfile {
  userId: number;
  level: number;
  currentXP: number;
  totalXP: number;
  nextLevelXP: number;
  title: string;
  badges: Badge[];
  rank?: number;
}

export interface Badge {
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

export interface XPGain {
  action: string;
  points: number;
  multiplier?: number;
  category: "development" | "leadership" | "collaboration" | "learning";
  description?: string;
}

export interface LeaderboardEntry {
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

export interface AddXPRequest {
  userId: number;
  action: string;
  points?: number;
  description?: string;
}

export interface WeeklyChallenge {
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

// Constantes para UI
export const RARITY_COLORS = {
  common: "bg-gray-100 text-gray-800 border-gray-300",
  rare: "bg-blue-100 text-blue-800 border-blue-300",
  epic: "bg-purple-100 text-purple-800 border-purple-300",
  legendary: "bg-yellow-100 text-yellow-800 border-yellow-300",
} as const;

export const CATEGORY_COLORS = {
  development: "bg-green-100 text-green-800",
  leadership: "bg-purple-100 text-purple-800",
  collaboration: "bg-blue-100 text-blue-800",
  learning: "bg-orange-100 text-orange-800",
} as const;

export const LEVEL_TITLES = {
  junior: "Junior Professional",
  mid: "Mid-Level Professional",
  senior: "Senior Specialist",
  lead: "Tech Lead",
  architect: "Senior Architect",
  mentor: "Team Mentor",
  master: "Master Professional",
} as const;

// Team-focused interfaces
export interface TeamLeaderboardEntry {
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

export interface TeamProfile {
  teamId: number;
  teamName: string;
  totalXP: number;
  weeklyXP: number;
  averageXP: number;
  memberCount: number;
  members: TeamMember[];
  badges: TeamBadge[];
  rank?: number;
}

export interface TeamMember {
  userId: number;
  name: string;
  level: number;
  totalXP: number;
  weeklyXP: number;
  contributionScore: number;
  badges: Badge[];
}

export interface TeamBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  category: "teamwork" | "collaboration" | "achievement" | "milestone";
  unlockedAt: Date;
  contributingMembers: number;
}

export type LeaderboardType = "individual" | "team";
export type LeaderboardPeriod = "week" | "month" | "all";
