# Sistema de Management - Plataforma Forge

## Visão Geral

Este documento descreve o sistema de gerenciamento de usuários, equipes, hierarquias e permissões da plataforma Forge, incluindo controle de acesso a PDIs e gestão organizacional.

**🎯 Abordagem MVP**: Sistema simples e pragmático que pode evoluir conforme necessidade real, evitando over-engineering.

## 1. Estrutura MVP - Usuários

### 1.1 Modelo Simplificado de Usuário

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  githubId?: string;
  level: UserLevel; // Sistema simples de níveis
  managedTeams: number[]; // Times que pode gerenciar
  specialPermissions: string[]; // Apenas permissões extras
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 1.2 Sistema de Níveis (3 Níveis Principais)

```typescript
enum UserLevel {
  ADMIN = 4, // CEO/Admin total - vê/faz tudo
  MANAGER = 3, // Gerente - gerencia times específicos
  MEMBER = 1, // Colaborador - acesso básico
}

// Evolução futura (quando necessário):
// DIRECTOR = 4  // Entre admin e manager
// SENIOR = 2    // Entre manager e member
```

### 1.3 Regra de Acesso Simplificada

```typescript
function canAccess(user: User, resource: any): boolean {
  // Admin vê tudo
  if (user.level >= UserLevel.ADMIN) return true;

  // Manager vê seus times
  if (
    user.level >= UserLevel.MANAGER &&
    user.managedTeams.includes(resource.teamId)
  )
    return true;

  // Permissões especiais
  if (user.specialPermissions.includes(getRequiredPermission(resource)))
    return true;

  // Próprios dados
  if (resource.userId === user.id) return true;

  return false;
}
```

## 2. Estrutura MVP - Equipes

### 2.1 Modelo Simplificado de Equipe

```typescript
interface Team {
  id: number;
  name: string;
  description?: string;
  area?: string; // Opcional: "tech", "sales" (string livre)
  managerId: number; // UM responsável direto
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMember {
  userId: number;
  teamId: number;
  isManager: boolean; // Simplificado: manager ou membro
  joinedAt: Date;
}
```

### 2.2 Áreas Flexíveis (Opcional)

```typescript
// Sem estrutura rígida - apenas tags livres
interface Area {
  name: string; // "tech", "vendas", "marketing"
  managers: number[]; // Users que podem ver todos os times desta área
}

// Exemplo de uso:
const areas = [
  { name: "tech", managers: [1, 2] }, // João e Maria veem todos os times tech
  { name: "vendas", managers: [3] }, // Pedro vê todos os times de vendas
];
```

## 3. Sistema MVP - Hierarquias

### 3.1 Princípios Simplificados

- **1 responsável direto por equipe**: Cada time tem um `managerId`
- **Acesso por nível**: Admin vê tudo, Manager vê seus times
- **Casos especiais**: Via `specialPermissions` quando necessário
- **Evolução gradual**: Sistema pode crescer conforme necessidade

### 3.2 Regras de Acesso Diretas

```typescript
// Sem tabela complexa de hierarquia - lógica direta no código
function getUserAccessibleTeams(user: User): Team[] {
  // Admin vê todos
  if (user.level >= UserLevel.ADMIN) {
    return getAllTeams();
  }

  // Manager vê seus times + times por área (se configurado)
  let accessibleTeams = getTeamsByIds(user.managedTeams);

  // Acesso por área (se user tem permissão especial)
  if (user.specialPermissions.includes("view_area_tech")) {
    accessibleTeams.push(...getTeamsByArea("tech"));
  }

  return accessibleTeams;
}

// Casos especiais via permissões
const specialPermissions = [
  "view_area_tech", // Ver todos os times de tech
  "view_area_sales", // Ver todos os times de vendas
  "manage_all_pdis", // Gerenciar todos os PDIs (ex: RH)
  "view_all_reports", // Ver todos os relatórios
  "temp_access_team_5", // Acesso temporário ao time 5
];
```

## 4. Sistema MVP - Permissões

### 4.1 Permissões Básicas por Nível

```typescript
// Permissões automáticas por nível (sem configuração)
const levelPermissions = {
  [UserLevel.ADMIN]: ["view_all", "edit_all", "manage_all", "delete_all"],
  [UserLevel.MANAGER]: [
    "view_own_teams",
    "edit_own_teams",
    "manage_team_members",
    "view_team_pdis",
  ],
  [UserLevel.MEMBER]: [
    "view_own_profile",
    "edit_own_profile",
    "view_own_pdi",
    "edit_own_pdi",
  ],
};
```

