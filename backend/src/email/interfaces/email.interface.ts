export enum EmailType {
  STREAK_REMINDER_MONDAY = 'streak_reminder_monday',
  STREAK_ALERT_THURSDAY = 'streak_alert_thursday',
  STREAK_SUMMARY_SUNDAY = 'streak_summary_sunday',
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
