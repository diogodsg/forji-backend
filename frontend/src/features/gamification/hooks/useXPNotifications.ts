import { useState, useCallback } from "react";

interface XPNotificationData {
  id: string;
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
}

export function useXPNotifications() {
  const [notifications, setNotifications] = useState<XPNotificationData[]>([]);

  const addNotification = useCallback(
    (data: Omit<XPNotificationData, "id">) => {
      const notification: XPNotificationData = {
        ...data,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };

      setNotifications((prev) => [...prev, notification]);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
}
