import { useNavigate } from "react-router-dom";
import {
  FiTarget,
  FiArrowRight,
  FiCalendar,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";
import { useRemotePdi } from "@/features/pdi";

/**
 * Componente que mostra resumo do PDI pessoal na homepage
 * Inclui progresso das competências, milestones próximas e acesso rápido
 */
export function PersonalPDISection() {
  const navigate = useNavigate();
  const { plan, loading, error } = useRemotePdi();

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-surface-200 rounded-xl"></div>
            <div>
              <div className="h-6 bg-surface-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-48"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-surface-50 rounded-lg p-4">
                <div className="h-4 bg-surface-200 rounded w-24 mb-3"></div>
                <div className="h-2 bg-surface-200 rounded mb-2"></div>
                <div className="h-3 bg-surface-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <div className="text-center py-8">
          <div className="text-rose-600 mb-2">Erro ao carregar PDI</div>
          <div className="text-sm text-surface-600">{error}</div>
        </div>
      </div>
    );
  }

  const competencies = plan?.competencies || [];
  const milestones = plan?.milestones || [];
  const krs = plan?.krs || [];

  // Calcular progresso geral das competências (baseado em records)
  const records = plan?.records || [];
  const competencyProgress = new Map<string, number>();

  // Agrupar records por área e pegar o nível mais alto
  records.forEach((record) => {
    const currentLevel = competencyProgress.get(record.area) || 0;
    const recordLevel = record.levelAfter || record.levelBefore || 0;
    if (recordLevel > currentLevel) {
      competencyProgress.set(record.area, recordLevel);
    }
  });

  const totalCompetencyProgress =
    competencies.length > 0 && competencyProgress.size > 0
      ? Math.round(
          Array.from(competencyProgress.values()).reduce(
            (sum, level) => sum + (level / 3) * 100,
            0
          ) / competencyProgress.size
        )
      : 0;

  // Milestones próximas (próximas 3) - usando 'date' em vez de 'targetDate'
  const upcomingMilestones = milestones
    .filter((milestone) => {
      const targetDate = new Date(milestone.date);
      const now = new Date();
      return targetDate >= now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // KRs com status não "completado" (baseado no currentStatus)
  const activeKRs = krs
    .filter((kr) => {
      const status = kr.currentStatus?.toLowerCase() || "";
      return (
        !status.includes("completado") &&
        !status.includes("concluído") &&
        !status.includes("100%")
      );
    })
    .slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-surface-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FiTarget className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-surface-900">
                Meu PDI
              </h3>
              <p className="text-sm text-surface-600 mt-1">
                Progresso do desenvolvimento pessoal
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/me/pdi")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            Editar PDI
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {plan ? (
          <div className="space-y-6">
            {/* Progresso geral das competências */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-4 border border-emerald-200/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-900">
                    Progresso das Competências
                  </span>
                </div>
                <span className="text-2xl font-bold text-emerald-900">
                  {totalCompetencyProgress}%
                </span>
              </div>
              <div className="w-full h-3 bg-emerald-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${totalCompetencyProgress}%` }}
                />
              </div>
              <div className="text-sm text-emerald-700 mt-2">
                {competencies.length} competência
                {competencies.length !== 1 ? "s" : ""} em desenvolvimento
              </div>
            </div>

            {/* Grid de informações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Próximas milestones */}
              <div className="bg-surface-50 rounded-lg p-4 border border-surface-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <FiCalendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-surface-900">
                    Próximas Milestones
                  </span>
                </div>
                {upcomingMilestones.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingMilestones.map((milestone, index) => {
                      const targetDate = new Date(milestone.date);
                      const isOverdue = targetDate < new Date();
                      const daysUntil = Math.ceil(
                        (targetDate.getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      );

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-surface-900 truncate">
                              {milestone.title}
                            </div>
                            <div
                              className={`text-xs ${
                                isOverdue ? "text-rose-600" : "text-surface-600"
                              }`}
                            >
                              {isOverdue ? "Atrasada" : `Em ${daysUntil} dias`}
                            </div>
                          </div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isOverdue ? "bg-rose-400" : "bg-blue-400"
                            }`}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-surface-600">
                    Nenhuma milestone próxima
                  </div>
                )}
              </div>

              {/* Key Results ativos */}
              <div className="bg-surface-50 rounded-lg p-4 border border-surface-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <FiCheckCircle className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-surface-900">
                    Key Results Ativos
                  </span>
                </div>
                {activeKRs.length > 0 ? (
                  <div className="space-y-3">
                    {activeKRs.map((kr, index) => {
                      // Calcular progresso estimado baseado no currentStatus
                      const status = kr.currentStatus || "";
                      let estimatedProgress = 0;

                      // Tentar extrair percentual do status
                      const percentMatch = status.match(/(\d+)%/);
                      if (percentMatch) {
                        estimatedProgress = parseInt(percentMatch[1]);
                      } else if (status.toLowerCase().includes("iniciado")) {
                        estimatedProgress = 25;
                      } else if (status.toLowerCase().includes("progresso")) {
                        estimatedProgress = 50;
                      } else if (status.toLowerCase().includes("quase")) {
                        estimatedProgress = 75;
                      }

                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium text-surface-900 truncate">
                              {kr.description.substring(0, 40)}...
                            </div>
                            <div className="text-xs font-semibold text-amber-700">
                              {estimatedProgress}%
                            </div>
                          </div>
                          <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                              style={{ width: `${estimatedProgress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-surface-600">
                    Nenhum Key Result ativo
                  </div>
                )}
              </div>
            </div>

            {/* Resumo de estatísticas */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-surface-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-surface-900">
                  {competencies.length}
                </div>
                <div className="text-sm text-surface-600">Competências</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-surface-900">
                  {milestones.length}
                </div>
                <div className="text-sm text-surface-600">Milestones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-surface-900">
                  {krs.length}
                </div>
                <div className="text-sm text-surface-600">Key Results</div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTarget className="w-8 h-8 text-surface-400" />
            </div>
            <div className="text-surface-900 font-medium mb-2">
              Crie seu primeiro PDI
            </div>
            <div className="text-sm text-surface-600 mb-4">
              Defina competências, milestones e key results para sua evolução
              profissional
            </div>
            <button
              onClick={() => navigate("/me/pdi")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <FiTarget className="w-4 h-4" />
              Começar PDI
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
