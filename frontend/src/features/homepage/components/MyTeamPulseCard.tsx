import {
  Users,
  TrendingUp,
  MessageCircle,
  Award,
  Star,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  recentAchievement?: string;
  isOnline: boolean;
  canHelp?: string[]; // Skills que pode ensinar
  learning?: string[]; // Skills que está aprendendo
}

interface TeamCelebration {
  id: string;
  type: "achievement" | "milestone" | "collaboration";
  message: string;
  member: string;
  timestamp: Date;
}

interface MyTeamPulseCardProps {
  teamName: string;
  teamMembers: TeamMember[];
  recentCelebrations: TeamCelebration[];
  teamGoalsProgress: number;
  weeklyMomentum: "high" | "medium" | "low";
  className?: string;
}

/**
 * Card que mostra o pulso da equipe de forma colaborativa e não competitiva
 * Foca em celebrações, colaboração e apoio mútuo
 */
export function MyTeamPulseCard({
  teamName,
  teamMembers,
  recentCelebrations,
  teamGoalsProgress,
  weeklyMomentum,
  className = "",
}: MyTeamPulseCardProps) {
  const navigate = useNavigate();

  const getMomentumConfig = (momentum: typeof weeklyMomentum) => {
    switch (momentum) {
      case "high":
        return {
          label: "Alto",
          icon: <TrendingUp className="w-5 h-5" />,
          message: "A equipe está em alta!",
          color: "emerald",
          bgColor: "bg-success-50",
          textColor: "text-success-700",
        };
      case "medium":
        return {
          label: "Estável",
          icon: <TrendingUp className="w-5 h-5" />,
          message: "Progresso constante",
          color: "blue",
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
        };
      case "low":
        return {
          label: "Crescendo",
          icon: <TrendingUp className="w-5 h-5" />,
          message: "Vamos juntos!",
          color: "amber",
          bgColor: "bg-warning-50",
          textColor: "text-warning-700",
        };
    }
  };

  const momentumConfig = getMomentumConfig(weeklyMomentum);
  const onlineMembers = teamMembers.filter((m) => m.isOnline).length;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-surface-300 ${className}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              {teamName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {onlineMembers} de {teamMembers.length} membros online
            </p>
          </div>
          <button
            onClick={() => navigate("/teams")}
            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium transition-colors"
          >
            Ver Equipe
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Team Momentum */}
        <div
          className={`
          rounded-xl p-4 border mb-6
          ${momentumConfig.bgColor} border-${momentumConfig.color}-200
        `}
        >
          <div className="flex items-center gap-3">
            <div className={momentumConfig.textColor}>
              {momentumConfig.icon}
            </div>
            <div>
              <div className={`font-semibold ${momentumConfig.textColor}`}>
                {momentumConfig.message}
              </div>
              <div className="text-sm opacity-80">
                Momentum semanal: {momentumConfig.label}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Celebrations */}
        <div className="mb-6">
          <h4 className="font-medium text-surface-800 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-warning-500" />
            Celebrações Recentes
          </h4>

          {recentCelebrations.length === 0 ? (
            <div className="text-center py-4 bg-surface-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-surface-500 text-sm">
                <Star className="w-4 h-4" />
                <span>Seja o primeiro a conquistar algo esta semana!</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCelebrations.slice(0, 3).map((celebration) => (
                <div
                  key={celebration.id}
                  className="bg-warning-50 border border-warning-200 rounded-lg p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {celebration.type === "achievement" && (
                        <Award className="w-4 h-4 text-warning-600" />
                      )}
                      {celebration.type === "milestone" && (
                        <Star className="w-4 h-4 text-warning-600" />
                      )}
                      {celebration.type === "collaboration" && (
                        <Users className="w-4 h-4 text-warning-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-warning-800 font-medium">
                        {celebration.message}
                      </p>
                      <p className="text-xs text-warning-600 mt-1">
                        {celebration.member} • há{" "}
                        {Math.floor(
                          (Date.now() - celebration.timestamp.getTime()) /
                            (1000 * 60 * 60)
                        )}
                        h
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Goals Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-surface-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              Metas da Equipe
            </h4>
            <span className="text-sm text-surface-500">
              {Math.round(teamGoalsProgress)}% completas
            </span>
          </div>

          <div className="w-full bg-surface-200 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-brand-400 to-brand-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(teamGoalsProgress, 100)}%` }}
            />
          </div>

          <p className="text-xs text-surface-500 text-center">
            Progresso coletivo desta semana
          </p>
        </div>

        {/* Collaboration Opportunities */}
        <div>
          <h4 className="font-medium text-surface-800 mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-brand-500" />
            Oportunidades de Colaboração
          </h4>

          <div className="space-y-2">
            {teamMembers
              .filter(
                (member) => member.canHelp?.length || member.learning?.length
              )
              .slice(0, 2)
              .map((member) => (
                <div
                  key={member.id}
                  className="bg-brand-50 border border-brand-200 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-brand-800 text-sm">
                        {member.name}
                      </p>
                      {member.canHelp && member.canHelp.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-brand-600">
                          <MessageCircle className="w-3 h-3" />
                          <span>
                            Pode ajudar com:{" "}
                            {member.canHelp.slice(0, 2).join(", ")}
                          </span>
                        </div>
                      )}
                      {member.learning && member.learning.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-brand-600">
                          <TrendingUp className="w-3 h-3" />
                          <span>
                            Aprendendo: {member.learning.slice(0, 2).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      className={`
                      w-2 h-2 rounded-full
                      ${member.isOnline ? "bg-success-400" : "bg-surface-300"}
                    `}
                    />
                  </div>
                </div>
              ))}

            {teamMembers.filter((m) => m.canHelp?.length || m.learning?.length)
              .length === 0 && (
              <div className="text-center py-3 bg-surface-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-surface-500 text-sm">
                  <Users className="w-4 h-4" />
                  <span>Complete seu perfil para encontrar colaborações!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
