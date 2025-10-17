import { useMemo } from "react";
import type { AdminUser } from "@/features/admin/types";

interface ActionableInsightsProps {
  users: AdminUser[];
  loading: boolean;
  onQuickOnboard: (users: AdminUser[]) => void;
  onCreateUser: () => void;
}

interface Insight {
  id: string;
  type: "warning" | "info" | "success";
  title: string;
  description: string;
  count: number;
  users?: AdminUser[];
  actions: Array<{
    label: string;
    variant: "primary" | "secondary";
    onClick: () => void;
  }>;
}

export function ActionableInsights({
  users,
  loading,
  onQuickOnboard,
  onCreateUser,
}: ActionableInsightsProps) {
  const insights = useMemo(() => {
    if (loading || !users.length) return [];

    const result: Insight[] = [];

    // Pessoas sem equipe (assumindo que vamos adicionar teamId no futuro)
    const usersWithoutTeam = users.filter(
      (user) => !user.managers?.length && !user.reports?.length
    );

    if (usersWithoutTeam.length > 0) {
      result.push({
        id: "without-team",
        type: "warning",
        title: `${usersWithoutTeam.length} pessoa${
          usersWithoutTeam.length > 1 ? "s" : ""
        } sem equipe`,
        description: `${usersWithoutTeam
          .map((u) => u.name)
          .slice(0, 3)
          .join(", ")}${
          usersWithoutTeam.length > 3
            ? ` e mais ${usersWithoutTeam.length - 3}`
            : ""
        } precisam ser organizadas`,
        count: usersWithoutTeam.length,
        users: usersWithoutTeam,
        actions: [
          {
            label: "🚀 Onboarding Guiado",
            variant: "primary",
            onClick: () => onQuickOnboard(usersWithoutTeam),
          },
          {
            label: "⚡ Ação Rápida",
            variant: "secondary",
            onClick: () => console.log("Quick assign"),
          },
        ],
      });
    }

    // Verificar estrutura de administradores
    const adminUsers = users.filter((user) => user.isAdmin);

    if (adminUsers.length === 1 && users.length > 5) {
      result.push({
        id: "need-more-admins",
        type: "info",
        title: "Apenas 1 administrador",
        description: `Com ${users.length} usuários, considere promover mais administradores`,
        count: 1,
        actions: [
          {
            label: "👔 Promover Admin",
            variant: "secondary",
            onClick: () => console.log("Promote admin"),
          },
        ],
      });
    }

    // Tudo organizado!
    if (result.length === 0 && users.length > 0) {
      result.push({
        id: "all-good",
        type: "success",
        title: "Estrutura organizacional em dia! 🎉",
        description: `${users.length} usuários organizados e estruturados`,
        count: users.length,
        actions: [
          {
            label: "+ Novo Colaborador",
            variant: "primary",
            onClick: onCreateUser,
          },
        ],
      });
    }

    return result;
  }, [users, loading, onQuickOnboard, onCreateUser]);

  if (loading) {
    return (
      <div className="rounded-xl border border-surface-300 bg-white shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-brand-600 rounded-full"></div>
          <span className="text-sm text-gray-500">
            Analisando estrutura organizacional...
          </span>
        </div>
      </div>
    );
  }

  if (!insights.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
        <h2 className="text-base font-medium text-gray-900">
          Ações Necessárias
        </h2>
      </div>

      {insights.map((insight) => (
        <div
          key={insight.id}
          className={`rounded-lg border p-4 ${
            insight.type === "warning"
              ? "border-amber-200 bg-amber-50"
              : insight.type === "info"
              ? "border-indigo-200 bg-indigo-50"
              : "border-emerald-200 bg-emerald-50"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                insight.type === "warning"
                  ? "bg-amber-500"
                  : insight.type === "info"
                  ? "bg-indigo-500"
                  : "bg-emerald-500"
              }`}
            />

            <div className="flex-1 min-w-0">
              <h3
                className={`font-medium text-sm ${
                  insight.type === "warning"
                    ? "text-amber-900"
                    : insight.type === "info"
                    ? "text-indigo-900"
                    : "text-emerald-900"
                }`}
              >
                {insight.title}
              </h3>
              <p
                className={`text-xs mt-1 ${
                  insight.type === "warning"
                    ? "text-amber-700"
                    : insight.type === "info"
                    ? "text-indigo-700"
                    : "text-emerald-700"
                }`}
              >
                {insight.description}
              </p>

              <div className="flex gap-2 mt-3">
                {insight.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      action.variant === "primary"
                        ? "bg-brand-600 text-white hover:bg-brand-700"
                        : insight.type === "warning"
                        ? "bg-amber-200 text-amber-800 hover:bg-amber-300"
                        : insight.type === "info"
                        ? "bg-indigo-200 text-indigo-800 hover:bg-indigo-300"
                        : "bg-emerald-200 text-emerald-800 hover:bg-emerald-300"
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
