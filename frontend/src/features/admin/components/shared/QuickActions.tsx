import { useState } from "react";

interface QuickActionsProps {
  onCreateUser: () => void;
  onBulkActions: () => void;
  onExportData: () => void;
  totalUsers: number;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  variant: "primary" | "secondary" | "accent";
  onClick: () => void;
  badge?: string;
}

export function QuickActions({
  onCreateUser,
  onBulkActions,
  onExportData,
  totalUsers,
}: QuickActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const primaryActions: QuickAction[] = [
    {
      id: "create-user",
      label: "Novo Colaborador",
      icon: "👤",
      description: "Adicionar nova pessoa à organização",
      variant: "primary",
      onClick: onCreateUser,
    },
    {
      id: "bulk-onboard",
      label: "Onboarding em Lote",
      icon: "🚀",
      description: "Configurar múltiplos usuários rapidamente",
      variant: "secondary",
      onClick: onBulkActions,
    },
  ];

  const secondaryActions: QuickAction[] = [
    {
      id: "export-data",
      label: "Exportar Dados",
      icon: "📊",
      description: "Baixar relatório da estrutura atual",
      variant: "accent",
      onClick: onExportData,
      badge: totalUsers.toString(),
    },
    {
      id: "reset-passwords",
      label: "Reset Senhas",
      icon: "🔑",
      description: "Redefinir senhas em lote",
      variant: "secondary",
      onClick: () => console.log("Reset passwords"),
    },
    {
      id: "sync-teams",
      label: "Sincronizar Equipes",
      icon: "🔄",
      description: "Atualizar estrutura organizacional",
      variant: "secondary",
      onClick: () => console.log("Sync teams"),
    },
    {
      id: "analytics",
      label: "Ver Analytics",
      icon: "📈",
      description: "Insights sobre uso da plataforma",
      variant: "accent",
      onClick: () => console.log("Analytics"),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header mais clean */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 bg-brand-500 rounded-full"></div>
        <h2 className="text-base font-medium text-gray-900">Ações Rápidas</h2>
      </div>

      {/* Primary Actions - Compact Grid */}
      <div className="grid grid-cols-2 gap-3">
        {primaryActions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`p-3 rounded-lg border text-left transition-colors ${
              action.variant === "primary"
                ? "border-brand-200 bg-brand-50 hover:bg-brand-100"
                : "border-surface-300 bg-white hover:bg-surface-50"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{action.icon}</span>
              <h3
                className={`font-medium text-sm ${
                  action.variant === "primary"
                    ? "text-brand-900"
                    : "text-gray-900"
                }`}
              >
                {action.label}
              </h3>
            </div>
            <p
              className={`text-xs ${
                action.variant === "primary"
                  ? "text-brand-700"
                  : "text-gray-600"
              }`}
            >
              {action.description}
            </p>
          </button>
        ))}
      </div>

      {/* Secondary Actions - Expandable mais compacto */}
      <div className="border-t border-surface-200 pt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left p-2 rounded-md hover:bg-surface-50 transition-colors"
        >
          <span className="text-sm text-gray-600">
            Mais Ações ({secondaryActions.length})
          </span>
          <svg
            className={`w-3 h-3 text-gray-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isExpanded && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {secondaryActions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="p-2 rounded-md border border-surface-200 bg-white text-left hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{action.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-900 text-xs">
                        {action.label}
                      </span>
                      {action.badge && (
                        <span className="px-1 py-0.5 bg-surface-100 text-surface-600 text-xs rounded">
                          {action.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
