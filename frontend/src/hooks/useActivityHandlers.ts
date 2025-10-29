import { useToast } from "../components/Toast";
import { useActivityMutations } from "../features/cycles/hooks";
import { useGamificationContext } from "../features/gamification/context/GamificationContext";

export function useActivityHandlers(
  cycle: any,
  user: any,
  refreshActivities: () => Promise<void>,
  handleClose: () => void
) {
  const toast = useToast();
  const { processActivityResponse } = useGamificationContext();
  const { createOneOnOne, createMentoring, createCertification } =
    useActivityMutations();

  // ==========================================
  // ONE ON ONE HANDLER
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
      // 🚀 CORRIGIDO: Usar nova estrutura de dados do backend
      const activity = await createOneOnOne({
        cycleId: cycle.id,
        userId: user.id,
        type: "ONE_ON_ONE",
        title: `1:1 com ${data.participant}`,
        description: `Reunião 1:1 em ${data.date}`,
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

        // 🎯 Usar função centralizada para processar resposta da atividade
        // Isso vai automaticamente decidir se triggera XP ou level-up
        processActivityResponse(activity);

        // Debug: log da atividade retornada
        console.log("🎯 Activity created:", activity);

        // Toast baseado no que aconteceu
        if (activity.leveledUp) {
          toast.success(
            `Level Up! Você subiu para o nível ${activity.newLevel}! 🎉`,
            "1:1 Criado + Level Up!",
            4000
          );
        } else {
          toast.success(
            `+${activity.xpEarned || 0} XP ganho! Reunião 1:1 registrada 👥`,
            "1:1 Criado",
            3500
          );
        }

        handleClose();
      }
    } catch (err) {
      console.error("Erro ao criar 1:1:", err);
      toast.error("Erro ao criar 1:1. Tente novamente.");
    }
  };

  // ==========================================
  // MENTORING HANDLER
  // ==========================================
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

        // 🎯 Usar função centralizada para processar resposta da atividade
        processActivityResponse(activity);

        // Toast baseado no que aconteceu
        if (activity.leveledUp) {
          toast.success(
            `Level Up! Você subiu para o nível ${activity.newLevel}! 🎉`,
            "Mentoria Criada + Level Up!",
            4000
          );
        } else {
          toast.success(
            `+${activity.xpEarned} XP ganho! Sessão de mentoria registrada 🎓`,
            "Mentoria Criada",
            3500
          );
        }

        handleClose();
      }
    } catch (err) {
      toast.error("Erro ao criar mentoria. Tente novamente.");
    }
  };

  // ==========================================
  // CERTIFICATION HANDLER
  // ==========================================
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

        // 🎯 Usar função centralizada para processar resposta da atividade
        processActivityResponse(activity);

        // Toast baseado no que aconteceu
        if (activity.leveledUp) {
          toast.success(
            `Level Up! Você subiu para o nível ${activity.newLevel}! 🎉`,
            "Certificação Criada + Level Up!",
            4000
          );
        } else {
          toast.success(
            `+${activity.xpEarned} XP ganho! Certificação registrada 🏆`,
            "Certificação Criada",
            4000
          );
        }

        handleClose();
      }
    } catch (err) {
      toast.error("Erro ao criar certificação. Tente novamente.");
    }
  };

  return {
    handleOneOnOneCreate,
    handleMentoringCreate,
    handleCertificationCreate,
  };
}
