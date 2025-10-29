import { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";

export interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  isManager: boolean;
}

/**
 * Hook to fetch all users in the workspace, sorted with managers first
 */
export function useWorkspaceUsers() {
  const [users, setUsers] = useState<WorkspaceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const allUsers = await adminApi.listUsers();

        if (!active) return;

        // Map users and determine if they are managers
        const mappedUsers: WorkspaceUser[] = allUsers.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          isManager: (user.reports && user.reports.length > 0) || false,
        }));

        // Sort: managers first, then alphabetically by name
        const sortedUsers = mappedUsers.sort((a, b) => {
          if (a.isManager && !b.isManager) return -1;
          if (!a.isManager && b.isManager) return 1;
          return a.name.localeCompare(b.name);
        });

        setUsers(sortedUsers);
      } catch (e: any) {
        if (!active) return;
        setError(e.message || "Erro ao carregar usuários");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { users, loading, error };
}
