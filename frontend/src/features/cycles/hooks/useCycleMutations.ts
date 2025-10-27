/**
 * 📝 useCycleMutations - Hooks para criar/atualizar/deletar recursos do Cycle
 *
 * Separated concerns:
 * - useGoalMutations: Criar/Atualizar/Deletar goals
 * - useCompetencyMutations: Criar/Atualizar/Deletar competencies
 * - useActivityMutations: Criar activities (1:1, mentoring, certification)
 *
 * Features:
 * - Loading states
 * - Error handling
 * - Success callbacks
 * - Optimistic updates (opcional)
 */

import { useState, useCallback } from "react";
import { cyclesApi, extractErrorMessage } from "@/lib/api";
import type {
  CreateGoalDto,
  UpdateGoalDto,
  UpdateGoalProgressDto,
  GoalResponseDto,
  CreateCompetencyDto,
  UpdateCompetencyDto,
  UpdateCompetencyProgressDto,
  CompetencyResponseDto,
  CreateOneOnOneDto,
  CreateMentoringDto,
  CreateCertificationDto,
  OneOnOneActivityResponseDto,
  MentoringActivityResponseDto,
  CertificationActivityResponseDto,
} from "../../../../../shared-types";

// ==========================================
// GOAL MUTATIONS
// ==========================================

export interface UseGoalMutationsReturn {
  createGoal: (data: CreateGoalDto) => Promise<GoalResponseDto | null>;
  updateGoal: (
    id: string,
    data: UpdateGoalDto
  ) => Promise<GoalResponseDto | null>;
  updateGoalProgress: (
    id: string,
    data: UpdateGoalProgressDto
  ) => Promise<GoalResponseDto | null>;
  deleteGoal: (id: string) => Promise<boolean>;

  loading: boolean;
  error: string | null;
}

/**
 * Hook para mutations de Goals
 */
export function useGoalMutations(): UseGoalMutationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGoal = useCallback(async (data: CreateGoalDto) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🎯 Criando goal:", data.title);
      const goal = await cyclesApi.createGoal(data);

      console.log("✅ Goal criado:", goal.id);
      return goal;
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Erro ao criar goal:", message);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateGoal = useCallback(async (id: string, data: UpdateGoalDto) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🎯 Atualizando goal:", id);
      const goal = await cyclesApi.updateGoal(id, data);

      console.log("✅ Goal atualizado:", goal.id);
      return goal;
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Erro ao atualizar goal:", message);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateGoalProgress = useCallback(
    async (id: string, data: UpdateGoalProgressDto) => {
      try {
        setLoading(true);
        setError(null);

        console.log("📈 Atualizando progresso do goal:", id);
        const goal = await cyclesApi.updateGoalProgress(id, data);

        console.log("✅ Progresso atualizado! XP ganho:", goal.xpReward);
        return goal;
      } catch (err) {
        const message = extractErrorMessage(err);
        console.error("❌ Erro ao atualizar progresso:", message);
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteGoal = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🗑️ Deletando goal:", id);
      await cyclesApi.deleteGoal(id);

      console.log("✅ Goal deletado");
      return true;
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Erro ao deletar goal:", message);
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createGoal,
    updateGoal,
    updateGoalProgress,
    deleteGoal,
    loading,
    error,
  };
}

// ==========================================
// COMPETENCY MUTATIONS
// ==========================================

export interface UseCompetencyMutationsReturn {
  createCompetency: (
    data: CreateCompetencyDto
  ) => Promise<CompetencyResponseDto | null>;
  updateCompetency: (
    id: string,
    data: UpdateCompetencyDto
  ) => Promise<CompetencyResponseDto | null>;
  updateCompetencyProgress: (
    id: string,
    data: UpdateCompetencyProgressDto
  ) => Promise<CompetencyResponseDto | null>;
  deleteCompetency: (id: string) => Promise<boolean>;

  loading: boolean;
  error: string | null;
}

