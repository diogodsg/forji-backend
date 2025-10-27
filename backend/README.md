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

### 🏢 Core Features

✅ **Multi-Workspace System** - Isolamento completo de dados por workspace  
✅ **Autenticação JWT** - Com contexto de workspace  
✅ **Gestão de Usuários** - CRUD completo com paginação  
✅ **Gestão de Times** - Times com membros e roles  
✅ **Hierarquia de Gestão** - Regras INDIVIDUAL e TEAM

### 🎮 Sistema de Gamificação (NEW!)

✅ **XP & Badges** - Sistema de pontuação e conquistas  
✅ **Streaks** - Acompanhamento de sequências de atividades  
✅ **Níveis** - Progressão por experiência acumulada  
✅ **3 Badges Implementados** - FIRST_STEPS, TEAM_PLAYER, CONSISTENT

### 📊 PDI (Plano de Desenvolvimento Individual)

✅ **Cycles** - Ciclos de desenvolvimento (trimestral, semestral, anual)  
✅ **Goals** - Metas com 4 tipos (INCREASE, DECREASE, PERCENTAGE, BINARY)  
✅ **Competencies** - Competências com níveis 1-5 e 3 categorias  
✅ **Activities** - Timeline com 3 tipos (1:1, Mentoria, Certificação)  
✅ **Integração Automática** - Goals/Competencies criam Activities automaticamente

### 🛡️ Security & Docs

✅ **Swagger/OpenAPI** - Documentação interativa completa (60 endpoints)  
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

- ✅ **60 endpoints documentados** (30 Core + 30 Gamification/PDI)
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
│   ├── teams/                 # 🏆 Gestão de Times
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
│   ├── gamification/          # 🎮 Sistema de Gamificação (NEW!)
│   │   ├── gamification.module.ts
│   │   ├── gamification.controller.ts # Profile, Badges, AddXP
│   │   ├── gamification.service.ts    # XP logic, badge verification
│   │   └── dto/               # AddXpDto, ProfileResponse, BadgeResponse
│   │
│   ├── cycles/                # 📆 Ciclos de Desenvolvimento (NEW!)
│   │   ├── cycles.module.ts
│   │   ├── cycles.controller.ts # CRUD + Current + Stats
│   │   ├── cycles.service.ts
│   │   └── dto/               # Create, Update, Response DTOs
│   │
│   ├── goals/                 # 🎯 Metas e Objetivos (NEW!)
│   │   ├── goals.module.ts
│   │   ├── goals.controller.ts # CRUD + UpdateProgress + History
│   │   ├── goals.service.ts        # 4 goal types, XP rewards
│   │   └── dto/               # Create, Update, Progress, Response DTOs
│   │
│   ├── competencies/          # 🧠 Competências (NEW!)
│   │   ├── competencies.module.ts
│   │   ├── competencies.controller.ts # CRUD + Library + Progress
│   │   ├── competencies.service.ts    # Level system, predefined library
│   │   └── dto/               # Create, Update, Progress, Response DTOs
│   │
│   ├── activities/            # 📝 Timeline de Atividades (NEW!)
│   │   ├── activities.module.ts
│   │   ├── activities.controller.ts # Create + Timeline + Stats
│   │   ├── activities.service.ts    # 3 activity types + auto-creation
│   │   └── dto/               # Create (OneOnOne/Mentoring/Cert), Response DTOs
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
- **Gamificação:** Sistema de XP, badges e streaks integrado
- **PDI:** 19 tabelas para Cycles, Goals, Competencies, Activities

### Modelos Principais

#### 📊 Core Models (6 tabelas)

**1. Workspace** - Multi-tenant isolado  
**2. User** - Usuários com gamificação (xp, level, streaks)  
**3. WorkspaceMember** - Membros com roles (OWNER, ADMIN, MEMBER)  
**4. Team** - Times do workspace  
**5. TeamMember** - Membros do time com role (LEAD, MEMBER)  
**6. ManagementRule** - Hierarquia INDIVIDUAL ou TEAM

#### 🎮 Gamification Models (3 tabelas)

**7. UserBadge** - Badges conquistados pelo usuário  
**8. XpHistory** - Histórico de ganho de XP  
**9. Badge** - Catálogo de badges disponíveis

#### 📈 PDI Models (10 tabelas)

