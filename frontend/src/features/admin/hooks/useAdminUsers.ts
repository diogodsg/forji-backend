import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { adminApi } from "../services/adminApi";
import type { AdminUser, CreateAdminUserInput } from "../types";

interface UseAdminUsersResult {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: CreateAdminUserInput) => Promise<void>;
  setGithub: (id: number, gh: string | null) => Promise<void>;
  toggleAdmin: (id: number, next: boolean) => Promise<void>;
  removeUser: (id: number) => Promise<void>;
  addManager: (userId: number, managerId: number) => Promise<void>;
  removeManager: (userId: number, managerId: number) => Promise<void>;
  busy: {
    creating: boolean;
    deleting: Set<number>;
    togglingAdmin: Set<number>;
    updatingGithub: Set<number>;
    managerChange: Set<number>;
  };
}

export function useAdminUsers(): UseAdminUsersResult {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const deleting = useRef(new Set<number>());
  const togglingAdmin = useRef(new Set<number>());
  const updatingGithub = useRef(new Set<number>());
  const managerChange = useRef(new Set<number>());
  const [, force] = useState(0);

  const mark = (
    setRef: React.MutableRefObject<Set<number>>,
    id: number,
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
      setError(e.message || "Falha ao carregar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateAdminUserInput) => {
      setCreating(true);
      try {
        await adminApi.createUser(input);
        await refresh();
      } finally {
        setCreating(false);
      }
    },
    [refresh]
  );

  const setGithub = useCallback(
    async (id: number, gh: string | null) => {
      mark(updatingGithub, id, true);
      try {
        await adminApi.setGithubId(id, gh);
        await refresh();
      } finally {
        mark(updatingGithub, id, false);
      }
    },
    [refresh]
  );

  const toggleAdmin = useCallback(
    async (id: number, next: boolean) => {
      mark(togglingAdmin, id, true);
      try {
        await adminApi.toggleAdmin(id, next);
        await refresh();
      } finally {
        mark(togglingAdmin, id, false);
      }
    },
    [refresh]
  );

  const removeUser = useCallback(
    async (id: number) => {
      mark(deleting, id, true);
      try {
        await adminApi.deleteUser(id);
        await refresh();
      } finally {
        mark(deleting, id, false);
      }
    },
    [refresh]
  );

  const addManager = useCallback(
    async (userId: number, managerId: number) => {
      mark(managerChange, userId, true);
      try {
        await adminApi.setManager(userId, managerId);
        await refresh();
      } finally {
        mark(managerChange, userId, false);
      }
    },
    [refresh]
  );

  const removeManager = useCallback(
    async (userId: number, managerId: number) => {
      mark(managerChange, userId, true);
      try {
        await adminApi.removeManager(userId, managerId);
        await refresh();
      } finally {
        mark(managerChange, userId, false);
      }
    },
    [refresh]
  );

  const busy = useMemo(
    () => ({
      creating,
      deleting: deleting.current,
      togglingAdmin: togglingAdmin.current,
      updatingGithub: updatingGithub.current,
      managerChange: managerChange.current,
    }),
    [creating]
  );

  return {
    users,
    loading,
    error,
    refresh,
    create,
    setGithub,
    toggleAdmin,
    removeUser,
    addManager,
    removeManager,
    busy,
  };
}
