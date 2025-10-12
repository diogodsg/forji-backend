import React, { useState } from "react";
import { FiStar, FiMessageCircle, FiTrendingUp, FiCheck } from "react-icons/fi";
import { api } from "@/lib/apiClient";

interface GamificationFeedbackPanelProps {
  targetUserId: number;
  targetUserName: string;
  onClose?: () => void;
}

export function GamificationFeedbackPanel({
  targetUserId,
  targetUserName,
  onClose,
}: GamificationFeedbackPanelProps) {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [evidence, setEvidence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const feedbackActions = [
    {
      id: "peer_feedback",
      name: "Feedback Positivo",
      description: "Reconhecer boa performance ou comportamento",
      icon: FiStar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      id: "mentoring_session",
      name: "Sessão de Mentoria",
      description: "Registrar mentoria ou orientação fornecida",
      icon: FiMessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "knowledge_sharing",
      name: "Compartilhamento de Conhecimento",
      description: "Compartilhar conhecimento ou ensinar algo",
      icon: FiTrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction || !evidence.trim()) return;

    setIsSubmitting(true);
    try {
      await api("/gamification/actions/submit", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          action: selectedAction,
          evidence: evidence.trim(),
          targetUserId,
          context: `Ação realizada para ${targetUserName}`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedAction("");
        setEvidence("");
        if (onClose) onClose();
      }, 2000);
    } catch (error) {
      console.error("Erro ao submeter ação:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-green-800">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <FiCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-semibold">Ação registrada com sucesso!</div>
            <div className="text-sm text-green-600">
              XP será atribuído após revisão
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Registrar Ação para {targetUserName}
        </h3>
        <p className="text-sm text-gray-600">
          Registre ações de desenvolvimento que você realizou para esta pessoa
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Ação
          </label>
          <div className="space-y-2">
            {feedbackActions.map((action) => {
              const Icon = action.icon;
              const isSelected = selectedAction === action.id;

              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setSelectedAction(action.id)}
                  className={`w-full p-3 border rounded-lg text-left transition-all ${
                    isSelected
                      ? `${action.bgColor} ${action.borderColor} border-2`
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? action.bgColor : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isSelected ? action.color : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {action.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evidência/Descrição
          </label>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Descreva o que foi realizado, resultados obtidos, ou qualquer contexto relevante..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!selectedAction || !evidence.trim() || isSubmitting}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Registrando..." : "Registrar Ação"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
