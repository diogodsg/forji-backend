import {
  CycleHeroSection,
  QuickActionsBar,
  GoalsDashboard,
  CompetenciesSection,
  ActivitiesTimeline,
  ActivityDetailsModal,
  OneOnOneRecorder,
  MentoringRecorderOptimized,
  CompetenceRecorder,
  GoalCreatorWizard,
  GoalUpdateRecorder,
} from "../features/cycles";
import { CompetenceUpdateRecorder } from "../features/cycles/components/tracking-recorders/competence-update-recorder";
import {
  mockUserData,
  mockCycleData,
  mockGoalsData,
  mockCompetenciesData,
} from "./mockData";
import { useModalManager, createModalHelpers } from "../hooks/useModalManager";
import { useToast } from "../components/Toast";
import { useAuth } from "../features/auth";
import { useXpAnimations } from "../components/XpFloating";
import { useCelebrations } from "../hooks/useCelebrations";

// NEW: API Integration Hooks
import {
  useIntegratedCycleData,
  useGoalMutations,
  useCompetencyMutations,
  useActivityMutations,
  useActivitiesTimeline,
} from "../features/cycles/hooks";

/**
 * CurrentCyclePage - Versão Otimizada (Proposta Desenvolvimento Ciclo)
 *
 * **Arquitetura Desktop-First (>1200px):**
 *
 * ```
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 🎯 HERO SECTION (Gamificação Central)                      │
 * │ Avatar + Progress Ring + XP System + Streak                │
 * └─────────────────────────────────────────────────────────────┘
 * ┌─────────────────────────────────────────────────────────────┐
 * │ ⚡ QUICK ACTIONS BAR (Sempre Visível)                      │
 * │ [1:1] [Mentoria] [Certificação] [Nova Meta]               │
 * └─────────────────────────────────────────────────────────────┘
 * ┌─────────────────────┬───────────────────────────────────────┐
 * │ 🎯 GOALS (50%)      │ 🧠 COMPETÊNCIAS (50%)                │
 * │                     │                                       │
 * └─────────────────────┴───────────────────────────────────────┘
 * ┌─────────────────────────────────────────────────────────────┐
 * │ ⏰ ACTIVITIES TIMELINE (Full Width)                        │
 * └─────────────────────────────────────────────────────────────┘
 * ```
 *
 * **Princípios de Design:**
 * 1. Hero Section First - Gamificação central
 * 2. Quick Actions Always - Acesso imediato (2-3 cliques)
 * 3. Goals & Competencies Balance - 50/50 split
 * 4. Full-Width Activities - Timeline rica
 * 5. Desktop-First Only - Sem mobile
 * 6. Instant Gratification - XP preview
 * 7. Quality Data - Forms inteligentes
 * 8. Design System Violet - 100% compliance
 */
