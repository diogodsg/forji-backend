# 🔥 Forge Backend

Backend do sistema Forge desenvolvido em **NestJS + Prisma + PostgreSQL** com sistema multi-workspace e hierarquia de gestão.

## 📋 Stack Tecnológica

- **Framework:** NestJS 10.4.20
- **ORM:** Prisma 5.22.0
- **Database:** PostgreSQL 14+
- **Auth:** JWT (Passport)
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger/OpenAPI
- **Security:** Helmet + Rate Limiting (Throttler)
- **Language:** TypeScript (strict mode)

## ✨ Features Implementadas

✅ **Multi-Workspace System** - Isolamento completo de dados por workspace  
✅ **Autenticação JWT** - Com contexto de workspace  
✅ **Gestão de Usuários** - CRUD completo com paginação  
✅ **Gestão de Times** - Times com membros e roles  
✅ **Hierarquia de Gestão** - Regras INDIVIDUAL e TEAM  
✅ **Swagger/OpenAPI** - Documentação interativa completa  
✅ **Global Error Handling** - Tratamento de erros HTTP e Prisma  
✅ **Request Logging** - Logs detalhados de todas as requisições  
✅ **Rate Limiting** - Proteção contra abuso de API  
✅ **Security Headers** - Helmet com CSP configurado

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5433/forge?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=8000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"

# Rate Limiting
THROTTLE_TTL=10000
THROTTLE_LIMIT=10
```

### 3. Criar e Popular Banco de Dados

```bash
# Executar migrations (cria as tabelas)
npx prisma migrate dev

# Popular com dados iniciais (opcional)
npx prisma db seed
```

### 4. Iniciar Servidor

```bash
# Modo desenvolvimento (com watch)
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

O servidor estará disponível em: **http://localhost:8000/api**

## 📚 Documentação da API

### Swagger UI (Recomendado)

Acesse a documentação interativa completa em:

**🔗 http://localhost:8000/api/docs**

- ✅ 37 endpoints documentados
- ✅ Teste direto no navegador
- ✅ Autenticação JWT integrada
- ✅ Schemas de request/response
- ✅ Exemplos de uso

### Documentação em Markdown

Veja também: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 📁 Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma          # Schema do banco (multi-workspace)
│   ├── seed.ts                # Dados iniciais
│   └── migrations/            # Histórico de migrations
│
├── src/
│   ├── main.ts                # Entry point + Swagger config
│   ├── app.module.ts          # Root module + Rate limiting
│   │
│   ├── auth/                  # 🔐 Autenticação JWT + Workspaces
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts # Register, Login, Me, Switch Workspace
│   │   ├── auth.service.ts
│   │   ├── strategies/        # JWT + Local strategies
│   │   ├── guards/            # JwtAuthGuard
│   │   ├── decorators/        # @CurrentUser()
│   │   ├── entities/          # User entity + utils
│   │   └── dto/               # RegisterDto, LoginDto
│   │
│   ├── workspaces/            # 🏢 Multi-tenant Workspaces
│   │   ├── workspaces.module.ts
│   │   ├── workspaces.controller.ts # CRUD + Members + Invite
│   │   ├── workspaces.service.ts
│   │   └── dto/               # Create, Update, Invite DTOs
│   │
│   ├── users/                 # 👥 Gestão de Usuários
│   │   ├── users.module.ts
│   │   ├── users.controller.ts # List, Search, CRUD, Password
│   │   ├── users.service.ts
│   │   └── dto/               # Create, Update, UpdatePassword DTOs
│   │
│   ├── teams/                 # � Gestão de Times
│   │   ├── teams.module.ts
│   │   ├── teams.controller.ts # CRUD + Members management
│   │   ├── teams.service.ts
│   │   └── dto/               # Team + Member DTOs
│   │
│   ├── management/            # 📊 Hierarquia de Gestão
│   │   ├── management.module.ts
│   │   ├── management.controller.ts # Rules + Subordinates + Teams
│   │   ├── management.service.ts    # Circular hierarchy prevention
│   │   └── dto/               # CreateRule DTO
│   │
│   ├── prisma/                # 🗄️ Prisma Service Global
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   └── common/                # 🛠️ Shared Resources
│       ├── filters/
│       │   └── http-exception.filter.ts # Global error handling
│       └── interceptors/
│           └── logging.interceptor.ts    # Request/response logs
│
├── test/                      # E2E tests
├── .env.example              # Environment variables template
├── API_DOCUMENTATION.md      # Complete API guide
├── PROGRESS.md               # Implementation progress
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Schema do Banco

