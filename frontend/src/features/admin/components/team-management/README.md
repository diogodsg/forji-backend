# Team Management Components

Componentes para gerenciamento de equipes e estrutura organizacional.

## 📦 Componentes

### TeamsManagement

**Linhas**: 683 (⚠️ Candidato a refatoração)

**Responsabilidade**: Gerenciar equipes, membros e atribuições.

**Features**:

- CRUD de equipes
- Atribuir membros
- Definir líderes
- Visualizar estrutura

**Props**:

```typescript
interface TeamsManagementProps {
  teams: Team[];
  users: AdminUser[];
  onUpdate: (team: Team) => void;
}
```

**Estado Atual**: Componente monolítico que gerencia múltiplas responsabilidades.

---

## 🔄 Refatoração Futura

### TeamsManagement (683 linhas)

**Proposta de quebra**:

```
teams/
├── TeamsManagement.tsx (orquestrador ~150 linhas)
├── TeamCard.tsx
├── TeamsList.tsx
├── TeamMembersList.tsx
├── TeamForm.tsx
├── AssignMembersModal.tsx
├── useTeams.ts (hook com lógica)
├── types.ts
└── index.ts
```

**Benefícios**:

- Componentes com responsabilidade única
- Melhor testabilidade
- Reusabilidade de TeamCard
- Lógica separada em custom hook

---

## 🎯 Uso

```tsx
import { TeamsManagement } from "@/features/admin/components/team-management";

function AdminTeamsPage() {
  const { teams, isLoading } = useAdminTeams();

  return (
    <TeamsManagement
      teams={teams}
      users={allUsers}
      onUpdate={handleTeamUpdate}
    />
  );
}
```

---

## 🔗 Dependências

- `useAdminTeams` hook (em `/hooks`)
- `teamsApi` service (em `/services`)
- `Team` type (em `/types`)

---

**Mantido por**: Admin Team  
**Última revisão**: 16 de Outubro de 2025
