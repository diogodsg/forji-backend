# 📊 Plano de Integração - Visão Geral em Tabelas

Resumo completo do plano de integração em formato de tabelas para rápida consulta.

---

## 🎯 Documentação Criada

| Documento                                                              | Páginas | Audiência       | Propósito              |
| ---------------------------------------------------------------------- | ------- | --------------- | ---------------------- |
| [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md)                           | ~60     | Desenvolvedores | Plano técnico completo |
| [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)                   | ~35     | Desenvolvedores | Código pronto          |
| [INTEGRATION_ROADMAP.md](./INTEGRATION_ROADMAP.md)                     | ~12     | Gerentes/Devs   | Checklist visual       |
| [INTEGRATION_QUICKSTART.md](./INTEGRATION_QUICKSTART.md)               | ~20     | Desenvolvedores | Início rápido          |
| [INTEGRATION_EXECUTIVE_SUMMARY.md](./INTEGRATION_EXECUTIVE_SUMMARY.md) | ~15     | Stakeholders    | Resumo executivo       |
| [INTEGRATION_ARCHITECTURE.md](./INTEGRATION_ARCHITECTURE.md)           | ~10     | Todos           | Diagramas visuais      |
| [INTEGRATION_README.md](./INTEGRATION_README.md)                       | ~8      | Todos           | Índice geral           |
| [shared-types/index.ts](../shared-types/index.ts)                      | ~7      | Desenvolvedores | Tipos compartilhados   |

**Total:** ~167 páginas de documentação técnica

---

## 📋 Fases de Implementação

| #   | Fase             | Duração  | Complexidade | Prioridade | Entregas               |
| --- | ---------------- | -------- | ------------ | ---------- | ---------------------- |
| 1   | Setup Inicial    | 2-3 dias | 🟢 Baixa     | P0         | API client + tipos     |
| 2   | Auth Integration | 3-4 dias | 🟡 Média     | P0         | Login/logout funcional |
| 3   | Workspaces       | 2-3 dias | 🟡 Média     | P2         | Multi-tenant           |
| 4   | Users            | 3-4 dias | 🟡 Média     | P1         | CRUD completo          |
| 5   | Teams            | 3-4 dias | 🟡 Média     | P1         | Gestão de times        |
| 6   | Management       | 2-3 dias | 🔴 Alta      | P1         | Hierarquia             |
| 7   | Testing          | 2-3 dias | 🟡 Média     | P1         | Testes de integração   |
| 8   | Production       | 2-3 dias | 🔴 Alta      | P2         | Deploy + monitoring    |

**Total:** 19-27 dias (~4-5 semanas)

---

## ✅ Checklist por Fase

### Fase 1: Setup Inicial (5 tarefas)

| #   | Tarefa                           | Tempo | Complexidade |
| --- | -------------------------------- | ----- | ------------ |
| 1.1 | Criar API client (Axios)         | 2h    | 🟢 Baixa     |
| 1.2 | Definir tipos compartilhados     | 3h    | 🟢 Baixa     |
| 1.3 | Configurar variáveis de ambiente | 0.5h  | 🟢 Baixa     |
| 1.4 | Criar barrel exports             | 0.5h  | 🟢 Baixa     |
| 1.5 | Testar conexão com backend       | 1h    | 🟢 Baixa     |

**Total Fase 1:** 7 horas (~1 dia)

---

### Fase 2: Auth Integration (6 tarefas)

| #   | Tarefa                 | Tempo | Complexidade |
| --- | ---------------------- | ----- | ------------ |
| 2.1 | Criar auth service     | 2h    | 🟡 Média     |
| 2.2 | Refatorar useAuth hook | 4h    | 🟡 Média     |
| 2.3 | Atualizar LoginForm    | 2h    | 🟢 Baixa     |
| 2.4 | Criar RegisterForm     | 3h    | 🟡 Média     |
| 2.5 | Criar Toast system     | 2h    | 🟢 Baixa     |
| 2.6 | Testar fluxo completo  | 3h    | 🟡 Média     |

**Total Fase 2:** 16 horas (~2 dias)

---

### Fase 4: Users Integration (6 tarefas)

