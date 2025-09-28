import type { PdiPlan } from "../features/pdi";

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
