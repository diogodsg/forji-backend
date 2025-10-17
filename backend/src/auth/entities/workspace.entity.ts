import { Workspace, WorkspaceMember, WorkspaceRole } from '@prisma/client';

/**
 * Workspace entity type (Prisma already returns camelCase with @map)
 */
export type WorkspaceEntity = Workspace;

/**
 * Workspace with user's role
 */
export interface WorkspaceWithRole {
  id: string;
  name: string;
  slug: string;
  role: WorkspaceRole;
  memberCount?: number;
}

/**
 * Transform WorkspaceMember to WorkspaceWithRole
 */
export function toWorkspaceWithRole(
  workspaceMember: WorkspaceMember & { workspace: Workspace },
): WorkspaceWithRole {
  return {
    id: workspaceMember.workspace.id,
    name: workspaceMember.workspace.name,
    slug: workspaceMember.workspace.slug,
    role: workspaceMember.role,
  };
}
