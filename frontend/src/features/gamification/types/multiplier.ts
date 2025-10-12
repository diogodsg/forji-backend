// Multiplier Dashboard Types
export interface UserProfile {
  type: "IC" | "MANAGER";
  name: string;
  confidence: number;
}

export interface MultiplierInfo {
  type: "leadership" | "process";
  percentage: number;
  description: string;
  category: string;
  cooldownHours?: number;
}

export interface MultiplierStats {
  totalMultipliedActions: number;
  totalBonusXP: number;
  lastMultipliedAction?: Date;
  currentStreakDays: number;
}

export interface ProfileDetectionResponse {
  profile: UserProfile;
  availableMultipliers: MultiplierInfo[];
  stats: MultiplierStats;
}
