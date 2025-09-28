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
  async removeRule(ruleId: number): Promise<void> {
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
  async checkSubordinate(userId: number): Promise<{ isSubordinate: boolean }> {
    return api<{ isSubordinate: boolean }>(
      `/management/subordinates/${userId}/check`,
      { auth: true }
    );
  },

  // Obter detalhes sobre por que alguém é subordinado
  async getSubordinateSource(userId: number): Promise<any[]> {
    return api<any[]>(`/management/subordinates/${userId}/source`, {
      auth: true,
    });
  },

  // ============ ADMIN FUNCTIONS ============

  // Admin: Criar regra para qualquer usuário
  async adminCreateRule(
    managerId: number,
    rule: CreateManagementRuleDto
  ): Promise<ManagementRule> {
    return api<ManagementRule>("/management/admin/rules", {
      method: "POST",
      body: JSON.stringify({ ...rule, managerId }),
      headers: { "Content-Type": "application/json" },
      auth: true,
    });
  },

  // Admin: Listar regras de qualquer usuário ou todas as regras
  async adminGetRules(managerId?: number): Promise<ManagementRule[]> {
    const params = managerId ? `?managerId=${managerId}` : "";
    return api<ManagementRule[]>(`/management/admin/rules${params}`, {
      auth: true,
    });
  },

  // Admin: Remover qualquer regra
  async adminRemoveRule(ruleId: number): Promise<void> {
    await api(`/management/admin/rules/${ruleId}`, {
      method: "DELETE",
      auth: true,
    });
  },

  // Admin: Listar subordinados de qualquer usuário
  async adminGetSubordinates(managerId: number): Promise<SubordinateInfo[]> {
    return api<SubordinateInfo[]>(
      `/management/admin/subordinates?managerId=${managerId}`,
      { auth: true }
    );
  },
};
