import {
  MessageSquare,
  Users,
  Award,
  TrendingUp,
  Clock,
  Eye,
  Star,
  AlertCircle,
  Trash2,
  Edit,
  Calendar,
  Target,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Converte timestamp (Date | string) para Date de forma segura
 */
function safeConvertTimestamp(timestamp: Date | string): Date {
  if (typeof timestamp === "string") {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? new Date() : date;
  } else if (timestamp instanceof Date) {
    return isNaN(timestamp.getTime()) ? new Date() : timestamp;
  } else {
    console.warn("⚠️ Timestamp inválido:", timestamp);
    return new Date();
  }
}

interface Activity {
  id: string;
  type: "oneOnOne" | "mentoring" | "certification" | "milestone" | "competency";
  title: string;
  person?: string;
  topics?: string[];
  outcomes?: string;
  rating?: number;
  progress?: {
    from: number;
    to: number;
  };
  xpEarned: number;
  timestamp: Date | string; // Pode vir como Date (mock) ou string ISO (backend)
  completedAt?: Date | string; // Data de realização do 1:1
  // Campos específicos de 1:1
  workingOn?: string[];
  generalNotes?: string;
  positivePoints?: string[];
  improvementPoints?: string[];
  nextSteps?: string[];
}

interface ActivitiesTimelineProps {
  activities: Activity[];
  onViewDetails: (activityId: string) => void;
  onDeleteActivity?: (activityId: string) => void;
  onEditActivity?: (activityId: string) => void;
}

/**
 * ActivitiesTimeline - Timeline rica de atividades (Full Width)
 *
 * **Princípios:**
 * - Timeline agrupada por período (Hoje, Ontem, Esta Semana, etc)
 * - Máximo contexto em cada card (tópicos, outcomes, rating, progresso)
 * - Ações rápidas contextuais (Ver detalhes, Repetir, Agendar)
 * - Visual motivador com XP earned destacado
 * - Alerts para períodos sem atividades
 *
 * **Tipos de Atividades:**
 * - 1:1: MessageSquare icon, blue theme
 * - Mentoring: Users icon, emerald theme
 * - Certification: Award icon, amber theme
 * - Milestone: TrendingUp icon, brand theme
 * - Competency: Brain icon, violet theme
 */
export function ActivitiesTimeline({
  activities,
  onViewDetails,
  onDeleteActivity,
  onEditActivity,
}: ActivitiesTimelineProps) {
  const groupedActivities = groupActivitiesByPeriod(activities);

  // Calcular dias desde a última atividade com fallback seguro
  const daysSinceLastActivity = (() => {
    if (activities.length === 0) return 0;

    const firstActivity = activities[0];
    if (!firstActivity.timestamp) return 0;

    const timestamp = safeConvertTimestamp(firstActivity.timestamp);

    return Math.floor(
      (new Date().getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24)
    );
  })();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-300 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Timeline de Atividades
            </h2>
            <p className="text-sm text-gray-600">
              {activities.length} atividades registradas
            </p>
          </div>
        </div>
      </div>

      {/* Alert for Inactivity */}
      {daysSinceLastActivity >= 2 && activities.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-amber-800 mb-1">
                ⚠️ {daysSinceLastActivity} dias sem atividades
              </div>
              <p className="text-sm text-amber-700 mb-3">
                Registre algo agora e ganhe XP de volta!
              </p>
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-9 px-4 rounded-lg hover:opacity-90 transition-all">
                <Award className="w-4 h-4" />
                Registrar Atividade +25 XP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grouped Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedActivities).map(([period, periodActivities]) => (
          <div key={period}>
            {/* Period Header */}
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {period}
              </h3>
              <div className="flex-1 h-px bg-surface-200" />
            </div>

            {/* Activities List */}
            <div className="space-y-3">
              {periodActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onViewDetails={() => onViewDetails(activity.id)}
                  onEdit={
                    onEditActivity && activity.type === "oneOnOne"
                      ? () => onEditActivity(activity.id)
                      : undefined
                  }
                  onDelete={
                    onDeleteActivity
                      ? () => onDeleteActivity(activity.id)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Nenhuma atividade ainda
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Comece registrando suas primeiras atividades de desenvolvimento
            usando os botões da barra de ações acima!
          </p>
        </div>
      )}
    </div>
  );
}

// Activity Card Component
function ActivityCard({
  activity,
  onViewDetails,
  onEdit,
  onDelete,
}: {
  activity: Activity;
  onViewDetails: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
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

  const config = typeConfig[activity.type] || typeConfig.milestone; // Fallback para milestone se tipo não encontrado

  // Debug: log se o tipo não foi encontrado
  if (!typeConfig[activity.type]) {
    console.warn(
      "⚠️ Tipo de atividade não encontrado no typeConfig:",
      activity.type,
      "Activity ID:",
      activity.id
    );
  }

  const Icon = config.icon;

  // Formatação da data de realização do 1:1
  const completedAtFormatted = activity.completedAt
    ? format(safeConvertTimestamp(activity.completedAt), "dd/MM/yyyy", {
        locale: ptBR,
      })
    : null;

  return (
    <div className="group bg-gradient-to-br from-white to-surface-50 rounded-xl p-5 border border-surface-200 hover:border-brand-300 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className={`inline-block ${config.bg} ${config.color} px-2 py-0.5 rounded-lg text-xs font-medium border ${config.border}`}
                >
                  {config.label}
                </span>
                {/* Data de realização para 1:1 */}
                {activity.type === "oneOnOne" && completedAtFormatted && (
                  <div className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-50 to-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-blue-200">
                    <Calendar className="w-3 h-3" />
                    <span>Realizado em {completedAtFormatted}</span>
                  </div>
                )}
                {activity.rating && (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < activity.rating!
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">
                {activity.title}
              </h3>
              {activity.person && (
                <p className="text-sm text-gray-600">com {activity.person}</p>
              )}
            </div>

            {/* XP Badge */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200 flex-shrink-0 shadow-sm">
              <div className="text-xs font-medium">XP ganho</div>
              <div className="text-lg font-bold">+{activity.xpEarned}</div>
            </div>
          </div>

          {/* General Notes para 1:1 - Destaque especial */}
          {activity.type === "oneOnOne" && activity.generalNotes && (
            <div className="mb-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-blue-700 mb-1">
                    Anotações Gerais
                  </div>
                  <p className="text-sm text-blue-900 leading-relaxed line-clamp-3">
                    {activity.generalNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Topics / Working On */}
          {activity.topics &&
            activity.topics.length > 0 &&
            activity.type !== "oneOnOne" && (
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  Tópicos:
                </div>
                <div className="flex flex-wrap gap-2">
                  {activity.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="bg-surface-100 text-gray-700 px-2 py-1 rounded-lg text-xs border border-surface-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {activity.workingOn && activity.workingOn.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-500 mb-2">
                No que está trabalhando:
              </div>
              <div className="flex flex-wrap gap-2">
                {activity.workingOn.map((item, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-indigo-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Positive/Improvement Points Summary (1:1 specific) */}
          {activity.type === "oneOnOne" &&
            (activity.positivePoints?.length ||
              activity.improvementPoints?.length) && (
              <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activity.positivePoints &&
                  activity.positivePoints.length > 0 && (
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">
                            ✓
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-emerald-700">
                          Pontos Positivos
                        </div>
                      </div>
                      <div className="text-sm font-bold text-emerald-800">
                        {activity.positivePoints.length}{" "}
                        {activity.positivePoints.length === 1
                          ? "destaque"
                          : "destaques"}
                      </div>
                    </div>
                  )}
                {activity.improvementPoints &&
                  activity.improvementPoints.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Target className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="text-xs font-semibold text-amber-700">
                          Pontos de Melhoria
                        </div>
                      </div>
                      <div className="text-sm font-bold text-amber-800">
                        {activity.improvementPoints.length}{" "}
                        {activity.improvementPoints.length === 1
                          ? "área"
                          : "áreas"}
                      </div>
                    </div>
                  )}
              </div>
            )}

          {/* Next Steps para 1:1 */}
          {activity.type === "oneOnOne" &&
            activity.nextSteps &&
            activity.nextSteps.length > 0 && (
              <div className="mb-3 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-violet-700">
                    Próximos Passos
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {activity.nextSteps.map((step, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-violet-800"
                    >
                      <span className="text-violet-500 mt-0.5">→</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Outcomes */}
          {activity.outcomes && (
            <div className="mb-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <div className="text-xs font-medium text-emerald-700 mb-1">
                Resultados:
              </div>
              <p className="text-sm text-emerald-800">{activity.outcomes}</p>
            </div>
          )}

          {/* Progress */}
          {activity.progress && (
            <div className="mb-3 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <span className="text-gray-700">
                Progresso:{" "}
                <span className="font-semibold text-gray-800">
                  {activity.progress.from}%
                </span>{" "}
                →{" "}
                <span className="font-semibold text-brand-600">
                  {activity.progress.to}%
                </span>
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-surface-200">
            <button
              onClick={onViewDetails}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-brand-600 font-medium transition-colors"
            >
              <Eye className="w-3 h-3" />
              Detalhes
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-brand-600 font-medium transition-colors"
              >
                <Edit className="w-3 h-3" />
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Excluir
              </button>
            )}
            <div className="flex-1" />
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(safeConvertTimestamp(activity.timestamp), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to group activities by period
function groupActivitiesByPeriod(
  activities: Activity[]
): Record<string, Activity[]> {
  const grouped: Record<string, Activity[]> = {};
  const now = new Date();

  activities.forEach((activity) => {
    // Usar função helper para conversão segura
    const activityDate = safeConvertTimestamp(activity.timestamp);

    const diffDays = Math.floor(
      (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let period: string;
    if (diffDays === 0) {
      period = "HOJE";
    } else if (diffDays === 1) {
      period = "ONTEM";
    } else if (diffDays <= 7) {
      period = "ESTA SEMANA";
    } else if (diffDays <= 30) {
      period = "ESTE MÊS";
    } else {
      period = "MAIS ANTIGO";
    }

    if (!grouped[period]) {
      grouped[period] = [];
    }
    grouped[period].push(activity);
  });

  return grouped;
}
