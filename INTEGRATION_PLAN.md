# 🔗 Plano de Integração Backend-Frontend

## 📋 Resumo Executivo

Plano completo para integrar o backend NestJS com o frontend React, substituindo o sistema mock atual por chamadas reais à API REST.

**Data:** 17 de outubro de 2025  
**Status:** 📝 Em Planejamento

---

## 🎯 Escopo da Integração

### Módulos Prioritários

1. **Auth** - Login, Registro, Validação de Token
2. **Workspaces** - Listagem, Criação, Troca de Contexto
3. **Users** - Listagem, CRUD, Busca
4. **Teams** - Gestão de Times e Membros
5. **Management** - Regras Hierárquicas e Subordinados

### Fora do Escopo (Fase 2)

- Cycles (metas e PDI)
- Gamification
- Notifications
- Analytics

---

## 🏗️ Arquitetura de Integração

### Princípios Arquiteturais

1. **API Client Centralizado** - Único ponto de configuração HTTP
2. **Camada de Serviços** - Abstração entre componentes e API
3. **Type Safety** - Interfaces compartilhadas entre back/front
4. **Error Handling** - Tratamento consistente de erros
5. **Loading States** - Feedback visual para todas operações
6. **Mock Fallback** - Manter mock data para desenvolvimento offline

### Stack Técnica

**Backend:**

- NestJS 10.4.20
- Prisma 5.22.0
- PostgreSQL 14+
- JWT (Passport)
- Swagger/OpenAPI

**Frontend:**

- React 19
- TypeScript (strict)
- Axios (HTTP client)
- Context API (Auth state)
- React Hooks (feature state)

---

## 📁 Estrutura de Arquivos

### Novo: API Layer (`/frontend/src/lib/api/`)

```
frontend/src/lib/api/
├── client.ts                 # Axios instance + interceptors
├── types.ts                  # Tipos compartilhados (Backend DTOs)
├── endpoints/
│   ├── auth.ts              # Auth endpoints
│   ├── workspaces.ts        # Workspace endpoints
│   ├── users.ts             # Users endpoints
│   ├── teams.ts             # Teams endpoints
│   └── management.ts        # Management endpoints
└── index.ts                 # Barrel exports
```

### Novo: Tipos Compartilhados (`/shared-types/`)

```
shared-types/
├── auth.types.ts            # User, Login, Register DTOs
├── workspace.types.ts       # Workspace DTOs
├── user.types.ts            # User DTOs
├── team.types.ts            # Team DTOs
├── management.types.ts      # Management Rule DTOs
└── index.ts                 # Barrel exports
```

### Modificações em Features

```
frontend/src/features/
├── auth/
│   ├── hooks/
│   │   └── useAuth.tsx      # Substituir mock por API calls
│   ├── data/
│   │   └── mockAuth.ts      # Manter para fallback
│   └── services/            # NOVO
│       └── authService.ts   # Camada de serviço
│
├── admin/
│   ├── hooks/
│   │   ├── useAdminUsers.ts # Integrar com API
│   │   └── useTeamManagement.ts # Integrar com API
│   ├── data/
│   │   └── mockData.ts      # Manter para fallback
│   └── services/            # NOVO
│       ├── usersService.ts
│       ├── teamsService.ts
│       └── managementService.ts
```

---

## 🔄 Fase 1: Setup Inicial (2-3 dias)

### 1.1 Criar API Client Base

**Arquivo:** `/frontend/src/lib/api/client.ts`

**Funcionalidades:**

- Configurar Axios instance com `baseURL` e `timeout`
- Request interceptor para adicionar JWT token
- Response interceptor para tratamento de erros
- Retry logic para falhas de rede
- Refresh token (futuro)

**Exemplo:**

```typescript
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido - limpar sessão
      localStorage.removeItem("auth:token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### 1.2 Definir Tipos Compartilhados

**Arquivo:** `/shared-types/auth.types.ts`

**Importância:** Garantir que frontend e backend usem mesmas interfaces.

**Exemplo:**

```typescript
// Baseado em backend/src/auth/dto/
export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  workspaceName: string;
  position?: string;
  bio?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  position?: string;
  bio?: string;
  workspaceId: string;
  workspaceRole: "OWNER" | "ADMIN" | "MEMBER";
  createdAt: string;
}

