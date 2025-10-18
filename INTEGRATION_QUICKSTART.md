# 🚀 Quick Start - Integração Backend-Frontend

Guia rápido para começar a implementação da integração.

---

## ✅ Pré-requisitos

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar .env
cp .env.example .env
# Editar DATABASE_URL, JWT_SECRET

# Rodar migrations
npx prisma migrate dev

# Popular banco com dados de teste
npx prisma db seed

# Iniciar servidor
npm run start:dev
```

**Verificar:** http://localhost:8000/api/docs (Swagger UI deve abrir)

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Criar .env.development
echo 'VITE_API_BASE_URL=http://localhost:8000/api' > .env.development
echo 'VITE_ENABLE_MOCK_API=true' >> .env.development

# Iniciar app
npm run dev
```

**Verificar:** http://localhost:5173 (Login com diego@forge.com funciona)

---

## 📋 Checklist Fase 1: Setup Inicial

### Tarefa 1: Criar API Client

```bash
# Criar estrutura de pastas
cd frontend/src
mkdir -p lib/api/endpoints

# Criar arquivos
touch lib/api/client.ts
touch lib/api/index.ts
```

**Código:** Copiar de `INTEGRATION_EXAMPLES.md` seção 1

**Testar:**

```typescript
// Em algum componente temporário
import { apiClient } from "@/lib/api/client";

const test = async () => {
  try {
    const { data } = await apiClient.get("/health"); // se existir
    console.log("Backend conectado!", data);
  } catch (err) {
    console.error("Backend não conectado:", err);
  }
};
```

### Tarefa 2: Criar Tipos Compartilhados

```bash
# Na raiz do projeto
mkdir -p shared-types
touch shared-types/index.ts
```

**Código:** Copiar de `shared-types/index.ts` (já criado)

### Tarefa 3: Configurar Variáveis de Ambiente

```bash
cd frontend

# .env.development
cat > .env.development << 'EOF'
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ENABLE_MOCK_API=true
EOF

# .env.production
cat > .env.production << 'EOF'
VITE_API_BASE_URL=https://api.forge.com/api
VITE_ENABLE_MOCK_API=false
EOF
```

### Tarefa 4: Criar Barrel Exports

```bash
cd frontend/src/lib/api
touch index.ts
```

**Código:**

```typescript
export { apiClient, extractErrorMessage, isMockMode } from "./client";
// Adicionar mais exports conforme criar endpoints
```

### Tarefa 5: Testar Conexão

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Testar
curl http://localhost:8000/api/auth/me
# Deve retornar 401 (esperado - sem token)
```

**✅ Fase 1 Completa quando:**

- [ ] Backend rodando em localhost:8000
- [ ] Frontend rodando em localhost:5173
- [ ] API client criado e configurado
- [ ] Tipos compartilhados definidos
- [ ] Variáveis de ambiente configuradas

---

## 🔐 Checklist Fase 2: Auth Integration

### Tarefa 1: Criar Auth Service

```bash
cd frontend/src/lib/api/endpoints
touch auth.ts
```

**Código:** Copiar de `INTEGRATION_EXAMPLES.md` seção 2

### Tarefa 2: Refatorar useAuth Hook

**Arquivo:** `frontend/src/features/auth/hooks/useAuth.tsx`

**Passos:**

1. Importar `authApi` de `@/lib/api`
2. Substituir `mockLogin` por `authApi.login` (manter fallback)
3. Substituir `mockRegister` por `authApi.register`
4. Substituir validação de token por `authApi.me`

**Código:** Copiar de `INTEGRATION_EXAMPLES.md` seção 3

### Tarefa 3: Criar Toast System

```bash
cd frontend/src/components
touch Toast.tsx
```

**Código:** Copiar de `INTEGRATION_EXAMPLES.md` seção 8

**Integrar no App:**

```typescript
// frontend/src/App.tsx
import { ToastProvider } from "@/components/Toast";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>{/* resto da app */}</AuthProvider>
    </ToastProvider>
  );
}
```

### Tarefa 4: Testar Login Real

**Passos:**

1. Criar usuário no backend via Swagger ou seed
2. Tentar login no frontend
3. Verificar console logs
4. Verificar token no localStorage
5. Recarregar página (sessão deve persistir)

**Teste Manual:**

```bash
# 1. Abrir frontend: http://localhost:5173
# 2. Abrir DevTools (F12)
# 3. Fazer login:
Email: diego@forge.com  # Se existir no seed
Senha: 123456           # Ou a senha do seed

