import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckSquare,
  Users,
  ArrowRight,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  type: "deadline" | "review" | "meeting" | "approval";
  title: string;
  description?: string;
  date: Date;
  urgency: "today" | "tomorrow" | "this-week" | "next-week";
  person?: string;
  action?: () => void;
}

interface PendingApproval {
  id: string;
  type: "pdi" | "goal" | "feedback" | "skill-assessment";
  title: string;
  person: string;
  submittedDate: Date;
  urgency: "urgent" | "normal" | "low";
  action: () => void;
}

interface ManagerCalendarProps {
  events: CalendarEvent[];
  pendingApprovals: PendingApproval[];
  className?: string;
}

/**
 * Próximos deadlines, aprovações pendentes e eventos do manager
 * Foco em não deixar nada passar despercebido
 */
export function ManagerCalendar({
  events,
  pendingApprovals,
  className = "",
}: ManagerCalendarProps) {
  const getEventUrgencyConfig = (urgency: CalendarEvent["urgency"]) => {
    switch (urgency) {
      case "today":
        return {
          bgColor: "bg-error-50",
          borderColor: "border-error-200",
          textColor: "text-error-700",
          label: "Hoje",
          dotColor: "bg-error-500",
        };
      case "tomorrow":
        return {
          bgColor: "bg-warning-50",
          borderColor: "border-warning-200",
          textColor: "text-warning-700",
          label: "Amanhã",
          dotColor: "bg-warning-500",
        };
      case "this-week":
        return {
          bgColor: "bg-brand-50",
          borderColor: "border-brand-200",
          textColor: "text-brand-700",
          label: "Esta semana",
          dotColor: "bg-brand-500",
        };
      case "next-week":
        return {
          bgColor: "bg-surface-50",
          borderColor: "border-surface-200",
          textColor: "text-surface-700",
          label: "Próxima semana",
          dotColor: "bg-surface-500",
        };
    }
  };

  const getApprovalUrgencyConfig = (urgency: PendingApproval["urgency"]) => {
    switch (urgency) {
      case "urgent":
        return {
          bgColor: "bg-error-50",
          borderColor: "border-error-200",
          textColor: "text-error-700",
          badge: "URGENTE",
          badgeColor: "bg-error-500 text-white",
        };
      case "normal":
        return {
          bgColor: "bg-warning-50",
          borderColor: "border-warning-200",
          textColor: "text-warning-700",
          badge: "NORMAL",
          badgeColor: "bg-warning-500 text-white",
        };
      case "low":
        return {
          bgColor: "bg-surface-50",
          borderColor: "border-surface-200",
          textColor: "text-surface-700",
          badge: "BAIXA",
          badgeColor: "bg-surface-500 text-white",
        };
    }
  };

  const getEventTypeIcon = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "deadline":
        return <Clock className="w-4 h-4" />;
      case "review":
        return <CheckSquare className="w-4 h-4" />;
      case "meeting":
        return <Users className="w-4 h-4" />;
      case "approval":
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatEventDate = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow =
      date.toDateString() ===
      new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

    if (isToday) return "Hoje";
    if (isTomorrow) return "Amanhã";

    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      weekday: "short",
    });
  };

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "hoje";
    if (diffDays === 1) return "ontem";
    return `${diffDays} dias atrás`;
  };

  // Ordenar eventos por urgência e data
  const sortedEvents = [...events].sort((a, b) => {
    const urgencyOrder = {
      today: 4,
      tomorrow: 3,
      "this-week": 2,
      "next-week": 1,
    };
    const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    return a.date.getTime() - b.date.getTime();
  });

  // Ordenar aprovações por urgência
  const sortedApprovals = [...pendingApprovals].sort((a, b) => {
    const urgencyOrder = { urgent: 3, normal: 2, low: 1 };
    return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
  });

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-300 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-surface-800">
            Agenda & Aprovações
          </h2>
          <p className="text-surface-600 text-sm">
            Próximos eventos e itens pendentes
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Upcoming Events */}
        <div>
          <h3 className="font-semibold text-surface-800 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            Esta Semana
          </h3>

          {sortedEvents.length === 0 ? (
            <div className="text-center py-4 bg-surface-50 rounded-lg">
              <Calendar className="w-8 h-8 text-surface-400 mx-auto mb-2" />
              <p className="text-surface-500 text-sm">
                Nenhum evento agendado para esta semana.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedEvents.slice(0, 4).map((event) => {
                const urgencyConfig = getEventUrgencyConfig(event.urgency);

                return (
                  <div
                    key={event.id}
                    className={`
                      ${urgencyConfig.bgColor} ${urgencyConfig.borderColor}
                      border rounded-lg p-3 transition-all duration-200
                      hover:shadow-md cursor-pointer
                    `}
                    onClick={event.action}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`${urgencyConfig.textColor} flex-shrink-0 mt-0.5`}
                      >
                        {getEventTypeIcon(event.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={`font-medium text-sm ${urgencyConfig.textColor}`}
                          >
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-1 text-xs">
                            <div
                              className={`w-2 h-2 rounded-full ${urgencyConfig.dotColor}`}
                            />
                            <span className={urgencyConfig.textColor}>
                              {urgencyConfig.label}
                            </span>
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-surface-600 text-xs mb-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-surface-500">
                            {formatEventDate(event.date)} •{" "}
                            {event.person && `com ${event.person}`}
                          </div>
                          {event.action && (
                            <ArrowRight className="w-3 h-3 text-surface-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Approvals */}
        <div>
          <h3 className="font-semibold text-surface-800 mb-4 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-warning-600" />
            Aprovações Pendentes
            {sortedApprovals.length > 0 && (
              <span className="bg-warning-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {sortedApprovals.length}
              </span>
            )}
          </h3>

          {sortedApprovals.length === 0 ? (
            <div className="text-center py-4 bg-success-50 rounded-lg border border-success-200">
              <CheckSquare className="w-8 h-8 text-success-500 mx-auto mb-2" />
              <p className="text-success-700 text-sm font-medium">
                Tudo aprovado! 🎉
              </p>
              <p className="text-success-600 text-xs">
                Não há itens pendentes de aprovação.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedApprovals.slice(0, 3).map((approval) => {
                const urgencyConfig = getApprovalUrgencyConfig(
                  approval.urgency
                );

                return (
                  <div
                    key={approval.id}
                    className={`
                      ${urgencyConfig.bgColor} ${urgencyConfig.borderColor}
                      border rounded-lg p-3 transition-all duration-200
                      hover:shadow-md cursor-pointer
                    `}
                    onClick={approval.action}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`
                            inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
                            ${urgencyConfig.badgeColor}
                          `}
                          >
                            {urgencyConfig.badge}
                          </span>
                          <span className="text-xs text-surface-500">
                            {approval.type.toUpperCase()}
                          </span>
                        </div>

                        <h4
                          className={`font-medium text-sm ${urgencyConfig.textColor} mb-1`}
                        >
                          {approval.title}
                        </h4>

                        <p className="text-surface-600 text-xs">
                          {approval.person} • Enviado{" "}
                          {getDaysAgo(approval.submittedDate)}
                        </p>
                      </div>

                      <ArrowRight className="w-4 h-4 text-surface-400 flex-shrink-0 mt-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-4 border-t border-surface-200">
        <div className="grid grid-cols-2 gap-3">
          <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-9 px-3 rounded-lg transition-all duration-200 hover:opacity-90">
            <Calendar className="w-4 h-4" />
            Ver Agenda Completa
          </button>

          <button className="inline-flex items-center justify-center gap-2 border border-surface-300 bg-white text-surface-700 font-medium text-sm h-9 px-3 rounded-lg transition-all duration-200 hover:bg-surface-50">
            <CheckSquare className="w-4 h-4" />
            Revisar Pendências
          </button>
        </div>
      </div>
    </div>
  );
}
