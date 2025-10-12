import React, { useState, useEffect } from "react";
import {
  FaBolt,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle,
  FaClock,
} from "react-icons/fa";
import { api } from "@/lib/apiClient";

interface ManualAction {
  action: string;
  name: string;
  description: string;
  baseXP: number;
  cooldownHours: number;
  category: string;
  eligibleFor: string[];
}

interface ActionSubmission {
  action: string;
  evidence: string;
  submittedAt: Date;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedAt?: Date;
  reviewerComments?: string;
  xpAwarded?: number;
}

interface CooldownInfo {
  action: string;
  availableAt: Date;
  remainingHours: number;
}

const ManualActionsPanel: React.FC = () => {
  const [availableActions, setAvailableActions] = useState<ManualAction[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<
    ActionSubmission[]
  >([]);
  const [cooldowns, setCooldowns] = useState<CooldownInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<ManualAction | null>(
    null
  );
  const [evidence, setEvidence] = useState("");
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  useEffect(() => {
    fetchManualActionsData();
  }, []);

  const fetchManualActionsData = async () => {
    try {
      setLoading(true);

      const [actionsData, submissionsData, cooldownsData] = await Promise.all([
        api<ManualAction[]>("/gamification/actions/types", { auth: true }),
        api<ActionSubmission[]>(
          "/gamification/actions/my-submissions?limit=5",
          { auth: true }
        ),
        api<CooldownInfo[]>("/gamification/actions/my-cooldowns", {
          auth: true,
        }),
      ]);

      setAvailableActions(actionsData);
      setRecentSubmissions(submissionsData);
      setCooldowns(cooldownsData);
    } catch (error) {
      console.error("Erro ao carregar ações manuais:", error);
    } finally {
      setLoading(false);
    }
  };

  const isActionOnCooldown = (actionKey: string) => {
    return cooldowns.find(
      (cd) => cd.action === actionKey && cd.remainingHours > 0
    );
  };

  const handleSubmitAction = async () => {
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

      await fetchManualActionsData(); // Refresh data
      setShowSubmissionModal(false);
      setSelectedAction(null);
      setEvidence("");
    } catch (error) {
      console.error("Erro ao submeter ação:", error);
      alert("Erro ao submeter ação");
    } finally {
      setSubmitting(null);
    }
  };

  const openSubmissionModal = (action: ManualAction) => {
    setSelectedAction(action);
    setEvidence("");
    setShowSubmissionModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <FaCheck className="w-4 h-4 text-green-500" />;
      case "REJECTED":
        return <FaExclamationTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <FaClock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-700 bg-green-50 border-green-200";
      case "REJECTED":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6">
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaBolt className="w-5 h-5 text-yellow-500" />
            Ações Manuais
          </h3>
          <p className="text-sm text-gray-600">
            Documente suas contribuições para ganhar XP
          </p>
        </div>
      </div>

      {/* Available Actions */}
      <div className="bg-white rounded-lg border p-6">
        <h4 className="font-medium text-gray-900 mb-4">Ações Disponíveis</h4>

        {availableActions.length === 0 ? (
          <div className="text-center py-8">
            <FaInfoCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhuma ação disponível no momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableActions.map((action) => {
              const cooldown = isActionOnCooldown(action.action);
              const isDisabled = !!cooldown;

              return (
                <div
                  key={action.action}
                  className={`border rounded-lg p-4 transition-all ${
                    isDisabled
                      ? "border-gray-200 bg-gray-50"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer"
                  }`}
                  onClick={() => !isDisabled && openSubmissionModal(action)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        {action.name}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {action.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        +{action.baseXP} XP
                      </div>
                      <div className="text-xs text-gray-500">
                        {action.cooldownHours}h cooldown
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {action.category}
                    </div>

                    {cooldown && (
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <FaClock className="w-3 h-3" />
                        {cooldown.remainingHours}h restantes
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Submissions */}
      {recentSubmissions.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-medium text-gray-900 mb-4">
            Submissões Recentes
          </h4>

          <div className="space-y-3">
            {recentSubmissions.map((submission, index) => {
              const action = availableActions.find(
                (a) => a.action === submission.action
              );

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getStatusColor(
                    submission.status
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(submission.status)}
                        <h5 className="font-medium text-gray-900">
                          {action?.name || submission.action}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {submission.evidence}
                      </p>
                      <div className="text-xs text-gray-500">
                        Submetido em{" "}
                        {new Date(submission.submittedAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                      {submission.reviewerComments && (
                        <div className="text-xs text-gray-600 mt-1">
                          <strong>Comentário:</strong>{" "}
                          {submission.reviewerComments}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {submission.xpAwarded && (
                        <div className="text-sm font-medium text-green-600">
                          +{submission.xpAwarded} XP
                        </div>
                      )}
                      <div className="text-xs text-gray-500 capitalize">
                        {submission.status === "PENDING"
                          ? "Pendente"
                          : submission.status === "APPROVED"
                          ? "Aprovado"
                          : "Rejeitado"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {showSubmissionModal && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submeter: {selectedAction.name}
            </h3>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">XP Base:</span>
                <span className="font-bold text-blue-600">
                  +{selectedAction.baseXP}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {selectedAction.description}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidência/Descrição
              </label>
              <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Descreva o que você fez ou forneça evidências..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
                disabled={!!submitting}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={!!submitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitAction}
                disabled={!evidence.trim() || !!submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Submetendo...
                  </>
                ) : (
                  "Submeter"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualActionsPanel;
