// Melhorado com cores neutras e tipos de critérios
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiTarget,
  FiEdit3,
  FiList,
  FiTrash2,
  FiPlus,
  FiPercent,
  FiTrendingDown,
  FiType,
  FiCalendar,
} from "react-icons/fi";
import type { PdiKeyResult } from "../..";

interface Props {
  krs: PdiKeyResult[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PdiKeyResult>) => void;
}

type CriteriaType = "percentage" | "increase" | "decrease" | "text" | "date";

interface CriteriaTypeOption {
  value: CriteriaType;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  example: string;
}

const CRITERIA_TYPES: CriteriaTypeOption[] = [
  {
    value: "percentage",
    label: "Porcentagem",
    icon: <FiPercent className="w-4 h-4" />,
    placeholder: "Ex: Aumentar conversão para 25%",
    example: "Aumentar taxa de conversão de 15% para 25%",
  },
  {
    value: "increase",
    label: "Valor a Aumentar",
    icon: <FiTarget className="w-4 h-4" />,
    placeholder: "Ex: Alcançar 1000 vendas",
    example: "Aumentar vendas mensais de 500 para 1000",
  },
  {
    value: "decrease",
    label: "Valor a Diminuir",
    icon: <FiTrendingDown className="w-4 h-4" />,
    placeholder: "Ex: Reduzir tempo de resposta para 2h",
    example: "Reduzir tempo de resposta de 8h para 2h",
  },
  {
    value: "text",
    label: "Texto/Qualitativo",
    icon: <FiType className="w-4 h-4" />,
    placeholder: "Ex: Implementar sistema completo",
    example: "Sistema de analytics implementado e funcionando",
  },
  {
    value: "date",
    label: "Data/Prazo",
    icon: <FiCalendar className="w-4 h-4" />,
    placeholder: "Ex: Concluir até 31/12/2025",
    example: "Projeto concluído até 31 de dezembro de 2025",
  },
];

// Hook para auto-resize de textarea
function useAutoResizeTextarea(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  dep: string
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, 600);
    el.style.height = next + "px";
  }, [dep]);
}

// Função para calcular progresso baseado no tipo
function calculateProgress(
  criteriaType: CriteriaType,
  success: string,
  status: string
): number {
  if (!success || !status) return 0;

  switch (criteriaType) {
    case "percentage":
      const target = parseFloat(success);
      const current = parseFloat(status);
      if (isNaN(target) || isNaN(current) || target === 0) return 0;
      return Math.min((current / target) * 100, 100);

    case "increase":
      const successParts = success.split("|");
      if (successParts.length !== 2) return 0;
      const [initialInc, targetInc] = successParts.map((v) => parseFloat(v));
      const currentInc = parseFloat(status);
      if (isNaN(initialInc) || isNaN(targetInc) || isNaN(currentInc)) return 0;
      const totalIncNeeded = targetInc - initialInc;
      const currentIncProgress = currentInc - initialInc;
      if (totalIncNeeded <= 0) return 0;
      return Math.min(
        Math.max((currentIncProgress / totalIncNeeded) * 100, 0),
        100
      );

    case "decrease":
      const decParts = success.split("|");
      if (decParts.length !== 2) return 0;
      const [initialDec, targetDec] = decParts.map((v) => parseFloat(v));
      const currentDec = parseFloat(status);
      if (isNaN(initialDec) || isNaN(targetDec) || isNaN(currentDec)) return 0;
      const totalDecNeeded = initialDec - targetDec;
      const currentDecProgress = initialDec - currentDec;
      if (totalDecNeeded <= 0) return 0;
      return Math.min(
        Math.max((currentDecProgress / totalDecNeeded) * 100, 0),
        100
      );

    case "date":
      if (status === "concluido") return 100;
      if (status === "atrasado") return 0;
      if (status === "em-andamento") return 50;
      if (status === "no-prazo") return 75;
      return 0;

    default:
      return 0;
  }
}

