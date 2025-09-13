// MOVED from src/utils/pdi.ts
import type { PdiMilestone, PdiKeyResult, PdiPlan } from "..";

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
export function makeMilestone(partial?: Partial<PdiMilestone>): PdiMilestone {
  return {
    id: crypto.randomUUID(),
    date: todayISO(),
    title: `Encontro (${todayISO()})`,
    summary: "",
    improvements: [],
    positives: [],
    resources: [],
    tasks: [],
    suggestions: [],
    ...partial,
  } as PdiMilestone;
}
export function makeKeyResult(partial?: Partial<PdiKeyResult>): PdiKeyResult {
  return {
    id: crypto.randomUUID(),
    description: "Nova KR",
    successCriteria: "Definir critério de sucesso",
    currentStatus: "",
    improvementActions: [],
    ...partial,
  } as PdiKeyResult;
}
export function sortMilestonesDesc(list: PdiMilestone[]): PdiMilestone[] {
  return [...list].sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (da === db) return 0;
    return da < db ? 1 : -1;
  });
}
export interface EditingContext {
  editingMilestones: Set<string>;
  editingSections: { competencies: boolean; krs: boolean; results: boolean };
}
export function mergeServerPlan(
  local: PdiPlan,
  server: PdiPlan,
  ctx: EditingContext
): PdiPlan {
  const anySectionEditing =
    ctx.editingSections.competencies ||
    ctx.editingSections.krs ||
    ctx.editingSections.results;
  if (ctx.editingMilestones.size === 0 && !anySectionEditing) return server;
  const mergedMilestones = local.milestones.map((m) => {
    if (ctx.editingMilestones.has(m.id)) return m;
    const s = server.milestones.find((sm) => sm.id === m.id);
    return s || m;
  });
  server.milestones.forEach((sm) => {
    if (!mergedMilestones.some((m) => m.id === sm.id))
      mergedMilestones.push(sm);
  });
  return {
    ...local,
    competencies: ctx.editingSections.competencies
      ? local.competencies
      : server.competencies,
    krs: ctx.editingSections.krs ? local.krs : server.krs,
    records: ctx.editingSections.results ? local.records : server.records,
    milestones: mergedMilestones,
    updatedAt: server.updatedAt,
  };
}
