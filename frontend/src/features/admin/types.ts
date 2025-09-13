// Admin feature types
export type { UserRow } from "./types/user";
import type { UserRow } from "./types/user";

export interface AdminUser extends UserRow {}

export interface CreateAdminUserInput {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  githubId?: string;
}

export interface AdminUsersState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
}