### 4.2 Permissões Especiais (Casos Extras)

```typescript
// Apenas quando a permissão padrão não resolve
const specialPermissions = [
  // Acesso por área
  "view_area_tech", // Ver todos os times de tech
  "view_area_sales", // Ver todos os times de vendas
  "manage_area_tech", // Gerenciar todos os times de tech

  // Funcionalidades específicas
  "manage_all_pdis", // RH pode gerenciar todos os PDIs
  "view_all_reports", // Controladoria vê todos os relatórios
  "export_data", // Pode exportar dados
  "invite_users", // Pode convidar novos usuários

  // Acesso temporário/projeto
  "temp_access_team_5", // Acesso temporário ao time 5
  "project_x_access", // Acesso especial para projeto X
];

function hasPermission(user: User, action: string, resource?: any): boolean {
  // Permissões por nível
  const levelPerms = levelPermissions[user.level] || [];

  if (levelPerms.includes("view_all") && action.startsWith("view")) return true;
  if (levelPerms.includes("edit_all") && action.startsWith("edit")) return true;
  if (levelPerms.includes("manage_all") && action.startsWith("manage"))
    return true;

  // Permissões específicas dos times gerenciados
  if (resource?.teamId && user.managedTeams.includes(resource.teamId)) {
    if (levelPerms.includes("view_own_teams") && action.startsWith("view"))
      return true;
    if (levelPerms.includes("edit_own_teams") && action.startsWith("edit"))
      return true;
    if (levelPerms.includes("manage_team_members") && action === "manage_team")
      return true;
  }

  // Permissões especiais
  if (user.specialPermissions.includes(action)) return true;

  // Próprios dados
  if (resource?.userId === user.id && action.endsWith("own")) return true;

  return false;
}
```

## 5. Casos de Uso MVP - Por Nível

### 5.1 Admin (Nível 4)

```typescript
const adminUser = {
  level: UserLevel.ADMIN,
  managedTeams: [], // Não precisa - vê tudo
  specialPermissions: [], // Não precisa - pode tudo
};

// O que pode fazer:
// ✅ Ver/editar todos os usuários
// ✅ Criar/gerenciar todas as equipes
// ✅ Ver/aprovar todos os PDIs
// ✅ Acessar todos os relatórios
// ✅ Gerenciar permissões do sistema
```

### 5.2 Manager (Nível 3)

```typescript
// Exemplo: João é gerente dos times Frontend (1) e Mobile (2)
const managerUser = {
  level: UserLevel.MANAGER,
  managedTeams: [1, 2], // Frontend e Mobile
  specialPermissions: ["view_area_tech"], // Pode ver outros times de tech
};

// O que pode fazer:
// ✅ Ver/editar membros do Frontend e Mobile
// ✅ Gerenciar times Frontend e Mobile
// ✅ Ver/gerenciar PDIs dos membros desses times
// ✅ Ver times de tech (via permissão especial)
// ❌ Não pode gerenciar times de vendas
// ❌ Não pode deletar usuários
```

### 5.3 Member (Nível 1)

```typescript
const memberUser = {
  level: UserLevel.MEMBER,
  managedTeams: [], // Não gerencia nada
  specialPermissions: [], // Sem permissões extras
};

// O que pode fazer:
// ✅ Ver/editar próprio perfil
// ✅ Ver/editar próprio PDI
// ✅ Ver informações básicas dos colegas de time
// ❌ Não pode gerenciar outras pessoas
// ❌ Não pode ver PDIs de outros
// ❌ Não pode criar times
```

### 5.4 Casos Especiais (via specialPermissions)

```typescript
// RH pode gerenciar todos os PDIs
const hrUser = {
  level: UserLevel.MEMBER,
  managedTeams: [],
  specialPermissions: ["manage_all_pdis", "view_all_reports"],
};

// Diretor de Tech vê todos os times de tech
const techDirectorUser = {
  level: UserLevel.MANAGER,
  managedTeams: [1, 2, 3], // Times diretos
  specialPermissions: ["view_area_tech", "manage_area_tech"],
};
```

## 6. MVP - Acesso a PDI

### 6.1 Regras Simples de PDI

