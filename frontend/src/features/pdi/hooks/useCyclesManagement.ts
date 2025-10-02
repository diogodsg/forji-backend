import { useState, useCallback, useEffect } from "react";
import type { PdiCycle, PdiPlan } from "../types/pdi";

export function useCyclesManagement(initialPlan: PdiPlan) {
  // Se o plano já tem ciclos, use-os; senão, crie um ciclo padrão com o PDI atual
  const [cycles, setCycles] = useState<PdiCycle[]>(() => initialPlan.cycles || []);

  const [selectedCycleId, setSelectedCycleId] = useState<string>("");

  // Inicializar o selectedCycleId quando cycles estiver pronto
  useEffect(() => {
    if (cycles.length > 0) {
      // Sempre priorizar ciclo ativo vindo do backend
      const activeCycle = cycles.find((c) => c.status === "active");
      if (!selectedCycleId) {
        setSelectedCycleId(activeCycle?.id || cycles[0].id);
      } else {
        // Se o selecionado não existe mais, fallback
        if (!cycles.some(c => c.id === selectedCycleId)) {
          setSelectedCycleId(activeCycle?.id || cycles[0].id);
        }
      }
    }
  }, [cycles, selectedCycleId]);

  const selectedCycle = cycles.find((c) => c.id === selectedCycleId) || cycles.find(c => c.status === 'active');

  const createCycle = useCallback(
    (cycleData: Omit<PdiCycle, "id" | "createdAt" | "updatedAt">) => {
      const newCycle: PdiCycle = {
        ...cycleData,
        id: `cycle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCycles((prev) => [...prev, newCycle]);
      setSelectedCycleId(newCycle.id);
    },
    []
  );

  const updateCycle = useCallback(
    (cycleId: string, updates: Partial<PdiCycle>) => {
      setCycles((prev) =>
        prev.map((cycle) =>
          cycle.id === cycleId
            ? { ...cycle, ...updates, updatedAt: new Date().toISOString() }
            : cycle
        )
      );
    },
    []
  );

  const deleteCycle = useCallback(
    (cycleId: string) => {
      setCycles((prev) => {
        const filtered = prev.filter((c) => c.id !== cycleId);

        // Se o ciclo selecionado foi deletado, selecionar outro
        if (cycleId === selectedCycleId && filtered.length > 0) {
          const activeCycle = filtered.find((c) => c.status === "active");
          setSelectedCycleId(activeCycle?.id || filtered[0].id);
        }

        return filtered;
      });
    },
    [selectedCycleId]
  );

  const updateSelectedCyclePdi = useCallback(
    (pdiUpdates: Partial<PdiCycle["pdi"]>) => {
      if (!selectedCycleId) return;

      setCycles((prevCycles) => {
        const targetCycle = prevCycles.find((c) => c.id === selectedCycleId);
        if (!targetCycle) return prevCycles;

        return prevCycles.map((cycle) =>
          cycle.id === selectedCycleId
            ? {
                ...cycle,
                pdi: {
                  ...targetCycle.pdi,
                  ...pdiUpdates,
                } as PdiCycle["pdi"],
                updatedAt: new Date().toISOString(),
              }
            : cycle
        );
      });
    },
    [selectedCycleId]
  );

  // Gerar PdiPlan compatível para o ciclo selecionado
  const getCurrentPdiPlan = useCallback((): PdiPlan => {
    if (!selectedCycle) return initialPlan;
    return {
      ...initialPlan,
      cycles,
      competencies: selectedCycle.pdi.competencies,
      milestones: selectedCycle.pdi.milestones,
      krs: selectedCycle.pdi.krs,
      records: selectedCycle.pdi.records,
      updatedAt: initialPlan.updatedAt,
    };
  }, [selectedCycle, cycles, initialPlan]);

  return {
    cycles,
    selectedCycleId,
    selectedCycle,
    setSelectedCycleId,
    createCycle,
    updateCycle,
    deleteCycle,
    updateSelectedCyclePdi,
    getCurrentPdiPlan,
  };
}
