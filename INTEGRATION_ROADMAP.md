# 🗺️ Roadmap de Integração Backend-Frontend

Visualização simplificada do plano de integração.

---

## 📊 Progresso Geral

```
Fase 1: Setup Inicial       [ ] 0/5   (0%)
Fase 2: Auth                 [ ] 0/6   (0%)
Fase 3: Workspaces          [ ] 0/5   (0%)
Fase 4: Users               [ ] 0/6   (0%)
Fase 5: Teams               [ ] 0/6   (0%)
Fase 6: Management          [ ] 0/5   (0%)
Fase 7: Testing             [ ] 0/5   (0%)
Fase 8: Production          [ ] 0/5   (0%)
──────────────────────────────────────
Total:                      [ ] 0/43  (0%)
```

---

## ✅ Checklist Detalhado

### 🔧 Fase 1: Setup Inicial (2-3 dias)

- [ ] **1.1** Criar `/frontend/src/lib/api/client.ts`
  - [ ] Configurar Axios instance
  - [ ] Request interceptor (adicionar token)
  - [ ] Response interceptor (tratar erros)
  - [ ] Helper `extractErrorMessage()`
- [ ] **1.2** Criar tipos compartilhados em `/shared-types/`
  - [ ] `index.ts` com todos os tipos
  - [ ] Validar contra DTOs do backend
- [ ] **1.3** Configurar variáveis de ambiente
  - [ ] `.env.development`
  - [ ] `.env.production`
- [ ] **1.4** Criar barrel exports
  - [ ] `/frontend/src/lib/api/index.ts`
- [ ] **1.5** Testar conexão com backend
  - [ ] Backend rodando em localhost:8000
  - [ ] CORS configurado

**Entregável:** API client funcional + tipos definidos

---

### 🔐 Fase 2: Auth Integration (3-4 dias)

- [ ] **2.1** Criar `/frontend/src/lib/api/endpoints/auth.ts`
  - [ ] `authApi.login()`
  - [ ] `authApi.register()`
  - [ ] `authApi.me()`
  - [ ] `authApi.switchWorkspace()`
- [ ] **2.2** Refatorar `/frontend/src/features/auth/hooks/useAuth.tsx`
  - [ ] Substituir mock por API calls
  - [ ] Manter fallback para mock
  - [ ] Validação de token ao montar
- [ ] **2.3** Atualizar `LoginForm.tsx`
  - [ ] Exibir erros do backend
  - [ ] Loading states
- [ ] **2.4** Criar `RegisterForm.tsx`
  - [ ] Formulário completo
  - [ ] Validação de campos
- [ ] **2.5** Criar `ToastProvider` (notificações)
  - [ ] Success, error, warning, info
  - [ ] Auto-dismiss
- [ ] **2.6** Testar fluxo completo
  - [ ] Login com usuário existente
  - [ ] Registro de novo usuário
  - [ ] Persistência de sessão
  - [ ] Logout

**Entregável:** Sistema de autenticação integrado

---

### 🏢 Fase 3: Workspaces Integration (2-3 dias)

- [ ] **3.1** Criar `/frontend/src/lib/api/endpoints/workspaces.ts`
  - [ ] CRUD completo de workspaces
  - [ ] Invite user
- [ ] **3.2** Criar `useWorkspaces` hook
  - [ ] List workspaces
  - [ ] Create workspace
  - [ ] Switch workspace
- [ ] **3.3** Criar `WorkspaceSwitcher` component
  - [ ] Dropdown com workspaces
  - [ ] Indicador de workspace ativo
- [ ] **3.4** Integrar switch workspace com auth
  - [ ] Trocar token
  - [ ] Recarregar dados
- [ ] **3.5** Testar fluxos
  - [ ] Criar workspace
  - [ ] Trocar entre workspaces
  - [ ] Convidar usuário

**Entregável:** Sistema de workspaces funcional

---

### 👥 Fase 4: Users Integration (3-4 dias)

- [ ] **4.1** Criar `/frontend/src/lib/api/endpoints/users.ts`
  - [ ] List users (com paginação)
  - [ ] Search users
  - [ ] CRUD completo
  - [ ] Update password
- [ ] **4.2** Refatorar `useAdminUsers` hook
  - [ ] Substituir mock por API
  - [ ] Implementar paginação
  - [ ] Implementar busca
