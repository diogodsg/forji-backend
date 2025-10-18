# Fase 5: Teams Integration - Progresso

## ✅ Tarefas Completas (100%)

### 5.1 - Criar Teams API Endpoints ✅

**Arquivo:** `/frontend/src/lib/api/endpoints/teams.ts`

Endpoints implementados (10 métodos):

- `findAll(params)` - GET /teams (com filtros)
- `search(query)` - GET /teams/search (busca por nome)
- `create(dto)` - POST /teams (criar team)
- `findOne(id, includeMembers)` - GET /teams/:id (detalhes)
- `update(id, dto)` - PATCH /teams/:id (atualizar)
- `remove(id)` - DELETE /teams/:id (soft delete)
- `getMembers(id)` - GET /teams/:id/members (listar membros)
- `addMember(id, dto)` - POST /teams/:id/members (adicionar membro)
- `updateMemberRole(id, userId, dto)` - PATCH /teams/:id/members/:userId (alterar role)
- `removeMember(id, userId)` - DELETE /teams/:id/members/:userId (remover membro)

**Tipos TypeScript:**

```typescript
-Team - // Modelo do time
  TeamMember - // Membro do time
  TeamStatus - // "ACTIVE" | "ARCHIVED" | "INACTIVE"
  TeamMemberRole - // "LEADER" | "MEMBER"
  CreateTeamDto - // Criar time
  UpdateTeamDto - // Atualizar time
  AddMemberDto - // Adicionar membro
  UpdateMemberRoleDto - // Atualizar role
  ListTeamsParams; // Params de listagem
```

### 5.2 - Criar useTeams Hook ✅

**Arquivo:** `/frontend/src/features/teams/hooks/useTeams.ts`

**Estado gerenciado:**

- `teams[]` - Lista de times do workspace
- `currentTeam` - Time atualmente selecionado
- `members[]` - Lista de membros do time
- `loading` - Estado de carregamento

**Métodos disponíveis:**

```typescript
// Teams
fetchTeams(params?)      // Lista com filtros (status, includeMembers, etc)
searchTeams(query)       // Busca por nome
createTeam(dto)          // Cria novo
fetchTeam(id, includeMembers?)  // Detalhes
updateTeam(id, dto)      // Atualiza
removeTeam(id)           // Remove (soft delete)
clearSearch()            // Limpa busca

// Membros
fetchMembers(id)         // Lista membros
addMember(id, dto)       // Adiciona membro
updateMemberRole(id, userId, dto)  // Altera LEADER/MEMBER
removeMember(id, userId) // Remove membro
```

**Integração com Toast:**

- ✅ Success: "Time criado/atualizado/removido com sucesso"
- 👥 Success: "Membro adicionado/removido"
- 🎭 Success: "Papel do membro atualizado"
- ❌ Error: Mostra mensagem de erro da API

### 5.3 - Exportar no Barrel ✅

**Arquivos atualizados:**

- `/frontend/src/lib/api/index.ts` - Exporta teamsApi + 9 tipos
- `/frontend/src/features/teams/index.ts` - Exporta useTeams (adicionado aos hooks existentes)

## 📊 Estrutura de Arquivos Criada

```
frontend/src/
├── lib/api/
│   ├── endpoints/
│   │   ├── auth.ts         ✅ (Fase 2)
│   │   ├── workspaces.ts   ✅ (Fase 3)
│   │   ├── users.ts        ✅ (Fase 4)
│   │   └── teams.ts        ✅ (Fase 5 - NOVO)
│   └── index.ts            ✅ (atualizado)
│
└── features/
    ├── workspaces/
    │   ├── hooks/useWorkspaces.ts  ✅ (Fase 3)
    │   └── index.ts
    │
    ├── users/
    │   ├── hooks/useUsers.ts       ✅ (Fase 4)
    │   └── index.ts
    │
    └── teams/
        ├── hooks/
        │   ├── useTeams.ts         ✅ (Fase 5 - NOVO)
        │   └── ... (hooks existentes)
        ├── components/             ✅ (já existentes)
        └── index.ts                ✅ (atualizado)
```

## 🎯 Features Implementadas

### 1. Filtros Avançados na Listagem

```typescript
const { fetchTeams } = useTeams();

// Apenas times ativos
await fetchTeams({ status: "ACTIVE" });

// Com contagem de membros
await fetchTeams({ includeMemberCount: true });

// Com lista completa de membros
await fetchTeams({ includeMembers: true });

// Combinado
await fetchTeams({
  status: "ACTIVE",
  includeMembers: true,
  includeMemberCount: true,
});
```

### 2. Busca em Tempo Real

```typescript
const { searchTeams, clearSearch } = useTeams();

// Busca por nome
const results = await searchTeams("Frontend");

// Limpar resultados
clearSearch();
```

### 3. Gestão de Membros Completa

```typescript
const { addMember, updateMemberRole, removeMember } = useTeams();

// Adicionar membro
await addMember(teamId, {
  userId: "user-uuid",
  role: "MEMBER", // ou "LEADER"
});

// Promover a líder
await updateMemberRole(teamId, userId, {
  role: "LEADER",
});

// Remover membro
await removeMember(teamId, userId);
```

### 4. Status de Times

```typescript
// Status disponíveis:
type TeamStatus = "ACTIVE" | "ARCHIVED" | "INACTIVE";

// Arquivar time
await updateTeam(teamId, { status: "ARCHIVED" });

// Reativar
await updateTeam(teamId, { status: "ACTIVE" });
```

