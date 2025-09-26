export interface AuthUser {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isManager?: boolean;
  isAdmin?: boolean;
  githubId?: string;
  position?: string;
  bio?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