- [ ] **4.3** Atualizar `WorkflowPeopleTab.tsx`
  - [ ] Usar dados reais
  - [ ] Loading states
- [ ] **4.4** Atualizar `OnboardingModal.tsx`
  - [ ] Criar usuário via API
  - [ ] Feedback de sucesso/erro
- [ ] **4.5** Atualizar outros componentes users
  - [ ] `SimplifiedUsersTable.tsx`
  - [ ] `CreateUserModal.tsx`
  - [ ] `UserMetricsCards.tsx`
- [ ] **4.6** Testar CRUD completo
  - [ ] Listar usuários
  - [ ] Buscar usuário
  - [ ] Criar usuário
  - [ ] Editar usuário
  - [ ] Deletar usuário

**Entregável:** Gestão de usuários integrada

---

### 🏆 Fase 5: Teams Integration (3-4 dias)

- [ ] **5.1** Criar `/frontend/src/lib/api/endpoints/teams.ts`
  - [ ] CRUD de teams
  - [ ] Gestão de members
  - [ ] Search teams
- [ ] **5.2** Refatorar `useTeamManagement` hook
  - [ ] Substituir mock por API
  - [ ] Gestão de membros
- [ ] **5.3** Atualizar `TeamsManagement.tsx`
  - [ ] Usar dados reais
  - [ ] Loading states granulares
- [ ] **5.4** Atualizar componentes teams
  - [ ] `AdminTeamsTable.tsx`
  - [ ] `TeamDetailPanel.tsx`
  - [ ] `CreateTeamModal.tsx`
- [ ] **5.5** Implementar gestão de membros
  - [ ] Adicionar membro
  - [ ] Remover membro
  - [ ] Alterar role
- [ ] **5.6** Testar fluxos completos
  - [ ] Criar time
  - [ ] Adicionar membros
  - [ ] Remover membros
  - [ ] Deletar time

**Entregável:** Gestão de times integrada

---

### 📊 Fase 6: Management Integration (2-3 dias)

- [ ] **6.1** Criar `/frontend/src/lib/api/endpoints/management.ts`
  - [ ] CRUD de rules
  - [ ] Listar subordinados
  - [ ] Listar times gerenciados
- [ ] **6.2** Criar `useManagement` hook
  - [ ] Gestão de regras
  - [ ] Listar subordinados
- [ ] **6.3** Atualizar `HierarchyModal.tsx`
  - [ ] Buscar regras reais
  - [ ] Criar regras INDIVIDUAL e TEAM
- [ ] **6.4** Atualizar `AdminSubordinatesManagement.tsx`
  - [ ] Listar subordinados reais
  - [ ] Remover regras
- [ ] **6.5** Testar fluxos
  - [ ] Criar regra INDIVIDUAL
  - [ ] Criar regra TEAM
  - [ ] Listar subordinados
  - [ ] Deletar regra

**Entregável:** Sistema de hierarquia integrado

---

### 🧪 Fase 7: Testing & Error Handling (2-3 dias)

- [ ] **7.1** Implementar `ErrorBoundary`
  - [ ] Capturar erros globais
  - [ ] Fallback UI
- [ ] **7.2** Melhorar tratamento de erros
  - [ ] Toast notifications
  - [ ] Mensagens amigáveis
- [ ] **7.3** Testes de integração - Auth
  - [ ] Login válido/inválido
  - [ ] Registro
  - [ ] Persistência
- [ ] **7.4** Testes de integração - CRUD
  - [ ] Users CRUD
  - [ ] Teams CRUD
  - [ ] Management rules
- [ ] **7.5** Testes de error cases
  - [ ] Token expirado
  - [ ] Network error
  - [ ] 404, 403, 500

**Entregável:** Sistema testado e robusto

---

### 🚀 Fase 8: Production Readiness (2-3 dias)

- [ ] **8.1** Performance optimization
  - [ ] Implementar React Query
  - [ ] Lazy loading
  - [ ] Code splitting
- [ ] **8.2** Security hardening
  - [ ] HTTPS only
  - [ ] Content Security Policy
  - [ ] Sanitização de inputs
- [ ] **8.3** Monitoring
  - [ ] Sentry para error tracking
  - [ ] Performance metrics
