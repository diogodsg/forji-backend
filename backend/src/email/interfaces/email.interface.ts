export enum EmailType {
  WORKSPACE_INVITE = 'workspace_invite',
  WELCOME = 'welcome',
  BADGE_EARNED = 'badge_earned',
  LEVEL_UP = 'level_up',
  GOAL_REMINDER = 'goal_reminder',
  GOAL_ASSIGNED = 'goal_assigned',
  ONE_ON_ONE_SCHEDULED = 'one_on_one_scheduled',
  ONE_ON_ONE_FEEDBACK = 'one_on_one_feedback',
  WEEKLY_REPORT = 'weekly_report',
  MONTHLY_REPORT = 'monthly_report',
  SUBORDINATE_NEEDS_ATTENTION = 'subordinate_needs_attention',
  CYCLE_ENDING_SOON = 'cycle_ending_soon',
}

export interface EmailData {
  to: string;
  subject: string;
  type: EmailType;
  data?: any;
}

export interface BadgeEmailData {
  userName: string;
  badgeName: string;
  badgeDescription: string;
  badgeIcon: string;
  totalBadges: number;
  workspaceUrl: string;
}

export interface LevelUpEmailData {
  userName: string;
  oldLevel: number;
  newLevel: number;
  totalXP: number;
  workspaceUrl: string;
}

export interface GoalReminderEmailData {
  userName: string;
  goalTitle: string;
  dueDate: string;
  daysRemaining: number;
  currentProgress: number;
  workspaceUrl: string;
}

export interface WelcomeEmailData {
  userName: string;
  workspaceName: string;
  workspaceUrl: string;
  managerName?: string;
}

export interface WorkspaceInviteEmailData {
  invitedByName: string;
  workspaceName: string;
  inviteUrl: string;
  expiresIn: string;
}

export interface OneOnOneScheduledEmailData {
  participantName: string;
  managerName: string;
  scheduledDate: string;
  scheduledTime: string;
  workspaceUrl: string;
}

export interface WeeklyReportEmailData {
  userName: string;
  teamName: string;
  weekXP: number;
  activitiesCompleted: number;
  goalsCompleted: number;
  teamRank: number;
  topContributors: Array<{ name: string; xp: number }>;
  workspaceUrl: string;
}