**10. Cycle** - Ciclos de desenvolvimento (trimestral/semestral/anual)  
**11. Goal** - Metas com 4 tipos (INCREASE, DECREASE, PERCENTAGE, BINARY)  
**12. GoalUpdate** - Histórico de atualizações de metas  
**13. Competency** - Competências com níveis 1-5  
**14. CompetencyUpdate** - Histórico de evolução de competências  
**15. Activity** - Timeline de atividades (base polimórfica)  
**16. OneOnOneActivity** - Reuniões 1:1  
**17. MentoringActivity** - Sessões de mentoria  
**18. CertificationActivity** - Certificações/Cursos  
**19. (Auto-created)** - GOAL_UPDATE e COMPETENCY_UPDATE via Activities

### Exemplo: User com Gamificação

```prisma
model User {
  id       String   @id @default(uuid()) @db.Uuid
  email    String   @unique
  password String   // bcrypt hash
  name     String
  position String?
  bio      String?

  // 🎮 Gamificação
  xp               Int      @default(0)
  level            Int      @default(1)
  currentStreak    Int      @default(0) @map("current_streak")
  longestStreak    Int      @default(0) @map("longest_streak")
  lastActivityAt   DateTime? @map("last_activity_at")

  workspaceMemberships         WorkspaceMember[]
  teamMemberships              TeamMember[]
  managementRulesAsManager     ManagementRule[] @relation("ManagerRules")
  managementRulesAsSubordinate ManagementRule[] @relation("SubordinateRules")
  badges                       UserBadge[]
  xpHistory                    XpHistory[]
  cycles                       Cycle[]
  goals                        Goal[]
  competencies                 Competency[]
  activities                   Activity[]
}
```

### Exemplo: Goal com 4 Tipos

```prisma
model Goal {
  id           String     @id @default(uuid()) @db.Uuid
  cycleId      String     @map("cycle_id") @db.Uuid
  userId       String     @map("user_id") @db.Uuid
  type         GoalType   // INCREASE, DECREASE, PERCENTAGE, BINARY
  title        String
  unit         String?    // "PRs", "pontos", "%", etc
  startValue   Float?     @map("start_value")
  currentValue Float?     @map("current_value")
  targetValue  Float?     @map("target_value")
  status       GoalStatus @default(ACTIVE)

  cycle   Cycle        @relation(fields: [cycleId], references: [id])
  user    User         @relation(fields: [userId], references: [id])
  updates GoalUpdate[]
}

enum GoalType { INCREASE, DECREASE, PERCENTAGE, BINARY }
```

### Exemplo: Activity (Polimórfico)

```prisma
model Activity {
  id          String       @id @default(uuid()) @db.Uuid
  cycleId     String       @map("cycle_id") @db.Uuid
  userId      String       @map("user_id") @db.Uuid
  type        ActivityType
  title       String
  xpEarned    Int          @default(0) @map("xp_earned")

  // Relacionamentos polimórficos (apenas um será preenchido)
  oneOnOne      OneOnOneActivity?
  mentoring     MentoringActivity?
  certification CertificationActivity?
}

enum ActivityType {
  ONE_ON_ONE          // 50 XP
  MENTORING           // 35 XP
  CERTIFICATION       // 100 XP
  GOAL_UPDATE         // XP do goal (auto-created)
  COMPETENCY_UPDATE   // XP da competência (auto-created)
}
```

### Enums Completos