# 4. Console deve mostrar:
# ✅ Login bem-sucedido: Diego Santos

# 5. Application tab > localStorage deve ter:
# auth:token = "eyJhbGc..."

# 6. Recarregar página
# Console deve mostrar:
# ✅ Usuário autenticado: Diego Santos
```

**✅ Fase 2 Completa quando:**

- [ ] Login com backend funciona
- [ ] Registro com backend funciona
- [ ] Token persiste no localStorage
- [ ] Sessão restaura após reload
- [ ] Logout limpa token
- [ ] Toast notifications funcionam

---

## 👥 Checklist Fase 4: Users Integration

_(Pular Fase 3 - Workspaces por enquanto)_

### Tarefa 1: Criar Users Service

```bash
cd frontend/src/lib/api/endpoints
touch users.ts
```

**Código:** Copiar de `INTEGRATION_EXAMPLES.md` seção 4

### Tarefa 2: Refatorar useAdminUsers

**Arquivo:** `frontend/src/features/admin/hooks/useAdminUsers.ts`

**Mudanças principais:**

```typescript
// ANTES
const users = getMockUsers();

// DEPOIS
const fetchUsers = async () => {
  try {
    const response = await usersApi.list({ page: 1, limit: 100 });
    setUsers(response.data);
  } catch (err) {
    if (import.meta.env.VITE_ENABLE_MOCK_API === "true") {
      setUsers(getMockUsers()); // fallback
    } else {
      setError(err.message);
    }
  }
};
```

### Tarefa 3: Testar CRUD de Usuários

**Teste Manual:**

1. Login como admin
2. Ir para Admin > Pessoas
3. Lista deve carregar do banco
4. Criar novo usuário
5. Editar usuário
6. Deletar usuário

**Verificar no console:**

```
✅ Usuários carregados: 5
✅ Usuário criado: João Silva
✅ Usuário atualizado: João Silva Santos
✅ Usuário deletado: uuid-123
```

**✅ Fase 4 Completa quando:**

- [ ] Listar usuários do banco
- [ ] Buscar usuário funciona
- [ ] Criar usuário persiste
- [ ] Editar usuário atualiza banco
- [ ] Deletar usuário (soft delete)
- [ ] Paginação funciona

---

## 🏆 Checklist Fase 5: Teams Integration

### Tarefa 1: Criar Teams Service

```bash
cd frontend/src/lib/api/endpoints
touch teams.ts
```

**Código:** Copiar de `INTEGRATION_EXAMPLES.md` seção 5

### Tarefa 2: Refatorar useTeamManagement

**Arquivo:** `frontend/src/features/admin/hooks/useTeamManagement.ts`

**Mudanças principais:**

```typescript
// refresh()
const response = await teamsApi.list();
setTeams(response);

// selectTeam()
const details = await teamsApi.getById(teamId);
setSelectedTeam(details);

// createTeam()
const newTeam = await teamsApi.create(data);
setTeams((prev) => [...prev, newTeam]);

