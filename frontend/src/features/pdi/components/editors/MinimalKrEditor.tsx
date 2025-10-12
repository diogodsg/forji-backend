import React, { useState, useEffect, useMemo } from "react";
import type { PdiKeyResult } from "../..";
import {
  FiPercent,
  FiTarget,
  FiTrendingDown,
  FiCalendar,
  FiType,
} from "react-icons/fi";

export type MinimalKr = Pick<
  PdiKeyResult,
  "id" | "description" | "successCriteria" | "currentStatus"
>;

interface Props {
  kr: MinimalKr;
  onChange: (patch: Partial<MinimalKr>) => void;
}

// Função para calcular progresso
const calculateProgress = (
  criteriaType: CriteriaType,
  criteria: string,
  status: string
): number => {
  if (!criteria || !status) return 0;

  switch (criteriaType) {
    case "percentage":
      const target = parseFloat(criteria);
      const current = parseFloat(status);
      if (isNaN(target) || isNaN(current) || target === 0) return 0;
      return Math.min((current / target) * 100, 100);

    case "increase":
      const incParts = criteria.split("|");
      if (incParts.length !== 2) return 0;
      const [initialInc, targetInc] = incParts.map((v) => parseFloat(v));
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
      const decParts = criteria.split("|");
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
};

// Tipos de critério
type CriteriaType = "percentage" | "increase" | "decrease" | "text" | "date";

export const MinimalKrEditor: React.FC<Props> = ({ kr, onChange }) => {
  const [desc, setDesc] = useState(kr.description || "");
  const [criteria, setCriteria] = useState(kr.successCriteria || "");
  const [status, setStatus] = useState(kr.currentStatus || "");

  const detectCriteriaType = (val: string): CriteriaType => {
    if (!val) return "text";
    if (val.includes("|")) return "increase";
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return "date";
    if (/^\d+$/.test(val) && parseInt(val) <= 100) return "percentage";
    return "text";
  };

  const [criteriaType, setCriteriaType] = useState<CriteriaType>(() =>
    detectCriteriaType(kr.successCriteria || "")
  );

  useEffect(() => {
    setDesc(kr.description || "");
  }, [kr.description]);
  useEffect(() => {
    setCriteria(kr.successCriteria || "");
  }, [kr.successCriteria]);
  useEffect(() => {
    setStatus(kr.currentStatus || "");
  }, [kr.currentStatus]);
  useEffect(() => {
    setCriteriaType(detectCriteriaType(kr.successCriteria || ""));
  }, [kr.successCriteria]);

  const commit = () => {
    onChange({
      description: desc,
      successCriteria: criteria,
      currentStatus: status,
    });
  };

  // Atualizar campos incompatíveis ao mudar tipo
  const handleTypeChange = (t: CriteriaType) => {
    setCriteriaType(t);
    switch (t) {
      case "percentage":
        if (!(/^\d+$/.test(criteria) && parseInt(criteria) <= 100))
          setCriteria("");
        if (!(/^\d+$/.test(status) && parseInt(status) <= 100)) setStatus("");
        break;
      case "increase":
      case "decrease":
        if (!criteria.includes("|")) setCriteria("0|");
        break;
      case "date":
        if (!/^\d{4}-\d{2}-\d{2}$/.test(criteria)) setCriteria("");
        break;
      case "text":
        // livre
        break;
    }
  };

  const criteriaTypeOptions: {
    value: CriteriaType;
    label: string;
    icon: React.ReactNode;
    color: string;
    placeholder: string;
    hint: string;
  }[] = useMemo(
    () => [
      {
        value: "percentage",
        label: "Porcentagem",
        icon: <FiPercent className="w-4 h-4" />,
        color: "text-blue-600",
        placeholder: "Ex: 50",
        hint: "Meta em % (0-100)",
      },
      {
        value: "increase",
        label: "Aumentar",
        icon: <FiTarget className="w-4 h-4" />,
        color: "text-green-600",
        placeholder: "Ex: 100|150",
        hint: "Formato: inicial|meta",
      },
      {
        value: "decrease",
        label: "Reduzir",
        icon: <FiTrendingDown className="w-4 h-4" />,
        color: "text-orange-600",
        placeholder: "Ex: 8|2",
        hint: "Formato: inicial|meta",
      },
      {
        value: "date",
        label: "Prazo",
        icon: <FiCalendar className="w-4 h-4" />,
        color: "text-purple-600",
        placeholder: "AAAA-MM-DD",
        hint: "Prazo final",
      },
      {
        value: "text",
        label: "Texto",
        icon: <FiType className="w-4 h-4" />,
        color: "text-slate-600",
        placeholder: "Ex: Sistema implementado",
        hint: "Descrição qualitativa do sucesso",
      },
    ],
    []
  );

  const selectedMeta = criteriaTypeOptions.find(
    (o) => o.value === criteriaType
  )!;
  const progress = calculateProgress(criteriaType, criteria, status);

  // Parse dos valores para tipos numéricos
  const getInitialValue = () => {
    if (criteriaType === "percentage") return "0";
    if (criteriaType === "increase" || criteriaType === "decrease") {
      return criteria.split("|")[0] || "";
    }
    return "";
  };

  const getTargetValue = () => {
    if (criteriaType === "percentage") return criteria;
    if (criteriaType === "increase" || criteriaType === "decrease") {
      return criteria.split("|")[1] || "";
    }
    return "";
  };

  const setInitialValue = (val: string) => {
    if (criteriaType === "percentage") return; // Porcentagem sempre inicia em 0
    if (criteriaType === "increase" || criteriaType === "decrease") {
      const target = getTargetValue();
      setCriteria(`${val}|${target}`);
    }
  };

  const setTargetValue = (val: string) => {
    if (criteriaType === "percentage") {
      setCriteria(val);
    } else if (criteriaType === "increase" || criteriaType === "decrease") {
      const initial = getInitialValue();
      setCriteria(`${initial}|${val}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header compacto */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
        <div
          className={`p-1.5 rounded-lg ${selectedMeta.color
            .replace("text-", "bg-")
            .replace("-600", "-100")}`}
        >
          <div className={`w-4 h-4 ${selectedMeta.color}`}>
            {selectedMeta.icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900">Key Result</h3>
          <p className="text-xs text-slate-500">{selectedMeta.label}</p>
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-700">
          Descrição da Key Result
        </label>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={commit}
          placeholder="Ex: Aumentar taxa de conversão do produto"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {/* Seletor de tipo compacto */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-700">
          Tipo de Medição
        </label>
        <div className="grid grid-cols-5 gap-1">
          {criteriaTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTypeChange(option.value)}
              className={`px-1.5 py-1.5 rounded-md border transition-all text-center group ${
                criteriaType === option.value
                  ? `border-indigo-400 bg-indigo-50 text-indigo-700`
                  : `border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50`
              }`}
            >
              <div
                className={`mx-auto mb-0.5 text-sm ${
                  criteriaType === option.value
                    ? "text-indigo-600"
                    : "text-slate-500"
                }`}
              >
                {option.icon}
              </div>
              <span className="text-xs font-medium leading-tight">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Campos de configuração compactos */}
      <div className="space-y-3">
        {criteriaType === "percentage" && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <FiPercent className="w-3.5 h-3.5" />
              Configuração de Porcentagem
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Meta (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  onBlur={commit}
                  placeholder="80"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Progresso Atual (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onBlur={commit}
                  placeholder="45"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            {/* Barra de Progresso Simplificada */}
            {criteria && status && progress >= 0 && (
              <div className="p-3 bg-white rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-600">
                    Progresso
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0%</span>
                  <span>{criteria}%</span>
                </div>
              </div>
            )}
          </div>
        )}

        {(criteriaType === "increase" || criteriaType === "decrease") && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              {criteriaType === "increase" ? (
                <FiTarget className="w-3.5 h-3.5" />
              ) : (
                <FiTrendingDown className="w-3.5 h-3.5" />
              )}
              {criteriaType === "increase"
                ? "Configuração de Aumento"
                : "Configuração de Redução"}
            </h4>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Valor Inicial
                </label>
                <input
                  type="number"
                  value={getInitialValue()}
                  onChange={(e) => setInitialValue(e.target.value)}
                  onBlur={commit}
                  placeholder="100"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Meta
                </label>
                <input
                  type="number"
                  value={getTargetValue()}
                  onChange={(e) => setTargetValue(e.target.value)}
                  onBlur={commit}
                  placeholder={criteriaType === "increase" ? "150" : "50"}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Valor Atual
              </label>
              <input
                type="number"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                onBlur={commit}
                placeholder="125"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Barra de Progresso Simplificada */}
            {criteria && status && progress >= 0 && (
              <div className="p-3 bg-white rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-600">
                    Progresso
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ease-out ${
                      criteriaType === "increase"
                        ? "bg-emerald-500"
                        : "bg-orange-500"
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>{getInitialValue()}</span>
                  <span>{getTargetValue()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {criteriaType === "date" && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <FiCalendar className="w-3.5 h-3.5" />
              Configuração de Prazo
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Data Limite
                </label>
                <input
                  type="date"
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  onBlur={commit}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Status Atual
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onBlur={commit}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="">Selecione o status...</option>
                  <option value="no-prazo">No prazo</option>
                  <option value="em-andamento">Em andamento</option>
                  <option value="atrasado">Atrasado</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {criteriaType === "text" && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <FiType className="w-3.5 h-3.5" />
              Configuração Qualitativa
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Critério de Sucesso
                </label>
                <input
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  onBlur={commit}
                  placeholder={selectedMeta.placeholder}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {selectedMeta.hint}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Progresso Atual
                </label>
                <textarea
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onBlur={commit}
                  rows={2}
                  placeholder="Descreva detalhadamente o progresso atual..."
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