export function CurrentCyclePageOptimized() {
  // Auth context
  const { user } = useAuth();

  // Toast notifications
  const toast = useToast();

  // XP Animations & Celebrations (hooks globais gerenciados no App.tsx)
  const { triggerXpAnimation } = useXpAnimations();
  const { triggerLevelUp } = useCelebrations();

  // Modal Management (centralizado)
  const { modalState, openModal, closeModal, isOpen } = useModalManager();

  // Modal Helpers (handlers semânticos)
  const {
    handleOneOnOne,
    handleMentoring,
    handleCompetence,
    handleGoalCreator,
    handleGoalUpdate,
    handleCompetenceUpdate,
    handleActivityDetails,
    handleClose,
  } = createModalHelpers(openModal, closeModal);

  // API Integration (NEW!)
  const {
    cycle,
    goals,
    competencies,
    activities,
    loading,
    error,
    refresh,
    refreshGoals,
    refreshCompetencies,
    refreshActivities,
  } = useIntegratedCycleData();

  const {
    createGoal,
    updateGoalProgress,
    loading: goalLoading,
    error: goalError,
  } = useGoalMutations();

  const {
    createCompetency,
    updateCompetencyProgress,
    loading: competencyLoading,
    error: competencyError,
  } = useCompetencyMutations();

  const {
    createOneOnOne,
    createMentoring,
    createCertification,
    loading: activityLoading,
    error: activityError,
  } = useActivityMutations();

  // Fallback para mock data se não houver ciclo
  const cycleData = cycle
    ? {
        ...cycle,
        // Adicionar campos de gamificação se não existirem (para compatibilidade com UI)
        xpCurrent: cycle.xpCurrent ?? 0,
        xpNextLevel: cycle.xpNextLevel ?? 1000,
        currentLevel: cycle.currentLevel ?? 1,
        streak: cycle.streak ?? 0,
      }
    : mockCycleData;

  // Dados reais do usuário autenticado
  const userData = user
    ? {
        name: user.name.split(" ")[0], // Primeiro nome
        initials: user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase(),
      }
    : mockUserData;

  // Mapear goals do backend para formato do GoalsDashboard
  const goalsData =
    goals.length > 0
      ? goals.map((goal) => ({
          ...goal, // Manter todos os campos originais
          progress: goal.currentValue || 0,
          lastUpdate: goal.updatedAt, // Backend retorna updatedAt como string ISO
          status:
            goal.status === "COMPLETED"
              ? ("completed" as const)
              : (goal.currentValue || 0) >= (goal.targetValue || 0) * 0.8
              ? ("on-track" as const)
              : ("needs-attention" as const),
        }))
      : mockGoalsData;

  // Mapear competencies do backend para formato do CompetenciesSection
  const competenciesData =
    competencies.length > 0
      ? competencies.map((comp) => ({
          ...comp, // Manter todos os campos originais
          currentProgress: comp.currentProgress || 0,
          totalXP: comp.totalXP || 0,
          nextMilestone: comp.nextMilestone || "A definir",
        }))
      : mockCompetenciesData;

  // Mapear activities do backend para formato da Timeline
  // API já extrai o array do objeto paginado
  const safeActivities = Array.isArray(activities) ? activities : [];
  const timelineActivities = useActivitiesTimeline(safeActivities);

  // ✅ Usar apenas dados reais do backend (nunca mock)
  // Se não houver atividades, retorna array vazio []
  const activitiesData = timelineActivities;

  // ==========================================
  // HANDLERS - Goal Creation
  // ==========================================

  const handleGoalCreate = async (data: any) => {
    if (!cycle) {
      toast.error("Nenhum ciclo ativo encontrado");
      return;
    }

    try {
      // Mapear GoalData para CreateGoalDto
      const goalDto = {
        cycleId: cycle.id,
        title: data.title,
        description: data.description,
        type: data.type.toUpperCase() as any, // "increase" -> "INCREASE"
        targetValue: data.successCriterion.targetValue || 0,
        initialValue: data.successCriterion.currentValue || 0,
        deadline: new Date().toISOString(), // TODO: Usar data do formulário
      };

      const newGoal = await createGoal(goalDto);

      if (newGoal) {
        await refreshGoals();
        toast.success(
          `Meta "${newGoal.title}" criada! Ganhe até ${newGoal.xpReward} XP ao completá-la 🎯`,
          "Meta Criada"
        );
        handleClose();
      }
    } catch (err) {
      toast.error("Erro ao criar meta. Tente novamente.");
    }
  };

  // ==========================================
  // HANDLERS - Goal Progress Update
  // ==========================================

  const handleGoalProgressUpdate = async (goalId: string, data: any) => {
    try {
      const updatedGoal = await updateGoalProgress(goalId, {
        currentValue: data.currentValue || data.value,
        notes: data.notes || data.description,
      });

      if (updatedGoal) {
        await refreshGoals();

        // Trigger XP animation at center of screen
        if (updatedGoal.xpReward && updatedGoal.xpReward > 0) {
          triggerXpAnimation(
            updatedGoal.xpReward,
            window.innerWidth / 2,
            window.innerHeight / 2
          );
        }

        toast.success(
          `+${updatedGoal.xpReward} XP ganho! Continue assim! 🔥`,
          "Progresso Atualizado",
          4000
        );
        handleClose();
      }
    } catch (err) {
      toast.error("Erro ao atualizar progresso. Tente novamente.");
    }
  };

  // ==========================================
  // HANDLERS - Activities Creation
  // ==========================================

  const handleOneOnOneCreate = async (data: any) => {
    if (!cycle) {
      toast.error("Nenhum ciclo ativo encontrado");
      return;
    }

    if (!user?.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      const activity = await createOneOnOne({
        cycleId: cycle.id,
        userId: user.id,
        type: "ONE_ON_ONE",
        title: `1:1 com ${data.participant}`,
        description: `Reunião 1:1 em ${data.date}`,
        duration: 45, // Duração padrão
        oneOnOneData: {
          participantName: data.participant,
          workingOn: data.workingOn || [],
          generalNotes: data.generalNotes || "",
          positivePoints: data.positivePoints || [],
          improvementPoints: data.improvementPoints || [],
          nextSteps: data.nextSteps || [],
        },
      });

      if (activity) {
        await refreshActivities();

        // Debug: log da atividade retornada
        console.log("🎯 Activity created:", activity);
        console.log("🎯 XP Earned:", activity.xpEarned);

        // Trigger XP animation (com confetti automático! 🎉)
        if (activity.xpEarned && activity.xpEarned > 0) {
          console.log("🎉 Triggering XP animation:", activity.xpEarned);
          triggerXpAnimation(
            activity.xpEarned,
            window.innerWidth / 2,
            window.innerHeight / 2
          );
        }

        toast.success(
          `+${activity.xpEarned || 0} XP ganho! Reunião 1:1 registrada 👥`,
          "1:1 Criado",
          3500
        );
        handleClose();
      }
    } catch (err) {
      toast.error("Erro ao criar 1:1. Tente novamente.");
    }
  };

  const handleMentoringCreate = async (data: any) => {
    if (!cycle) {
      toast.error("Nenhum ciclo ativo encontrado");
      return;
    }

    try {
      const activity = await createMentoring({
        cycleId: cycle.id,
        title: data.title,
        description: data.description,
        mentorId: data.mentorId || user?.id || "unknown",
        sessionDate: data.date || new Date().toISOString(),
        topics: data.topics || [],
        nextSteps: data.nextSteps || [],
      });

      if (activity) {
        await refreshActivities();

        // Trigger XP animation
        if (activity.xpEarned && activity.xpEarned > 0) {
          triggerXpAnimation(
            activity.xpEarned,
            window.innerWidth / 2,
            window.innerHeight / 2
          );
        }

        toast.success(
          `+${activity.xpEarned} XP ganho! Sessão de mentoria registrada 🎓`,
          "Mentoria Criada",
          3500
        );
        handleClose();
      }
    } catch (err) {
      toast.error("Erro ao criar mentoria. Tente novamente.");
    }
  };

  const handleCertificationCreate = async (data: any) => {
    if (!cycle) {
      toast.error("Nenhum ciclo ativo encontrado");
      return;
    }

    try {
      const activity = await createCertification({
        cycleId: cycle.id,
        title: data.title,
        description: data.description,
        platform: data.platform || "Online",
        completionDate: data.completionDate || new Date().toISOString(),
        certificateUrl: data.certificateUrl,
        skills: data.skills || [],
      });

      if (activity) {
        await refreshActivities();

        // Trigger XP animation
        if (activity.xpEarned && activity.xpEarned > 0) {
          triggerXpAnimation(
            activity.xpEarned,
            window.innerWidth / 2,
            window.innerHeight / 2
          );
        }

        toast.success(
          `+${activity.xpEarned} XP ganho! Certificação registrada 🏆`,
          "Certificação Criada",
          4000
        );
        handleClose();
      }
    } catch (err) {
      toast.error("Erro ao criar certificação. Tente novamente.");
    }
  };

  // ==========================================
  // HANDLERS - Competency Update
  // ==========================================

  const handleCompetencyProgressUpdate = async (
    competencyId: string,
    data: any
  ) => {
    try {
      const updatedCompetency = await updateCompetencyProgress(competencyId, {
        currentLevel: data.newLevel || data.level,
        notes: data.notes || data.description,
      });

      if (updatedCompetency) {
        await refreshCompetencies();
        const levelUp = updatedCompetency.currentLevel > (data.oldLevel || 0);

        // Trigger XP animation for competency progress (com confetti automático! 🎉)
        if (updatedCompetency.xpEarned && updatedCompetency.xpEarned > 0) {
          triggerXpAnimation(
            updatedCompetency.xpEarned,
            window.innerWidth / 2,
            window.innerHeight / 2
          );
        }

        // Trigger LEVEL UP celebration épica para level ups de competência! ⭐
        if (levelUp) {
          triggerLevelUp(updatedCompetency.currentLevel);
        }

        toast.success(
          levelUp
            ? `🎉 Level up! Agora você está no nível ${updatedCompetency.currentLevel}`
            : `Competência atualizada! Continue evoluindo 📈`,
          "Progresso Atualizado",
          4000
        );
        handleClose();
      }
    } catch (err) {
      toast.error("Erro ao atualizar competência. Tente novamente.");
    }
  };

  // ==========================================
  // HANDLERS - Legacy
  // ==========================================

  // Handlers
  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case "oneOnOne":
        handleOneOnOne();
        break;
      case "mentoring":
        handleMentoring();
        break;
      case "certification":
        handleCompetence();
        break;
      case "newGoal":
        handleGoalCreator();
        break;
    }
  };

  const handleViewCompetency = () => {
    // TODO: Implementar visualização detalhada de competência
  };

  const handleRepeatActivity = (activityId: string) => {
    const activity = activitiesData.find((a) => a.id === activityId);
    if (activity?.type === "oneOnOne") {
      handleOneOnOne();
      // TODO: Pré-preencher dados do modal com activity
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      {/* Loading State */}
      {loading.cycle && (
        <div className="container mx-auto px-6 py-20 max-w-7xl text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
          <p className="mt-4 text-surface-600 font-medium">
            Carregando ciclo...
          </p>
        </div>
      )}

      {/* Error State */}
      {error.cycle && !loading.cycle && (
        <div className="container mx-auto px-6 py-20 max-w-7xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-semibold mb-2">
              Erro ao carregar ciclo
            </p>
            <p className="text-red-600 text-sm">{error.cycle}</p>
            <button
              onClick={refresh}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading.cycle && !error.cycle && (
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          {/* Hero Section - Gamificação Central */}
          <div className="mb-8">
            <CycleHeroSection user={userData} cycle={cycleData} />
          </div>

          {/* Quick Actions Bar - Sempre Visível */}
          <div className="mb-8">
            <QuickActionsBar onActionClick={handleActionClick} />
          </div>

          {/* Goals & Competencies - 50/50 Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Goals Dashboard (50%) */}
            <GoalsDashboard goals={goalsData} onUpdateGoal={handleGoalUpdate} />

            {/* Competencies Section (50%) */}
            <CompetenciesSection
              competencies={competenciesData}
              onViewCompetency={handleViewCompetency}
              onUpdateProgress={handleCompetenceUpdate}
            />
          </div>

          {/* Activities Timeline - Full Width */}
          <ActivitiesTimeline
            activities={activitiesData}
            onViewDetails={handleActivityDetails}
            onRepeatActivity={handleRepeatActivity}
          />
        </div>
      )}

      {/* Modals */}

      {/* OneOnOne Recorder Modal */}
      <OneOnOneRecorder
        isOpen={isOpen("oneOnOne")}
        onClose={handleClose}
        onSave={handleOneOnOneCreate}
      />

      {/* Mentoring Recorder Modal */}
      <MentoringRecorderOptimized
        isOpen={isOpen("mentoring")}
        onClose={handleClose}
        onSave={handleMentoringCreate}
      />

      {/* Competence Recorder Modal */}
      <CompetenceRecorder
        isOpen={isOpen("competence")}
        onClose={handleClose}
        onSave={handleCertificationCreate}
      />

      {/* Goal Creator Modal */}
      <GoalCreatorWizard
        isOpen={isOpen("goalCreator")}
        onClose={handleClose}
        onSave={handleGoalCreate}
      />

      {/* Goal Update Modal */}
      {modalState.type === "goalUpdate" &&
        modalState.selectedId &&
        (() => {
          const selectedGoal = goalsData.find(
            (g) => g.id === modalState.selectedId
          );
          if (!selectedGoal) return null;

          return (
            <GoalUpdateRecorder
              isOpen={true}
              onClose={handleClose}
              onSave={(data) => handleGoalProgressUpdate(selectedGoal.id, data)}
              goal={{
                id: selectedGoal.id,
                title: selectedGoal.title,
                description: selectedGoal.description,
                type: selectedGoal.type,
                currentProgress: selectedGoal.progress,
                currentValue: selectedGoal.currentValue,
                targetValue: selectedGoal.targetValue,
                startValue: selectedGoal.startValue,
                unit: selectedGoal.unit,
              }}
            />
          );
        })()}

      {/* Competence Update Recorder Modal */}
      {modalState.type === "competenceUpdate" &&
        modalState.selectedId &&
        (() => {
          const selectedComp = competenciesData.find(
            (c) => c.id === modalState.selectedId
          );
          if (!selectedComp) return null;

          return (
            <CompetenceUpdateRecorder
              isOpen={true}
              onClose={handleClose}
              onSave={(data) =>
                handleCompetencyProgressUpdate(selectedComp.id, data)
              }
              competence={{
                id: selectedComp.id,
                name: selectedComp.name,
                category: selectedComp.category,
                currentLevel: selectedComp.currentLevel,
                targetLevel: selectedComp.targetLevel,
                currentProgress: selectedComp.currentProgress,
                nextMilestone: selectedComp.nextMilestone,
              }}
            />
          );
        })()}

      {/* Activity Details Modal */}
      <ActivityDetailsModal
        isOpen={isOpen("activityDetails")}
        onClose={handleClose}
        activity={
          modalState.selectedId
            ? activitiesData.find((a) => a.id === modalState.selectedId) || null
            : null
        }
      />
    </div>
  );
}
