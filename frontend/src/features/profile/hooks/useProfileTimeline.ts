import { useState, useEffect } from "react";
import type { TimelineEntry } from "../types/profile";

export function useProfileTimeline(userId?: string, limit = 20) {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchTimeline() {
      setLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/profile/${userId}/timeline?limit=${limit}`);
        // const data = await response.json();

        // Mock data for now
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay

        const mockTimeline: TimelineEntry[] = [
          {
            id: "1",
            type: "badge_earned",
            title: "Novo Badge Conquistado!",
            description:
              "Você conquistou o badge 'Team Player' por ajudar colegas de equipe",
            xpGained: 50,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            metadata: {
              badgeId: "team_player",
            },
            isPublic: true,
          },
          {
            id: "2",
            type: "level_up",
            title: "Nível Avançado!",
            description: "Parabéns! Você alcançou o nível 8",
            xpGained: 0,
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            metadata: {
              level: 8,
            },
            isPublic: true,
          },
          {
            id: "3",
            type: "pdi_milestone",
            title: "Milestone PDI Completada",
            description: "Finalizou uma milestone importante do seu PDI",
            xpGained: 100,
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            metadata: {
              pdiTitle: "Desenvolvimento Frontend Avançado",
            },
            isPublic: false,
          },
          {
            id: "4",
            type: "team_contribution",
            title: "Contribuição para Equipe",
            description: "Ajudou um colega com review de código",
            xpGained: 25,
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            metadata: {
              teamName: "Equipe Frontend",
            },
            isPublic: true,
          },
          {
            id: "5",
            type: "key_result",
            title: "Key Result Alcançado",
            description: "Atingiu 100% de um key result importante",
            xpGained: 150,
            timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
            isPublic: false,
          },
        ];

        setTimeline(mockTimeline);
        setTotalCount(mockTimeline.length);
        setHasMore(false); // No pagination for mock data
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar timeline"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTimeline();
  }, [userId, limit]);

  const loadMore = async () => {
    if (!hasMore || loading) return;

    try {
      // TODO: Implement pagination
      console.log("Loading more timeline entries...");
    } catch (err) {
      setError("Erro ao carregar mais atividades");
    }
  };

  const filterByType = (types: TimelineEntry["type"][]) => {
    return timeline.filter((entry) => types.includes(entry.type));
  };

  const getPublicTimeline = () => {
    return timeline.filter((entry) => entry.isPublic);
  };

  return {
    timeline,
    loading,
    error,
    hasMore,
    totalCount,
    loadMore,
    filterByType,
    getPublicTimeline,
    refetch: () => {
      setLoading(true);
    },
  };
}
