import { useState } from "react";
import { FiUser, FiKey } from "react-icons/fi";
import { ProfileSection, AccountSection } from "@/features/settings";
import type { SettingsTab } from "@/features/settings";

const tabs: SettingsTab[] = [
  { id: "profile", label: "Perfil", icon: FiUser },
  { id: "account", label: "Conta", icon: FiKey },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab["id"]>("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />;
      case "account":
        return <AccountSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gerencie suas informações pessoais e configurações de conta.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                    ${
                      isActive
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon
                    className={`mr-2 h-4 w-4 ${
                      isActive ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
}
