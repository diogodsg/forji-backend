# Forge

Plataforma (MVP) para acompanhar Pull Requests e evolução de PDI com autenticação, backend NestJS + PostgreSQL/Prisma e frontend React, incluindo dashboard de manager (PRs + PDI dos subordinados).

## Visão Geral

Arquitetura full‑stack:

- Backend NestJS: autenticação JWT, Postgres (Docker) via Prisma, endpoints para PRs e PDI persistente.
- Frontend React 19 + TypeScript (Vite) com Tailwind; layout com Sidebar + top bar mobile; fluxo de login/registro; tela de Manager.
- Persistência real de usuários, Pull Requests e PDI (milestones/KRs/records como JSON no Prisma).

Hoje a aplicação permite:

- Registrar e logar usuários (JWT) /auth/register /auth/login
- Manter sessão (token + /auth/me)
- Listar PRs persistidos do usuário (/me/prs) (ou fallback mock se vazio)
- Ver detalhes de um PR com resumo de IA e checklist (ainda não persistente)
- Visualizar e editar PDI (/me/pdi) com persistência no backend:
  - Competências técnicas
  - Milestones / encontros
  - Tarefas (próximos passos) por encontro
  - Sugestões (IA placeholder) por encontro
  - Key Results opcionais (KR) com critérios de sucesso e ações de melhoria
  - Registros de evolução (nível antes/depois + evidências)
- Visualização de manager com abas PRs | PDI dos subordinados (`/manager`)
- Relação de gestão M:N (um usuário pode ter vários managers, e um manager vários reports)
- Lista de subordinados do manager (`/auth/my-reports`)
- Filtro de PRs por dono via query `?ownerUserId=` com checagem de permissão (manager ou dono)
- Navegação aprimorada com Sidebar (logo, seções) e avatar com logout
- Administração: página `/admin` para criação de usuários e gestão de relações (somente administradores)

## Stack

Frontend:

- React 19 + TypeScript (Vite)
- React Router DOM v7
- TailwindCSS + @tailwindcss/typography
- date-fns

Backend:

- NestJS + JWT (jsonwebtoken via `@nestjs/jwt`)
- Prisma ORM + PostgreSQL (container Docker)
- bcryptjs (hash de senha)
- PDI persistido no modelo `PdiPlan` (campos JSON para milestones/KRs/records)

Infra / Dev:

- Docker Compose (Postgres exposto em 5433)
- Prisma Migrations (`npx prisma migrate dev`)

## Estrutura de Pastas Principal

