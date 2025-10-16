import {
  Calendar,
  Clock,
  Users,
  Target,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Flag,
} from "lucide-react";

interface ExecutiveEvent {
  id: string;
  type: "deadline" | "milestone" | "meeting" | "review" | "announcement";
  priority: "high" | "medium" | "low";
  title: string;
  description?: string;
  date: string;
  time?: string;
  duration?: number; // in minutes
  teamInvolved?: string;
  status: "upcoming" | "today" | "overdue" | "completed";
  reminderSet?: boolean;
}

interface ExecutiveCalendarProps {
  events: ExecutiveEvent[];
  currentDate?: Date;
  onEventClick?: (eventId: string) => void;
  onDateChange?: (date: Date) => void;
  onViewAll?: () => void;
  className?: string;
}

/**
 * Calendário executivo com eventos importantes, deadlines e milestones
 * Para CEOs acompanharem eventos críticos da empresa
 */
export function ExecutiveCalendar({
  events,
  currentDate = new Date(),
  onEventClick,
  onDateChange,
  onViewAll,
  className = "",
}: ExecutiveCalendarProps) {
  const getEventConfig = (event: ExecutiveEvent) => {
    const typeConfigs = {
      deadline: {
        icon: Clock,
        iconColor: "text-error-600",
        bgColor: "bg-error-50",
        borderColor: "border-error-200",
        badgeColor: "bg-error-100 text-error-700",
      },
      milestone: {
        icon: Flag,
        iconColor: "text-success-600",
        bgColor: "bg-success-50",
        borderColor: "border-success-200",
        badgeColor: "bg-success-100 text-success-700",
      },
      meeting: {
        icon: Users,
        iconColor: "text-brand-600",
        bgColor: "bg-brand-50",
        borderColor: "border-brand-200",
        badgeColor: "bg-brand-100 text-brand-700",
      },
      review: {
        icon: Target,
        iconColor: "text-warning-600",
        bgColor: "bg-warning-50",
        borderColor: "border-warning-200",
        badgeColor: "bg-warning-100 text-warning-700",
      },
      announcement: {
        icon: AlertTriangle,
        iconColor: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        badgeColor: "bg-purple-100 text-purple-700",
      },
    };

    return typeConfigs[event.type];
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "overdue":
        return {
          color: "text-error-700",
          bg: "bg-error-100",
          text: "ATRASADO",
          dot: "bg-error-500",
        };
      case "today":
        return {
          color: "text-warning-700",
          bg: "bg-warning-100",
          text: "HOJE",
          dot: "bg-warning-500",
        };
      case "upcoming":
        return {
          color: "text-brand-700",
          bg: "bg-brand-100",
          text: "PRÓXIMO",
          dot: "bg-brand-500",
        };
      case "completed":
        return {
          color: "text-success-700",
          bg: "bg-success-100",
          text: "CONCLUÍDO",
          dot: "bg-success-500",
        };
      default:
        return {
          color: "text-surface-700",
          bg: "bg-surface-100",
          text: "PENDENTE",
          dot: "bg-surface-500",
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          color: "text-error-600",
          bg: "bg-error-50",
          border: "border-error-200",
          ring: "ring-error-200",
        };
      case "medium":
        return {
          color: "text-warning-600",
          bg: "bg-warning-50",
          border: "border-warning-200",
          ring: "ring-warning-200",
        };
      case "low":
        return {
          color: "text-success-600",
          bg: "bg-success-50",
          border: "border-success-200",
          ring: "ring-success-200",
        };
      default:
        return {
          color: "text-surface-600",
          bg: "bg-surface-50",
          border: "border-surface-200",
          ring: "ring-surface-200",
        };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "deadline":
        return "PRAZO";
      case "milestone":
        return "MARCO";
      case "meeting":
        return "REUNIÃO";
      case "review":
        return "REVISÃO";
      case "announcement":
        return "ANÚNCIO";
      default:
        return "EVENTO";
    }
  };

  // Filtrar eventos das próximas semanas
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === today.toDateString();
  });

  const thisWeekEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= today && eventDate <= nextWeek;
  });

  const overdueEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate < today && event.status !== "completed";
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Amanhã";
    if (diffDays === -1) return "Ontem";
    if (diffDays > 1 && diffDays <= 7) return `Em ${diffDays} dias`;
    if (diffDays < -1 && diffDays >= -7)
      return `${Math.abs(diffDays)} dias atrás`;

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-300 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-surface-800">
              Calendário Executivo
            </h2>
            <p className="text-surface-600 text-sm">
              Eventos importantes, deadlines e milestones da empresa
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          {overdueEvents.length > 0 && (
            <div className="text-center">
              <div className="text-lg font-bold text-error-600">
                {overdueEvents.length}
              </div>
              <div className="text-xs text-surface-500">Atrasados</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-lg font-bold text-warning-600">
              {todayEvents.length}
            </div>
            <div className="text-xs text-surface-500">Hoje</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-brand-600">
              {thisWeekEvents.length}
            </div>
            <div className="text-xs text-surface-500">Esta semana</div>
          </div>
        </div>
      </div>

      {/* Mini Calendar Navigation */}
      <div className="flex items-center justify-between mb-6 p-4 bg-surface-50 rounded-xl">
        <button
          onClick={() => {
            const prevMonth = new Date(currentDate);
            prevMonth.setMonth(currentDate.getMonth() - 1);
            onDateChange?.(prevMonth);
          }}
          className="p-2 hover:bg-white rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-surface-600" />
        </button>

        <div className="text-center">
          <div className="text-lg font-semibold text-surface-800">
            {currentDate.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="text-sm text-surface-600">
            {events.length} eventos no mês
          </div>
        </div>

        <button
          onClick={() => {
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(currentDate.getMonth() + 1);
            onDateChange?.(nextMonth);
          }}
          className="p-2 hover:bg-white rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-surface-600" />
        </button>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {upcomingEvents.map((event) => {
          const eventConfig = getEventConfig(event);
          const statusConfig = getStatusConfig(event.status);
          const priorityConfig = getPriorityConfig(event.priority);
          const EventIcon = eventConfig.icon;

          return (
            <div
              key={event.id}
              onClick={() => onEventClick?.(event.id)}
              className={`
                border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer
                hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
                ${eventConfig.bgColor} ${eventConfig.borderColor}
                ${
                  event.priority === "high"
                    ? `ring-2 ${priorityConfig.ring}`
                    : ""
                }
              `}
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <EventIcon className={`w-5 h-5 ${eventConfig.iconColor}`} />
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${eventConfig.badgeColor}`}
                    >
                      {getTypeLabel(event.type)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${statusConfig.dot} ${
                      event.status === "today" ? "animate-pulse" : ""
                    }`}
                  />
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${statusConfig.bg} ${statusConfig.color}`}
                  >
                    {statusConfig.text}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="space-y-2">
                <h3 className="font-semibold text-surface-800 text-sm">
                  {event.title}
                </h3>

                {event.description && (
                  <p className="text-surface-700 text-sm leading-relaxed">
                    {event.description}
                  </p>
                )}

                {/* Event Details */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-surface-500" />
                      <span className="text-surface-600">
                        {formatDate(event.date)}
                      </span>
                    </div>

                    {event.time && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-surface-500" />
                        <span className="text-surface-600">{event.time}</span>
                      </div>
                    )}
                  </div>

                  {event.teamInvolved && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-brand-500" />
                      <span className="text-surface-600">
                        {event.teamInvolved}
                      </span>
                    </div>
                  )}
                </div>

                {/* Duration & Reminder */}
                {(event.duration || event.reminderSet) && (
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-surface-200">
                    {event.duration && (
                      <span className="text-surface-600">
                        Duração: {event.duration}min
                      </span>
                    )}
                    {event.reminderSet && (
                      <span className="text-success-600 font-medium">
                        Lembrete ativo
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {events.length > 8 && (
        <div className="mt-6 pt-4 border-t border-surface-200">
          <button
            onClick={onViewAll}
            className="w-full py-3 text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Ver todos os {events.length} eventos
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-brand-600" />
          </div>
          <h3 className="text-lg font-semibold text-surface-800 mb-2">
            Nenhum evento agendado
          </h3>
          <p className="text-surface-600 text-sm">
            Eventos importantes da empresa aparecerão aqui.
          </p>
        </div>
      )}
    </div>
  );
}
