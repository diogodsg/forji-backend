import { api } from "@/lib/apiClient";
import type { AdminUser, CreateAdminUserInput } from "../types";
import type {
  UpdateProfileDto,
  UserProfile,
} from "@/features/settings/types/settings";

export const adminApi = {
  async listUsers(): Promise<AdminUser[]> {
    return api<AdminUser[]>("/auth/users", { auth: true });
  },
  async createUser(
    input: CreateAdminUserInput
  ): Promise<{ id: number; generatedPassword: string }> {
    return api<{ id: number; generatedPassword: string }>(
      "/auth/admin/create-user",
      {
        method: "POST",
        body: JSON.stringify(input),
        auth: true,
      }
    );
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
  async changePassword(
    userId: number,
    newPassword?: string
  ): Promise<{ success: boolean; generatedPassword?: string }> {
    return api<{ success: boolean; generatedPassword?: string }>(
      "/auth/admin/change-password",
      {
        method: "POST",
        body: JSON.stringify({ userId, newPassword }),
        auth: true,
      }
    );
  },
  async updateProfile(
    userId: number,
    data: UpdateProfileDto
  ): Promise<UserProfile> {
    return api<UserProfile>(`/auth/admin/update-profile/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      auth: true,
    });
  },
};
