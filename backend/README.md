# Forge Backend

API NestJS com autenticação JWT, Prisma + PostgreSQL. PRs e PDI persistidos.

## Endpoints

- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- PRs (JWT): `GET /prs`, `GET /prs/:id`, `POST /prs`, `PUT /prs/:id`, `DELETE /prs/:id`
- PDI (JWT):
  - `GET /pdi/me` (404 se não existir)
  - `POST /pdi` (cria/substitui plano do usuário logado)
  - `PATCH /pdi/me` (atualização parcial)
  - `GET /pdi/:userId`, `PUT /pdi/:userId`, `DELETE /pdi/:userId`

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
