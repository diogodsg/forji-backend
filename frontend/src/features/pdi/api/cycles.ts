import { api } from "../../../lib/apiClient";

export interface ServerPdiCycle {
  id: number;
  userId: number;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  status: "PLANNED" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";
  competencies: string[];
  krs?: unknown;
  milestones: unknown;
  records: unknown;
  progressMeta?: unknown;
  createdAt: string;
  updatedAt: string;
}

// Normalização para o tipo de UI existente (lowercase status + agrupado em pdi)
export function mapServerCycle(c: ServerPdiCycle) {
  return {
    id: String(c.id),
    title: c.title,
    description: c.description ?? undefined,
    startDate: c.startDate,
    endDate: c.endDate,
    status: c.status
      .toLowerCase()
      .replace("planned", "planned")
      .replace("active", "active")
      .replace("completed", "completed")
      .replace("paused", "paused") as
      | "planned"
      | "active"
      | "completed"
      | "paused",
    pdi: {
      competencies: Array.isArray(c.competencies) ? c.competencies : [],
      milestones: Array.isArray(c.milestones) ? c.milestones : [],
      krs: Array.isArray(c.krs) ? c.krs : [],
      records: Array.isArray(c.records) ? c.records : [],
    },
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export async function fetchMyCycles() {
  const data = await api<ServerPdiCycle[]>(`/pdi/cycles/me`, { auth: true });
  return data.map(mapServerCycle);
}

export async function fetchCyclesForUser(userId: number) {
  const data = await api<ServerPdiCycle[]>(`/pdi/cycles/${userId}`, {
    auth: true,
  });
  return data.map(mapServerCycle);
}

export async function fetchMyCycleById(cycleId: string | number) {
  const data = await api<ServerPdiCycle>(`/pdi/cycles/me/${cycleId}`, {
    auth: true,
  });
  return mapServerCycle(data);
}

export async function createCycle(payload: {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  competencies?: string[];
  krs?: unknown;
  milestones: unknown;
  records: unknown;
}) {
  const data = await api<ServerPdiCycle>(`/pdi/cycles`, {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
  return mapServerCycle(data);
}

export async function createCycleForUser(
  userId: number,
  payload: {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    competencies?: string[];
    krs?: unknown;
    milestones: unknown;
    records: unknown;
  }
) {
  const data = await api<ServerPdiCycle>(`/pdi/cycles/${userId}`, {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
  return mapServerCycle(data);
}

export async function updateCycle(
  id: string | number,
  partial: Record<string, unknown>
) {
  const data = await api<ServerPdiCycle>(`/pdi/cycles/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(partial),
  });
  return mapServerCycle(data);
}

export async function changeCycleStatus(id: string | number, status: string) {
  const data = await api<ServerPdiCycle>(`/pdi/cycles/${id}/status`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ status: status.toUpperCase() }),
  });
  return mapServerCycle(data);
}

export async function deleteCycle(id: string | number) {
  await api(`/pdi/cycles/${id}`, { method: "DELETE", auth: true });
}
