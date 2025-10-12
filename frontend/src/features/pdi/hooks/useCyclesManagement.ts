import { useState, useCallback, useEffect } from "react";
import type { PdiCycle, PdiPlan } from "../types/pdi";
import {
  createCycle as apiCreateCycle,
  createCycleForUser,
  updateCycle as apiUpdateCycle,
  deleteCycle as apiDeleteCycle,
  fetchMyCycles,
  fetchCyclesForUser,
} from "../api/cycles";

export function useCyclesManagement(
  initialPlan: PdiPlan,
  targetUserId?: number
) {
  // Se o plano já tem ciclos, use-os; senão, comece com array vazio
  const [cycles, setCycles] = useState<PdiCycle[]>(
    () => initialPlan.cycles || []
  );
  const [loading, setLoading] = useState(false);

  const [selectedCycleId, setSelectedCycleId] = useState<string>("");

  // Carregar ciclos do backend se não houver ciclos iniciais
  useEffect(() => {
    async function loadCyclesFromBackend() {
      if (cycles.length > 0) return; // Já tem ciclos

      try {
        setLoading(true);
        // Se targetUserId for fornecido, carregar ciclos desse usuário; senão carregar próprios
        const remoteCycles = targetUserId
          ? await fetchCyclesForUser(targetUserId)
          : await fetchMyCycles();
        setCycles(remoteCycles);
      } catch (error) {
        console.error("Erro ao carregar ciclos:", error);
        // Se falhar, manter array vazio para permitir criação
      } finally {
        setLoading(false);
      }
    }

    loadCyclesFromBackend();
  }, [targetUserId, cycles.length]); // Recarregar se targetUserId mudar ou se cycles for atualizado  // Inicializar o selectedCycleId quando cycles estiver pronto
  useEffect(() => {
    if (cycles.length > 0) {
      // Sempre priorizar ciclo ativo vindo do backend
      const activeCycle = cycles.find((c) => c.status === "active");
      if (!selectedCycleId) {
        setSelectedCycleId(activeCycle?.id || cycles[0].id);
      } else {
        // Se o selecionado não existe mais, fallback
        if (!cycles.some((c) => c.id === selectedCycleId)) {
          setSelectedCycleId(activeCycle?.id || cycles[0].id);
        }
      }
    }
  }, [cycles, selectedCycleId]);

  const selectedCycle =
    cycles.find((c) => c.id === selectedCycleId) ||
    cycles.find((c) => c.status === "active");

  const createCycle = useCallback(
    async (cycleData: Omit<PdiCycle, "id" | "createdAt" | "updatedAt">) => {
      try {
        // Mapear estrutura para payload do server
        const payload = {
          title: cycleData.title,
          description: cycleData.description,
          startDate: cycleData.startDate,
          endDate: cycleData.endDate,
          competencies: cycleData.pdi?.competencies || [],
          krs: cycleData.pdi?.krs || [],
          milestones: cycleData.pdi?.milestones || [],
          records: cycleData.pdi?.records || [],
        };

        // Se targetUserId for fornecido, criar para esse usuário; senão para o usuário logado
        const newCycle = targetUserId
          ? await createCycleForUser(targetUserId, payload)
          : await apiCreateCycle(payload);

        setCycles((prev) => [...prev, newCycle]);
        setSelectedCycleId(newCycle.id);
      } catch (error) {
        console.error("Erro ao criar ciclo:", error);
        throw error;
      }
    },
    [targetUserId]
  );

  const updateCycle = useCallback(
    async (cycleId: string, updates: Partial<PdiCycle>) => {
      try {
        // Mapear atualizações para payload do server
        const payload: Record<string, unknown> = {};
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.description !== undefined)
          payload.description = updates.description;
        if (updates.startDate !== undefined)
          payload.startDate = updates.startDate;
        if (updates.endDate !== undefined) payload.endDate = updates.endDate;
        if (updates.status !== undefined)
          payload.status = updates.status.toUpperCase();
        if (updates.pdi) {
          if (updates.pdi.competencies)
            payload.competencies = updates.pdi.competencies;
          if (updates.pdi.krs) payload.krs = updates.pdi.krs;
          if (updates.pdi.milestones)
            payload.milestones = updates.pdi.milestones;
          if (updates.pdi.records) payload.records = updates.pdi.records;
        }

        const updatedCycle = await apiUpdateCycle(cycleId, payload);
        setCycles((prev) =>
          prev.map((cycle) => (cycle.id === cycleId ? updatedCycle : cycle))
        );
      } catch (error) {
        console.error("Erro ao atualizar ciclo:", error);
        throw error;
      }
    },
    []
  );

  // Permite substituir (ou inserir) um ciclo vindo do backend (ex: fetch histórico)
  const replaceCycle = useCallback((incoming: PdiCycle) => {
    setCycles((prev) => {
      const exists = prev.some((c) => c.id === incoming.id);
      if (exists) return prev.map((c) => (c.id === incoming.id ? incoming : c));
      return [...prev, incoming];
    });
  }, []);

  const deleteCycle = useCallback(
    async (cycleId: string) => {
      try {
        await apiDeleteCycle(cycleId);
        setCycles((prev) => {
          const filtered = prev.filter((c) => c.id !== cycleId);

          // Se o ciclo selecionado foi deletado, selecionar outro
          if (cycleId === selectedCycleId && filtered.length > 0) {
            const activeCycle = filtered.find((c) => c.status === "active");
            setSelectedCycleId(activeCycle?.id || filtered[0].id);
          }

          return filtered;
        });
      } catch (error) {
        console.error("Erro ao deletar ciclo:", error);
        throw error;
      }
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
      // usar updatedAt do ciclo selecionado para forçar reinit no editor quando troca
      updatedAt: selectedCycle.updatedAt,
    };
  }, [selectedCycle, cycles, initialPlan]);

  return {
    cycles,
    selectedCycleId,
    selectedCycle,
    loading,
    setSelectedCycleId,
    setCycles, // expõe para integração controlada
    createCycle,
    updateCycle,
    replaceCycle,
    deleteCycle,
    updateSelectedCyclePdi,
    getCurrentPdiPlan,
  };
}
