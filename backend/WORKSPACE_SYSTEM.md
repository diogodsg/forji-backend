# 🏢 Sistema de Workspaces - Plano de Implementação

## 📋 Visão Geral

Implementar um sistema **multi-workspace** onde:

- Um usuário pode pertencer a múltiplos workspaces
- Cada workspace tem suas próprias teams, members e dados isolados
- Usuários podem trocar entre workspaces
- Dados são completamente isolados por workspace (tenant isolation)

---

## 🎯 Objetivos

1. **Multi-tenancy**: Isolamento completo de dados por workspace
2. **Memberships**: Usuários podem ter diferentes roles em diferentes workspaces
3. **Context Switching**: Usuários podem trocar de workspace ativo
4. **Onboarding**: Primeiro workspace criado automaticamente no registro
5. **Invites**: Sistema de convites para adicionar usuários a workspaces

---

## 📊 Modelo de Dados

### Novos Models

#### 1. Workspace

```prisma
model Workspace {
  id          String      @id @default(uuid()) @db.Uuid
  name        String      // "Driva", "Acme Corp"
  slug        String      @unique  // "driva", "acme-corp"
  description String?
  avatar_url  String?     // Logo do workspace
  status      WorkspaceStatus @default(ACTIVE)

  // Timestamps
  created_at  DateTime    @default(now())
  updated_at  DateTime    @updatedAt
  deleted_at  DateTime?

  // Relations
  members     WorkspaceMember[]
  teams       Team[]

  @@map("workspaces")
}

enum WorkspaceStatus {
  ACTIVE
  SUSPENDED
  ARCHIVED
}
```

#### 2. WorkspaceMember (relacionamento User ↔ Workspace)

```prisma
model WorkspaceMember {
  id           String        @id @default(uuid()) @db.Uuid
  user_id      String        @db.Uuid
  workspace_id String        @db.Uuid
  role         WorkspaceRole @default(MEMBER)

  // Timestamps
  joined_at    DateTime      @default(now())
  deleted_at   DateTime?

  // Relations
  user         User          @relation(fields: [user_id], references: [id], onDelete: Cascade)
  workspace    Workspace     @relation(fields: [workspace_id], references: [id], onDelete: Cascade)

  // Constraints
  @@unique([user_id, workspace_id], name: "unique_user_workspace")
  @@index([user_id])
  @@index([workspace_id])
  @@index([role])
  @@map("workspace_members")
}

enum WorkspaceRole {
  OWNER      // Criador do workspace, full access
  ADMIN      // Admin do workspace
  MEMBER     // Membro regular
}
```

### Models Atualizados

#### 3. User (adicionar relação com workspaces)

```prisma
model User {
  // ... campos existentes

  // Relations
  workspace_memberships  WorkspaceMember[]
  team_memberships       TeamMember[]
  // ... outras relações
}
```

#### 4. Team (adicionar workspace_id)

```prisma
model Team {
  id             String      @id @default(uuid()) @db.Uuid
  workspace_id   String      @db.Uuid  // 🆕 NOVO
  name           String
  description    String?
  status         TeamStatus  @default(ACTIVE)

  // Relations
  workspace      Workspace   @relation(fields: [workspace_id], references: [id], onDelete: Cascade)
  members        TeamMember[]

  // Constraints
  @@unique([workspace_id, name], name: "unique_workspace_team_name")
  @@map("teams")
}
```

#### 5. ManagementRule (adicionar workspace_id)

```prisma
model ManagementRule {
  id             String             @id @default(uuid()) @db.Uuid
  workspace_id   String             @db.Uuid  // 🆕 NOVO
  manager_id     String             @db.Uuid
  team_id        String?            @db.Uuid
  subordinate_id String?            @db.Uuid
  rule_type      ManagementRuleType

  // Relations
  workspace      Workspace          @relation(fields: [workspace_id], references: [id], onDelete: Cascade)
  // ... outras relações

  @@map("management_rules")
}
```

---

## 🔄 Fluxos Principais

### 1. Registro de Novo Usuário

```typescript
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}

// Backend:
1. Criar User
2. Criar Workspace default: "João's Workspace"
3. Criar WorkspaceMember (user + workspace, role: OWNER)
4. Retornar user + workspace + token
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "joao@example.com",
    "name": "João Silva"
  },
  "workspace": {
    "id": "uuid",
    "name": "João's Workspace",
    "slug": "joaos-workspace",
    "role": "OWNER"
  },
  "accessToken": "jwt..."
}
```

### 2. Login (retornar workspaces do usuário)

