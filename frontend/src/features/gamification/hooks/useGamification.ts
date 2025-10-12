import { useState, useEffect } from "react";
import { api } from "../../../lib/apiClient";
import type {
  PlayerProfile,
  LeaderboardEntry,
  TeamLeaderboardEntry,
  XPGain,
  WeeklyChallenge,
} from "../types/gamification";

// Hook para obter perfil do jogador
export function usePlayerProfile(userId?: number) {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        const endpoint = userId
          ? `/gamification/profile/${userId}`
          : "/gamification/profile";

        const response = await api<PlayerProfile>(endpoint, { auth: true });
        setProfile(response);
      } catch (err: any) {
        setError(err.message || "Failed to fetch player profile");
        console.error("Error fetching player profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  const refreshProfile = () => {
    setLoading(true);
    const endpoint = userId
      ? `/gamification/profile/${userId}`
      : "/gamification/profile";

    api<PlayerProfile>(endpoint, { auth: true })
      .then(setProfile)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return { profile, loading, error, refreshProfile };
}

// Hook para obter leaderboard
export function useLeaderboard(period: 'week' | 'month' | 'all' = 'week') {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({ period });
        const response = await api<LeaderboardEntry[]>(
          `/gamification/leaderboard?${queryParams}`,
          { auth: true }
        );
        setLeaderboard(response);
      } catch (err: any) {
        setError(err.message || "Failed to fetch leaderboard");
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [period]);

  const refreshLeaderboard = () => {
    setLoading(true);
    const queryParams = new URLSearchParams({ period });
    api<LeaderboardEntry[]>(`/gamification/leaderboard?${queryParams}`, { auth: true })
      .then(setLeaderboard)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return { leaderboard, loading, error, refreshLeaderboard };
}

// Hook para obter team leaderboard
export function useTeamLeaderboard(period: 'week' | 'month' | 'all' = 'week') {
  const [teamLeaderboard, setTeamLeaderboard] = useState<TeamLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamLeaderboard() {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({ period });
        const response = await api<TeamLeaderboardEntry[]>(
          `/gamification/team-leaderboard?${queryParams}`,
          { auth: true }
        );
        setTeamLeaderboard(response);
      } catch (err: any) {
        setError(err.message || "Failed to fetch team leaderboard");
        console.error("Error fetching team leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamLeaderboard();
  }, [period]);

  const refreshTeamLeaderboard = () => {
    setLoading(true);
    const queryParams = new URLSearchParams({ period });
    api<TeamLeaderboardEntry[]>(`/gamification/team-leaderboard?${queryParams}`, { auth: true })
      .then(setTeamLeaderboard)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return { teamLeaderboard, loading, error, refreshTeamLeaderboard };
}

// Hook para adicionar XP (para testes)
export function useAddXP() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addXP = async (request: { action: string; points?: number }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api<XPGain>("/gamification/xp/manual", {
        method: "POST",
        body: JSON.stringify(request),
        auth: true,
      });
      return response;
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
export function useWeeklyChallenge() {
  const [challenge, setChallenge] = useState<WeeklyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        setLoading(true);
        setError(null);

        const response = await api<WeeklyChallenge>("/gamification/weekly-challenge", {
          auth: true,
        });
        setChallenge(response);
      } catch (err: any) {
        setError(err.message || "Failed to fetch weekly challenge");
        console.error("Error fetching weekly challenge:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenge();
  }, []);

  const refreshChallenge = () => {
    setLoading(true);
    api<WeeklyChallenge>("/gamification/weekly-challenge", { auth: true })
      .then(setChallenge)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return { challenge, loading, error, refreshChallenge };
}
