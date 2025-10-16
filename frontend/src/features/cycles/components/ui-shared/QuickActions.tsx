import { MessageSquare, Users, Award, Calendar, Plus } from "lucide-react";

interface QuickActionsProps {
  onAction: (
    action: "oneOnOne" | "mentoring" | "certification" | "milestone"
  ) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    {
      id: "oneOnOne" as const,
      label: "Registrar 1:1",
      icon: MessageSquare,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      description: "Documentar conversa e insights",
    },
    {
      id: "mentoring" as const,
      label: "Registrar Mentoria",
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      description: "Log de sessão de mentoria",
    },
    {
      id: "certification" as const,
      label: "Adicionar Competência",
      icon: Award,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-200",
      description: "Habilidade ou conhecimento adquirido",
    },
    {
      id: "milestone" as const,
      label: "Marco Atingido",
      icon: Calendar,
      color: "from-brand-500 to-brand-600",
      bgColor: "bg-brand-50",
      textColor: "text-brand-700",
      borderColor: "border-brand-200",
      description: "Conquista ou objetivo alcançado",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-surface-300 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center shadow-sm">
          <Plus className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Ações Rápidas</h3>
      </div>

      {/* Layout em coluna única */}
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className={`w-full flex items-center gap-4 p-4 ${action.bgColor} ${action.textColor} border ${action.borderColor} rounded-xl transition-all duration-200 text-left group hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1">{action.label}</div>
                <div className="text-sm opacity-80">{action.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
