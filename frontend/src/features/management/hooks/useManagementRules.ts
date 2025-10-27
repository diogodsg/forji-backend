import { useState, useEffect } from "react";
import { managementApi } from "../services/managementApi";
import type {
  ManagementRule,
  SubordinateInfo,
  CreateManagementRuleDto,
} from "../types";

export function useManagementRules() {
  const [rules, setRules] = useState<ManagementRule[]>([]);
  const [subordinates, setSubordinates] = useState<SubordinateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar regras e subordinados
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rulesData, subordinatesData] = await Promise.all([
        managementApi.getMyRules(),
        managementApi.getMySubordinates(),
      ]);
      setRules(rulesData);
      setSubordinates(subordinatesData);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  // Criar uma nova regra
  const createRule = async (rule: CreateManagementRuleDto) => {
    try {
      setError(null);
      await managementApi.createRule(rule);
      await loadData(); // Recarregar dados
    } catch (err: any) {
      setError(err.message || "Erro ao criar regra");
      throw err;
    }
  };

  // Remover uma regra
  const removeRule = async (ruleId: string) => {
    try {
      setError(null);
      await managementApi.removeRule(ruleId);
      await loadData(); // Recarregar dados
    } catch (err: any) {
      setError(err.message || "Erro ao remover regra");
      throw err;
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadData();
  }, []);

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