- [ ] **8.4** Documentação
  - [ ] Guia de integração
  - [ ] Guia de deployment
  - [ ] Troubleshooting
- [ ] **8.5** Deploy em ambiente de teste
  - [ ] Frontend em Vercel/Netlify
  - [ ] Backend em Railway/Render
  - [ ] Testar produção

**Entregável:** Sistema pronto para produção

---

## 📅 Timeline Visual

```
Semana 1: Setup + Auth
├─ Dia 1-2: Setup inicial
├─ Dia 3-4: Auth integration
└─ Dia 5: Workspaces

Semana 2: Users + Teams
├─ Dia 1-3: Users integration
└─ Dia 4-5: Teams integration (início)

Semana 3: Teams + Management
├─ Dia 1-2: Teams integration (fim)
└─ Dia 3-5: Management integration

Semana 4: Testing + Production
├─ Dia 1-2: Testing & error handling
└─ Dia 3-5: Production readiness

Semana 5: Buffer & Polish
└─ Ajustes finais, bugs, polish
```

---

## 🎯 Milestones

### M1: API Foundation ✅

- [ ] API client configurado
- [ ] Tipos compartilhados definidos
- [ ] Conexão com backend funcionando

### M2: Authentication Working ✅

- [ ] Login funcional
- [ ] Registro funcional
- [ ] Sessão persistente

### M3: Core Admin Features ✅

- [ ] Users CRUD
- [ ] Teams CRUD
- [ ] Paginação e busca

### M4: Hierarchy System ✅

- [ ] Management rules
- [ ] Subordinates listing
- [ ] Team management

### M5: Production Ready ✅

- [ ] Testes passando
- [ ] Performance otimizada
- [ ] Deploy funcionando

---

## 🚦 Status Legend

```
[ ] - Não iniciado
[~] - Em andamento
[✓] - Completo
[!] - Bloqueado
[x] - Cancelado
```

---

## 📝 Como Usar Este Roadmap

### 1. Iniciar uma tarefa

```
[~] 1.1 Criar API client
```

### 2. Concluir uma tarefa

```
[✓] 1.1 Criar API client
```

### 3. Marcar bloqueio

```
[!] 4.2 Refatorar useAdminUsers (aguardando backend endpoint)
```

### 4. Atualizar progresso geral

```
Fase 1: Setup Inicial  [✓] 5/5   (100%)
Fase 2: Auth           [~] 3/6   (50%)
```

---

## 🎯 Prioridades por Fase

### P0 (Crítico - Fazer PRIMEIRO)

- Fase 1: Setup Inicial
- Fase 2: Auth Integration
- Fase 3: Workspaces (básico)

### P1 (Alta - Fazer EM SEGUIDA)

- Fase 4: Users Integration
- Fase 5: Teams Integration

### P2 (Média - Fazer DEPOIS)

- Fase 6: Management Integration
- Fase 7: Testing

### P3 (Baixa - Fazer POR ÚLTIMO)

- Fase 8: Production Readiness (polish)

---

## 📞 Contatos e Recursos

### Documentação

- [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md) - Plano completo
- [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md) - Exemplos de código
- [shared-types/index.ts](./shared-types/index.ts) - Tipos compartilhados

### Backend

- README: `/backend/README.md`
- API Docs: `/backend/API_DOCUMENTATION.md`
- Swagger: http://localhost:8000/api/docs

### Frontend

- README: `/frontend/README.md`
- Auth Docs: `/frontend/AUTH_REFACTORING.md`
- Admin Docs: `/frontend/ADMIN_MOCK_REFACTORING.md`

---

## 🎉 Critérios de Sucesso

### ✅ Projeto Concluído Quando:

1. ✅ Login e logout funcionam com backend real
2. ✅ Criação de usuários persiste no PostgreSQL
3. ✅ Listagem de times carrega dados do banco
4. ✅ Regras de gestão funcionam end-to-end
5. ✅ Todos os error cases tratados
6. ✅ Loading states em todas operações
7. ✅ Zero erros de console
8. ✅ Documentação completa
9. ✅ Testes de integração passando
10. ✅ Deploy em produção funcionando

---

**Última Atualização:** 17 de outubro de 2025  
**Próxima Revisão:** Após completar cada fase  
**Status:** 📝 Pronto para início
