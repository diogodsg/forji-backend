/**
 * Normalized Pull Request shape used across the frontend.
 */
export interface PullRequest {
  id: string;
  author: string;
  user?: string | null; // GitHub login (coluna `user` na tabela), pode ser null
  repo: string;
  title: string;
  created_at: string; // ISO
  merged_at?: string; // ISO | undefined
  state: "open" | "closed" | "merged";
  lines_added: number;
  lines_deleted: number;
  files_changed: number;
  ai_review_summary: string; // markdown-like text
  review_comments_highlight: string[];
}

/**
 * Weekly aggregated metrics time-series point.
 */
export interface WeeklyMetricPoint {
  weekStart: string; // YYYY-MM-DD
  prs: number;
  avgTimeToMergeHours: number;
  reworkRatePct: number; // 0-100
}

/**
 * Aggregate snapshot metrics over a time window.
 */
export interface AggregatedMetrics {
  totalPrs: number;
  avgTimeToMergeHours: number;
  reworkPct: number;
}
