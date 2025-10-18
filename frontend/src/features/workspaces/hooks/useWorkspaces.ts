import { useState, useCallback } from "react";
import { workspacesApi, extractErrorMessage } from "@/lib/api";
import { useToast } from "@/components/Toast";
import type {
  Workspace,
  WorkspaceMember,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  InviteToWorkspaceDto,
} from "@/lib/api";

/**
 * Hook para gerenciar workspaces
 *
 * Funções disponíveis:
 * - fetchWorkspaces() - Lista workspaces do usuário
 * - createWorkspace() - Cria novo workspace
 * - updateWorkspace() - Atualiza workspace
 * - deleteWorkspace() - Arquiva workspace
 * - fetchMembers() - Lista membros
 * - inviteMember() - Convida membro
 * - removeMember() - Remove membro
 * - leaveWorkspace() - Sai do workspace
 */
export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  /**
   * Lista todos workspaces do usuário
   */
  const fetchWorkspaces = useCallback(async () => {
    setLoading(true);
    try {
      const data = await workspacesApi.getUserWorkspaces();
      setWorkspaces(data);
      return data;
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      toast.error(errorMsg, "Erro ao carregar workspaces");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Cria novo workspace
   */
  const createWorkspace = useCallback(
    async (dto: CreateWorkspaceDto) => {
      setLoading(true);
      try {
        const newWorkspace = await workspacesApi.createWorkspace(dto);
        setWorkspaces((prev) => [...prev, newWorkspace]);
        toast.success(
          `Workspace "${newWorkspace.name}" criado com sucesso!`,
          "Workspace criado"
        );
        return newWorkspace;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao criar workspace");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Obtém detalhes de um workspace
   */
  const fetchWorkspace = useCallback(
    async (workspaceId: string) => {
      setLoading(true);
      try {
        const data = await workspacesApi.getWorkspace(workspaceId);
        setCurrentWorkspace(data);
        return data;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao carregar workspace");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Atualiza workspace
   */
  const updateWorkspace = useCallback(
    async (workspaceId: string, dto: UpdateWorkspaceDto) => {
      setLoading(true);
      try {
        const updated = await workspacesApi.updateWorkspace(workspaceId, dto);
        setWorkspaces((prev) =>
          prev.map((w) => (w.id === workspaceId ? updated : w))
        );
        if (currentWorkspace?.id === workspaceId) {
          setCurrentWorkspace(updated);
        }
        toast.success("Workspace atualizado com sucesso!");
        return updated;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao atualizar workspace");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentWorkspace?.id, toast]
  );

  /**
   * Arquiva workspace (soft delete)
   */
  const deleteWorkspace = useCallback(
    async (workspaceId: string) => {
      setLoading(true);
      try {
        await workspacesApi.deleteWorkspace(workspaceId);
        setWorkspaces((prev) => prev.filter((w) => w.id !== workspaceId));
        if (currentWorkspace?.id === workspaceId) {
          setCurrentWorkspace(null);
        }
        toast.success("Workspace arquivado com sucesso!");
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao arquivar workspace");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentWorkspace?.id, toast]
  );

  /**
   * Lista membros do workspace
   */
  const fetchMembers = useCallback(
    async (workspaceId: string) => {
      setLoading(true);
      try {
        const data = await workspacesApi.getWorkspaceMembers(workspaceId);
        setMembers(data);
        return data;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao carregar membros");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Convida usuário para workspace
   */
  const inviteMember = useCallback(
    async (workspaceId: string, dto: InviteToWorkspaceDto) => {
      setLoading(true);
      try {
        const newMember = await workspacesApi.inviteToWorkspace(
          workspaceId,
          dto
        );
        setMembers((prev) => [...prev, newMember]);
        toast.success(`Convite enviado para ${dto.email}`, "Membro convidado");
        return newMember;
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao convidar membro");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Remove membro do workspace
   */
  const removeMember = useCallback(
    async (workspaceId: string, userId: string) => {
      setLoading(true);
      try {
        await workspacesApi.removeMember(workspaceId, userId);
        setMembers((prev) => prev.filter((m) => m.userId !== userId));
        toast.success("Membro removido do workspace");
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao remover membro");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Sai do workspace
   */
  const leaveWorkspace = useCallback(
    async (workspaceId: string) => {
      setLoading(true);
      try {
        await workspacesApi.leaveWorkspace(workspaceId);
        setWorkspaces((prev) => prev.filter((w) => w.id !== workspaceId));
        if (currentWorkspace?.id === workspaceId) {
          setCurrentWorkspace(null);
        }
        toast.info("Você saiu do workspace");
      } catch (error) {
        const errorMsg = extractErrorMessage(error);
        toast.error(errorMsg, "Erro ao sair do workspace");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentWorkspace?.id, toast]
  );

  return {
    // Estado
    workspaces,
    currentWorkspace,
    members,
    loading,

    // Ações
    fetchWorkspaces,
    createWorkspace,
    fetchWorkspace,
    updateWorkspace,
    deleteWorkspace,
    fetchMembers,
    inviteMember,
    removeMember,
    leaveWorkspace,
  };
}