| #   | Tarefa                       | Tempo | Complexidade |
| --- | ---------------------------- | ----- | ------------ |
| 4.1 | Criar users service          | 3h    | 🟡 Média     |
| 4.2 | Refatorar useAdminUsers      | 4h    | 🟡 Média     |
| 4.3 | Atualizar WorkflowPeopleTab  | 2h    | 🟢 Baixa     |
| 4.4 | Atualizar OnboardingModal    | 2h    | 🟢 Baixa     |
| 4.5 | Atualizar outros componentes | 4h    | 🟡 Média     |
| 4.6 | Testar CRUD completo         | 3h    | 🟡 Média     |

**Total Fase 4:** 18 horas (~2.5 dias)

---

### Fase 5: Teams Integration (6 tarefas)

| #   | Tarefa                        | Tempo | Complexidade |
| --- | ----------------------------- | ----- | ------------ |
| 5.1 | Criar teams service           | 3h    | 🟡 Média     |
| 5.2 | Refatorar useTeamManagement   | 4h    | 🟡 Média     |
| 5.3 | Atualizar TeamsManagement     | 2h    | 🟢 Baixa     |
| 5.4 | Atualizar componentes teams   | 4h    | 🟡 Média     |
| 5.5 | Implementar gestão de membros | 3h    | 🟡 Média     |
| 5.6 | Testar fluxos completos       | 3h    | 🟡 Média     |

**Total Fase 5:** 19 horas (~2.5 dias)

---

### Fase 6: Management Integration (5 tarefas)

| #   | Tarefa                      | Tempo | Complexidade |
| --- | --------------------------- | ----- | ------------ |
| 6.1 | Criar management service    | 2h    | 🟡 Média     |
| 6.2 | Criar useManagement hook    | 3h    | 🟡 Média     |
| 6.3 | Atualizar HierarchyModal    | 3h    | 🔴 Alta      |
| 6.4 | Atualizar AdminSubordinates | 2h    | 🟡 Média     |
| 6.5 | Testar fluxos               | 3h    | 🟡 Média     |

**Total Fase 6:** 13 horas (~2 dias)

---

## 🔗 Endpoints do Backend

### Auth (4 endpoints)

| Método | Endpoint                     | Descrição                | Auth |
| ------ | ---------------------------- | ------------------------ | ---- |
| POST   | `/api/auth/register`         | Criar conta + workspace  | ❌   |
| POST   | `/api/auth/login`            | Login com email/senha    | ❌   |
| GET    | `/api/auth/me`               | Perfil do usuário logado | ✅   |
| POST   | `/api/auth/switch-workspace` | Trocar workspace ativo   | ✅   |

---

### Users (7 endpoints)

| Método | Endpoint                  | Descrição                  | Auth | Role       |
| ------ | ------------------------- | -------------------------- | ---- | ---------- |
| GET    | `/api/users`              | Listar usuários (paginado) | ✅   | ANY        |
| GET    | `/api/users/search`       | Buscar por nome/email      | ✅   | ANY        |
| GET    | `/api/users/:id`          | Ver perfil                 | ✅   | ANY        |
| POST   | `/api/users`              | Criar usuário              | ✅   | ADMIN      |
| PATCH  | `/api/users/:id`          | Atualizar perfil           | ✅   | SELF/ADMIN |
| PATCH  | `/api/users/:id/password` | Trocar senha               | ✅   | SELF       |
| DELETE | `/api/users/:id`          | Soft delete                | ✅   | ADMIN      |

---

### Teams (10 endpoints)

| Método | Endpoint                         | Descrição        | Auth | Role          |
| ------ | -------------------------------- | ---------------- | ---- | ------------- |
| GET    | `/api/teams`                     | Listar times     | ✅   | ANY           |
| GET    | `/api/teams/search`              | Buscar times     | ✅   | ANY           |
| GET    | `/api/teams/:id`                 | Detalhes do time | ✅   | ANY           |
| POST   | `/api/teams`                     | Criar time       | ✅   | ADMIN         |
| PATCH  | `/api/teams/:id`                 | Atualizar time   | ✅   | MANAGER/ADMIN |
| DELETE | `/api/teams/:id`                 | Soft delete time | ✅   | ADMIN         |
| GET    | `/api/teams/:id/members`         | Listar membros   | ✅   | ANY           |
| POST   | `/api/teams/:id/members`         | Adicionar membro | ✅   | MANAGER/ADMIN |
| PATCH  | `/api/teams/:id/members/:userId` | Atualizar role   | ✅   | MANAGER/ADMIN |
| DELETE | `/api/teams/:id/members/:userId` | Remover membro   | ✅   | MANAGER/ADMIN |

