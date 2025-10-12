import React, { useState, useEffect } from "react";
import { FaTimes, FaBolt, FaSpinner, FaCheck } from "react-icons/fa";
import { api } from "@/lib/apiClient";

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ManualAction {
  action: string;
  name: string;
  description: string;
  baseXP: number;
  cooldownHours: number;
}

const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [actions, setActions] = useState<ManualAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<ManualAction | null>(
    null
  );
  const [evidence, setEvidence] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchActions();
    }
  }, [isOpen]);

  const fetchActions = async () => {
    try {
      setLoading(true);
      const data = await api<ManualAction[]>("/gamification/actions/types", {
        auth: true,
      });
      setActions(data.slice(0, 5)); // Mostrar apenas as 5 principais
    } catch (error) {
      console.error("Erro ao buscar ações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAction || !evidence.trim()) return;

    try {
      setSubmitting(selectedAction.action);

      await api("/gamification/actions/submit", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          action: selectedAction.action,
          evidence: evidence.trim(),
        }),
      });

      // Success feedback
      setSelectedAction(null);
      setEvidence("");
      onSuccess?.();

      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Erro ao submeter ação:", error);
    } finally {
      setSubmitting(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaBolt className="text-yellow-500" />
              Ações Rápidas
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : selectedAction ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">
                  {selectedAction.name}
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  {selectedAction.description}
                </p>
                <div className="text-sm text-blue-600 mt-2">
                  +{selectedAction.baseXP} XP
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidência da ação realizada
                </label>
                <textarea
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="Descreva brevemente o que você fez..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedAction(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !evidence.trim() || submitting === selectedAction.action
                  }
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {submitting === selectedAction.action ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4" />
                      Submeter
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {actions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => setSelectedAction(action)}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-900">
                        {action.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {action.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-medium">
                        +{action.baseXP} XP
                      </div>
                      {action.cooldownHours > 0 && (
                        <div className="text-xs text-gray-500">
                          Cooldown: {action.cooldownHours}h
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {actions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma ação disponível no momento
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsModal;
