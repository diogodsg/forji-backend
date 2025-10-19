/**
 * 📆 Cycles API Endpoints
 *
 * Implementa todos os endpoints de Cycles, Goals, Competencies e Activities
 * seguindo exatamente a API documentada no backend.
 *
 * Backend Swagger: http://localhost:8000/api/docs
 * Backend Controllers:
 * - /backend/src/cycles/cycles.controller.ts
 * - /backend/src/goals/goals.controller.ts
 * - /backend/src/competencies/competencies.controller.ts
 * - /backend/src/activities/activities.controller.ts
 */

import { apiClient } from "../client";
import type {
  // Cycles
  CreateCycleDto,
  UpdateCycleDto,
  CycleResponseDto,
  CycleStatsDto,
  // Goals
  CreateGoalDto,
  UpdateGoalDto,
  UpdateGoalProgressDto,
  GoalResponseDto,
  GoalUpdateHistoryDto,
  GoalFiltersDto,
  // Competencies
  CreateCompetencyDto,
  UpdateCompetencyDto,
  UpdateCompetencyProgressDto,
  CompetencyResponseDto,
  CompetencyUpdateHistoryDto,
  CompetencyLibraryDto,
  CompetencyFiltersDto,
  // Activities
  CreateOneOnOneDto,
  CreateMentoringDto,
  CreateCertificationDto,
  OneOnOneActivityResponseDto,
  MentoringActivityResponseDto,
  CertificationActivityResponseDto,
  ActivityTimelineDto,
  ActivityFiltersDto,
} from "@/shared-types";

// ==========================================
// CYCLES ENDPOINTS
// ==========================================

/**
 * POST /cycles - Criar novo ciclo
 */
export async function createCycle(
  data: CreateCycleDto
): Promise<CycleResponseDto> {
  const response = await apiClient.post<CycleResponseDto>("/cycles", data);
  return response.data;
}

/**
 * GET /cycles/current - Obter ciclo ativo atual
 */
