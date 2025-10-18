import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { adminApi } from "../services/adminApi";
import type { AdminUser, CreateAdminUserInput } from "../types";
import { useToast } from "@/components/Toast";
import { extractErrorMessage } from "@/lib/api/client";

interface UseAdminUsersResult {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (
    input: CreateAdminUserInput
  ) => Promise<{ id: string; generatedPassword: string }>; // UUID
  toggleAdmin: (id: string, next: boolean) => Promise<void>; // UUID
  removeUser: (id: string) => Promise<void>; // UUID
  addManager: (userId: string, managerId: string) => Promise<void>; // UUID
  removeManager: (userId: string, managerId: string) => Promise<void>; // UUID
  changePassword: (
    userId: string, // UUID
    newPassword?: string
  ) => Promise<{ success: boolean; generatedPassword?: string }>;
  busy: {
    creating: boolean;
    deleting: Set<string>; // UUID
    togglingAdmin: Set<string>; // UUID
    managerChange: Set<string>; // UUID
    changingPassword: Set<string>; // UUID
  };
}

export function useAdminUsers(): UseAdminUsersResult {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const deleting = useRef(new Set<string>()); // UUID
  const togglingAdmin = useRef(new Set<string>()); // UUID
  const managerChange = useRef(new Set<string>()); // UUID
  const changingPassword = useRef(new Set<string>()); // UUID
  const [, force] = useState(0);
  const toast = useToast();

  const mark = (
    setRef: React.MutableRefObject<Set<string>>,
    id: string, // UUID
    add: boolean
  ) => {
    if (add) setRef.current.add(id);
    else setRef.current.delete(id);
    force((x) => x + 1);
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.listUsers();
      setUsers(data);
    } catch (e: any) {
      const message = extractErrorMessage(e);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateAdminUserInput) => {
      setCreating(true);
      try {
        const result = await adminApi.createUser(input);
        await refresh();
        toast.success(`Usuário ${input.name} criado com sucesso!`);
        return result;
      } catch (e) {
        const message = extractErrorMessage(e);
        toast.error(message);
        throw e;
      } finally {
        setCreating(false);
      }
    },
    [refresh, toast]
  );

  const toggleAdmin = useCallback(
    async (id: string, next: boolean) => {
      // UUID
      mark(togglingAdmin, id, true);
      try {
        await adminApi.toggleAdmin(id, next);
        await refresh();
        toast.success(
          next
            ? "Permissões de admin concedidas"
            : "Permissões de admin removidas"
        );
      } catch (e) {
        const message = extractErrorMessage(e);
        toast.error(message);
        throw e;
      } finally {
        mark(togglingAdmin, id, false);
      }
    },
    [refresh, toast]
  );

  const removeUser = useCallback(
    async (id: string) => {
      // UUID
      mark(deleting, id, true);
      try {
        await adminApi.deleteUser(id);
        await refresh();
        toast.success("Usuário removido com sucesso");
      } catch (e) {
        const message = extractErrorMessage(e);
        toast.error(message);
        throw e;
      } finally {
        mark(deleting, id, false);
      }
    },
    [refresh, toast]
  );

  const addManager = useCallback(
    async (userId: string, managerId: string) => {
      // UUID
      mark(managerChange, userId, true);
      try {
        await adminApi.setManager(userId, managerId);
        await refresh();
        toast.success("Gestor adicionado com sucesso");
      } catch (e) {
        const message = extractErrorMessage(e);
        toast.error(message);
        throw e;
      } finally {
        mark(managerChange, userId, false);
      }
    },
    [refresh, toast]
  );

  const removeManager = useCallback(
    async (userId: string, managerId: string) => {
      // UUID
      mark(managerChange, userId, true);
      try {
        await adminApi.removeManager(userId, managerId);
        await refresh();
        toast.success("Gestor removido com sucesso");
      } catch (e) {
        const message = extractErrorMessage(e);
        toast.error(message);
        throw e;
      } finally {
        mark(managerChange, userId, false);
      }
    },
    [refresh, toast]
  );

  const changePassword = useCallback(
    async (userId: string, newPassword?: string) => {
      // UUID
      mark(changingPassword, userId, true);
      try {
        const result = await adminApi.changePassword(userId, newPassword);
        toast.success("Senha alterada com sucesso");
        return result;
      } catch (e) {
        const message = extractErrorMessage(e);
        toast.error(message);
        throw e;
      } finally {
        mark(changingPassword, userId, false);
      }
    },
    [toast]
  );

  const busy = useMemo(
    () => ({
      creating,
      deleting: deleting.current,
      togglingAdmin: togglingAdmin.current,
      managerChange: managerChange.current,
      changingPassword: changingPassword.current,
    }),
    [creating]
  );

  return {
    users,
    loading,
    error,
    refresh,
    create,
    toggleAdmin,
    removeUser,
    addManager,
    removeManager,
    changePassword,
    busy,
  };
}
