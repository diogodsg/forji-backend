import {
  Plus,
  Calendar,
  CheckSquare,
  MessageSquare,
  Users,
  Award,
  FileText,
  Settings,
  Zap,
} from "lucide-react";

interface ManagerTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "brand" | "success" | "warning" | "error";
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  badge?: number; // Para mostrar pending items
}

interface QuickManagerToolsProps {
  pendingApprovals?: number;
  teamSize?: number;
  className?: string;
}

/**
 * Grid de ferramentas one-click para managers
 * Facilita ações frequentes como criar metas, agendar 1:1s, aprovar PDIs
 */
export function QuickManagerTools({
  pendingApprovals = 0,
  teamSize = 0,
  className = "",
}: QuickManagerToolsProps) {
  const getColorConfig = (color: ManagerTool["color"]) => {
    switch (color) {
      case "brand":
        return {
          bgColor: "bg-gradient-to-br from-brand-500 to-brand-600",
          hoverBg: "hover:from-brand-600 hover:to-brand-700",
          textColor: "text-white",
        };
      case "success":
        return {
          bgColor: "bg-gradient-to-br from-success-500 to-success-600",
          hoverBg: "hover:from-success-600 hover:to-success-700",
          textColor: "text-white",
        };
      case "warning":
        return {
          bgColor: "bg-gradient-to-br from-warning-500 to-warning-600",
          hoverBg: "hover:from-warning-600 hover:to-warning-700",
          textColor: "text-white",
        };
      case "error":
        return {
          bgColor: "bg-gradient-to-br from-error-500 to-error-600",
          hoverBg: "hover:from-error-600 hover:to-error-700",
          textColor: "text-white",
        };
    }
  };

  const tools: ManagerTool[] = [
    {
      id: "create-team-goal",
      title: "Nova Meta da Equipe",
      description: "Criar objetivo coletivo para o time",
      icon: <Plus className="w-5 h-5" />,
      color: "brand",
      shortcut: "G + T",
      onClick: () => {
        console.log("Criar meta da equipe");
        // TODO: Navegar para criação de meta
      },
    },
    {
      id: "schedule-1on1s",
      title: "Agendar 1:1s",
      description: `Agendar conversas com ${teamSize} membros`,
      icon: <Calendar className="w-5 h-5" />,
      color: "brand",
      shortcut: "G + C",
      onClick: () => {
        console.log("Agendar 1:1s");
        // TODO: Abrir modal de agendamento bulk
      },
      disabled: teamSize === 0,
    },
    {
      id: "approve-pdis",
      title: "Aprovar PDIs",
      description: "Revisar e aprovar planos",
      icon: <CheckSquare className="w-5 h-5" />,
      color: "success",
      onClick: () => {
        console.log("Aprovar PDIs");
        // TODO: Navegar para lista de aprovações
      },
      badge: pendingApprovals,
    },
    {
      id: "send-team-update",
      title: "Comunicado",
      description: "Enviar update para a equipe",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "brand",
      shortcut: "G + M",
      onClick: () => {
        console.log("Enviar comunicado");
        // TODO: Abrir modal de comunicado
      },
    },
    {
      id: "manage-team",
      title: "Gerenciar Time",
      description: "Adicionar/remover membros",
      icon: <Users className="w-5 h-5" />,
      color: "warning",
      onClick: () => {
        console.log("Gerenciar time");
        // TODO: Navegar para gestão de time
      },
    },
    {
      id: "celebrate-wins",
      title: "Celebrar Conquistas",
      description: "Reconhecer achievements da equipe",
      icon: <Award className="w-5 h-5" />,
      color: "success",
      onClick: () => {
        console.log("Celebrar conquistas");
        // TODO: Abrir modal de celebração
      },
    },
    {
      id: "bulk-feedback",
      title: "Feedback em Lote",
      description: "Enviar feedback para múltiplas pessoas",
      icon: <FileText className="w-5 h-5" />,
      color: "brand",
      onClick: () => {
        console.log("Feedback em lote");
        // TODO: Abrir ferramenta de feedback bulk
      },
    },
    {
      id: "team-settings",
      title: "Configurações",
      description: "Ajustar configurações da equipe",
      icon: <Settings className="w-5 h-5" />,
      color: "warning",
      onClick: () => {
        console.log("Configurações da equipe");
        // TODO: Navegar para configurações
      },
    },
  ];

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-300 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-surface-800">
            Ferramentas Rápidas
          </h2>
          <p className="text-surface-600 text-sm">
            Ações frequentes para gestão da equipe
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => {
          const colorConfig = getColorConfig(tool.color);

          return (
            <button
              key={tool.id}
              onClick={tool.onClick}
              disabled={tool.disabled}
              className={`
                group relative p-4 rounded-xl transition-all duration-200
                ${colorConfig.bgColor} ${colorConfig.hoverBg} ${colorConfig.textColor}
                hover:scale-[1.02] hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2
              `}
            >
              {/* Badge */}
              {tool.badge && tool.badge > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  {tool.badge > 99 ? "99+" : tool.badge}
                </div>
              )}

              {/* Icon */}
              <div className="mb-3">{tool.icon}</div>

              {/* Content */}
              <div className="text-left">
                <h3 className="font-semibold text-sm mb-1 leading-tight">
                  {tool.title}
                </h3>
                <p className="text-xs opacity-90 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Shortcut */}
              {tool.shortcut && (
                <div className="absolute bottom-2 right-2 opacity-70">
                  <span className="text-xs font-mono bg-black/20 px-1.5 py-0.5 rounded text-white">
                    {tool.shortcut}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="mt-6 pt-4 border-t border-surface-200">
        <div className="flex items-center justify-between">
          <p className="text-surface-500 text-xs">
            💡 Use atalhos de teclado para ações mais rápidas
          </p>
          <button className="text-brand-600 text-xs font-medium hover:text-brand-700 transition-colors">
            Ver todos os atalhos
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-surface-800">
            {pendingApprovals}
          </div>
          <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
            PENDENTES
          </div>
        </div>

        <div>
          <div className="text-lg font-bold text-surface-800">{teamSize}</div>
          <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
            MEMBROS
          </div>
        </div>

        <div>
          <div className="text-lg font-bold text-brand-600">8</div>
          <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
            FERRAMENTAS
          </div>
        </div>
      </div>
    </div>
  );
}
