import { useState, useEffect } from "react";
import { FiTarget, FiCalendar, FiBarChart } from "react-icons/fi";
import { CyclesManager } from "./cycles/CyclesManager";
import { ActiveCycleBadge } from "./ActiveCycleBadge";
import type { PdiCycle } from "../types/pdi";

interface PdiTabsProps {
  pdiContent: React.ReactNode;
  statisticsContent?: React.ReactNode;
  // Controlled cycles API (opcional). Se fornecido, componente não faz fetch inicial.
  cycles?: PdiCycle[];
  selectedCycleId?: string;
  onSelectCycle?: (id: string) => void;
  onCreateCycle?: (
    cycle: Omit<PdiCycle, "id" | "createdAt" | "updatedAt">
  ) => void;
  onUpdateCycle?: (id: string, updates: Partial<PdiCycle>) => void;
  onDeleteCycle?: (id: string) => void;
  onReplaceCycle?: (cycle: PdiCycle) => void; // usado quando buscamos snapshot histórico
}

import {
  fetchMyCycles,
  createCycle,
  updateCycle,
  deleteCycle,
  fetchMyCycleById,
} from "../api/cycles";

export function PdiTabs({
  pdiContent,
  statisticsContent,
  cycles: controlledCycles,
  selectedCycleId: controlledSelectedId,
  onSelectCycle,
  onCreateCycle,
  onUpdateCycle,
  onDeleteCycle,
  onReplaceCycle,
}: PdiTabsProps) {
  const [activeTab, setActiveTab] = useState<"cycles" | "pdi" | "stats">("pdi");
  const [cycleLoading, setCycleLoading] = useState(false);
  const isControlled = Array.isArray(controlledCycles);
  const [uncontrolledCycles, setUncontrolledCycles] = useState<PdiCycle[]>([]);
  const [uncontrolledSelectedId, setUncontrolledSelectedId] =
    useState<string>("");
  const cycles = isControlled
    ? (controlledCycles as PdiCycle[])
    : uncontrolledCycles;
  const selectedCycleId = isControlled
    ? controlledSelectedId || ""
    : uncontrolledSelectedId;
  const [loadingCycles, setLoadingCycles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (isControlled) return; // parent cuida
    setLoadingCycles(true);
    setError(null);
    try {
      const data = await fetchMyCycles();
      setUncontrolledCycles(data);
      if (data.length && !uncontrolledSelectedId) {
        const active = data.find((c) => c.status === "active") || data[0];
        setUncontrolledSelectedId(active.id);
      }
    } catch (e: any) {
      setError(e.message || "Falha ao carregar ciclos");
    } finally {
      setLoadingCycles(false);
    }
  }

  useEffect(() => {
    if (!isControlled) load();
  }, []);

  // Sincronizar mudança de cycles controlados para garantir seleção válida
  useEffect(() => {
    if (isControlled && controlledCycles) {
      if (controlledCycles.length && !controlledSelectedId) {
        const active =
          controlledCycles.find((c) => c.status === "active") ||
          controlledCycles[0];
        onSelectCycle?.(active.id);
      } else if (
        controlledSelectedId &&
        !controlledCycles.some((c) => c.id === controlledSelectedId)
      ) {
        const fallback = controlledCycles[0];
        if (fallback) onSelectCycle?.(fallback.id);
      }
    }
  }, [isControlled, controlledCycles, controlledSelectedId, onSelectCycle]);

  async function handleCreateCycle(
    cyclePartial: Omit<PdiCycle, "id" | "createdAt" | "updatedAt">
  ) {
    if (isControlled) {
      onCreateCycle?.(cyclePartial);
      return;
    }
    // Mapear estrutura inversa para payload server
    const payload = {
      title: cyclePartial.title,
      description: cyclePartial.description,
      startDate: cyclePartial.startDate,
      endDate: cyclePartial.endDate,
      competencies: cyclePartial.pdi.competencies,
      krs: cyclePartial.pdi.krs,
      milestones: cyclePartial.pdi.milestones,
      records: cyclePartial.pdi.records,
    };
    const created = await createCycle(payload);
    setUncontrolledCycles((prev) => [...prev, created]);
  }

  async function handleUpdateCycle(id: string, updates: Partial<PdiCycle>) {
    if (isControlled) {
      onUpdateCycle?.(id, updates);
      return;
    }
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined)
      payload.description = updates.description;
    if (updates.startDate !== undefined) payload.startDate = updates.startDate;
    if (updates.endDate !== undefined) payload.endDate = updates.endDate;
    if (updates.status !== undefined)
      payload.status = updates.status.toUpperCase();
    if (updates.pdi) {
      if (updates.pdi.competencies)
        payload.competencies = updates.pdi.competencies;
      if (updates.pdi.krs) payload.krs = updates.pdi.krs;
      if (updates.pdi.milestones) payload.milestones = updates.pdi.milestones;
      if (updates.pdi.records) payload.records = updates.pdi.records;
    }
    const updated = await updateCycle(id, payload);
    setUncontrolledCycles((prev) =>
      prev.map((c) => (c.id === id ? updated : c))
    );
  }

  async function handleDeleteCycle(id: string) {
    if (isControlled) {
      onDeleteCycle?.(id);
      return;
    }
    await deleteCycle(id);
    setUncontrolledCycles((prev) => prev.filter((c) => c.id !== id));
    if (selectedCycleId === id) setUncontrolledSelectedId("");
  }

  async function handleSelectCycle(id: string) {
    setCycleLoading(true);
    if (isControlled) {
      onSelectCycle?.(id);
    } else {
      setUncontrolledSelectedId(id);
    }
    const existing = cycles.find((c) => c.id === id);
    const looksEmpty =
      existing &&
      (existing.pdi.competencies?.length ?? 0) +
        (existing.pdi.milestones?.length ?? 0) +
        (existing.pdi.krs?.length ?? 0) +
        (existing.pdi.records?.length ?? 0) ===
        0;
    if (!existing || looksEmpty) {
      try {
        const fresh = await fetchMyCycleById(id);
        if (isControlled) {
          onReplaceCycle?.(fresh);
        } else {
          setUncontrolledCycles((prev) => {
            const has = prev.some((c) => c.id === fresh.id);
            return has
              ? prev.map((c) => (c.id === fresh.id ? fresh : c))
              : [...prev, fresh];
          });
        }
      } catch (e) {
        // ignore
      }
    }
    setCycleLoading(false);
  }

  const baseTabs = [
    {
      id: "pdi" as const,
      label: "PDI",
      icon: FiTarget,
      content: (
        <div className="space-y-4">
          {cycles.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-medium text-gray-600">Ciclo:</span>
              {cycles.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCycle(c.id)}
                  className={`px-2.5 py-1 rounded-md border transition-colors ${
                    c.id === selectedCycleId
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          )}
          {(!cycleLoading || activeTab !== "pdi") && pdiContent}
          {cycleLoading && activeTab === "pdi" && (
            <div className="p-4 rounded-md border border-gray-200 bg-gray-50 animate-pulse text-xs text-gray-600">
              Carregando ciclo...
            </div>
          )}
        </div>
      ),
      description: "Competências, objetivos e marcos",
    },
    {
      id: "cycles" as const,
      label: "Ciclos",
      icon: FiCalendar,
      content: (
        <CyclesManager
          cycles={cycles}
          selectedCycleId={selectedCycleId}
          onCreateCycle={handleCreateCycle}
          onUpdateCycle={handleUpdateCycle}
          onDeleteCycle={handleDeleteCycle}
          onSelectCycle={handleSelectCycle}
          editing={true}
        />
      ),
      description: "Gerencie ciclos de desenvolvimento",
    },
  ];

  const tabs = statisticsContent
    ? [
        ...baseTabs,
        {
          id: "stats" as const,
          label: "Estatísticas",
          icon: FiBarChart,
          content: statisticsContent,
          description: "Progresso e métricas",
        },
      ]
    : baseTabs;

  const currentTab = tabs.find((tab) => tab.id === activeTab);
  const activeCycle = cycles.find((c) => c.status === "active");
  const currentCycle =
    cycles.find((c) => c.id === selectedCycleId) || activeCycle;
  const isHistorical = currentCycle && currentCycle.status === "completed";

  return (
    <div className="space-y-4">
      {/* Navegação das Abas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon
                  className={`w-4 h-4 mr-2 ${
                    isActive
                      ? "text-indigo-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Indicador da aba ativa + ciclo atual */}
      {currentTab && (
        <div className="flex flex-wrap items-center gap-4 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <currentTab.icon className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="font-medium text-gray-900">{currentTab.label}</h3>
              <p className="text-sm text-gray-600">{currentTab.description}</p>
            </div>
          </div>
          <div className="ml-auto">
            <ActiveCycleBadge cycle={currentCycle} />
          </div>
        </div>
      )}

      {/* Feedback de ciclos (apenas quando tab cycles ativa) */}
      {activeTab === "cycles" && (
        <div className="space-y-3">
          {loadingCycles && (
            <div className="p-4 border border-indigo-200 rounded-lg bg-indigo-50 animate-pulse text-sm text-indigo-700">
              Carregando ciclos...
            </div>
          )}
          {error && !loadingCycles && (
            <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-sm text-red-700 flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={load}
                className="px-2 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo da aba ativa */}
      <div className="space-y-4 min-h-[400px]">
        {activeTab === "pdi" && isHistorical && (
          <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-2">
            <span className="font-medium">Ciclo Histórico:</span>
            <span>
              Você está visualizando um ciclo concluído. O conteúdo é um
              snapshot e não pode ser editado.
            </span>
          </div>
        )}
        {currentTab?.content}
      </div>
    </div>
  );
}
