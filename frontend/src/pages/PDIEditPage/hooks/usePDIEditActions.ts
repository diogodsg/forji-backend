import { useCallback } from "react";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/features/auth";
import { useXpAnimations } from "@/components/XpFloating";
import { useGamificationProfile } from "@/features/cycles/hooks/useGamificationProfile";
import { useGoalMutations } from "@/features/cycles";
import type { UsePDIEditDataReturn } from "./usePDIEditData";

export interface UsePDIEditActionsReturn {
  // Goal handlers
  handleGoalCreate: () => void;
  handleGoalEdit: (goalId: string) => void;
  handleGoalDelete: (goalId: string) => Promise<void>;
  handleGoalUpdateClick: (goalId: string) => void;
  handleGoalProgressUpdate: (goalId: string, data: any) => Promise<void>;
  handleGoalSave: (goalData: any) => Promise<void>;
  handleGoalEditSave: (goalId: string, goalData: any) => Promise<void>;
  // Competency handlers
  handleCompetencyCreate: () => void;
  handleCompetencyView: (competencyId: string) => void;
  handleCompetencyProgressUpdate: (competencyId: string) => void;
  handleCompetencyProgressSave: (data: any) => Promise<void>;
  handleCompetencyDelete: (competencyId: string) => Promise<void>;
  handleCompetencySave: (data: any) => Promise<void>;
  // Activity handlers
  handleActivityCreate: (type?: string) => void;
  handleActivityViewDetails: (activityId: string) => void;
  handleActivityEdit: (activityId: string) => void;
  handleActivityDeleteClick: (activityId: string) => void;
  handleOneOnOneSave: (data: any) => Promise<void>;
  handleMentoringSave: (data: any) => Promise<void>;
  handleOneOnOneEditSave: (data: any) => Promise<void>;
  handleSaveActivityEdit: (activityId: string, updates: any) => Promise<void>;
  handleConfirmDeleteActivity: () => Promise<void>;
}

/**
 * Hook para gerenciar todas as ações do PDI Edit
 */
