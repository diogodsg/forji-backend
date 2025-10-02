import type { PdiPlan } from "../features/pdi";

function computeTemporalProgress(plan: PdiPlan): number {
  const activeCycle = plan.cycles?.find(c => c.status === 'active');
  if (!activeCycle) return 0;
  const start = new Date(activeCycle.startDate).getTime();
  const end = new Date(activeCycle.endDate).getTime();
  if (isNaN(start) || isNaN(end) || end <= start) return 0;
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return ((now - start) / (end - start)) * 100;
}

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
  // Progress agora baseado apenas em tempo do ciclo ativo, conforme especificação.
  const avgProgressPct = computeTemporalProgress(plan);
  return { competenciesCount, openKrs, meetings, avgProgressPct };
}
