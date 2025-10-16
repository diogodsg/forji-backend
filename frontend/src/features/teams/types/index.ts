export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  role: string;
  badges: TeamBadge[];
  isOnline?: boolean;
}

export interface TeamBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  type: "individual" | "collaborative";
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  managerId: string;
  managerName: string;
  totalXP: number;
  averageLevel: number;
  streakDays: number;
  badges: TeamBadge[];
  performanceScore: number;
  activePDIs: number;
  completedMilestones: number;
  createdAt: Date;
}

export interface TeamMetrics {
  totalXP: number;
  averageXP: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  performanceScore: number;
  engagementRate: number;
  activeMembersCount: number;
  completedChallenges: number;
  ranking: {
    position: number;
    totalTeams: number;
    trend: "up" | "down" | "stable";
  };
}

export interface ManagerTeamOverview {
  teams: Team[];
  totalMembers: number;
  totalXP: number;
  averagePerformance: number;
  teamsNeedingAttention: Team[];
  topPerformingTeam: Team;
  alerts: TeamAlert[];
}

export interface TeamAlert {
  id: string;
  type: "warning" | "info" | "success" | "error";
  message: string;
  teamId: string;
  memberId?: string;
  createdAt: Date;
  isRead: boolean;
}

export interface AdminCompanyOverview {
  totalTeams: number;
  totalEmployees: number;
  totalXP: number;
  averageEngagement: number;
  activePDIs: number;
  systemHealth: {
    status: "online" | "degraded" | "offline";
    adoptionRate: number;
    activeUsers: number;
    lastUpdateAt: Date;
  };
  topPerformingTeams: Team[];
  teamsNeedingAttention: Team[];
}

export type UserRole = "collaborator" | "manager" | "admin";

export interface TeamQuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
  variant: "primary" | "secondary";
}

export interface TeamChallenge {
  id: string;
  title: string;
  description: string;
  targetXP?: number;
  deadline?: Date;
  progress: number;
  status: "active" | "completed" | "expired";
  participants: TeamMember[];
  reward?: string;
}

// Timeline and Objectives Types
export interface TimelineEvent {
  id: string;
  type: "badge" | "milestone" | "objective" | "collaboration" | "member" | "xp";
  title: string;
  description: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  teamId: string;
  timestamp: Date;
  metadata?: {
    badgeId?: string;
    xpAmount?: number;
    objectiveId?: string;
    milestoneId?: string;
    [key: string]: any;
  };
}

export interface TeamObjective {
  id: string;
  title: string;
  description: string;
  type: "xp" | "badges" | "pdi" | "collaboration" | "performance";
  target: number;
  current: number;
  unit: string; // 'XP', 'badges', '%', 'feedbacks', etc.
  deadline: Date;
  status: "active" | "completed" | "overdue" | "paused";
  createdBy: string;
  createdByName: string;
  teamId: string;
  createdAt: Date;
  completedAt?: Date;
}

// Personal contribution and upcoming actions types
export interface PersonalContribution {
  xpContributed: number;
  xpPercentageOfTeam: number;
  mentorshipsSessions: number;
  badgesEarned: number;
  badgesHelpedTeamObjectives: number;
  growthVsPreviousMonth: number;
  streakDays: number;
  rankInTeam: number;
  totalTeamMembers: number;
}

export interface UpcomingAction {
  id: string;
  type:
    | "pdi_milestone"
    | "mentorship_opportunity"
    | "badge_close"
    | "feedback_pending"
    | "collaboration";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate?: Date;
  estimatedTime?: string;
  relatedUserId?: string;
  relatedUserName?: string;
  metadata?: {
    progressPercentage?: number;
    requiredXP?: number;
    skillArea?: string;
    [key: string]: any;
  };
}