```prisma
// Core
enum WorkspaceStatus { ACTIVE, SUSPENDED, ARCHIVED }
enum WorkspaceRole   { OWNER, ADMIN, MEMBER }
enum TeamStatus      { ACTIVE, INACTIVE }
enum TeamRole        { MANAGER, MEMBER }
enum ManagementRuleType { INDIVIDUAL, TEAM }

// Gamification
enum BadgeType { FIRST_STEPS, TEAM_PLAYER, CONSISTENT, MENTOR, CERTIFIED, FAST_LEARNER }

// PDI
enum CycleType { TRIMESTRAL, SEMESTRAL, ANUAL }
enum GoalType { INCREASE, DECREASE, PERCENTAGE, BINARY }
enum GoalStatus { ACTIVE, COMPLETED, BLOCKED, CANCELLED }
enum CompetencyCategory { TECHNICAL, LEADERSHIP, BEHAVIORAL }
enum ActivityType { ONE_ON_ONE, MENTORING, CERTIFICATION, GOAL_UPDATE, COMPETENCY_UPDATE }
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

## 🌐 API Endpoints (60 total)

### 🔐 Authentication (4 endpoints)

```
POST   /api/auth/register          # Criar conta + workspace
POST   /api/auth/login             # Login (retorna JWT)
GET    /api/auth/me                # Perfil do usuário logado
POST   /api/auth/switch-workspace  # Trocar workspace ativo
```

### 🏢 Workspaces (6 endpoints)

```
GET    /api/workspaces             # Listar workspaces do usuário
GET    /api/workspaces/:id         # Detalhes do workspace
POST   /api/workspaces             # Criar workspace
PUT    /api/workspaces/:id         # Atualizar workspace
DELETE /api/workspaces/:id         # Deletar workspace
POST   /api/workspaces/:id/invite  # Convidar usuário
```

### 👥 Users (7 endpoints)

```
GET    /api/users                  # Listar usuários (paginado)
GET    /api/users/search           # Buscar por nome/email
GET    /api/users/:id              # Ver perfil
POST   /api/users                  # Criar usuário (admin)
PATCH  /api/users/:id              # Atualizar perfil
PATCH  /api/users/:id/password     # Trocar senha
DELETE /api/users/:id              # Soft delete
```

### 🏆 Teams (10 endpoints)

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

### 📊 Management (6 endpoints)

```
GET    /api/management/subordinates       # Listar subordinados
GET    /api/management/teams              # Listar times gerenciados
GET    /api/management/rules              # Listar regras (admin)
POST   /api/management/rules              # Criar regra hierárquica
DELETE /api/management/rules/:id          # Deletar regra
GET    /api/management/check/:userId      # Verificar se é gerente
```

### 🎮 Gamification (3 endpoints)

```
GET    /api/gamification/profile          # Perfil gamificado (XP, level, badges)
GET    /api/gamification/badges           # Lista de badges do usuário
POST   /api/gamification/add-xp           # Adicionar XP manualmente (admin)
```

### 📆 Cycles (7 endpoints)

```
POST   /api/cycles                        # Criar ciclo de desenvolvimento
GET    /api/cycles/current                # Obter ciclo ativo atual
GET    /api/cycles                        # Listar ciclos (com filtros)
GET    /api/cycles/:id                    # Detalhes do ciclo
GET    /api/cycles/:id/stats              # Estatísticas do ciclo
PATCH  /api/cycles/:id                    # Atualizar ciclo
DELETE /api/cycles/:id                    # Soft delete
```

### 🎯 Goals (7 endpoints)

```
POST   /api/goals                         # Criar meta
GET    /api/goals                         # Listar metas (filtros: cycleId, status)
GET    /api/goals/:id                     # Detalhes da meta
GET    /api/goals/:id/history             # Histórico de atualizações
PATCH  /api/goals/:id                     # Atualizar meta
PATCH  /api/goals/:id/progress            # Atualizar progresso + XP 🔥
DELETE /api/goals/:id                     # Soft delete
```

### 🧠 Competencies (8 endpoints)

```
GET    /api/competencies/library          # Biblioteca de competências predefinidas
POST   /api/competencies                  # Criar competência
GET    /api/competencies                  # Listar competências (filtros: cycleId, category)
GET    /api/competencies/:id              # Detalhes da competência
GET    /api/competencies/:id/history      # Histórico de evolução
PATCH  /api/competencies/:id              # Atualizar competência
PATCH  /api/competencies/:id/progress     # Atualizar progresso + XP 🔥
DELETE /api/competencies/:id              # Soft delete
```

### 📝 Activities (5 endpoints)

```
POST   /api/activities                    # Criar atividade (1:1/Mentoria/Cert) + XP
GET    /api/activities/timeline           # Timeline paginada (filtros: cycleId, type)
GET    /api/activities/stats              # Estatísticas (total, XP, por tipo)
GET    /api/activities/:id                # Detalhes da atividade
DELETE /api/activities/:id                # Soft delete
```

GET /api/management/check/:userId # Verificar se gerencia

````

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
````

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "xp": 10,
    "level": 1,
    "currentStreak": 0
  },
  "workspace": {
    "id": "uuid",
    "name": "My Company",
    "slug": "my-company"
  },
  "access_token": "eyJhbGc..."
}
```

### 2. Criar Meta com Auto-Activity 🔥

```bash
# 1. Criar meta
curl -X POST http://localhost:8000/api/goals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cycleId": "cycle-uuid",
    "userId": "user-uuid",
    "type": "INCREASE",
    "title": "Code Reviews Semanais",
    "unit": "PRs",
    "startValue": 0,
    "targetValue": 20
  }'

# 2. Atualizar progresso (cria Activity automaticamente!)
curl -X PATCH http://localhost:8000/api/goals/:id/progress \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newValue": 5,
    "notes": "Fiz 5 PRs essa semana!"
  }'
```