---

### Management (6 endpoints)

| Método | Endpoint                        | Descrição                | Auth | Role  |
| ------ | ------------------------------- | ------------------------ | ---- | ----- |
| GET    | `/api/management/subordinates`  | Listar subordinados      | ✅   | ANY   |
| GET    | `/api/management/teams`         | Listar times gerenciados | ✅   | ANY   |
| GET    | `/api/management/rules`         | Listar regras (admin)    | ✅   | ADMIN |
| POST   | `/api/management/rules`         | Criar regra hierárquica  | ✅   | ADMIN |
| DELETE | `/api/management/rules/:id`     | Deletar regra            | ✅   | ADMIN |
| GET    | `/api/management/check/:userId` | Verificar se gerencia    | ✅   | ANY   |

---

## 🧪 Cenários de Teste

### Auth Tests

| #   | Cenário            | Entrada                | Resultado Esperado   |
| --- | ------------------ | ---------------------- | -------------------- |
| T1  | Login válido       | email + senha corretos | 200 + token + user   |
| T2  | Login inválido     | senha incorreta        | 401 + mensagem erro  |
| T3  | Registro           | dados válidos          | 201 + token + user   |
| T4  | Registro duplicado | email existente        | 409 + mensagem erro  |
| T5  | Validar token      | token válido           | 200 + user data      |
| T6  | Token expirado     | token antigo           | 401 + redirect login |
| T7  | Logout             | -                      | Token removido       |
| T8  | Persistência       | reload página          | Sessão mantida       |

---

### Users CRUD Tests

| #   | Cenário             | Entrada             | Resultado Esperado       |
| --- | ------------------- | ------------------- | ------------------------ |
| U1  | Listar usuários     | page=1, limit=10    | 200 + lista paginada     |
| U2  | Buscar usuário      | q="Maria"           | 200 + usuários filtrados |
| U3  | Criar usuário       | dados válidos       | 201 + novo usuário       |
| U4  | Criar sem permissão | user role=MEMBER    | 403 + erro permissão     |
| U5  | Atualizar usuário   | dados válidos       | 200 + usuário atualizado |
| U6  | Atualizar senha     | senhas válidas      | 200 + senha alterada     |
| U7  | Deletar usuário     | user id             | 200 + soft delete        |
| U8  | Listar excluídos    | includeDeleted=true | 200 + inclui deletados   |

---

### Teams CRUD Tests

| #   | Cenário          | Entrada          | Resultado Esperado       |
| --- | ---------------- | ---------------- | ------------------------ |
| TM1 | Listar times     | -                | 200 + lista times        |
| TM2 | Criar time       | nome + descrição | 201 + novo time          |
| TM3 | Adicionar membro | userId + role    | 200 + membro adicionado  |
| TM4 | Remover membro   | userId           | 200 + membro removido    |
| TM5 | Alterar role     | userId + newRole | 200 + role atualizado    |
| TM6 | Deletar time     | team id          | 200 + soft delete        |
| TM7 | Buscar time      | q="Frontend"     | 200 + times filtrados    |
| TM8 | Time com membros | team id          | 200 + detalhes + membros |

---

### Management Tests

| #   | Cenário                  | Entrada                    | Resultado Esperado       |
| --- | ------------------------ | -------------------------- | ------------------------ |
| M1  | Criar regra INDIVIDUAL   | managerId + subordinateId  | 201 + regra criada       |
| M2  | Criar regra TEAM         | managerId + teamId         | 201 + regra criada       |
| M3  | Regra circular           | A gerencia B, B gerencia A | 400 + erro circular      |
| M4  | Listar subordinados      | managerId                  | 200 + lista subordinados |
| M5  | Listar times gerenciados | managerId                  | 200 + lista times        |
| M6  | Deletar regra            | ruleId                     | 200 + regra deletada     |
| M7  | Verificar gerenciamento  | userId + managerId         | 200 + boolean            |
| M8  | Regra duplicada          | mesma regra                | 409 + erro duplicado     |

---

## 🚦 Riscos e Mitigações

