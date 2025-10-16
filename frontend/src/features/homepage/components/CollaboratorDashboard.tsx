import { useState } from "react";
import { WeeklyProgressCard } from "./WeeklyProgressCard";
import { TodaysFocusCard } from "./TodaysFocusCard";
import { MyTeamPulseCard } from "./MyTeamPulseCard";
import { BadgeComponent } from "@/features/gamification";
import type { PlayerProfile } from "@/features/gamification/types/gamification";

interface CollaboratorDashboardProps {
  profile: PlayerProfile;
  className?: string;
}

/**
 * Dashboard principal para colaboradores - foca em progresso pessoal,
 * quick actions e conexão com a equipe de forma não competitiva
 */
export function CollaboratorDashboard({
  profile,
  className = "",
}: CollaboratorDashboardProps) {
  // Mock data - em produção viria de APIs específicas
  const [weeklyData, setWeeklyData] = useState({
    streak: 3,
    goalsCompleted: 4,
    goalsTotal: 6,
    weeklyXP: 150,
  });

  const [todaysActions, setTodaysActions] = useState([
    {
      id: "weekly-review",
      title: "Complete sua revisão semanal",
      description: "Reflita sobre seus aprendizados e conquistas desta semana",
      xpReward: 50,
      timeEstimate: "5 min",
      priority: "critical" as const,
      action: async () => {
        // Navegar para página de review semanal
        console.log("Navegando para weekly review");
      },
      completed: false,
    },
    {
      id: "update-goal",
      title: "Atualize progresso da meta: React Advanced",
      description: "Marque as atividades completadas no seu PDI",
      xpReward: 25,
      timeEstimate: "2 min",
      priority: "quick-win" as const,
      action: async () => {
        console.log("Atualizando meta React");
      },
      completed: false,
    },
    {
      id: "skill-assessment",
      title: "Avalie competência: Comunicação",
      description: "Auto-avaliação mensal das suas soft skills",
      xpReward: 30,
      timeEstimate: "3 min",
      priority: "growth" as const,
      action: async () => {
        console.log("Avaliando comunicação");
      },
      completed: false,
    },
  ]);

  const [teamData] = useState({
    teamName: "Engineering Alpha",
    members: [
      {
        id: "1",
        name: "Maria Silva",
        isOnline: true,
        canHelp: ["React", "TypeScript"],
        learning: ["Python"],
        recentAchievement: "Completou curso de Node.js",
      },
      {
        id: "2",
        name: "João Santos",
        isOnline: false,
        canHelp: ["Python", "AWS"],
        learning: ["React"],
      },
      {
        id: "3",
        name: "Ana Costa",
        isOnline: true,
        canHelp: ["Design Systems"],
        learning: ["TypeScript"],
      },
    ],
    celebrations: [
      {
        id: "1",
        type: "achievement" as const,
        message: "Maria completou certificação em Node.js! 🎉",
        member: "Maria Silva",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
      },
      {
        id: "2",
        type: "milestone" as const,
        message: "João alcançou 100% nas metas do mês! 🎯",
        member: "João Santos",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h atrás
      },
    ],
    goalsProgress: 75,
    momentum: "high" as const,
  });

  const handleActionComplete = (actionId: string) => {
    setTodaysActions((prev) =>
      prev.map((action) =>
        action.id === actionId ? { ...action, completed: true } : action
      )
    );

    // Simular aumento de XP semanal
    const completedAction = todaysActions.find((a) => a.id === actionId);
    if (completedAction) {
      setWeeklyData((prev) => ({
        ...prev,
        weeklyXP: prev.weeklyXP + completedAction.xpReward,
      }));
    }
  };

  return (
    <div className={className}>
      {/* Layout Principal - 2 colunas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="xl:col-span-2 space-y-8">
          {/* Weekly Progress Hero */}
          <WeeklyProgressCard
            weeklyStreak={weeklyData.streak}
            weeklyGoalsCompleted={weeklyData.goalsCompleted}
            weeklyGoalsTotal={weeklyData.goalsTotal}
            nextLevelXP={profile.nextLevelXP}
            currentXP={profile.currentXP}
            weeklyXP={weeklyData.weeklyXP}
          />

          {/* Today's Focus */}
          <TodaysFocusCard
            actions={todaysActions}
            onActionComplete={handleActionComplete}
          />

          {/* Recent Badges (se houver) */}
          {profile.badges.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-surface-300 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Últimas Conquistas 🏆
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {profile.badges.slice(0, 6).map((badge) => (
                  <BadgeComponent key={badge.id} badge={badge} size="sm" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Pulse */}
          <MyTeamPulseCard
            teamName={teamData.teamName}
            teamMembers={teamData.members}
            recentCelebrations={teamData.celebrations}
            teamGoalsProgress={teamData.goalsProgress}
            weeklyMomentum={teamData.momentum}
          />

          {/* Next Achievement Preview */}
          <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl border border-brand-200 p-6">
            <h4 className="font-semibold text-brand-900 mb-3">
              🎯 Próxima Conquista
            </h4>
            <div className="space-y-3">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                <div className="font-medium text-brand-800 text-sm">
                  Badge "Consistente"
                </div>
                <div className="text-xs text-brand-600 mt-1">
                  Complete 4 semanas consecutivas
                </div>
                <div className="w-full bg-brand-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(weeklyData.streak / 4) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-brand-600 mt-1 text-center">
                  {weeklyData.streak}/4 semanas
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-surface-300 p-6">
            <h4 className="font-semibold text-gray-800 mb-4">
              📊 Suas Estatísticas
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nível atual</span>
                <span className="font-bold text-brand-600">
                  {profile.level}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">XP total</span>
                <span className="font-bold text-gray-800">
                  {profile.totalXP}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Badges conquistados</span>
                <span className="font-bold text-amber-600">
                  {profile.badges.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Streak semanal</span>
                <span className="font-bold text-emerald-600">
                  {weeklyData.streak}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
