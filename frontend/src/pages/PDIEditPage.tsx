import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Shield,
  AlertTriangle,
  Plus,
  Activity,
  Target,
  TrendingUp,
  Zap,
  Calendar,
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/features/auth";
import { managementApi } from "@/lib/api/endpoints/management";
import { usersApi } from "@/lib/api/endpoints/users";
import { useModalManager, createModalHelpers } from "@/hooks/useModalManager";
import { useXpAnimations } from "@/components/XpFloating";
import {
  GoalsDashboard,
  CompetenciesSection,
  ActivitiesTimeline,
  useActivitiesTimeline,
  useGoalMutations,
  GoalUpdateRecorder,
  GoalCreatorWizard,
  OneOnOneRecorder,
  MentoringRecorderOptimized,
  CompetenceRecorder,
  CompetenceUpdateRecorder,
  ActivityDetailsModal,
  DeleteActivityModal,
} from "@/features/cycles";
import { useGamificationProfile } from "@/features/cycles/hooks/useGamificationProfile";
/**
 * PDIEditPage - Página dedicada para gestores editarem PDI de subordinados
 *
 * Rota: /users/:userId/pdi/edit
 *
 * Funcionalidades:
 * - Verificação de permissão (manager → subordinado)
 * - Header com contexto gerencial claro
 * - Reutilização dos componentes de /development
 * - Navegação de volta ao perfil
 */