export interface MeResponse {
  user: AuthUser;
}
```

**Arquivo:** `/shared-types/workspace.types.ts`

```typescript
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  status: "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  createdAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
}

export interface InviteToWorkspaceDto {
  email: string;
  role: "ADMIN" | "MEMBER";
}
```

### 1.3 Variáveis de Ambiente

**Arquivo:** `/frontend/.env.development`

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ENABLE_MOCK_API=false
```

**Arquivo:** `/frontend/.env.production`

```env
VITE_API_BASE_URL=https://api.forge.com/api
VITE_ENABLE_MOCK_API=false
```

---

## 🔐 Fase 2: Auth Integration (3-4 dias)

### 2.1 Criar Auth Service

**Arquivo:** `/frontend/src/lib/api/endpoints/auth.ts`

```typescript
import { apiClient } from "../client";
import type {
  LoginDto,
  RegisterDto,
  LoginResponse,
  MeResponse,
} from "@/shared-types";

export const authApi = {
  /**
   * POST /auth/login
   */
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    const { data } = await apiClient.post("/auth/login", credentials);
    return data;
  },

  /**
   * POST /auth/register
   */
  register: async (userData: RegisterDto): Promise<LoginResponse> => {
    const { data } = await apiClient.post("/auth/register", userData);
    return data;
  },

  /**
   * GET /auth/me
   */
  me: async (): Promise<MeResponse> => {
    const { data } = await apiClient.get("/auth/me");
    return data;
  },

  /**
   * POST /auth/switch-workspace
   */
  switchWorkspace: async (workspaceId: string): Promise<LoginResponse> => {
    const { data } = await apiClient.post("/auth/switch-workspace", {
      workspaceId,
    });
    return data;
  },
};
```

### 2.2 Refatorar useAuth Hook

**Arquivo:** `/frontend/src/features/auth/hooks/useAuth.tsx`

**Mudanças:**

1. Substituir `mockLogin` por `authApi.login`
2. Substituir `mockRegister` por `authApi.register`
3. Substituir `mockGetUserByToken` por `authApi.me`
4. Adicionar fallback para mock em caso de erro (modo offline)
5. Melhorar tratamento de erros com mensagens do backend

**Exemplo:**

```typescript
const login = useCallback(async (email: string, password: string) => {
  setLoading(true);
  setError(null);

  try {
    // Tentar API real
    const response = await authApi.login({ email, password });

    // Salvar token
    localStorage.setItem(STORAGE_TOKEN_KEY, response.access_token);

    // Atualizar estado
    setUser(response.user);

    console.log("✅ Login bem-sucedido:", response.user.name);
  } catch (err: any) {
    // Fallback para mock se API falhar (modo offline)
    if (import.meta.env.VITE_ENABLE_MOCK_API === "true") {
      console.warn("⚠️ API falhou, usando mock data");
      const mockResponse = await mockLogin(email, password);
      localStorage.setItem(STORAGE_TOKEN_KEY, mockResponse.token);
      setUser(mockResponse.user);
    } else {
      // Mostrar erro da API
      const errorMessage = err.response?.data?.message || "Erro ao fazer login";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  } finally {
    setLoading(false);
  }
}, []);
```

### 2.3 Atualizar LoginForm

**Arquivo:** `/frontend/src/features/auth/components/LoginForm.tsx`

**Mudanças:**

1. Exibir mensagens de erro do backend
2. Loading states mais robustos
3. Validação de campos antes de enviar

### 2.4 Criar RegisterForm (se não existir)

**Arquivo:** `/frontend/src/features/auth/components/RegisterForm.tsx`

**Campos:**

- Nome completo
- Email
- Senha (com confirmação)
- Nome do workspace
- Cargo (opcional)