```typescript
function canViewPDI(viewer: User, targetUserId: number): boolean {
  // Próprio PDI
  if (viewer.id === targetUserId) return true;

  // Admin vê todos
  if (viewer.level >= UserLevel.ADMIN) return true;

  // Manager vê PDIs dos membros dos seus times
  if (viewer.level >= UserLevel.MANAGER) {
    const targetTeams = getTeamsByUserId(targetUserId);
    const hasCommonTeam = targetTeams.some((team) =>
      viewer.managedTeams.includes(team.id)
    );
    if (hasCommonTeam) return true;
  }

  // Permissão especial (ex: RH)
  if (viewer.specialPermissions.includes("manage_all_pdis")) return true;

  return false;
}

function canEditPDI(viewer: User, targetUserId: number): boolean {
  // Próprio PDI (sempre pode editar)
  if (viewer.id === targetUserId) return true;

  // Admin pode editar todos
  if (viewer.level >= UserLevel.ADMIN) return true;

  // Permissão especial (ex: RH)
  if (viewer.specialPermissions.includes("manage_all_pdis")) return true;

  return false;
}
```

### 6.2 Fluxo de Aprovação Simplificado

```typescript
enum PDIStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
}

interface PDI {
  id: number;
  userId: number;
  status: PDIStatus;
  approvedBy?: number; // ID do aprovador
  rejectedBy?: number; // ID de quem rejeitou
  approvedAt?: Date;
  content: any; // Conteúdo do PDI
}

function canApprovePDI(approver: User, pdi: PDI): boolean {
  // Admin pode aprovar todos
  if (approver.level >= UserLevel.ADMIN) return true;

  // Manager pode aprovar PDIs dos membros dos seus times
  if (approver.level >= UserLevel.MANAGER) {
    const targetTeams = getTeamsByUserId(pdi.userId);
    const hasCommonTeam = targetTeams.some((team) =>
      approver.managedTeams.includes(team.id)
    );
    if (hasCommonTeam) return true;
  }

  // Permissão especial
  if (approver.specialPermissions.includes("manage_all_pdis")) return true;

  return false;
}

// Fluxo simples: Submete -> Manager aprova -> Finalizado
// (Sem múltiplas etapas de aprovação por enquanto)
```

## 7. MVP - Gestão de Times

### 7.1 Regras Simples de Gestão

```typescript
function canManageTeam(user: User, teamId: number): boolean {
  // Admin pode gerenciar todos
  if (user.level >= UserLevel.ADMIN) return true;

  // Manager pode gerenciar seus times
  if (user.level >= UserLevel.MANAGER && user.managedTeams.includes(teamId))
    return true;

  // Permissão especial por área
  const team = getTeam(teamId);
  if (
    team?.area &&
    user.specialPermissions.includes(`manage_area_${team.area}`)
  )
    return true;

  return false;
}

function canViewTeam(user: User, teamId: number): boolean {
  // Pode gerenciar = pode ver
  if (canManageTeam(user, teamId)) return true;

  // Member pode ver times que participa
  if (isTeamMember(user.id, teamId)) return true;

  // Permissão especial de visualização por área
  const team = getTeam(teamId);
  if (team?.area && user.specialPermissions.includes(`view_area_${team.area}`))
    return true;

  return false;
}
```

### 7.2 Ações por Nível

```typescript
interface TeamActions {
  view: boolean;
  editInfo: boolean; // Nome, descrição
  addMember: boolean;
  removeMember: boolean;
  changeManager: boolean; // Trocar responsável
  deleteTeam: boolean;
}

function getTeamActions(user: User, teamId: number): TeamActions {
  const canManage = canManageTeam(user, teamId);
  const canView = canViewTeam(user, teamId);

  return {
    view: canView,
    editInfo: canManage,
    addMember: canManage,
    removeMember: canManage,
    changeManager:
      user.level >= UserLevel.ADMIN ||
      user.specialPermissions.includes("manage_all_teams"),
    deleteTeam: user.level >= UserLevel.ADMIN,
  };
}
```

## 8. MVP - Implementação no Frontend

### 8.1 Estrutura Atual (3 Tabs por enquanto)

```typescript
const tabs = [
  {
    id: "people",
    label: "Pessoas",
    description: "Onboarding e gestão de colaboradores",
    component: <WorkflowPeopleTab />,
  },
  {
    id: "organization",
    label: "Organização",
    description: "Equipes e hierarquias",
    component: <OrganizationTab />,
  },
  {
    id: "insights",
    label: "Insights",
    description: "Relatórios e análises",
    component: <InsightsTab />,
  },
  // Tab "Permissões" será adicionada quando necessário
];
```

### 8.2 Hook Simplificado de Permissões

