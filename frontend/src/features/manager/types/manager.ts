export interface ReportSummary {
  userId: number;
  name: string;
  email: string;
  githubId?: string;
  position?: string | null;
  bio?: string | null;
  teams?: Array<{ id: number; name: string }>;
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

export interface TeamDetail {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  memberships: Array<{
    user: { id: number; name: string; email: string };
    role: string;
  }>;
}

export interface ManagerDashboardCompleteData extends ManagerDashboardData {
  teams: TeamDetail[];
}
