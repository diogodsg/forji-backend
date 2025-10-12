// MOVED from src/components/structure/views.tsx
import React from "react";
import {
  FiTarget,
  FiPercent,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiCircle,
} from "react-icons/fi";
import type { PdiKeyResult, PdiPlan } from "../..";

// Tipos de critérios para cálculo de progresso
type CriteriaType = "percentage" | "increase" | "decrease" | "text" | "date";

// Função para detectar tipo baseado no conteúdo
const detectCriteriaType = (criteria: string): CriteriaType => {
  if (!criteria) return "text";
  if (criteria.includes("|")) return "increase";
  if (criteria.match(/^\d{4}-\d{2}-\d{2}$/)) return "date";
  if (criteria.match(/^\d+$/) && parseInt(criteria) <= 100) return "percentage";
  return "text";
};

// Função para calcular progresso baseado no tipo
const calculateProgress = (
  criteriaType: CriteriaType,
  success: string,
  status: string
): number => {
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
};

// Componente para mostrar barra de progresso mais bonita e inteligente
const ProgressBar: React.FC<{
  progress: number;
  criteriaType: CriteriaType;
  success: string;
  status: string;
}> = ({ progress, criteriaType, status }) => {
  const getProgressColor = () => {
    switch (criteriaType) {
      case "percentage":
        if (progress >= 90) return "bg-emerald-500";
        if (progress >= 70) return "bg-blue-500";
        if (progress >= 40) return "bg-amber-500";
        return "bg-red-500";

      case "increase":
        if (progress >= 100) return "bg-emerald-500";
        if (progress >= 75) return "bg-green-500";
        if (progress >= 50) return "bg-blue-500";
        if (progress >= 25) return "bg-amber-500";
        return "bg-red-500";

      case "decrease":
        if (progress >= 100) return "bg-emerald-500";
        if (progress >= 75) return "bg-orange-500";
        if (progress >= 50) return "bg-amber-500";
        return "bg-red-500";

      case "date":
        if (status === "concluido") return "bg-emerald-500";
        if (status === "no-prazo") return "bg-blue-500";
        if (status === "em-andamento") return "bg-amber-500";
        return "bg-red-500";

      default:
        return "bg-slate-400";
    }
  };

  const getStatusIcon = () => {
    if (criteriaType === "date") {
      switch (status) {
        case "concluido":
          return <FiCheckCircle className="w-4 h-4 text-emerald-600" />;
        case "no-prazo":
          return <FiCircle className="w-4 h-4 text-blue-600" />;
        case "em-andamento":
          return <FiClock className="w-4 h-4 text-amber-600" />;
        case "atrasado":
          return <FiAlertTriangle className="w-4 h-4 text-red-600" />;
        default:
          return <FiClock className="w-4 h-4 text-slate-500" />;
      }
    }

    if (progress >= 90)
      return <FiTarget className="w-4 h-4 text-emerald-600" />;
    if (progress >= 70)
      return <FiTrendingUp className="w-4 h-4 text-blue-600" />;
    if (progress >= 40) return <FiClock className="w-4 h-4 text-amber-600" />;
    return <FiCircle className="w-4 h-4 text-red-600" />;
  };

  if (criteriaType === "text") return null;

  return (
    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-slate-700">Progresso</span>
        </div>
        <span className="text-sm font-bold text-slate-900">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};

export const CompetenciesView: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((c) => (
      <span
        key={c}
        className="px-3 py-1 rounded-full text-xs bg-surface-100 border border-surface-300 text-indigo-700"
      >
        {c}
      </span>
    ))}
    {items.length === 0 && (
      <span className="text-xs text-gray-500">Nenhuma competência ainda.</span>
    )}
  </div>
);