| Risco                   | Probabilidade | Impacto  | Mitigação                          | Contingência        |
| ----------------------- | ------------- | -------- | ---------------------------------- | ------------------- |
| Inconsistência de tipos | 🟡 Média      | 🔴 Alto  | Tipos compartilhados centralizados | Refactor 1-2 dias   |
| CORS errors             | 🟡 Média      | 🔴 Alto  | CORS configurado + testes cedo     | Debug 0.5-1 dia     |
| Token expiration        | 🟢 Baixa      | 🟡 Médio | Refresh token (futuro)             | Relogin manual      |
| Performance lenta       | 🟡 Média      | 🟡 Médio | Paginação + React Query            | Otimização 1-2 dias |
| Mudança de requisitos   | 🟢 Baixa      | 🟡 Médio | Escopo bem definido                | Renegociar timeline |
| Bugs de integração      | 🔴 Alta       | 🟡 Médio | Testes extensivos                  | Buffer 2-3 dias     |
| Deploy issues           | 🟡 Média      | 🔴 Alto  | Staging environment                | Rollback + debug    |

---

## 📊 Métricas de Sucesso

### Técnicas

| Métrica             | Target       | Medição             |
| ------------------- | ------------ | ------------------- |
| Cobertura de testes | >70%         | Vitest coverage     |
| Erros em produção   | <5/mês       | Sentry dashboard    |
| Tempo resposta API  | <500ms (p95) | Backend logs        |
| Uptime              | >99.5%       | Monitoring tool     |
| Build size          | <2MB         | Vite build analysis |
| Lighthouse score    | >90          | Chrome DevTools     |

---

### Produto

| Métrica             | Target | Validação            |
| ------------------- | ------ | -------------------- |
| Onboarding completo | ✅     | Sem mock data        |
| Multi-usuário       | ✅     | Dados compartilhados |
| Persistência        | ✅     | Reload mantém dados  |
| Loading states      | ✅     | Em todas operações   |
| Error handling      | ✅     | Mensagens claras     |
| Mobile responsive   | ✅     | Testes em mobile     |

---

### Negócio

| Métrica          | Target | Validação                       |
| ---------------- | ------ | ------------------------------- |
| MVP demonstrável | ✅     | Demo para stakeholders          |
| Feedback real    | ✅     | Beta users testando             |
| Base escalável   | ✅     | Arquitetura permite crescimento |
| Documentação     | ✅     | Docs completos                  |
| Deploy produção  | ✅     | URL pública funcionando         |

---

## 💰 Estimativa de Recursos

### Tempo de Desenvolvimento

| Opção    | Configuração             | Duração     | Vantagens     | Desvantagens         |
| -------- | ------------------------ | ----------- | ------------- | -------------------- |
| Solo     | 1x Full-Stack Sênior     | 4-5 semanas | Consistência  | Mais tempo           |
| Dupla ⭐ | 1x Backend + 1x Frontend | 3-4 semanas | Paralelização | Sincronização        |
| Squad    | Tech Lead + 2 Devs       | 2-3 semanas | Velocidade    | Overhead comunicação |

**Recomendado:** Dupla (3-4 semanas)

---

### Custo de Infraestrutura

| Serviço                 | Plano     | Custo/mês | Notas              |
| ----------------------- | --------- | --------- | ------------------ |
| Frontend (Vercel)       | Hobby     | $0        | Grátis             |
| Backend (Railway)       | Starter   | $5-10     | PostgreSQL incluso |
| Database (Railway)      | Included  | $0        | Backup manual      |
| Sentry (Error tracking) | Developer | $0        | Até 5k eventos/mês |
| Domain (Namecheap)      | -         | $12/ano   | Opcional           |

**Total:** $5-10/mês (~$60-120/ano)

---

## 🎯 Prioridades

### P0 (Crítico - Semana 1)

| Item                | Justificativa       | Bloqueante para          |
| ------------------- | ------------------- | ------------------------ |
| Setup inicial       | Base para tudo      | Todas fases              |
| Auth integration    | Sem auth não há app | Users, Teams, Management |
| Workspaces (básico) | Multi-tenant core   | Users, Teams             |

---

### P1 (Alta - Semana 2-3)

| Item             | Justificativa           | Bloqueante para |
| ---------------- | ----------------------- | --------------- |
| Users CRUD       | Admin precisa gerenciar | Teams (membros) |
| Teams CRUD       | Core feature            | Management      |
| Management rules | Hierarquia necessária   | MVP completo    |
| Testing          | Garantir qualidade      | Production      |

