import { useState } from "react";
import { FiActivity, FiTrendingUp, FiAward } from "react-icons/fi";
import { CycleTimeline } from "../../pdi/components/history/CycleTimeline";
import { CompetencyManager } from "../../pdi/components/CompetencyManager";
import { AchievementsList } from "../../pdi/components/history/AchievementsList";
import { HistoryFilters } from "../../pdi/components/history/HistoryFilters";

interface PdiManagementTabsProps {
  targetUserId?: number;
}

export function PdiManagementTabs({ targetUserId }: PdiManagementTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "timeline" | "competencies" | "achievements"
  >("timeline");
  const [historyFilters, setHistoryFilters] = useState({
    year: "all",
    competency: "all",
    status: "all",
  });

  const tabs = [
    {
      id: "timeline" as const,
      label: "Timeline",
      icon: FiActivity,
      content: (
        <div className="space-y-6">
          <HistoryFilters
            filters={historyFilters}
            onFiltersChange={setHistoryFilters}
          />
          <CycleTimeline userId={targetUserId} filters={historyFilters} />
        </div>
      ),
      description: "Linha do tempo de evolução e ciclos",
    },
    {
      id: "competencies" as const,
      label: "Competências",
      icon: FiTrendingUp,
      content: (
        <CompetencyManager
          userId={targetUserId}
          onSave={(competencies) => {
            console.log("Competências salvas:", competencies);
            // TODO: Implementar integração com backend
          }}
        />
      ),
      description: "Escolha e gerencie suas competências de desenvolvimento",
    },
    {
      id: "achievements" as const,
      label: "Conquistas",
      icon: FiAward,
      content: (
        <div className="space-y-6">
          <HistoryFilters
            filters={historyFilters}
            onFiltersChange={setHistoryFilters}
          />
          <AchievementsList userId={targetUserId} filters={historyFilters} />
        </div>
      ),
      description: "Marcos, certificações e reconhecimentos",
    },
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          Gestão de Desenvolvimento
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Timeline, competências e conquistas da sua jornada
        </p>
      </div>

      {/* Navegação das Abas */}
      <div className="border-b border-gray-100">
        <nav className="flex px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon
                  className={`w-4 h-4 mr-2 ${
                    isActive ? "text-indigo-500" : "text-gray-400"
                  }`}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo da aba ativa */}
      <div className="p-6 min-h-[500px]">{currentTab?.content}</div>
    </div>
  );
}
