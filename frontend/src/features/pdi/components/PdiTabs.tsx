import { useState, useEffect } from "react";
import { FiTarget, FiCalendar, FiBarChart } from "react-icons/fi";
import { CyclesManager } from "./cycles/CyclesManager";
import type { PdiCycle } from "../types/pdi";

interface PdiTabsProps {
  pdiContent: React.ReactNode;
  statisticsContent?: React.ReactNode;
}

import { fetchMyCycles, createCycle, updateCycle, deleteCycle } from '../api/cycles';

export function PdiTabs({ pdiContent, statisticsContent }: PdiTabsProps) {
  const [activeTab, setActiveTab] = useState<"cycles" | "pdi" | "stats">("pdi");
  const [cycles, setCycles] = useState<PdiCycle[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string>("");
  // Futuro: estados de loading e erro podem ser expostos na UI
  // const [loadingCycles, setLoadingCycles] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  async function load() {
  // setLoadingCycles(true);
  // setError(null);
    try {
      const data = await fetchMyCycles();
      setCycles(data);
      if (data.length && !selectedCycleId) {
        const active = data.find(c => c.status === 'active') || data[0];
        setSelectedCycleId(active.id);
      }
    } catch (e: any) {
      // setError(e.message || 'Falha ao carregar ciclos');
    } finally {
      // setLoadingCycles(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreateCycle(cyclePartial: Omit<PdiCycle, 'id' | 'createdAt' | 'updatedAt'>) {
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
    setCycles(prev => [...prev, created]);
  }

  async function handleUpdateCycle(id: string, updates: Partial<PdiCycle>) {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.startDate !== undefined) payload.startDate = updates.startDate;
    if (updates.endDate !== undefined) payload.endDate = updates.endDate;
    if (updates.status !== undefined) payload.status = updates.status.toUpperCase();
    if (updates.pdi) {
      if (updates.pdi.competencies) payload.competencies = updates.pdi.competencies;
      if (updates.pdi.krs) payload.krs = updates.pdi.krs;
      if (updates.pdi.milestones) payload.milestones = updates.pdi.milestones;
      if (updates.pdi.records) payload.records = updates.pdi.records;
    }
    const updated = await updateCycle(id, payload);
    setCycles(prev => prev.map(c => c.id === id ? updated : c));
  }

  async function handleDeleteCycle(id: string) {
    await deleteCycle(id);
    setCycles(prev => prev.filter(c => c.id !== id));
    if (selectedCycleId === id) setSelectedCycleId("");
  }

  function handleSelectCycle(id: string) {
    setSelectedCycleId(id);
  }

  const baseTabs = [
    {
      id: "pdi" as const,
      label: "PDI",
      icon: FiTarget,
      content: pdiContent,
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

      {/* Indicador da aba ativa */}
      {currentTab && (
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <currentTab.icon className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="font-medium text-gray-900">{currentTab.label}</h3>
            <p className="text-sm text-gray-600">{currentTab.description}</p>
          </div>
        </div>
      )}

      {/* Conteúdo da aba ativa */}
      <div className="min-h-[400px]">{currentTab?.content}</div>
    </div>
  );
}
