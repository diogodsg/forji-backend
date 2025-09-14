# Forge Backend

API NestJS (Node 20+) com autenticação JWT, Prisma + PostgreSQL.

## Arquitetura

Estrutura orientada a domínios:

- `auth/` — autenticação, registro e endpoints administrativos
- `prs/` — pull requests (CRUD, listagem filtrada, métricas básicas)
- `pdi/` — plano de desenvolvimento individual (upsert/patch plano completo)
- `dto/` — DTOs compartilhados (pode futuramente migrar para subpastas de domínio)
- `permissions/` — serviços de autorização de alto nível
- `common/` — infra transversal (guards, interceptors, logger, middleware)

Elementos transversais:

- `ValidationPipe` global com `whitelist + forbidNonWhitelisted + transform`
- Interceptor `BigIntSerializationInterceptor` converte BigInt para string em respostas
- Logging estruturado via Pino (`common/logger/pino.ts`) com `requestId` injetado por middleware
- Serviço de permissões centralizado (`PermissionService.isOwnerOrManager`)

### Fluxo de Auth

1. Registro (`/auth/register`) — primeiro usuário vira admin automaticamente
2. Login retorna JWT (`access_token`)
3. Guards protegem domínios (`JwtAuthGuard`) e endpoints admin (`AdminGuard`)

### Pull Requests

- Aceita payloads no padrão snake_case (GitHub-like) convertidos internamente para camelCase
- Filtros suportados: ownerUserId, repo, state, author, q (busca), sort, paginação
- Meta opcional (repos/autores) via `?meta=1`
- Auto-vínculo de PR ao usuário se `githubId` combinar (preenche `ownerUserId`).

### PDI

- Armazena plano completo em JSON (milestones, key results, competency records)
- Operações: criar/substituir (`POST /pdi`), patch parcial (`PATCH /pdi/me`), acesso gerenciado a outros usuários (owner ou manager)

## Endpoints

## Endpoints

- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `GET /auth/my-reports`, `POST /auth/set-manager`, `POST /auth/remove-manager`
- PRs (JWT): `GET /prs` (pagina: `?page=&pageSize=` até 200; filtro: `?ownerUserId=` com checagem de manager), `GET /prs/:id`, `POST /prs`, `PUT /prs/:id`, `DELETE /prs/:id`
- PDI (JWT):
  - `GET /pdi/me` (404 se não existir)
  - `POST /pdi` (upsert: cria ou substitui plano do usuário logado)
  - `PATCH /pdi/me` (atualização parcial)
  - `GET /pdi/:userId`, `PUT /pdi/:userId`, `DELETE /pdi/:userId`

### Administração (somente admin)

- `GET /auth/users` — lista usuários (id, email, name, managers, reports, timestamps)
- `POST /auth/admin/create-user` — cria usuário; aceita `isAdmin` opcional
- `POST /auth/admin/set-admin` — promove ou remove privilégio admin
- `POST /auth/admin/set-manager` — conecta um manager a um usuário
- `POST /auth/admin/remove-manager` — desconecta manager de um usuário
- `POST /auth/admin/set-github-id` — define/remove githubId (409 se duplicado)
- `POST /auth/admin/delete-user` — remove usuário (PRs ficam órfãos, PDI removido, relações gerenciais desconectadas)

## Como rodar

Pré-requisitos: Docker, Node 20+.

1. Subir Postgres

```bash
cd backend
docker compose up -d
```

2. Configurar `.env`

```
DATABASE_URL="postgresql://forge_user:forge_pass@localhost:5433/forge_db?schema=public"
JWT_SECRET="your_jwt_secret_here"
```

3. Instalar deps, migrar e iniciar

```bash
npm install
npx prisma migrate dev
npm run start:dev
```

## Notas

- `prisma/schema.prisma` contém os modelos `User`, `PullRequest` e `PdiPlan` (milestones/KRs/records como JSON).
- Para desenvolvimento rápido, o PDI usa colunas JSON. Futuro: normalizar em tabelas.
- O modelo `User` possui o campo `isAdmin` (boolean, default false). O primeiro usuário registrado é promovido automaticamente a admin no `AuthService.register`.
- Campo opcional `githubId` permite auto-vínculo de PRs (se `user` do payload de PR corresponder a um githubId cadastrado, o `ownerUserId` é preenchido).

## Observabilidade & Infra

- Logs estruturados (pino) com níveis configuráveis (`LOG_LEVEL`)
- `requestId` para correlação em cada requisição
- Serialização BigInt segura evitando perda de precisão no client

## Manutenção / Técnicas

- Código legado duplicado (controllers/services raiz) agendado para remoção definitiva
- Próximos passos: criar módulos Nest dedicados, DTO de query para PRs, remover conversão `Number(BigInt)` no serviço de PR

## Changelog

Veja `CHANGELOG.md` para histórico de modificações.

### Tratamento de erros

- Unicidade: email ou githubId duplicados retornam `409 Conflict` com mensagem amigável (`P2002`).
- Ao deletar usuário: PRs têm `ownerUserId` nulado; plano PDI removido; relações manager são desconectadas.
