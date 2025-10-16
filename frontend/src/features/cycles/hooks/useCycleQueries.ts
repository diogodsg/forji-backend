import { useState, useEffect } from "react";
import type { Cycle, CycleGoal } from "../types";
import { mockAPI } from "../data/mockData";

// Hook simulando React Query para dados do ciclo
export const useCycleData = () => {
  const [data, setData] = useState<Cycle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCycle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const cycle = await mockAPI.getCurrentCycle();
        setData(cycle);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCycle();
  }, []);

  const refetch = () => {
    const fetchCycle = async () => {
      try {
        setIsLoading(true);
        const cycle = await mockAPI.getCurrentCycle();
        setData(cycle);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCycle();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    isSuccess: !isLoading && !error && !!data,
    isError: !!error,
  };
};

// Hook para metas do ciclo
export const useCycleGoals = (cycleId?: string) => {
  const [data, setData] = useState<CycleGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!cycleId) {
      setIsLoading(false);
      return;
    }

    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const goals = await mockAPI.getCycleGoals(cycleId);
        setData(goals);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [cycleId]);

  return {
    data,
    isLoading,
    error,
    isSuccess: !isLoading && !error,
    isError: !!error,
  };
};

// Hook para mutações (atualizar progresso das metas)
export const useUpdateGoalProgress = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (goalId: string, progress: Partial<CycleGoal>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedGoal = await mockAPI.updateGoalProgress(goalId, progress);
      console.log("✅ Goal updated successfully:", updatedGoal);
      return updatedGoal;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to update goal");
      setError(error);
      console.error("❌ Failed to update goal:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
    isSuccess: !isLoading && !error,
    isError: !!error,
  };
};
