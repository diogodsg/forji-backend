export { apiClient, extractErrorMessage, isMockMode } from "./client";

// Auth endpoints
export { authApi } from "./endpoints/auth";
export type {
  LoginDto,
  RegisterDto,
  AuthUser,
  LoginResponse,
  MeResponse,
} from "./endpoints/auth";

// Workspaces endpoints
export { workspacesApi } from "./endpoints/workspaces";
export type {
  Workspace,
  WorkspaceMember,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  InviteToWorkspaceDto,
} from "./endpoints/workspaces";

// Users endpoints
export { usersApi } from "./endpoints/users";
export type {
  User,
  PaginatedUsers,
  CreateUserDto,
  UpdateUserDto,
  UpdatePasswordDto,
  SearchUsersParams,
  ListUsersParams,
} from "./endpoints/users";

// Teams endpoints
export { teamsApi } from "./endpoints/teams";
export type {
  Team,
  TeamMember,
  TeamStatus,
  TeamMemberRole,
  CreateTeamDto,
  UpdateTeamDto,
  AddMemberDto,
  UpdateMemberRoleDto,
  ListTeamsParams,
} from "./endpoints/teams";

// Adicionar outros endpoints conforme forem criados