---

### P2 (Média - Semana 4)

| Item                  | Justificativa | Bloqueante para |
| --------------------- | ------------- | --------------- |
| Workspaces (completo) | Nice to have  | -               |
| React Query           | Performance   | -               |
| Production polish     | UX            | Launch          |

---

### P3 (Baixa - Semana 5)

| Item                | Justificativa | Bloqueante para |
| ------------------- | ------------- | --------------- |
| Monitoring avançado | Observability | -               |
| Performance tuning  | Otimização    | -               |
| Documentation extra | Manutenção    | -               |

---

## 📞 Recursos e Contatos

### Documentação

| Documento          | Link                                                                   | Propósito            |
| ------------------ | ---------------------------------------------------------------------- | -------------------- |
| Plano Completo     | [INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md)                           | Detalhamento técnico |
| Exemplos de Código | [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)                   | Copy-paste pronto    |
| Roadmap Visual     | [INTEGRATION_ROADMAP.md](./INTEGRATION_ROADMAP.md)                     | Checklist tracking   |
| Quick Start        | [INTEGRATION_QUICKSTART.md](./INTEGRATION_QUICKSTART.md)               | Começar hoje         |
| Executive Summary  | [INTEGRATION_EXECUTIVE_SUMMARY.md](./INTEGRATION_EXECUTIVE_SUMMARY.md) | Stakeholders         |
| Arquitetura        | [INTEGRATION_ARCHITECTURE.md](./INTEGRATION_ARCHITECTURE.md)           | Diagramas            |

---

### Backend

| Recurso       | URL                             | Descrição            |
| ------------- | ------------------------------- | -------------------- |
| Swagger UI    | http://localhost:8000/api/docs  | API interativa       |
| README        | `/backend/README.md`            | Setup backend        |
| API Docs      | `/backend/API_DOCUMENTATION.md` | Endpoints detalhados |
| Prisma Studio | http://localhost:5555           | Database GUI         |

---

### Frontend

| Recurso    | URL                                   | Descrição      |
| ---------- | ------------------------------------- | -------------- |
| App        | http://localhost:5173                 | Aplicação      |
| README     | `/frontend/README.md`                 | Setup frontend |
| Auth Docs  | `/frontend/AUTH_REFACTORING.md`       | Sistema auth   |
| Admin Docs | `/frontend/ADMIN_MOCK_REFACTORING.md` | Sistema admin  |

---

## ✅ Aprovações Necessárias

| Tipo    | Item              | Status      | Responsável     |
| ------- | ----------------- | ----------- | --------------- |
| Técnico | Arquitetura       | ⏳ Pendente | Tech Lead       |
| Técnico | Stack (Axios, RQ) | ⏳ Pendente | Tech Lead       |
| Técnico | Plano de testes   | ⏳ Pendente | QA Lead         |
| Produto | Escopo MVP        | ⏳ Pendente | Product Owner   |
| Produto | Prioridades       | ⏳ Pendente | Product Owner   |
| Produto | Critérios sucesso | ⏳ Pendente | Product Owner   |
| Negócio | Timeline          | ⏳ Pendente | Gerente Projeto |
| Negócio | Budget infra      | ⏳ Pendente | Financeiro      |
| Negócio | Recursos (devs)   | ⏳ Pendente | RH / Gerente    |

---

## 🎉 Status Final

| Aspecto              | Status           | Notas                      |
| -------------------- | ---------------- | -------------------------- |
| Documentação         | ✅ Completa      | 8 documentos, ~167 páginas |
| Plano Técnico        | ✅ Detalhado     | 8 fases, 43 tarefas        |
| Código de Exemplo    | ✅ Pronto        | 11 exemplos completos      |
| Tipos Compartilhados | ✅ Definidos     | TypeScript interfaces      |
| Timeline             | ✅ Estimado      | 4-5 semanas                |
| Riscos               | ✅ Identificados | Com mitigações             |
| Testes               | ✅ Planejados    | 24+ cenários               |
| Aprovações           | ⏳ Pendentes     | 9 itens para aprovar       |

---

**Última Atualização:** 17 de outubro de 2025  
**Status:** ✅ Pronto para Aprovação e Execução  
**Próximo Passo:** Obter aprovações e iniciar Fase 1
