import {
  FiTarget,
  FiTrendingUp,
  FiCalendar,
  FiCheckCircle,
  FiAward,
  FiZap,
} from "react-icons/fi";
import type { ProfileStats } from "../types/profile";

interface PDITabProps {
  stats: ProfileStats;
  loading?: boolean;
}

export function PDITab({ stats, loading = false }: PDITabProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-surface-200 animate-pulse"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 bg-surface-200 rounded-lg" />
                <div className="h-4 bg-surface-200 rounded w-24" />
                <div className="h-6 bg-surface-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* PDI Overview Stats */}
      <section>
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2 tracking-tight">
          <FiTarget className="w-5 h-5 text-brand-600" />
          Resumo do PDI
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiTarget className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  PDIs Concluídos
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.completedPDIs}
                </p>
                <p className="text-xs text-blue-600">Total histórico</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-800">
                  PDIs Ativos
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {stats.activePDIs}
                </p>
                <p className="text-xs text-orange-600">Em andamento</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Taxa de Conclusão
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {stats.completionRate}%
                </p>
                <p className="text-xs text-green-600">Eficiência geral</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Overview */}
      <section>
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2 tracking-tight">
          <FiTrendingUp className="w-5 h-5 text-brand-600" />
          Progresso Atual
        </h3>

        <div className="bg-white rounded-xl p-6 border border-surface-200">
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-surface-700">
                Progresso Geral do PDI
              </span>
              <span className="text-sm font-bold text-brand-600">
                {stats.completionRate}%
              </span>
            </div>

            <div className="w-full h-3 bg-surface-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-700 ease-out"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-surface-100">
              <div className="text-center">
                <div className="text-lg font-bold text-surface-900">
                  {stats.completedPDIs}
                </div>
                <div className="text-xs text-surface-600">Concluídos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {stats.activePDIs}
                </div>
                <div className="text-xs text-surface-600">Em Andamento</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {stats.completionRate}%
                </div>
                <div className="text-xs text-surface-600">Taxa de Sucesso</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-brand-600">
                  {Math.round(
                    (stats.completedPDIs /
                      (stats.completedPDIs + stats.activePDIs)) *
                      100
                  ) || 0}
                  %
                </div>
                <div className="text-xs text-surface-600">Eficiência</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Achievements */}
      <section>
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2 tracking-tight">
          <FiAward className="w-5 h-5 text-warning-600" />
          Conquistas Recentes em PDI
        </h3>

        <div className="space-y-3">
          {/* Mock recent PDI achievements */}
          <div className="bg-white rounded-xl p-4 border border-surface-200 hover:shadow-soft transition-shadow duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-surface-900">
                  Milestone de Liderança Concluída
                </h4>
                <p className="text-sm text-surface-600 mt-1">
                  Finalizou com sucesso uma milestone importante do ciclo atual
                  de desenvolvimento.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-surface-500">3 dias atrás</span>
                  <span className="text-xs text-surface-400">•</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    +100 XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-surface-200 hover:shadow-soft transition-shadow duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiTarget className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-surface-900">
                  Key Result Alcançado
                </h4>
                <p className="text-sm text-surface-600 mt-1">
                  Atingiu 100% de um key result relacionado a competências
                  técnicas.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-surface-500">
                    1 semana atrás
                  </span>
                  <span className="text-xs text-surface-400">•</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    +150 XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2 tracking-tight">
          <FiZap className="w-5 h-5 text-brand-600" />
          Ações Rápidas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl p-4 hover:from-brand-600 hover:to-brand-700 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <FiTarget className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-medium">Ver PDI Completo</div>
                <div className="text-sm text-brand-100">
                  Acessar detalhes e editar
                </div>
              </div>
            </div>
          </button>

          <button className="bg-white border border-surface-300 text-surface-700 rounded-xl p-4 hover:bg-surface-50 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <FiCalendar className="w-6 h-6 text-surface-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-medium">Histórico de Ciclos</div>
                <div className="text-sm text-surface-500">
                  Ver PDIs anteriores
                </div>
              </div>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