// Componente para mostrar barra de progresso
function ProgressBar({
  progress,
  criteriaType,
  success,
  status,
}: {
  progress: number;
  criteriaType: CriteriaType;
  success: string;
  status: string;
}) {
  const getProgressColor = () => {
    if (progress >= 80) return "bg-gradient-to-r from-green-400 to-green-600";
    if (progress >= 50) return "bg-gradient-to-r from-yellow-400 to-orange-500";
    return "bg-gradient-to-r from-red-400 to-red-600";
  };

  const getProgressText = () => {
    if (!success || !status) return "Configure os campos para ver o progresso";

    switch (criteriaType) {
      case "percentage":
        return `${status}% de ${success}%`;
      case "increase":
        const incParts = success.split("|");
        if (incParts.length !== 2) return "Configure valor inicial e meta";
        const [initialInc, targetInc] = incParts;
        return `${status} (meta: ${targetInc}, inicial: ${initialInc})`;
      case "decrease":
        const decParts = success.split("|");
        if (decParts.length !== 2) return "Configure valor inicial e meta";
        const [initialDec, targetDec] = decParts;
        return `${status} (meta: ${targetDec}, inicial: ${initialDec})`;
      case "date":
        const statusLabels = {
          "no-prazo": "No prazo",
          "em-andamento": "Em andamento",
          atrasado: "Atrasado",
          concluido: "Concluído",
        };
        const statusLabel =
          statusLabels[status as keyof typeof statusLabels] || status;
        return `${statusLabel} (prazo: ${new Date(
          success
        ).toLocaleDateString()})`;
      default:
        return "";
    }
  };

  if (criteriaType === "text") return null;

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-gray-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
      <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 border border-slate-200/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiTarget className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800">
              Progresso do Objetivo
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-slate-600 font-medium">Concluído</div>
          </div>
        </div>

        <div className="relative">
          <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-700 ease-out shadow-lg ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full border border-slate-300/50"></div>
        </div>

        <div className="mt-4 p-4 bg-white/70 rounded-xl border border-slate-200 backdrop-blur-sm">
          <div className="text-xs text-slate-700 font-semibold leading-relaxed">
            {getProgressText()}
          </div>
        </div>
      </div>
    </div>
  );
}