```typescript
function usePermissions() {
  const { user } = useAuth();

  const canView = (resource: string, resourceId?: number) => {
    if (!user) return false;
    if (user.level >= UserLevel.ADMIN) return true;

    switch (resource) {
      case "team":
        return canViewTeam(user, resourceId!);
      case "user_pdi":
        return canViewPDI(user, resourceId!);
      case "all_teams":
        return user.specialPermissions.includes("view_all_teams");
      default:
        return false;
    }
  };

  const canManage = (resource: string, resourceId?: number) => {
    if (!user) return false;
    if (user.level >= UserLevel.ADMIN) return true;

    switch (resource) {
      case "team":
        return canManageTeam(user, resourceId!);
      case "user_pdi":
        return canEditPDI(user, resourceId!);
      default:
        return false;
    }
  };

  const isAdmin = () => user?.level >= UserLevel.ADMIN;
  const isManager = () => user?.level >= UserLevel.MANAGER;

  return { canView, canManage, isAdmin, isManager };
}

// Componente de proteção simples
function ProtectedAction({
  level,
  teams,
  fallback,
  children,
}: {
  level?: UserLevel;
  teams?: number[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return fallback || null;

  // Verificar nível
  if (level && user.level < level) return fallback || null;

  // Verificar acesso a times específicos
  if (teams && !teams.some((teamId) => user.managedTeams.includes(teamId))) {
    return fallback || null;
  }

  return <>{children}</>;
}

// Exemplo de uso:
function TeamManagementButton({ teamId }: { teamId: number }) {
  return (
    <ProtectedAction
      level={UserLevel.MANAGER}
      teams={[teamId]}
      fallback={<span>Sem permissão</span>}
    >
      <button onClick={() => manageTeam(teamId)}>Gerenciar Time</button>
    </ProtectedAction>
  );
}
```

## 9. Casos de Uso Práticos

### 9.1 Cenário: Diretor de Tech

**João é Diretor de Tecnologia**

- ✅ Pode ver todos os colaboradores de Tech
- ✅ Pode criar novos times em Tech
- ✅ Pode gerenciar times Frontend, Backend, Mobile
- ✅ Pode ver e aprovar PDIs de todos de Tech
- ✅ Pode promover/rebaixar pessoas dentro de Tech
- ❌ Não pode ver colaboradores de Vendas
- ❌ Não pode deletar a empresa inteira

### 9.2 Cenário: Gerente Frontend

**Maria é Gerente do Time Frontend**

- ✅ Pode ver membros do time Frontend
- ✅ Pode adicionar/remover pessoas do Frontend
- ✅ Pode ver e gerenciar PDIs dos membros do Frontend
- ✅ Pode ver métricas do time Frontend
- ❌ Não pode ver membros do time Backend
- ❌ Não pode criar novos times
- ❌ Não pode aprovar PDIs de outros times

### 9.3 Cenário: Colaborador Sênior

**Pedro é Desenvolvedor Sênior**

- ✅ Pode ver próprio perfil e PDI
- ✅ Pode ver informações básicas dos colegas de time
- ✅ Pode editar próprio PDI
- ❌ Não pode ver PDIs de outros
- ❌ Não pode gerenciar times
- ❌ Não pode convidar pessoas

## 10. Configuração e Customização

### 10.1 Templates de Role

O sistema oferece templates padrão, mas permite customização:

```typescript
const roleTemplates = {
  CEO: {
    permissions: ["*"], // Todas as permissões
    scope: "global",
  },
  DIRECTOR: {
    permissions: [
      "people.view.department",
      "people.invite.department",
      "org.teams.manage.department",
      "pdi.approve.department",
    ],
    scope: "department",
  },
  // ... outros templates
};

// Customização
function customizeRole(userId: number, additionalPermissions: string[]) {
  const user = getUser(userId);
  const basePermissions = roleTemplates[user.role].permissions;
  user.permissions = [...basePermissions, ...additionalPermissions];
}
```

### 10.2 Casos Especiais

- **Acesso temporário**: Permissões com data de expiração
- **Projetos especiais**: Acesso cruzado entre departamentos
- **Auditoria**: Log de todas as ações sensíveis
- **Delegação**: Transferir temporariamente responsabilidades

## Conclusão

Este sistema oferece uma estrutura flexível e escalável para gerenciar uma organização complexa, mantendo a segurança e clareza sobre quem pode fazer o quê. A implementação deve ser gradual, começando pelos casos mais comuns e evoluindo conforme necessário.
