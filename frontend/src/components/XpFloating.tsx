/**
 * 🎯 XP Floating Animation
 *
 * Componente para exibir animação flutuante de +XP
 * quando o usuário ganha experiência.
 *
 * Features:
 * - Animação flutuante (bottom → top com fade out)
 * - Cor dinâmica baseada na quantidade de XP
 * - Auto-destroy após animação
 * - Posição customizável
 * - Suporta múltiplas animações simultâneas
 * - Confetti automático ao ganhar XP 🎉
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Zap } from "lucide-react";
import type React from "react";
import { useConfetti } from "./Confetti";

export interface XpFloatingProps {
  xp: number;
  x?: number; // Posição X (px)
  y?: number; // Posição Y (px)
  onComplete?: () => void;
  duration?: number; // Duração da animação (ms)
}

/**
 * Componente de animação flutuante de XP
 */
export function XpFloating({
  xp,
  x = window.innerWidth / 2,
  y = window.innerHeight / 2,
  onComplete,
  duration = 2000,
}: XpFloatingProps) {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!mounted) return null;

  // Cor baseada na quantidade de XP
  const getXpColor = () => {
    if (xp >= 100) return "text-purple-500"; // Muito XP
    if (xp >= 50) return "text-violet-500"; // XP alto
    if (xp >= 25) return "text-blue-500"; // XP médio
    return "text-green-500"; // XP baixo
  };

  const getGlowColor = () => {
    if (xp >= 100) return "shadow-purple-500/50";
    if (xp >= 50) return "shadow-violet-500/50";
    if (xp >= 25) return "shadow-blue-500/50";
    return "shadow-green-500/50";
  };

  return createPortal(
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: x,
        top: y,
        animation: `floatUp ${duration}ms ease-out forwards`,
      }}
    >
      <div
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full
          bg-white border-2 ${getXpColor()} border-current
          shadow-lg ${getGlowColor()}
          font-bold text-lg
          animate-pulse
        `}
      >
        <Zap className={`w-5 h-5 ${getXpColor()} fill-current`} />
        <span className={getXpColor()}>+{xp} XP</span>
      </div>
    </div>,
    document.body
  );
}

// Estado global compartilhado para animações XP
let globalXpAnimations: Array<{
  id: string;
  xp: number;
  x: number;
  y: number;
}> = [];
let globalXpSetters: Array<
  React.Dispatch<
    React.SetStateAction<
      Array<{ id: string; xp: number; x: number; y: number }>
    >
  >
> = [];

/**
 * Hook para gerenciar múltiplas animações de XP
 * Usa estado global para compartilhar entre componentes
 * Inclui confetti automático! 🎉
 */
export function useXpAnimations() {
  const [animations, setAnimations] = useState<
    Array<{ id: string; xp: number; x: number; y: number }>
  >([]);
  const { triggerConfetti } = useConfetti();

  // Registrar setter no mount
  useEffect(() => {
    globalXpSetters.push(setAnimations);
    setAnimations(globalXpAnimations);

    return () => {
      const index = globalXpSetters.indexOf(setAnimations);
      if (index > -1) {
        globalXpSetters.splice(index, 1);
      }
    };
  }, []);

  const triggerXpAnimation = (xp: number, x?: number, y?: number) => {
    const id = `xp-${Date.now()}-${Math.random()}`;
    const finalX = x ?? window.innerWidth / 2;
    const finalY = y ?? window.innerHeight / 2;

    const newAnimation = { id, xp, x: finalX, y: finalY };
    globalXpAnimations = [...globalXpAnimations, newAnimation];

    // Atualizar todos os componentes registrados
    globalXpSetters.forEach((setter) => {
      setter([...globalXpAnimations]);
    });

    console.log("🎯 XP Animation triggered:", {
      xp,
      x: finalX,
      y: finalY,
      totalAnimations: globalXpAnimations.length,
    });

    // 🎉 Trigger confetti suave junto com XP!
    // Quantidade de confetti baseada no XP ganho
    if (xp >= 100) {
      triggerConfetti("levelup"); // Muito XP = confetti abundante
    } else if (xp >= 50) {
      triggerConfetti("achievement"); // XP médio-alto
    } else {
      triggerConfetti("default"); // XP normal
    }

    // Auto-remove após 2 segundos
    setTimeout(() => {
      globalXpAnimations = globalXpAnimations.filter((anim) => anim.id !== id);
      globalXpSetters.forEach((setter) => {
        setter([...globalXpAnimations]);
      });
    }, 2100);
  };

  return {
    animations,
    triggerXpAnimation,
  };
}

/**
 * Componente container para renderizar múltiplas animações
 */
export function XpAnimationContainer() {
  const { animations } = useXpAnimations();

  console.log("🎯 XpAnimationContainer render, animations:", animations.length);

  return (
    <>
      {animations.map((anim) => (
        <XpFloating key={anim.id} xp={anim.xp} x={anim.x} y={anim.y} />
      ))}
    </>
  );
}

// Adicionar animação CSS global (adicionar no index.css ou global.css)
export const xpAnimationStyles = `
@keyframes floatUp {
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 0;
  }
  10% {
    transform: translateY(-10px) scale(1);
    opacity: 1;
  }
  90% {
    transform: translateY(-100px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-120px) scale(0.8);
    opacity: 0;
  }
}
`;
