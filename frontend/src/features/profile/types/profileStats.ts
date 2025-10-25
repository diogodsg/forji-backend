export interface GamificationStats {
  totalXP: number;
  level: number;
  levelProgress: {
    current: number;
    required: number;
    percentage: number;
  };
  badgesEarned: number;
}

export interface PdiStats {
  completedPDIs: number;
  activePDIs: number;
  completionRate: number; // percentage
}

export interface TeamStats {
  teamContributions: number;
  collaborations: number;
}

export interface OrganizedProfileStats {
  gamification: GamificationStats;
  pdi: PdiStats;
  team: TeamStats;
}
