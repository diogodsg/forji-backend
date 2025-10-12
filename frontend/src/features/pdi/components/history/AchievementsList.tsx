import {
  FiAward,
  FiTrendingUp,
  FiTarget,
  FiCalendar,
  FiStar,
} from "react-icons/fi";

interface AchievementsListProps {
  userId?: number;
  filters: {
    year: string;
    competency: string;
    status: string;
  };
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  type: "certification" | "milestone" | "goal" | "recognition" | "skill";
  date: string;
  competency?: string;
  impact: "high" | "medium" | "low";
  evidence?: string;
  points?: number;
}

export function AchievementsList({
  userId: _userId,
  filters: _filters,
}: AchievementsListProps) {
  // TODO: Implementar hook para buscar dados do backend
  const achievements: Achievement[] = [
    {
      id: 1,
      title: "AWS Solutions Architect - Associate",
      description:
        "Certificação oficial AWS para arquitetura de soluções em nuvem",
      type: "certification",
      date: "2024-06-15",
      competency: "Cloud Computing",
      impact: "high",
      evidence: "Certificado #AWS-SA-2024-123456",
      points: 100,
    },
    {
      id: 2,
      title: "Liderança de Projeto Crítico",
      description:
        "Liderou com sucesso a migração do sistema legado, entregue no prazo e orçamento",
      type: "milestone",
      date: "2024-05-20",
      competency: "Liderança",
      impact: "high",
      evidence: "Projeto Migration-2024",
      points: 80,
    },
    {
      id: 3,
      title: "Meta: Redução de 30% no Tempo de Deploy",
      description:
        "Implementou CI/CD pipeline que reduziu tempo de deploy de 2h para 20min",
      type: "goal",
      date: "2024-04-10",
      competency: "DevOps",
      impact: "medium",
      evidence: "Métricas de performance",
      points: 60,
    },
    {
      id: 4,
      title: "Reconhecimento: Mentor do Trimestre",
      description:
        "Eleito pelos pares como o mentor mais impactante do Q1 2024",
      type: "recognition",
      date: "2024-03-31",
      competency: "Mentoria",
      impact: "medium",
      evidence: "Votação da equipe",
      points: 50,
    },
    {
      id: 5,
      title: "Especialização em React 19",
      description:
        "Domínio das novas funcionalidades do React 19 e implementação no projeto",
      type: "skill",
      date: "2024-02-14",
      competency: "Frontend",
      impact: "medium",
      evidence: "Código implementado",
      points: 40,
    },
  ];

  const getTypeIcon = (type: Achievement["type"]) => {
    switch (type) {
      case "certification":
        return FiAward;
      case "milestone":
        return FiTarget;
      case "goal":
        return FiTrendingUp;
      case "recognition":
        return FiStar;
      case "skill":
        return FiCalendar;
      default:
        return FiAward;
    }
  };

  const getTypeColor = (type: Achievement["type"]) => {
    switch (type) {
      case "certification":
        return "bg-purple-500 text-white";
      case "milestone":
        return "bg-blue-500 text-white";
      case "goal":
        return "bg-green-500 text-white";
      case "recognition":
        return "bg-orange-500 text-white";
      case "skill":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getTypeLabel = (type: Achievement["type"]) => {
    switch (type) {
      case "certification":
        return "Certificação";
      case "milestone":
        return "Marco";
      case "goal":
        return "Meta";
      case "recognition":
        return "Reconhecimento";
      case "skill":
        return "Habilidade";
      default:
        return "Conquista";
    }
  };

  const getImpactColor = (impact: Achievement["impact"]) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getImpactLabel = (impact: Achievement["impact"]) => {
    switch (impact) {
      case "high":
        return "Alto Impacto";
      case "medium":
        return "Médio Impacto";
      case "low":
        return "Baixo Impacto";
      default:
        return "Impacto";
    }
  };

  const totalPoints = achievements.reduce(
    (sum, achievement) => sum + (achievement.points || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Conquistas e Reconhecimentos
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {totalPoints}
              </div>
              <div className="text-sm text-gray-500">pontos totais</div>
            </div>
          </div>
        </div>

        {/* Estatísticas por tipo */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["certification", "milestone", "goal", "recognition", "skill"].map(
            (type) => {
              const count = achievements.filter((a) => a.type === type).length;
              const TypeIcon = getTypeIcon(type as Achievement["type"]);
              const typeColor = getTypeColor(type as Achievement["type"]);
              const label = getTypeLabel(type as Achievement["type"]);

              return (
                <div key={type} className="text-center">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${typeColor} mb-2`}
                  >
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {count}
                  </div>
                  <div className="text-sm text-gray-500">{label}</div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Lista de conquistas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          {achievements.map((achievement) => {
            const TypeIcon = getTypeIcon(achievement.type);
            const typeColor = getTypeColor(achievement.type);
            const typeLabel = getTypeLabel(achievement.type);
            const impactColor = getImpactColor(achievement.impact);
            const impactLabel = getImpactLabel(achievement.impact);

            return (
              <div
                key={achievement.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  {/* Ícone */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${typeColor} flex-shrink-0`}
                  >
                    <TypeIcon className="w-6 h-6" />
                  </div>

                  {/* Conteúdo principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {achievement.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                        {achievement.points && (
                          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            +{achievement.points} pts
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadados */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center space-x-1">
                        <FiCalendar className="w-3 h-3" />
                        <span>
                          {new Date(achievement.date).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </span>

                      {achievement.competency && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {achievement.competency}
                        </span>
                      )}
                    </div>

                    {/* Tags e evidências */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${typeColor}`}
                        >
                          {typeLabel}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${impactColor}`}
                        >
                          {impactLabel}
                        </span>
                      </div>

                      {achievement.evidence && (
                        <span className="text-xs text-gray-500">
                          📎 {achievement.evidence}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estado vazio */}
        {achievements.length === 0 && (
          <div className="text-center py-12">
            <FiAward className="mx-auto w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma conquista encontrada
            </h3>
            <p className="text-gray-500">
              Complete ciclos e metas para ganhar suas primeiras conquistas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