/**
 * Hook para mutations de Competencies
 */
export function useCompetencyMutations(): UseCompetencyMutationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCompetency = useCallback(async (data: CreateCompetencyDto) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🧠 Criando competency:", data.name);
      const competency = await cyclesApi.createCompetency(data);

      console.log("✅ Competency criada:", competency.id);
      return competency;
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Erro ao criar competency:", message);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompetency = useCallback(
    async (id: string, data: UpdateCompetencyDto) => {
      try {
        setLoading(true);
        setError(null);

        console.log("🧠 Atualizando competency:", id);
        const competency = await cyclesApi.updateCompetency(id, data);

        console.log("✅ Competency atualizada:", competency.id);
        return competency;
      } catch (err) {
        const message = extractErrorMessage(err);
        console.error("❌ Erro ao atualizar competency:", message);
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateCompetencyProgress = useCallback(
    async (id: string, data: UpdateCompetencyProgressDto) => {
      try {
        setLoading(true);
        setError(null);

        console.log("📈 Atualizando progresso da competency:", id);
        const competency = await cyclesApi.updateCompetencyProgress(id, data);

        console.log(
          "✅ Progresso atualizado! Novo nível:",
          competency.currentLevel
        );
        return competency;
      } catch (err) {
        const message = extractErrorMessage(err);
        console.error("❌ Erro ao atualizar progresso:", message);
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCompetency = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🗑️ Deletando competency:", id);
      await cyclesApi.deleteCompetency(id);

      console.log("✅ Competency deletada");
      return true;
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Erro ao deletar competency:", message);
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createCompetency,
    updateCompetency,
    updateCompetencyProgress,
    deleteCompetency,
    loading,
    error,
  };
}

// ==========================================
// ACTIVITY MUTATIONS
// ==========================================

export interface UseActivityMutationsReturn {
  createOneOnOne: (
    data: CreateOneOnOneDto
  ) => Promise<OneOnOneActivityResponseDto | null>;
  createMentoring: (
    data: CreateMentoringDto
  ) => Promise<MentoringActivityResponseDto | null>;
  createCertification: (
    data: CreateCertificationDto
  ) => Promise<CertificationActivityResponseDto | null>;
  deleteActivity: (id: string) => Promise<boolean>;

  loading: boolean;
  error: string | null;
}

/**
 * Hook para mutations de Activities
 */
export function useActivityMutations(): UseActivityMutationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOneOnOne = useCallback(async (data: CreateOneOnOneDto) => {
    try {
      setLoading(true);
      setError(null);

      console.log("👥 Criando atividade 1:1:", data.title);
      const activity = await cyclesApi.createOneOnOneActivity(data);

      console.log("✅ Atividade 1:1 criada! XP ganho:", activity.xpEarned);
      return activity;
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Erro ao criar 1:1:", message);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMentoring = useCallback(async (data: CreateMentoringDto) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🎓 Criando atividade de mentoria:", data.title);
      const activity = await cyclesApi.createMentoringActivity(data);

      console.log(
        "✅ Atividade de mentoria criada! XP ganho:",
        activity.xpEarned
      );
      return activity;
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Erro ao criar mentoria:", message);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCertification = useCallback(
    async (data: CreateCertificationDto) => {
      try {
        setLoading(true);
        setError(null);

        console.log("🏆 Criando atividade de certificação:", data.title);
        const activity = await cyclesApi.createCertificationActivity(data);

        console.log("✅ Certificação criada! XP ganho:", activity.xpEarned);
        return activity;
      } catch (err) {
        const message = extractErrorMessage(err);
        console.error("❌ Erro ao criar certificação:", message);
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteActivity = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🗑️ Deletando activity:", id);
      await cyclesApi.deleteActivity(id);

      console.log("✅ Activity deletada");
      return true;
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Erro ao deletar activity:", message);
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createOneOnOne,
    createMentoring,
    createCertification,
    deleteActivity,
    loading,
    error,
  };
}
