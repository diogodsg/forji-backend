# Fase 4: Users Integration - Progresso

## ✅ Tarefas Completas (100%)

### 4.1 - Criar Users API Endpoints ✅

**Arquivo:** `/frontend/src/lib/api/endpoints/users.ts`

Endpoints implementados (7 métodos):

- `findAll(params)` - GET /users (com paginação)
- `search(query)` - GET /users/search (busca por nome/email)
- `create(dto)` - POST /users (criar usuário - admin)
- `findOne(id)` - GET /users/:id (detalhes)
- `update(id, dto)` - PATCH /users/:id (atualizar perfil)
- `updatePassword(id, dto)` - PATCH /users/:id/password (trocar senha)
- `remove(id)` - DELETE /users/:id (soft delete)

**Tipos TypeScript:**

```typescript
-User - // Modelo do usuário
  PaginatedUsers - // Response com paginação
  CreateUserDto - // Criar usuário
  UpdateUserDto - // Atualizar perfil
  UpdatePasswordDto - // Trocar senha
  SearchUsersParams - // Params de busca
  ListUsersParams; // Params de listagem
```

### 4.2 - Criar useUsers Hook ✅

**Arquivo:** `/frontend/src/features/users/hooks/useUsers.ts`

**Estado gerenciado:**

- `users[]` - Lista de usuários
- `pagination` - Metadados de paginação (total, page, limit, totalPages)
- `currentUser` - Usuário atualmente selecionado
- `loading` - Estado de carregamento

**Métodos disponíveis:**

```typescript
// Listagem e busca
fetchUsers(params?)      // Lista com paginação
searchUsers(query)       // Busca por nome/email
clearSearch()            // Limpa busca

// CRUD
createUser(dto)          // Cria novo (admin)
fetchUser(id)            // Detalhes
updateUser(id, dto)      // Atualiza perfil
updatePassword(id, dto)  // Troca senha
removeUser(id)           // Remove (soft delete)
```

**Integração com Toast:**

- ✅ Success: "Usuário criado/atualizado/removido com sucesso"
- ❌ Error: Mostra mensagem de erro da API
- 🔒 Success: "Senha atualizada com sucesso!"

### 4.3 - Exportar no Barrel ✅

**Arquivos atualizados:**

- `/frontend/src/lib/api/index.ts` - Exporta usersApi + 7 tipos
- `/frontend/src/features/users/index.ts` - Exporta useUsers

## 📊 Estrutura de Arquivos Criada

```
frontend/src/
├── lib/api/
│   ├── endpoints/
│   │   ├── auth.ts         ✅ (Fase 2)
│   │   ├── workspaces.ts   ✅ (Fase 3)
│   │   └── users.ts        ✅ (Fase 4 - NOVO)
│   └── index.ts            ✅ (atualizado)
│
└── features/
    ├── workspaces/
    │   ├── hooks/useWorkspaces.ts  ✅ (Fase 3)
    │   └── index.ts
    │
    └── users/
        ├── hooks/
        │   └── useUsers.ts         ✅ (Fase 4 - NOVO)
        └── index.ts                ✅ (NOVO)
```

## 🎯 Features Implementadas

### Paginação Inteligente

```typescript
const { users, pagination, fetchUsers } = useUsers();

// Página 1, 20 itens
await fetchUsers({ page: 1, limit: 20 });

// Com busca
await fetchUsers({ page: 1, limit: 20, search: "João" });

// Metadados disponíveis
console.log(pagination);
// {
//   total: 150,
//   page: 1,
//   limit: 20,
//   totalPages: 8
// }
```

### Busca em Tempo Real

```typescript
const { searchUsers, clearSearch } = useUsers();

// Busca por nome ou email
const results = await searchUsers("maria@example.com");

// Limpar resultados
clearSearch();
```

### Gestão de Senhas

```typescript
const { updatePassword } = useUsers();

await updatePassword(userId, {
  currentPassword: "senha123",
  newPassword: "novaSenha456",
});
// Toast: "Senha atualizada com sucesso!"
```

## 📝 Uso do Hook

### Exemplo: Admin Users Page

```tsx
import { useUsers } from "@/features/users";
import { useEffect } from "react";

function AdminUsersPage() {
  const { users, pagination, loading, fetchUsers, createUser, removeUser } =
    useUsers();

  useEffect(() => {
    fetchUsers({ page: 1, limit: 20 });
  }, [fetchUsers]);

  const handleCreate = async () => {
    await createUser({
      name: "Novo Usuário",
      email: "novo@example.com",
      password: "senha123",
      position: "Developer",
      isAdmin: false,
    });
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Remover usuário?")) {
      await removeUser(userId);
    }
  };

  return (
    <div>
      <h1>Usuários ({pagination.total})</h1>

      {loading && <p>Carregando...</p>}

      <button onClick={handleCreate}>Criar Usuário</button>

      {users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button onClick={() => handleDelete(user.id)}>Remover</button>
        </div>
      ))}

      {/* Paginação */}
      <div>
        Página {pagination.page} de {pagination.totalPages}
      </div>
    </div>
  );
}
```

### Exemplo: User Search Component

```tsx
import { useUsers } from "@/features/users";
import { useState } from "react";

function UserSearch() {
  const [query, setQuery] = useState("");
  const { users, searchUsers, clearSearch } = useUsers();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await searchUsers(query);
    } else {
      clearSearch();
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome ou email..."
      />
      <button type="submit">Buscar</button>

      {users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
```

### Exemplo: Change Password Modal

```tsx
import { useUsers } from "@/features/users";
import { useState } from "react";

function ChangePasswordModal({ userId }: { userId: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { updatePassword, loading } = useUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePassword(userId, {
        currentPassword,
        newPassword,
      });
      // Toast de sucesso é mostrado automaticamente
      // Fechar modal aqui
    } catch (error) {
      // Toast de erro já foi mostrado
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Senha atual"
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Nova senha"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Atualizando..." : "Atualizar Senha"}
      </button>
    </form>
  );
}
```

## ✅ Checklist de Implementação

- [x] Criar users.ts com 7 endpoints
- [x] Definir tipos TypeScript (7 interfaces)
- [x] Criar useUsers hook com estado e métodos
- [x] Implementar paginação
- [x] Implementar busca em tempo real
- [x] Integrar toasts em todas as ações
- [x] Exportar no barrel (lib/api e features/users)
- [x] Validar sem erros de compilação
- [ ] Criar componentes UI (próximo passo)
- [ ] Integrar na admin page
- [ ] Testar fluxo completo end-to-end

## 🚀 Próximas Opções

**A) Criar UI para Users** (componentes visuais)

- AdminUsersPage (lista + paginação)
- CreateUserModal
- EditUserModal
- ChangePasswordModal
- UserSearchBar

**B) Fase 5: Teams Integration**

- Endpoints de teams (10 endpoints)
- Hook useTeams
- Integração com teams page

**C) Fase 6: Management Integration**

- Endpoints de management (6 endpoints)
- Hook useManagement
- Sistema de hierarquia

---

**Status:** Fase 4 completa - Infraestrutura de Users pronta  
**Progresso Geral:** 30% (13/43 tarefas)  
**Tempo estimado:** ~25 minutos de implementação
