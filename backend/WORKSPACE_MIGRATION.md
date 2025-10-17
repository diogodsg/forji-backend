# 📊 Comparação Schema: Antes vs Depois do Sistema de Workspaces

## 🔴 Mudanças Breaking

### Models Adicionados

#### ✅ Workspace (NOVO)

```prisma
model Workspace {
  id            String          @id @default(uuid())
  name          String          // "Driva Tecnologia"
  slug          String          @unique  // "driva-tecnologia"
  description   String?
  avatar_url    String?
  status        WorkspaceStatus @default(ACTIVE)
  created_at    DateTime        @default(now())
  updated_at    DateTime        @updatedAt
  deleted_at    DateTime?

  members           WorkspaceMember[]
  teams             Team[]
  management_rules  ManagementRule[]
}
```

#### ✅ WorkspaceMember (NOVO)

```prisma
model WorkspaceMember {
  id            String        @id @default(uuid())
  user_id       String        @db.Uuid
  workspace_id  String        @db.Uuid
  role          WorkspaceRole @default(MEMBER)
  joined_at     DateTime      @default(now())
  deleted_at    DateTime?

  user          User          @relation(...)
  workspace     Workspace     @relation(...)

  @@unique([user_id, workspace_id])
}
```

#### ✅ Enums NOVOS

```prisma
enum WorkspaceStatus {
  ACTIVE
  SUSPENDED
  ARCHIVED
}

enum WorkspaceRole {
  OWNER      // Full access
  ADMIN      // Admin do workspace
  MEMBER     // Membro regular
}
```

---

### Models Modificados

#### 📝 User

**ANTES:**

```prisma
model User {
  id            String      @id @default(uuid())
  email         String      @unique
  password      String
  name          String
  position      String?
  bio           String?
  is_admin      Boolean     @default(false)     // ❌ REMOVER
  is_manager    Boolean     @default(false)     // ❌ REMOVER

  team_memberships                      TeamMember[]
  management_rules_as_manager           ManagementRule[]
  management_rules_as_subordinate       ManagementRule[]
}
```

**DEPOIS:**

```prisma
model User {
  id            String      @id @default(uuid())
  email         String      @unique
  password      String
  name          String
  position      String?
  bio           String?
  // is_admin e is_manager REMOVIDOS ✅

  workspace_memberships                 WorkspaceMember[]  // 🆕 NOVO
  team_memberships                      TeamMember[]
  management_rules_as_manager           ManagementRule[]
  management_rules_as_subordinate       ManagementRule[]
}
```

**Impacto:**

- ❌ `is_admin` e `is_manager` removidos
- ✅ Agora são roles no `WorkspaceMember` (OWNER/ADMIN/MEMBER)
- ✅ Um usuário pode ser OWNER em um workspace e MEMBER em outro

---

#### 📝 Team

**ANTES:**

```prisma
model Team {
  id              String      @id @default(uuid())
  name            String      @unique    // ❌ Problema: nome único global
  description     String?
  status          TeamStatus  @default(ACTIVE)

  members           TeamMember[]
  management_rules  ManagementRule[]
}
```

**DEPOIS:**

```prisma
model Team {
  id              String      @id @default(uuid())
  workspace_id    String      @db.Uuid         // 🆕 NOVO
  name            String                        // ✅ Não mais unique global
  description     String?
  status          TeamStatus  @default(ACTIVE)

  workspace         Workspace       @relation(...)  // 🆕 NOVO
  members           TeamMember[]
  management_rules  ManagementRule[]

  @@unique([workspace_id, name])  // ✅ Unique por workspace
}
```

**Impacto:**

- ✅ `workspace_id` obrigatório
- ✅ Nome do time único apenas dentro do workspace
- ✅ Workspaces diferentes podem ter times com mesmo nome

---

#### 📝 ManagementRule

**ANTES:**

```prisma
model ManagementRule {
  id                String              @id @default(uuid())
  rule_type         ManagementRuleType
  manager_id        String              @db.Uuid
  team_id           String?             @db.Uuid
  subordinate_id    String?             @db.Uuid

  manager           User                @relation(...)
  subordinate       User?               @relation(...)
  team              Team?               @relation(...)

  @@unique([manager_id, subordinate_id, rule_type])
  @@unique([manager_id, team_id, rule_type])
}
```

**DEPOIS:**

```prisma
model ManagementRule {
  id                String              @id @default(uuid())
  workspace_id      String              @db.Uuid  // 🆕 NOVO
  rule_type         ManagementRuleType
  manager_id        String              @db.Uuid
  team_id           String?             @db.Uuid
  subordinate_id    String?             @db.Uuid

  workspace         Workspace           @relation(...)  // 🆕 NOVO
  manager           User                @relation(...)
  subordinate       User?               @relation(...)
  team              Team?               @relation(...)

  @@unique([workspace_id, manager_id, subordinate_id, rule_type])  // ✅ Com workspace
  @@unique([workspace_id, manager_id, team_id, rule_type])         // ✅ Com workspace
}
```

**Impacto:**

- ✅ `workspace_id` obrigatório
- ✅ Management rules isoladas por workspace

---

## 🔄 Fluxo de Dados

### ANTES (sem workspaces)

