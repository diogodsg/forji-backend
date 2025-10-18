import { api } from "@/lib/apiClient";
import type {
  ManagementRule,
  SubordinateInfo,
  CreateManagementRuleDto,
} from "../types";

export const managementApi = {
  // Criar uma nova regra de gerenciamento
  async createRule(rule: CreateManagementRuleDto): Promise<ManagementRule> {
    return api<ManagementRule>("/management/rules", {
      method: "POST",
      body: JSON.stringify(rule),
      headers: { "Content-Type": "application/json" },
      auth: true,
    });
  },

  // Listar todas as regras do gerente atual
  async getMyRules(): Promise<ManagementRule[]> {
    return api<ManagementRule[]>("/management/rules", { auth: true });
  },

  // Remover uma regra
  async removeRule(ruleId: string): Promise<void> {
    await api(`/management/rules/${ruleId}`, {
      method: "DELETE",
      auth: true,
    });
  },

  // Obter todos os subordinados efetivos
  async getMySubordinates(): Promise<SubordinateInfo[]> {
    return api<SubordinateInfo[]>("/management/subordinates", { auth: true });
  },

  // Verificar se alguém é subordinado
  async checkSubordinate(userId: string): Promise<{ isSubordinate: boolean }> {
    return api<{ isSubordinate: boolean }>(
      `/management/subordinates/${userId}/check`,
      { auth: true }
    );
  },

  // Obter detalhes sobre por que alguém é subordinado
  async getSubordinateSource(userId: string): Promise<any[]> {
    return api<any[]>(`/management/subordinates/${userId}/source`, {
      auth: true,
    });
  },

  // ============ ADMIN FUNCTIONS ============

  // Admin: Criar regra para qualquer usuário
  async adminCreateRule(
    managerId: string,
    rule: CreateManagementRuleDto
  ): Promise<ManagementRule> {
    // Se managerId já está no rule, use-o; caso contrário, use o parâmetro
    const finalRule = rule.managerId ? rule : { ...rule, managerId };

    return api<ManagementRule>("/management/rules", {
      method: "POST",
      body: JSON.stringify(finalRule),
      headers: { "Content-Type": "application/json" },
      auth: true,
    });
  },

  // Admin: Listar regras de qualquer usuário ou todas as regras
  async adminGetRules(managerId?: string): Promise<ManagementRule[]> {
    const params = managerId ? `?managerId=${managerId}` : "";
    return api<ManagementRule[]>(`/management/rules${params}`, {
      auth: true,
    });
  },

  // Admin: Remover qualquer regra
  async adminRemoveRule(ruleId: string): Promise<void> {
    await api(`/management/rules/${ruleId}`, {
      method: "DELETE",
      auth: true,
    });
  },

  // Admin: Listar subordinados de qualquer usuário
  async adminGetSubordinates(managerId: string): Promise<SubordinateInfo[]> {
    return api<SubordinateInfo[]>(
      `/management/subordinates?managerId=${managerId}`,
      { auth: true }
    );
  },
};
