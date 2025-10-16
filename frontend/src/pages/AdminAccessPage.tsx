import { useState } from "react";
import { useAuth } from "@/features/auth";
import { AccessDeniedPanel } from "@/features/admin";
import { WorkflowPeopleTab } from "@/features/admin/components/WorkflowPeopleTab";
import { TeamsManagement } from "@/features/admin/components/TeamsManagement";

type TabKey = "people" | "teams";

export default function AdminAccessPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("people");

  const tabs = [
    {
      id: "people" as const,
      label: "Pessoas",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      description: "Onboarding e gestão de pessoas",
      component: <WorkflowPeopleTab />,
    },
    {
      id: "teams" as const,
      label: "Equipes",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      description: "Gestão completa de equipes e membros",
      component: <TeamsManagement />,
    },
  ];

  if (!user?.isAdmin) return <AccessDeniedPanel />;

  return (
    <div className="min-h-full w-full bg-[#f8fafc] p-6 space-y-6">
      <header className="pb-6">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-500 to-violet-400 flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
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
          <button
            onClick={logout}
            className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-gray-700 text-sm font-medium hover:bg-slate-200 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
            </svg>
            Sair
          </button>
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
                  ? "border-violet-500 text-violet-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div
                className={`h-9 w-9 inline-flex items-center justify-center rounded-lg border transition-colors ${
                  activeTab === tab.id
                    ? "bg-violet-50 text-violet-600 border-surface-300/60"
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
