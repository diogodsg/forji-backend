import type { PdiCycle } from './pdi';

export interface TimelineItem extends PdiCycle {
  completionPercentage?: number;
  achievedKRs: number;
  totalKRs: number;
  badges?: BadgeEarned[];
  workFocus?: string[];
  achievements?: string[];
  challenges?: string[];
  feedback?: TimelineFeedback[];
}

export interface BadgeEarned {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
  description?: string;
}

export interface TimelineFeedback {
  id: string;
  type: 'manager' | 'self' | 'peer';
  author: string;
  content: string;
  rating?: number;
  createdAt: string;
}

export interface TimelineFilters {
  status?: PdiCycle['status'][];
  dateRange?: {
    start: string;
    end: string;
  };
  competencies?: string[];
  showBadges?: boolean;
  showFeedback?: boolean;
}

export interface TimelineStats {
  totalCycles: number;
  completedCycles: number;
  totalKRsAchieved: number;
  totalKRs: number;
  averageCompletionRate: number;
  totalBadgesEarned: number;
  competenciesImproved: string[];
}