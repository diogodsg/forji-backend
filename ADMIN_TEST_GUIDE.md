# 🔧 Guia de Teste - Admin System

## 🐛 Problema Resolvido

**Sintoma:** Ao acessar `/admin`, o usuário era deslogado automaticamente.

**Causa Raiz:**

1. Interceptor Axios fazia logout em **QUALQUER** erro 401
2. Hook `useAdminUsers` chamava `/api/users` ao montar
3. Se requisição falhasse com 401, logout automático era acionado

**Solução Implementada:**

- ✅ Interceptor agora só faz logout em erros 401 do endpoint `/auth/me`
- ✅ Outros endpoints 401 apenas logam erro no console
- ✅ Usuário não é deslogado por falta de permissão em endpoint específico

## 🧪 Como Testar

### Opção 1: Usando Dados MOCK (Desenvolvimento)

**1. Fazer Login com Usuário Admin:**

```
Email: diego@forge.com
Senha: senha123
```

**2. Acessar Admin:**

- Navegar para `http://localhost:5173/admin`
- ✅ Deve carregar a página de admin
- ✅ Não deve deslogar
- ⚠️ Pode mostrar erro no console (normal com mock)

**3. Verificar Funcionalidades:**

- **Tab "Pessoas":** Lista de usuários (mock data)
- **Tab "Equipes":** Lista de times (mock data)
- **Toast Notifications:** Devem aparecer nas ações

### Opção 2: Usando API Real (Produção)

**1. Desabilitar Mock:**

```bash
# frontend/.env.development
VITE_ENABLE_MOCK_API=false
```

**2. Criar Usuário Admin no Backend:**

```bash
cd backend
npx prisma studio
```

No Prisma Studio:

- Abrir tabela `User`
- Editar usuário
- Marcar `isAdmin = true`

**3. Fazer Login:**

```
Email: [seu_usuario_admin@email.com]
Senha: [sua_senha]
```

**4. Acessar Admin:**

- Navegar para `http://localhost:5173/admin`
- ✅ Deve carregar corretamente
- ✅ Dados reais do banco de dados
- ✅ CRUD funcional

## 🔍 Debug

### Verificar Token JWT:

```javascript
// No console do navegador
localStorage.getItem("auth:token");
```

### Verificar Usuário Logado:

```javascript
// No React DevTools
// Buscar por AuthContext
// Verificar user.isAdmin === true
```

### Testar Endpoint Manualmente:

```bash
# Pegar token do localStorage
TOKEN="seu_token_aqui"

# Testar endpoint /api/users
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8000/api/users
```

## 🚨 Problemas Comuns

### 1. "Acesso Negado" na Página Admin

**Causa:** Usuário não tem `isAdmin: true`
**Solução:** Usar `diego@forge.com` (mock) ou criar admin no banco

### 2. Erro 401 no Console

**Causa:** Token expirado ou inválido
**Solução:** Fazer logout e login novamente

### 3. Dados Não Carregam

**Causa:** Backend não está rodando
**Solução:**

```bash
cd backend
npm run start:dev
```

Verificar: `http://localhost:8000/api/docs`

### 4. Toast Não Aparece

**Causa:** ToastProvider não está na árvore de componentes
**Solução:** Verificar se `<ToastProvider>` envolve a aplicação em `App.tsx`

## ✅ Checklist de Teste

- [ ] Login com usuário admin funciona
- [ ] Acesso a `/admin` não desloga
- [ ] Tab "Pessoas" carrega lista de usuários
- [ ] Tab "Equipes" carrega lista de times
- [ ] Toast aparece ao criar usuário
- [ ] Toast aparece ao toggle admin
- [ ] Toast aparece ao deletar usuário
- [ ] Toast aparece ao criar equipe
- [ ] Logout manual funciona
- [ ] Após logout, `/admin` redireciona para login

## 📊 Status da Integração

| Feature        | Status       | API     | Toast  |
| -------------- | ------------ | ------- | ------ |
| Admin Users    | ✅ 100%      | ✅ Real | ✅ Sim |
| Admin Teams    | ✅ 100%      | ⏳ Mock | ✅ Sim |
| Admin Access   | ✅ Fixed     | -       | -      |
| Error Handling | ✅ Melhorado | -       | -      |

## 🎯 Próximos Passos

1. **Fase 5 - Teams Integration:**

   - Criar `/lib/api/endpoints/teams.ts`
   - Criar `/features/teams/hooks/useTeams.ts`
   - Integrar no `useAdminTeams` (substituir mock)

2. **Fase 6 - Management Integration:**

   - Criar `/lib/api/endpoints/management.ts`
   - Implementar `setManager/removeManager` real
   - Adicionar hierarquias no admin

3. **Fase 7 - Testing:**
   - E2E com Playwright
   - Unit tests com Vitest
   - API integration tests

## 💡 Dicas

- **Mock útil para UI:** Desenvolva componentes sem depender do backend
- **API real para integração:** Teste fluxos completos com dados reais
- **Toast ajuda debug:** Mensagens claras sobre o que aconteceu
- **Console é seu amigo:** Verifique logs de requisições e erros

---

**Última atualização:** 2025-10-17
**Autor:** GitHub Copilot
**Versão:** 1.0
