import React, { useState } from "react";
import { FiPlus, FiBookOpen, FiUsers, FiTrendingUp } from "react-icons/fi";
import { api } from "@/lib/apiClient";

interface PdiGamificationIntegrationProps {
  cycleId?: string;
  competencies: string[];
}

export function PdiGamificationIntegration({
  cycleId,
  competencies,
}: PdiGamificationIntegrationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedCompetency, setSelectedCompetency] = useState("");
  const [evidence, setEvidence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pdiActions = [
    {
      id: "competency_practice",
      name: "Prática de Competência",
      description: "Aplicou competência em tarefa ou projeto real",
      icon: FiTrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "knowledge_acquisition",
      name: "Estudo/Aprendizado",
      description: "Estudou material relacionado às competências",
      icon: FiBookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "peer_collaboration",
      name: "Colaboração em PDI",
      description: "Colaborou com colegas no desenvolvimento",
      icon: FiUsers,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
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
          competency: selectedCompetency,
          cycleId,
          context: "PDI - Desenvolvimento de competências",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Reset form
      setSelectedAction("");
      setSelectedCompetency("");
      setEvidence("");
      setIsOpen(false);

      // Show success feedback
      // TODO: Add toast notification
    } catch (error) {
      console.error("Erro ao registrar ação no PDI:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-indigo-900">
                Registrar Progresso
              </div>
              <div className="text-sm text-indigo-700">
                Registre ações de desenvolvimento para ganhar XP
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Registrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Registrar Ação no PDI
        </h3>
        <p className="text-sm text-gray-600">
          Registre atividades relacionadas ao seu desenvolvimento profissional
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Ação
          </label>
          <div className="space-y-2">
            {pdiActions.map((action) => {
              const Icon = action.icon;
              const isSelected = selectedAction === action.id;

              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setSelectedAction(action.id)}
                  className={`w-full p-3 border rounded-lg text-left transition-all ${
                    isSelected
                      ? `${action.bgColor} border-2 border-current`
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

        {competencies.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competência Relacionada (opcional)
            </label>
            <select
              value={selectedCompetency}
              onChange={(e) => setSelectedCompetency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione uma competência...</option>
              {competencies.map((comp, index) => (
                <option key={index} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evidência/Descrição
          </label>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Descreva o que foi realizado, aprendizado obtido, ou resultados alcançados..."
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
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
