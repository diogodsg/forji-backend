export interface ReportSummary {
  userId: number;
  name: string;
  email: string;
  githubId?: string;
  pdi: {
    exists: boolean;
    progress: number; // 0..1
    updatedAt?: string;
  };
  prs: {
    open: number;
    merged: number;
    closed: number;
    lastActivity?: string;
  };
}

export interface ManagerMetrics {
  totalReports: number;
  prs: { open: number; merged: number; closed: number };
  pdiActive: number; // count of reports with pdi.exists true
  avgPdiProgress: number; // 0..1
  velocityPerDevWeek?: number;
  leadTimeAvgDays?: number;
}

export interface ManagerDashboardData {
  reports: ReportSummary[];
  metrics: ManagerMetrics;
}
