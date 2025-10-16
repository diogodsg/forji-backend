import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCircle,
  Award,
  Target,
  Users,
  User,
  TrendingUp,
} from "lucide-react";
import type { TimelineEvent } from "../types";

interface TeamTimelineProps {
  teamId: string;
  events?: TimelineEvent[];
  maxEvents?: number;
}

// Componente de ícone para cada tipo de evento
const EventIcon = ({
  type,
  className = "w-4 h-4",
}: {
  type: TimelineEvent["type"];
  className?: string;
}) => {
  const icons = {
    badge: <Award className={className} />,
    milestone: <CheckCircle className={className} />,
    objective: <Target className={className} />,
    collaboration: <Users className={className} />,
    member: <User className={className} />,
    xp: <TrendingUp className={className} />,
  };

  return icons[type] || icons.xp;
};

// Cores para cada tipo de evento
const getEventColors = (type: TimelineEvent["type"]) => {
  const colors = {
    badge: "text-warning-600 bg-warning-50 border-warning-200",
    milestone: "text-success-600 bg-success-50 border-success-200",
    objective: "text-brand-600 bg-brand-50 border-brand-200",
    collaboration: "text-brand-600 bg-brand-50 border-brand-200",
    member: "text-gray-600 bg-surface-50 border-surface-300",
    xp: "text-brand-600 bg-brand-50 border-brand-200",
  };

  return colors[type] || colors.xp;
};

// Agrupa eventos por período temporal
const groupEventsByTime = (events: TimelineEvent[]) => {
  return events.reduce((groups, event) => {
    const eventDate = new Date(event.timestamp);

    let groupKey: string;
    if (isToday(eventDate)) {
      groupKey = "Hoje";
    } else if (isYesterday(eventDate)) {
      groupKey = "Ontem";
    } else {
      groupKey = format(eventDate, "dd MMM", { locale: ptBR });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push(event);
    return groups;
  }, {} as Record<string, TimelineEvent[]>);
};

export function TeamTimeline({
  events = [],
  maxEvents = 10,
}: TeamTimelineProps) {
  // Limita e ordena eventos por data
  const sortedEvents = events
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, maxEvents);

  const groupedEvents = groupEventsByTime(sortedEvents);

  if (sortedEvents.length === 0) {
    return (
      <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-surface-300/60">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            Timeline
          </h3>
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-sm">Nenhuma atividade recente</p>
          <p className="text-gray-500 text-xs mt-1">
            As conquistas da equipe aparecerão aqui
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5">
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
          <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-surface-300/60">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          Timeline
        </h3>
      </header>

      <div className="space-y-4">
        {Object.entries(groupedEvents).map(([timeGroup, groupEvents]) => (
          <div key={timeGroup}>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {timeGroup}
            </h4>

            <div className="space-y-2 ml-6 border-l border-gray-200 pl-4">
              {groupEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 group">
                  <div
                    className={`h-8 w-8 rounded-lg border flex items-center justify-center ${getEventColors(
                      event.type
                    )}`}
                  >
                    <EventIcon type={event.type} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                    {event.userName && (
                      <div className="flex items-center gap-1 mt-1">
                        {event.userAvatar && (
                          <img
                            src={event.userAvatar}
                            alt={event.userName}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                        <span className="text-xs text-gray-500">
                          {event.userName}
                        </span>
                      </div>
                    )}
                  </div>

                  <time className="text-xs text-gray-400 flex-shrink-0">
                    {format(new Date(event.timestamp), "HH:mm")}
                  </time>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {events.length > maxEvents && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
            Ver mais atividades
          </button>
        </div>
      )}
    </section>
  );
}
