import {
  Calendar,
  MessageCircle,
  Eye,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: "needs-attention" | "on-track" | "exceeding";
  pdiProgress: number;
  lastUpdate: string;
  nextReview?: string;
  issues?: string[];
  achievements?: string[];
}

interface TeamMembersGridProps {
  members: TeamMember[];
  onSchedule1on1: (memberId: string) => void;
  onSendMessage: (memberId: string) => void;
  onViewDetails: (memberId: string) => void;
  className?: string;
}

/**
 * Grid compacto dos membros da equipe com status e quick actions
 * Foco em identificar rapidamente quem precisa atenção
 */
export function TeamMembersGrid({
  members,
  onSchedule1on1,
  onSendMessage,
  onViewDetails,
  className = "",
}: TeamMembersGridProps) {
  const getStatusConfig = (status: TeamMember["status"]) => {
    switch (status) {
      case "needs-attention":
        return {
          label: "Precisa atenção",
          icon: <AlertTriangle className="w-4 h-4" />,
          bgColor: "bg-error-50",
          borderColor: "border-error-200",
          statusColor: "text-error-700",
          dotColor: "bg-error-500",
        };
      case "on-track":
        return {
          label: "No caminho certo",
          icon: <TrendingUp className="w-4 h-4" />,
          bgColor: "bg-surface-50",
          borderColor: "border-surface-300",
          statusColor: "text-surface-700",
          dotColor: "bg-warning-500",
        };
      case "exceeding":
        return {
          label: "Superando expectativas",
          icon: <CheckCircle className="w-4 h-4" />,
          bgColor: "bg-success-50",
          borderColor: "border-success-200",
          statusColor: "text-success-700",
          dotColor: "bg-success-500",
        };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getTimeSinceUpdate = (_lastUpdate: string) => {
    // Mock function - em produção calcular tempo real
    const days = Math.floor(Math.random() * 14);
    if (days === 0) return "Hoje";
    if (days === 1) return "Ontem";
    return `${days} dias atrás`;
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-300 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-surface-800">
              Minha Equipe
            </h2>
            <p className="text-surface-600 text-sm">
              Status e progresso dos membros
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-surface-800">
            {members.length}
          </div>
          <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
            MEMBROS
          </div>
        </div>
      </div>

      {/* Members Grid */}
      {members.length === 0 ? (
        <div className="text-center py-8 bg-surface-50 rounded-xl">
          <MessageCircle className="w-12 h-12 text-surface-400 mx-auto mb-3" />
          <p className="text-surface-600 text-lg font-medium mb-1">
            Nenhum membro encontrado
          </p>
          <p className="text-surface-500 text-sm">
            Adicione membros à sua equipe para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {members.map((member) => {
            const statusConfig = getStatusConfig(member.status);

            return (
              <div
                key={member.id}
                className={`
                  group ${statusConfig.bgColor} ${statusConfig.borderColor}
                  border rounded-xl p-4 transition-all duration-200
                  hover:shadow-md hover:scale-[1.01]
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar with Status Dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        getInitials(member.name)
                      )}
                    </div>
                    <div
                      className={`absolute -top-1 -right-1 w-4 h-4 ${statusConfig.dotColor} rounded-full border-2 border-white`}
                    />
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-surface-800 text-sm mb-1 truncate">
                          {member.name}
                        </h3>
                        <p className="text-surface-600 text-xs mb-1">
                          {member.role}
                        </p>
                        <div
                          className={`flex items-center gap-1 ${statusConfig.statusColor}`}
                        >
                          {statusConfig.icon}
                          <span className="text-xs font-medium">
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PDI Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-surface-600">PDI Progress</span>
                        <span className="font-medium text-surface-800">
                          {member.pdiProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-surface-200 rounded-full h-2">
                        <div
                          className="h-2 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
                          style={{ width: `${member.pdiProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Last Update */}
                    <p className="text-surface-500 text-xs mb-3">
                      Última atualização:{" "}
                      {getTimeSinceUpdate(member.lastUpdate)}
                    </p>

                    {/* Issues or Achievements */}
                    {member.status === "needs-attention" && member.issues && (
                      <div className="mb-3">
                        <p className="text-error-700 text-xs font-medium mb-1">
                          Pontos de atenção:
                        </p>
                        <ul className="text-error-600 text-xs space-y-1">
                          {member.issues.slice(0, 2).map((issue, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-error-500 rounded-full flex-shrink-0" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {member.status === "exceeding" && member.achievements && (
                      <div className="mb-3">
                        <p className="text-success-700 text-xs font-medium mb-1">
                          Conquistas recentes:
                        </p>
                        <ul className="text-success-600 text-xs space-y-1">
                          {member.achievements
                            .slice(0, 2)
                            .map((achievement, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-success-500 rounded-full flex-shrink-0" />
                                {achievement}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSchedule1on1(member.id)}
                        className="inline-flex items-center gap-1 bg-white text-surface-700 border border-surface-300 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-surface-50 transition-colors"
                        title="Agendar 1:1"
                      >
                        <Calendar className="w-3 h-3" />
                        1:1
                      </button>

                      <button
                        onClick={() => onSendMessage(member.id)}
                        className="inline-flex items-center gap-1 bg-white text-surface-700 border border-surface-300 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-surface-50 transition-colors"
                        title="Enviar mensagem"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Msg
                      </button>

                      <button
                        onClick={() => onViewDetails(member.id)}
                        className="inline-flex items-center gap-1 text-surface-600 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-white/50 transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-3 h-3" />
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {members.length > 0 && (
        <div className="mt-6 pt-4 border-t border-surface-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-error-500 rounded-full" />
                <span className="text-surface-600">
                  {members.filter((m) => m.status === "needs-attention").length}{" "}
                  precisam atenção
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success-500 rounded-full" />
                <span className="text-surface-600">
                  {members.filter((m) => m.status === "exceeding").length}{" "}
                  superando
                </span>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 text-brand-600 font-medium text-sm hover:text-brand-700 transition-colors">
              Ver todos os membros
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
