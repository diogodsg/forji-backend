import { useState, useEffect, useCallback } from "react";
import { managementApi } from "../services/managementApi";
import type {
  ManagementRule,
  SubordinateInfo,
  CreateManagementRuleDto,
} from "../types";

interface UseAdminManagementRulesOptions {
  managerId?: number; // Se especificado, busca regras de um manager específico
}

export function useAdminManagementRules(
  options: UseAdminManagementRulesOptions = {}
) {
  const { managerId } = options;
  const [rules, setRules] = useState<ManagementRule[]>([]);
  const [subordinates, setSubordinates] = useState<SubordinateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Carregar regras (específicas do manager ou todas)
      const rulesData = await managementApi.adminGetRules(managerId);
      setRules(rulesData);

      // Se temos um managerId específico, carregar subordinados
      if (managerId) {
        const subordinatesData = await managementApi.adminGetSubordinates(
          managerId
        );
        setSubordinates(subordinatesData);
      } else {
        setSubordinates([]);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados de gerenciamento");
    } finally {
      setLoading(false);
    }
  }, [managerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createRule = async (
    rule: CreateManagementRuleDto,
    targetManagerId?: number
  ) => {
    try {
      setError(null);
      const actualManagerId = targetManagerId || managerId;

      if (!actualManagerId) {
        throw new Error("Manager ID is required");
      }

      await managementApi.adminCreateRule(actualManagerId, rule);
      await loadData(); // Recarregar dados
    } catch (err: any) {
      setError(err.message || "Erro ao criar regra");
      throw err;
    }
  };

  const removeRule = async (ruleId: number) => {
    try {
      setError(null);
      await managementApi.adminRemoveRule(ruleId);
      await loadData(); // Recarregar dados
    } catch (err: any) {
      setError(err.message || "Erro ao remover regra");
      throw err;
    }
  };

  return {
    rules,
    subordinates,
    loading,
    error,
    createRule,
    removeRule,
    reload: loadData,
  };
}