```typescript
POST /api/auth/login
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**

```json
{
  "user": {...},
  "workspaces": [
    {
      "id": "uuid-1",
      "name": "João's Workspace",
      "slug": "joaos-workspace",
      "role": "OWNER"
    },
    {
      "id": "uuid-2",
      "name": "Driva Tecnologia",
      "slug": "driva-tecnologia",
      "role": "MEMBER"
    }
  ],
  "accessToken": "jwt..."
}
```

### 3. Trocar Workspace Ativo

```typescript
POST /api/workspaces/switch
Authorization: Bearer <token>
{
  "workspaceId": "uuid-2"
}

// Backend gera novo token com workspace context
```

**Response:**

```json
{
  "workspace": {
    "id": "uuid-2",
    "name": "Driva Tecnologia",
    "slug": "driva-tecnologia",
    "role": "MEMBER"
  },
  "accessToken": "jwt-with-workspace-context..."
}
```

### 4. Criar Novo Workspace

```typescript
POST /api/workspaces
Authorization: Bearer <token>
{
  "name": "Minha Empresa",
  "description": "Workspace da minha empresa"
}
```

**Response:**

```json
{
  "workspace": {
    "id": "uuid",
    "name": "Minha Empresa",
    "slug": "minha-empresa",
    "role": "OWNER"
  }
}
```

### 5. Convidar Usuário para Workspace

```typescript
POST /api/workspaces/:workspaceId/invite
Authorization: Bearer <token>
{
  "email": "colega@example.com",
  "role": "MEMBER"
}

// Se usuário já existe: adiciona ao workspace
// Se não existe: envia convite por email (futuro)
```

---

## 🔐 JWT Token com Workspace Context

### Token Payload (atualizado)

```typescript
interface JwtPayload {
  sub: string; // User ID
  email: string;
  workspaceId: string; // 🆕 Current workspace
  workspaceRole: string; // 🆕 Role no workspace atual
  isAdmin: boolean; // Removido (agora é workspaceRole)
  isManager: boolean; // Removido (agora é workspaceRole)
  iat: number;
  exp: number;
}
```

**Exemplo:**

```json
{
  "sub": "user-uuid",
  "email": "joao@example.com",
  "workspaceId": "workspace-uuid",
  "workspaceRole": "OWNER",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Current User Context

```typescript
// request.user terá:
{
  id: string;
  email: string;
  name: string;
  currentWorkspace: {
    id: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
  }
}
```

---

## 🛡️ Guards e Permissões

### WorkspaceRoleGuard

```typescript
@Get('sensitive-data')
@UseGuards(JwtAuthGuard, WorkspaceRoleGuard)
@WorkspaceRoles('OWNER', 'ADMIN')
async getSensitiveData() {
  // Apenas OWNER e ADMIN podem acessar
}
```

### Verificações Automáticas

Toda request verificará:

1. ✅ Usuário está autenticado (JwtAuthGuard)
2. ✅ Usuário pertence ao workspace (WorkspaceMemberGuard)
3. ✅ Usuário tem role necessária (WorkspaceRoleGuard)

---

## 📋 Endpoints do Workspace Module

### Workspaces CRUD

```typescript
// Listar workspaces do usuário
GET /api/workspaces
Response: [{ id, name, slug, role, memberCount }]

// Criar novo workspace
POST /api/workspaces
Body: { name, description? }
Response: { workspace }

// Detalhes do workspace
GET /api/workspaces/:id
Response: { workspace, members, teams }

// Atualizar workspace (OWNER/ADMIN)
PATCH /api/workspaces/:id
Body: { name?, description?, avatarUrl? }

// Deletar workspace (OWNER only)
DELETE /api/workspaces/:id

// Trocar workspace ativo
POST /api/workspaces/switch
Body: { workspaceId }
Response: { workspace, accessToken }
```

### Workspace Members

```typescript
// Listar membros
GET /api/workspaces/:id/members
Response: [{ user, role, joinedAt }]

// Convidar/adicionar membro (OWNER/ADMIN)
POST /api/workspaces/:id/members
Body: { email, role }

// Atualizar role do membro (OWNER only)
PATCH /api/workspaces/:id/members/:userId
Body: { role }

// Remover membro (OWNER/ADMIN)
DELETE /api/workspaces/:id/members/:userId

// Sair do workspace (self)
POST /api/workspaces/:id/leave
```

---

## 🔄 Migration Strategy

### Passo 1: Criar novos models (sem breaking changes)

```bash
# Adicionar Workspace, WorkspaceMember
# Adicionar workspace_id nos models existentes (nullable por enquanto)
npx prisma migrate dev --name add_workspaces
```

### Passo 2: Migração de dados

```typescript
// Script de migração
async function migrateToWorkspaces() {
  // 1. Para cada User, criar Workspace default
  const users = await prisma.user.findMany();

  for (const user of users) {
    const workspace = await prisma.workspace.create({
      data: {
        name: `${user.name}'s Workspace`,
        slug: generateSlug(user.name),
      },
    });

    // 2. Adicionar user como OWNER do workspace
    await prisma.workspaceMember.create({
      data: {
        user_id: user.id,
        workspace_id: workspace.id,
        role: 'OWNER',
      },
    });

    // 3. Associar teams existentes ao workspace
    await prisma.team.updateMany({
      where: {
        /* teams relacionados ao user */
      },
      data: { workspace_id: workspace.id },
    });
  }
}
```

### Passo 3: Tornar workspace_id obrigatório

```bash
# Atualizar schema: workspace_id não nullable
npx prisma migrate dev --name make_workspace_required
```

---

## 🎨 Frontend Integration

### Context Provider

```typescript
// WorkspaceContext.tsx
const WorkspaceContext = createContext({
  currentWorkspace: null,
  workspaces: [],
  switchWorkspace: (id) => {},
});

