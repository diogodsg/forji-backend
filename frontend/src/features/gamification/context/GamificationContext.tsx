import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useXPNotifications } from "../hooks/useXPNotifications";
import { XPNotification } from "../components/XPNotification";

interface GamificationContextType {
  addXPNotification: (data: {
    xpGained: number;
    action: string;
    levelUp?: {
      newLevel: number;
      title: string;
    };
    badgeUnlocked?: {
      id: string;
      name: string;
      rarity: "common" | "rare" | "epic" | "legendary";
    };
  }) => void;
  clearNotifications: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(
  undefined
);

interface GamificationProviderProps {
  children: ReactNode;
}

export function GamificationProvider({ children }: GamificationProviderProps) {
  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  } = useXPNotifications();

  const contextValue: GamificationContextType = {
    addXPNotification: addNotification,
    clearNotifications,
  };

  return (
    <GamificationContext.Provider value={contextValue}>
      {children}

      {/* Render notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <XPNotification
            key={notification.id}
            xpGained={notification.xpGained}
            action={notification.action}
            levelUp={notification.levelUp}
            badgeUnlocked={notification.badgeUnlocked}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </GamificationContext.Provider>
  );
}

export function useGamificationContext() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error(
      "useGamificationContext must be used within a GamificationProvider"
    );
  }
  return context;
}