### Decisões Arquiteturais

- **IDs:** UUID (não BigInt/Serial)
- **Naming:** snake_case no banco, camelCase no TypeScript (via @map)
- **Soft Delete:** `deleted_at` nullable
- **Timestamps:** `created_at` e `updated_at` automáticos
- **Multi-Workspace:** Isolamento completo de dados

### Modelos Principais

#### 1. Workspace (Multi-tenant)

```prisma
model Workspace {
  id          String          @id @default(uuid()) @db.Uuid
  name        String
  slug        String          @unique
  description String?
  avatarUrl   String?         @map("avatar_url")
  status      WorkspaceStatus @default(ACTIVE)

  members         WorkspaceMember[]
  teams           Team[]
  managementRules ManagementRule[]
}
```

#### 2. User (Usuários)

```prisma
model User {
  id       String   @id @default(uuid()) @db.Uuid
  email    String   @unique
  password String   // bcrypt hash
  name     String
  position String?
  bio      String?

  workspaceMemberships         WorkspaceMember[]
  teamMemberships              TeamMember[]
  managementRulesAsManager     ManagementRule[] @relation("ManagerRules")
  managementRulesAsSubordinate ManagementRule[] @relation("SubordinateRules")
}
```

#### 3. WorkspaceMember (Membros do Workspace)

```prisma
model WorkspaceMember {
  id          String        @id @default(uuid()) @db.Uuid
  userId      String        @map("user_id") @db.Uuid
  workspaceId String        @map("workspace_id") @db.Uuid
  role        WorkspaceRole @default(MEMBER) // OWNER, ADMIN, MEMBER

  user      User      @relation(fields: [userId], references: [id])
  workspace Workspace @relation(fields: [workspaceId], references: [id])
}
```

#### 4. Team (Times)

```prisma
model Team {
  id          String     @id @default(uuid()) @db.Uuid
  workspaceId String     @map("workspace_id") @db.Uuid
  name        String
  description String?
  status      TeamStatus @default(ACTIVE)

  workspace Workspace    @relation(fields: [workspaceId], references: [id])
  members   TeamMember[]
}
```

#### 5. TeamMember (Membros do Time)

```prisma
model TeamMember {
  id     String   @id @default(uuid()) @db.Uuid
  userId String   @map("user_id") @db.Uuid
  teamId String   @map("team_id") @db.Uuid
  role   TeamRole @default(MEMBER) // MANAGER, MEMBER

  user User @relation(fields: [userId], references: [id])
  team Team @relation(fields: [teamId], references: [id])
}
```

#### 6. ManagementRule (Hierarquia)

```prisma
model ManagementRule {
  id            String              @id @default(uuid()) @db.Uuid
  workspaceId   String              @map("workspace_id") @db.Uuid
  ruleType      ManagementRuleType  @map("rule_type") // INDIVIDUAL, TEAM
  managerId     String              @map("manager_id") @db.Uuid
  teamId        String?             @map("team_id") @db.Uuid
  subordinateId String?             @map("subordinate_id") @db.Uuid

  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  manager     User      @relation("ManagerRules", fields: [managerId], references: [id])
  subordinate User?     @relation("SubordinateRules", fields: [subordinateId], references: [id])
  team        Team?     @relation(fields: [teamId], references: [id])
}
```

### Enums

