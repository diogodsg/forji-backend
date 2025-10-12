import { useNavigate } from "react-router-dom";
import { FiTarget, FiUsers, FiTrendingUp, FiSettings, FiBookOpen } from "react-icons/fi";
import type { AuthUser } from "@/features/auth";

interface QuickActionsProps {
  user: AuthUser;
}

/**
 * Componente com links rápidos para funcionalidades principais
 * Adapta as ações disponíveis baseado no perfil do usuário
 */
export function QuickActions({ user }: QuickActionsProps) {
  const navigate = useNavigate();

  // Ações comuns a todos os usuários
  const commonActions = [
    {
      id: "pdi",
      title: "Editar PDI",
      description: "Atualize seu plano de desenvolvimento",
      icon: <FiTarget className="w-5 h-5" />,
      color: "emerald",
      onClick: () => navigate("/me/pdi"),
    },
    {
      id: "leaderboard",
      title: "Rankings",
      description: "Veja o desempenho das equipes",
      icon: <FiTrendingUp className="w-5 h-5" />,
      color: "blue",
      onClick: () => navigate("/leaderboard"),
    },
    {
      id: "guide",
      title: "Guia Gamificação",
      description: "Aprenda sobre XP e badges",
      icon: <FiBookOpen className="w-5 h-5" />,
      color: "purple",
      onClick: () => navigate("/gamification/guide"),
    },
    {
      id: "settings",
      title: "Configurações",
      description: "Gerencie seu perfil e preferências",
      icon: <FiSettings className="w-5 h-5" />,
      color: "gray",
      onClick: () => navigate("/settings"),
    },
  ];

  // Ações específicas para gestores
  const managerActions = [
    {
      id: "manager-dashboard",
      title: "Dashboard Manager",
      description: "Gerencie sua equipe e acompanhe PDIs",
      icon: <FiUsers className="w-5 h-5" />,
      color: "orange",
      onClick: () => navigate("/manager"),
    },
  ];

  // Combinar ações baseado no perfil
  const allActions = user.isManager ? [...managerActions, ...commonActions] : commonActions;

  // Cores para os gradientes
  const colorClasses = {
    emerald: "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    gray: "from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
  };

  const backgroundClasses = {
    emerald: "bg-emerald-50 border-emerald-200/50",
    blue: "bg-blue-50 border-blue-200/50",
    purple: "bg-purple-50 border-purple-200/50",
    orange: "bg-orange-50 border-orange-200/50",
    gray: "bg-gray-50 border-gray-200/50",
  };

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-surface-100">
        <h3 className="text-xl font-semibold text-surface-900">
          Ações Rápidas
        </h3>
        <p className="text-sm text-surface-600 mt-1">
          Acesse rapidamente as funcionalidades principais
        </p>
      </div>

      {/* Grid de ações */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6">
          {allActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`group relative p-6 rounded-lg border transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                backgroundClasses[action.color as keyof typeof backgroundClasses]
              }`}
            >
              {/* Ícone */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                    colorClasses[action.color as keyof typeof colorClasses]
                  } flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all duration-200`}
                >
                  {action.icon}
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-surface-900 group-hover:text-surface-800 text-base">
                    {action.title}
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <p className="text-sm text-surface-600 group-hover:text-surface-700 text-left leading-relaxed">
                {action.description}
              </p>

              {/* Efeito hover */}
              <div className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/10 transition-colors duration-200"></div>
            </button>
          ))}
        </div>

        {/* Informação adicional para gestores */}
        {user.isManager && (
          <div className="mt-6 p-4 bg-gradient-to-r from-brand-50 to-brand-100/50 rounded-lg border border-brand-200/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <FiUsers className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <div className="font-medium text-brand-900 mb-1">
                  Funcionalidades de Gestor
                </div>
                <p className="text-sm text-brand-700">
                  Como gestor, você tem acesso ao dashboard de equipe para acompanhar 
                  o desenvolvimento dos seus subordinados e métricas de performance.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}