export interface UserRow {
  id: string; // UUID
  email: string;
  name: string;
  isAdmin?: boolean;
  position?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
  managers: { id: string }[]; // UUID[]
  reports: { id: string }[]; // UUID[]
}
