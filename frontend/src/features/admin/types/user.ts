export interface UserRow {
  id: number;
  email: string;
  name: string;
  isAdmin?: boolean;
  position?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
  managers: { id: number }[];
  reports: { id: number }[];
}
