import { useState } from "react";
import { FiTarget, FiCalendar, FiBarChart } from "react-icons/fi";
import { CyclesManager } from "./cycles/CyclesManager";
import type { PdiCycle } from "../types/pdi";

interface PdiTabsProps {
  // Ciclos
  cycles: PdiCycle[];
  selectedCycleId: string;
  onCreateCycle: (
    cycle: Omit<PdiCycle, "id" | "createdAt" | "updatedAt">
  ) => void;
  onUpdateCycle: (cycleId: string, updates: Partial<PdiCycle>) => void;
  onDeleteCycle: (cycleId: string) => void;
  onSelectCycle: (cycleId: string) => void;

  // Conteúdo das abas
  pdiContent: React.ReactNode;
  statisticsContent?: React.ReactNode;
}

export function PdiTabs({
  cycles,
  selectedCycleId,
  onCreateCycle,
  onUpdateCycle,
  onDeleteCycle,
  onSelectCycle,
  pdiContent,
  statisticsContent,
}: PdiTabsProps) {
  const [activeTab, setActiveTab] = useState<"cycles" | "pdi" | "stats">("pdi");

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
          onCreateCycle={onCreateCycle}
          onUpdateCycle={onUpdateCycle}
          onDeleteCycle={onDeleteCycle}
          onSelectCycle={onSelectCycle}
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