export const KeyResultsEditor: React.FC<Props> = ({
  krs,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  return (
    <div className="space-y-8 pt-4">
      {/* Header com botão de adicionar */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
        <div className="relative flex items-center justify-between bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-3xl p-8 border border-indigo-200/50 backdrop-blur-sm">
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <FiTarget className="w-6 h-6 text-white" />
              </div>
              Objetivos Chave & Resultados
            </h3>
            <p className="text-sm text-slate-700 font-medium max-w-2xl">
              Defina metas SMART com critérios claros de sucesso e acompanhe seu
              progresso em tempo real
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white text-sm font-bold rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 shadow-indigo-500/25"
          >
            <FiPlus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
            Novo KR
          </button>
        </div>
      </div>

      {krs.length === 0 && (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-gray-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
          <div className="relative text-center py-16 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 rounded-3xl border-2 border-dashed border-slate-300 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 rounded-3xl mb-6 shadow-xl shadow-indigo-500/25">
              <span className="text-3xl font-black text-white">KR</span>
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-4">
              Seus Key Results aparecerão aqui
            </h4>
            <p className="text-sm text-slate-700 font-medium mb-8 max-w-md mx-auto leading-relaxed">
              Comece criando seu primeiro objetivo com critérios mensuráveis de
              sucesso e transforme suas metas em realidade
            </p>
            <button
              type="button"
              onClick={onAdd}
              className="group/btn inline-flex items-center gap-3 px-8 py-4 text-sm font-bold text-indigo-600 hover:text-white bg-indigo-100 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FiPlus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
              Criar primeiro KR
            </button>
          </div>
        </div>
      )}

      {krs.map((kr, index) => (
        <KrEditor
          key={kr.id}
          kr={kr}
          index={index}
          onRemove={onRemove}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

const KrEditor: React.FC<{
  kr: PdiKeyResult;
  index?: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PdiKeyResult>) => void;
}> = ({ kr, index, onRemove, onUpdate }) => {
  const [tab, setTab] = useState<"main" | "actions">("main");

  // Detectar tipo baseado no conteúdo existente
  const detectCriteriaType = (criteria: string): CriteriaType => {
    if (!criteria) return "text";
    if (criteria.includes("|")) return "increase";
    if (criteria.match(/^\d{4}-\d{2}-\d{2}$/)) return "date";
    if (criteria.match(/^\d+$/) && parseInt(criteria) <= 100)
      return "percentage";
    return "text";
  };

  const [criteriaType, setCriteriaType] = useState<CriteriaType>(() =>
    detectCriteriaType(kr.successCriteria || "")
  );

  // Estados locais
  const [desc, setDesc] = useState(kr.description || "");
  const [success, setSuccess] = useState(kr.successCriteria || "");
  const [status, setStatus] = useState(kr.currentStatus || "");
  const [actionsDraft, setActionsDraft] = useState(
    (kr.improvementActions || []).join("\n")
  );

  // Função para mudança limpa de tipo
  const handleCriteriaTypeChange = (newType: CriteriaType) => {
    setCriteriaType(newType);

    // Limpar valores incompatíveis
    switch (newType) {
      case "percentage":
        if (isNaN(parseInt(success)) || parseInt(success) > 100) {
          setSuccess("");
        }
        if (isNaN(parseInt(status)) || parseInt(status) > 100) {
          setStatus("");
        }
        break;
      case "increase":
      case "decrease":
        if (!success.includes("|")) {
          setSuccess("|");
        }
        if (isNaN(parseInt(status))) {
          setStatus("");
        }
        break;
      case "date":
        if (!success.match(/^\d{4}-\d{2}-\d{2}$/)) {
          setSuccess("");
        }
        if (
          !["no-prazo", "atrasado", "concluido", "em-andamento"].includes(
            status
          )
        ) {
          setStatus("");
        }
        break;
      case "text":
        // Text pode manter qualquer valor
        break;
    }
  };

  const descRef = useRef<HTMLInputElement | null>(null);
  const successRef = useRef<HTMLTextAreaElement | null>(null);
  const statusRef = useRef<HTMLTextAreaElement | null>(null);
  const actionsRef = useRef<HTMLTextAreaElement | null>(null);

  useAutoResizeTextarea(successRef, success);
  useAutoResizeTextarea(statusRef, status);
  useAutoResizeTextarea(actionsRef, actionsDraft);

  // Sync externo
  useEffect(() => {
    if (kr.description !== desc) setDesc(kr.description || "");
    if (kr.successCriteria !== success) setSuccess(kr.successCriteria || "");
    if ((kr.currentStatus || "") !== status) setStatus(kr.currentStatus || "");
    const joined = (kr.improvementActions || []).join("\n");
    if (joined !== actionsDraft) setActionsDraft(joined);
  }, [
    kr.id,
    kr.description,
    kr.successCriteria,
    kr.currentStatus,
    kr.improvementActions,
  ]);

  // Debounced commits
  const debCommitDesc = useCallback(
    (v: string) => onUpdate(kr.id, { description: v }),
    [kr.id, onUpdate]
  );
  const debCommitSuccess = useCallback(
    (v: string) => onUpdate(kr.id, { successCriteria: v }),
    [kr.id, onUpdate]
  );
  const debCommitStatus = useCallback(
    (v: string) => onUpdate(kr.id, { currentStatus: v }),
    [kr.id, onUpdate]
  );
  const debCommitActions = useCallback(
    (v: string) =>
      onUpdate(kr.id, {
        improvementActions: v
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
      }),
    [kr.id, onUpdate]
  );

  const flushAll = () => {
    debCommitDesc(desc);
    debCommitSuccess(success);
    debCommitStatus(status);
    debCommitActions(actionsDraft);
  };

  const selectedCriteriaType =
    CRITERIA_TYPES.find((t) => t.value === criteriaType) || CRITERIA_TYPES[0];

  return (
    <div className="bg-white border-0 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm">
      {/* Header com gradiente mais sofisticado */}
      <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 px-8 py-6 border-b border-slate-200/50">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/25">
            {(index || 0) + 1}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FiTarget className="w-4 h-4 text-indigo-600" />
              </div>
              Descrição do Objetivo
            </label>
            <input
              ref={descRef}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onBlur={flushAll}
              className="w-full text-2xl font-bold text-slate-900 bg-transparent border-0 border-b-3 border-slate-300 focus:border-indigo-500 outline-none pb-4 transition-all duration-300 placeholder-slate-400"
              placeholder="Ex: Aumentar conversão de leads em 25%"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(kr.id)}
            className="shrink-0 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Critério de Sucesso */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 border border-indigo-200/50 rounded-2xl p-6 backdrop-blur-sm">
              <label className="block text-sm font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiTarget className="w-4 h-4 text-white" />
                </div>
                Critério de Sucesso
              </label>

              {/* Seletor de tipo */}
              <div className="mb-6">
                <select
                  value={criteriaType}
                  onChange={(e) =>
                    handleCriteriaTypeChange(e.target.value as CriteriaType)
                  }
                  className="w-full px-5 py-4 border-2 border-indigo-200 rounded-2xl text-sm bg-white/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 shadow-sm backdrop-blur-sm font-medium"
                >
                  {CRITERIA_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 mb-5 p-4 bg-white/70 rounded-xl border border-indigo-100 backdrop-blur-sm">
                <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                  {selectedCriteriaType.icon}
                </div>
                <span className="text-xs text-slate-700 font-semibold">
                  Exemplo: {selectedCriteriaType.example}
                </span>
              </div>

              {/* Campos específicos por tipo */}
              {criteriaType === "percentage" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-3">
                    Meta (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={success}
                    onChange={(e) => setSuccess(e.target.value)}
                    onBlur={flushAll}
                    className="w-full px-5 py-4 border-2 border-indigo-200 rounded-2xl text-sm text-slate-900 bg-white/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 backdrop-blur-sm font-medium"
                    placeholder="25"
                  />
                </div>
              )}

              {(criteriaType === "increase" || criteriaType === "decrease") && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-3">
                      Valor Inicial
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={success.split("|")[0] || ""}
                      onChange={(e) => {
                        const currentValue = e.target.value;
                        const targetValue = success.split("|")[1] || "";
                        setSuccess(`${currentValue}|${targetValue}`);
                      }}
                      onBlur={flushAll}
                      className="w-full px-5 py-4 border-2 border-indigo-200 rounded-2xl text-sm text-slate-900 bg-white/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 backdrop-blur-sm font-medium"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-3">
                      Meta
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={success.split("|")[1] || ""}
                      onChange={(e) => {
                        const initialValue = success.split("|")[0] || "";
                        const currentValue = e.target.value;
                        setSuccess(`${initialValue}|${currentValue}`);
                      }}
                      onBlur={flushAll}
                      className="w-full px-5 py-4 border-2 border-indigo-200 rounded-2xl text-sm text-slate-900 bg-white/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 backdrop-blur-sm font-medium"
                      placeholder="125"
                    />
                  </div>
                </div>
              )}

              {criteriaType === "date" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-3">
                    Data Limite
                  </label>
                  <input
                    type="date"
                    value={success}
                    onChange={(e) => setSuccess(e.target.value)}
                    onBlur={flushAll}
                    className="w-full px-5 py-4 border-2 border-indigo-200 rounded-2xl text-sm text-slate-900 bg-white/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 backdrop-blur-sm font-medium"
                  />
                </div>
              )}

              {criteriaType === "text" && (
                <textarea
                  ref={successRef}
                  value={success}
                  onChange={(e) => setSuccess(e.target.value)}
                  onBlur={flushAll}
                  rows={3}
                  className="w-full resize-none border-2 border-indigo-200 rounded-2xl p-5 text-sm text-slate-900 bg-white/80 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 backdrop-blur-sm font-medium"
                  placeholder={selectedCriteriaType.placeholder}
                />
              )}
            </div>
          </div>

          {/* Status Atual */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border border-emerald-200/50 rounded-2xl p-6 backdrop-blur-sm">
              <label className="block text-sm font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiEdit3 className="w-4 h-4 text-white" />
                </div>
                Status Atual
              </label>

              {/* Campos específicos por tipo para status */}
              {criteriaType === "percentage" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-3">
                    Progresso Atual (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    onBlur={flushAll}
                    className="w-full px-5 py-4 border-2 border-emerald-200 rounded-2xl text-sm text-slate-900 bg-white/80 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 backdrop-blur-sm font-medium"
                    placeholder="15"
                  />
                </div>
              )}

              {(criteriaType === "increase" || criteriaType === "decrease") && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-3">
                    Valor Atual
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    onBlur={flushAll}
                    className="w-full px-5 py-4 border-2 border-emerald-200 rounded-2xl text-sm text-slate-900 bg-white/80 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 backdrop-blur-sm font-medium"
                    placeholder="110"
                  />
                </div>
              )}

              {criteriaType === "date" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-3">
                    Status do Prazo
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    onBlur={flushAll}
                    className="w-full px-5 py-4 border-2 border-emerald-200 rounded-2xl text-sm text-slate-900 bg-white/80 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 backdrop-blur-sm font-medium"
                  >
                    <option value="">Selecione o status</option>
                    <option value="no-prazo">No prazo</option>
                    <option value="atrasado">Atrasado</option>
                    <option value="concluido">Concluído</option>
                    <option value="em-andamento">Em andamento</option>
                  </select>
                </div>
              )}

              {criteriaType === "text" && (
                <textarea
                  ref={statusRef}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onBlur={flushAll}
                  rows={3}
                  className="w-full resize-none border-2 border-emerald-200 rounded-2xl p-5 text-sm text-slate-900 bg-white/80 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 backdrop-blur-sm font-medium"
                  placeholder="Qual é a situação atual? O que já foi feito até agora?"
                />
              )}
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <ProgressBar
          progress={calculateProgress(criteriaType, success, status)}
          criteriaType={criteriaType}
          success={success}
          status={status}
        />

        {/* Próximos Passos */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 border border-purple-200/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <label className="block text-sm font-bold text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiList className="w-4 h-4 text-white" />
                </div>
                Próximos Passos
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTab("main")}
                  className={`px-5 py-3 text-xs font-bold rounded-xl transition-all duration-300 ${
                    tab === "main"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105 shadow-indigo-500/25"
                      : "bg-white/80 text-slate-700 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 backdrop-blur-sm"
                  }`}
                >
                  <FiEdit3 className="w-3 h-3 inline mr-2" /> Editar
                </button>
                <button
                  type="button"
                  onClick={() => setTab("actions")}
                  className={`px-5 py-3 text-xs font-bold rounded-xl transition-all duration-300 ${
                    tab === "actions"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105 shadow-indigo-500/25"
                      : "bg-white/80 text-slate-700 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 backdrop-blur-sm"
                  }`}
                >
                  <FiList className="w-3 h-3 inline mr-2" /> Lista
                </button>
              </div>
            </div>

            {tab === "main" ? (
              <textarea
                ref={actionsRef}
                value={actionsDraft}
                onChange={(e) => setActionsDraft(e.target.value)}
                onBlur={flushAll}
                rows={4}
                className="w-full resize-none border-2 border-purple-200 rounded-2xl p-5 text-sm text-slate-900 bg-white/80 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 backdrop-blur-sm font-medium"
                placeholder="Liste as ações específicas que precisa tomar (uma por linha)&#10;&#10;Ex:&#10;• Implementar sistema de analytics&#10;• Otimizar landing page&#10;• Criar campanha de email marketing"
              />
            ) : (
              <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 backdrop-blur-sm min-h-[120px]">
                {(kr.improvementActions || []).length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <FiList className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">
                      Nenhuma ação definida
                    </h4>
                    <p className="text-sm text-slate-600 font-medium">
                      Use a aba "Editar" para adicionar suas próximas ações
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {(kr.improvementActions || []).map((action, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 shadow-sm"
                      >
                        <span className="inline-block w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-bold flex items-center justify-center shrink-0 shadow-lg">
                          {i + 1}
                        </span>
                        <span className="text-sm text-slate-800 leading-relaxed font-semibold">
                          {action}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { KeyResultsEditor as ImprovedKeyResultsEditor };
