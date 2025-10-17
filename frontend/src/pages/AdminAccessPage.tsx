import { useState } from "react";
import { useAuth } from "@/features/auth";
import {
  AccessDeniedPanel,
  WorkflowPeopleTab,
  TeamsManagement,
} from "@/features/admin";
import { FiUser, FiUsers, FiShield, FiLogOut } from "react-icons/fi";

type TabKey = "people" | "teams";

export default function AdminAccessPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("people");

  const tabs = [
    {
      id: "people" as const,
      label: "Pessoas",
      icon: <FiUser className="w-4 h-4" />,
      description: "Onboarding e gestão de pessoas",
      component: <WorkflowPeopleTab />,
    },
    {
      id: "teams" as const,
      label: "Equipes",
      icon: <FiUsers className="w-4 h-4" />,
      description: "Gestão completa de equipes e membros",
      component: <TeamsManagement />,
    },
  ];

  if (!user?.isAdmin) return <AccessDeniedPanel />;

  return (
    <div className="min-h-full w-full bg-surface-50 p-6 space-y-6">
      <header className="pb-6">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-md">
              <FiShield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
                Administração
              </h1>
              <p className="text-xs text-gray-500">
                Gerencie colaboradores e organize sua estrutura organizacional
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-surface-300 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-3 transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div
                className={`h-9 w-9 inline-flex items-center justify-center rounded-lg border transition-colors ${
                  activeTab === tab.id
                    ? "bg-brand-50 text-brand-600 border-surface-300/60"
                    : "bg-surface-50 text-gray-500 border-surface-300/60 group-hover:bg-surface-100"
                }`}
              >
                {tab.icon}
              </div>
              <div className="text-left">
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {tab.description}
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div>{tabs.find((tab) => tab.id === activeTab)?.component}</div>
    </div>
  );
}