**O que acontece:**

1. ✅ Goal atualizado (currentValue = 5)
2. ✅ XP adicionado (+25 XP)
3. ✅ **Activity criada automaticamente na timeline!**
4. ✅ GoalUpdate criado no histórico

### 3. Ver Timeline Integrada

```bash
curl -X GET http://localhost:8000/api/activities/timeline \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

```json
{
  "activities": [
    {
      "id": "uuid",
      "type": "GOAL_UPDATE",
      "title": "Atualização de Meta: Code Reviews Semanais",
      "description": "Progresso: 0 → 5 | +25 XP | Fiz 5 PRs essa semana!",
      "xpEarned": 25,
      "createdAt": "2025-10-19T10:00:00Z"
    },
    {
      "id": "uuid",
      "type": "ONE_ON_ONE",
      "title": "1:1 com Maria Santos",
      "xpEarned": 50,
      "createdAt": "2025-10-18T15:00:00Z",
      "oneOnOne": {
        "participantName": "Maria Santos",
        "workingOn": ["Feature X", "Bug Y"],
        "positivePoints": ["Ótima comunicação"],
        "nextSteps": ["Estudar GraphQL"]
      }
    }
  ],
  "page": 1,
  "total": 2,
  "hasMore": false
}
```

### 4. Ver Perfil Gamificado

```bash
curl -X GET http://localhost:8000/api/gamification/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**

```json
{
  "userId": "uuid",
  "name": "John Doe",
  "xp": 285,
  "level": 3,
  "xpToNextLevel": 15,
  "currentStreak": 5,
  "longestStreak": 7,
  "badges": [
    {
      "type": "FIRST_STEPS",
      "name": "Primeiros Passos",
      "description": "Ganhou seus primeiros 10 XP",
      "earnedAt": "2025-10-15T10:00:00Z"
    },
    {
      "type": "CONSISTENT",
      "name": "Consistente",
      "description": "Manteve streak de 3 dias",
      "earnedAt": "2025-10-18T14:30:00Z"
    }
  ]
}
```

    "password": "SecurePass123"

}'

````

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
````

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

A documentação completa da API está disponível via Swagger em:

```
http://localhost:8000/api/docs
```

### Todos os Endpoints Implementados

#### 🔐 Auth (3 endpoints)

- `POST /api/auth/register` - Criar nova conta
- `POST /api/auth/login` - Login com email/senha
- `GET /api/auth/me` - Dados do usuário logado

#### 🏢 Workspaces (9 endpoints)

- `POST /api/workspaces` - Criar workspace (auto-register como OWNER)
- `GET /api/workspaces` - Listar workspaces do usuário
- `GET /api/workspaces/:id` - Detalhes do workspace
- `PATCH /api/workspaces/:id` - Editar workspace (owner/admin)
- `DELETE /api/workspaces/:id` - Deletar workspace (owner only)
- `POST /api/workspaces/:id/members` - Adicionar membro (owner/admin)
- `PATCH /api/workspaces/:id/members/:userId/role` - Mudar role (owner/admin)
- `DELETE /api/workspaces/:id/members/:userId` - Remover membro (owner/admin)
- `DELETE /api/workspaces/:id/leave` - Sair do workspace

#### 👥 Users (5 endpoints)

- `GET /api/users` - Listar usuários do workspace
- `GET /api/users/:id` - Ver perfil do usuário
- `PATCH /api/users/me` - Editar próprio perfil
- `PATCH /api/users/:id` - Editar usuário (admin)
- `DELETE /api/users/:id` - Deletar usuário (admin)

#### 🏆 Teams (7 endpoints)

- `GET /api/teams` - Listar times do workspace
- `POST /api/teams` - Criar time (admin/manager)
- `GET /api/teams/:id` - Detalhes do time
- `PATCH /api/teams/:id` - Editar time
- `DELETE /api/teams/:id` - Deletar time (admin)
- `POST /api/teams/:id/members` - Adicionar membro
- `DELETE /api/teams/:id/members/:userId` - Remover membro

#### 📊 Management (6 endpoints)

- `POST /api/management/rules` - Criar regra de gestão (INDIVIDUAL ou TEAM)
- `GET /api/management/rules` - Listar regras do workspace
- `GET /api/management/rules/:id` - Detalhes da regra
- `DELETE /api/management/rules/:id` - Deletar regra
- `GET /api/management/subordinates` - Listar subordinados do gerente
- `GET /api/management/manager/:userId` - Ver gerente de um usuário

