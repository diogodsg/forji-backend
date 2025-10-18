import { useState, useCallback } from "react";
import { usersApi, extractErrorMessage } from "@/lib/api";
import { useToast } from "@/components/Toast";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UpdatePasswordDto,
  ListUsersParams,
} from "@/lib/api";

/**
 * Hook para gerenciar usuários
 *
 * Funções disponíveis:
 * - fetchUsers() - Lista usuários com paginação
 * - searchUsers() - Busca usuários por query
 * - createUser() - Cria novo usuário (admin)
 * - fetchUser() - Detalhes de um usuário
 * - updateUser() - Atualiza perfil
 * - updatePassword() - Atualiza senha
 * - removeUser() - Remove usuário (soft delete)
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  /**
   * Lista usuários com paginação
   */
  const fetchUsers = useCallback(
    async (params: ListUsersParams = {}) => {
      setLoading(true);
      try {
        const response = await usersApi.findAll(params);
        setUsers(response.data);
        setPagination(response.meta);
        return response;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao carregar usuários");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Busca usuários por query (nome ou email)
   */
  const searchUsers = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setUsers([]);
        return [];
      }

      setLoading(true);
      try {
        const results = await usersApi.search(query);
        setUsers(results);
        return results;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro na busca");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Cria novo usuário (apenas admin)
   */
  const createUser = useCallback(
    async (dto: CreateUserDto) => {
      setLoading(true);
      try {
        const newUser = await usersApi.create(dto);
        setUsers((prev) => [newUser, ...prev]);
        toast.success(
          `Usuário "${newUser.name}" criado com sucesso!`,
          "Usuário criado"
        );
        return newUser;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao criar usuário");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Obtém detalhes de um usuário
   */
  const fetchUser = useCallback(
    async (userId: string) => {
      setLoading(true);
      try {
        const user = await usersApi.findOne(userId);
        setCurrentUser(user);
        return user;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao carregar usuário");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Atualiza perfil do usuário
   */
  const updateUser = useCallback(
    async (userId: string, dto: UpdateUserDto) => {
      setLoading(true);
      try {
        const updated = await usersApi.update(userId, dto);
        setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
        if (currentUser?.id === userId) {
          setCurrentUser(updated);
        }
        toast.success("Perfil atualizado com sucesso!");
        return updated;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao atualizar perfil");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser?.id, toast]
  );

  /**
   * Atualiza senha do usuário
   */
  const updatePassword = useCallback(
    async (userId: string, dto: UpdatePasswordDto) => {
      setLoading(true);
      try {
        const response = await usersApi.updatePassword(userId, dto);
        toast.success("Senha atualizada com sucesso!", "Segurança");
        return response;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao atualizar senha");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Remove usuário (soft delete)
   */
  const removeUser = useCallback(
    async (userId: string) => {
      setLoading(true);
      try {
        await usersApi.remove(userId);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        if (currentUser?.id === userId) {
          setCurrentUser(null);
        }
        toast.success("Usuário removido com sucesso");
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao remover usuário");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser?.id, toast]
  );

  /**
   * Limpa a busca
   */
  const clearSearch = useCallback(() => {
    setUsers([]);
  }, []);

  return {
    // Estado
    users,
    pagination,
    currentUser,
    loading,

    // Ações
    fetchUsers,
    searchUsers,
    createUser,
    fetchUser,
    updateUser,
    updatePassword,
    removeUser,
    clearSearch,
  };
}