// Componente para preview compact dos KRs
export const KeyResultsPreview: React.FC<{ krs: PdiKeyResult[] }> = ({
  krs,
}) => {
  if (!krs || krs.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        Nenhum Key Result definido ainda
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Estatísticas gerais */}
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          <span>
            {krs.length} objetivo{krs.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>
            {
              krs.filter((kr) => {
                const criteriaType = detectCriteriaType(
                  kr.successCriteria || ""
                );
                const progress = calculateProgress(
                  criteriaType,
                  kr.successCriteria || "",
                  kr.currentStatus || ""
                );
                return progress >= 100;
              }).length
            }{" "}
            concluído
            {krs.filter((kr) => {
              const criteriaType = detectCriteriaType(kr.successCriteria || "");
              const progress = calculateProgress(
                criteriaType,
                kr.successCriteria || "",
                kr.currentStatus || ""
              );
              return progress >= 100;
            }).length !== 1
              ? "s"
              : ""}
          </span>
        </div>
      </div>

      {/* Preview dos KRs */}
      <div className="space-y-2">
        {krs.slice(0, 3).map((kr, index) => {
          const criteriaType = detectCriteriaType(kr.successCriteria || "");
          const progress = calculateProgress(
            criteriaType,
            kr.successCriteria || "",
            kr.currentStatus || ""
          );

          return (
            <div
              key={kr.id}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {kr.description || "Objetivo sem descrição"}
                </p>
                {criteriaType !== "text" && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          progress >= 80
                            ? "bg-green-500"
                            : progress >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {Math.round(progress)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {krs.length > 3 && (
          <div className="text-center py-2 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 font-medium">
              +{krs.length - 3} objetivo{krs.length - 3 !== 1 ? "s" : ""}{" "}
              adicional{krs.length - 3 !== 1 ? "is" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const KeyResultsView: React.FC<{
  krs: PdiKeyResult[];
  onEditKr?: (krId: string) => void;
  onCreateKr?: () => void;
}> = ({ krs, onEditKr, onCreateKr }) => (
  <div className="space-y-4 pt-4">
    {krs.length === 0 && (
      <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-200 rounded-full mb-3">
          <FiTarget className="w-6 h-6 text-slate-500" />
        </div>
        <p className="text-sm font-medium text-slate-700 mb-1">
          Nenhum Key Result definido
        </p>
        <p className="text-xs text-slate-500 mb-4">
          Crie objetivos mensuráveis para acompanhar seu progresso
        </p>
        {onCreateKr && (
          <button
            onClick={onCreateKr}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
          >
            Criar Key Result
          </button>
        )}
      </div>
    )}

    {krs.map((kr, index) => {
      const criteriaType = detectCriteriaType(kr.successCriteria || "");
      const progress = calculateProgress(
        criteriaType,
        kr.successCriteria || "",
        kr.currentStatus || ""
      );

      const getTypeColor = () => {
        switch (criteriaType) {
          case "percentage":
            return "bg-blue-100 text-blue-700 border-blue-200";
          case "increase":
            return "bg-emerald-100 text-emerald-700 border-emerald-200";
          case "decrease":
            return "bg-orange-100 text-orange-700 border-orange-200";
          case "date":
            return "bg-purple-100 text-purple-700 border-purple-200";
          default:
            return "bg-slate-100 text-slate-700 border-slate-200";
        }
      };

      const getTypeIcon = () => {
        switch (criteriaType) {
          case "percentage":
            return <FiPercent className="w-4 h-4" />;
          case "increase":
            return <FiTrendingUp className="w-4 h-4" />;
          case "decrease":
            return <FiTrendingDown className="w-4 h-4" />;
          case "date":
            return <FiCalendar className="w-4 h-4" />;
          default:
            return <FiFileText className="w-4 h-4" />;
        }
      };

      return (
        <div
          key={kr.id}
          className="relative bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-300 transition-all duration-200 cursor-pointer group"
          onClick={() => onEditKr?.(kr.id)}
        >
          {/* Badge numerado compacto */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-slate-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm group-hover:bg-indigo-600 transition-colors duration-200">
            {index + 1}
          </div>

          {/* Cabeçalho compacto */}
          <div className="mb-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900 leading-tight group-hover:text-indigo-900 transition-colors duration-200 flex-1">
                {kr.description || "Key Result sem título"}
              </h3>

              {/* Tipo badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor()} transition-colors duration-200`}
              >
                <span>{getTypeIcon()}</span>
                {criteriaType === "percentage" && "Porcentagem"}
                {criteriaType === "increase" && "Aumento"}
                {criteriaType === "decrease" && "Redução"}
                {criteriaType === "date" && "Prazo"}
                {criteriaType === "text" && "Qualitativo"}
              </span>
            </div>
          </div>

          {/* Conteúdo principal em grid compacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {/* Meta */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs font-medium text-slate-600 mb-1">Meta</p>
              <p className="text-sm text-slate-900 font-medium">
                {kr.successCriteria || "Não definida"}
              </p>
            </div>

            {/* Status */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-xs font-medium text-slate-600 mb-1">
                Status Atual
              </p>
              <p className="text-sm text-slate-900 font-medium">
                {kr.currentStatus || "Não informado"}
              </p>
            </div>
          </div>

          {/* Barra de Progresso */}
          <ProgressBar
            progress={progress}
            criteriaType={criteriaType}
            success={kr.successCriteria || ""}
            status={kr.currentStatus || ""}
          />
        </div>
      );
    })}

    {/* Botão para adicionar nova KR quando já existem algumas */}
    {krs.length > 0 && onCreateKr && (
      <div className="text-center py-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateKr();
          }}
          className="px-4 py-2 text-sm font-medium rounded-lg border-2 border-dashed border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 transition-colors duration-200"
        >
          + Adicionar Nova Key Result
        </button>
      </div>
    )}
  </div>
);

export const ResultsTable: React.FC<{ records: PdiPlan["records"] }> = ({
  records,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-xs">
      <thead className="text-gray-500 text-[10px] uppercase tracking-wide">
        <tr className="border-b border-surface-300">
          <th className="text-left py-2 pr-4 font-medium">Área</th>
          <th className="text-left py-2 pr-4 font-medium">Antes</th>
          <th className="text-left py-2 pr-4 font-medium">Depois</th>
          <th className="text-left py-2 font-medium">Evidências</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => (
          <tr
            key={r.area}
            className="border-b last:border-0 border-surface-300/70"
          >
            <td className="py-2 pr-4 text-gray-700">{r.area}</td>
            <td className="py-2 pr-4 text-gray-700">
              <span className="text-sm md:text-base font-semibold tracking-tight">
                {r.levelBefore ?? "-"}
              </span>
            </td>
            <td className="py-2 pr-4 text-gray-700">
              <span className="text-sm md:text-base font-semibold tracking-tight">
                {r.levelAfter ?? "-"}
              </span>
            </td>
            <td className="py-2 text-[11px] text-gray-500">
              {r.evidence || "-"}
            </td>
          </tr>
        ))}
        {records.length === 0 && (
          <tr>
            <td colSpan={4} className="py-4 text-center text-xs text-gray-500">
              Nenhum registro.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// Card-based view for results (unified visual language with editor)
export const ResultsCardsView: React.FC<{ records: PdiPlan["records"] }> = ({
  records,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => {
        const hasBefore = typeof r.levelBefore === "number";
        const hasAfter = typeof r.levelAfter === "number";
        const before = hasBefore ? (r.levelBefore as number) : 0;
        const after = hasAfter ? (r.levelAfter as number) : 0;
        const delta = hasBefore && hasAfter ? after - before : 0;
        const max = 5;
        const pct = hasAfter ? (after / max) * 100 : 0;
        const deltaColor =
          hasBefore && hasAfter && delta > 0
            ? "text-emerald-600"
            : hasBefore && hasAfter && delta < 0
            ? "text-amber-600"
            : "text-slate-500";
        return (
          <div
            key={r.area}
            className="relative rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/70 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-800 leading-tight">
                {r.area}
              </h4>
              <span
                className={`text-xs md:text-sm font-semibold ${deltaColor}`}
              >
                <span className="font-bold">{hasBefore ? before : "—"}</span>
                <span className="mx-1 text-slate-400">→</span>
                <span className="font-bold">{hasAfter ? after : "—"}</span>
              </span>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <span>Evolução</span>
                {hasBefore && hasAfter ? (
                  <span>
                    {delta > 0 && "+"}
                    {delta}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                {hasAfter && (
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{ width: `${pct}%` }}
                    aria-label={`Nível final ${after} de ${max}`}
                  />
                )}
              </div>
            </div>
            {r.evidence && (
              <div className="mt-2">
                <p className="text-[10px] uppercase tracking-wide font-medium text-slate-500 mb-1">
                  Evidências
                </p>
                <p className="text-xs text-slate-600 whitespace-pre-line">
                  {r.evidence}
                </p>
              </div>
            )}
            {!r.evidence && (
              <p className="text-[11px] text-slate-400 italic">
                Sem evidências.
              </p>
            )}
          </div>
        );
      })}
      {records.length === 0 && (
        <div className="text-xs text-slate-500 border border-dashed rounded-lg p-6 text-center col-span-full">
          Nenhum registro.
        </div>
      )}
    </div>
  );
};
