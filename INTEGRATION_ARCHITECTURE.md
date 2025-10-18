# 🏗️ Arquitetura de Integração - Diagrama Visual

Visualização da arquitetura de integração Backend-Frontend.

---

## 📊 Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                     http://localhost:5173                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP/REST
                                 │ (JWT Bearer Token)
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (NestJS)                            │
│                    http://localhost:8000/api                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Prisma ORM
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                         │
│                      localhost:5432/forge                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados - Autenticação

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │   Backend   │
│  (React UI) │                                    │  (NestJS)   │
└─────────────┘                                    └─────────────┘
       │                                                  │
       │  1. POST /api/auth/login                        │
       │     { email, password }                         │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                                   2. Validar    │
       │                                      bcrypt     │
       │                                                  │
       │  3. { access_token, user }                      │
       │<────────────────────────────────────────────────┤
       │                                                  │
4. Salvar token                                          │
   localStorage.setItem('auth:token', token)             │
       │                                                  │
       │  5. GET /api/auth/me                            │
       │     Authorization: Bearer {token}               │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                                   6. Validar    │
       │                                      JWT        │
       │                                                  │
       │  7. { user }                                    │
       │<────────────────────────────────────────────────┤
       │                                                  │
8. Atualizar estado                                      │
   setUser(user)                                         │
       │                                                  │
```

---

## 🔄 Fluxo de Dados - CRUD de Usuários

```
┌─────────────┐                                    ┌─────────────┐
│   Browser   │                                    │   Backend   │
│ (Admin Page)│                                    │  (NestJS)   │
└─────────────┘                                    └─────────────┘
       │                                                  │
       │  1. GET /api/users?page=1&limit=10              │
       │     Authorization: Bearer {token}               │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                           2. Prisma.user        │
       │                              .findMany()        │
       │                                   │              │
       │                                   ▼              │
       │                          ┌─────────────┐        │
       │                          │ PostgreSQL  │        │
       │                          └─────────────┘        │
       │                                   │              │
       │  3. { data: [...], meta: {...} }                │
       │<────────────────────────────────────────────────┤
       │                                                  │
4. Atualizar estado                                      │
   setUsers(data)                                        │
       │                                                  │
       │                                                  │
       │  5. POST /api/users                             │
       │     { name, email, password }                   │
       ├────────────────────────────────────────────────>│
       │                                                  │
       │                           6. Prisma.user        │
       │                              .create()          │
       │                                   │              │
       │                                   ▼              │
       │                          ┌─────────────┐        │
       │                          │ PostgreSQL  │        │
       │                          └─────────────┘        │
       │                                   │              │
       │  7. { id, name, email, ... }                    │
       │<────────────────────────────────────────────────┤
       │                                                  │
8. Adicionar ao estado                                   │
   setUsers(prev => [...prev, newUser])                 │
       │                                                  │
```

---

## 📁 Estrutura de Arquivos - Frontend

```
frontend/src/
├── lib/
│   └── api/                      # Camada de API
│       ├── client.ts             # Axios instance + interceptors
│       ├── endpoints/
│       │   ├── auth.ts           # Auth endpoints
│       │   ├── users.ts          # Users endpoints
│       │   ├── teams.ts          # Teams endpoints
│       │   ├── management.ts     # Management endpoints
│       │   └── workspaces.ts     # Workspaces endpoints
│       └── index.ts              # Barrel exports
│
├── features/
│   ├── auth/
│   │   ├── hooks/
│   │   │   └── useAuth.tsx       # Context API + API calls
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── data/
│   │       └── mockAuth.ts       # Fallback mock
│   │
│   └── admin/
│       ├── hooks/
│       │   ├── useAdminUsers.ts  # Users management
│       │   ├── useTeamManagement.ts
│       │   └── useManagement.ts  # Hierarchy rules
│       ├── components/
│       │   ├── WorkflowPeopleTab.tsx
│       │   ├── TeamsManagement.tsx
│       │   └── HierarchyModal.tsx
│       └── data/
│           └── mockData.ts       # Fallback mock
│
├── components/
│   ├── Toast.tsx                 # Notification system
│   └── ErrorBoundary.tsx         # Global error handler
│
└── shared-types/                 # Tipos compartilhados (root)
    └── index.ts
