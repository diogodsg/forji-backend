import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiDownload,
  FiShare,
  FiCalendar,
  FiUser,
  FiTrendingUp,
} from "react-icons/fi";
import { PdiTimeline } from "../features/pdi/components/PdiTimeline";

export function PdiTimelinePage() {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"detailed" | "summary">("detailed");

  // Empty data - replace with real API calls when backend is ready
  const {
    cycles,
    stats,
    loading,
    error,
  }: {
    cycles: Array<{ achievements?: any[]; feedback?: any[] }>;
    stats: any;
    loading: boolean;
    error: any;
  } = {
    cycles: [],
    stats: {
      totalCycles: 0,
      completedCycles: 0,
      totalKRs: 0,
      totalKRsAchieved: 0,
      averageCompletionRate: 0,
      totalBadgesEarned: 0,
      currentStreak: 0,
      competenciesImproved: [],
    },
    loading: false,
    error: null,
  };

  const userName = userId ? "Fulano da Silva" : "Minha";

  const handleExport = () => {
    // TODO: Implement PDF export
    console.log("Exporting timeline...");
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log("Sharing timeline...");
  };

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-surface-100 rounded-lg transition-all duration-200"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {userName} Timeline PDI
                  </h1>
                  <p className="text-sm text-gray-600">
                    Histórico completo de desenvolvimento profissional
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-surface-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("detailed")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === "detailed"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Detalhado
                </button>
                <button
                  onClick={() => setViewMode("summary")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === "summary"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Resumo
                </button>
              </div>

              {/* Actions */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-surface-100 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <FiShare className="w-4 h-4" />
                Compartilhar
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm"
              >
                <FiDownload className="w-4 h-4" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Progress */}
            <div className="rounded-2xl border border-surface-300 bg-white shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <FiTrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(stats.averageCompletionRate)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Taxa Média de Conclusão
                  </div>
                </div>
              </div>
            </div>

            {/* Cycles Overview */}
            <div className="rounded-2xl border border-surface-300 bg-white shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FiCalendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.completedCycles}/{stats.totalCycles}
                  </div>
                  <div className="text-sm text-gray-600">Ciclos Concluídos</div>
                </div>
              </div>
            </div>

            {/* Competencies */}
            <div className="rounded-2xl border border-surface-300 bg-white shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.competenciesImproved.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Competências Desenvolvidas
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Rate */}
            <div className="rounded-2xl border border-surface-300 bg-white shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <FiTrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalKRs > 0
                      ? Math.round(
                          (stats.totalKRsAchieved / stats.totalKRs) * 100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-gray-600">KRs Atingidas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Component */}
        <PdiTimeline
          cycles={cycles as any}
          loading={loading}
          error={error || undefined}
          showStats={false} // Already showing stats above
          allowFiltering={true}
          className="max-w-4xl mx-auto"
        />

        {/* Summary View */}
        {viewMode === "summary" && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-surface-300 bg-white shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Resumo de Desenvolvimento
              </h2>

              {/* Key Achievements */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Principais Conquistas
                </h3>
                <div className="space-y-3">
                  {(cycles as any[])
                    .filter(
                      (c: any) => c.achievements && c.achievements.length > 0
                    )
                    .flatMap((c: any) => c.achievements?.slice(0, 2) || [])
                    .map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-surface-100 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{achievement}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Competency Evolution */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Evolução de Competências
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.competenciesImproved.map(
                    (competency: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 border border-surface-300 rounded-lg"
                      >
                        <h4 className="font-medium text-gray-900 mb-2">
                          {competency}
                        </h4>
                        <div className="w-full h-2 bg-surface-200 rounded-full">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 rounded-full"
                            style={{ width: `${75 + index * 5}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Recent Feedback */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Feedback Recente
                </h3>
                <div className="space-y-4">
                  {(cycles as any[])
                    .filter((c: any) => c.feedback && c.feedback.length > 0)
                    .flatMap((c: any) => c.feedback?.slice(0, 1) || [])
                    .map((feedback) => (
                      <div
                        key={feedback.id}
                        className="p-4 border border-surface-300 rounded-lg bg-surface-50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {feedback.author}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({feedback.type})
                          </span>
                          {feedback.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 rounded-full ${
                                    i < feedback.rating!
                                      ? "bg-yellow-400"
                                      : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm">
                          {feedback.content}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
