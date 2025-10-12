import { FiStar, FiTarget, FiClock, FiSettings } from "react-icons/fi";
import type { ProfileTab, ProfileTabConfig } from "../types/profile";

interface ProfileTabNavigationProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  isCurrentUser: boolean;
}

export function ProfileTabNavigation({
  activeTab,
  onTabChange,
  isCurrentUser,
}: ProfileTabNavigationProps) {
  const tabs: ProfileTabConfig[] = [
    {
      id: "gamification",
      label: "Resumo",
      icon: FiStar,
      requiresPrivateAccess: false,
    },
    {
      id: "pdi",
      label: "PDI",
      icon: FiTarget,
      requiresPrivateAccess: true,
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: FiClock,
      requiresPrivateAccess: false,
    },
    ...(isCurrentUser
      ? [
          {
            id: "settings" as ProfileTab,
            label: "Configurações",
            icon: FiSettings,
            requiresPrivateAccess: true,
          },
        ]
      : []),
  ];

  const visibleTabs = tabs.filter(
    (tab) => !tab.requiresPrivateAccess || isCurrentUser
  );

  return (
    <div className="border-b border-surface-200 bg-white sticky top-0 z-10">
      <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200
                ${
                  isActive
                    ? "border-brand-500 text-brand-600"
                    : "border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300"
                }
              `}
            >
              <Icon
                className={`
                  w-4 h-4 mr-2 transition-all duration-200
                  ${
                    isActive
                      ? "text-brand-500"
                      : "text-surface-400 group-hover:text-surface-600"
                  }
                `}
              />
              {tab.label}

              {/* Active indicator */}
              {isActive && (
                <div className="ml-2 w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
