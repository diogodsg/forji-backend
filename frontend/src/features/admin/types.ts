// Admin feature types
export type { UserRow } from "./types/user";
import type { UserRow } from "./types/user";
import type { TeamSummary } from "./types/team";
export type {
  TeamSummary,
  TeamDetail,
  TeamMember,
  CreateTeamInput,
  AddTeamMemberInput,
  UpdateTeamMemberRoleInput,
  TeamMetrics,
} from "./types/team";

export interface AdminUser extends UserRow {}

export interface CreateAdminUserInput {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  githubId?: string;
  position?: string;
}

export interface AdminUsersState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
}

// Teams state (frontend only)
export interface AdminTeamsState {
  teams: TeamSummary[];
  loading: boolean;
  error: string | null;
}
