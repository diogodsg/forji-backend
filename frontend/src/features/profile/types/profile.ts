import type { Badge } from "@/features/gamification/types/gamification";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  position?: string;
  bio?: string;
  avatar?: string;
  avatarId?: string; // ID do avatar selecionado
  isCurrentUser: boolean;
  isTeamMember?: boolean;
  team?: {
    id: number;
    name: string;
  };
  streak: number;
  joinedAt: Date;
}

export interface ProfileStats {
  totalXP: number;
  currentLevel: number;
  levelProgress: {
    current: number;
    required: number;
    percentage: number;
  };
  completedPDIs: number;
  activePDIs: number;
  completionRate: number;
  teamContributions: number;
  badgesEarned: number;
  achievements: {
    totalBadges: number;
    rareBadges: number;
    recentBadges: Badge[];
  };
}

export interface TimelineEntry {
  id: string;
  type:
    | "badge_earned"
    | "pdi_milestone"
    | "level_up"
    | "team_contribution"
    | "key_result";
  title: string;
  description: string;
  xpGained?: number;
  timestamp: Date;
  metadata?: {
    badgeId?: string;
    level?: number;
    pdiTitle?: string;
    teamName?: string;
  };
  isPublic: boolean;
}

export interface PrivacySettings {
  showBadges: "private" | "team" | "company" | "public";
  showStats: "private" | "team" | "company" | "public";
  showTimeline: "private" | "team" | "company" | "public";
  showPDIProgress: "private" | "team" | "company" | "public";
  showTeamContributions: boolean;
  showStreak: boolean;
}

export interface ProfileData {
  profile: UserProfile;
  stats: ProfileStats;
  timeline: TimelineEntry[];
  privacySettings?: PrivacySettings; // Only available for current user
  canViewPrivateInfo: boolean;
}

export type ProfileTab = "gamification";

export interface ProfileTabConfig {
  id: ProfileTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresPrivateAccess?: boolean;
}

// API Response Types
export interface ProfileStatsResponse {
  totalXP: number;
  level: {
    current: number;
    currentXP: number;
    requiredXP: number;
  };
  pdi: {
    completed: number;
    active: number;
    completionRate: number;
  };
  team: {
    contributions: number;
  };
  badges: {
    total: number;
    rare: number;
    recent: Badge[];
  };
}

export interface ProfileTimelineResponse {
  entries: TimelineEntry[];
  totalCount: number;
  hasMore: boolean;
}
