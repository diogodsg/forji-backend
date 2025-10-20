/**
 * useGamificationProfile - Hook para buscar perfil de gamificação
 *
 * Busca dados de XP, nível, streak e badges do usuário autenticado.
 */

import { useState, useEffect } from "react";
import { getGamificationProfile } from "@/lib/api/endpoints/gamification";

export interface GamificationProfile {
  id: string;
  userId: string;
  level: number;
  currentXP: number;
  totalXP: number;
  nextLevelXP: number; // Corrigir para corresponder ao backend
  progressToNextLevel: number;
  streak: number;
  streakStatus: "active" | "broken" | "new";
  lastActiveAt: string;
  badges: any[]; // Simplificado por enquanto
  totalBadges: number;
  rank: string | null;
}

export function useGamificationProfile() {
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getGamificationProfile();
      setProfile(data as GamificationProfile);
    } catch (err) {
      console.error("Erro ao buscar perfil de gamificação:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refreshProfile,
  };
}
