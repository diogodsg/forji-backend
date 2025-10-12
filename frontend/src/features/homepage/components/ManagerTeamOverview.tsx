import { useNavigate } from "react-router-dom";
import { FiUsers, FiTarget, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import { useManagerDashboardComplete } from "@/features/manager";

/**
 * Componente que mostra uma visão resumida da equipe para gestores na homepage
 * Inclui métricas básicas e acesso rápido ao dashboard completo
 */
export function ManagerTeamOverview() {
  const navigate = useNavigate();
  const { data, loading, error } = useManagerDashboardComplete();

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-50 rounded-lg p-4">
                <div className="h-8 bg-surface-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-surface-200 rounded w-24"></div>
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
          <div className="text-rose-600 mb-2">Erro ao carregar dados da equipe</div>
          <div className="text-sm text-surface-600">{error}</div>
        </div>
      </div>
    );
  }

  const reports = data?.reports || [];
  const totalPdisActive = reports.filter(r => r.pdi.exists).length;
  const averageProgress = reports.length > 0 
    ? Math.round(reports.reduce((sum, r) => sum + r.pdi.progress, 0) / reports.length)
    : 0;

  // Top 3 performers baseado no progresso de PDI
  const topPerformers = [...reports]
    .filter(r => r.pdi.exists)
    .sort((a, b) => b.pdi.progress - a.pdi.progress)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-surface-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-surface-900">
                Minha Equipe
              </h3>
              <p className="text-sm text-surface-600 mt-1">
                Visão geral do desempenho e progresso
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/manager")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-700 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
          >
            Ver dashboard completo
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total de pessoas */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {reports.length}
                </div>
                <div className="text-sm text-blue-700">
                  Pessoa{reports.length !== 1 ? "s" : ""} gerenciada{reports.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          {/* PDIs ativos */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-4 border border-emerald-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FiTarget className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-900">
                  {totalPdisActive}
                </div>
                <div className="text-sm text-emerald-700">
                  PDI{totalPdisActive !== 1 ? "s" : ""} ativo{totalPdisActive !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          {/* Progresso médio */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-4 border border-amber-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-900">
                  {averageProgress}%
                </div>
                <div className="text-sm text-amber-700">
                  Progresso médio
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        {topPerformers.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
              Destaques da Semana
            </h4>
            <div className="space-y-3">
              {topPerformers.map((report, index) => (
                <div
                  key={report.userId}
                  className="flex items-center justify-between p-3 bg-surface-50 rounded-lg border border-surface-200/50 hover:bg-surface-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/manager/users/${report.userId}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {report.name.charAt(0).toUpperCase()}
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-xs">👑</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-surface-900">
                        {report.name}
                      </div>
                      <div className="text-xs text-surface-600">
                        {report.position || "Colaborador"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-brand-700">
                      {report.pdi.progress}%
                    </div>
                    <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-300"
                        style={{ width: `${report.pdi.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {reports.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiUsers className="w-8 h-8 text-surface-400" />
            </div>
            <div className="text-surface-600">
              Você ainda não gerencia nenhuma pessoa
            </div>
            <div className="text-sm text-surface-500 mt-1">
              Entre em contato com o administrador para configurar sua equipe
            </div>
          </div>
        )}
      </div>
    </div>
  );
}