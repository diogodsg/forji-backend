/**
 * 🎊 Confetti Component
 *
 * Componente de confete para celebrações (level ups, conquistas, etc)
 *
 * Features:
 * - Animação de confetes caindo
 * - Cores customizáveis
 * - Quantidade configurável
 * - Auto-destroy após animação
 * - Performance otimizada (CSS animations)
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type React from "react";

export interface ConfettiProps {
  count?: number; // Quantidade de confetes (padrão: 50)
  duration?: number; // Duração total (ms)
  colors?: string[]; // Cores dos confetes
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: string;
  left: number; // 0-100%
  top: number; // Posição inicial vertical (px, pode ser negativa)
  delay: number; // 0-2s (aumentado para mais dispersão)
  duration: number; // 3-5.5s (aumentado)
  color: string;
  rotation: number; // 0-360deg
  size: number; // 6-14px
  shape: "square" | "circle" | "rect"; // Formas variadas
  wobble: number; // 20-70px de balanço horizontal
}

/**
 * Gera propriedades aleatórias para um confete
 * Configurado para máxima dispersão temporal e espacial
 */
function generateConfettiPiece(id: string, colors: string[]): ConfettiPiece {
  const shapes: ("square" | "circle" | "rect")[] = ["square", "circle", "rect"];

  // Alguns confetti começam mais baixo para criar efeito de nuvem dispersa
  const startHeight = Math.random() < 0.3 ? -50 - Math.random() * 100 : -20;

  return {
    id,
    left: Math.random() * 100, // 0-100% da largura
    delay: Math.random() * 2, // 0-2s de delay (AUMENTADO para mais dispersão!)
    duration: 3 + Math.random() * 2.5, // 3-5.5s (durações mais variadas)
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    size: 6 + Math.random() * 8, // 6-14px (mais variação)
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    wobble: 20 + Math.random() * 50, // 20-70px de balanço (mais movimento horizontal)
    top: startHeight, // Altura inicial variada
  };
}

/**
 * Componente de Confetti
 */
const DEFAULT_COLORS = [
  "#8B5CF6", // violet-500
  "#A78BFA", // violet-400
  "#C4B5FD", // violet-300
  "#F59E0B", // amber-500
  "#FBBF24", // amber-400
  "#10B981", // green-500
  "#34D399", // green-400
  "#3B82F6", // blue-500
  "#60A5FA", // blue-400
];