export async function getCurrentCycle(): Promise<CycleResponseDto | null> {
  try {
    const response = await apiClient.get<CycleResponseDto>("/cycles/current");
    return response.data;
  } catch (error: any) {
    // Se não houver ciclo ativo, retorna null ao invés de error
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * GET /cycles - Listar ciclos com filtros
 */
export async function listCycles(filters?: {
  isActive?: boolean;
  type?: string;
}): Promise<CycleResponseDto[]> {
  const response = await apiClient.get<CycleResponseDto[]>("/cycles", {
    params: filters,
  });
  return response.data;
}

/**
 * GET /cycles/:id - Obter detalhes do ciclo
 */
export async function getCycleById(id: string): Promise<CycleResponseDto> {
  const response = await apiClient.get<CycleResponseDto>(`/cycles/${id}`);
  return response.data;
}

/**
 * GET /cycles/:id/stats - Obter estatísticas do ciclo
 */
export async function getCycleStats(id: string): Promise<CycleStatsDto> {
  const response = await apiClient.get<CycleStatsDto>(`/cycles/${id}/stats`);
  return response.data;
}

/**
 * PATCH /cycles/:id - Atualizar ciclo
 */
export async function updateCycle(
  id: string,
  data: UpdateCycleDto
): Promise<CycleResponseDto> {
  const response = await apiClient.patch<CycleResponseDto>(
    `/cycles/${id}`,
    data
  );
  return response.data;
}

/**
 * DELETE /cycles/:id - Soft delete do ciclo
 */
export async function deleteCycle(id: string): Promise<void> {
  await apiClient.delete(`/cycles/${id}`);
}

// ==========================================
// GOALS ENDPOINTS
// ==========================================

/**
 * POST /goals - Criar nova meta
 */
export async function createGoal(
  data: CreateGoalDto
): Promise<GoalResponseDto> {
  const response = await apiClient.post<GoalResponseDto>("/goals", data);
  return response.data;
}

/**
 * GET /goals - Listar metas com filtros
 */
export async function listGoals(
  filters?: GoalFiltersDto
): Promise<GoalResponseDto[]> {
  const response = await apiClient.get<GoalResponseDto[]>("/goals", {
    params: filters,
  });
  return response.data;
}

/**
 * GET /goals/:id - Obter detalhes da meta
 */
export async function getGoalById(id: string): Promise<GoalResponseDto> {
  const response = await apiClient.get<GoalResponseDto>(`/goals/${id}`);
  return response.data;
}

/**
 * GET /goals/:id/history - Obter histórico de atualizações
 */
export async function getGoalHistory(
  id: string
): Promise<GoalUpdateHistoryDto[]> {
  const response = await apiClient.get<GoalUpdateHistoryDto[]>(
    `/goals/${id}/history`
  );
  return response.data;
}

/**
 * PATCH /goals/:id - Atualizar meta
 */
export async function updateGoal(
  id: string,
  data: UpdateGoalDto
): Promise<GoalResponseDto> {
  const response = await apiClient.patch<GoalResponseDto>(`/goals/${id}`, data);
  return response.data;
}

/**
 * PATCH /goals/:id/progress - Atualizar progresso + XP 🔥
 */
export async function updateGoalProgress(
  id: string,
  data: UpdateGoalProgressDto
): Promise<GoalResponseDto> {
  const response = await apiClient.patch<GoalResponseDto>(
    `/goals/${id}/progress`,
    data
  );
  return response.data;
}

/**
 * DELETE /goals/:id - Soft delete da meta
 */
export async function deleteGoal(id: string): Promise<void> {
  await apiClient.delete(`/goals/${id}`);
}

// ==========================================
// COMPETENCIES ENDPOINTS
// ==========================================

/**
 * GET /competencies/library - Biblioteca de competências predefinidas
 */
export async function getCompetencyLibrary(): Promise<CompetencyLibraryDto[]> {
  const response = await apiClient.get<CompetencyLibraryDto[]>(
    "/competencies/library"
  );
  return response.data;
}

/**
 * POST /competencies - Criar nova competência
 */
export async function createCompetency(
  data: CreateCompetencyDto
): Promise<CompetencyResponseDto> {
  const response = await apiClient.post<CompetencyResponseDto>(
    "/competencies",
    data
  );
  return response.data;
}

/**
 * GET /competencies - Listar competências com filtros
 */
export async function listCompetencies(
  filters?: CompetencyFiltersDto
): Promise<CompetencyResponseDto[]> {
  const response = await apiClient.get<CompetencyResponseDto[]>(
    "/competencies",
    {
      params: filters,
    }
  );
  return response.data;
}

/**
 * GET /competencies/:id - Obter detalhes da competência
 */
export async function getCompetencyById(
  id: string
): Promise<CompetencyResponseDto> {
  const response = await apiClient.get<CompetencyResponseDto>(
    `/competencies/${id}`
  );
  return response.data;
}

/**
 * GET /competencies/:id/history - Obter histórico de evolução
 */
export async function getCompetencyHistory(
  id: string
): Promise<CompetencyUpdateHistoryDto[]> {
  const response = await apiClient.get<CompetencyUpdateHistoryDto[]>(
    `/competencies/${id}/history`
  );
  return response.data;
}

/**
 * PATCH /competencies/:id - Atualizar competência
 */
export async function updateCompetency(
  id: string,
  data: UpdateCompetencyDto
): Promise<CompetencyResponseDto> {
  const response = await apiClient.patch<CompetencyResponseDto>(
    `/competencies/${id}`,
    data
  );
  return response.data;
}

/**
 * PATCH /competencies/:id/progress - Atualizar progresso + XP 🔥
 */
export async function updateCompetencyProgress(
  id: string,
  data: UpdateCompetencyProgressDto
): Promise<CompetencyResponseDto> {
  const response = await apiClient.patch<CompetencyResponseDto>(
    `/competencies/${id}/progress`,
    data
  );
  return response.data;
}

/**
 * DELETE /competencies/:id - Soft delete da competência
 */
export async function deleteCompetency(id: string): Promise<void> {
  await apiClient.delete(`/competencies/${id}`);
}

// ==========================================
// ACTIVITIES ENDPOINTS
// ==========================================

/**
 * POST /activities - Criar atividade 1:1
 * Espera CreateActivityDto completo (não apenas oneOnOneData)
 */
export async function createOneOnOneActivity(
  data: CreateOneOnOneDto
): Promise<OneOnOneActivityResponseDto> {
  const response = await apiClient.post<OneOnOneActivityResponseDto>(
    "/activities",
    data // Envia o DTO completo já formatado
  );
  return response.data;
}

/**
 * POST /activities - Criar atividade de mentoria
 */
export async function createMentoringActivity(
  data: CreateMentoringDto
): Promise<MentoringActivityResponseDto> {
  const response = await apiClient.post<MentoringActivityResponseDto>(
    "/activities",
    {
      ...data,
      type: "MENTORING",
      mentoringData: data,
    }
  );
  return response.data;
}

/**
 * POST /activities - Criar atividade de certificação
 */
export async function createCertificationActivity(
  data: CreateCertificationDto
): Promise<CertificationActivityResponseDto> {
  const response = await apiClient.post<CertificationActivityResponseDto>(
    "/activities",
    {
      ...data,
      type: "CERTIFICATION",
      certificationData: data,
    }
  );
  return response.data;
}

/**
 * GET /activities/timeline - Listar atividades (timeline) com filtros
 */
export async function listActivities(
  filters?: ActivityFiltersDto
): Promise<ActivityTimelineDto[]> {
  const response = await apiClient.get<any>("/activities/timeline", {
    params: filters,
  });
  // Backend retorna objeto paginado: {activities: [...], page, total, etc}
  // Extrair apenas o array de activities
  if (response.data && Array.isArray(response.data.activities)) {
    return response.data.activities;
  }
  // Fallback: se já for array direto, retornar
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * GET /activities/:id - Obter detalhes da atividade
 */
export async function getActivityById(
  id: string
): Promise<ActivityTimelineDto> {
  const response = await apiClient.get<ActivityTimelineDto>(
    `/activities/${id}`
  );
  return response.data;
}

/**
 * GET /activities/stats - Estatísticas de atividades
 */
export async function getActivitiesStats(cycleId?: string): Promise<{
  totalActivities: number;
  byType: Record<string, number>;
  totalXp: number;
}> {
  const response = await apiClient.get("/activities/stats", {
    params: { cycleId },
  });
  return response.data;
}

/**
 * DELETE /activities/:id - Soft delete da atividade
 */
export async function deleteActivity(id: string): Promise<void> {
  await apiClient.delete(`/activities/${id}`);
}

// ==========================================
// EXPORT ALL
// ==========================================

export const cyclesApi = {
  // Cycles
  createCycle,
  getCurrentCycle,
  listCycles,
  getCycleById,
  getCycleStats,
  updateCycle,
  deleteCycle,

  // Goals
  createGoal,
  listGoals,
  getGoalById,
  getGoalHistory,
  updateGoal,
  updateGoalProgress,
  deleteGoal,

  // Competencies
  getCompetencyLibrary,
  createCompetency,
  listCompetencies,
  getCompetencyById,
  getCompetencyHistory,
  updateCompetency,
  updateCompetencyProgress,
  deleteCompetency,

  // Activities
  createOneOnOneActivity,
  createMentoringActivity,
  createCertificationActivity,
  listActivities,
  getActivityById,
  getActivitiesStats,
  deleteActivity,
};
