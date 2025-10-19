/**
 * 🎉 Celebrations Hook System
 *
 * Hook para gerenciar todos os tipos de celebração:
 * - useSparkles() - Confetti suave + sparkles
 * - useLevelUp() - Explosão radial + badge
 * - useAchievement() - Troféu + banner
 * - useMega() - Tudo junto + fogos
 */

import { useState, useCallback } from "react";
import {
  Sparkles,
  LevelUpCelebration,
  AchievementCelebration,
  MegaCelebration,
} from "../components/Celebrations";
import { useConfetti } from "../components/Confetti";

// ============================================
// 1. SPARKLES (Default)
// ============================================

export function useSparkles() {
  const [show, setShow] = useState(false);
  const { triggerConfetti, ConfettiComponent } = useConfetti();

  const trigger = useCallback(() => {
    setShow(true);
    triggerConfetti("default"); // Confetti suave
    setTimeout(() => setShow(false), 2000);
  }, [triggerConfetti]);

  const SparklesComponent = show ? <Sparkles /> : null;

  return {
    triggerSparkles: trigger,
    SparklesComponent: (
      <>
        {SparklesComponent}
        {ConfettiComponent}
      </>
    ),
  };
}

// ============================================
// 2. LEVEL UP
// ============================================

interface LevelUpState {
  show: boolean;
  level: number;
}

export function useLevelUp() {
  const [state, setState] = useState<LevelUpState>({ show: false, level: 0 });
  const { triggerConfetti, ConfettiComponent } = useConfetti();

  const trigger = useCallback(
    (newLevel: number) => {
      setState({ show: true, level: newLevel });
      triggerConfetti("levelup"); // 120 confetti dourados
      setTimeout(() => setState({ show: false, level: 0 }), 3000);
    },
    [triggerConfetti]
  );

  const LevelUpComponent = state.show ? (
    <LevelUpCelebration newLevel={state.level} />
  ) : null;

  return {
    triggerLevelUp: trigger,
    LevelUpComponent: (
      <>
        {LevelUpComponent}
        {ConfettiComponent}
      </>
    ),
  };
}

// ============================================
// 3. ACHIEVEMENT
// ============================================

interface AchievementState {
  show: boolean;
  title: string;
  description?: string;
}

export function useAchievement() {
  const [state, setState] = useState<AchievementState>({
    show: false,
    title: "",
  });
  const { triggerConfetti, ConfettiComponent } = useConfetti();

  const trigger = useCallback(
    (title: string, description?: string) => {
      setState({ show: true, title, description });
      triggerConfetti("achievement"); // 80 confetti verdes/dourados
      setTimeout(() => setState({ show: false, title: "" }), 4000);
    },
    [triggerConfetti]
  );

  const AchievementComponent = state.show ? (
    <AchievementCelebration
      title={state.title}
      description={state.description}
    />
  ) : null;

  return {
    triggerAchievement: trigger,
    AchievementComponent: (
      <>
        {AchievementComponent}
        {ConfettiComponent}
      </>
    ),
  };
}

// ============================================
// 4. MEGA
// ============================================

export function useMega() {
  const [show, setShow] = useState(false);
  const { triggerConfetti, ConfettiComponent } = useConfetti();

  const trigger = useCallback(() => {
    setShow(true);
    triggerConfetti("mega"); // 150 confetti massivo
    setTimeout(() => setShow(false), 6000);
  }, [triggerConfetti]);

  const MegaComponent = show ? <MegaCelebration /> : null;

  return {
    triggerMega: trigger,
    MegaComponent: (
      <>
        {MegaComponent}
        {ConfettiComponent}
      </>
    ),
  };
}

// ============================================
// 5. HOOK UNIFICADO (opcional)
// ============================================

export function useCelebrations() {
  const sparkles = useSparkles();
  const levelUp = useLevelUp();
  const achievement = useAchievement();
  const mega = useMega();

  return {
    // Triggers
    triggerSparkles: sparkles.triggerSparkles,
    triggerLevelUp: levelUp.triggerLevelUp,
    triggerAchievement: achievement.triggerAchievement,
    triggerMega: mega.triggerMega,

    // Componente único com todas as celebrações
    CelebrationsComponent: (
      <>
        {sparkles.SparklesComponent}
        {levelUp.LevelUpComponent}
        {achievement.AchievementComponent}
        {mega.MegaComponent}
      </>
    ),
  };
}
