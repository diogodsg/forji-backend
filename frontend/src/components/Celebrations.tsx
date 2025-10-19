/**
 * 🎉 Epic Celebrations System
 *
 * Componentes de celebração para diferentes tipos de conquistas:
 * - Default: Sparkles + confetti suave
 * - Level Up: Explosão radial + badge 3D
 * - Achievement: Troféu + banner + spotlight
 * - Mega: Tudo junto + fogos de artifício
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// ============================================
// 1. ✨ SPARKLES (Default Celebration)
// ============================================

interface SparkleParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

export function Sparkles() {
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  useEffect(() => {
    // Gerar 20 sparkles ao redor do centro
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = 100;

    const sparkles = Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * Math.PI * 2;
      return {
        id: `sparkle-${i}`,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: 4 + Math.random() * 6,
        color: ["#8B5CF6", "#A78BFA", "#DDD6FE", "#F59E0B"][
          Math.floor(Math.random() * 4)
        ],
        delay: Math.random() * 0.3,
        duration: 0.8 + Math.random() * 0.4,
      };
    });

    setParticles(sparkles);

    const timer = setTimeout(() => setParticles([]), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (particles.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: "50%",
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            animation: `sparkleFloat ${particle.duration}s ease-out ${particle.delay}s forwards`,
          }}
        />
      ))}
    </div>,
    document.body
  );
}

// ============================================
// 2. ⭐ LEVEL UP (Explosão Radial + Badge)
// ============================================

interface LevelUpProps {
  newLevel: number;
}

export function LevelUpCelebration({ newLevel }: LevelUpProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return createPortal(
    <>
      {/* Flash de tela branco/dourado */}
      <div
        className="fixed inset-0 z-[9997] bg-gradient-to-br from-amber-300/30 to-yellow-300/30 pointer-events-none"
        style={{
          animation: "flash 0.3s ease-out forwards",
        }}
      />

      {/* Anel de energia expandindo */}
      <div className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none">
        <div
          className="absolute rounded-full border-4 border-amber-400"
          style={{
            width: "100px",
            height: "100px",
            animation: "ringExpand 1.5s ease-out forwards",
            boxShadow: "0 0 40px rgba(251, 191, 36, 0.6)",
          }}
        />
      </div>

      {/* Badge do nível */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <div
          className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl px-12 py-8 shadow-2xl border-4 border-yellow-300"
          style={{
            animation:
              "badgeZoom 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
          }}
        >
          <div className="text-center">
            <div className="text-white text-sm font-bold uppercase tracking-wider mb-2">
              Level Up!
            </div>
            <div className="text-white text-6xl font-black">{newLevel}</div>
          </div>
        </div>
      </div>

      {/* Partículas douradas explodindo */}
      <RadialParticles color="#F59E0B" count={40} />
    </>,
    document.body
  );
}

// ============================================
// 3. 🏆 ACHIEVEMENT (Troféu + Banner)
// ============================================

interface AchievementProps {
  title: string;
  description?: string;
}

export function AchievementCelebration({
  title,
  description,
}: AchievementProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return createPortal(
    <>
      {/* Spotlight effect */}
      <div
        className="fixed inset-0 z-[9997] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(251, 191, 36, 0.2) 0%, transparent 60%)",
          animation: "spotlightPulse 2s ease-in-out infinite",
        }}
      />

      {/* Banner superior */}
      <div
        className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
        style={{
          animation:
            "bannerSlide 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        }}
      >
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 py-4 px-8 shadow-2xl border-b-4 border-green-600">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-white text-2xl font-black flex items-center justify-center gap-3">
              <span className="text-3xl">🏆</span>
              <span>Conquista Desbloqueada!</span>
            </div>
            <div className="text-green-100 text-lg font-semibold mt-1">
              {title}
            </div>
            {description && (
              <div className="text-green-200 text-sm mt-1">{description}</div>
            )}
          </div>
        </div>
      </div>

      {/* Troféu 3D no centro */}
      <div className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none">
        <div
          className="text-9xl"
          style={{
            animation: "trophySpin 2s ease-in-out forwards",
            filter: "drop-shadow(0 0 30px rgba(251, 191, 36, 0.8))",
          }}
        >
          🏆
        </div>
      </div>

      {/* Faixas de luz douradas */}
      <LightBeams />
    </>,
    document.body
  );
}