export function usePDIEditActions(
  data: UsePDIEditDataReturn,
  openModal: (type: string, selectedId?: string) => void,
  closeModal: () => void,
  deleteActivityModalState: any,
  setDeleteActivityModalState: (state: any) => void,
  setEditActivityModalState: (state: any) => void,
  modalState: any
): UsePDIEditActionsReturn {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const { triggerXpAnimation } = useXpAnimations();
  const { refreshProfile } = useGamificationProfile();
  const { updateGoalProgress, deleteGoal } = useGoalMutations();

  const {
    subordinate,
    cycle,
    goals,
    competencies,
    activities,
    refreshGoals,
    refreshCompetencies,
    refreshActivities,
  } = data;

  // Goal handlers
  const handleGoalCreate = useCallback(() => {
    console.log("➕ Gestor criando nova meta para subordinado");
    openModal("goalCreator");
  }, [openModal]);

  const handleGoalEdit = useCallback(
    (goalId: string) => {
      console.log("✏️ Gestor editando meta:", goalId);
      openModal("goalCreator", goalId);
    },
    [openModal]
  );

  const handleGoalDelete = useCallback(
    async (goalId: string) => {
      console.log("🗑️ Gestor excluindo meta:", goalId);

      const success = await deleteGoal(goalId);

      if (success) {
        toast({
          type: "success",
          title: "Meta Removida",
          message: `Meta removida do PDI de ${subordinate.name}.`,
        });
        await refreshGoals();
      } else {
        toast({
          type: "error",
          title: "Erro",
          message: "Não foi possível remover a meta.",
        });
      }
    },
    [deleteGoal, subordinate, refreshGoals, toast]
  );

  const handleGoalUpdateClick = useCallback(
    (goalId: string) => {
      console.log("🎯 Gestor atualizando meta do subordinado:", goalId);
      const goal = goals.find((g) => g.id === goalId);
      console.log("📊 Dados da meta encontrada:", goal);
      openModal("goalUpdate", goalId);
    },
    [goals, openModal]
  );

  const handleGoalProgressUpdate = useCallback(
    async (goalId: string, data: any) => {
      try {
        console.log("🎯 handleGoalProgressUpdate chamado:", { goalId, data });

        // Calculate newValue from the progress data
        let newValue: number;

        if (typeof data.newProgress === "number") {
          if (data.goalType === "percentage") {
            newValue = Math.max(0, data.newProgress);
          } else if (
            data.startValue !== undefined &&
            data.targetValue !== undefined
          ) {
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
          throw new Error(
            "Invalid progress data: no valid numeric value found"
          );
        }

        const updatedGoal = await updateGoalProgress(goalId, {
          newValue: Math.round(newValue),
          notes: data.notes || data.description,
        });

        if (updatedGoal) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          await Promise.all([refreshGoals(), refreshProfile()]);

          if (updatedGoal.xpReward && updatedGoal.xpReward > 0) {
            triggerXpAnimation(updatedGoal.xpReward);
          }

          closeModal();

          toast({
            type: "success",
            title: "Meta Atualizada",
            message: `Meta de ${subordinate.name} atualizada com sucesso! +${
              updatedGoal.xpReward || 15
            } XP`,
          });
        } else {
          toast({
            type: "error",
            title: "Erro",
            message: "Não foi possível atualizar a meta.",
          });
        }
      } catch (err: any) {
        console.error("❌ Erro ao atualizar progresso da meta:", err);

        const errorMessage = err?.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(", ")
            : err.response.data.message
          : err?.message || "Não foi possível atualizar a meta.";

        toast({
          type: "error",
          title: "Erro",
          message: errorMessage,
        });
      }
    },
    [
      updateGoalProgress,
      subordinate,
      refreshGoals,
      refreshProfile,
      triggerXpAnimation,
      closeModal,
      toast,
    ]
  );

  const handleGoalEditSave = useCallback(
    async (goalId: string, goalData: any) => {
      try {
        console.log("✏️ Gestor editando meta do subordinado:", {
          goalId,
          subordinate: subordinate.name,
          goalData,
        });

        const { updateGoal } = await import("@/lib/api/endpoints/cycles");

        const typeMapping: Record<string, string> = {
          increase: "INCREASE",
          decrease: "DECREASE",
          percentage: "PERCENTAGE",
          binary: "BINARY",
        };

        const apiType = goalData.type
          ? typeMapping[goalData.type.toLowerCase()]
          : undefined;

        const updateData: any = {
          title: goalData.title,
          description: goalData.description || "",
        };

        if (apiType) {
          updateData.type = apiType;
        }

        if (goalData.successCriterion) {
          if (goalData.successCriterion.startValue !== undefined) {
            updateData.startValue = goalData.successCriterion.startValue;
          }
          if (goalData.successCriterion.targetValue !== undefined) {
            updateData.targetValue = goalData.successCriterion.targetValue;
          }
          if (goalData.successCriterion.unit) {
            updateData.unit = goalData.successCriterion.unit;
          }
        }

        await updateGoal(goalId, updateData);

        toast({
          type: "success",
          title: "Meta Atualizada",
          message: `Meta de ${subordinate.name} foi atualizada com sucesso!`,
        });

        await refreshGoals();
        closeModal();
      } catch (err: any) {
        console.error("❌ Erro ao atualizar meta:", err);

        const errorMessage = err?.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(", ")
            : err.response.data.message
          : "Não foi possível atualizar a meta.";

        toast({
          type: "error",
          title: "Erro ao Atualizar Meta",
          message: errorMessage,
        });
      }
    },
    [subordinate, refreshGoals, closeModal, toast]
  );

  const handleGoalSave = useCallback(
    async (goalData: any) => {
      try {
        // Se modalState.selectedId existe, é edição
        if (modalState.selectedId) {
          return await handleGoalEditSave(modalState.selectedId, goalData);
        }

        console.log("💾 Gestor criando nova meta para subordinado:", {
          subordinate: subordinate.name,
          goalData,
        });

        if (!cycle?.id) {
          toast({
            type: "error",
            title: "Erro",
            message: "Ciclo não encontrado. Não é possível criar a meta.",
          });
          return;
        }

        let workspaceId =
          subordinate?.workspaceId || cycle?.workspaceId || null;

        if (!workspaceId) {
          const userData = localStorage.getItem("user");
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              workspaceId = parsedUser?.workspaceId;
            } catch (e) {
              console.error("Erro ao parsear userData do localStorage:", e);
            }
          }
        }

        if (!workspaceId) {
          toast({
            type: "error",
            title: "Erro de Configuração",
            message:
              "Workspace não identificado. Por favor, recarregue a página e tente novamente.",
          });
          return;
        }

        const { createGoal } = await import("@/lib/api/endpoints/cycles");

        const typeMapping: Record<string, string> = {
          increase: "INCREASE",
          decrease: "DECREASE",
          percentage: "PERCENTAGE",
          binary: "BINARY",
        };

        const apiType =
          typeMapping[goalData.type?.toLowerCase()] || "PERCENTAGE";

        const createData = {
          cycleId: cycle.id,
          userId: subordinate.id,
          workspaceId: workspaceId,
          type: apiType,
          title: goalData.title,
          description: goalData.description || "",
          startValue: goalData.successCriterion?.startValue ?? 0,
          targetValue: goalData.successCriterion?.targetValue ?? 100,
          unit: goalData.successCriterion?.unit || "%",
        };

        await createGoal(createData);

        toast({
          type: "success",
          title: "Meta Criada",
          message: `Nova meta criada no PDI de ${subordinate.name}!`,
        });

        await refreshGoals();
        closeModal();
      } catch (err: any) {
        console.error("❌ Erro ao criar meta:", err);

        const errorMessage = err?.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(", ")
            : err.response.data.message
          : "Não foi possível criar a meta.";

        toast({
          type: "error",
          title: "Erro ao Criar Meta",
          message: errorMessage,
        });
      }
    },
    [
      modalState.selectedId,
      handleGoalEditSave,
      subordinate,
      cycle,
      refreshGoals,
      closeModal,
      toast,
    ]
  );

  // Competency handlers
  const handleCompetencyCreate = useCallback(() => {
    console.log("➕ Gestor criando nova competência para subordinado");
    openModal("competence");
  }, [openModal]);

  const handleCompetencyView = useCallback(
    (competencyId: string) => {
      console.log("👁️ Visualizando competência:", competencyId);
      const competency = competencies.find((c) => c.id === competencyId);
      console.log("📊 Dados da competência encontrada:", competency);
      openModal("competenceUpdate", competencyId);
    },
    [competencies, openModal]
  );

  const handleCompetencyProgressUpdate = useCallback(
    (competencyId: string) => {
      console.log("📈 Atualizando progresso da competência:", competencyId);
      openModal("competenceUpdate", competencyId);
    },
    [openModal]
  );

  const handleCompetencyProgressSave = useCallback(
    async (data: any) => {
      try {
        const { updateCompetencyProgress } = await import(
          "@/lib/api/endpoints/cycles"
        );

        const newLevel = Math.min(
          data.targetLevel,
          Math.floor(data.newProgress / 20) + 1
        );

        const updateData = {
          currentLevel: newLevel,
          notes: `Atualização de progresso: ${data.newProgress}%`,
        };

        await updateCompetencyProgress(data.competenceId, updateData);

        toast({
          type: "success",
          title: "Competência Atualizada",
          message: `Progresso da competência atualizado para ${subordinate.name}!`,
        });

        await refreshCompetencies();
        closeModal();
      } catch (err: any) {
        console.error("❌ Erro ao atualizar competência:", err);

        const errorMessage = err?.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(", ")
            : err.response.data.message
          : "Não foi possível atualizar a competência.";

        toast({
          type: "error",
          title: "Erro ao Atualizar Competência",
          message: errorMessage,
        });
      }
    },
    [subordinate, refreshCompetencies, closeModal, toast]
  );

  const handleCompetencyDelete = useCallback(
    async (competencyId: string) => {
      try {
        const { deleteCompetency } = await import("@/lib/api/endpoints/cycles");
        await deleteCompetency(competencyId);

        toast({
          type: "success",
          title: "Competência Removida",
          message: `Competência removida do PDI de ${subordinate.name}.`,
        });

        await refreshCompetencies();
      } catch (err: any) {
        console.error("❌ Erro ao deletar competência:", err);

        const errorMessage = err?.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(", ")
            : err.response.data.message
          : "Não foi possível deletar a competência.";

        toast({
          type: "error",
          title: "Erro ao Deletar Competência",
          message: errorMessage,
        });
      }
    },
    [subordinate, refreshCompetencies, toast]
  );

  const handleCompetencySave = useCallback(
    async (data: any) => {
      try {
        if (!cycle?.id) {
          toast({
            type: "error",
            title: "Erro",
            message:
              "Ciclo não encontrado. Não é possível criar a competência.",
          });
          return;
        }

        const { createCompetency } = await import("@/lib/api/endpoints/cycles");

        const categoryMapping: Record<string, string> = {
          technical: "TECHNICAL",
          leadership: "LEADERSHIP",
          behavioral: "BEHAVIORAL",
          TECHNICAL: "TECHNICAL",
          LEADERSHIP: "LEADERSHIP",
          BEHAVIORAL: "BEHAVIORAL",
        };

        const apiCategory = categoryMapping[data.category] || "TECHNICAL";

        const createData = {
          cycleId: cycle.id,
          userId: subordinate.id,
          name: data.name,
          category: apiCategory,
          currentLevel: data.initialLevel || 1,
          targetLevel: data.targetLevel,
        };

        await createCompetency(createData);

        toast({
          type: "success",
          title: "Competência Criada",
          message: `Nova competência criada no PDI de ${subordinate.name}!`,
        });

        await refreshCompetencies();
        closeModal();
      } catch (err: any) {
        console.error("❌ Erro ao criar competência:", err);

        const errorMessage = err?.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(", ")
            : err.response.data.message
          : "Não foi possível criar a competência.";

        toast({
          type: "error",
          title: "Erro ao Criar Competência",
          message: errorMessage,
        });
      }
    },
    [cycle, subordinate, refreshCompetencies, closeModal, toast]
  );

  // Activity handlers
  const handleActivityCreate = useCallback(
    (type?: string) => {
      console.log(
        "➕ Gestor registrando nova atividade para subordinado",
        type
      );

      switch (type) {
        case "oneOnOne":
          openModal("oneOnOne");
          toast({
            type: "info",
            title: "Registrar 1:1",
            message: "Abrindo modal de registro de 1:1...",
          });
          break;
        case "mentoring":
          openModal("mentoring");
          toast({
            type: "info",
            title: "Registrar Mentoria",
            message: "Abrindo modal de registro de mentoria...",
          });
          break;
        default:
          toast({
            type: "info",
            title: "Registrar Ação",
            message: "Selecione o tipo de ação a registrar.",
          });
      }
    },
    [openModal, toast]
  );

  const handleActivityViewDetails = useCallback(
    (activityId: string) => {
      console.log("📋 Visualizando detalhes da atividade:", activityId);
      openModal("activityDetails", activityId);
    },
    [openModal]
  );

  const handleActivityEdit = useCallback(
    (activityId: string) => {
      console.log("✏️ Editando atividade:", activityId);

      const activity = activities.find((a) => a.id === activityId);

      if (!activity) {
        toast({
          type: "error",
          title: "Erro",
          message: "Atividade não encontrada.",
        });
        return;
      }

      if (activity.type === "ONE_ON_ONE") {
        const oneOnOneData = activity.oneOnOne;
        const prefillData = {
          participant: oneOnOneData?.participantName || "",
          date: activity.timestamp
            ? new Date(activity.timestamp).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          workingOn: oneOnOneData?.workingOn || [],
          generalNotes: oneOnOneData?.generalNotes || "",
          positivePoints: oneOnOneData?.positivePoints || [],
          improvementPoints: oneOnOneData?.improvementPoints || [],
          nextSteps: oneOnOneData?.nextSteps || [],
        };

        setEditActivityModalState({
          isOpen: true,
          activity: { ...activity, prefillData },
        });
      } else {
        toast({
          type: "info",
          title: "Em Desenvolvimento",
          message:
            "Edição para este tipo de atividade será implementada em breve.",
        });
      }
    },
    [activities, setEditActivityModalState, toast]
  );

  const handleActivityDeleteClick = useCallback(
    (activityId: string) => {
      console.log("🗑️ Iniciando exclusão de atividade:", activityId);

      const activity = activities.find((a) => a.id === activityId);

      if (!activity) {
        toast({
          type: "error",
          title: "Erro",
          message: "Atividade não encontrada.",
        });
        return;
      }

      setDeleteActivityModalState({
        isOpen: true,
        activityId: activity.id,
        activityTitle: activity.title,
        activityType: activity.type,
        xpLoss: activity.xpEarned || 0,
      });
    },
    [activities, setDeleteActivityModalState, toast]
  );

  const handleOneOnOneSave = useCallback(
    async (data: any) => {
      try {
        console.log("💾 Salvando 1:1 do subordinado:", {
          subordinate: subordinate.name,
          subordinateId: subordinate.id,
          cycleId: cycle?.id,
          data,
        });

        if (!cycle?.id) {
          toast({
            type: "error",
            title: "Erro",
            message: "Ciclo não encontrado. Não é possível registrar o 1:1.",
          });
          return;
        }

        const managerId = currentUser?.id;

        if (!managerId) {
          toast({
            type: "error",
            title: "Erro",
            message: "Não foi possível identificar o gestor.",
          });
          return;
        }

        const createData = {
          cycleId: cycle.id,
          userId: subordinate.id,
          type: "ONE_ON_ONE" as const,
          title: `1:1 com ${currentUser?.name || "Gestor"}`,
          description: `Reunião 1:1 em ${data.date}`,
          duration: 45,
          oneOnOneData: {
            participantName: currentUser?.name || "Gestor",
            workingOn: data.workingOn || [],
            generalNotes: data.generalNotes || "",
            positivePoints: data.positivePoints || [],
            improvementPoints: data.improvementPoints || [],
            nextSteps: data.nextSteps || [],
          },
        };

        const { apiClient } = await import("@/lib/api/client");
        await apiClient.post("/activities", createData);

        toast({
          type: "success",
          title: "1:1 Registrado",
          message: `1:1 registrado no PDI de ${subordinate.name}!`,
        });

        await refreshActivities();
        closeModal();
      } catch (err: any) {
        console.error("❌ Erro ao registrar 1:1:", err);

        const errorMessage = err?.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(", ")
            : err.response.data.message
          : "Não foi possível registrar o 1:1.";

        toast({
          type: "error",
          title: "Erro ao Registrar 1:1",
          message: errorMessage,
        });
      }
    },
    [subordinate, cycle, currentUser, refreshActivities, closeModal, toast]
  );

  const handleMentoringSave = useCallback(
    async (data: any) => {
      console.log("💾 Salvando mentoria do subordinado:", data);
      toast({
        type: "success",
        title: "Mentoria Registrada",
        message: `Mentoria registrada no PDI de ${subordinate.name}!`,
      });
      closeModal();
      await refreshActivities();
    },
    [subordinate, refreshActivities, closeModal, toast]
  );

  const handleOneOnOneEditSave = useCallback(async (data: any) => {
    // Implementation será adicionada conforme necessário
    console.log("💾 Salvando edição de 1:1:", data);
  }, []);

  const handleSaveActivityEdit = useCallback(
    async (activityId: string, updates: any) => {
      try {
        const { apiClient } = await import("@/lib/api/client");
        await apiClient.patch(`/activities/${activityId}`, updates);

        toast({
          type: "success",
          title: "Atividade Atualizada",
          message: "As alterações foram salvas com sucesso.",
        });

        setEditActivityModalState({
          isOpen: false,
          activity: null,
        });

        await refreshActivities();
      } catch (err: any) {
        console.error("❌ Erro ao atualizar atividade:", err);

        const errorMessage =
          err?.response?.data?.message ||
          "Não foi possível atualizar a atividade.";

        toast({
          type: "error",
          title: "Erro ao Atualizar",
          message: errorMessage,
        });
      }
    },
    [setEditActivityModalState, refreshActivities, toast]
  );

  const handleConfirmDeleteActivity = useCallback(async () => {
    const { activityId } = deleteActivityModalState;

    if (!activityId) return;

    try {
      const { apiClient } = await import("@/lib/api/client");
      await apiClient.delete(`/activities/${activityId}`);

      toast({
        type: "success",
        title: "Atividade Excluída",
        message: `Atividade removida do PDI de ${subordinate.name}.`,
      });

      setDeleteActivityModalState({
        isOpen: false,
        activityId: null,
        activityTitle: "",
        activityType: "",
        xpLoss: 0,
      });

      closeModal();
      await refreshActivities();
    } catch (err: any) {
      console.error("❌ Erro ao excluir atividade:", err);

      const errorMessage =
        err?.response?.data?.message || "Não foi possível excluir a atividade.";

      toast({
        type: "error",
        title: "Erro ao Excluir",
        message: errorMessage,
      });
    }
  }, [
    deleteActivityModalState,
    subordinate,
    setDeleteActivityModalState,
    closeModal,
    refreshActivities,
    toast,
  ]);

  return {
    handleGoalCreate,
    handleGoalEdit,
    handleGoalDelete,
    handleGoalUpdateClick,
    handleGoalProgressUpdate,
    handleGoalSave,
    handleGoalEditSave,
    handleCompetencyCreate,
    handleCompetencyView,
    handleCompetencyProgressUpdate,
    handleCompetencyProgressSave,
    handleCompetencyDelete,
    handleCompetencySave,
    handleActivityCreate,
    handleActivityViewDetails,
    handleActivityEdit,
    handleActivityDeleteClick,
    handleOneOnOneSave,
    handleMentoringSave,
    handleOneOnOneEditSave,
    handleSaveActivityEdit,
    handleConfirmDeleteActivity,
  };
}