// addMember()
await teamsApi.addMember(teamId, { userId, role });
```

### Tarefa 3: Testar Gestão de Times

**Teste Manual:**

1. Admin > Organização > Times
2. Criar novo time
3. Selecionar time
4. Adicionar membros
5. Alterar role de membro
6. Remover membro
7. Deletar time

**✅ Fase 5 Completa quando:**

- [ ] Listar times do banco
- [ ] Criar time persiste
- [ ] Adicionar membro funciona
- [ ] Alterar role funciona
- [ ] Remover membro funciona
- [ ] Deletar time (soft delete)

---

## 📊 Checklist Fase 6: Management Integration

### Tarefa 1: Criar Management Service

```bash
cd frontend/src/lib/api/endpoints
touch management.ts
```

**Código:** Copiar de `INTEGRATION_EXAMPLES.md` seção 6

### Tarefa 2: Criar useManagement Hook

```bash
cd frontend/src/features/admin/hooks
touch useManagement.ts
```

### Tarefa 3: Integrar nos Componentes

**Componentes a atualizar:**

- `HierarchyModal.tsx`
- `AdminSubordinatesManagement.tsx`
- `AdminCreateRuleModal.tsx`

### Tarefa 4: Testar Hierarquia

**Teste Manual:**

1. Admin > Organização > Hierarquia
2. Criar regra INDIVIDUAL (gerente → subordinado)
3. Criar regra TEAM (gerente → time)
4. Listar subordinados do gerente
5. Deletar regra

**✅ Fase 6 Completa quando:**

- [ ] Criar regra INDIVIDUAL funciona
- [ ] Criar regra TEAM funciona
- [ ] Listar subordinados funciona
- [ ] Listar times gerenciados funciona
- [ ] Deletar regra funciona
- [ ] Previne hierarquia circular

---

## 🧪 Testes Rápidos

### Teste de Conexão

```bash
# Backend health check
curl http://localhost:8000/api/auth/me

# Frontend -> Backend
# Abrir console no browser:
fetch('http://localhost:8000/api/auth/me', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth:token') }
}).then(r => r.json()).then(console.log)
```

### Teste de Auth

```typescript
// No console do browser
const login = async () => {
  const res = await fetch("http://localhost:8000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "diego@forge.com", password: "123456" }),
  });
  const data = await res.json();
  console.log(data);
  localStorage.setItem("auth:token", data.access_token);
};
login();
```

### Teste de Users

```typescript
// No console do browser (após login)
const getUsers = async () => {
  const token = localStorage.getItem("auth:token");
  const res = await fetch("http://localhost:8000/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  console.log("Usuários:", data);
};
getUsers();
```

---

## 🐛 Troubleshooting Rápido

### Backend não inicia

```bash
# Verificar PostgreSQL
sudo systemctl status postgresql

# Verificar porta
sudo ss -tulpn | grep 8000

# Logs do backend
cd backend
npm run start:dev
# Verificar erros no console
```

### Frontend não conecta

```bash
# Verificar CORS no backend
# backend/src/main.ts deve ter:
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});

# Verificar .env.development
cat frontend/.env.development
# Deve ter: VITE_API_BASE_URL=http://localhost:8000/api
```

### Token inválido

```typescript
// Limpar token e tentar novamente
localStorage.removeItem("auth:token");
// Fazer login novamente
```

### CORS Error

```bash
# Backend: backend/src/main.ts
app.enableCors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
});

# Reiniciar backend
```

---

## 📞 Recursos

### Documentação

- [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md) - Plano completo
- [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md) - Código pronto
- [INTEGRATION_ROADMAP.md](./INTEGRATION_ROADMAP.md) - Checklist visual

### Backend

- Swagger UI: http://localhost:8000/api/docs
- README: `/backend/README.md`
- API Docs: `/backend/API_DOCUMENTATION.md`

### Frontend

- App: http://localhost:5173
- README: `/frontend/README.md`

### Suporte

- Backend issues: Verificar logs em `npm run start:dev`
- Frontend issues: Verificar console do browser (F12)
- Prisma issues: `npx prisma studio` para debug do banco

---

## 🎯 Próximos Passos

1. ✅ Completar Fase 1 (Setup)
2. ✅ Completar Fase 2 (Auth)
3. ✅ Completar Fase 4 (Users)
4. ✅ Completar Fase 5 (Teams)
5. ✅ Completar Fase 6 (Management)
6. ⏭️ Fase 3 (Workspaces) - opcional
7. ⏭️ Fase 7 (Testing)
8. ⏭️ Fase 8 (Production)

**Tempo estimado:** 2-3 semanas para fases 1, 2, 4, 5, 6

---

**Última Atualização:** 17 de outubro de 2025  
**Status:** 📝 Pronto para implementação
