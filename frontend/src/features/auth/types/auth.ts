export interface AuthUser {
  id: string; // UUID do backend (Prisma)
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isManager?: boolean;
  isAdmin?: boolean;
  githubId?: string;
  position?: string;
  bio?: string;
  avatarId?: string;
  workspaceId?: string; // UUID do workspace ativo
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    workspaceName?: string; // Backend exige, mas usamos valor padrão se não fornecido
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
