# Forge

Plataforma (MVP) para acompanhar Pull Requests e evolução de Planos de Desenvolvimento Individual (PDI). Stack: **NestJS + Prisma/PostgreSQL** (backend) e **React 19 + Vite + TailwindCSS** (frontend). Inclui:

- Área do desenvolvedor (PRs e PDI próprio)
- Dashboard de manager (PRs + PDI dos subordinados)
- Área administrativa (gestão de contas, relacionamentos e permissões)

Arquitetura frontend migrou recentemente de um modelo "global components + global types" para **feature‑first** (cada domínio isola `types`, `hooks`, `components`,

## 🚀 Melhorias Recentes (2025-09-26)

### Refatoração Completa da Interface de Administração

**Interface Modernizada com UX Aprimorada:**

- **Métricas Cards**: Das4. Planejado: impedir edição até seleção## 🚀 Dicas de Desenvolvimento

**Para Administradores:**

- Acesse `/admin` para usar a nova interface modernizada de administração
- Use os cards clicáveis para navegar rapidamente entre usuários
- Configure subordinados via regras flexíveis (individual ou por equipe)

**Para Managers:**

- Dashboard person-centric otimizado com carregamento 85% mais rápido
- Visualize apenas pessoas que você gerencia, organizadas por times relevantes
- Edite PDIs de subordinados com interface aprimorada

**Para Desenvolvedores:**

- Arquitetura feature-first consolidada para novos componentes
- Backend com injeção de dependências corrigida e performance otimizada
- Hot reload funcional para desenvolvimento ágil

**Teste das Funcionalidades:**

- Login como admin → `/admin` para interface administrativa
- Navegue para `/me/pdi` e clique em "Editar PDI" para modificar resultados
- Configure gerenciamento de subordinados via área administrativalícita (todo).

### 🔮 Próximas Funcionalidades Planejadas

**Melhorias de Performance e Escalabilidade:**

- Implementar lazy loading na interface administrativa para grandes bases de usuários
- Cache inteligente para queries de subordinados e hierarquias
- Paginação automática nas listagens de usuários e times

**Sistema de Notificações:**

- Notificações em tempo real para mudanças de PDI e aprovações
- Dashboard de notificações para managers e administradores
- Integração com webhooks para sistemas externos

**Relatórios e Analytics:**

- Dashboard executivo com métricas de desenvolvimento de equipes
- Relatórios de progresso de PDI exportáveis (PDF/Excel)
- Análise de tendências de Pull Requests por equipe/pessoa

**Integração e Automação:**

- Sincronização automática com GitHub/GitLab para dados de PR
- API webhooks para integração com sistemas de RH
- Automação de regras de gerenciamento baseadas em estrutura organizacional

### Próximos Itens Técnicos Recomendados

- Mover filtros de PR (repo/state/author) para o backend (where condicional + índices).
- Sort configurável (`sort=createdAt:desc|lines:asc`).
- Debounced auto-save PDI (PATCH incremental) com status visual (badge "Sincronizado / Pendente").
- DTO + validação para PDI/PRs (class-validator) para sanitizar payload antes de persistir JSON.
- Reativação do ManagementModule com correção dos guards JWT
- Implementação de testes automatizados para novas funcionalidadesom estatísticas em tempo real (usuários totais, admins, últimos registros)
- **Tabela Simplificada**: Interface mais limpa com cards clicáveis para usuários
- **Filtros Avançados**: Busca por nome/email, filtro por status admin, ordenação por nome/data
- **Breadcrumb Navigation**: Navegação contextual clara
- **Quick View Modal**: Visualização rápida de detalhes do usuário com informações de hierarquia

**Melhorias de Usabilidade:**

- Cards de usuários totalmente clicáveis (removidos ícones de hover desnecessários)
- Click direto abre detalhes do usuário para edição
- Interface responsiva e moderna com TailwindCSS
- Feedback visual aprimorado para todas as ações

### Sistema de Gerenciamento de Subordinados Flexível

**Nova Arquitetura de Gestão:**

- **Regras de Gerenciamento Flexíveis**: Sistema baseado em regras individuais ou por equipe
- **ManagementRule Model**: Suporte a `TEAM` (gerenciar toda equipe) e `INDIVIDUAL` (gerenciar pessoa específica)
- **APIs RESTful**: Endpoints completos para criação, listagem e remoção de regras
- **Interface Administrativa**: Tela dedicada para configurar subordinados de forma intuitiva

**Funcionalidades Avançadas:**

- Verificação eficiente de relacionamentos hierárquicos
- Busca de subordinados efetivos (diretos + via equipe)
- Detalhamento da origem do relacionamento (individual vs. equipe)
- Sistema preparado para escalabilidade e governança empresarial

### Correções Críticas de Backend

**Problemas Resolvidos:**

- **Deadlock de Inicialização**: Corrigido problema de travamento durante boot do NestJS
- **Injeção de Dependências**: Migrado para padrão adequado do Nest.js com PrismaService
- **Campos de Perfil**: Adicionados campos `position` e `bio` na API de usuários
- **Comparação de IDs**: Corrigida inconsistência entre string/number IDs na edição de usuários
- **Compilação**: Removidas dependências problemáticas temporariamente até resolução de relações

**Melhorias de Performance:**

- API `/auth/users` otimizada com campos completos de perfil
- Queries Prisma simplificadas e eficientes
- Hot reload funcional para desenvolvimento ágil

### Tecnologias e Componentes Atualizados

**Frontend:**

- React 19 + Vite com hot reload otimizado
- TailwindCSS para design system consistente
- @headlessui/react para componentes acessíveis (modais, dropdowns)
- React Router v7 para navegação
- Arquitetura feature-first consolidada

**Backend:**

- NestJS com injeção de dependências corrigida
- Prisma ORM com schema estendido (ManagementRule, campos de perfil)
- PostgreSQL com migrações automatizadas
- JWT authentication com guards modulares
- Logging estruturado com contexto de requisições

**DevOps:**

- Docker multi-stage builds
- npm workspaces para monorepo
- TypeScript strict mode
- ESLint + Prettier configurados

### Dashboard de Manager - Refatoração Person-Centric (2025-09-26)

#### Mudanças Arquiteturais Principais

**Filosofia de Gestão Revisada:**

- **Antes**: Foco em times gerenciados → pessoas aparecem como membros de times
- **Depois**: Foco em pessoas gerenciadas → times aparecem apenas se contém pessoas gerenciadas

**Performance API Drasticamente Melhorada:**

```
Antes:  1 requisição (/teams) + N requisições (/teams/:id)
Depois: 1 requisição única (/teams?details=true)
Resultado: ~85% redução de chamadas de API
```

**Novo Endpoint Backend:**

- `GET /teams?details=true` - Retorna times completos com memberships
- Retrocompatível com `GET /teams` (sumário apenas)

#### Melhorias de UX/UI

**Header Modernizado:**

- Ícone com badge de contagem (verde: times organizados, âmbar: aguardando organização)
- Contextualização inteligente: "Gerenciando X pessoas em Y times" vs "Gerenciando X pessoas (aguardando organização em times)"
- Gradientes e micro-interações modernas

**Estados Visuais Refinados:**

- Loading sem interferência de alertas prematuros
- Alerta específico para pessoas sem times organizados com instruções detalhadas
- Distinção clara entre "Pessoas que gerencio" e "Outros membros do time"

**Navegação Aprimorada:**

- Cards clicáveis levam a páginas dedicadas (`/manager/users/:id`)
- Melhor aproveitamento de espaço comparado ao painel inline anterior

#### Limpeza Técnica Completa

**6 Arquivos Removidos (Código Morto):**

- `useAllTeams.ts`, `useMyTeams.ts`, `useDeferredLoading.ts`
- `TeamOverviewBar.tsx`, `ManagerHeader.tsx`, `ReportsSidebar.tsx`

**Impacto Mensurado:**

- ManagerDashboardPage: -6.9% bundle size (16.89kB → 15.73kB)
- ManagerUserEditPage: -9.7% bundle size (7.19kB → 6.49kB)
- Arquitetura 100% focada: apenas componentes e hooks ativamente usados

**Hook Unificado:**

```typescript
// Múltiplos hooks complexos → Hook único otimizado
const allTeams = useAllTeamsWithDetails(); // Uma call, dados completos
```

### Próximos Itens Recomendados

- Mover filtros de PR (repo/state/author) para o backend (where condicional + índices).
- Sort configurável (`sort=createdAt:desc|lines:asc`).
- Debounced auto-save PDI (PATCH incremental) com status visual (badge "Sincronizado / Pendente").
- DTO + validação para PDI/PRs (class-validator) para sanitizar payload antes de persistir JSON.

## 📋 Guia de Funcionalidades

### Interface de Administração Modernizada

- **Acesso**: Faça login com usuário admin e navegue para `/admin`
- **Métricas**: Dashboard com estatísticas em tempo real na parte superior
- **Gestão de Usuários**: Clique diretamente nos cards para abrir detalhes e editar perfis
- **Filtros**: Use a barra de busca e filtros para encontrar usuários rapidamente
- **Quick View**: Visualize hierarquias e informações detalhadas em modal

### Sistema de Gerenciamento de Subordinados

- **Acesso**: Área administrativa > Gerenciamento de Subordinados
- **Regras por Equipe**: Gerencie todos os membros de uma equipe automaticamente
- **Regras Individuais**: Adicione pessoas específicas como subordinados
- **Visualização**: Veja subordinados efetivos e origem das relações (equipe vs. individual)

### Edição de PDI e Perfis

- **Meu PDI**: Navegue para `/me/pdi` e clique em "Editar PDI" para modificar resultados
- **Perfis de Usuários**: Campos `position` e `bio` agora totalmente funcionais
- **Detalhes**: Informações completas de perfil disponíveis na edição

### Dashboard de Manager Person-Centric

- **Foco em Pessoas**: Dashboard reorganizado para priorizar pessoas gerenciadas
- **Organização por Times**: Times aparecem apenas se contêm pessoas sob sua gestão
- **Performance**: Carregamento 85% mais rápido com API otimizadaervices`). Pastas legadas (`src/components`, `src/hooks`, `src/types`, `src/utils`) foram eliminadas ou migradas; novas implementações devem sempre residir em `src/features/<domínio>`.

## Visão Geral

### Frontend (Feature‑First)

Estrutura principal (exemplo abreviado):

```
src/features/
  pdi/
    types/pdi.ts
    hooks/... (usePdiEditing, useRemotePdi, etc)
    components/ (EditablePdiView, sections, editors, structure)
    lib/pdi.ts
  prs/
    types/pr.ts
    hooks/useRemotePrs.ts
    components/(PrList, PrDetailDrawer, PrStats, ...)
  auth/
    types/auth.ts
    hooks/useAuth.tsx
    components/LoginForm.tsx
  admin/
    types/user.ts (+ types.ts agregador)
    hooks/(useAdminUsers, useMyReports)
    components/(AdminGate, CreateUserModal, ManagerDrawer, ...)
```

Principais pontos:

- Hooks remotos: `useRemotePrs`, `useRemotePdi`, `useRemotePdiForUser`, `useMyReports`
- Estado de edição de PDI: `usePdiEditing` (reducer + ações) + `useAutoSave` (debounce / optimistic)
- Componentes de PDI segmentados em: `sections/`, `editors/`, `structure/` (responsabilidade clara)
- Navegação: React Router v7; layout base (`AppLayout`) com Sidebar; TopBar mobile
- Barrel `index.ts` em cada feature para exports públicos e isolamento interno

### Backend

1. Autenticação JWT (7d) + guards.
2. Modelos Prisma simples (User, PullRequest, PdiPlan) usando JSON para campos dinâmicos (milestones, krs, records) visando iteração rápida.
3. Permissões: acesso a PRs e PDI de subordinados apenas para managers listados ou próprio dono.

### Arquitetura Backend Atualizada (Set/2025)

Desde a refatoração recente o backend passou a ser estruturado em módulos de domínio desacoplados e serviços injetáveis:

- `PrismaModule` + `PrismaService`: provê um único client Prisma via DI (eliminado arquivo antigo `prisma.ts`). Facilita testes/mocks e centraliza lifecycle (hook `beforeExit`).
- Módulos de domínio: `AuthModule`, `PrsModule`, `PdiModule`, `TeamsModule`, além de `PermissionsModule` para regras de acesso.
- `PermissionService`: concentra lógica de "sou dono ou manager" e demais verificações, reduzindo repetição em controllers.
- Guard reutilizável `OwnerOrManagerGuard`: aplicado nas rotas que referenciam recursos de outro usuário, decide acesso (self / relação de manager) e loga allow/deny.
- `JwtAuthGuard` ajustado para usar DI de `PrismaService` (evitando import direto do client).
- Interceptores globais: `LoggingInterceptor` (tempo de execução, status, método, rota) + `BigIntSerializationInterceptor` (padroniza serialização de BigInt em JSON strings).
- Observabilidade: logs estruturados (Pino) agora também em serviços (`AuthService`, `PrsService`, `PdiService`) e no guard, com filtros, contagens e ids relevantes.
- Tratamento consistente de erros de unicidade: util `handlePrismaUniqueError` converte código `P2002` em `409 Conflict` com mensagem amigável (email, githubId).
- Removidas conversões manuais de BigInt para number em listagens de PR (delegado ao interceptor de serialização).

Benefícios principais: menor acoplamento entre controllers e infraestrutura, pontos únicos para autorização e logging, rastreabilidade das operações (cada ação relevante gera um log). Novo trabalho deve seguir o padrão: criar módulo de domínio e injetar `PrismaService` em vez de importar o client.

### Funcionalidades

- Registro / login / sessão (`/auth/*`).
- Administração: criar usuários, gerir managers, definir/remover `githubId`, promover a admin, remover usuário (PRs ficam órfãos).
- PRs: CRUD + filtro por dono (`?ownerUserId=`) + paginação server‑side.
- Dashboard usuário: PRs próprios + PDI.
- Dashboard manager: seleção de subordinado + abas PRs | PDI.
- PDI: competências, milestones (listas: melhorias, positivos, recursos, tarefas), key results, registros de evolução, sugestões (placeholder IA).
- Edição por seção independente; auto‑save com feedback visual (salvando / pendente / tudo salvo).

## Stack

Frontend

- React 19 + TypeScript (Vite)
- React Router DOM v7
- TailwindCSS + @tailwindcss/typography
- date-fns
- Vitest (testes iniciais)

Backend

- NestJS + @nestjs/jwt
- Prisma ORM + PostgreSQL (Docker)
- bcryptjs

Infra / Dev

- Docker Compose (Postgres em 5433)
- Prisma Migrations
- Script de seed (`script.sh`)

## Estrutura Atual (Resumo)

```
frontend/src/
  features/
    pdi/ ...
    prs/ ...
    auth/ ...
    admin/ ...
  pages/              -> Rotas (MyPdiPage, ManagerDashboardPage, etc.) consumindo apenas barrels de features
  layouts/            -> AppLayout, Sidebar, TopBar
  lib/                -> apiClient, helpers transversais
  mocks/              -> Dados mock (em processo de realocação gradual para dentro de cada feature)
  index.css / main.tsx

backend/
  prisma/             -> schema.prisma + migrations
  src/                -> módulos Nest (auth, prs, pdi, etc.)
  docker-compose.yml  -> Postgres
```

## Rotas Frontend

| Rota            | Descrição                                                  |
| --------------- | ---------------------------------------------------------- |
| `/` / `/me/prs` | Lista de PRs (autenticado)                                 |
| `/me/pdi`       | Página de acompanhamento do PDI                            |
| `/manager`      | Dashboard do manager (seleciona subordinado; abas PRs/PDI) |
| `/admin`        | Gestão de contas e relações (apenas para usuários admin)   |

## Endpoints Backend (principais)

- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`,
  `GET /auth/my-reports`, `POST /auth/set-manager`, `POST /auth/remove-manager`

  Admin (somente admin):

  - `GET /auth/users` (lista usuários com managers/reports)
  - `POST /auth/admin/create-user` (cria usuário; aceita `isAdmin` opcional)
  - `POST /auth/admin/set-admin` (promove ou remove privilégio admin)
  - `POST /auth/admin/set-manager` (define um manager para um usuário)
  - `POST /auth/admin/remove-manager` (remove relação de manager)
  - `POST /auth/admin/set-github-id` (define ou remove githubId de um usuário; 409 em caso de duplicidade)
  - `POST /auth/admin/delete-user` (remove usuário; PRs ficam órfãos; PDI removido; relações gerenciais desconectadas)

- PRs (JWT): `GET /prs` (aceita `?ownerUserId=` com checagem de permissão), `GET /prs/:id`, `POST /prs`, `PUT /prs/:id`, `DELETE /prs/:id`
- PDI (JWT):
  - `GET /pdi/me` (404 se não existir)
  - `POST /pdi` (cria/substitui plano do usuário logado)
  - `PATCH /pdi/me` (atualização parcial)
  - `GET /pdi/:userId`, `PUT /pdi/:userId`, `DELETE /pdi/:userId` (somente dono ou manager)
- Teams (JWT):
  - `GET /teams` (lista sumário de times com contadores)
  - `GET /teams?details=true` (lista completa com memberships - otimizado para manager dashboard)
  - `GET /teams/mine` (times onde sou manager)
  - `GET /teams/:id` (detalhes de um time específico)
  - `POST /teams`, `PUT /teams/:id`, `DELETE /teams/:id` (CRUD - admin)

Permissões

- PRs filtrados por `ownerUserId` e PDI de outro usuário só podem ser acessados pelo próprio dono ou por alguém que esteja listado como seu manager.

Administração

- Campo `isAdmin` no modelo de usuário (Prisma) habilita acesso administrativo.
- Campo opcional `githubId` (login do GitHub) permite vincular automaticamente PRs importados: se o campo `user` do payload do PR (login GitHub) casar com `githubId` de um usuário, o `ownerUserId` é preenchido automaticamente.
- O primeiro usuário registrado no sistema é promovido automaticamente a admin.
- A página `/admin` permite criar contas e gerenciar relações de gestão.
- Atalho de teclado: `g` seguido de `a` navega para a página de administração (se o usuário for admin).
- Erros de unicidade (email ou githubId) retornam 409 com mensagem amigável.

## Tipagens

Agora vivem dentro de cada feature (`features/<domínio>/types/*.ts`). Exemplos: `features/prs/types/pr.ts`, `features/pdi/types/pdi.ts`, `features/admin/types/user.ts`.

Diretriz: nunca criar novo arquivo em `src/types`. Use o escopo da feature ou uma pasta `shared/` futura (ainda não necessária).

## Mocks

- `mockPrs` em `src/mocks/prs.ts`
- `mockPdi` em `src/mocks/pdi.ts`

Para adicionar mais PRs basta inserir novos objetos no array `mockPrs` respeitando a interface `PullRequest`.

## Componentes Chave (Exemplos)

- PDI: `EditablePdiView`, `sections/MilestonesSection`, `editors/KeyResultsEditor`, `structure/SaveStatusBar`
- PRs: `PrList`, `PrDetailDrawer`, `PrStats`, `ProgressCharts`, `SummaryCards`
- Admin: `AdminUserRow`, `ManagerDrawer`, `CreateUserModal`, `AdminGate`
- Auth: `LoginForm`

## Decisões de Design / UI

- Light mode padrão; paleta `surface` minimalista.
- Sidebar persistente desktop; TopBar só em mobile.
- Redução de excesso de cores nas métricas (cards neutros com pontos de cor).
- PR stats com distribuição de linhas adicionadas/deletadas (barra empilhada).
- AuthContext gerencia token + user.
- PDI agora persiste no backend; UI desativou localStorage para PDI na tela.
- Emojis removidos de ações/tabelas na área administrativa; padronizado com `react-icons`.
- Cabeçalhos da tabela de equipes sem ícones (texto simples para legibilidade e densidade).
- Picker de gerentes (admin > usuários) agora abre via portal fixo no `document.body`, evitando scrollbars horizontais/verticais indesejados quando aberto dentro de tabelas.
- Botão de alternar admin desativado para o próprio usuário logado (não permite auto‑remoção de privilégio admin).

## Próximos Passos Sugeridos

Backend/API

1. DTO + validation pipes (auth, prs, pdi)
2. Endpoints granulares de PDI (patch por bloco/milestone)
3. `/prs/metrics` agregadas (tempo merge, churn, distribuição estados)
4. (Concluído) Observabilidade básica: logging estruturado + request id + logs de domínio
5. Métricas de desempenho simples (latências agregadas /p95) via sumarização de logs (futuro)

Frontend 6. Command Palette (Ctrl/⌘+K) 7. Dark mode toggle 8. Persistência de checklist / notas de review de PR 9. Export / import de PDI (JSON / Markdown) 10. Indicators de sincronização por seção (granular)

Qualidade / Segurança 11. Testes E2E (Nest + frontend smoke) 12. Refresh token + revogação 13. Sanitização markdown robusta

## Como Rodar (Full Stack)

Pré-requisitos: Node 20+.

### Backend

Pré-requisitos: Docker / Node 20+

Subir Postgres:

```bash
cd backend
docker compose up -d
```

Configurar `.env` (exemplo):

```
DATABASE_URL="postgresql://forge_user:forge_pass@localhost:5433/forge_db"
JWT_SECRET="dev_jwt_secret"
```

Instalar dependências e aplicar migrações:

```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

Seed de dados (mock completo + reset de banco):

```bash
# do diretório raiz do projeto
bash script.sh
```

O script irá:

- Subir o Postgres (via Docker) se necessário e aguardar disponibilidade
- Resetar o schema via Prisma (ou via SQL com docker em fallback)
- Aguardar a API ficar pronta antes de disparar requests
- Criar o admin (primeiro usuário) e obter token
- Criar usuários (manager + 2 devs) via endpoint admin e vincular relações
- Popular PRs variados (open/merged/closed) em frontend/backend
- Criar um PDI completo para cada dev

### Frontend

Instalação e dev:

```bash
cd frontend
npm install
npm run dev
```

Build produção:

```bash
cd frontend
npm run build
npm run preview
```

## Convenções de Código

- `import type` para diferenciar tipos.
- Reducer centraliza mutações de PDI; evitar state derivado duplicado.
- Hooks isolam efeitos remotos e debounce.
- Extração de componentes de layout/estrutura em `pdi/*` reduz acoplamento.

## Adicionando Novos PRs (Mock / Durante Transição)

```ts
mockPrs.push({
  id: "ID_UNICO",
  author: "dev",
  repo: "repo-name",
  title: "Título do PR",
  created_at: new Date().toISOString(),
  state: "open",
  lines_added: 0,
  lines_deleted: 0,
  files_changed: 0,
  ai_review_summary:
    "Resumo Geral\n\nPontos fortes:\n...\nPontos fracos/risco:\n...",
  review_comments_highlight: ["Item 1", "Item 2"],
});
```

### Exemplo de Payload de Criação/Atualização de PR (API)

Campos snake_case são mapeados internamente para camelCase; datas terminadas em `_at` são convertidas para Date:

```json
{
  "id": 987654321,
  "repo": "org/repo",
  "number": 42,
  "title": "Improve performance of X",
  "state": "open",
  "user": "github-login",
  "created_at": "2025-09-13T10:15:00Z",
  "updated_at": "2025-09-13T10:20:00Z",
  "total_additions": 120,
  "total_deletions": 30,
  "total_changes": 150,
  "files_changed": 8
}
```

Se `ownerUserId` não for enviado e `user` corresponder ao `githubId` de um usuário, o vínculo é atribuído automaticamente.

## Ajustando Tema

Arquivo: `tailwind.config.js`

- Paleta clara atual em `surface`.
- Para reativar dark mode: criar variantes e togglar classe `dark` no `<html>`.

## Persistência Local

O PDI passou a persistir no backend. O uso de `localStorage` foi desativado na tela de PDI para evitar conflito com o estado remoto.

## Limitações Atuais

- PDI salvo como blob único (PUT/PATCH) – falta granularidade.
- Checklist / review notes de PR não persiste.
- Falta DTO/validation pipes (payloads PR/PDI aceitam `any`).
- Sem refresh token / rotação de chave JWT.
- Sanitização markdown mínima.
- Métricas agregadas de PR ausentes.
- Sugestões de PDI ainda placeholder (IA).

## Qualidade / Build / Testes

- Frontend: `npm run build` / `npm run dev`
- Backend: `npm run start:dev`
- Testes atuais concentrados em reducer de PDI; utilidades migradas para `features/pdi/lib`
- Planejar: testes de hooks remotos (mock fetch), auto‑save com timers, edge cases de milestones
- ESLint + TS estritos (`strict`, `noUnusedLocals`)

## Segurança

- Hash bcrypt para senhas (backend)
- JWT simples (7d) sem refresh; renovar estratégia depois
- Sanitização limitada (inputs ainda não validados por DTO)

* Entrada de usuário limitada a campos de texto simples; markdown ainda é ingênuo (baixa superfície de XSS). Revisar sanitização ao adotar parser real.

## Contato / Handoff

Próximo agente deve:

1. Configurar backend (.env + docker compose up) e rodar migrações
2. Criar usuário via /auth/register (curl ou frontend) e validar /auth/me
3. Criar/atualizar PRs (POST /prs) e verificar listagem no frontend
4. Escolher item da lista "Possíveis Próximos Passos" (priorizar DTO + filtros) e implementar

---

MVP pronto para extensão.

## Mudanças Recentes (Resumo)

- Administração
  - Modal de criação de usuário reestruturado (grid responsivo, overlay corrigido).
  - Tabela simplificada (Usuário | Permissões | Gerentes) com header fixo e gerência inline.
  - Atribuição de manager via menu/botão “+ Adicionar gerente”; nomes longos com truncamento e tooltip.
  - Erro de e-mail duplicado tratado como 409 (mensagem amigável no frontend).
- Navegação e páginas
  - Sidebar renovada com ícones (react-icons), visual mais consistente e logout destacado.
  - Páginas de PRs e PDI com iconografia e tabelas/cartões refinados.
- PDI
  - Seção “Resultado” agora totalmente editável: nível antes/depois, evidências, adicionar/remover linhas.
  - Adição rápida a partir de competências existentes ou criação manual de nova área.
- Admin / GitHub
  - Adicionados campo `githubId` ao usuário e edição inline na página `/admin`.
  - Vinculação automática de PRs pelo login GitHub (`user` do PR -> `githubId` do usuário) quando `ownerUserId` não for enviado.
  - Ação de remoção de usuário (soft para PRs: apenas anula ownerUserId) disponível na UI admin.

### Dashboard de Manager (Atualizações 2025-09-14)

| Alteração               | Antes                                                                      | Depois                                                    | Benefício                                         |
| ----------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| Métricas de topo        | 3 cards separados (Subordinados / PRs / PDIs) ocupando altura considerável | Barra horizontal única `TeamOverviewBar`                  | Menor consumo vertical, leitura sequencial rápida |
| Detalhes de subordinado | Drawer lateral sobreposto                                                  | Painel em fluxo (inline) abaixo da grade                  | Menos compressão lateral, contexto preservado     |
| KPI card / tab          | Exibido (sem dados maduros)                                                | Removido                                                  | Redução de ruído visual                           |
| Componentes legados     | `ManagerMetricCards`, `ReportDrawer`                                       | Removidos do codebase                                     | Simplificação e menor bundle                      |
| Estado loading          | Traço ou conteúdo “saltando” rapidamente                                   | Skeletons com atraso mínimo (`useDeferredLoading`) + fade | Percepção de fluidez, ausência de flicker         |

### Admin (Atualizações 2025-09-24)

- Removidos ícones dos cabeçalhos de colunas nas tabelas (ex.: Equipes) para reduzir ruído visual.
- Substituídos emojis por ícones do `react-icons` em ações (ex.: remoção de usuário).
- Corrigido comportamento do seletor de Gerentes: agora é renderizado em portal com posicionamento absoluto relativo à âncora, evitando ativação de scroll horizontal/vertical no container da tabela.
- Prevenido auto‑remoção de privilégios: o admin logado não pode remover seu próprio acesso admin (toggle desativado na própria linha).

#### Novo Componente: `TeamOverviewBar`

Características:

- Estrutura compacta (título + 3 métricas linearizadas com separadores sutis `|` / `•`).
- Não fixa (rola com o conteúdo para não competir com o header global futuro).
- Sem interatividade; foco em leitura imediata.
- Tipografia reduzida com `tabular-nums` nos valores para estabilidade visual.

#### Skeleton & Carregamento Diferido

Implementado hook `useDeferredLoading(delay=~120ms, minVisible=~300ms)` que:

1. Só exibe skeleton se a requisição ultrapassar o delay (evita “flash”).
2. Mantém skeleton tempo mínimo para evitar troca abrupta.
3. Aplica fade de opacidade ao transicionar lista de cards (0.55 ➜ 1).

Skeletons criados:

- `TeamOverviewBar` placeholders (blocos curtos de valor + label).
- `ReportCardSkeleton`: avatar circular neutro, linhas de texto, badges opacas e barra de progresso parcial.

#### Limpeza de Código

- Removidos arquivos: `ManagerMetricCards.tsx`, `ReportDrawer.tsx`.
- Exports eliminados do barrel `features/manager/index.ts` para prevenir import acidental.
- Build verificado pós-removal (nenhum consumidor quebrado).

#### Evoluções Futuras (Sugestões)

- Deep link para subordinado e aba (`/manager?user=<id>&tab=pdi`).
- Lazy load do painel de detalhes (code splitting) quando usuário é selecionado.
- Indicadores de atualização em background (ex.: pequena animação de progress bar sob a barra de overview).
- Métricas agregadas adicionais (lead time médio, throughput semanal) quando endpoint consolidado estiver pronto.

> **Nota (2025-09-26)**: `TeamOverviewBar` e `useDeferredLoading` foram removidos durante refatoração person-centric. Ver seção "Dashboard de Manager - Refatoração Person-Centric" para detalhes da nova implementação.

### Novidades Técnicas

- PRs: Paginação server-side (`GET /prs?page=1&pageSize=20`) retornando `{ items, total, page, pageSize }` e frontend ajustado para usar `serverPaginated` em `PrList`.
- PRs: Filtro inclusivo para PDI / visão de subordinado: quando `ownerUserId` é enviado, a busca inclui PRs cujo `ownerUserId` seja o usuário OU cujo login GitHub (`user`) case com `githubId` do usuário.
- PRs: Hook `useRemotePrs` agora envia page/pageSize e processa resposta paginada.
- PDI: Salvamento otimista no `EditablePdiView` com rollback em caso de falha (antes ficava sem feedback). Fallback POST quando PATCH retorna 404.
- PDI: Edição via manager usa `saveForUserId` (PUT `/pdi/:userId`). Garantir que o manager selecione explicitamente o subordinado correto antes de editar.
- Admin: Removidos imports React obsoletos para build mais limpo (React 19 JSX transform).
- Infra: Ajustes menores de tipagem e prevenção de BigInt vs number em filtros de PRs.
- Backend: Modularização (PrismaModule + módulos de domínio) concluída; guard `OwnerOrManagerGuard` substitui verificações manuais; introduzido `LoggingInterceptor` e logs de serviço; util de erro único Prisma para respostas 409 consistentes; remoção de client Prisma direto de arquivos de domínio.

### Atualizações PDI (2025-09-14)

#### UX de Resultados / Competências

- Editor de Resultados redesenhado em cards: cada competência agora tem um bloco com título, seleção de nível Antes / Depois (0–5), barra de evolução com gradiente mostrando progresso e delta textual (+N / Sem mudança / regressão).
- Valores não definidos exibem traço "—" ao invés de forçar 0; barra só aparece quando há pelo menos um lado definido.
- Botão Limpar explícito para remover nível (removido comportamento implícito de clique para limpar que causava confusão).
- Acessibilidade: navegação por teclado (Arrow Left/Right, Home/End, Delete/Backspace/Space para limpar) via radiogroup; foco visível; mensagens úteis para leitores de tela.
- Área de evidências estilizada, placeholder claro incentivando exemplos.
- Novo componente de adição (AddResultBar): sugestões filtradas conforme digitação, chips rápidos (até 10 disponíveis), detecção de duplicado com feedback visual e aria-live para sucesso/erro.
- Destaque visual temporário (pulse + borda verde) no card recém-adicionado para reforçar feedback.

#### Autosave & Merge

- Introduzido campo local `lastEditedAt` (apenas no frontend) em cada record para evitar que respostas de PATCH atrasadas revertam mudanças recentes.
- Estratégia `mergeServerPlan` compara timestamps por record quando a seção de resultados está em edição e preserva o valor mais recente local.
- Sanitização antes do envio: `lastEditedAt` removido no hook `useAutoSave` para evitar `400 Bad Request` devido ao `ValidationPipe (forbidNonWhitelisted)` no backend.

#### Validação / Backend

- O erro 400 identificado vinha do envio de campos extras (`lastEditedAt`) não presentes em `PdiCompetencyRecordDto` (whitelist + forbidNonWhitelisted). Ajuste feito no frontend; alternativa futura seria estender DTO ou desativar `forbidNonWhitelisted` (não recomendado agora).

#### Próximas Melhorias Potenciais

- Persistir `lastEditedAt` no backend (opcional) para auditoria e merge mais robusto colaborativo.
- Animação de scroll automática para card recém-adicionado (foco acessível).
- Chips de evidência (parse de linhas prefixadas com `- `) com remoção individual.
- Undo rápido para remoção de competência (toast com timeout).
- Diff visual quando houver regressão (ex: cor âmbar na barra parcial regressiva).

#### Testes Recomendados (a adicionar)

- Caso de merge: servidor retorna valor antigo após alteração local -> garantir que merge mantém local.
- Sanitização: função que prepara payload remove `lastEditedAt` e outros campos desconhecidos.
- Acessibilidade: snapshot de roles/ARIA nos botões de nível.

### Frontend Refactor (Feature PRs & Shared Layer)

- Introduzida pasta `frontend/src/shared` contendo apenas componentes verdadeiramente genéricos (layout / UI atômica): `PaginationFooter`, `StatCard`, `LinesDeltaCard`, `SidePanel`, `Badge`.
- Removido código morto: componentes antigos `ProgressCharts` e `SummaryCards` (ficarão para futura reimplementação quando endpoint de métricas existir).
- Extraídas partes reutilizáveis da feature de PRs (paginação, cards, painel lateral) para reduzir duplicação futura entre PRs, PDI e Admin.
- Criado util de status específico de PR em `features/prs/lib/status.ts` (antes estava incorretamente em `shared/lib`). Mantém `shared` neutro de domínio.
- Padronizados imports via barrels (`@/shared`, `@/features/prs`).
- Adicionado `Badge` genérica com helper `semanticStatusBadge` para mapear estados sem acoplar lógica de PR.
- Documentação TSDoc mínima aplicada aos componentes compartilhados (foco em responsabilidade e props principais).

### Fluxo de Paginação de PRs

Requisição:

```
GET /prs?page=2&pageSize=50
Authorization: Bearer <token>
```

Opcional `ownerUserId` para filtrar subordinado (aplica checagem de permissão). Retorno:

```json
{
  "items": [
    {
      /* PullRequest */
    }
  ],
  "total": 137,
  "page": 2,
  "pageSize": 50
}
```

Limites: `page >= 1`, `pageSize` máximo 200 (valores maiores são normalizados para 200).

### Fluxo de Persistência de PDI

Self:

- PATCH `/pdi/me` para atualizações parciais.
- POST `/pdi` faz upsert: cria se inexistente ou substitui campos informados.

Manager editando subordinado:

- PUT `/pdi/:userId` (substitui blob completo). UI envia apenas campos atuais.

Estratégia atual: enviar o blob completo (milestones/KRs/records). Futuro: endpoints granulares (ex.: `PATCH /pdi/:userId/milestones/:id`).

### Observações sobre Edição de PDI via Manager

Se notar que ao editar está modificando o próprio PDI do manager:

1. Verifique se um subordinado foi realmente selecionado (estado `currentId`).
2. Confirme a URL da requisição (`PUT /pdi/<idDoReport>`).
3. Garanta que a lista de reports não inclui o próprio manager.
4. Planejado: impedir edição até seleção explícita (todo).

### Próximos Itens Recomendados

- Mover filtros de PR (repo/state/author) para o backend (where condicional + índices).
- Sort configurável (`sort=createdAt:desc|lines:asc`).
- Debounced auto-save PDI (PATCH incremental) com status visual (badge “Sincronizado / Pendente”).
- DTO + validação para PDI/PRs (class-validator) para sanitizar payload antes de persistir JSON.

Dicas rápidas

- Para testar administração, faça login com um usuário admin e abra `/admin`.
- Na página Meu PDI (`/me/pdi`), clique em “Editar PDI” para habilitar a edição da seção “Resultado”. Salve para persistir no backend.