// ============================================
// 4. 🌈 MEGA (Tudo Junto + Fogos)
// ============================================

export function MegaCelebration() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return createPortal(
    <>
      {/* Background arco-íris animado */}
      <div
        className="fixed inset-0 z-[9996] pointer-events-none"
        style={{
          background:
            "linear-gradient(45deg, #EF4444, #F59E0B, #10B981, #3B82F6, #8B5CF6, #EC4899)",
          backgroundSize: "400% 400%",
          animation: "rainbowWave 3s ease infinite",
          opacity: 0.15,
        }}
      />

      {/* Screen shake suave */}
      <div
        className="fixed inset-0 z-[9997] pointer-events-none"
        style={{
          animation: "screenShake 0.5s ease-in-out",
        }}
      />

      {/* TEXTO GIGANTE */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <div
          className="text-center"
          style={{
            animation:
              "megaTextZoom 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
          }}
        >
          <div
            className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400"
            style={{
              WebkitBackgroundClip: "text",
              backgroundSize: "200% 200%",
              animation: "goldShimmer 2s ease infinite",
              textShadow: "0 0 60px rgba(251, 191, 36, 0.5)",
            }}
          >
            PARABÉNS!
          </div>
          <div className="text-3xl font-bold text-white mt-4 animate-pulse">
            🎉 Você é incrível! 🎉
          </div>
        </div>
      </div>

      {/* Fogos de artifício */}
      <Fireworks />

      {/* Chuva de moedas */}
      <CoinRain />
    </>,
    document.body
  );
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

function RadialParticles({ color, count }: { color: string; count: number }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return {
      id: `radial-${i}`,
      angle,
      distance: 150 + Math.random() * 100,
    };
  });

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-full"
          style={
            {
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`,
              animation: `radialBurst 1s ease-out forwards`,
              "--angle": `${p.angle}rad`,
              "--distance": `${p.distance}px`,
            } as any
          }
        />
      ))}
    </div>
  );
}

function LightBeams() {
  return (
    <div className="fixed inset-0 z-[9997] pointer-events-none overflow-hidden">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute h-full w-32 bg-gradient-to-b from-transparent via-yellow-300/30 to-transparent"
          style={{
            left: `${i * 25}%`,
            animation: `lightBeamSweep 2s ease-in-out ${i * 0.3}s infinite`,
            transform: "skewX(-20deg)",
          }}
        />
      ))}
    </div>
  );
}

function Fireworks() {
  const [explosions, setExplosions] = useState<
    Array<{ id: number; x: number; y: number; color: string }>
  >([]);

  useEffect(() => {
    const colors = [
      "#EF4444",
      "#F59E0B",
      "#10B981",
      "#3B82F6",
      "#8B5CF6",
      "#EC4899",
    ];
    const timers: NodeJS.Timeout[] = [];

    // 5 explosões em sequência
    [0, 600, 1200, 1800, 2400].forEach((delay, i) => {
      const timer = setTimeout(() => {
        setExplosions((prev) => [
          ...prev,
          {
            id: i,
            x: 20 + Math.random() * 60, // 20-80% da tela
            y: 20 + Math.random() * 40, // 20-60% da tela
            color: colors[i % colors.length],
          },
        ]);
      }, delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      {explosions.map((explosion) => (
        <div
          key={explosion.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: `${explosion.x}%`,
            top: `${explosion.y}%`,
          }}
        >
          {/* Partículas da explosão */}
          {Array.from({ length: 30 }, (_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={
                  {
                    backgroundColor: explosion.color,
                    boxShadow: `0 0 10px ${explosion.color}`,
                    animation: `fireworkParticle 1s ease-out forwards`,
                    "--angle": `${angle}rad`,
                    "--distance": "150px",
                  } as any
                }
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

function CoinRain() {
  const coins = Array.from({ length: 50 }, (_, i) => ({
    id: `coin-${i}`,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute text-4xl"
          style={{
            left: `${coin.left}%`,
            top: "-50px",
            animation: `coinFall ${coin.duration}s linear ${coin.delay}s forwards`,
          }}
        >
          💰
        </div>
      ))}
    </div>
  );
}
