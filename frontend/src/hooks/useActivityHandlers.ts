import { useToast } from "../components/Toast";
import { useActivityMutations } from "../features/cycles/hooks";
import { useXpAnimations } from "../components/XpFloating";

export function useActivityHandlers(
  cycle: any,
  user: any,
  refreshActivities: () => Promise<void>,
  handleClose: () => void
) {
  const toast = useToast();
  const { triggerXpAnimation } = useXpAnimations();
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
      const activity = await createOneOnOne({
        cycleId: cycle.id,
        participantId: user.id,
        title: `1:1 com ${data.participant}`,
        description: `Reunião 1:1 em ${data.date}`,
        meetingDate: data.date,
        topics: data.workingOn || [],
        actionItems: data.nextSteps || [],
      });

      if (activity) {
        await refreshActivities();

        // Debug: log da atividade retornada
        console.log("🎯 Activity created:", activity);

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

  return {
    handleOneOnOneCreate,
    handleMentoringCreate,
    handleCertificationCreate,
  };
}
