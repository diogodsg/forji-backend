import { useState, useEffect } from "react";
import type { ProfileStats } from "../types/profile";

export function useProfileStats(userId?: string) {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/profile/${userId}/stats`);
        // const data: ProfileStatsResponse = await response.json();

        // Mock data for now
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

        const mockStats: ProfileStats = {
          totalXP: 2500,
          currentLevel: 8,
          levelProgress: {
            current: 650,
            required: 1000,
            percentage: 65,
          },
          completedPDIs: 3,
          activePDIs: 1,
          completionRate: 85,
          teamContributions: 12,
          badgesEarned: 8,
          achievements: {
            totalBadges: 8,
            rareBadges: 2,
            recentBadges: [], // Will be populated with actual badge data
          },
        };

        setStats(mockStats);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar estatísticas"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  return {
    stats,
    loading,
    error,
    refetch: () => {
      // Re-trigger the effect
      setLoading(true);
    },
  };
}
