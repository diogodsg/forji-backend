import { useState, useEffect } from "react";
import type {
  PlayerProfile,
  LeaderboardEntry,
  TeamLeaderboardEntry,
  XPGain,
  WeeklyChallenge,
} from "../types/gamification";

// Hook para obter perfil do jogador
// NOTA: Backend não tem módulo de gamificação, usando apenas mock
export function usePlayerProfile(userId?: number) {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        // Backend não tem gamificação, usar mock diretamente
        console.log(
          "⚠️ Gamification: Usando dados mock (backend não tem este módulo)"
        );

        const mockProfile: PlayerProfile = {
          userId: userId || 1,
          level: 1,
          currentXP: 0,
          totalXP: 0,
          nextLevelXP: 100,
          title: "Iniciante",
          badges: [],
          rank: 0,
        };

        setProfile(mockProfile);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  const refreshProfile = () => {
    setLoading(true);
    // Mock apenas
    const mockProfile: PlayerProfile = {
      userId: userId || 1,
      level: 1,
      currentXP: 0,
      totalXP: 0,
      nextLevelXP: 100,
      title: "Iniciante",
      badges: [],
      rank: 0,
    };
    setProfile(mockProfile);
    setError(null);
    setLoading(false);
  };

  return { profile, loading, error, refreshProfile };
}

// Hook para obter leaderboard
// NOTA: Backend não tem módulo de gamificação, usando apenas mock
export function useLeaderboard(period: "week" | "month" | "all" = "week") {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        setError(null);

        // Backend não tem gamificação, usar mock diretamente
        console.log(
          "⚠️ Gamification: Usando leaderboard mock (backend não tem este módulo)"
        );
        setLeaderboard([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [period]);

  const refreshLeaderboard = () => {
    setLoading(true);
    // Mock apenas
    setLeaderboard([]);
    setError(null);
    setLoading(false);
  };

  return { leaderboard, loading, error, refreshLeaderboard };
}

// Hook para obter team leaderboard
// NOTA: Backend não tem módulo de gamificação, usando apenas mock
export function useTeamLeaderboard(period: "week" | "month" | "all" = "week") {
  const [teamLeaderboard, setTeamLeaderboard] = useState<
    TeamLeaderboardEntry[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamLeaderboard() {
      try {
        setLoading(true);
        setError(null);

        // Backend não tem gamificação, usar mock diretamente
        console.log(
          "⚠️ Gamification: Usando team leaderboard mock (backend não tem este módulo)"
        );
        setTeamLeaderboard([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamLeaderboard();
  }, [period]);

  const refreshTeamLeaderboard = () => {
    setLoading(true);
    // Mock apenas
    setTeamLeaderboard([]);
    setError(null);
    setLoading(false);
  };

  return { teamLeaderboard, loading, error, refreshTeamLeaderboard };
}

// Hook para adicionar XP (para testes)
// NOTA: Backend não tem módulo de gamificação, retorna mock
export function useAddXP() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addXP = async (request: { action: string; points?: number }) => {
    try {
      setLoading(true);
      setError(null);

      // Backend não tem gamificação, retornar mock
      console.log(
        "⚠️ Gamification: addXP mock (backend não tem este módulo)",
        request
      );

      const mockResponse: XPGain = {
        action: request.action,
        points: request.points || 10,
        category: "development",
        description: "Mock XP gain",
      };

      return mockResponse;
    } catch (err: any) {
      setError(err.message || "Failed to add XP");
      console.error("Error adding XP:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addXP, loading, error };
}

// Hook para obter desafio semanal
// NOTA: Backend não tem módulo de gamificação, usando apenas mock
export function useWeeklyChallenge() {
  const [challenge, setChallenge] = useState<WeeklyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        setLoading(true);
        setError(null);

        // Backend não tem gamificação, usar mock diretamente
        console.log(
          "⚠️ Gamification: Usando desafio semanal mock (backend não tem este módulo)"
        );

        const mockChallenge: WeeklyChallenge = {
          id: "mock-challenge",
          title: "Desafio Semanal",
          description: "Complete suas tarefas esta semana",
          target: 10,
          current: 0,
          reward: "100 XP",
          progress: 0,
          isCompleted: false,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };

        setChallenge(mockChallenge);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenge();
  }, []);

  const refreshChallenge = () => {
    setLoading(true);
    // Mock apenas
    const mockChallenge: WeeklyChallenge = {
      id: "mock-challenge",
      title: "Desafio Semanal",
      description: "Complete suas tarefas esta semana",
      target: 10,
      current: 0,
      reward: "100 XP",
      progress: 0,
      isCompleted: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    setChallenge(mockChallenge);
    setError(null);
    setLoading(false);
  };

  return { challenge, loading, error, refreshChallenge };
}