```prisma
enum WorkspaceStatus { ACTIVE, SUSPENDED, ARCHIVED }
enum WorkspaceRole   { OWNER, ADMIN, MEMBER }
enum TeamStatus      { ACTIVE, INACTIVE }
enum TeamRole        { MANAGER, MEMBER }
enum ManagementRuleType { INDIVIDUAL, TEAM }
```

## � Autenticação e Permissões

### JWT Token Structure

O JWT contém o contexto do workspace:

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "workspaceId": "workspace-uuid",
  "workspaceRole": "OWNER|ADMIN|MEMBER",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Workspace Roles

| Role   | Permissões                                             |
| ------ | ------------------------------------------------------ |
| OWNER  | Tudo (criar/editar/deletar workspace, gerenciar tudo)  |
| ADMIN  | Gerenciar usuários, times, regras de gestão            |
| MEMBER | Visualizar, editar próprio perfil, participar de times |

### Team Roles

| Role    | Permissões                                |
| ------- | ----------------------------------------- |
| MANAGER | Adicionar/remover membros, editar time    |
| MEMBER  | Visualizar time, participar de atividades |

### Management Rules

**INDIVIDUAL:** Relacionamento direto manager → subordinate

- Um gerente pode ter múltiplos subordinados
- Um subordinado pode ter múltiplos gerentes
- Previne hierarquia circular (A gerencia B, B não pode gerenciar A)

**TEAM:** Relacionamento manager → team

- Um gerente pode gerenciar múltiplos times
- Um time pode ter múltiplos gerentes
- Todos os membros do time são considerados subordinados

## 📜 Scripts NPM

### Desenvolvimento

```bash
npm run start          # Servidor normal
npm run start:dev      # Servidor em modo watch (recomendado)
npm run start:debug    # Servidor em modo debug
npm run build          # Build para produção
npm run start:prod     # Rodar build de produção
npm run format         # Formatar código com Prettier
npm run lint           # Lint com ESLint
```

### Prisma

```bash
npm run prisma:generate   # Gerar Prisma Client
npm run prisma:migrate    # Criar nova migration
npm run prisma:studio     # Abrir Prisma Studio (UI visual)
npm run prisma:seed       # Popular banco com dados
npx prisma db push        # Sync schema sem migration (dev only)
npx prisma migrate reset  # Reset completo do banco (cuidado!)
```

### Testes

```bash
npm run test           # Testes unitários
npm run test:watch     # Testes em modo watch
npm run test:cov       # Cobertura de testes
npm run test:e2e       # Testes end-to-end
npm run test:debug     # Testes em modo debug
```

## 🌐 API Endpoints (37 total)

### Authentication (4 endpoints)

```
POST   /api/auth/register          # Criar conta + workspace
POST   /api/auth/login             # Login (retorna JWT)
GET    /api/auth/me                # Perfil do usuário logado
POST   /api/auth/switch-workspace  # Trocar workspace ativo
```

### Workspaces (6 endpoints)

```
GET    /api/workspaces             # Listar workspaces do usuário
GET    /api/workspaces/:id         # Detalhes do workspace
POST   /api/workspaces             # Criar workspace
PUT    /api/workspaces/:id         # Atualizar workspace
DELETE /api/workspaces/:id         # Deletar workspace
POST   /api/workspaces/:id/invite  # Convidar usuário
```

### Users (7 endpoints)

```
GET    /api/users                  # Listar usuários (paginado)
GET    /api/users/search           # Buscar por nome/email
GET    /api/users/:id              # Ver perfil
POST   /api/users                  # Criar usuário (admin)
PATCH  /api/users/:id              # Atualizar perfil
PATCH  /api/users/:id/password     # Trocar senha
DELETE /api/users/:id              # Soft delete
```

### Teams (10 endpoints)

```
GET    /api/teams                         # Listar times
GET    /api/teams/search                  # Buscar times
GET    /api/teams/:id                     # Detalhes do time
POST   /api/teams                         # Criar time
PATCH  /api/teams/:id                     # Atualizar time
DELETE /api/teams/:id                     # Soft delete time
GET    /api/teams/:id/members             # Listar membros
POST   /api/teams/:id/members             # Adicionar membro
PATCH  /api/teams/:id/members/:userId     # Atualizar role
DELETE /api/teams/:id/members/:userId     # Remover membro
```