export function PDIEditPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [subordinate, setSubordinate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);

  // Verificar permissão e carregar dados do subordinado
  useEffect(() => {
    const checkPermissionAndLoadUser = async () => {
      if (!userId) {
        toast({
          type: "error",
          title: "Erro de Navegação",
          message: "ID do usuário não fornecido.",
        });
        navigate("/");
        return;
      }

      try {
        setLoading(true);

        // 1. Verificar se é gestor do usuário
        console.log("🔍 Verificando se é gestor do usuário:", userId);
        const isManager = await managementApi.checkIfManaged(userId);

        if (!isManager) {
          console.warn("❌ Acesso negado - não é gestor do usuário:", userId);
          setPermissionChecked(true);
          setHasPermission(false);
          toast({
            type: "error",
            title: "Acesso Negado",
            message: "Você não tem permissão para editar o PDI deste usuário.",
          });
          // Não navegar automaticamente, deixar o usuário ver a mensagem
          return;
        }

        // 2. Buscar dados do subordinado
        console.log(
          "✅ Permissão confirmada, carregando dados do usuário:",
          userId
        );
        const userData = await usersApi.findOne(userId);

        console.log("✅ Dados do subordinado carregados:", userData);

        setSubordinate(userData);
        setHasPermission(true);
        setPermissionChecked(true);
      } catch (error) {
        console.error(
          "❌ Erro ao verificar permissões ou carregar dados:",
          error
        );
        setPermissionChecked(true);
        setHasPermission(false);
        toast({
          type: "error",
          title: "Erro",
          message: "Erro ao carregar dados do subordinado.",
        });
      } finally {
        setLoading(false);
      }
    };

    checkPermissionAndLoadUser();
  }, [userId, navigate, toast]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-8 h-8 bg-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              Verificando permissões e carregando dados...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Permission denied
  if (permissionChecked && !hasPermission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acesso Não Autorizado
            </h2>
            <p className="text-gray-600 mb-6">
              Você não tem permissão para editar o PDI deste usuário. Apenas
              gestores podem editar o PDI de seus subordinados diretos.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Voltar ao Dashboard
              </button>
              {userId && (
                <button
                  onClick={() => navigate(`/users/${userId}/profile`)}
                  className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                >
                  Ver Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - subordinate not found
  if (permissionChecked && hasPermission && !subordinate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Usuário Não Encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              Não foi possível carregar os dados do usuário solicitado.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render edit interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Gerencial */}
        <PDIEditHeader
          subordinate={subordinate}
          onBack={() => navigate(`/users/${userId}/profile`)}
        />

        {/* PDI Content */}
        <PDIEditContent subordinateId={userId!} subordinate={subordinate} />
      </div>
    </div>
  );
}

/**
 * PDIEditContent - Componente que reutiliza os componentes de cycles para edição
 */
function PDIEditContent({
  subordinateId,
  subordinate,
}: {
  subordinateId: string;
  subordinate: any;
}) {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  // Estado para dados do subordinado
  const [cycle, setCycle] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Estado para modal de exclusão de atividade
  const [deleteActivityModalState, setDeleteActivityModalState] = useState<{
    isOpen: boolean;
    activityId: string | null;
    activityTitle: string;
    activityType: string;
    xpLoss: number;
  }>({
    isOpen: false,
    activityId: null,
    activityTitle: "",
    activityType: "",
    xpLoss: 0,
  });

  // Estado para modal de edição de atividade
  const [editActivityModalState, setEditActivityModalState] = useState<{
    isOpen: boolean;
    activity: any | null;
  }>({
    isOpen: false,
    activity: null,
  });

  // Buscar dados do subordinado via API de management
  useEffect(() => {
    async function fetchSubordinateData() {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Buscando dados de PDI do subordinado:", subordinateId);

        // Buscar todos os dados em paralelo
        const [cycleData, goalsData, competenciesData, activitiesData] =
          await Promise.all([
            managementApi.getSubordinateCycle(subordinateId),
            managementApi.getSubordinateGoals(subordinateId),
            managementApi.getSubordinateCompetencies(subordinateId),
            managementApi.getSubordinateActivities(subordinateId),
          ]);

        console.log("✅ Dados do subordinado carregados:", {
          cycle: cycleData,
          goals: goalsData.length,
          competencies: competenciesData.length,
          activities: activitiesData.length,
          cycleWorkspaceId: cycleData?.workspaceId,
        });

        setCycle(cycleData);
        setGoals(goalsData);
        setCompetencies(competenciesData);
        setActivities(activitiesData);
      } catch (err) {
        console.error("❌ Erro ao carregar dados do subordinado:", err);
        setError(err);
        toast({
          type: "error",
          title: "Erro ao Carregar Dados",
          message: "Não foi possível carregar os dados do subordinado.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSubordinateData();
  }, [subordinateId, toast]);

  // Funções de refresh
  const refreshGoals = async () => {
    const goalsData = await managementApi.getSubordinateGoals(subordinateId);
    setGoals(goalsData);
  };

  const refreshCompetencies = async () => {
    const competenciesData = await managementApi.getSubordinateCompetencies(
      subordinateId
    );
    setCompetencies(competenciesData);
  };

  const refreshActivities = async () => {
    const activitiesData = await managementApi.getSubordinateActivities(
      subordinateId
    );
    setActivities(activitiesData);
  };

  // Modal Management
  const { modalState, openModal, closeModal } = useModalManager();

  // Modal Helpers
  const { handleGoalUpdate, handleGoalCreator, handleClose } =
    createModalHelpers(openModal, closeModal);

  // Goal Mutations
  const { updateGoalProgress, deleteGoal } = useGoalMutations();

  // Gamification Profile
  const { refreshProfile } = useGamificationProfile();

  // XP Animations
  const { triggerXpAnimation } = useXpAnimations();

  // Mapear activities do backend para formato da Timeline
  const safeActivities = Array.isArray(activities) ? activities : [];
  const timelineActivities = useActivitiesTimeline(safeActivities);

  // Handlers para ações de edição de metas
  const handleGoalUpdateClick = async (goalId: string) => {
    console.log("🎯 Gestor atualizando meta do subordinado:", goalId);
    const goal = goals.find((g) => g.id === goalId);
    console.log("📊 Dados da meta encontrada:", goal);
    // Abrir modal de atualização de meta
    handleGoalUpdate(goalId);
  };

  const handleGoalCreate = () => {
    console.log("➕ Gestor criando nova meta para subordinado");
    // Abrir modal de criação de meta
    handleGoalCreator();
  };

  const handleGoalEdit = (goalId: string) => {
    console.log("✏️ Gestor editando meta:", goalId);
    // Abrir modal de edição (reutiliza goalCreator mas em modo de edição)
    openModal("goalCreator", goalId);
  };

  const handleGoalDelete = async (goalId: string) => {
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
  };

  // Handler para edição de meta existente
  const handleGoalEditSave = async (goalId: string, goalData: any) => {
    try {
      console.log("✏️ Gestor editando meta do subordinado:", {
        goalId,
        subordinate: subordinate.name,
        goalData,
      });

      // Importar updateGoal
      const { updateGoal } = await import("@/lib/api/endpoints/cycles");

      // Converter tipo para maiúsculas conforme API espera
      const typeMapping: Record<string, string> = {
        increase: "INCREASE",
        decrease: "DECREASE",
        percentage: "PERCENTAGE",
        binary: "BINARY",
      };

      const apiType = goalData.type
        ? typeMapping[goalData.type.toLowerCase()]
        : undefined;

      // Preparar dados de atualização (apenas campos alterados)
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

      console.log("📤 Enviando dados de atualização:", updateData);

      const updatedGoal = await updateGoal(goalId, updateData);

      console.log("✅ Meta atualizada com sucesso:", updatedGoal);

      toast({
        type: "success",
        title: "Meta Atualizada",
        message: `Meta de ${subordinate.name} foi atualizada com sucesso!`,
      });

      // Refresh goals
      await refreshGoals();

      // Close modal
      handleClose();
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
  };

  // Handler para criação de nova meta
  const handleGoalSave = async (goalData: any) => {
    try {
      // Se modalState.selectedId existe, é edição
      if (modalState.selectedId) {
        return await handleGoalEditSave(modalState.selectedId, goalData);
      }

      // Senão, é criação
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

      // Tentar obter workspaceId de múltiplas fontes
      let workspaceId = subordinate?.workspaceId || cycle?.workspaceId || null;

      // Se ainda não tem, buscar do localStorage
      if (!workspaceId) {
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            workspaceId = parsedUser?.workspaceId;
            console.log("📍 WorkspaceId obtido do localStorage:", workspaceId);
          } catch (e) {
            console.error("Erro ao parsear userData do localStorage:", e);
          }
        }
      }

      console.log("🔍 WorkspaceId resolution:", {
        fromSubordinate: subordinate?.workspaceId,
        fromCycle: cycle?.workspaceId,
        fromLocalStorage: workspaceId,
        finalWorkspaceId: workspaceId,
        subordinateData: subordinate,
        cycleData: cycle,
      });

      if (!workspaceId) {
        console.error("❌ WorkspaceId não encontrado em nenhuma fonte");
        toast({
          type: "error",
          title: "Erro de Configuração",
          message:
            "Workspace não identificado. Por favor, recarregue a página e tente novamente.",
        });
        return;
      }

      // Importar createGoal
      const { createGoal } = await import("@/lib/api/endpoints/cycles");

      // Converter tipo para maiúsculas conforme API espera
      const typeMapping: Record<string, string> = {
        increase: "INCREASE",
        decrease: "DECREASE",
        percentage: "PERCENTAGE",
        binary: "BINARY",
      };

      const apiType = typeMapping[goalData.type?.toLowerCase()] || "PERCENTAGE";

      // Preparar dados da meta
      const createData = {
        cycleId: cycle.id,
        userId: subordinateId,
        workspaceId: workspaceId,
        type: apiType,
        title: goalData.title,
        description: goalData.description || "",
        startValue: goalData.successCriterion?.startValue ?? 0,
        targetValue: goalData.successCriterion?.targetValue ?? 100,
        unit: goalData.successCriterion?.unit || "%",
      };

      console.log("📤 Enviando dados de criação:", createData);

      const newGoal = await createGoal(createData);

      console.log("✅ Meta criada com sucesso:", newGoal);

      toast({
        type: "success",
        title: "Meta Criada",
        message: `Nova meta criada no PDI de ${subordinate.name}!`,
      });

      // Refresh goals
      await refreshGoals();

      // Close modal
      handleClose();
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
  };

  // Handler para atualização de progresso de meta (usado pelo modal)
  const handleGoalProgressUpdate = async (goalId: string, data: any) => {
    try {
      console.log("🎯 handleGoalProgressUpdate chamado:", { goalId, data });

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

      console.log("🎯 Gestor atualizando progresso da meta do subordinado:", {
        goalId,
        subordinate: subordinate.name,
        goalType: data.goalType,
        originalData: data,
        calculatedNewValue: newValue,
        notes: data.notes || data.description,
      });

      const updatedGoal = await updateGoalProgress(goalId, {
        newValue: Math.round(newValue),
        notes: data.notes || data.description,
      });

      console.log("✅ Resposta da API updateGoalProgress:", updatedGoal);

      if (updatedGoal) {
        console.log(
          "✅ Meta do subordinado atualizada com sucesso:",
          updatedGoal
        );

        // Small delay to ensure backend transaction is fully committed
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Refresh goals and gamification profile
        await Promise.all([refreshGoals(), refreshProfile()]);

        // Show XP animation
        if (updatedGoal.xpReward && updatedGoal.xpReward > 0) {
          triggerXpAnimation(updatedGoal.xpReward);
        }

        // Close modal
        handleClose();

        // Success toast
        toast({
          type: "success",
          title: "Meta Atualizada",
          message: `Meta de ${subordinate.name} atualizada com sucesso! +${
            updatedGoal.xpReward || 15
          } XP`,
        });
      } else {
        console.error("❌ updateGoalProgress retornou null");
        toast({
          type: "error",
          title: "Erro",
          message: "Não foi possível atualizar a meta.",
        });
      }
    } catch (err: any) {
      console.error("❌ Erro ao atualizar progresso da meta:", err);
      console.error("❌ Stack trace:", err.stack);

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
  };

  // Handlers para competências
  const handleCompetencyCreate = () => {
    console.log("➕ Gestor criando nova competência para subordinado");
    openModal("competence");
  };

  const handleCompetencyView = (competencyId: string) => {
    console.log("👁️ Visualizando competência:", competencyId);
    const competency = competencies.find((c) => c.id === competencyId);
    console.log("📊 Dados da competência encontrada:", competency);

    // Por enquanto, abrir modal de atualização (poderia ser um modal de detalhes dedicado)
    openModal("competenceUpdate", competencyId);
  };

  const handleCompetencyProgressUpdate = async (competencyId: string) => {
    console.log("📈 Atualizando progresso da competência:", competencyId);
    const competency = competencies.find((c) => c.id === competencyId);
    console.log("📊 Dados da competência para atualização:", competency);

    // Abrir modal de atualização
    openModal("competenceUpdate", competencyId);
  };

  const handleCompetencyProgressSave = async (data: any) => {
    try {
      console.log("💾 Salvando progresso da competência:", data);

      // Importar updateCompetencyProgress
      const { updateCompetencyProgress } = await import(
        "@/lib/api/endpoints/cycles"
      );

      // Calcular novo nível baseado no progresso
      const newLevel = Math.min(
        data.targetLevel,
        Math.floor(data.newProgress / 20) + 1
      );

      const updateData = {
        currentLevel: newLevel,
        notes: `Atualização de progresso: ${data.newProgress}%`,
      };

      console.log("📤 Enviando atualização de progresso:", updateData);

      await updateCompetencyProgress(data.competenceId, updateData);

      console.log("✅ Competência atualizada com sucesso");

      toast({
        type: "success",
        title: "Competência Atualizada",
        message: `Progresso da competência atualizado para ${subordinate.name}!`,
      });

      // Refresh competencies
      await refreshCompetencies();

      // Close modal
      handleClose();
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
  };

  const handleCompetencyDelete = async (competencyId: string) => {
    console.log("🗑️ Removendo competência:", competencyId);

    try {
      // Importar deleteCompetency
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
  };

  // Handlers para atividades
  const handleActivityCreate = (type?: string) => {
    console.log("➕ Gestor registrando nova atividade para subordinado", type);

    // Abrir modal específico baseado no tipo
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
  };

  const handleActivityViewDetails = (activityId: string) => {
    console.log("📋 Visualizando detalhes da atividade:", activityId);
    openModal("activityDetails", activityId);
  };

  const handleActivityEdit = (activityId: string) => {
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

    console.log("📋 Atividade encontrada:", activity);

    // Abrir modal de edição usando os recorders existentes
    if (activity.type === "ONE_ON_ONE") {
      // Preparar dados para prefill do OneOnOneRecorder
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

      console.log("📝 Dados de prefill:", prefillData);

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
  };

  const handleSaveActivityEdit = async (activityId: string, updates: any) => {
    try {
      console.log("💾 Salvando alterações da atividade:", activityId, updates);

      const { apiClient } = await import("@/lib/api/client");
      await apiClient.patch(`/activities/${activityId}`, updates);

      console.log("✅ Atividade atualizada com sucesso");

      toast({
        type: "success",
        title: "Atividade Atualizada",
        message: "As alterações foram salvas com sucesso.",
      });

      // Fechar modal
      setEditActivityModalState({
        isOpen: false,
        activity: null,
      });

      // Refresh activities
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
  };

  // Wrapper para converter dados do OneOnOneRecorder para formato de update
  const handleOneOnOneEditSave = async (data: any) => {
    const activityId = editActivityModalState.activity?.id;
    if (!activityId) return;

    const updates = {
      title: `1:1 com ${data.participant}`,
      description: data.generalNotes,
      oneOnOneData: {
        participantName: data.participant,
        workingOn: data.workingOn,
        generalNotes: data.generalNotes,
        positivePoints: data.positivePoints,
        improvementPoints: data.improvementPoints,
        nextSteps: data.nextSteps,
      },
    };

    await handleSaveActivityEdit(activityId, updates);
  };

  const handleCancelActivityEdit = () => {
    setEditActivityModalState({
      isOpen: false,
      activity: null,
    });
  };

  // Handlers para exclusão de atividade
  const handleActivityDeleteClick = (activityId: string) => {
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

    // Abrir modal de confirmação
    setDeleteActivityModalState({
      isOpen: true,
      activityId: activity.id,
      activityTitle: activity.title,
      activityType: activity.type,
      xpLoss: activity.xpEarned || 0,
    });
  };

  const handleConfirmDeleteActivity = async () => {
    const { activityId } = deleteActivityModalState;

    if (!activityId) return;

    try {
      console.log("🗑️ Excluindo atividade:", activityId);

      // Importar função de exclusão
      const { apiClient } = await import("@/lib/api/client");
      await apiClient.delete(`/activities/${activityId}`);

      console.log("✅ Atividade excluída com sucesso");

      toast({
        type: "success",
        title: "Atividade Excluída",
        message: `Atividade removida do PDI de ${subordinate.name}.`,
      });

      // Fechar modal
      setDeleteActivityModalState({
        isOpen: false,
        activityId: null,
        activityTitle: "",
        activityType: "",
        xpLoss: 0,
      });

      // Fechar modal de detalhes se estiver aberto
      handleClose();

      // Refresh activities
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
  };

  const handleCancelDeleteActivity = () => {
    setDeleteActivityModalState({
      isOpen: false,
      activityId: null,
      activityTitle: "",
      activityType: "",
      xpLoss: 0,
    });
  };

  // Handlers para salvar atividades
  const handleOneOnOneSave = async (data: any) => {
    try {
      console.log("💾 Salvando 1:1 do subordinado:", {
        subordinate: subordinate.name,
        subordinateId,
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

      // Obter ID do gestor atual (você) via useAuth
      const managerId = currentUser?.id;

      console.log("👤 Gestor atual:", {
        currentUser,
        managerId,
        subordinateId,
        cycleId: cycle.id,
      });

      if (!managerId) {
        console.error("❌ Não foi possível obter managerId do currentUser");
        toast({
          type: "error",
          title: "Erro",
          message: "Não foi possível identificar o gestor.",
        });
        return;
      }

      // Preparar dados do 1:1 no formato CreateActivityDto
      // IMPORTANTE:
      // - cycleId: ciclo do SUBORDINADO (onde o 1:1 será registrado)
      // - userId: ID do SUBORDINADO (dono do PDI)
      // - oneOnOneData.participantName: nome do GESTOR (quem participou do 1:1)
      const createData = {
        cycleId: cycle.id,
        userId: subordinateId, // ID do subordinado (dono do PDI)
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

      console.log(
        "📤 Enviando dados do 1:1 (para ciclo do subordinado):",
        createData
      );

      // Chamar API diretamente
      const { apiClient } = await import("@/lib/api/client");
      const response = await apiClient.post("/activities", createData);
      const newActivity = response.data;

      console.log(
        "✅ 1:1 registrado com sucesso no PDI do subordinado:",
        newActivity
      );

      toast({
        type: "success",
        title: "1:1 Registrado",
        message: `1:1 registrado no PDI de ${subordinate.name}!`,
      });

      // Refresh activities
      await refreshActivities();

      // Close modal
      handleClose();
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
  };

  const handleMentoringSave = async (data: any) => {
    console.log("💾 Salvando mentoria do subordinado:", data);
    toast({
      type: "success",
      title: "Mentoria Registrada",
      message: `Mentoria registrada no PDI de ${subordinate.name}!`,
    });
    handleClose();
    await refreshActivities();
  };

  // Handler para salvar competência
  const handleCompetencySave = async (data: any) => {
    try {
      console.log("💾 Criando competência para subordinado:", {
        subordinate: subordinate.name,
        data,
      });

      if (!cycle?.id) {
        toast({
          type: "error",
          title: "Erro",
          message: "Ciclo não encontrado. Não é possível criar a competência.",
        });
        return;
      }

      // Importar createCompetency
      const { createCompetency } = await import("@/lib/api/endpoints/cycles");

      // Mapear categoria para uppercase (backend aceita apenas TECHNICAL, LEADERSHIP, BEHAVIORAL)
      const categoryMapping: Record<string, string> = {
        technical: "TECHNICAL",
        leadership: "LEADERSHIP",
        behavioral: "BEHAVIORAL",
        TECHNICAL: "TECHNICAL",
        LEADERSHIP: "LEADERSHIP",
        BEHAVIORAL: "BEHAVIORAL",
      };

      const apiCategory = categoryMapping[data.category] || "TECHNICAL";

      // Preparar dados da competência (backend NÃO aceita description)
      const createData = {
        cycleId: cycle.id,
        userId: subordinateId,
        name: data.name,
        category: apiCategory,
        currentLevel: data.initialLevel || 1, // CompetenceRecorder usa initialLevel
        targetLevel: data.targetLevel,
      };

      console.log("📤 Enviando dados de criação da competência:", createData);

      const newCompetency = await createCompetency(createData);

      console.log("✅ Competência criada com sucesso:", newCompetency);

      toast({
        type: "success",
        title: "Competência Criada",
        message: `Nova competência criada no PDI de ${subordinate.name}!`,
      });

      // Refresh competencies
      await refreshCompetencies();

      // Close modal
      handleClose();
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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-8 h-8 bg-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando PDI do subordinado...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Erro ao Carregar PDI
          </h3>
          <p className="text-gray-600">
            Não foi possível carregar os dados do PDI de {subordinate.name}.
          </p>
        </div>
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum Ciclo Ativo
          </h3>
          <p className="text-gray-600">
            {subordinate.name} não possui um ciclo de desenvolvimento ativo no
            momento.
          </p>
        </div>
      </div>
    );
  }

  // Adaptar dados do usuário para o CycleHeroSection
  const adaptedUser = {
    id: subordinateId,
    name: subordinate.name,
    initials: subordinate.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
    avatar: subordinate.avatar || "professional-1",
    currentStreak: 0,
    totalXP: subordinate.totalXP || 0,
    level: subordinate.currentLevel || 1,
    currentXP: subordinate.currentXP || 0,
    nextLevelXP: subordinate.nextLevelXP || 100,
  };

  const adaptedCycle = {
    name: cycle.name || "Ciclo de Desenvolvimento",
    progress: 50, // TODO: calcular progresso real
    xpCurrent: subordinate.currentXP || 0,
    xpNextLevel: subordinate.nextLevelXP || 100,
    currentLevel: subordinate.currentLevel || 1,
    streak: 5, // TODO: implementar streak real
    daysRemaining: 45, // TODO: calcular dias restantes
    totalXP: subordinate.totalXP || 0,
  };

  return (
    <div className="space-y-8">
      {/* Hero Section - Melhorado */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-purple-50 to-blue-50 rounded-2xl shadow-lg border border-brand-200">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white">
                <span className="text-white text-3xl font-bold">
                  {adaptedUser.initials}
                </span>
              </div>
              {/* Level Badge */}
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-white">
                Lvl {adaptedCycle.currentLevel}
              </div>
            </div>

            {/* Info Principal */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {adaptedUser.name}
              </h2>
              <p className="text-gray-600 text-lg mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-600" />
                {adaptedCycle.name}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {/* Total XP */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-brand-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      Total XP
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {adaptedCycle.totalXP.toLocaleString()}
                  </div>
                </div>

                {/* Progresso */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      Progresso
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(
                      (adaptedCycle.xpCurrent / adaptedCycle.xpNextLevel) * 100
                    )}
                    %
                  </div>
                </div>

                {/* Metas */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      Metas
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {goals.length}
                  </div>
                </div>

                {/* Dias Restantes */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      Dias
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {adaptedCycle.daysRemaining}
                  </div>
                </div>
              </div>

              {/* Progress Bar para próximo nível */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>
                    Progresso para Level {adaptedCycle.currentLevel + 1}
                  </span>
                  <span className="font-semibold">
                    {adaptedCycle.xpCurrent} / {adaptedCycle.xpNextLevel} XP
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-blue-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min(
                        (adaptedCycle.xpCurrent / adaptedCycle.xpNextLevel) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Dashboard */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-emerald-600" />
            </div>
            Objetivos de Desenvolvimento
          </h3>
          <button
            onClick={handleGoalCreate}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nova Meta
          </button>
        </div>
        <GoalsDashboard
          goals={goals}
          onUpdateGoal={handleGoalUpdateClick}
          onEditGoal={handleGoalEdit}
          onDeleteGoal={handleGoalDelete}
          onCreateGoal={handleGoalCreate}
        />
      </section>

      {/* Competencies Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-purple-600" />
            </div>
            Competências Desenvolvidas
          </h3>
          <button
            onClick={handleCompetencyCreate}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nova Competência
          </button>
        </div>
        <CompetenciesSection
          competencies={competencies}
          onViewCompetency={handleCompetencyView}
          onUpdateProgress={handleCompetencyProgressUpdate}
          onDeleteCompetency={handleCompetencyDelete}
          onCreateCompetency={handleCompetencyCreate}
        />
      </section>

      {/* Activities Timeline */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-blue-600" />
            </div>
            Histórico de Atividades
          </h3>
          <button
            onClick={() => handleActivityCreate("oneOnOne")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm font-medium"
          >
            <Activity className="w-4 h-4" />
            Registrar 1:1
          </button>
        </div>
        <ActivitiesTimeline
          activities={timelineActivities}
          onViewDetails={handleActivityViewDetails}
          onEditActivity={handleActivityEdit}
          onDeleteActivity={handleActivityDeleteClick}
        />
      </section>

      {/* Goal Update Modal */}
      {modalState.type === "goalUpdate" &&
        modalState.selectedId &&
        (() => {
          const selectedGoal = goals.find(
            (g) => g.id === modalState.selectedId
          );

          if (!selectedGoal) {
            console.warn(
              "⚠️ Meta não encontrada para ID:",
              modalState.selectedId
            );
            return null;
          }

          console.log("📋 Renderizando GoalUpdateRecorder com dados:", {
            id: selectedGoal.id,
            title: selectedGoal.title,
            type: selectedGoal.type,
            progress: selectedGoal.progress,
            currentValue: selectedGoal.currentValue,
            targetValue: selectedGoal.targetValue,
            startValue: selectedGoal.startValue,
          });

          // Calcular currentProgress se não estiver disponível
          const currentProgress =
            selectedGoal.progress ??
            (selectedGoal.currentValue !== undefined &&
            selectedGoal.targetValue !== undefined &&
            selectedGoal.startValue !== undefined
              ? Math.round(
                  ((selectedGoal.currentValue - selectedGoal.startValue) /
                    (selectedGoal.targetValue - selectedGoal.startValue)) *
                    100
                )
              : 0);

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
                currentProgress: currentProgress,
                currentValue: selectedGoal.currentValue,
                targetValue: selectedGoal.targetValue,
                startValue: selectedGoal.startValue,
                unit: selectedGoal.unit,
              }}
            />
          );
        })()}

      {/* Goal Creator/Editor Modal */}
      {modalState.type === "goalCreator" &&
        (() => {
          // Se tem selectedId, é modo de edição
          const isEditing = !!modalState.selectedId;
          const selectedGoal = isEditing
            ? goals.find((g) => g.id === modalState.selectedId)
            : null;

          // Preparar dados pré-preenchidos para edição
          const prefillData = selectedGoal
            ? {
                title: selectedGoal.title,
                description: selectedGoal.description || "",
                type: selectedGoal.type?.toLowerCase() as any,
                successCriterion: {
                  type: selectedGoal.type?.toLowerCase() as any,
                  startValue:
                    selectedGoal.initialValue || selectedGoal.startValue,
                  currentValue: selectedGoal.currentValue,
                  targetValue: selectedGoal.targetValue,
                  unit: selectedGoal.unit,
                },
              }
            : undefined;

          return (
            <GoalCreatorWizard
              isOpen={true}
              onClose={handleClose}
              onSave={handleGoalSave}
              prefillData={prefillData}
              isEditing={isEditing}
            />
          );
        })()}

      {/* One-on-One Modal */}
      {modalState.type === "oneOnOne" && (
        <OneOnOneRecorder
          isOpen={true}
          onClose={handleClose}
          onSave={handleOneOnOneSave}
          prefillData={{ participant: subordinate.name }}
        />
      )}

      {/* Mentoring Modal */}
      {modalState.type === "mentoring" && (
        <MentoringRecorderOptimized
          isOpen={true}
          onClose={handleClose}
          onSave={handleMentoringSave}
        />
      )}

      {/* Competence Modal */}
      {modalState.type === "competence" && (
        <CompetenceRecorder
          isOpen={true}
          onClose={handleClose}
          onSave={handleCompetencySave}
        />
      )}

      {/* Competence Update Modal */}
      {modalState.type === "competenceUpdate" &&
        modalState.selectedId &&
        (() => {
          const selectedCompetency = competencies.find(
            (c) => c.id === modalState.selectedId
          );

          if (!selectedCompetency) {
            console.warn(
              "⚠️ Competência não encontrada para ID:",
              modalState.selectedId
            );
            return null;
          }

          console.log(
            "📋 Renderizando CompetenceUpdateRecorder com dados:",
            selectedCompetency
          );

          // Normalizar categoria para lowercase
          const normalizedCategory =
            selectedCompetency.category.toLowerCase() as
              | "leadership"
              | "technical"
              | "behavioral";

          return (
            <CompetenceUpdateRecorder
              isOpen={true}
              onClose={handleClose}
              onSave={handleCompetencyProgressSave}
              competence={{
                id: selectedCompetency.id,
                name: selectedCompetency.name,
                category: normalizedCategory,
                currentLevel: selectedCompetency.currentLevel,
                targetLevel: selectedCompetency.targetLevel,
                currentProgress: selectedCompetency.currentProgress,
                nextMilestone: `Nível ${selectedCompetency.targetLevel}`,
              }}
            />
          );
        })()}

      {/* Activity Details Modal */}
      {modalState.type === "activityDetails" && modalState.selectedId && (
        <ActivityDetailsModal
          isOpen={true}
          onClose={handleClose}
          activity={
            timelineActivities.find((a) => a.id === modalState.selectedId) ||
            null
          }
          onDelete={handleActivityDeleteClick}
        />
      )}

      {/* Delete Activity Confirmation Modal */}
      <DeleteActivityModal
        isOpen={deleteActivityModalState.isOpen}
        activityTitle={deleteActivityModalState.activityTitle}
        activityType={deleteActivityModalState.activityType}
        xpLoss={deleteActivityModalState.xpLoss}
        onConfirm={handleConfirmDeleteActivity}
        onCancel={handleCancelDeleteActivity}
      />

      {/* Edit Activity Modal - Usa OneOnOneRecorder para edição */}
      {editActivityModalState.isOpen &&
        editActivityModalState.activity &&
        editActivityModalState.activity.type === "ONE_ON_ONE" && (
          <OneOnOneRecorder
            isOpen={true}
            onClose={handleCancelActivityEdit}
            onSave={handleOneOnOneEditSave}
            prefillData={editActivityModalState.activity.prefillData}
          />
        )}
    </div>
  );
}

/**
 * Header específico para a página de edição de PDI
 */
function PDIEditHeader({
  subordinate,
  onBack,
}: {
  subordinate: any;
  onBack: () => void;
}) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Edit3 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800 tracking-tight">
              Editando PDI - {subordinate?.name}
            </h1>
            <p className="text-green-700">
              Gerencie o Plano de Desenvolvimento Individual do seu subordinado
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>
    </div>
  );
}
