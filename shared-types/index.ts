/**
 * Shared Types - Backend & Frontend
 *
 * Este arquivo contém todos os tipos compartilhados entre backend e frontend.
 * IMPORTANTE: Mantenha sincronizado com os DTOs do backend!
 *
 * Backend DTOs: /backend/src/**\/dto/*.dto.ts
 */

// ==========================================
// COMMON TYPES
// ==========================================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type WorkspaceStatus = "ACTIVE" | "SUSPENDED" | "ARCHIVED";
export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";
export type TeamStatus = "ACTIVE" | "INACTIVE";
export type TeamRole = "MANAGER" | "MEMBER";
export type ManagementRuleType = "INDIVIDUAL" | "TEAM";

// ==========================================
// AUTH TYPES
// ==========================================

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  position?: string;
  bio?: string;
  avatarUrl?: string;
  workspaceId: string;
  workspaceRole: WorkspaceRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  workspaceName: string;
  position?: string;
  bio?: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export interface MeResponse {
  user: AuthUser;
}

export interface SwitchWorkspaceDto {
  workspaceId: string;
}

// ==========================================
// WORKSPACE TYPES
// ==========================================

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  status: WorkspaceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceWithRole extends Workspace {
  role: WorkspaceRole;
  memberCount: number;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceDto {
  name?: string;
  description?: string;
  avatarUrl?: string;
  status?: WorkspaceStatus;
}

export interface InviteToWorkspaceDto {
  email: string;
  role: "ADMIN" | "MEMBER";
}

// ==========================================
// USER TYPES
// ==========================================

export interface User {
  id: string;
  email: string;
  name: string;
  position?: string;
  bio?: string;
  avatarUrl?: string;
  workspaceRole?: WorkspaceRole;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface UserWithStats extends User {
  teamCount: number;
  subordinateCount: number;
  managerCount: number;
  isManager: boolean;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  position?: string;
  bio?: string;
}

export interface UpdateUserDto {
  name?: string;
  position?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// ==========================================
// TEAM TYPES
// ==========================================

export interface Team {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  status: TeamStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface TeamSummary extends Team {
  memberCount: number;
  managerCount: number;
}

export interface TeamDetail extends Team {
  members: TeamMember[];
  managers: TeamMember[];
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    position?: string;
    avatarUrl?: string;
  };
}

export interface CreateTeamDto {
  name: string;
  description?: string;
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
  status?: TeamStatus;
}

export interface AddMemberDto {
  userId: string;
  role: TeamRole;
}

export interface UpdateMemberRoleDto {
  role: TeamRole;
}

// ==========================================
// MANAGEMENT TYPES
// ==========================================

export interface ManagementRule {
  id: string;
  workspaceId: string;
  ruleType: ManagementRuleType;
  managerId: string;
  teamId?: string;
  subordinateId?: string;
  createdAt: string;
  manager: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  team?: {
    id: string;
    name: string;
  };
  subordinate?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface Subordinate {
  id: string;
  name: string;
  email: string;
  position?: string;
  avatarUrl?: string;
  ruleType: ManagementRuleType;
  ruleId: string;
  teamId?: string;
  teamName?: string;
}

export interface ManagedTeam {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  ruleId: string;
  createdAt: string;
}

export interface CreateRuleDto {
  ruleType: ManagementRuleType;
  subordinateId?: string; // Required if ruleType = INDIVIDUAL
  teamId?: string; // Required if ruleType = TEAM
}

export interface CheckManagesResponse {
  manages: boolean;
  rules?: ManagementRule[];
}

// ==========================================
// ERROR TYPES
// ==========================================

export interface ApiError {
  message: string | string[];
  error?: string;
  statusCode: number;
}

export interface ValidationError {
  field: string;
  message: string;
}