```

---

## 🔌 API Client - Fluxo de Requisição

```
┌─────────────────────────────────────────────────────────────────┐
│                        Component Call                            │
│                  const users = await usersApi.list()             │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Service                              │
│                   /lib/api/endpoints/users.ts                    │
│             apiClient.get('/users', { params })                  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Request Interceptor                         │
│                    /lib/api/client.ts                            │
│        1. Adicionar Authorization: Bearer {token}                │
│        2. Log request (DEV mode)                                 │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         HTTP Request                             │
│          GET http://localhost:8000/api/users                     │
│          Headers: { Authorization: Bearer ... }                  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Processing                          │
│                     NestJS Controller                            │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Response Interceptor                        │
│                    /lib/api/client.ts                            │
│        1. Log response (DEV mode)                                │
│        2. Handle 401 → clear token + redirect                    │
│        3. Handle 403, 404, 500 → log error                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Component Receives                          │
│                 setUsers(response.data)                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Autenticação - JWT Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER LOGIN                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POST /api/auth/login                          │
│                  { email, password }                             │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Backend Validates                              │
│              1. Find user by email                               │
│              2. Compare bcrypt hash                              │
│              3. Generate JWT token                               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      JWT Token Created                           │
│  {                                                               │
│    sub: "user-uuid",                                             │
│    email: "user@forge.com",                                      │
│    workspaceId: "ws-uuid",                                       │
│    workspaceRole: "ADMIN",                                       │
│    iat: 1234567890,                                              │
│    exp: 1234567890 + 7days                                       │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Response to Frontend                           │
│  {                                                               │
│    access_token: "eyJhbGc...",                                   │
│    user: { id, name, email, workspaceId, workspaceRole }        │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Saves Token                          │
│          localStorage.setItem('auth:token', token)               │
│          setUser(user)                                           │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   All Subsequent Requests                        │
│          Headers: { Authorization: Bearer {token} }              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Backend Validates JWT                          │
│              JwtAuthGuard → JwtStrategy                          │
│              Decode token → Attach user to request               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Multi-Workspace Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           USER                                   │
│                    user@example.com                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                  ┌──────────────┼──────────────┐
                  │              │              │
                  ▼              ▼              ▼
         ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
         │ Workspace A │ │ Workspace B │ │ Workspace C │
         │   (OWNER)   │ │   (ADMIN)   │ │  (MEMBER)   │
         └─────────────┘ └─────────────┘ └─────────────┘
                  │              │              │
                  │              │              │
         ┌────────┴────────┬────┴────┬─────────┴────────┐
         │                 │         │                  │
         ▼                 ▼         ▼                  ▼
    ┌─────────┐      ┌─────────┐ ┌─────────┐      ┌─────────┐
    │ Users   │      │ Teams   │ │ Rules   │      │ Data    │
    │ (A)     │      │ (A)     │ │ (A)     │      │ (A)     │
    └─────────┘      └─────────┘ └─────────┘      └─────────┘
         │                 │         │                  │
         └─────────────────┴─────────┴──────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   PostgreSQL    │
                  │  (Isolated Data)│
                  └─────────────────┘

JWT Token contém workspaceId → Backend filtra dados automaticamente
```

---

## 🔄 Estado e Sincronização

```
┌─────────────────────────────────────────────────────────────────┐
│                      React Component Tree                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
         ┌───────────────────────────────────────────┐
         │         <ToastProvider>                   │
         │         (Global notifications)            │
         └───────────────────────────────────────────┘
                                 │
                                 ▼
         ┌───────────────────────────────────────────┐
         │         <AuthProvider>                    │
         │         (user, login, logout)             │
         │         Context API                       │
         └───────────────────────────────────────────┘
                                 │
                                 ▼
         ┌───────────────────────────────────────────┐
         │         <App>                             │
         │         Routing + Layout                  │
         └───────────────────────────────────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
         ┌─────────────────┐         ┌─────────────────┐
         │  <LoginPage>    │         │  <AdminPage>    │
         │  useAuth()      │         │  useAdminUsers()│
         │                 │         │  useTeamMgmt()  │
         └─────────────────┘         └─────────────────┘
                  │                             │
                  │                             │
                  ▼                             ▼
         ┌─────────────────┐         ┌─────────────────┐
         │  authApi.login()│         │  usersApi.list()│
         │                 │         │  teamsApi.list()│
         └─────────────────┘         └─────────────────┘
                  │                             │
                  └──────────────┬──────────────┘
                                 │
                                 ▼
                  ┌─────────────────────────────┐
                  │      apiClient (Axios)      │
                  │      + Interceptors         │
                  └─────────────────────────────┘
                                 │
                                 ▼
                  ┌─────────────────────────────┐
                  │    Backend NestJS API       │
                  └─────────────────────────────┘
```

---

## 🧪 Testing Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                         TESTING LAYERS                           │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Unit Tests (Vitest)
├─ API Services (auth.ts, users.ts, etc.)
├─ Hooks (useAuth, useAdminUsers, etc.)
└─ Components (isolated)

Layer 2: Integration Tests (Vitest + MSW)
├─ Auth flow (login → session → logout)
├─ CRUD operations (create → read → update → delete)
└─ Error handling (401, 403, 404, 500)

Layer 3: E2E Tests (Playwright - futuro)
├─ User journey: Login → Admin → Create User
├─ User journey: Login → Teams → Add Member
└─ User journey: Login → Management → Create Rule

Layer 4: Manual Testing
├─ Smoke tests após cada fase
├─ Edge cases específicos
└─ Cross-browser testing
```

---

## 📦 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       PRODUCTION                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌─────────────────┐
│     Vercel      │         │  Railway/Render │
│   (Frontend)    │         │    (Backend)    │
│  forge.app      │────────>│  api.forge.app  │
└─────────────────┘  HTTPS  └─────────────────┘
         │                           │
         │                           │ Prisma
         │                           ▼
         │                  ┌─────────────────┐
         │                  │  PostgreSQL DB  │
         │                  │   (Railway)     │
         │                  └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Sentry.io     │
│  (Error Track)  │
└─────────────────┘

Environment Variables:
─────────────────────
Frontend (Vercel):
  VITE_API_BASE_URL=https://api.forge.app
  VITE_ENABLE_MOCK_API=false

Backend (Railway):
  DATABASE_URL=postgresql://...
  JWT_SECRET=...
  FRONTEND_URL=https://forge.app
```

---

## 🔒 Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                             │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Transport
├─ HTTPS only (TLS 1.3)
├─ CORS configured
└─ Helmet headers

Layer 2: Authentication
├─ JWT tokens (7 days expiry)
├─ bcrypt password hashing (10 rounds)
├─ Token validation on every request
└─ Logout clears token

Layer 3: Authorization
├─ Workspace isolation (JWT contains workspaceId)
├─ Role-based access (OWNER, ADMIN, MEMBER)
├─ Guards on sensitive endpoints
└─ Prisma filters by workspaceId

Layer 4: Input Validation
├─ class-validator (backend)
├─ Zod schemas (future)
├─ Sanitization
└─ SQL injection prevention (Prisma ORM)

Layer 5: Rate Limiting
├─ Throttler guard (10 req/10s)
├─ Per-route limits
└─ IP-based tracking
```

---

## 📈 Performance Considerations

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE STRATEGY                          │
└─────────────────────────────────────────────────────────────────┘

Frontend:
├─ React Query (cache + revalidation)
├─ Lazy loading routes
├─ Code splitting
├─ Optimistic UI updates
└─ Debounced search

Backend:
├─ Prisma query optimization
├─ Pagination (limit 100)
├─ Eager loading (include relations)
├─ Database indexes
└─ Response caching (future)

Database:
├─ Indexes on foreign keys
├─ Indexes on search fields (email, name)
├─ Proper schema design
└─ Connection pooling

Network:
├─ gzip compression
├─ CDN for static assets (Vercel)
├─ HTTP/2
└─ Keep-alive connections
```

---

**Criado:** 17 de outubro de 2025  
**Versão:** 1.0  
**Formato:** ASCII Art Diagrams
