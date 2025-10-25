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
  // FETCH USER PROFILE TO GET CYCLE DATA
  // ==========================================

  // Função auxiliar para gerar dados mock do subordinado
  const generateMockCycleData = useCallback(
    (userId: string, userName: string) => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), 0, 1); // Janeiro
      const endDate = new Date(now.getFullYear(), 11, 31); // Dezembro

      // Mock de ciclo ativo
      const mockCycle: CycleResponseDto = {
        id: `cycle-${userId}`,
        name: `Ciclo de Desenvolvimento ${now.getFullYear()}`,
        type: "ANUAL" as any,
        status: "ACTIVE" as any,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: userId,
        workspaceId: "workspace-1",
        createdAt: startDate.toISOString(),
        updatedAt: now.toISOString(),
        totalXP: 250,
        goalsCount: 3,
        competenciesCount: 2,
        activitiesCount: 5,
      };

      // Mock de goals
      const mockGoals: GoalResponseDto[] = [
        {
          id: `goal-1-${userId}`,
          title: "Melhorar habilidades de comunicação",
          description: "Desenvolver apresentações mais eficazes e claras",
          type: "PERCENTAGE" as any,
          status: "ACTIVE" as any,
          progress: 60,
          currentValue: 60,
          targetValue: 100,
          startValue: 0,
          unit: "%",
          cycleId: `cycle-${userId}`,
          userId: userId,
          workspaceId: "workspace-1",
          xpReward: 15,
          createdAt: startDate.toISOString(),
          updatedAt: now.toISOString(),
          lastUpdate: new Date(
            now.getTime() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(), // 2 dias atrás
        },
        {
          id: `goal-2-${userId}`,
          title: "Concluir certificação técnica",
          description:
            "Obter certificação em tecnologia relevante para o papel",
          type: "BINARY" as any,
          status: "ACTIVE" as any,
          progress: 80,
          currentValue: 80,
          targetValue: 100,
          startValue: 0,
          unit: "%",
          cycleId: `cycle-${userId}`,
          userId: userId,
          workspaceId: "workspace-1",
          xpReward: 20,
          createdAt: startDate.toISOString(),
          updatedAt: now.toISOString(),
          lastUpdate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(), // 5 dias atrás
        },
        {
          id: `goal-3-${userId}`,
          title: "Liderar projeto de melhoria",
          description:
            "Assumir liderança em iniciativa de otimização de processos",
          type: "PERCENTAGE" as any,
          status: "ACTIVE" as any,
          progress: 35,
          currentValue: 35,
          targetValue: 100,
          startValue: 0,
          unit: "%",
          cycleId: `cycle-${userId}`,
          userId: userId,
          workspaceId: "workspace-1",
          xpReward: 25,
          createdAt: startDate.toISOString(),
          updatedAt: now.toISOString(),
          lastUpdate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 dias atrás
        },
      ];

      // Mock de competências
      const mockCompetencies: CompetencyResponseDto[] = [
        {
          id: `comp-1-${userId}`,
          name: "Liderança",
          description: "Capacidade de inspirar e guiar equipes",
          category: "LEADERSHIP" as any,
          currentLevel: 3,
          targetLevel: 4,
          progress: 65,
          cycleId: `cycle-${userId}`,
          userId: userId,
          workspaceId: "workspace-1",
          xpReward: 15,
          createdAt: startDate.toISOString(),
          updatedAt: now.toISOString(),
          evidences: [],
        },
        {
          id: `comp-2-${userId}`,
          name: "Resolução de Problemas",
          description: "Habilidade de analisar e solucionar desafios complexos",
          category: "BEHAVIORAL" as any,
          currentLevel: 4,
          targetLevel: 5,
          progress: 45,
          cycleId: `cycle-${userId}`,
          userId: userId,
          workspaceId: "workspace-1",
          xpReward: 15,
          createdAt: startDate.toISOString(),
          updatedAt: now.toISOString(),
          evidences: [],
        },
      ];

      // Mock de atividades
      const mockActivities: ActivityTimelineDto[] = [
        {
          id: `activity-1-${userId}`,
          type: "ONE_ON_ONE" as any,
          title: `1:1 com ${userName}`,
          description: "Sessão de acompanhamento de desenvolvimento",
          userId: userId,
          cycleId: `cycle-${userId}`,
          workspaceId: "workspace-1",
          xpEarned: 15,
          createdAt: new Date(
            now.getTime() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updatedAt: new Date(
            now.getTime() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: `activity-2-${userId}`,
          type: "MENTORING" as any,
          title: "Sessão de Mentoria",
          description: "Mentoria sobre desenvolvimento de carreira",
          userId: userId,
          cycleId: `cycle-${userId}`,
          workspaceId: "workspace-1",
          xpEarned: 20,
          createdAt: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updatedAt: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: `activity-3-${userId}`,
          type: "GOAL_UPDATE" as any,
          title: "Atualização de Meta",
          description: "Progresso em comunicação",
          userId: userId,
          cycleId: `cycle-${userId}`,
          workspaceId: "workspace-1",
          xpEarned: 15,
          createdAt: new Date(
            now.getTime() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updatedAt: new Date(
            now.getTime() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ];

      return { mockCycle, mockGoals, mockCompetencies, mockActivities };
    },
    []
  );

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

      // Gerar dados mock baseados no perfil do subordinado
      const { mockCycle, mockGoals, mockCompetencies, mockActivities } =
        generateMockCycleData(userId, user.name);

      setCycle(mockCycle);
      setGoals(mockGoals);
      setCompetencies(mockCompetencies);
      setActivities(mockActivities);

      console.log("✅ Dados mock gerados para subordinado:", user.name);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao buscar dados do subordinado";
      console.error("❌ Erro ao buscar dados do subordinado:", message);
      setErrorCycle(message);

      // Em caso de erro, ainda gerar dados mock básicos
      const { mockCycle, mockGoals, mockCompetencies, mockActivities } =
        generateMockCycleData(userId, "Subordinado");

      setCycle(mockCycle);
      setGoals(mockGoals);
      setCompetencies(mockCompetencies);
      setActivities(mockActivities);
    } finally {
      setLoadingCycle(false);
    }
  }, [userId, generateMockCycleData]);

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
      goals: loadingGoals,
      competencies: loadingCompetencies,
      activities: loadingActivities,
      any:
        loadingCycle ||
        loadingGoals ||
        loadingCompetencies ||
        loadingActivities,
    },

    error: {
      cycle: errorCycle,
      goals: errorGoals,
      competencies: errorCompetencies,
      activities: errorActivities,
      any: !!(errorCycle || errorGoals || errorCompetencies || errorActivities),
    },

    refresh,
    refreshGoals,
    refreshCompetencies,
    refreshActivities,
  };
}