```
src/
  components/        -> Componentes reutilizáveis (PrList, PrDetailDrawer, PdiView, EditablePdiView, etc)
  pages/             -> Páginas de rota (MyPrsPage, MyPdiPage, ManagerDashboardPage)
  mocks/             -> Dados mock (prs.ts, pdi.ts)
  types/             -> Tipagens (pr.ts, pdi.ts)
  index.css          -> Estilos globais (Tailwind)
  App.tsx            -> Monta Provider de Auth e rotas dentro do layout
  layouts/           -> `AppLayout` (Sidebar + Main + Footer)
  components/nav/    -> Sidebar / TopBar / (futuro: CommandPalette)

backend/
  prisma/schema.prisma -> Modelos User, PullRequest e PdiPlan
  src/                 -> Auth, PRs, guards, controllers
  docker-compose.yml   -> Postgres
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
  - `POST /auth/admin/set-manager` (define um manager para um usuário)
  - `POST /auth/admin/remove-manager` (remove relação de manager)

- PRs (JWT): `GET /prs` (aceita `?ownerUserId=` com checagem de permissão), `GET /prs/:id`, `POST /prs`, `PUT /prs/:id`, `DELETE /prs/:id`
- PDI (JWT):
  - `GET /pdi/me` (404 se não existir)
  - `POST /pdi` (cria/substitui plano do usuário logado)
  - `PATCH /pdi/me` (atualização parcial)
  - `GET /pdi/:userId`, `PUT /pdi/:userId`, `DELETE /pdi/:userId` (somente dono ou manager)

Permissões

- PRs filtrados por `ownerUserId` e PDI de outro usuário só podem ser acessados pelo próprio dono ou por alguém que esteja listado como seu manager.

Administração

- Campo `isAdmin` no modelo de usuário (Prisma) habilita acesso administrativo.
- O primeiro usuário registrado no sistema é promovido automaticamente a admin.
- A página `/admin` permite criar contas e gerenciar relações de gestão.
- Atalho de teclado: `g` seguido de `a` navega para a página de administração (se o usuário for admin).

## Tipagens Principais (Frontend)

`src/types/pr.ts`

```ts
export interface PullRequest {
  /* id, author, repo, title, timestamps, métricas básicas, resumo IA, checklist */
}
```

`src/types/pdi.ts` (principais entidades)

```ts
export interface PdiTask {
  id: string;
  title: string;
  done?: boolean;
}
export interface PdiKeyResult {
  id: string;
  description: string;
  successCriteria: string;
  currentStatus?: string;
  improvementActions?: string[];
}
export interface PdiMilestone {
  id: string;
  date: string;
  title: string;
  summary: string;
  improvements?: string[];
  positives?: string[];
  resources?: string[];
  tasks?: PdiTask[];
  suggestions?: string[]; // geradas por IA futuramente
}
export interface PdiPlan {
  userId: string;
  competencies: string[];
  milestones: PdiMilestone[];
  krs?: PdiKeyResult[];
  records: PdiCompetencyRecord[];
  createdAt: string;
  updatedAt: string;
}
```

## Mocks

- `mockPrs` em `src/mocks/prs.ts`
- `mockPdi` em `src/mocks/pdi.ts`

Para adicionar mais PRs basta inserir novos objetos no array `mockPrs` respeitando a interface `PullRequest`.

## Componentes Chave (Frontend)

- `PrList`: Tabela filtrável de PRs (filtros por repositório e status)
- `PrDetailDrawer`: Drawer lateral com detalhes, resumo IA e checklist
- `PdiView`: Exibe competências, milestones, sugestões, tarefas, KRs e resultado
- `EditablePdiView`: Wrapper com modo de edição + persistência local
- `TaskEditor` / `ListEditor` (internos ao componente editável)

## Decisões de Design / UI

- Light mode padrão; paleta `surface` minimalista.
- Sidebar persistente desktop; TopBar só em mobile.
- Redução de excesso de cores nas métricas (cards neutros com pontos de cor).
- PR stats com distribuição de linhas adicionadas/deletadas (barra empilhada).
- AuthContext gerencia token + user.
- PDI agora persiste no backend; UI desativou localStorage para PDI na tela.

## Possíveis Próximos Passos

1. DTO + validation pipes (class-validator) para /auth e /prs
2. Filtros/paginação server-side para PRs
3. Endpoint /prs/metrics agregando estatísticas (linhas, tempo médio merge)
4. Endpoints granulares de PDI (ex.: add/remove task, update milestone) evitando enviar o blob completo
5. Command Palette (Ctrl/⌘+K) + quick search
6. Dark mode toggle
7. Persistir checklist de PR e anotações de review
8. Exportar / importar PDI (JSON / Markdown)
9. Testes (Vitest + e2e Nest) básicos
10. Refresh token / expiração antecipada + logout global
11. Observabilidade mínima (logs estruturados / pino) no backend

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

- Imports de tipos usam `import type` para compatibilidade com `verbatimModuleSyntax`
- Classes Tailwind priorizam semântica leve; evitar duplicação criando componentes quando necessário
- Evitar lógica complexa nos componentes de página; mover para hooks conforme escalar

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

## Ajustando Tema

Arquivo: `tailwind.config.js`

- Paleta clara atual em `surface`.
- Para reativar dark mode: criar variantes e togglar classe `dark` no `<html>`.

## Persistência Local

O PDI passou a persistir no backend. O uso de `localStorage` foi desativado na tela de PDI para evitar conflito com o estado remoto.

## Limitações Atuais

- Falta DTOs para alguns endpoints (PRs) e mensagens de erro consistentes
- Paginação real ainda pendente (há filtro server-side por `ownerUserId`)
- Falta refresh token / expiração explícita
- Checklist de PR não persiste
- Sem testes automatizados
- IA apenas placeholder
- Sem export/import PDI

## Qualidade / Build

- `npm run build` gera artefatos em `dist/`
- Sem testes ainda (pendente)
- Lint base via ESLint config padrão Vite + TS

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
