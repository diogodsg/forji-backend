import React, { useState, useEffect } from "react";
import { FaBolt, FaPlus, FaExclamationTriangle } from "react-icons/fa";
import { api } from "@/lib/apiClient";
import QuickActionsModal from "./QuickActionsModal";

interface QuickAction {
  action: string;
  name: string;
  baseXP: number;
  cooldownHours: number;
}

interface ActionSummary {
  availableActionsCount: number;
  pendingSubmissions: number;
  weeklyXP: number;
  nextActions: QuickAction[];
}

const QuickActionsWidget: React.FC = () => {
  const [summary, setSummary] = useState<ActionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchActionsSummary();
  }, []);

  const fetchActionsSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api<ActionSummary>("/gamification/actions/summary", {
        auth: true,
      });
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-5">
        <div className="flex items-center gap-2 text-red-600">
          <FaExclamationTriangle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        <header className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-3">
            <FaBolt className="w-5 h-5 text-yellow-500" />
            Ações Manuais
          </h3>
          <FaPlus className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {summary.availableActionsCount}
            </div>
            <div className="text-xs text-gray-500">Disponíveis</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {summary.pendingSubmissions}
            </div>
            <div className="text-xs text-gray-500">Pendentes</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              +{summary.weeklyXP}
            </div>
            <div className="text-xs text-gray-500">XP Semana</div>
          </div>
        </div>

        {/* Next Actions Preview */}
        {summary.nextActions.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Próximas Ações
            </div>
            {summary.nextActions.slice(0, 2).map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex-1 truncate text-gray-900">
                  {action.name}
                </span>
                <span className="text-blue-600 font-medium">
                  +{action.baseXP} XP
                </span>
              </div>
            ))}
            {summary.nextActions.length > 2 && (
              <div className="text-center pt-1">
                <span className="text-xs text-gray-500">
                  +{summary.nextActions.length - 2} mais
                </span>
              </div>
            )}
          </div>
        )}

        {summary.availableActionsCount === 0 && (
          <div className="text-center py-4">
            <div className="text-gray-400 mb-2">
              <FaBolt className="w-8 h-8 mx-auto opacity-50" />
            </div>
            <p className="text-sm text-gray-600">Nenhuma ação disponível</p>
          </div>
        )}
      </div>

      <QuickActionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchActionsSummary()}
      />
    </>
  );
};

export default QuickActionsWidget;
