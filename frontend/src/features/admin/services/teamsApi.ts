import { api } from "@/lib/apiClient";
import type {
  TeamSummary,
  TeamDetail,
  CreateTeamInput,
  AddTeamMemberInput,
  UpdateTeamMemberRoleInput,
  TeamMetrics,
} from "../types";

export const teamsApi = {
  async list(): Promise<TeamSummary[]> {
    return api<TeamSummary[]>("/teams", { auth: true });
  },
  async metrics(): Promise<TeamMetrics> {
    return api<TeamMetrics>("/teams/metrics", { auth: true });
  },
  async get(id: number): Promise<TeamDetail> {
    return api<TeamDetail>(`/teams/${id}`, { auth: true });
  },
  async create(input: CreateTeamInput): Promise<TeamDetail> {
    return api<TeamDetail>("/teams", {
      method: "POST",
      body: JSON.stringify(input),
      auth: true,
    });
  },
  async update(
    id: number,
    input: Partial<CreateTeamInput>
  ): Promise<TeamDetail> {
    return api<TeamDetail>(`/teams/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
      auth: true,
    });
  },
  async delete(id: number): Promise<{ deleted: boolean }> {
    return api<{ deleted: boolean }>(`/teams/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
  async addMember(input: AddTeamMemberInput): Promise<TeamDetail> {
    return api<TeamDetail>("/teams/add-member", {
      method: "POST",
      body: JSON.stringify(input),
      auth: true,
    });
  },
  async updateMemberRole(
    input: UpdateTeamMemberRoleInput
  ): Promise<TeamDetail> {
    return api<TeamDetail>("/teams/update-member-role", {
      method: "POST",
      body: JSON.stringify(input),
      auth: true,
    });
  },
  async removeMember(teamId: number, userId: number): Promise<TeamDetail> {
    return api<TeamDetail>("/teams/remove-member", {
      method: "POST",
      body: JSON.stringify({ teamId, userId }),
      auth: true,
    });
  },
};
