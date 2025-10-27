import { useToast } from "../components/Toast";
import { useCompetencyMutations } from "../features/cycles/hooks";
import { useXpAnimations } from "../components/XpFloating";
import { useCelebrations } from "./useCelebrations";

export function useCompetencyHandlers(
  cycle: any,
  refreshCompetencies: () => Promise<void>,
  handleClose: () => void
) {
  const toast = useToast();
  const { triggerXpAnimation } = useXpAnimations();
  const { triggerLevelUp } = useCelebrations();
  const { createCompetency, updateCompetencyProgress } =
    useCompetencyMutations();

  // ==========================================
  // CREATE HANDLER
  // ==========================================
  const handleCompetencyCreate = async (data: any) => {
    if (!cycle) {
      toast.error("Nenhum ciclo ativo encontrado");
      return;
    }

    try {
      // Mapear categoria para o backend
      const categoryMapping: Record<
        string,
        "TECHNICAL" | "BEHAVIORAL" | "LEADERSHIP"
      > = {
        technical: "TECHNICAL",
        behavioral: "BEHAVIORAL",
        leadership: "LEADERSHIP",
        business: "TECHNICAL", // fallback
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
  // PROGRESS UPDATE HANDLER
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

  return {
    handleCompetencyCreate,
    handleCompetencyProgressUpdate,
  };
}
