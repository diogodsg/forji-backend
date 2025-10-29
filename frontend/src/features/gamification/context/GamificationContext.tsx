import { createContext, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useXPNotifications } from "../hooks/useXPNotifications";
import { XPNotification } from "../components/XPNotification";
import { useGamificationProfile } from "../../cycles/hooks/useGamificationProfile";
import { useCelebrations } from "../../../hooks/useCelebrations";
import { useXpAnimations } from "../../../components/XpFloating";

interface GamificationContextType {
  // Perfil de gamificação
  profile: any;
  loading: boolean;
  error: string | null;
  refreshProfile: () => void;

  // Notificações
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

  // Animações centralizadas (usadas após actions que geram XP)
  triggerXpGain: (amount: number) => void;
  triggerLevelUpCelebration: (newLevel: number) => void;

  // Processamento de resposta de atividade (centralizado)
  processActivityResponse: (activityResponse: any) => void;

  // Animações extras disponíveis (para casos especiais)
  triggerSparkles: () => void;
  triggerAchievement: (title: string, subtitle: string) => void;
  triggerMega: () => void;
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

  // Integração com perfil de gamificação
  const { profile, loading, error, refreshProfile } = useGamificationProfile();
  const {
    triggerLevelUp,
    triggerSparkles,
    triggerAchievement,
    triggerMega,
    CelebrationsComponent,
  } = useCelebrations();
  const { triggerXpAnimation } = useXpAnimations();

  // Refs para detectar mudanças (mantido para debugging, mas level-up agora é via response)
  const previousLevel = useRef<number | null>(null);
  const previousXP = useRef<number | null>(null);

  // Monitorar mudanças para debugging (level-ups agora são processados via processActivityResponse)
  useEffect(() => {
    if (!profile) return;

    const currentLevel = profile.level;
    const currentXP = profile.totalXP;

    // Debug: apenas log das mudanças, animações são gerenciadas via processActivityResponse
    if (
      previousLevel.current !== null &&
      currentLevel > previousLevel.current
    ) {
      console.log(
        `📊 Profile updated - Level: ${previousLevel.current} → ${currentLevel}`
      );
    }

    if (previousXP.current !== null && currentXP > previousXP.current) {
      const xpGained = currentXP - previousXP.current;
      console.log(`� Profile updated - XP: +${xpGained} (total: ${currentXP})`);
    }

    // Atualizar refs
    previousLevel.current = currentLevel;
    previousXP.current = currentXP;
  }, [profile]);

  const triggerXpGain = (amount: number) => {
    console.log(`🎉 Triggering manual XP animation: +${amount} XP`);
    triggerXpAnimation(amount, window.innerWidth / 2, window.innerHeight / 2);
  };

  const triggerLevelUpCelebration = (newLevel: number) => {
    console.log(`🆙 Triggering level up celebration: Level ${newLevel}`);

    // 🎊 Escolher animação baseada no nível alcançado
    if (newLevel >= 10) {
      // Níveis altos: MEGA celebration (150 confetti + 6 segundos)
      console.log("🌈 MEGA CELEBRATION for level", newLevel);
      triggerMega();
    } else if (newLevel >= 5) {
      // Níveis médios: Achievement celebration
      console.log("🏆 ACHIEVEMENT CELEBRATION for level", newLevel);
      triggerAchievement(
        `Nível ${newLevel} Alcançado!`,
        "Parabéns pelo progresso!"
      );
    } else {
      // Níveis iniciais: Level up standard
      console.log("⭐ LEVEL UP CELEBRATION for level", newLevel);
      triggerLevelUp(newLevel);
    }

    // Adicionar notificação de level up
    addNotification({
      xpGained: 0,
      action: `Level Up!`,
      levelUp: {
        newLevel,
        title: `Nível ${newLevel}`,
      },
    });
  };

  // Função centralizada para processar resposta de atividade
  const processActivityResponse = (activityResponse: any) => {
    if (!activityResponse) return;

    console.log("🎯 Processing activity response:", activityResponse);

    // Se houve level up, apenas triggerar a celebração de level up
    if (activityResponse.leveledUp && activityResponse.newLevel) {
      console.log(
        `🆙 LEVEL UP! ${activityResponse.previousLevel} → ${activityResponse.newLevel}`
      );
      triggerLevelUpCelebration(activityResponse.newLevel);

      // Atualizar perfil para refletir o novo nível
      refreshProfile();
      return; // NÃO triggerar animação de XP quando há level up
    }

    // Se ganhou XP mas não subiu de nível, triggerar animação de XP
    if (activityResponse.xpEarned && activityResponse.xpEarned > 0) {
      console.log(`💎 XP GANHO: +${activityResponse.xpEarned} XP`);
      triggerXpGain(activityResponse.xpEarned);

      // Adicionar notificação de XP ganho
      addNotification({
        xpGained: activityResponse.xpEarned,
        action: activityResponse.title || "Atividade concluída",
      });

      // Atualizar perfil
      refreshProfile();
    }
  };

  const contextValue: GamificationContextType = {
    // Perfil
    profile,
    loading,
    error,
    refreshProfile,

    // Notificações
    addXPNotification: addNotification,
    clearNotifications,

    // Animações centralizadas
    triggerXpGain,
    triggerLevelUpCelebration,
    processActivityResponse,

    // Animações extras
    triggerSparkles,
    triggerAchievement,
    triggerMega,
  };

  return (
    <GamificationContext.Provider value={contextValue}>
      {children}

      {/* Epic Celebrations - Componente global para animações */}
      {CelebrationsComponent}

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
