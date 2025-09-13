export interface UserRow {
  id: number;
  email: string;
  name: string;
  githubId?: string | null;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
  managers: { id: number }[];
  reports: { id: number }[];
}
