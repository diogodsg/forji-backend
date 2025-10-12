import { useState } from "react";
import { FiTrendingUp, FiBarChart, FiTarget, FiAward } from "react-icons/fi";

interface CompetencyEvolutionProps {
  userId?: number;
  filters: {
    year: string;
    competency: string;
    status: string;
  };
}

interface CompetencyData {
  name: string;
  category: string;
  currentLevel: number;
  previousLevel: number;
  targetLevel: number;
  progress: number;
  assessments: number;
  lastUpdate: string;
}

export function CompetencyEvolution({
  userId: _userId,
  filters: _filters,
}: CompetencyEvolutionProps) {
  const [viewMode, setViewMode] = useState<"grid" | "chart">("grid");

  // TODO: Implementar hook para buscar dados do backend
  const competencies: CompetencyData[] = [
    {
      name: "Liderança de Equipe",
      category: "Liderança",
      currentLevel: 4,
      previousLevel: 3,
      targetLevel: 5,
      progress: 80,
      assessments: 6,
      lastUpdate: "2024-09-15",
    },
    {
      name: "Arquitetura de Software",
      category: "Técnica",
      currentLevel: 5,
      previousLevel: 4,
      targetLevel: 5,
      progress: 100,
      assessments: 8,
      lastUpdate: "2024-08-20",
    },
    {
      name: "Comunicação Técnica",
      category: "Comunicação",
      currentLevel: 4,
      previousLevel: 3,
      targetLevel: 4,
      progress: 100,
      assessments: 5,
      lastUpdate: "2024-07-10",
    },
    {
      name: "Resolução de Problemas",
      category: "Analítica",
      currentLevel: 4,
      previousLevel: 4,
      targetLevel: 5,
      progress: 60,
      assessments: 7,
      lastUpdate: "2024-06-25",
    },
    {
      name: "Mentoria",
      category: "Desenvolvimento",
      currentLevel: 3,
      previousLevel: 2,
      targetLevel: 4,
      progress: 50,
      assessments: 4,
      lastUpdate: "2024-05-30",
    },
  ];

  const getLevelColor = (level: number) => {
    if (level >= 5) return "bg-green-500";
    if (level >= 4) return "bg-blue-500";
    if (level >= 3) return "bg-yellow-500";
    if (level >= 2) return "bg-orange-500";
    return "bg-gray-500";
  };

  const getLevelLabel = (level: number) => {
    const labels = [
      "Iniciante",
      "Básico",
      "Intermediário",
      "Avançado",
      "Expert",
    ];
    return labels[level - 1] || "N/A";
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous)
      return { icon: FiTrendingUp, color: "text-green-600" };
    if (current < previous)
      return { icon: FiTrendingUp, color: "text-red-600 transform rotate-180" };
    return { icon: FiTarget, color: "text-gray-600" };
  };

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Evolução de Competências
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiTarget className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                viewMode === "chart"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiBarChart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Estatísticas gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FiTrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Melhorias
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {
                competencies.filter((c) => c.currentLevel > c.previousLevel)
                  .length
              }
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FiTarget className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Metas Atingidas
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {
                competencies.filter((c) => c.currentLevel >= c.targetLevel)
                  .length
              }
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FiAward className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Nível Expert
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {competencies.filter((c) => c.currentLevel >= 5).length}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FiBarChart className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">
                Progresso Médio
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(
                competencies.reduce((acc, c) => acc + c.progress, 0) /
                  competencies.length
              )}
              %
            </div>
          </div>
        </div>
      </div>

      {/* Visualização das competências */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {viewMode === "grid" ? (
          <div className="space-y-4">
            {competencies.map((competency) => {
              const trend = getTrendIcon(
                competency.currentLevel,
                competency.previousLevel
              );
              const TrendIcon = trend.icon;

              return (
                <div
                  key={competency.name}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {competency.name}
                        </h4>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          {competency.category}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{competency.assessments} avaliações</span>
                        <span>
                          Última atualização:{" "}
                          {new Date(competency.lastUpdate).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center space-x-1 ${trend.color}`}
                    >
                      <TrendIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {competency.currentLevel > competency.previousLevel &&
                          "+"}
                        {competency.currentLevel - competency.previousLevel ||
                          "="}
                      </span>
                    </div>
                  </div>

                  {/* Níveis visuais */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Nível Atual:</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-3 h-3 rounded-full ${
                                level <= competency.currentLevel
                                  ? getLevelColor(competency.currentLevel)
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-gray-900">
                          {getLevelLabel(competency.currentLevel)} (
                          {competency.currentLevel}/5)
                        </span>
                      </div>
                    </div>

                    {/* Barra de progresso para meta */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>
                          Progresso para meta ({competency.targetLevel}/5)
                        </span>
                        <span>{competency.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${competency.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-12">
              <FiBarChart className="mx-auto w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Visualização em Gráfico
              </h3>
              <p className="text-gray-500">
                Em desenvolvimento - Em breve você terá gráficos interativos de
                evolução.
              </p>
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {competencies.length === 0 && (
          <div className="text-center py-12">
            <FiTrendingUp className="mx-auto w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma competência encontrada
            </h3>
            <p className="text-gray-500">
              Adicione competências aos seus ciclos para ver a evolução aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