---

## 🏢 Fase 3: Workspaces Integration (2-3 dias)

### 3.1 Criar Workspaces Service

**Arquivo:** `/frontend/src/lib/api/endpoints/workspaces.ts`

```typescript
import { apiClient } from "../client";
import type {
  Workspace,
  CreateWorkspaceDto,
  InviteToWorkspaceDto,
} from "@/shared-types";

export const workspacesApi = {
  /**
   * GET /workspaces
   */
  list: async (): Promise<Workspace[]> => {
    const { data } = await apiClient.get("/workspaces");
    return data;
  },

  /**
   * GET /workspaces/:id
   */
  getById: async (id: string): Promise<Workspace> => {
    const { data } = await apiClient.get(`/workspaces/${id}`);
    return data;
  },

  /**
   * POST /workspaces
   */
  create: async (workspace: CreateWorkspaceDto): Promise<Workspace> => {
    const { data } = await apiClient.post("/workspaces", workspace);
    return data;
  },

  /**
   * PUT /workspaces/:id
   */
  update: async (
    id: string,
    workspace: Partial<CreateWorkspaceDto>
  ): Promise<Workspace> => {
    const { data } = await apiClient.put(`/workspaces/${id}`, workspace);
    return data;
  },

  /**
   * DELETE /workspaces/:id
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${id}`);
  },

  /**
   * POST /workspaces/:id/invite
   */
  invite: async (id: string, invite: InviteToWorkspaceDto): Promise<void> => {
    await apiClient.post(`/workspaces/${id}/invite`, invite);
  },
};
```

### 3.2 Criar useWorkspaces Hook

**Arquivo:** `/frontend/src/features/workspaces/hooks/useWorkspaces.ts`

```typescript
import { useState, useEffect, useCallback } from "react";
import { workspacesApi } from "@/lib/api";
import type { Workspace } from "@/shared-types";

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workspacesApi.list();
      setWorkspaces(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao carregar workspaces");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const createWorkspace = useCallback(async (workspace: CreateWorkspaceDto) => {
    setLoading(true);
    try {
      const newWorkspace = await workspacesApi.create(workspace);
      setWorkspaces((prev) => [...prev, newWorkspace]);
      return newWorkspace;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao criar workspace";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    workspaces,
    loading,
    error,
    fetchWorkspaces,
    createWorkspace,
  };
}
```

### 3.3 Criar Workspace Switcher Component

**Arquivo:** `/frontend/src/components/WorkspaceSwitcher.tsx`

**Funcionalidades:**

- Dropdown com workspaces do usuário
- Switch entre workspaces (chama `authApi.switchWorkspace`)
- Indicador visual do workspace ativo
- Opção "Criar novo workspace"

---

## 👥 Fase 4: Users Integration (3-4 dias)

### 4.1 Criar Users Service

**Arquivo:** `/frontend/src/lib/api/endpoints/users.ts`

```typescript
import { apiClient } from "../client";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UpdatePasswordDto,
  PaginatedResponse,
} from "@/shared-types";

