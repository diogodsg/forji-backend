import { createPortal } from "react-dom";
import {
  X,
  MessageSquare,
  Users,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Activity } from "../../hooks/useActivitiesTimeline";

interface ActivityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onDelete?: (activityId: string) => void;
}

export function ActivityDetailsModal({
  isOpen,
  onClose,
  activity,
  onDelete,
}: ActivityDetailsModalProps) {
  if (!isOpen || !activity) return null;

  // Garantir que timestamp é um Date
  const timestamp =
    typeof activity.timestamp === "string"
      ? new Date(activity.timestamp)
      : activity.timestamp;

  const typeConfig = {
    oneOnOne: {
      icon: MessageSquare,
      label: "1:1",
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      color: "text-blue-600",
      border: "border-blue-200",
    },
    mentoring: {
      icon: Users,
      label: "Mentoria",
      gradient: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      color: "text-emerald-600",
      border: "border-emerald-200",
    },
    certification: {
      icon: Award,
      label: "Certificação",
      gradient: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
      color: "text-amber-600",
      border: "border-amber-200",
    },
    milestone: {
      icon: TrendingUp,
      label: "Marco",
      gradient: "from-brand-500 to-brand-600",
      bg: "bg-brand-50",
      color: "text-brand-600",
      border: "border-brand-200",
    },
    competency: {
      icon: TrendingUp,
      label: "Competência",
      gradient: "from-violet-500 to-violet-600",
      bg: "bg-violet-50",
      color: "text-violet-600",
      border: "border-violet-200",
    },
  };

  const config = typeConfig[activity.type];
  const Icon = config.icon;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col"
        style={{ width: "900px", height: "680px" }}
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${config.gradient} px-6 py-4 flex items-center justify-between flex-shrink-0`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Detalhes da Atividade
              </h2>
              <p className="text-sm text-white/80">
                {config.label} •{" "}
                {format(timestamp, "d 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Title and Basic Info */}
            <div
              className={`rounded-lg p-4 border-2 ${config.bg} ${config.border}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {activity.title}
                  </h3>
                  {activity.person && (
                    <p className="text-sm text-gray-600">
                      com {activity.person}
                    </p>
                  )}
                </div>
                <div className="bg-amber-50 text-amber-700 px-3 py-2 rounded-lg border border-amber-200">
                  <div className="text-xs font-medium">XP ganho</div>
                  <div className="text-xl font-bold">+{activity.xpEarned}</div>
                </div>
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {format(timestamp, "d 'de' MMMM", { locale: ptBR })}
                </div>
                {activity.duration && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {activity.duration} minutos
                  </div>
                )}
                {activity.rating && (
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < activity.rating!
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description / General Notes */}
            {(activity.description || activity.generalNotes) && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  {activity.type === "oneOnOne" ? "Notas Gerais" : "Descrição"}
                </h4>
                <div className="bg-surface-50 rounded-lg p-4 border border-surface-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {activity.generalNotes || activity.description}
                  </p>
                </div>
              </div>
            )}

            {/* Working On (1:1 specific) */}
            {activity.workingOn && activity.workingOn.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  No que está trabalhando
                </h4>
                <div className="space-y-2">
                  {activity.workingOn.map((item, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                    >
                      <p className="text-sm text-blue-800">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topics (for non-1:1 activities) */}
            {activity.topics &&
              activity.topics.length > 0 &&
              activity.type !== "oneOnOne" && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Tópicos Discutidos
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activity.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="bg-surface-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm border border-surface-200"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Positive Points (1:1 specific) */}
            {activity.positivePoints && activity.positivePoints.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Pontos Positivos
                </h4>
                <div className="space-y-2">
                  {activity.positivePoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-emerald-50 rounded-lg p-3 border border-emerald-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        ✓
                      </div>
                      <p className="text-sm text-emerald-800 flex-1">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement Points (1:1 specific) */}
            {activity.improvementPoints &&
              activity.improvementPoints.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Pontos de Melhoria
                  </h4>
                  <div className="space-y-2">
                    {activity.improvementPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-amber-50 rounded-lg p-3 border border-amber-200"
                      >
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          ⚡
                        </div>
                        <p className="text-sm text-amber-800 flex-1">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Outcomes */}
            {activity.outcomes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Resultados
                </h4>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm text-emerald-800">
                    {activity.outcomes}
                  </p>
                </div>
              </div>
            )}

            {/* Progress */}
            {activity.progress && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Progresso
                </h4>
                <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-brand-600" />
                    <span className="text-gray-700">
                      De{" "}
                      <span className="font-semibold text-gray-800">
                        {activity.progress.from}%
                      </span>{" "}
                      para{" "}
                      <span className="font-semibold text-brand-600">
                        {activity.progress.to}%
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            {activity.nextSteps && activity.nextSteps.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Próximos Passos
                </h4>
                <div className="space-y-2">
                  {activity.nextSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-surface-50 rounded-lg p-3 border border-surface-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700 flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-surface-200 px-6 py-4 bg-surface-50 flex items-center justify-between flex-shrink-0">
          {/* Delete Button (if onDelete provided) */}
          {onDelete && (
            <button
              onClick={() => onDelete(activity.id)}
              className="px-4 py-2 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Atividade
            </button>
          )}

          <div className={onDelete ? "" : "w-full flex justify-end"}>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:opacity-90 transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