## 📝 Exemplos de Uso

### Exemplo 1: Teams Page

```tsx
import { useTeams } from "@/features/teams";
import { useEffect } from "react";

function TeamsPage() {
  const { teams, loading, fetchTeams, createTeam, removeTeam } = useTeams();

  useEffect(() => {
    fetchTeams({
      status: "ACTIVE",
      includeMemberCount: true,
    });
  }, [fetchTeams]);

  const handleCreate = async () => {
    await createTeam({
      name: "Frontend Team",
      description: "Desenvolvedores React",
      status: "ACTIVE",
    });
  };

  return (
    <div>
      <h1>Times ({teams.length})</h1>

      {loading && <p>Carregando...</p>}

      <button onClick={handleCreate}>Criar Time</button>

      {teams.map((team) => (
        <div key={team.id}>
          <h3>{team.name}</h3>
          <p>{team.description}</p>
          <span>Membros: {team.memberCount || 0}</span>
          <button onClick={() => removeTeam(team.id)}>Remover</button>
        </div>
      ))}
    </div>
  );
}
```

### Exemplo 2: Team Details Page

```tsx
import { useTeams } from "@/features/teams";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function TeamDetailsPage() {
  const { id } = useParams();
  const {
    currentTeam,
    members,
    loading,
    fetchTeam,
    fetchMembers,
    addMember,
    updateMemberRole,
    removeMember,
  } = useTeams();

  useEffect(() => {
    if (id) {
      fetchTeam(id, true); // Com membros incluídos
    }
  }, [id, fetchTeam]);

  const handleAddMember = async (userId: string) => {
    if (id) {
      await addMember(id, { userId, role: "MEMBER" });
    }
  };

  const handlePromoteToLeader = async (userId: string) => {
    if (id) {
      await updateMemberRole(id, userId, { role: "LEADER" });
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!currentTeam) return <p>Time não encontrado</p>;

  return (
    <div>
      <h1>{currentTeam.name}</h1>
      <p>{currentTeam.description}</p>
      <span>Status: {currentTeam.status}</span>

      <h2>Membros ({members.length})</h2>
      {members.map((member) => (
        <div key={member.id}>
          <h4>{member.user.name}</h4>
          <span>{member.role}</span>
          <button onClick={() => handlePromoteToLeader(member.userId)}>
            Promover a Líder
          </button>
          <button onClick={() => removeMember(currentTeam.id, member.userId)}>
            Remover
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Exemplo 3: Team Search Component

```tsx
import { useTeams } from "@/features/teams";
import { useState } from "react";

function TeamSearch() {
  const [query, setQuery] = useState("");
  const { teams, loading, searchTeams, clearSearch } = useTeams();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await searchTeams(query);
    } else {
      clearSearch();
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar time por nome..."
      />
      <button type="submit">Buscar</button>

      {loading && <p>Buscando...</p>}

      {teams.length > 0 && (
        <ul>
          {teams.map((team) => (
            <li key={team.id}>
              {team.name} - {team.status}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
```

### Exemplo 4: Add Member Modal

```tsx
import { useTeams } from "@/features/teams";
import { useUsers } from "@/features/users";
import { useState } from "react";

function AddMemberModal({ teamId }: { teamId: string }) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [role, setRole] = useState<"MEMBER" | "LEADER">("MEMBER");
  const { addMember, loading } = useTeams();
  const { users, fetchUsers } = useUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      await addMember(teamId, { userId: selectedUserId, role });
      // Toast de sucesso é mostrado automaticamente
      // Fechar modal aqui
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        <option value="">Selecione um usuário</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      <select value={role} onChange={(e) => setRole(e.target.value as any)}>
        <option value="MEMBER">Membro</option>
        <option value="LEADER">Líder</option>
      </select>

      <button type="submit" disabled={loading || !selectedUserId}>
        {loading ? "Adicionando..." : "Adicionar Membro"}
      </button>
    </form>
  );
}
```

## ✅ Checklist de Implementação

- [x] Criar teams.ts com 10 endpoints
- [x] Definir tipos TypeScript (9 interfaces + 2 enums)
- [x] Criar useTeams hook com estado e métodos
- [x] Implementar filtros avançados (status, includeMembers, etc)
- [x] Implementar busca em tempo real
- [x] Implementar gestão completa de membros
- [x] Integrar toasts em todas as ações
- [x] Exportar no barrel (lib/api e features/teams)
- [x] Validar sem erros de compilação
- [ ] Criar componentes UI específicos (próximo passo)
- [ ] Integrar na teams page existente
- [ ] Testar fluxo completo end-to-end

## 🚀 Próximas Opções

**A) Fase 6: Management Integration** (último!)

- Endpoints de management (6 endpoints)
- Hook useManagement
- Sistema de hierarquia e subordinados
- Regras de gerenciamento

**B) Integração com UI Existente**

- Refatorar hooks mock existentes (useMyTeam, etc)
- Conectar componentes existentes com useTeams
- Substituir mock data por API real

**C) Criar Novos Componentes UI**

- CreateTeamModal
- EditTeamModal
- AddMemberModal
- TeamStatusBadge
- MemberRoleSelector

---

**Status:** Fase 5 completa - Infraestrutura de Teams pronta  
**Progresso Geral:** 35% (15/43 tarefas)  
**Tempo estimado:** ~30 minutos de implementação

**🎉 Apenas 1 fase restante: Management!**
