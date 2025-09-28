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
}

export interface ManagerMetrics {
  totalReports: number;
  pdiActive: number; // count of reports with pdi.exists true
  avgPdiProgress: number; // 0..1
}

export interface ManagerDashboardData {
  reports: ReportSummary[];
  metrics: ManagerMetrics;
}
