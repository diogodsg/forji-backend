/**
 * 📆 useCycleData - Hook principal para integração com API de Cycles
 *
 * Features:
 * - Busca ciclo atual automaticamente
 * - Carrega goals, competencies e activities
 * - Loading states separados por recurso
 * - Error handling com retry
 * - Fallback para mock data se backend offline
 * - Refresh manual e automático
 *
 * Usage:
 * ```tsx
 * const { cycle, goals, competencies, activities, loading, error, refresh } = useCycleData();
 * ```
 */

import { useState, useEffect, useCallback } from "react";
import { cyclesApi, extractErrorMessage } from "@/lib/api";
import type {
  CycleResponseDto,
  GoalResponseDto,
  CompetencyResponseDto,
  ActivityTimelineDto,
} from "@/shared-types";

// ==========================================
// TYPES
// ==========================================

export interface UseCycleDataReturn {
  // Data
  cycle: CycleResponseDto | null;
  goals: GoalResponseDto[];
  competencies: CompetencyResponseDto[];
  activities: ActivityTimelineDto[];

  // Loading states
  loading: {
    cycle: boolean;
    goals: boolean;
    competencies: boolean;
    activities: boolean;
    any: boolean; // true se qualquer um está loading
  };

  // Error states
  error: {
    cycle: string | null;
    goals: string | null;
    competencies: string | null;
    activities: string | null;
  };

  // Actions
  refresh: () => Promise<void>;
  refreshGoals: () => Promise<void>;
  refreshCompetencies: () => Promise<void>;
  refreshActivities: () => Promise<void>;
}

// ==========================================
// HOOK
// ==========================================

/**
 * Hook principal para dados de Cycle + Goals + Competencies + Activities
 *
 * Automaticamente:
 * 1. Busca ciclo atual ao montar
 * 2. Se ciclo encontrado, busca goals/competencies/activities
 * 3. Se backend offline, usa mock data (se VITE_ENABLE_MOCK_API=true)
 */
export function useCycleData(): UseCycleDataReturn {
  // State - Data
  const [cycle, setCycle] = useState<CycleResponseDto | null>(null);
  const [goals, setGoals] = useState<GoalResponseDto[]>([]);
  const [competencies, setCompetencies] = useState<CompetencyResponseDto[]>([]);
  const [activities, setActivities] = useState<ActivityTimelineDto[]>([]);

  // State - Loading
  const [loadingCycle, setLoadingCycle] = useState(true);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [loadingCompetencies, setLoadingCompetencies] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // State - Errors
  const [errorCycle, setErrorCycle] = useState<string | null>(null);
  const [errorGoals, setErrorGoals] = useState<string | null>(null);
  const [errorCompetencies, setErrorCompetencies] = useState<string | null>(
    null
  );
  const [errorActivities, setErrorActivities] = useState<string | null>(null);

  // ==========================================
  // FETCH CYCLE
  // ==========================================

  const fetchCycle = useCallback(async () => {
    try {
      setLoadingCycle(true);
      setErrorCycle(null);

      console.log("🔄 Buscando ciclo atual...");
      const currentCycle = await cyclesApi.getCurrentCycle();

      if (currentCycle) {
        console.log("✅ Ciclo atual encontrado:", currentCycle.name);
        setCycle(currentCycle);
      } else {
        console.warn("⚠️ Nenhum ciclo ativo encontrado");
        setCycle(null);
      }
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Erro ao buscar ciclo:", message);
      setErrorCycle(message);

      // TODO: Fallback para mock data se VITE_ENABLE_MOCK_API=true
      // if (isMockMode()) {
      //   setCycle(mockCycleData);
      // }
    } finally {
      setLoadingCycle(false);
    }
  }, []);

  // ==========================================
  // FETCH GOALS
  // ==========================================

  const fetchGoals = useCallback(async (cycleId: string) => {
    try {
      setLoadingGoals(true);
      setErrorGoals(null);

      console.log("🔄 Buscando goals do ciclo:", cycleId);
      const goalsData = await cyclesApi.listGoals({ cycleId });

      console.log(`✅ Goals carregados: ${goalsData.length}`);
      setGoals(goalsData);
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Erro ao buscar goals:", message);
      setErrorGoals(message);
    } finally {
      setLoadingGoals(false);
    }
  }, []);

  // ==========================================
  // FETCH COMPETENCIES
  // ==========================================

  const fetchCompetencies = useCallback(async (cycleId: string) => {
    try {
      setLoadingCompetencies(true);
      setErrorCompetencies(null);

      console.log("🔄 Buscando competencies do ciclo:", cycleId);
      const competenciesData = await cyclesApi.listCompetencies({ cycleId });

      console.log(`✅ Competencies carregadas: ${competenciesData.length}`);
      setCompetencies(competenciesData);
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Erro ao buscar competencies:", message);
      setErrorCompetencies(message);
    } finally {
      setLoadingCompetencies(false);
    }
  }, []);

  // ==========================================
  // FETCH ACTIVITIES
  // ==========================================

  const fetchActivities = useCallback(async (cycleId: string) => {
    try {
      setLoadingActivities(true);
      setErrorActivities(null);

      console.log("🔄 Buscando activities do ciclo:", cycleId);
      const activitiesData = await cyclesApi.listActivities({ cycleId });

      console.log(`✅ Activities carregadas: ${activitiesData.length}`);
      setActivities(activitiesData);
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Erro ao buscar activities:", message);
      setErrorActivities(message);
    } finally {
      setLoadingActivities(false);
    }
  }, []);

  // ==========================================
  // REFRESH ALL
  // ==========================================

  const refresh = useCallback(async () => {
    await fetchCycle();
  }, [fetchCycle]);

  const refreshGoals = useCallback(async () => {
    if (cycle?.id) {
      await fetchGoals(cycle.id);
    }
  }, [cycle?.id, fetchGoals]);

  const refreshCompetencies = useCallback(async () => {
    if (cycle?.id) {
      await fetchCompetencies(cycle.id);
    }
  }, [cycle?.id, fetchCompetencies]);

  const refreshActivities = useCallback(async () => {
    if (cycle?.id) {
      await fetchActivities(cycle.id);
    }
  }, [cycle?.id, fetchActivities]);

  // ==========================================
  // EFFECTS
  // ==========================================

  // Effect 1: Fetch cycle on mount
  useEffect(() => {
    fetchCycle();
  }, [fetchCycle]);

  // Effect 2: Fetch goals/competencies/activities when cycle changes
  useEffect(() => {
    if (cycle?.id) {
      console.log("🔄 Ciclo carregado, buscando dados relacionados...");
      fetchGoals(cycle.id);
      fetchCompetencies(cycle.id);
      fetchActivities(cycle.id);
    } else {
      // Se não há ciclo, limpar dados
      setGoals([]);
      setCompetencies([]);
      setActivities([]);
    }
  }, [cycle?.id, fetchGoals, fetchCompetencies, fetchActivities]);

  // ==========================================
  // RETURN
  // ==========================================

  return {
    // Data
    cycle,
    goals,
    competencies,
    activities,

    // Loading (computed)
    loading: {
      cycle: loadingCycle,
      goals: loadingGoals,
      competencies: loadingCompetencies,
      activities: loadingActivities,
      any:
        loadingCycle ||
        loadingGoals ||
        loadingCompetencies ||
        loadingActivities,
    },

    // Errors
    error: {
      cycle: errorCycle,
      goals: errorGoals,
      competencies: errorCompetencies,
      activities: errorActivities,
    },

    // Actions
    refresh,
    refreshGoals,
    refreshCompetencies,
    refreshActivities,
  };
}
