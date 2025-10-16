import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle, Target } from "lucide-react";
import type { TeamObjective } from "../types";

interface TeamObjectivesProps {
  teamId: string;
  objectives?: TeamObjective[];
  canEdit?: boolean;
}

// Componente de ícone para cada tipo de objetivo
const ObjectiveIcon = ({
  type,
  className = "w-4 h-4",
}: {
  type: TeamObjective["type"];
  className?: string;
}) => {
  const icons = {
    xp: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    badges: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    pdi: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
    collaboration: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    performance: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  };

  return icons[type] || icons.performance;
};

// Cores e estilos para cada status
const getObjectiveStyles = (
  status: TeamObjective["status"],
  progress: number
) => {
  const isNearCompletion = progress >= 80;
  const isOverdue = status === "overdue";
  const isCompleted = status === "completed";

  if (isCompleted) {
    return {
      container: "border-green-200 bg-green-50",
      icon: "text-green-600 bg-green-100 border-green-200",
      progress: "bg-green-600",
      progressBg: "bg-green-200",
      text: "text-green-800",
      badge: "bg-green-100 text-green-800",
    };
  }

  if (isOverdue) {
    return {
      container: "border-red-200 bg-red-50",
      icon: "text-red-600 bg-red-100 border-red-200",
      progress: "bg-red-600",
      progressBg: "bg-red-200",
      text: "text-red-800",
      badge: "bg-red-100 text-red-800",
    };
  }

  if (isNearCompletion) {
    return {
      container: "border-yellow-200 bg-yellow-50",
      icon: "text-yellow-600 bg-yellow-100 border-yellow-200",
      progress: "bg-yellow-600",
      progressBg: "bg-yellow-200",
      text: "text-yellow-800",
      badge: "bg-yellow-100 text-yellow-800",
    };
  }

  return {
    container: "border-blue-200 bg-blue-50",
    icon: "text-blue-600 bg-blue-100 border-blue-200",
    progress: "bg-blue-600",
    progressBg: "bg-blue-200",
    text: "text-blue-800",
    badge: "bg-blue-100 text-blue-800",
  };
};

// Calcula progresso em porcentagem
const calculateProgress = (current: number, target: number) => {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
};

// Formata prazo
const formatDeadline = (deadline: Date) => {
  const now = new Date();
  const diffInDays = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays < 0) {
    return `Atrasado ${Math.abs(diffInDays)} dias`;
  } else if (diffInDays === 0) {
    return "Hoje";
  } else if (diffInDays === 1) {
    return "Amanhã";
  } else if (diffInDays <= 7) {
    return `${diffInDays} dias`;
  } else {
    return format(deadline, "dd MMM", { locale: ptBR });
  }
};

export function TeamObjectives({
  objectives = [],
  canEdit = false,
}: TeamObjectivesProps) {
  // Filtra apenas objetivos ativos e ordena por deadline
  const activeObjectives = objectives
    .filter((obj) => obj.status === "active" || obj.status === "overdue")
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );

  if (activeObjectives.length === 0) {
    return (
      <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-surface-300/60">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </span>
            Objetivos
          </h3>
          {canEdit && (
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
              + Novo
            </button>
          )}
        </header>

        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-sm">Nenhum objetivo ativo</p>
          <p className="text-gray-500 text-xs mt-1">
            Objetivos da equipe aparecerão aqui
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5">
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
          <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-surface-300/60">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </span>
          Objetivos
        </h3>
        {canEdit && (
          <button className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
            + Novo
          </button>
        )}
      </header>

      <div className="space-y-4">
        {activeObjectives.map((objective) => {
          const progress = calculateProgress(
            objective.current,
            objective.target
          );
          const styles = getObjectiveStyles(objective.status, progress);
          const deadline = formatDeadline(new Date(objective.deadline));

          return (
            <div
              key={objective.id}
              className={`rounded-lg border p-4 transition-all duration-200 ${styles.container}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`h-8 w-8 rounded-lg border flex items-center justify-center ${styles.icon}`}
                >
                  <ObjectiveIcon type={objective.type} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4
                      className={`font-medium text-sm leading-tight ${styles.text}`}
                    >
                      {objective.title}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${styles.badge}`}
                    >
                      {deadline}
                    </span>
                  </div>

                  {objective.description && (
                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                      {objective.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={styles.text}>
                    {objective.current.toLocaleString()} /{" "}
                    {objective.target.toLocaleString()} {objective.unit}
                  </span>
                  <span className={`font-medium ${styles.text}`}>
                    {progress}%
                  </span>
                </div>

                <div
                  className={`w-full bg-gray-200 rounded-full h-2 ${styles.progressBg}`}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${styles.progress}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Por {objective.createdByName}</span>
                {objective.status === "overdue" && (
                  <span className="text-error-600 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Atrasado
                  </span>
                )}
                {progress >= 90 && objective.status === "active" && (
                  <span className="text-success-600 font-medium flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Quase lá!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {objectives.some((obj) => obj.status === "completed") && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
            Ver objetivos concluídos
          </button>
        </div>
      )}
    </section>
  );
}
