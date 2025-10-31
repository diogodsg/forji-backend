import { useState, useEffect, useCallback } from "react";
import { managementApi } from "@/lib/api/endpoints/management";
import { usersApi } from "@/lib/api/endpoints/users";

export interface UsePDIEditDataReturn {
  // Data states
  subordinate: any;
  cycle: any;
  goals: any[];
  competencies: any[];
  activities: any[];
  // Loading states
  loading: boolean;
  hasPermission: boolean;
  permissionChecked: boolean;
  error: any;
  // Refresh functions
  refreshGoals: () => Promise<void>;
  refreshCompetencies: () => Promise<void>;
  refreshActivities: () => Promise<void>;
}

/**
 * Hook para gerenciar dados do PDI Edit
 */
export function usePDIEditData(userId: string): UsePDIEditDataReturn {
  // Estados de dados
  const [subordinate, setSubordinate] = useState<any>(null);
  const [cycle, setCycle] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  // Estados de loading e permissão
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [error, setError] = useState<any>(null);

  // Verificar permissão e carregar dados do subordinado
  useEffect(() => {
    const checkPermissionAndLoadUser = async () => {
      try {
        setLoading(true);

        // 1. Verificar se é gestor do usuário
        console.log("🔍 Verificando se é gestor do usuário:", userId);
        const isManager = await managementApi.checkIfManaged(userId);

        if (!isManager.isManaged) {
          console.warn("❌ Acesso negado - não é gestor do usuário:", userId);
          setPermissionChecked(true);
          setHasPermission(false);
          setLoading(false); // Apenas desliga loading se não tem permissão
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
        // NÃO desligar loading aqui - deixar para o segundo useEffect
      } catch (error) {
        console.error(
          "❌ Erro ao verificar permissões ou carregar dados:",
          error
        );
        setPermissionChecked(true);
        setHasPermission(false);
        setError(error);
        setLoading(false); // Apenas desliga loading em caso de erro
      }
    };

    if (userId) {
      checkPermissionAndLoadUser();
    }
  }, [userId]);

  // Buscar dados do PDI do subordinado
  useEffect(() => {
    async function fetchSubordinateData() {
      if (!hasPermission || !userId) return;

      try {
        // Não ligar loading novamente aqui - já está ligado do primeiro useEffect
        setError(null);

        console.log("🔄 Buscando dados de PDI do subordinado:", userId);

        // Buscar todos os dados em paralelo
        const [cycleData, goalsData, competenciesData, activitiesData] =
          await Promise.all([
            managementApi.getSubordinateCycle(userId),
            managementApi.getSubordinateGoals(userId),
            managementApi.getSubordinateCompetencies(userId),
            managementApi.getSubordinateActivities(userId),
          ]);

        console.log("✅ Dados do subordinado carregados:", {
          cycle: cycleData,
          goals: goalsData.length,
          competencies: competenciesData.length,
          activities: activitiesData.length,
        });

        setCycle(cycleData);
        setGoals(goalsData);
        setCompetencies(competenciesData);
        setActivities(activitiesData);
      } catch (err) {
        console.error("❌ Erro ao carregar dados do subordinado:", err);
        setError(err);
      } finally {
        setLoading(false); // Agora sim desliga o loading
      }
    }

    fetchSubordinateData();
  }, [hasPermission, userId]);

  // Funções de refresh
  const refreshGoals = useCallback(async () => {
    if (!userId) return;
    const goalsData = await managementApi.getSubordinateGoals(userId);
    setGoals(goalsData);
  }, [userId]);

  const refreshCompetencies = useCallback(async () => {
    if (!userId) return;
    const competenciesData = await managementApi.getSubordinateCompetencies(
      userId
    );
    setCompetencies(competenciesData);
  }, [userId]);

  const refreshActivities = useCallback(async () => {
    if (!userId) return;
    const activitiesData = await managementApi.getSubordinateActivities(userId);
    setActivities(activitiesData);
  }, [userId]);

  return {
    subordinate,
    cycle,
    goals,
    competencies,
    activities,
    loading,
    hasPermission,
    permissionChecked,
    error,
    refreshGoals,
    refreshCompetencies,
    refreshActivities,
  };
}
