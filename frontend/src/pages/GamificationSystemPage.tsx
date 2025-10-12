import { useState } from "react";
import { FaBolt, FaChartLine, FaTrophy, FaUser } from "react-icons/fa";
import {
  MultiplierDashboard,
  ManualActionsPanel,
} from "../features/gamification/components";

export function GamificationSystemPage() {
  const [activeTab, setActiveTab] = useState<
    "actions" | "multipliers" | "achievements"
  >("actions");

  const tabs = [
    {
      id: "actions" as const,
      name: "Ações Manuais",
      icon: FaBolt,
      description: "Documente suas contribuições",
    },
    {
      id: "multipliers" as const,
      name: "Multiplicadores",
      icon: FaChartLine,
      description: "Veja seus bônus de XP",
    },
    {
      id: "achievements" as const,
      name: "Conquistas",
      icon: FaTrophy,
      description: "Badges e progressos",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "actions":
        return <ManualActionsPanel />;
      case "multipliers":
        return <MultiplierDashboard />;
      case "achievements":
        return (
          <div className="bg-white rounded-lg border p-6 text-center">
            <FaTrophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sistema de Badges
            </h3>
            <p className="text-gray-600">
              Sistema de conquistas será implementado na Sprint 3
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUser className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sistema de Gamificação
              </h1>
              <p className="text-gray-600">
                Gerencie suas ações, multiplicadores e conquistas
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Description */}
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {tabs.find((tab) => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default GamificationSystemPage;
