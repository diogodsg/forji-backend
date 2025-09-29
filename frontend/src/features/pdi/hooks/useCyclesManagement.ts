import { useState, useCallback, useEffect } from "react";
import type { PdiCycle, PdiPlan } from "../types/pdi";

export function useCyclesManagement(initialPlan: PdiPlan) {
  // Se o plano já tem ciclos, use-os; senão, crie um ciclo padrão com o PDI atual
  const [cycles, setCycles] = useState<PdiCycle[]>(() => {
    if (initialPlan.cycles && initialPlan.cycles.length > 0) {
      return initialPlan.cycles;
    }

    // Migrar PDI atual para um ciclo padrão
    const defaultCycle: PdiCycle = {
      id: `cycle-${Date.now()}`,
      title: "Ciclo Principal",
      description: "Ciclo principal de desenvolvimento",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 90 dias
      status: "active",
      pdi: {
        competencies: initialPlan.competencies || [],
        milestones: initialPlan.milestones || [],
        krs: initialPlan.krs || [],
        records: initialPlan.records || [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return [defaultCycle];
  });

  const [selectedCycleId, setSelectedCycleId] = useState<string>("");

  // Inicializar o selectedCycleId quando cycles estiver pronto
  useEffect(() => {
    if (cycles.length > 0 && !selectedCycleId) {
      const activeCycle = cycles.find((c) => c.status === "active");
      setSelectedCycleId(activeCycle?.id || cycles[0]?.id || "");
    }
  }, [cycles, selectedCycleId]);

  const selectedCycle = cycles.find((c) => c.id === selectedCycleId);

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
    if (!selectedCycle) {
      return initialPlan;
    }

    return {
      ...initialPlan,
      cycles,
      // Usar dados do ciclo selecionado para compatibilidade
      competencies: selectedCycle.pdi.competencies,
      milestones: selectedCycle.pdi.milestones,
      krs: selectedCycle.pdi.krs,
      records: selectedCycle.pdi.records,
      // Manter o updatedAt do initialPlan para evitar loops
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
