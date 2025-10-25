export interface UserRow {
  id: string; // UUID
  email: string;
  name: string;
  isAdmin?: boolean;
  position?: string | null;
  bio?: string | null;
  avatarId?: string; // Avatar ID
  createdAt: string;
  updatedAt: string;
  managers: { id: string }[]; // UUID[]
  reports: { id: string }[]; // UUID[]
  managedTeams?: { id: string; name: string }[]; // Times gerenciados
}