export function Confetti({
  count = 50,
  duration = 7500, // Aumentado de 3000 para 7500ms para dar tempo de todos caírem
  colors = DEFAULT_COLORS,
  onComplete,
}: ConfettiProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>(() => {
    // Gerar confetes no estado inicial (lazy initialization)
    const pieces = Array.from({ length: count }, (_, i) =>
      generateConfettiPiece(`confetti-${i}`, colors)
    );
    console.log("✨ Confetti CREATED:", pieces.length, "pieces");
    return pieces;
  });

  useEffect(() => {
    console.log("✨ Confetti MOUNTED with", confetti.length, "confetti");

    // Auto-destroy após duração
    const timer = setTimeout(() => {
      console.log("✨ Confetti DESTROYING");
      setConfetti([]);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  console.log("✨ Confetti RENDER:", confetti.length, "pieces");

  if (confetti.length === 0) {
    console.log("✨ Confetti returning NULL (no pieces)");
    return null;
  }

  console.log("✨ Confetti RENDERING", confetti.length, "pieces to DOM");

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
      {confetti.map((piece) => {
        const shapeStyle =
          piece.shape === "circle"
            ? { borderRadius: "50%" }
            : piece.shape === "rect"
            ? {
                width: `${piece.size * 0.6}px`,
                height: `${piece.size * 1.5}px`,
                borderRadius: "2px",
              }
            : { borderRadius: "2px" };

        return (
          <div
            key={piece.id}
            className="absolute"
            style={{
              top: `${piece.top}px`,
              left: `${piece.left}%`,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              backgroundColor: piece.color,
              animation: `confettiFall ${piece.duration}s ease-out ${piece.delay}s forwards`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              ...shapeStyle,
              // Variável CSS para wobble (usada na animação)
              ["--wobble" as any]: `${piece.wobble}px`,
            }}
          />
        );
      })}
    </div>,
    document.body
  );
}

// Estado global compartilhado para confetti
let globalConfettiType: "default" | "levelup" | "achievement" | "mega" | null =
  null;
let globalConfettiSetters: Array<
  React.Dispatch<
    React.SetStateAction<"default" | "levelup" | "achievement" | "mega" | null>
  >
> = [];

/**
 * Hook para gerenciar animações de confetti
 * Usa estado global para compartilhar entre componentes
 */
export function useConfetti() {
  const [confettiType, setConfettiType] = useState<
    "default" | "levelup" | "achievement" | "mega" | null
  >(null);

  // Registrar setter no mount
  useEffect(() => {
    globalConfettiSetters.push(setConfettiType);
    setConfettiType(globalConfettiType);

    return () => {
      const index = globalConfettiSetters.indexOf(setConfettiType);
      if (index > -1) {
        globalConfettiSetters.splice(index, 1);
      }
    };
  }, []);

  const triggerConfetti = (
    type: "default" | "levelup" | "achievement" | "mega" = "default"
  ) => {
    globalConfettiType = type;

    // Atualizar todos os componentes registrados
    globalConfettiSetters.forEach((setter) => {
      setter(type);
    });

    console.log(
      "🎊 Confetti triggered:",
      type,
      "| Total setters:",
      globalConfettiSetters.length
    );

    // Duração aumentada para dar tempo de todos confetti caírem
    // Considerando: delay máximo (2s) + duração máxima (5.5s) + margem (1s) = ~8.5s
    const duration =
      type === "mega"
        ? 10000 // 10s para mega
        : type === "levelup"
        ? 8500 // 8.5s para levelup (120 confetti)
        : type === "achievement"
        ? 8000 // 8s para achievement (80 confetti)
        : 7500; // 7.5s para default (50 confetti)

    setTimeout(() => {
      globalConfettiType = null;
      globalConfettiSetters.forEach((setter) => {
        setter(null);
      });
    }, duration);
  };

  const renderConfetti = () => {
    if (!confettiType) return null;

    const onComplete = () => {
      globalConfettiType = null;
      globalConfettiSetters.forEach((setter) => {
        setter(null);
      });
    };

    switch (confettiType) {
      case "levelup":
        return <LevelUpConfetti onComplete={onComplete} />;
      case "achievement":
        return <AchievementConfetti onComplete={onComplete} />;
      case "mega":
        return <MegaConfetti onComplete={onComplete} />;
      default:
        return <Confetti onComplete={onComplete} />;
    }
  };

  return {
    showConfetti: confettiType !== null,
    triggerConfetti,
    ConfettiComponent: renderConfetti(),
  };
}

/**
 * Confetti preset para level up - ÉPICO! 🎉
 */
export function LevelUpConfetti({ onComplete }: { onComplete?: () => void }) {
  return (
    <Confetti
      count={120} // Mais confetes!
      duration={8500} // Tempo suficiente para todos caírem (delay 2s + duration 5.5s + margem)
      colors={[
        "#8B5CF6", // violet-500
        "#A78BFA", // violet-400
        "#DDD6FE", // violet-200
        "#F59E0B", // amber-500
        "#FCD34D", // amber-300
        "#FBBF24", // amber-400
        "#FDE047", // yellow-300
      ]}
      onComplete={onComplete}
    />
  );
}

/**
 * Confetti preset para conquista - Celebração verde e dourada
 */
export function AchievementConfetti({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  return (
    <Confetti
      count={80}
      duration={8000} // Tempo suficiente para todos caírem
      colors={[
        "#10B981", // green-500
        "#34D399", // green-400
        "#6EE7B7", // green-300
        "#FCD34D", // amber-300
        "#FBBF24", // amber-400
        "#F59E0B", // amber-500
      ]}
      onComplete={onComplete}
    />
  );
}

/**
 * Confetti preset para MEGA celebração - Explosão de cores! 🌈
 */
export function MegaConfetti({ onComplete }: { onComplete?: () => void }) {
  return (
    <Confetti
      count={150}
      duration={10000} // MEGA = mais tempo ainda (10 segundos!)
      colors={[
        "#EF4444", // red-500
        "#F59E0B", // amber-500
        "#FCD34D", // yellow-300
        "#10B981", // green-500
        "#3B82F6", // blue-500
        "#8B5CF6", // violet-500
        "#EC4899", // pink-500
      ]}
      onComplete={onComplete}
    />
  );
}

// Adicionar animação CSS global (adicionar no index.css ou global.css)
export const confettiAnimationStyles = `
@keyframes confettiFall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
`;