```
User
  ├─ is_admin: boolean
  ├─ is_manager: boolean
  └─ Teams (via TeamMember)
       └─ TeamRole: MANAGER | MEMBER

Team (nome único global)
  └─ Members

ManagementRule
  └─ manager_id + subordinate_id
```

### DEPOIS (com workspaces)

```
User
  └─ Workspaces (via WorkspaceMember)
       ├─ WorkspaceRole: OWNER | ADMIN | MEMBER
       └─ Workspace
            ├─ Teams (nome único por workspace)
            │    └─ TeamRole: MANAGER | MEMBER
            └─ ManagementRules (isoladas por workspace)
```

---

## 🎯 Queries Impactadas

### ANTES

```typescript
// Listar todos os times
const teams = await prisma.team.findMany();

// Listar membros de um time
const members = await prisma.teamMember.findMany({
  where: { team_id: teamId },
});
```

### DEPOIS

```typescript
// Listar times DO WORKSPACE ATUAL
const teams = await prisma.team.findMany({
  where: { workspace_id: currentWorkspaceId }, // 🆕 OBRIGATÓRIO
});

// Listar membros de um time (verificar workspace)
const members = await prisma.teamMember.findMany({
  where: {
    team_id: teamId,
    team: {
      workspace_id: currentWorkspaceId, // 🆕 Validação
    },
  },
});
```

**⚠️ IMPORTANTE:** Todas as queries precisam filtrar por `workspace_id`!

---

## 📋 Checklist de Migração

### Fase 1: Schema (Breaking Changes)

- [ ] Backup do banco de dados
- [ ] Criar novos models (Workspace, WorkspaceMember)
- [ ] Adicionar `workspace_id` em Team e ManagementRule (nullable)
- [ ] Remover `is_admin` e `is_manager` de User
- [ ] Executar migration

### Fase 2: Migração de Dados

```typescript
// Script de migração
async function migrate() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    // 1. Criar workspace default
    const workspace = await prisma.workspace.create({
      data: {
        name: `${user.name}'s Workspace`,
        slug: generateSlug(user.name),
      },
    });

    // 2. Adicionar user como OWNER
    await prisma.workspaceMember.create({
      data: {
        user_id: user.id,
        workspace_id: workspace.id,
        role: user.is_admin ? 'OWNER' : 'MEMBER', // Migrar is_admin
      },
    });

    // 3. Associar teams ao workspace
    await prisma.team.updateMany({
      where: {
        /* teams do user */
      },
      data: { workspace_id: workspace.id },
    });

    // 4. Associar management rules ao workspace
    await prisma.managementRule.updateMany({
      where: { manager_id: user.id },
      data: { workspace_id: workspace.id },
    });
  }
}
```

### Fase 3: Schema Final

- [ ] Tornar `workspace_id` NOT NULL em Team
- [ ] Tornar `workspace_id` NOT NULL em ManagementRule
- [ ] Remover colunas `is_admin` e `is_manager` de User
- [ ] Executar migration final

### Fase 4: Código

- [ ] Atualizar AuthService (criar workspace no registro)
- [ ] Atualizar JWT payload (adicionar workspaceId)
- [ ] Criar WorkspaceModule, Service, Controller
- [ ] Atualizar TeamsService (filtrar por workspace)
- [ ] Atualizar ManagementService (filtrar por workspace)
- [ ] Criar WorkspaceRoleGuard

### Fase 5: Frontend

- [ ] Criar WorkspaceContext
- [ ] Workspace Switcher UI
- [ ] Atualizar todas as queries (adicionar workspaceId)
- [ ] Settings do workspace

---

## ⚠️ Avisos Importantes

### 1. **BREAKING CHANGES**

- ❌ `is_admin` e `is_manager` não existem mais
- ❌ Times não são mais únicos globalmente
- ❌ Todas as queries precisam filtrar por workspace

### 2. **Performance**

- ✅ Adicionar índice em `workspace_id` em todos os models
- ✅ Queries compostas: `(workspace_id, name)`, `(workspace_id, manager_id)`

### 3. **Segurança**

- ✅ Sempre validar se user pertence ao workspace
- ✅ WorkspaceMemberGuard em todas as rotas
- ✅ Verificar role no workspace antes de ações sensíveis

### 4. **Dados Existentes**

- ⚠️ Precisa migração de dados
- ⚠️ Não pode fazer rollback facilmente
- ⚠️ Fazer backup antes da migration

---

## 🚀 Benefícios

1. ✅ **Multi-tenancy**: Usuários podem ter múltiplos workspaces
2. ✅ **Isolamento**: Dados completamente separados
3. ✅ **Permissões**: Granularidade por workspace
4. ✅ **Escalabilidade**: Base para SaaS
5. ✅ **Colaboração**: Convidar usuários para workspaces

---

## 📊 Comparação de Permissões

### ANTES

```typescript
if (user.is_admin) {
  // Admin global - pode fazer tudo
}
```

### DEPOIS

```typescript
if (user.currentWorkspace.role === 'OWNER') {
  // Owner apenas no workspace atual
  // Pode ser MEMBER em outro workspace
}
```

**Vantagem:** Controle granular por workspace! 🎯
