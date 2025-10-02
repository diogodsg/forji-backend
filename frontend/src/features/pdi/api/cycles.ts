import { api } from '../../../lib/apiClient';

export interface ServerPdiCycle {
  id: number;
  userId: number;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
  competencies: string[];
  krs?: any;
  milestones: any;
  records: any;
  progressMeta?: any;
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
    status: c.status.toLowerCase().replace('planned','planned').replace('active','active').replace('completed','completed').replace('paused','paused') as any,
    pdi: {
      competencies: c.competencies ?? [],
      milestones: c.milestones ?? [],
      krs: c.krs ?? [],
      records: c.records ?? [],
    },
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export async function fetchMyCycles() {
  const data = await api<ServerPdiCycle[]>(`/pdi/cycles/me`, { auth: true });
  return data.map(mapServerCycle);
}

export async function createCycle(payload: {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  competencies?: string[];
  krs?: any;
  milestones: any;
  records: any;
}) {
  const data = await api<ServerPdiCycle>(`/pdi/cycles`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
  return mapServerCycle(data);
}

export async function updateCycle(id: string | number, partial: any) {
  const data = await api<ServerPdiCycle>(`/pdi/cycles/${id}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(partial),
  });
  return mapServerCycle(data);
}

export async function changeCycleStatus(id: string | number, status: string) {
  const data = await api<ServerPdiCycle>(`/pdi/cycles/${id}/status`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify({ status: status.toUpperCase() }),
  });
  return mapServerCycle(data);
}

export async function deleteCycle(id: string | number) {
  await api(`/pdi/cycles/${id}`, { method: 'DELETE', auth: true });
}