#### 🎮 Gamification (4 endpoints)

- `GET /api/gamification/profile` - Ver perfil de gamificação (XP, level, badges, streak)
- `POST /api/gamification/xp` - Adicionar XP (sistema interno)
- `POST /api/gamification/badges/verify` - Verificar e conceder badges
- `GET /api/gamification/leaderboard` - Ranking do workspace

#### 📆 Cycles (5 endpoints)

- `POST /api/cycles` - Criar ciclo de PDI
- `GET /api/cycles` - Listar ciclos do workspace
- `GET /api/cycles/:id` - Detalhes do ciclo
- `PATCH /api/cycles/:id` - Editar ciclo
- `DELETE /api/cycles/:id` - Deletar ciclo

#### 🎯 Goals (6 endpoints)

- `POST /api/goals` - Criar goal no ciclo
- `GET /api/goals` - Listar goals do ciclo
- `GET /api/goals/:id` - Detalhes do goal
- `PATCH /api/goals/:id` - Editar goal
- `DELETE /api/goals/:id` - Deletar goal
- `PATCH /api/goals/:id/progress` - **Atualizar progresso (cria Activity automaticamente!)**

#### 🧠 Competencies (10 endpoints)

- `POST /api/competencies` - Criar competência no ciclo
- `GET /api/competencies` - Listar competências do ciclo
- `GET /api/competencies/:id` - Detalhes da competência
- `PATCH /api/competencies/:id` - Editar competência
- `DELETE /api/competencies/:id` - Deletar competência
- `PATCH /api/competencies/:id/progress` - **Atualizar progresso (cria Activity automaticamente!)**
- `POST /api/competencies/:id/action-plans` - Adicionar ação ao plano
- `PATCH /api/competencies/:id/action-plans/:actionId` - Editar ação
- `DELETE /api/competencies/:id/action-plans/:actionId` - Deletar ação
- `PATCH /api/competencies/:id/action-plans/:actionId/complete` - Marcar ação como completa

#### 📝 Activities (5 endpoints)

- `POST /api/activities` - Criar atividade manual (OneOnOne, Mentoring, Certification)
- `GET /api/activities/timeline` - **Timeline com todas as atividades (manual + automáticas)**
- `GET /api/activities/stats` - Estatísticas de atividades por tipo
- `GET /api/activities/:id` - Detalhes da atividade
- `DELETE /api/activities/:id` - Deletar atividade

**Total: 60 endpoints REST implementados**

## 🎯 Integração Automática (Diferencial!)

### Como Funciona

Quando você atualiza o progresso de **Goals** ou **Competencies**, o sistema automaticamente:

1. ✅ Adiciona XP ao perfil de gamificação do usuário
2. ✅ **Cria uma entrada na timeline de Activities** (sem ação manual!)
3. ✅ Verifica e concede badges se aplicável
4. ✅ Atualiza streak de atividades

### Fluxo Automático

```
Atualizar Goal → Goals.updateProgress()
                  ↓
                  ├─ Adiciona XP (GamificationService)
                  ├─ Cria GOAL_UPDATE Activity (ActivitiesService) ← AUTOMÁTICO!
                  └─ Retorna resposta com XP ganho
```

### Benefícios

- **Zero fricção**: Usuário não precisa criar Activities manualmente
- **Timeline rica**: Todas as ações aparecem automaticamente na timeline
- **Rastreabilidade**: Histórico completo de mudanças
- **Gamificação integrada**: Cada atualização = feedback visual instantâneo

📚 Leia mais: [INTEGRATION_AUTOMATIC_ACTIVITIES.md](./INTEGRATION_AUTOMATIC_ACTIVITIES.md)

## 🧪 Testing

### Executar Testes

```bash
# Todos os testes
npm test

# Watch mode (desenvolvimento)
npm run test:watch

# Cobertura
npm run test:cov

# E2E tests
npm run test:e2e
```

### Estrutura de Testes

```
src/
├── auth/
│   ├── auth.service.spec.ts        # Unit tests
│   └── auth.controller.spec.ts     # Controller tests
├── goals/
│   ├── goals.service.spec.ts
│   └── goals.e2e.spec.ts           # E2E com integração automática
└── test/
    └── app.e2e-spec.ts              # E2E completos
```

### Coverage Goal

- **Target**: > 70% de cobertura
- **Current**: Em desenvolvimento (Fase 7)

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

MIT © Forji Tecnologia
