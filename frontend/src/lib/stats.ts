import type { PdiPlan } from "../features/pdi";
import type { PullRequest } from "../features/prs";

export interface PdiDerivedStats {
  competenciesCount: number;
  openKrs: number;
  meetings: number;
  avgProgressPct: number;
}

export function getPdiStats(plan?: PdiPlan): PdiDerivedStats {
  if (!plan)
    return { competenciesCount: 0, openKrs: 0, meetings: 0, avgProgressPct: 0 };
  const competenciesCount = plan.competencies.length;
  const krs = plan.krs || [];
  const openKrs = krs.length; // refine later using status
  const meetings = plan.milestones.length; // treat milestones as encontros
  const completed = krs.filter((kr) =>
    (kr.currentStatus || "").toLowerCase().includes("done")
  ).length;
  const avgProgressPct = krs.length ? (completed / krs.length) * 100 : 0;
  return { competenciesCount, openKrs, meetings, avgProgressPct };
}

export interface PrDerivedStats {
  total: number;
  open: number;
  merged: number;
  closed: number;
  avgMergeHours: number; // mantido para outros usos eventuais
  additions: number;
  deletions: number;
  totalLines: number; // = additions + deletions (legacy)
}

export function getPrStats(prs: PullRequest[]): PrDerivedStats {
  const open = prs.filter((p) => p.state === "open").length;
  const merged = prs.filter((p) => p.state === "merged").length;
  const closed = prs.filter((p) => p.state === "closed").length;
  const mergedDurationsMinutes: number[] = prs
    .filter((p) => p.merged_at)
    .map((p) => {
      const created = new Date(p.created_at);
      const mergedDate = new Date(p.merged_at!);
      return (mergedDate.getTime() - created.getTime()) / 60000;
    });
  const avgMergeHours = mergedDurationsMinutes.length
    ? mergedDurationsMinutes.reduce((a, b) => a + b, 0) /
      mergedDurationsMinutes.length /
      60
    : 0;
  const toNum = (v: any) => (typeof v === "number" ? v : Number(v) || 0);
  const additions = prs.reduce((acc, p) => acc + toNum(p.lines_added), 0);
  const deletions = prs.reduce((acc, p) => acc + toNum(p.lines_deleted), 0);
  const totalLines = additions + deletions;
  return {
    total: prs.length,
    open,
    merged,
    closed,
    avgMergeHours,
    additions,
    deletions,
    totalLines,
  };
}