export const usersApi = {
  /**
   * GET /users?page=1&limit=10
   */
  list: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get("/users", { params });
    return data;
  },

  /**
   * GET /users/search?q=nome
   */
  search: async (query: string): Promise<User[]> => {
    const { data } = await apiClient.get("/users/search", {
      params: { q: query },
    });
    return data;
  },

  /**
   * GET /users/:id
   */
  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
  },

  /**
   * POST /users
   */
  create: async (user: CreateUserDto): Promise<User> => {
    const { data } = await apiClient.post("/users", user);
    return data;
  },

  /**
   * PATCH /users/:id
   */
  update: async (id: string, user: UpdateUserDto): Promise<User> => {
    const { data } = await apiClient.patch(`/users/${id}`, user);
    return data;
  },

  /**
   * PATCH /users/:id/password
   */
  updatePassword: async (
    id: string,
    passwords: UpdatePasswordDto
  ): Promise<void> => {
    await apiClient.patch(`/users/${id}/password`, passwords);
  },

  /**
   * DELETE /users/:id
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
```

### 4.2 Refatorar useAdminUsers Hook

**Arquivo:** `/frontend/src/features/admin/hooks/useAdminUsers.ts`

**Mudanças:**

1. Substituir mock data por chamadas `usersApi`
2. Implementar paginação real (backend retorna meta)
3. Implementar busca real (backend tem endpoint `/users/search`)
4. Tratamento de erros do backend
5. Manter fallback para mock em desenvolvimento

**Exemplo:**

```typescript
const fetchUsers = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await usersApi.list({ page: 1, limit: 100 });
    setUsers(response.data);
    console.log(`✅ Usuários carregados: ${response.data.length}`);
  } catch (err: any) {
    // Fallback para mock se API falhar
    if (import.meta.env.VITE_ENABLE_MOCK_API === "true") {
      console.warn("⚠️ API falhou, usando mock data");
      setUsers(getMockUsers());
    } else {
      setError(err.response?.data?.message || "Erro ao carregar usuários");
    }
  } finally {
    setLoading(false);
  }
}, []);
```

### 4.3 Atualizar Componentes Admin Users

**Componentes a atualizar:**

- `WorkflowPeopleTab.tsx` - Usar `useAdminUsers` integrado
- `OnboardingModal.tsx` - Enviar dados reais ao criar usuário
- `SimplifiedUsersTable.tsx` - Exibir dados reais
- `CreateUserModal.tsx` - Enviar ao backend

---

## 🏆 Fase 5: Teams Integration (3-4 dias)

### 5.1 Criar Teams Service

**Arquivo:** `/frontend/src/lib/api/endpoints/teams.ts`

```typescript
import { apiClient } from "../client";
import type {
  Team,
  TeamDetail,
  CreateTeamDto,
  UpdateTeamDto,
  TeamMember,
  AddMemberDto,
} from "@/shared-types";

export const teamsApi = {
  /**
   * GET /teams
   */
  list: async (): Promise<Team[]> => {
    const { data } = await apiClient.get("/teams");
    return data;
  },

  /**
   * GET /teams/search?q=nome
   */
  search: async (query: string): Promise<Team[]> => {
    const { data } = await apiClient.get("/teams/search", {
      params: { q: query },
    });
    return data;
  },

  /**
   * GET /teams/:id
   */
  getById: async (id: string): Promise<TeamDetail> => {
    const { data } = await apiClient.get(`/teams/${id}`);
    return data;
  },

  /**
   * POST /teams
   */
  create: async (team: CreateTeamDto): Promise<Team> => {
    const { data } = await apiClient.post("/teams", team);
    return data;
  },

  /**
   * PATCH /teams/:id
   */
  update: async (id: string, team: UpdateTeamDto): Promise<Team> => {
    const { data } = await apiClient.patch(`/teams/${id}`, team);
    return data;
  },

  /**
   * DELETE /teams/:id
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/teams/${id}`);
  },

  /**
   * GET /teams/:id/members
   */
  getMembers: async (id: string): Promise<TeamMember[]> => {
    const { data } = await apiClient.get(`/teams/${id}/members`);
    return data;
  },

  /**
   * POST /teams/:id/members
   */
  addMember: async (id: string, member: AddMemberDto): Promise<TeamMember> => {
    const { data } = await apiClient.post(`/teams/${id}/members`, member);
    return data;
  },

  /**
   * PATCH /teams/:id/members/:userId
   */
  updateMemberRole: async (
    teamId: string,
    userId: string,
    role: "MEMBER" | "MANAGER"
  ): Promise<TeamMember> => {
    const { data } = await apiClient.patch(
      `/teams/${teamId}/members/${userId}`,
      { role }
    );
    return data;
  },

  /**
   * DELETE /teams/:id/members/:userId
   */
  removeMember: async (teamId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/members/${userId}`);
  },
};
```

### 5.2 Refatorar useTeamManagement Hook

**Arquivo:** `/frontend/src/features/admin/hooks/useTeamManagement.ts`

**Mudanças:**

1. Substituir mock data por chamadas `teamsApi`
2. Implementar busca real
3. Implementar gestão de membros real
4. Loading states granulares (por operação)
5. Tratamento de erros do backend

### 5.3 Atualizar Componentes Admin Teams

**Componentes a atualizar:**

- `TeamsManagement.tsx` - Usar hook integrado
- `AdminTeamsTable.tsx` - Exibir dados reais
- `TeamDetailPanel.tsx` - Gestão de membros real
- `CreateTeamModal.tsx` - Enviar ao backend

---

## 📊 Fase 6: Management Rules Integration (2-3 dias)

### 6.1 Criar Management Service

**Arquivo:** `/frontend/src/lib/api/endpoints/management.ts`

```typescript
import { apiClient } from "../client";
import type {
  ManagementRule,
  CreateRuleDto,
  Subordinate,
  ManagedTeam,
} from "@/shared-types";

export const managementApi = {
  /**
   * GET /management/subordinates
   */
  getSubordinates: async (): Promise<Subordinate[]> => {
    const { data } = await apiClient.get("/management/subordinates");
    return data;
  },

  /**
   * GET /management/teams
   */
  getManagedTeams: async (): Promise<ManagedTeam[]> => {
    const { data } = await apiClient.get("/management/teams");
    return data;
  },

  /**
   * GET /management/rules (ADMIN only)
   */
  getAllRules: async (): Promise<ManagementRule[]> => {
    const { data } = await apiClient.get("/management/rules");
    return data;
  },

  /**
   * POST /management/rules
   */
  createRule: async (rule: CreateRuleDto): Promise<ManagementRule> => {
    const { data } = await apiClient.post("/management/rules", rule);
    return data;
  },

  /**
   * DELETE /management/rules/:id
   */
  deleteRule: async (id: string): Promise<void> => {
    await apiClient.delete(`/management/rules/${id}`);
  },

  /**
   * GET /management/check/:userId
   */
  checkIfManages: async (userId: string): Promise<{ manages: boolean }> => {
    const { data } = await apiClient.get(`/management/check/${userId}`);
    return data;
  },
};
```

### 6.2 Criar useManagement Hook

**Arquivo:** `/frontend/src/features/admin/hooks/useManagement.ts`

```typescript
import { useState, useEffect, useCallback } from "react";
import { managementApi } from "@/lib/api";
import type {
  ManagementRule,
  CreateRuleDto,
  Subordinate,
  ManagedTeam,
} from "@/shared-types";

export function useManagement() {
  const [rules, setRules] = useState<ManagementRule[]>([]);
  const [subordinates, setSubordinates] = useState<Subordinate[]>([]);
  const [managedTeams, setManagedTeams] = useState<ManagedTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await managementApi.getAllRules();
      setRules(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao carregar regras");
    } finally {
      setLoading(false);
    }
  }, []);

  const createRule = useCallback(async (rule: CreateRuleDto) => {
    try {
      const newRule = await managementApi.createRule(rule);
      setRules((prev) => [...prev, newRule]);
      return newRule;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao criar regra";
      throw new Error(errorMessage);
    }
  }, []);

  const deleteRule = useCallback(async (id: string) => {
    try {
      await managementApi.deleteRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao deletar regra";
      throw new Error(errorMessage);
    }
  }, []);

  return {
    rules,
    subordinates,
    managedTeams,
    loading,
    error,
    fetchRules,
    createRule,
    deleteRule,
  };
}
```

### 6.3 Atualizar Componentes Management

**Componentes a atualizar:**

- `HierarchyModal.tsx` - Buscar regras reais
- `AdminCreateRuleModal.tsx` - Criar regras reais
- `AdminSubordinatesManagement.tsx` - Listar subordinados reais

---

## 🧪 Fase 7: Testing & Error Handling (2-3 dias)

### 7.1 Implementar Error Boundary

**Arquivo:** `/frontend/src/components/ErrorBoundary.tsx`

```typescript
import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600">Algo deu errado</h2>
            <p className="mt-2 text-gray-600">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg"
            >
              Recarregar Página
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### 7.2 Criar Toast Notifications

**Arquivo:** `/frontend/src/components/Toast.tsx`

**Funcionalidades:**

- Success, Error, Warning, Info
- Auto-dismiss após 5s
- Queue de notificações
- Animações suaves

### 7.3 Testes de Integração

**Cenários a testar:**

1. **Auth Flow**

   - Login com credenciais válidas
   - Login com credenciais inválidas
   - Registro de novo usuário
   - Persistência de sessão
   - Logout

2. **Users CRUD**

   - Listar usuários
   - Buscar usuário por nome
   - Criar usuário
   - Editar usuário
   - Deletar usuário

3. **Teams CRUD**

   - Listar times
   - Criar time
   - Adicionar membro
   - Remover membro
   - Deletar time

4. **Management Rules**

   - Criar regra INDIVIDUAL
   - Criar regra TEAM
   - Deletar regra
   - Listar subordinados

5. **Error Cases**
   - Token expirado
   - Network error
   - 404 Not Found
   - 403 Forbidden
   - Validation errors

---

## 🚀 Fase 8: Production Readiness (2-3 dias)

### 8.1 Performance Optimization

**Implementar:**

- React Query (cache de dados)
- Lazy loading de rotas
- Code splitting
- Image optimization
- Bundle analysis

### 8.2 Security Hardening

**Implementar:**

- HTTPS only
- Content Security Policy
- XSS protection
- CSRF protection
- Rate limiting no cliente
- Sanitização de inputs

### 8.3 Monitoring & Logging

**Implementar:**

- Sentry para error tracking
- Google Analytics (opcional)
- Console logs estruturados
- Performance metrics

### 8.4 Documentation

**Criar:**

- API integration guide
- Deployment guide
- Environment setup guide
- Troubleshooting guide

---

## 📊 Timeline Estimado

| Fase | Descrição                | Duração  | Dependências     |
| ---- | ------------------------ | -------- | ---------------- |
| 1    | Setup Inicial            | 2-3 dias | -                |
| 2    | Auth Integration         | 3-4 dias | Fase 1           |
| 3    | Workspaces Integration   | 2-3 dias | Fase 2           |
| 4    | Users Integration        | 3-4 dias | Fase 2, 3        |
| 5    | Teams Integration        | 3-4 dias | Fase 2, 3, 4     |
| 6    | Management Integration   | 2-3 dias | Fase 2, 3, 4, 5  |
| 7    | Testing & Error Handling | 2-3 dias | Todas anteriores |
| 8    | Production Readiness     | 2-3 dias | Todas anteriores |

**Total Estimado:** 19-27 dias (~4-5 semanas)

---

## ✅ Checklist de Implementação

### Setup Inicial

- [ ] Criar `/frontend/src/lib/api/client.ts`
- [ ] Configurar Axios interceptors
- [ ] Definir tipos compartilhados em `/shared-types/`
- [ ] Configurar variáveis de ambiente
- [ ] Testar conexão com backend

### Auth

- [ ] Criar `authApi` service
- [ ] Refatorar `useAuth` hook
- [ ] Atualizar `LoginForm`
- [ ] Criar `RegisterForm`
- [ ] Testar fluxo completo de auth
- [ ] Implementar token refresh (opcional)

### Workspaces

- [ ] Criar `workspacesApi` service
- [ ] Criar `useWorkspaces` hook
- [ ] Criar `WorkspaceSwitcher` component
- [ ] Testar criação de workspace
- [ ] Testar switch de workspace

### Users

- [ ] Criar `usersApi` service
- [ ] Refatorar `useAdminUsers` hook
- [ ] Atualizar componentes admin users
- [ ] Implementar paginação
- [ ] Implementar busca
- [ ] Testar CRUD completo

### Teams

- [ ] Criar `teamsApi` service
- [ ] Refatorar `useTeamManagement` hook
- [ ] Atualizar componentes admin teams
- [ ] Implementar gestão de membros
- [ ] Testar CRUD completo

### Management

- [ ] Criar `managementApi` service
- [ ] Criar `useManagement` hook
- [ ] Atualizar componentes management
- [ ] Testar criação de regras
- [ ] Testar listagem de subordinados

### Testing

- [ ] Testes de integração auth
- [ ] Testes de integração users
- [ ] Testes de integração teams
- [ ] Testes de integração management
- [ ] Testes de error cases

### Production

- [ ] Implementar React Query
- [ ] Otimizar bundle
- [ ] Configurar Sentry
- [ ] Implementar CSP
- [ ] Documentação completa

---

## 🎯 Prioridades

### P0 (Crítico - Semana 1)

1. Setup inicial (API client + tipos)
2. Auth integration (login/registro)
3. Workspaces básico (list + switch)

### P1 (Alta - Semana 2-3)

4. Users CRUD completo
5. Teams CRUD completo
6. Error handling robusto

### P2 (Média - Semana 4)

7. Management rules
8. Paginação e busca avançada
9. Loading states polidos

### P3 (Baixa - Semana 5)

10. React Query (cache)
11. Performance optimization
12. Monitoring e logs

---

## 🔧 Configuração Backend

### Verificar CORS

**Arquivo:** `/backend/src/main.ts`

```typescript
app.enableCors({
  origin: ["http://localhost:5173", "https://forge.com"],
  credentials: true,
});
```

### Verificar Swagger

Garantir que Swagger está acessível em:

- http://localhost:8000/api/docs

### Verificar Database

```bash
cd backend
npx prisma migrate status
npx prisma db seed
```

---

## 📚 Recursos Úteis

### Backend Docs

- `/backend/README.md` - Setup completo
- `/backend/API_DOCUMENTATION.md` - Endpoints detalhados
- http://localhost:8000/api/docs - Swagger UI

### Frontend Docs

- `/frontend/AUTH_REFACTORING.md` - Sistema auth atual
- `/frontend/ADMIN_MOCK_REFACTORING.md` - Sistema admin atual
- `/frontend/ARCHITECTURE_PATTERNS.md` - Padrões arquiteturais

### External Resources

- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Axios Docs](https://axios-http.com/)
- [React Query Docs](https://tanstack.com/query/latest)

---

## 🚨 Riscos e Mitigações

### Risco 1: Token Expiration Handling

**Mitigação:** Implementar refresh token desde o início

### Risco 2: Inconsistência de Tipos

**Mitigação:** Usar tipos compartilhados, validar com Zod

### Risco 3: Performance com Dados Grandes

**Mitigação:** Implementar paginação server-side desde cedo

### Risco 4: Conflitos de Estado (Mock vs Real)

**Mitigação:** Flag `VITE_ENABLE_MOCK_API` para controlar fallback

### Risco 5: CORS Issues em Produção

**Mitigação:** Testar CORS cedo, documentar configuração

---

## 📞 Pontos de Contato

### Backend Issues

- Verificar logs: `npm run start:dev`
- Prisma Studio: `npx prisma studio`
- Swagger UI: http://localhost:8000/api/docs

### Frontend Issues

- Console logs (modo verbose)
- React DevTools
- Network tab (ver requests)

---

## 🎉 Definição de Sucesso

### Critérios de Aceitação

1. ✅ Login/logout funcionando com backend real
2. ✅ Criação de usuários persistindo no banco
3. ✅ Listagem de times com dados reais
4. ✅ Criação de regras de gestão funcionando
5. ✅ Error handling robusto em todos fluxos
6. ✅ Loading states em todas operações assíncronas
7. ✅ Fallback para mock em desenvolvimento (opcional)
8. ✅ Zero erros de console em produção
9. ✅ Documentação completa da integração
10. ✅ Todos os testes de integração passando

---

**Última Atualização:** 17 de outubro de 2025  
**Autor:** Plano criado via análise dos READMEs existentes  
**Status:** 📝 Pronto para Implementação