// App usa o context para filtrar dados
function Teams() {
  const { currentWorkspace } = useWorkspace();
  const { data: teams } = useTeams(currentWorkspace.id);
}
```

### Workspace Switcher

```tsx
<WorkspaceSwitcher
  workspaces={workspaces}
  current={currentWorkspace}
  onSwitch={(ws) => switchWorkspace(ws.id)}
/>
```

---

## 📊 Impacto nos Models Existentes

### Antes (sem workspaces)

```
User → Teams (many-to-many via TeamMember)
User → ManagementRules
```

### Depois (com workspaces)

```
User → Workspaces (many-to-many via WorkspaceMember)
Workspace → Teams
Workspace → ManagementRules
User → Teams (dentro do contexto do workspace)
```

---

## ✅ Vantagens

1. **Isolamento de Dados**: Cada workspace tem seus próprios dados
2. **Escalabilidade**: Usuários podem criar múltiplos workspaces
3. **Permissões Granulares**: Diferentes roles em diferentes workspaces
4. **Multi-tenant Ready**: Base para SaaS
5. **Colaboração**: Convidar usuários para workspaces existentes

---

## 🚀 Ordem de Implementação

### Fase 1: Schema e Migrations

1. ✅ Atualizar schema.prisma com Workspace e WorkspaceMember
2. ✅ Adicionar workspace_id nos models existentes (nullable)
3. ✅ Criar migration
4. ✅ Script de migração de dados

### Fase 2: Auth com Workspaces

1. ✅ Atualizar AuthService (criar workspace no registro)
2. ✅ Atualizar JWT payload (adicionar workspaceId)
3. ✅ Atualizar JwtStrategy (incluir workspace context)
4. ✅ Login retorna lista de workspaces

### Fase 3: Workspace Module

1. ✅ WorkspaceModule, Controller, Service
2. ✅ CRUD de workspaces
3. ✅ Switch workspace endpoint
4. ✅ WorkspaceRoleGuard

### Fase 4: Workspace Members

1. ✅ Members CRUD
2. ✅ Invite system
3. ✅ Leave workspace

### Fase 5: Atualizar Modules Existentes

1. ✅ Teams: filtrar por workspace
2. ✅ Management: filtrar por workspace
3. ✅ Users: listar por workspace

### Fase 6: Frontend Integration

1. ✅ Workspace context
2. ✅ Workspace switcher
3. ✅ Atualizar todas as queries para incluir workspace

---

## 🎯 Decisões Técnicas

### 1. Workspace no Token vs Query Param

**Decisão:** Workspace no JWT token ✅

**Motivos:**

- Mais seguro
- Menos complexo
- Stateless
- Fácil de validar

### 2. Soft Delete vs Hard Delete

**Decisão:** Soft delete (deleted_at) ✅

**Motivos:**

- Recuperação de dados
- Auditoria
- Histórico

### 3. Slug Único Global vs Por User

**Decisão:** Slug único global ✅

**Motivos:**

- URLs amigáveis
- Compartilhamento fácil
- Futuro: workspace.forge.com/slug

---

## 📝 Notas Importantes

1. **Breaking Change**: Sim, mas gerenciável com migrations
2. **Performance**: Todas as queries precisam filtrar por workspace_id
3. **Índices**: Adicionar índices compostos (workspace_id, ...)
4. **Validações**: Sempre verificar se user pertence ao workspace
5. **Default Workspace**: Primeiro workspace é criado automaticamente

---

## 🔜 Próximas Fases (Futuro)

- [ ] Workspace billing/plans
- [ ] Workspace analytics
- [ ] Workspace settings customizáveis
- [ ] Workspace templates
- [ ] API keys por workspace
- [ ] Webhooks por workspace

---

**Status:** 🔜 Pronto para implementação
**Impacto:** 🔴 Alto (breaking changes no schema)
**Complexidade:** 🟡 Média-Alta
**Prioridade:** 🔥 Alta (antes de produção)
