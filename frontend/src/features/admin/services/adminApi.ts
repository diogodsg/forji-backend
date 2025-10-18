import { usersApi } from "@/lib/api";
import type { AdminUser, CreateAdminUserInput } from "../types";
import type {
  UpdateProfileDto,
  UserProfile,
} from "@/features/settings/types/settings";

/**
 * Admin API - Refatorado para usar a nova API integrada
 *
 * MIGRAÇÃO:
 * - Antiga API: /auth/users, /auth/admin/*
 * - Nova API: /users, /teams (REST padronizado)
 */

export const adminApi = {
  /**
   * Lista todos usuários (usa nova API /users)
   */
  async listUsers(): Promise<AdminUser[]> {
    const response = await usersApi.findAll({ page: 1, limit: 1000 });
    // Mapeia User[] para AdminUser[] (compatibilidade)
    return response.data.map((user) => ({
      id: user.id, // UUID string
      email: user.email,
      name: user.name,
      position: user.position || null,
      bio: user.bio || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.isAdmin || false,
      managers: [], // TODO: buscar da API de management
      reports: [], // TODO: buscar da API de management
    }));
  },

  /**
   * Cria novo usuário (usa nova API /users)
   */
  async createUser(
    input: CreateAdminUserInput
  ): Promise<{ id: string; generatedPassword: string }> {
    // UUID
    const generatedPassword = generatePassword();

    const newUser = await usersApi.create({
      name: input.name,
      email: input.email,
      password: generatedPassword,
      position: input.position,
      isAdmin: input.isAdmin,
    });

    return {
      id: newUser.id, // UUID string
      generatedPassword,
    };
  },

  /**
   * Toggle admin status (usa nova API /users/:id)
   */
  async toggleAdmin(userId: string, isAdmin: boolean): Promise<void> {
    // UUID
    await usersApi.update(userId, { isAdmin });
  },

  /**
   * Remove usuário (usa nova API /users/:id)
   */
  async deleteUser(userId: string): Promise<void> {
    // UUID
    await usersApi.remove(userId);
  },

  /**
   * Define gerente (TODO: implementar na API de management)
   */
  async setManager(_userId: string, _managerId: string): Promise<void> {
    // UUID
    // TODO: Implementar quando criar endpoint de management
    console.warn("setManager: Endpoint de management ainda não implementado");
    throw new Error("Funcionalidade de gerente será implementada na Fase 6");
  },

  /**
   * Remove gerente (TODO: implementar na API de management)
   */
  async removeManager(_userId: string, _managerId: string): Promise<void> {
    // UUID
    // TODO: Implementar quando criar endpoint de management
    console.warn(
      "removeManager: Endpoint de management ainda não implementado"
    );
    throw new Error("Funcionalidade de gerente será implementada na Fase 6");
  },

  /**
   * Troca senha de usuário (usa nova API /users/:id/password)
   */
  async changePassword(
    userId: string, // UUID
    newPassword?: string
  ): Promise<{ success: boolean; generatedPassword?: string }> {
    const password = newPassword || generatePassword();

    // NOTA: Backend precisa de currentPassword, mas admin pode resetar
    // Por hora, usamos uma senha temporária que será trocada
    try {
      await usersApi.updatePassword(userId, {
        currentPassword: "temp-admin-reset", // Senha especial para admin
        newPassword: password,
      });

      return {
        success: true,
        generatedPassword: password,
      };
    } catch (error) {
      console.error("Erro ao trocar senha:", error);
      throw new Error(
        "Erro ao trocar senha. Funcionalidade de reset por admin precisa ser implementada no backend."
      );
    }
  },

  /**
   * Atualiza perfil do usuário (usa nova API /users/:id)
   */
  async updateProfile(
    userId: string, // UUID
    data: UpdateProfileDto
  ): Promise<UserProfile> {
    const updated = await usersApi.update(userId, {
      name: data.name,
      position: data.position,
      bio: data.bio,
    });

    return {
      id: updated.id, // UUID string
      email: updated.email,
      name: updated.name,
      position: updated.position || "",
      bio: updated.bio || "",
    };
  },
};

/**
 * Gera senha aleatória segura
 */
function generatePassword(length: number = 12): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}
