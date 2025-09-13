import { api } from "../../../lib/apiClient";
import type { UserRow } from "../../../features/admin";

// Service layer centralizing admin-related API calls.
// Keeps Admin UI components thin and facilitates future caching or React Query integration.

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  githubId?: string;
}

export const adminApi = {
  async listUsers(): Promise<UserRow[]> {
    return api<UserRow[]>("/auth/users", { auth: true });
  },
  async createUser(input: CreateUserInput): Promise<void> {
    await api("/auth/admin/create-user", {
      method: "POST",
      body: JSON.stringify(input),
      auth: true,
    });
  },
  async setGithubId(userId: number, githubId: string | null): Promise<void> {
    await api("/auth/admin/set-github-id", {
      method: "POST",
      body: JSON.stringify({ userId, githubId }),
      auth: true,
    });
  },
  async toggleAdmin(userId: number, isAdmin: boolean): Promise<void> {
    await api("/auth/admin/set-admin", {
      method: "POST",
      body: JSON.stringify({ userId, isAdmin }),
      auth: true,
    });
  },
  async deleteUser(userId: number): Promise<void> {
    await api("/auth/admin/delete-user", {
      method: "POST",
      body: JSON.stringify({ userId }),
      auth: true,
    });
  },
  async setManager(userId: number, managerId: number): Promise<void> {
    await api("/auth/admin/set-manager", {
      method: "POST",
      body: JSON.stringify({ userId, managerId }),
      auth: true,
    });
  },
  async removeManager(userId: number, managerId: number): Promise<void> {
    await api("/auth/admin/remove-manager", {
      method: "POST",
      body: JSON.stringify({ userId, managerId }),
      auth: true,
    });
  },
};
