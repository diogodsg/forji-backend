// MOVED from src/utils/pdi.ts
import type {
  PdiMilestone,
  PdiKeyResult,
  PdiPlan,
  PdiCompetencyRecord,
} from "..";

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
export function makeMilestone(partial?: Partial<PdiMilestone>): PdiMilestone {
  // Novo naming: acompanhamento - YYYY-MM-DD
  return {
    id: crypto.randomUUID(),
    date: todayISO(),
    title: `acompanhamento - ${todayISO()}`,
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
  // Merge records with per-record freshness (client wins if it has a local more recently edited marker)
  let mergedRecords: PdiCompetencyRecord[];
  if (ctx.editingSections.results) {
    const serverMap = new Map(server.records.map((r) => [r.area, r]));
    mergedRecords = local.records.map((lr) => {
      const sr = serverMap.get(lr.area);
      if (!sr) return lr; // new local record not yet on server
      const lTime = (lr as any).lastEditedAt
        ? Date.parse((lr as any).lastEditedAt)
        : 0;
      const sTime = (sr as any).lastEditedAt
        ? Date.parse((sr as any).lastEditedAt)
        : 0;
      if (lTime >= sTime) return lr; // keep local newer or equal
      return sr; // server is fresher
    });
    // add any server records missing locally (deleted locally only while editing results? keep server)
    server.records.forEach((sr) => {
      if (!mergedRecords.some((r) => r.area === sr.area))
        mergedRecords.push(sr);
    });
  } else {
    mergedRecords = server.records;
  }
  return {
    ...local,
    competencies: ctx.editingSections.competencies
      ? local.competencies
      : server.competencies,
    krs: ctx.editingSections.krs ? local.krs : server.krs,
    records: mergedRecords,
    milestones: mergedMilestones,
    updatedAt: server.updatedAt,
  };
}
