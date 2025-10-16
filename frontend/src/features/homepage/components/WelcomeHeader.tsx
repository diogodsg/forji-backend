import { Building2, Users, Target, Sun, Moon, Clock } from "lucide-react";
import type { AuthUser } from "@/features/auth";

interface WelcomeHeaderProps {
  user: AuthUser;
}

/**
 * Header de boas-vindas que se adapta ao perfil do usuário
 * Mostra mensagens personalizadas para colaboradores vs gestores
 */
export function WelcomeHeader({ user }: WelcomeHeaderProps) {
  const now = new Date();
  const hour = now.getHours();

  // Determinar saudação baseada no horário
  const getGreeting = () => {
    if (hour < 12)
      return {
        text: "Bom dia",
        icon: <Sun className="w-5 h-5 text-yellow-500" />,
      };
    if (hour < 18)
      return {
        text: "Boa tarde",
        icon: <Sun className="w-5 h-5 text-orange-500" />,
      };
    return {
      text: "Boa noite",
      icon: <Moon className="w-5 h-5 text-blue-500" />,
    };
  };

  const greeting = getGreeting();
  const firstName = user.name.split(" ")[0];

  // Mensagens personalizadas baseadas no perfil
  const getPersonalizedMessage = () => {
    if (user.isAdmin) {
      return {
        primary: "Acompanhe a saúde e performance da empresa",
        secondary:
          "Visão executiva completa de todos os times, métricas críticas e insights estratégicos",
        icon: <Building2 className="w-5 h-5 text-brand-600" />,
      };
    }

    if (user.isManager) {
      return {
        primary: "Acompanhe o desenvolvimento da sua equipe",
        secondary:
          "Visualize métricas, progresso de PDI e conquistas dos seus subordinados",
        icon: <Users className="w-5 h-5 text-brand-600" />,
      };
    }

    return {
      primary: "Continue sua jornada de desenvolvimento",
      secondary: "Acompanhe seu progresso, conquistas e evolução profissional",
      icon: <Target className="w-5 h-5 text-brand-600" />,
    };
  };

  const message = getPersonalizedMessage();
  const currentDate = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-brand-100/50 to-surface-50 rounded-2xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-transparent rounded-2xl"></div>

      {/* Padrão de background sutil */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${
            user.isManager ? "#7c3aed" : "#6366f1"
          } 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, ${
                           user.isManager ? "#a855f7" : "#8b5cf6"
                         } 0%, transparent 50%)`,
        }}
      ></div>

      {/* Conteúdo */}
      <div className="relative p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Saudação principal */}
            <div className="flex items-center gap-3 mb-2">
              {greeting.icon}
              <h1 className="text-3xl font-bold text-surface-900">
                {greeting.text}, {firstName}!
              </h1>
            </div>

            {/* Data atual */}
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-surface-500" />
              <span className="text-sm text-surface-600 capitalize">
                {currentDate}
              </span>
            </div>

            {/* Mensagem personalizada */}
            <div className="flex items-start gap-3">
              {message.icon}
              <div>
                <p className="text-lg font-medium text-surface-800 mb-1">
                  {message.primary}
                </p>
                <p className="text-surface-600 max-w-lg">{message.secondary}</p>
              </div>
            </div>

            {/* Badge de perfil */}
            <div className="mt-6">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                  user.isAdmin
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : user.isManager
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {user.isAdmin ? (
                  <>
                    <Building2 className="w-4 h-4 mr-2" />
                    CEO / Administrador
                  </>
                ) : user.isManager ? (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Gestor de Equipe
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Colaborador
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Avatar e informações do usuário */}
          <div className="flex-shrink-0 ml-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm">
                <div className="font-medium text-surface-900">{user.name}</div>
                {user.position && (
                  <div className="text-surface-600 mt-1">{user.position}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linha decorativa inferior */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent"></div>
    </div>
  );
}
