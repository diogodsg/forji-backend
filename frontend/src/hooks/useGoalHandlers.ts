import { useState } from "react";
import { useToast } from "../components/Toast";
import { useGoalMutations } from "../features/cycles/hooks";
import { useXpAnimations } from "../components/XpFloating";

interface Goal {
  id: string;
  title: string;
  description: string;
  type: string;
  progress: number;
  currentValue: number;
  targetValue: number;
  startValue: number;
  unit: string;
  deadline?: string;
  updatedAt: string;
}

interface DeleteModalState {
  isOpen: boolean;
  goalId: string | null;
  goalTitle: string;
  xpLoss: number;
}

interface EditModalState {
  isOpen: boolean;
  goalData: any | null;
}

export function useGoalHandlers(
  cycle: any,
  user: any,
  refreshGoals: () => Promise<void>,
  refreshGamificationProfile: () => void,
  handleClose: () => void
) {
  const toast = useToast();
  const { triggerXpAnimation } = useXpAnimations();
  const { createGoal, updateGoal, updateGoalProgress, deleteGoal } =
    useGoalMutations();

  // Delete Modal State
  const [deleteModalState, setDeleteModalState] = useState<DeleteModalState>({
    isOpen: false,
    goalId: null,
    goalTitle: "",
    xpLoss: 0,
  });

  // Edit Modal State
  const [editModalState, setEditModalState] = useState<EditModalState>({
    isOpen: false,
    goalData: null,
  });

  // ==========================================
  // CREATE HANDLER
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
  // DELETE HANDLERS
  // ==========================================
  const handleGoalDelete = (goalId: string, goals: Goal[]) => {
    const goal = goals.find((g) => g.id === goalId);
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
  // EDIT HANDLERS
  // ==========================================
  const handleGoalEdit = (goalId: string, goals: Goal[]) => {
    const goal = goals.find((g) => g.id === goalId);
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
  // PROGRESS UPDATE HANDLER
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

  return {
    // States
    deleteModalState,
    editModalState,

    // Handlers
    handleGoalCreate,
    handleGoalDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleGoalEdit,
    handleGoalEditSave,
    handleCancelEdit,
    handleGoalProgressUpdate,
  };
}
