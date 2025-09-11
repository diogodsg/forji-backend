# Forge

Plataforma (MVP) para acompanhar Pull Requests e evolução de PDI com autenticação, backend NestJS + PostgreSQL/Prisma e frontend React.

## Visão Geral

Arquitetura full‑stack:

- Backend NestJS: autenticação JWT, Postgres (Docker) via Prisma, endpoints para PRs e (em progresso) PDI.
- Frontend React 19 + TypeScript (Vite) com Tailwind; layout com Sidebar + top bar mobile; fluxo de login/registro.
- Persistência real de usuários e Pull Requests; PDI ainda mock local (fase seguinte).

Hoje a aplicação permite:

- Registrar e logar usuários (JWT) /auth/register /auth/login
- Manter sessão (token + /auth/me)
- Listar PRs persistidos do usuário (/me/prs) (ou fallback mock se vazio)
- Ver detalhes de um PR com resumo de IA e checklist (ainda não persistente)
- Visualizar e editar PDI (/me/pdi) com:
  - Competências técnicas
  - Milestones / encontros
  - Tarefas (próximos passos) por encontro
  - Sugestões (IA placeholder) por encontro
  - Key Results opcionais (KR) com critérios de sucesso e ações de melhoria
  - Registros de evolução (nível antes/depois + evidências)
- Visualização "manager" mock (/users/:userId/prs) reutilizando a lista de PRs
- Navegação aprimorada com Sidebar (logo, seções) e avatar com logout

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

Infra / Dev:

- Docker Compose (Postgres exposto em 5433)
- Prisma Migrations (`npx prisma migrate dev`)

## Estrutura de Pastas Principal

```
src/
  components/        -> Componentes reutilizáveis (PrList, PrDetailDrawer, PdiView, EditablePdiView, etc)
  pages/             -> Páginas de rota (MyPrsPage, MyPdiPage, ManagerPrsPage)
  mocks/             -> Dados mock (prs.ts, pdi.ts)
  types/             -> Tipagens (pr.ts, pdi.ts)
  index.css          -> Estilos globais (Tailwind)
  App.tsx            -> Monta Provider de Auth e rotas dentro do layout
  layouts/           -> `AppLayout` (Sidebar + Main + Footer)
  components/nav/    -> Sidebar / TopBar / (futuro: CommandPalette)

backend/
  prisma/schema.prisma -> Modelos User e PullRequest
  src/                 -> Auth, PRs, guards, controllers
  docker-compose.yml   -> Postgres
```

## Rotas Frontend

| Rota                 | Descrição                       |
| -------------------- | ------------------------------- |
| `/` / `/me/prs`      | Lista de PRs (autenticado)      |
| `/me/pdi`            | Página de acompanhamento do PDI |
| `/users/:userId/prs` | Modo "manager" (read-only)      |

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
- AuthContext gerencia token + user; fallback a mocks somente onde ainda não há backend (PDI).
- PDI continua local para iterar rápido antes de modelar schema.

## Possíveis Próximos Passos

1. DTO + validation pipes (class-validator) para /auth e /prs
2. Filtros/paginação server-side para PRs
3. Endpoint /prs/metrics agregando estatísticas (linhas, tempo médio merge)
4. Migrar PDI para Prisma (schema: Plan, Milestone, Task, CompetencyRecord, KeyResult)
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

Instalar dependências e migrar:

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```

### Frontend

Instalação e dev:

```bash
npm install
npm run dev
```

Build produção:

```bash
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

O PDI editável salva automaticamente em `localStorage` (chave `pdi_plan_me`). O botão _Reset_ restaura o mock original e limpa o storage.

## Limitações Atuais

- PDI não está no backend (ainda local)
- Falta validação de entrada no backend (DTOs)
- Sem paginação real / filtros server-side em PRs
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
