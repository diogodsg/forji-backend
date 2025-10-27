/**
 * 📆 useSubordinateCycleData - Hook para buscar dados de PDI de subordinados
 *
 * IMPORTANTE: Este hook usa uma solução temporária chamando endpoints
 * que retornam dados do usuário logado (gestor), não do subordinado.
 *
 * TODO: Quando os endpoints de management estiverem prontos, substituir por:
 * - GET /management/subordinates/:userId/cycles/current
 * - GET /management/subordinates/:userId/goals
 * - GET /management/subordinates/:userId/competencies
 * - GET /management/subordinates/:userId/activities
 */

import { useState, useEffect, useCallback } from "react";
import { usersApi } from "@/lib/api/endpoints/users";
import type {
  CycleResponseDto,
  GoalResponseDto,
  CompetencyResponseDto,
  ActivityTimelineDto,
} from "../../../../../shared-types/cycles.types";

export interface UseSubordinateCycleDataReturn {
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
    any: boolean;
  };

  // Error states
  error: {
    cycle: string | null;
    goals: string | null;
    competencies: string | null;
    activities: string | null;
    any: boolean;
  };

  // Refresh functions
  refresh: () => Promise<void>;
  refreshGoals: () => Promise<void>;
  refreshCompetencies: () => Promise<void>;
  refreshActivities: () => Promise<void>;
}

/**
 * Hook para buscar dados de ciclo/goals/competencies/activities de um subordinado
 *
 * @param userId - ID do subordinado
 */
export function useSubordinateCycleData(
  userId: string
): UseSubordinateCycleDataReturn {
  // State - Data
  const [cycle, setCycle] = useState<CycleResponseDto | null>(null);
  const [goals, setGoals] = useState<GoalResponseDto[]>([]);
  const [competencies, setCompetencies] = useState<CompetencyResponseDto[]>([]);
  const [activities, setActivities] = useState<ActivityTimelineDto[]>([]);

  // State - Loading
  const [loadingCycle, setLoadingCycle] = useState(true);

  // State - Errors
  const [errorCycle, setErrorCycle] = useState<string | null>(null);

  // ==========================================
  // FETCH USER PROFILE TO GET CYCLE DATA
  // ==========================================

  // ==========================================
  // FETCH SUBORDINATE DATA FROM API
  // ==========================================

  const fetchSubordinateData = useCallback(async () => {
    if (!userId) {
      console.warn("⚠️ userId não fornecido");
      return;
    }

    try {
      setLoadingCycle(true);
      setErrorCycle(null);

      console.log("🔄 Buscando dados do subordinado:", userId);

      // Buscar perfil do usuário
      const user = await usersApi.findOne(userId);

      console.log("👤 Dados do subordinado obtidos:", user);

      // TODO: Implementar busca de dados reais quando endpoints estiverem prontos
      // Por enquanto, retornar estados vazios ao invés de mocks
      setCycle(null);
      setGoals([]);
      setCompetencies([]);
      setActivities([]);

      console.log(
        "✅ Dados do subordinado configurados (vazios temporariamente):",
        user.name
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao buscar dados do subordinado";
      console.error("❌ Erro ao buscar dados do subordinado:", message);
      setErrorCycle(message);

      // Em caso de erro, também retornar estados vazios
      setCycle(null);
      setGoals([]);
      setCompetencies([]);
      setActivities([]);
    } finally {
      setLoadingCycle(false);
    }
  }, [userId]);

  // ==========================================
  // REFRESH FUNCTIONS (placeholders)
  // ==========================================

  const refresh = useCallback(async () => {
    await fetchSubordinateData();
  }, [fetchSubordinateData]);

  const refreshGoals = useCallback(async () => {
    console.log("🔄 RefreshGoals para subordinado ainda não implementado");
  }, []);

  const refreshCompetencies = useCallback(async () => {
    console.log(
      "🔄 RefreshCompetencies para subordinado ainda não implementado"
    );
  }, []);

  const refreshActivities = useCallback(async () => {
    console.log("🔄 RefreshActivities para subordinado ainda não implementado");
  }, []);

  // ==========================================
  // EFFECTS
  // ==========================================

  useEffect(() => {
    fetchSubordinateData();
  }, [fetchSubordinateData]);

  // ==========================================
  // RETURN
  // ==========================================

  return {
    cycle,
    goals,
    competencies,
    activities,

    loading: {
      cycle: loadingCycle,
      goals: false,
      competencies: false,
      activities: false,
      any: loadingCycle,
    },

    error: {
      cycle: errorCycle,
      goals: null,
      competencies: null,
      activities: null,
      any: !!errorCycle,
    },

    refresh,
    refreshGoals,
    refreshCompetencies,
    refreshActivities,
  };
}
