import React from "react";
import { StatsGrid } from "../components/StatsGrid";
import type { OrganizedProfileStats } from "../types/profileStats";

// Exemplo de uso do novo StatsGrid com dados organizados
const ExampleUsage: React.FC = () => {
  const organizedStats: OrganizedProfileStats = {
    gamification: {
      totalXP: 3200,
      level: 9,
      levelProgress: {
        current: 400, // XP atual no nível 9
        required: 1200, // XP necessário para level 10
        percentage: 33, // 400/1200 = 33%
      },
      badgesEarned: 12,
    },
    pdi: {
      completedPDIs: 4,
      activePDIs: 2,
      completionRate: 90,
    },
    team: {
      teamContributions: 18,
      collaborations: 10,
    },
  };

  return (
    <div className="container mx-auto px-6 py-6 max-w-7xl">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">
          Exemplo - Novo StatsGrid Organizado
        </h1>

        <div className="bg-surface-50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">
            Perfil Público (PDI oculto)
          </h2>
          <StatsGrid stats={organizedStats} isPublic={true} />
        </div>

        <div className="bg-surface-50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">
            Perfil Privado (todos os dados visíveis)
          </h2>
          <StatsGrid stats={organizedStats} isPublic={false} />
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;