### Management (6 endpoints)

```
GET    /api/management/subordinates       # Listar subordinados
GET    /api/management/teams              # Listar times gerenciados
GET    /api/management/rules              # Listar regras (admin)
POST   /api/management/rules              # Criar regra hierárquica
DELETE /api/management/rules/:id          # Deletar regra
GET    /api/management/check/:userId      # Verificar se gerencia
```

## 📖 Exemplos de Uso

### 1. Registrar e Criar Workspace

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "workspaceName": "My Company"
  }'
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "workspace": {
    "id": "uuid",
    "name": "My Company",
    "slug": "my-company"
  },
  "access_token": "eyJhbGc..."
}
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response:**

```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "workspaceId": "uuid",
    "workspaceRole": "OWNER"
  }
}
```

### 3. Criar Time

```bash
curl -X POST http://localhost:8000/api/teams \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frontend Team",
    "description": "React and TypeScript developers"
  }'
```

### 4. Criar Regra de Gestão

```bash
# Regra INDIVIDUAL (gerente → subordinado)
curl -X POST http://localhost:8000/api/management/rules \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INDIVIDUAL",
    "managerId": "manager-uuid",
    "subordinateId": "subordinate-uuid"
  }'

# Regra TEAM (gerente → time)
curl -X POST http://localhost:8000/api/management/rules \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "TEAM",
    "managerId": "manager-uuid",
    "teamId": "team-uuid"
  }'
```

## 🔒 Segurança

### Implementações

- ✅ Bcrypt para hash de senhas (salt rounds: 10)
- ✅ JWT com expiração configurável
- ✅ CORS configurado
- ✅ Validation pipes globais
- ✅ Helmet headers (futuro)
- ✅ Rate limiting (futuro)

### Boas Práticas

- Senhas nunca são retornadas em responses
- Validation DTOs em todos os endpoints
- Guards para proteção de rotas
- Logs de segurança (futuro)

## 📚 API Documentation

A documentação completa da API estará disponível via Swagger em:

```
http://localhost:8000/api/docs
```

_(Swagger será configurado na Fase 5)_

### Endpoints Principais (Planejados)

#### Auth

- `POST /api/auth/register` - Criar nova conta
- `POST /api/auth/login` - Login com email/senha
- `GET /api/auth/me` - Dados do usuário logado

#### Users

- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Ver perfil
- `PATCH /api/users/me` - Editar próprio perfil
- `PATCH /api/users/:id` - Editar usuário (admin)
- `DELETE /api/users/:id` - Deletar usuário (admin)

#### Teams

- `GET /api/teams` - Listar times
- `POST /api/teams` - Criar time (admin/manager)
- `GET /api/teams/:id` - Detalhes do time
- `PATCH /api/teams/:id` - Editar time
- `DELETE /api/teams/:id` - Deletar time (admin)
- `POST /api/teams/:id/members` - Adicionar membro
- `DELETE /api/teams/:id/members/:userId` - Remover membro

## 🐛 Troubleshooting

### Erro de conexão com PostgreSQL

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar porta
sudo ss -tulpn | grep 5432

# Testar conexão
psql -h localhost -U user -d forge_db
```

### Prisma Client desatualizado

```bash
# Regenerar Prisma Client
npm run prisma:generate
```

### Migration com erro

```bash
# Reset completo (CUIDADO: apaga dados!)
npx prisma migrate reset

# Ou criar nova migration
npm run prisma:migrate
```

## 📖 Documentação Adicional

- [Plano de Implementação](./IMPLEMENTATION_PLAN.md) - Roadmap completo
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Forge Frontend](../frontend/README.md)

## 🤝 Contribuindo

1. Siga os padrões de código (ESLint + Prettier)
2. Escreva testes para novas features
3. Mantenha cobertura > 70%
4. Use commits semânticos

## 📝 Licença

MIT © Driva Tecnologia
