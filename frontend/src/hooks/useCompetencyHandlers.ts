import { useToast } from "../components/Toast";
import { useCompetencyMutations } from "../features/cycles/hooks";
import { useGamificationContext } from "../features/gamification/context/GamificationContext";
import { deleteCompetency } from "../lib/api/endpoints/cycles";

// Limite de competências por ciclo
const MAX_COMPETENCIES_PER_CYCLE = 5;

interface Competency {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
}

export function useCompetencyHandlers(
  cycle: any,
  competencies: Competency[],
  refreshCompetencies: () => Promise<void>,
  handleClose: () => void
) {
  const toast = useToast();
  const { processActivityResponse } = useGamificationContext();
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

    // Validar limite de competências
    if (competencies.length >= MAX_COMPETENCIES_PER_CYCLE) {
      toast.warning(
        `O ciclo já possui o máximo de ${MAX_COMPETENCIES_PER_CYCLE} competências permitidas.`,
        "Limite Atingido"
      );
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
        // 🎯 Usar função centralizada para processar resposta (XP e level-up)
        processActivityResponse(competency);

        // Refresh competencies ANTES de fechar modal
        await refreshCompetencies();

        // Toast baseado no que aconteceu
        if (competency.leveledUp) {
          toast.success(
            `Level Up! Você subiu para o nível ${competency.newLevel}! 🎉`,
            "Competência Criada + Level Up!",
            4000
          );
        } else {
          toast.success(
            `+${
              competency.xpEarned || competency.xpReward || 0
            } XP ganho! Competência "${data.name}" registrada 🎯`,
            "Competência Criada",
            4000
          );
        }
        // Não chamar handleClose aqui - deixar o modal fazer isso após onSave
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
        progressPercentage: data.newProgress, // ✅ Enviar o progresso percentual (0-100)
        notes: data.notes || data.description || "",
      });

      if (updatedCompetency) {
        await refreshCompetencies();

        // 🎯 Usar função centralizada para processar resposta (XP e level-up)
        // Processar sempre que houver XP, level-up ou profile atualizado
        if (
          updatedCompetency.xpEarned ||
          updatedCompetency.leveledUp ||
          updatedCompetency.profile
        ) {
          console.log(
            "🔄 Processando resposta de atualização de competência:",
            updatedCompetency
          );
          processActivityResponse(updatedCompetency);
        }

        const levelUp =
          updatedCompetency.currentLevel > (data.currentLevel || 0);

        // Toast baseado se houve level-up ou apenas progresso
        if (updatedCompetency.leveledUp || levelUp) {
          toast.success(
            `Level Up! Você subiu para o nível ${
              updatedCompetency.newLevel || updatedCompetency.currentLevel
            }! 🎉`,
            "Progresso + Level Up!",
            4000
          );
        } else if (
          updatedCompetency.xpEarned &&
          updatedCompetency.xpEarned > 0
        ) {
          toast.success(
            `+${updatedCompetency.xpEarned} XP ganho! Continue evoluindo 📈`,
            "Progresso Atualizado",
            4000
          );
        } else {
          // Caso não tenha ganho XP (progresso sem mudança)
          toast.success(
            "Progresso atualizado com sucesso!",
            "Competência Atualizada",
            3000
          );
        }
        handleClose();
      }
    } catch (err) {
      toast.error("Erro ao atualizar competência. Tente novamente.");
    }
  };

  // ==========================================
  // DELETE HANDLER
  // ==========================================
  const handleCompetencyDelete = async (
    competencyId: string
  ): Promise<void> => {
    try {
      console.log(
        "🗑️ useCompetencyHandlers: Deletando competência:",
        competencyId
      );

      const response = await deleteCompetency(competencyId);

      await refreshCompetencies();

      // 🎯 Processar resposta de XP revertido e atualizar perfil
      if (response?.profile) {
        console.log(
          "🔄 Perfil de gamificação atualizado após deletar competência"
        );
        processActivityResponse(response);
      }

      const xpReverted = response?.xpReverted || 0;
      const message =
        xpReverted > 0
          ? `Competência removida (-${xpReverted} XP revertido)`
          : "Competência removida com sucesso";

      toast.success(message, "Competência Removida");
    } catch (err: any) {
      console.error("❌ Erro ao deletar competência:", err);

      const errorMessage = err?.response?.data?.message
        ? Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message
        : "Não foi possível deletar a competência.";

      toast.error(errorMessage, "Erro ao Deletar Competência");
    }
  };

  return {
    handleCompetencyCreate,
    handleCompetencyProgressUpdate,
    handleCompetencyDelete,
  };
}
