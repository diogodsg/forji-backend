import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaCrown,
  FaChartLine,
  FaBolt,
  FaInfoCircle,
} from "react-icons/fa";
import { api } from "@/lib/apiClient";

interface MultiplierInfo {
  userProfile: "IC" | "MANAGER";
  profileDetails: {
    isManager: boolean;
    reasons: string[];
    subordinatesCount: number;
    teamsManaged: number;
  };
  availableMultipliers: {
    type: string;
    percentage: number;
    description: string;
    eligibleActions: {
      action: string;
      name: string;
      baseXP: number;
      multipliedXP: number;
    }[];
  }[];
  recentMultipliers: {
    action: string;
    originalXP: number;
    finalXP: number;
    multiplier: number;
    date: Date;
  }[];
}

interface MultiplierStats {
  totalActionsWithMultiplier: number;
  averageMultiplier: number;
  totalBonusXP: number;
  breakdown: {
    type: "IC_LEADERSHIP" | "MANAGER_PROCESS";
    count: number;
    totalBonusXP: number;
  }[];
}

const MultiplierDashboard: React.FC = () => {
  const [multiplierInfo, setMultiplierInfo] = useState<MultiplierInfo | null>(
    null
  );
  const [stats, setStats] = useState<MultiplierStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMultiplierData();
  }, []);

  const fetchMultiplierData = async () => {
    try {
      setLoading(true);

      const [dashboardData, statsData] = await Promise.all([
        api<MultiplierInfo>("/gamification/multipliers/dashboard", {
          auth: true,
        }),
        api<MultiplierStats>("/gamification/multipliers/stats?period=week", {
          auth: true,
        }),
      ]);

      setMultiplierInfo(dashboardData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };
  const getProfileIcon = (profile: string) => {
    return profile === "MANAGER" ? (
      <FaCrown className="w-5 h-5" />
    ) : (
      <FaUser className="w-5 h-5" />
    );
  };
  const getProfileColor = (profile: "IC" | "MANAGER") => {
    return profile === "MANAGER" ? "text-yellow-600" : "text-blue-600";
  };

  const getProfileBgColor = (profile: "IC" | "MANAGER") => {
    return profile === "MANAGER" ? "bg-yellow-50" : "bg-blue-50";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <FaInfoCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!multiplierInfo || !stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header de Perfil */}
      <div
        className={`${getProfileBgColor(
          multiplierInfo.userProfile
        )} rounded-lg p-6 border`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${getProfileColor(multiplierInfo.userProfile)}`}>
              {getProfileIcon(multiplierInfo.userProfile)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {multiplierInfo.userProfile === "MANAGER"
                  ? "Manager"
                  : "Individual Contributor"}
              </h3>
              <p className="text-sm text-gray-600">
                Seu perfil determina os multiplicadores de XP disponíveis
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {stats.averageMultiplier.toFixed(1)}x
            </div>
            <div className="text-sm text-gray-600">Multiplicador médio</div>
          </div>
        </div>

        {/* Detalhes do perfil Manager */}
        {multiplierInfo.profileDetails.isManager &&
          multiplierInfo.profileDetails.reasons.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Por que você é Manager:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                {multiplierInfo.profileDetails.reasons.map((reason, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>

      {/* Estatísticas da Semana */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <FaChartLine className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {stats.totalActionsWithMultiplier}
              </div>
              <div className="text-sm text-gray-600">
                Ações com multiplicador
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <FaBolt className="w-5 h-5 text-yellow-500 mr-2" />
            <div>
              <div className="text-lg font-semibold text-gray-900">
                +{stats.totalBonusXP}
              </div>
              <div className="text-sm text-gray-600">XP bônus esta semana</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <FaCrown className="w-5 h-5 text-purple-500 mr-2" />
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {(stats.averageMultiplier - 1) * 100}%
              </div>
              <div className="text-sm text-gray-600">Bônus médio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Multiplicadores Disponíveis */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Multiplicadores Disponíveis
        </h3>

        {multiplierInfo.availableMultipliers.map((multiplier, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">
                  {multiplier.type === "IC_LEADERSHIP"
                    ? "Liderança por Influência"
                    : "Melhoria de Processo"}
                </h4>
                <p className="text-sm text-gray-600">
                  {multiplier.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">
                  +{multiplier.percentage}%
                </div>
                <div className="text-sm text-gray-500">bônus</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {multiplier.eligibleActions.map((action, actionIndex) => (
                <div
                  key={actionIndex}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {action.name}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {action.baseXP} XP → {action.multipliedXP} XP
                    </span>
                    <span className="text-green-600 font-medium">
                      +{action.multipliedXP - action.baseXP}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {multiplierInfo.availableMultipliers.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <FaUser className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600">
              Nenhum multiplicador disponível para seu perfil atual.
            </p>
          </div>
        )}
      </div>

      {/* Multiplicadores Recentes */}
      {multiplierInfo.recentMultipliers.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Multiplicadores Aplicados Recentemente
          </h3>

          <div className="space-y-3">
            {multiplierInfo.recentMultipliers.map((recent, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {recent.action}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(recent.date).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {recent.originalXP} → {recent.finalXP} XP
                  </div>
                  <div className="text-xs text-green-600">
                    {recent.multiplier.toFixed(1)}x multiplicador
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiplierDashboard;
