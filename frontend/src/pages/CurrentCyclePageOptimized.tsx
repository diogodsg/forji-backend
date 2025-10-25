import { useState } from "react";
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
import { DeleteGoalModal } from "../features/cycles/components/cycle-management/DeleteGoalModal";
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
import { useGamificationProfile } from "../features/cycles/hooks/useGamificationProfile";

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

  // Gamification Profile
  const {
    profile: gamificationProfile,
    loading: gamificationLoading,
    error: gamificationError,
    refreshProfile: refreshGamificationProfile,
  } = useGamificationProfile();

  const {
    createGoal,
    updateGoal,
    updateGoalProgress,
    deleteGoal,
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
        // Usar dados reais de gamificação quando disponíveis
        xpCurrent: gamificationProfile?.currentXP ?? 0,
        xpNextLevel: gamificationProfile?.nextLevelXP ?? 1000,
        currentLevel: gamificationProfile?.level ?? 1,
        streak: gamificationProfile?.streak ?? 0,
        totalXP: gamificationProfile?.totalXP ?? 0, // Adicionar totalXP
      }
    : mockCycleData;

  // Dados reais do usuário autenticado
  const userData = user
    ? {
        name: user.name.split(" ")[0], // Primeiro nome
        avatarId: user.avatarId,
      }
    : mockUserData;

  // Mapear goals do backend para formato do GoalsDashboard
  const goalsData =
    goals.length > 0
      ? goals.map((goal) => {
          console.log("🎯 Processando goal para visualização:", {
            id: goal.id,
            title: goal.title,
            type: goal.type,
            currentValue: goal.currentValue,
            targetValue: goal.targetValue,
            calculatedProgress: goal.progress,
            status: goal.status,
          });

          return {
            ...goal, // Manter todos os campos originais
            progress: goal.progress || 0, // Usar o progresso calculado pelo backend
            lastUpdate: goal.updatedAt, // Backend retorna updatedAt como string ISO
            status:
              goal.status === "COMPLETED"
                ? ("completed" as const)
                : (goal.progress || 0) >= 80 // Usar progress ao invés de currentValue
                ? ("on-track" as const)
                : ("needs-attention" as const),
          };
        })
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
    if (!cycle || !user) {
      toast.error("Nenhum ciclo ativo ou usuário encontrado");
      return;
    }

    try {
      // Mapear GoalData para CreateGoalDto (usando novos campos)
      const goalDto = {
        cycleId: cycle.id,
        userId: user.id,
        workspaceId: user.workspaceId,
        type: data.type.toUpperCase() as any, // "increase" -> "INCREASE"
        title: data.title,
        description: data.description,
        startValue: data.successCriterion.currentValue || 0,
        targetValue: data.successCriterion.targetValue || 0,
        unit: data.successCriterion.unit || "unidades",
      };

      const newGoal = await createGoal(goalDto);

      if (newGoal) {
        await refreshGoals();
        // Refresh dos dados de gamificação para mostrar o XP ganho
        refreshGamificationProfile();

        // Disparar animação de XP (+25 XP por criar meta)
        triggerXpAnimation(25);

        toast.success(
          `Meta "${newGoal.title}" criada! Você ganhou 25 XP! 🎯`,
          "Meta Criada"
        );
        handleClose();
      }
    } catch (err: any) {
      console.error("Erro ao criar meta:", err);

      // Extrair mensagem de erro mais específica se disponível
      let errorMessage =
        "Erro ao criar meta. Verifique os dados e tente novamente.";

      if (err?.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = `Erro: ${err.response.data.message.join(", ")}`;
        } else {
          errorMessage = `Erro: ${err.response.data.message}`;
        }
      } else if (err?.message) {
        errorMessage = `Erro: ${err.message}`;
      }

      toast.error(errorMessage, "Erro ao Criar Meta");
    }
  };

  // ==========================================
  // HANDLERS - Goal Delete
  // ==========================================

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    goalId: string | null;
    goalTitle: string;
    xpLoss: number;
  }>({
    isOpen: false,
    goalId: null,
    goalTitle: "",
    xpLoss: 0,
  });

  const [editModalState, setEditModalState] = useState<{
    isOpen: boolean;
    goalData: any | null;
  }>({
    isOpen: false,
    goalData: null,
  });

  const handleGoalDelete = (goalId: string) => {
    const goal = goalsData.find((g) => g.id === goalId);
    if (!goal) return;

    // Calcular XP que será perdido (estimativa: 25 XP base + progresso)
    const xpLoss = 25; // Por enquanto, só o XP da criação

    setDeleteModalState({
      isOpen: true,
      goalId,
      goalTitle: goal.title,
      xpLoss,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.goalId) return;

    try {
      const success = await deleteGoal(deleteModalState.goalId);

      if (success) {
        await refreshGoals();
        // Refresh dos dados de gamificação para mostrar XP removido
        refreshGamificationProfile();

        // Disparar animação de XP negativo (perda de XP)
        triggerXpAnimation(-deleteModalState.xpLoss);

        toast.success(
          `Meta "${deleteModalState.goalTitle}" excluída. ${deleteModalState.xpLoss} XP foi removido.`,
          "Meta Excluída"
        );

        setDeleteModalState({
          isOpen: false,
          goalId: null,
          goalTitle: "",
          xpLoss: 0,
        });
      }
    } catch (err) {
      console.error("Erro ao excluir meta:", err);
      toast.error("Erro ao excluir meta. Tente novamente.");
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalState({
      isOpen: false,
      goalId: null,
      goalTitle: "",
      xpLoss: 0,
    });
  };

  // ==========================================
  // HANDLERS - Goal Edit
  // ==========================================

  const handleGoalEdit = (goalId: string) => {
    const goal = goalsData.find((g) => g.id === goalId);
    if (!goal) return;

    console.log("🔍 Meta encontrada para edição:", goal);

    // Mapear tipos do backend para o frontend
    const typeMapping: Record<string, string> = {
      INCREASE: "increase",
      DECREASE: "decrease",
      PERCENTAGE: "percentage",
      BINARY: "binary",
    };

    const wizardType = typeMapping[goal.type] || goal.type.toLowerCase();

    // Transformar os dados da meta para o formato do wizard
    const goalData = {
      title: goal.title,
      description: goal.description,
      type: wizardType,
      deadline: goal.deadline,
      successCriterion: {
        type: wizardType,
        // Para metas increase/decrease/percentage - usar valores atuais da meta
        startValue: goal.startValue,
        currentValue: goal.currentValue,
        targetValue: goal.targetValue,
        unit: goal.unit || "",
        // Para metas binary
        completed: wizardType === "binary" ? goal.progress >= 100 : false,
      },
      // Manter uma referência ao ID original para buscar depois
      _originalId: goalId,
    };

    console.log("📝 Dados transformados para o wizard:", goalData);

    setEditModalState({
      isOpen: true,
      goalData,
    });
  };

  const handleGoalEditSave = async (updatedData: any) => {
    if (!editModalState.goalData) return;

    try {
      // Usar o ID original armazenado nos dados da meta
      const goalId = editModalState.goalData._originalId;

      if (!goalId) {
        toast.error("ID da meta não encontrado.");
        return;
      }

      // Mapear tipos do frontend para o backend
      const typeMapping: Record<string, string> = {
        increase: "INCREASE",
        decrease: "DECREASE",
        percentage: "PERCENTAGE",
        binary: "BINARY",
      };

      const backendType =
        typeMapping[updatedData.type] || updatedData.type.toUpperCase();

      // Transformar os dados do wizard para o formato da API
      const updateDto = {
        title: updatedData.title,
        description: updatedData.description,
        type: backendType,
        deadline: updatedData.deadline,
        targetValue: updatedData.successCriterion?.targetValue,
        // Incluir startValue para permitir edição do valor inicial
        ...(updatedData.successCriterion?.startValue !== undefined && {
          startValue: updatedData.successCriterion.startValue,
        }),
        // Incluir currentValue para permitir edição do valor atual
        ...(updatedData.successCriterion?.currentValue !== undefined && {
          currentValue: updatedData.successCriterion.currentValue,
        }),
        // Adicionar unit se disponível
        ...(updatedData.successCriterion?.unit && {
          unit: updatedData.successCriterion.unit,
        }),
      };

      console.log("📝 Dados originais da meta:", editModalState.goalData);
      console.log("📝 Dados atualizados do wizard:", updatedData);
      console.log("📝 DTO final para API:", updateDto);

      console.log("📝 Atualizando meta:", goalId, updateDto);

      const result = await updateGoal(goalId, updateDto);

      if (result) {
        setEditModalState({
          isOpen: false,
          goalData: null,
        });

        toast.success("Meta editada com sucesso!", "Meta Atualizada");
        await refreshGoals();
      }
    } catch (err: any) {
      console.error("Erro ao editar meta:", err);

      // Extrair mensagem de erro mais específica se disponível
      let errorMessage = "Erro ao editar meta. Tente novamente.";

      if (err?.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = `Erro: ${err.response.data.message.join(", ")}`;
        } else {
          errorMessage = `Erro: ${err.response.data.message}`;
        }
      } else if (err?.message) {
        errorMessage = `Erro: ${err.message}`;
      }

      toast.error(errorMessage, "Erro ao Editar Meta");
    }
  };

  const handleCancelEdit = () => {
    setEditModalState({
      isOpen: false,
      goalData: null,
    });
  };

  // ==========================================
  // HANDLERS - Goal Progress Update
  // ==========================================

  const handleGoalProgressUpdate = async (goalId: string, data: any) => {
    try {
      // Calculate newValue from the progress data
      let newValue: number;

      if (typeof data.newProgress === "number") {
        // For percentage-based goals, convert progress to actual value
        if (data.goalType === "percentage") {
          newValue = Math.max(0, data.newProgress);
        } else if (
          data.startValue !== undefined &&
          data.targetValue !== undefined
        ) {
          // For increase/decrease goals, calculate absolute value from progress
          const range = data.targetValue - data.startValue;
          newValue = Math.max(
            0,
            data.startValue + (range * data.newProgress) / 100
          );
        } else {
          newValue = Math.max(0, data.newProgress);
        }
      } else if (typeof data.currentValue === "number") {
        newValue = Math.max(0, data.currentValue);
      } else if (typeof data.value === "number") {
        newValue = Math.max(0, data.value);
      } else {
        throw new Error("Invalid progress data: no valid numeric value found");
      }

      console.log("🎯 Goal Progress Update:", {
        goalId,
        goalType: data.goalType,
        originalData: data,
        calculatedNewValue: newValue,
        notes: data.notes || data.description,
      });

      const updatedGoal = await updateGoalProgress(goalId, {
        newValue: Math.round(newValue), // Ensure integer value
        notes: data.notes || data.description,
      });

      if (updatedGoal) {
        console.log("✅ Goal atualizada com sucesso:", updatedGoal);

        // Small delay to ensure backend transaction is fully committed
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Refresh both goals and gamification profile in parallel
        console.log("🔄 Fazendo refresh das goals e perfil de gamificação...");
        await Promise.all([refreshGoals(), refreshGamificationProfile()]);
        console.log("✅ Refresh concluído");

        // Trigger XP animation at center of screen
        if (updatedGoal.xpReward && updatedGoal.xpReward > 0) {
          triggerXpAnimation(
            updatedGoal.xpReward,
            window.innerWidth / 2,
            window.innerHeight / 2
          );
        }

        toast.success(
          `+${updatedGoal.xpReward || 0} XP ganho! Continue assim! 🔥`,
          "Progresso Atualizado",
          4000
        );
        handleClose();
      }
    } catch (err: any) {
      console.error("Erro ao atualizar progresso:", err);

      // Extrair mensagem de erro mais específica se disponível
      let errorMessage = "Erro ao atualizar progresso. Tente novamente.";

      if (err?.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = `Erro: ${err.response.data.message.join(", ")}`;
        } else {
          errorMessage = `Erro: ${err.response.data.message}`;
        }
      } else if (err?.message) {
        errorMessage = `Erro: ${err.message}`;
      }

      toast.error(errorMessage, "Erro ao Atualizar Progresso");
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
  // HANDLERS - Competency Create
  // ==========================================

  const handleCompetencyCreate = async (data: any) => {
    if (!cycle) {
      toast.error("Nenhum ciclo ativo encontrado");
      return;
    }

    try {
      // Mapear categoria para o backend
      const categoryMapping: Record<string, string> = {
        technical: "TECHNICAL",
        behavioral: "BEHAVIORAL",
        leadership: "LEADERSHIP",
        business: "BUSINESS",
      };

      const payload = {
        cycleId: cycle.id,
        userId: cycle.userId,
        name: data.name,
        category: categoryMapping[data.category] || "TECHNICAL",
        currentLevel: data.initialLevel,
        targetLevel: data.targetLevel,
      };

      console.log("Enviando competência para o backend:", payload);

      const competency = await createCompetency(payload);

      if (competency) {
        await refreshCompetencies();

        // Calcular XP baseado na diferença de níveis
        const levelDifference = data.targetLevel - data.initialLevel;
        const xpEarned = 100 + levelDifference * 33;

        // Trigger XP animation
        triggerXpAnimation(
          xpEarned,
          window.innerWidth / 2,
          window.innerHeight / 2
        );

        toast.success(
          `+${xpEarned} XP ganho! Competência "${data.name}" registrada 🎯`,
          "Competência Criada",
          4000
        );
        handleClose();
      }
    } catch (err: any) {
      console.error("Erro ao criar competência:", err);

      let errorMessage = "Erro ao criar competência. Tente novamente.";
      if (err?.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = `Erro: ${err.response.data.message.join(", ")}`;
        } else {
          errorMessage = `Erro: ${err.response.data.message}`;
        }
      } else if (err?.message) {
        errorMessage = `Erro: ${err.message}`;
      }

      toast.error(errorMessage, "Erro ao Criar Competência");
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
            <GoalsDashboard
              goals={goalsData}
              onUpdateGoal={handleGoalUpdate}
              onEditGoal={handleGoalEdit}
              onDeleteGoal={handleGoalDelete}
            />

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
        onSave={handleCompetencyCreate}
      />

      {/* Goal Creator Modal */}
      <GoalCreatorWizard
        isOpen={isOpen("goalCreator")}
        onClose={handleClose}
        onSave={handleGoalCreate}
      />

      {/* Goal Edit Modal */}
      <GoalCreatorWizard
        isOpen={editModalState.isOpen}
        onClose={handleCancelEdit}
        onSave={handleGoalEditSave}
        prefillData={editModalState.goalData}
        isEditing={true}
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

      {/* Modal de Exclusão de Meta */}
      {deleteModalState.isOpen && (
        <DeleteGoalModal
          isOpen={deleteModalState.isOpen}
          goalTitle={deleteModalState.goalTitle}
          xpLoss={25} // 25 XP perdidos por meta excluída
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
