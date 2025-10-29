# 📋 Plano de Implementação Backend - Forji

**Versão:** 1.0.0  
**Data:** 17 de outubro de 2025  
**Stack:** NestJS + Prisma + PostgreSQL

---

## ✅ Status da Implementação

### Fase 1: Fundação - COMPLETA ✅

**Data de Conclusão:** 17 de outubro de 2025

#### O que foi implementado:

1. **Estrutura NestJS**
   - ✅ Projeto inicializado com NestJS CLI
   - ✅ Configuração TypeScript (strict mode)
   - ✅ ESLint + Prettier configurados
   - ✅ Jest configurado para testes
   - ✅ Scripts npm completos

2. **Schema Prisma (UUID + snake_case)**
   - ✅ Modelo `User` com UUID
   - ✅ Modelo `Team` com UUID
   - ✅ Modelo `TeamMember` (relação many-to-many)
   - ✅ Modelo `ManagementRule` (hierarquia)
   - ✅ Enums: `TeamStatus`, `TeamRole`, `ManagementRuleType`
   - ✅ Soft delete com `deleted_at`

3. **Migrations**
   - ✅ Migration inicial criada: `init_users_teams_management`
   - ✅ Banco de dados criado e sincronizado

4. **Seed Data**
   - ✅ 5 usuários mock (diego@forji.com como admin)
   - ✅ 4 times (Frontend, Backend, Design, DevOps)
   - ✅ Memberships configuradas
   - ✅ Management rules criadas (hierarquia)
   - ✅ Senhas: `senha123` (bcrypt hash)

5. **Infraestrutura**
   - ✅ PrismaService criado e configurado
   - ✅ PrismaModule global
   - ✅ AppModule base
   - ✅ Main.ts com CORS e validation pipes
   - ✅ Global prefix: `/api`

6. **Servidor**
   - ✅ Servidor rodando em `http://localhost:8000`
   - ✅ Prisma Client gerado
   - ✅ Conexão com PostgreSQL funcionando

#### Credenciais de Teste:

```
Email: diego@forji.com | Password: senha123 (Admin)
Email: ana@forji.com | Password: senha123
Email: carlos@forji.com | Password: senha123
Email: maria@forji.com | Password: senha123 (Manager)
Email: joao@forji.com | Password: senha123
```

#### Comandos Úteis:

```bash
# Desenvolvimento
npm run start:dev           # Servidor em modo watch

# Prisma
npm run prisma:studio       # UI visual do banco
npm run prisma:generate     # Gerar Prisma Client
npm run prisma:migrate      # Criar nova migration
npm run prisma:seed         # Popular banco com dados

# Testes
npm run test                # Testes unitários
npm run test:e2e            # Testes end-to-end
npm run test:cov            # Cobertura de testes
```

---

### Próximas Fases

#### Fase 2: Autenticação - COMPLETA ✅

**Data de Conclusão:** 17 de outubro de 2025

#### O que foi implementado:

1. **Estrutura do Módulo Auth**
   - ✅ AuthModule com JwtModule e PassportModule
   - ✅ AuthController com 3 endpoints
   - ✅ AuthService com lógica de negócio completa
   - ✅ Estrutura de pastas: strategies/, guards/, decorators/, dto/

2. **DTOs (camelCase)**
   - ✅ RegisterDto com validações
   - ✅ LoginDto com validações
   - ✅ AuthResponseDto com tipos bem definidos

3. **Entities e Transformação**
   - ✅ UserEntity para conversão snake_case → camelCase
   - ✅ Método `fromPrisma()` para transformação automática
   - ✅ Método `toSafeUser()` para remover campos sensíveis

4. **Strategies (Passport)**
   - ✅ LocalStrategy para login com email/senha
   - ✅ JwtStrategy para validação de tokens
   - ✅ JwtPayload interface (camelCase)

5. **Guards**
   - ✅ JwtAuthGuard para rotas protegidas
   - ✅ LocalAuthGuard para login
   - ✅ RolesGuard para controle de acesso (admin/manager)

6. **Decorators**
   - ✅ @CurrentUser() - extrai usuário do request
   - ✅ @Roles() - define roles necessárias

7. **Endpoints Funcionando**
   - ✅ POST /api/auth/register - Criar conta
   - ✅ POST /api/auth/login - Login
   - ✅ GET /api/auth/me - Perfil (protegido)

8. **Convenção camelCase/snake_case**
   - ✅ Banco de dados: snake_case
   - ✅ DTOs e responses: camelCase
   - ✅ Documentação: NAMING_CONVENTION.md

#### Testes Realizados:

```bash
# ✅ Registro de novo usuário
POST /api/auth/register
Response: { user: {...}, accessToken: "..." } (camelCase ✅)

# ✅ Login com credenciais
POST /api/auth/login
Response: { user: {...}, accessToken: "..." } (camelCase ✅)

# ✅ Rota protegida com JWT
GET /api/auth/me + Bearer Token
Response: { user: {...} } (camelCase ✅)

# ✅ Rota protegida sem token
GET /api/auth/me
Response: 401 Unauthorized ✅
```

#### Arquivos Criados:

```
backend/src/auth/
├── auth.module.ts ✅
├── auth.controller.ts ✅
├── auth.service.ts ✅
├── dto/
│   ├── register.dto.ts ✅
│   ├── login.dto.ts ✅
│   ├── auth-response.dto.ts ✅
│   └── index.ts ✅
├── entities/
│   └── user.entity.ts ✅
├── strategies/
│   ├── local.strategy.ts ✅
│   ├── jwt.strategy.ts ✅
│   └── index.ts ✅
├── guards/
│   ├── jwt-auth.guard.ts ✅
│   ├── local-auth.guard.ts ✅
│   ├── roles.guard.ts ✅
│   └── index.ts ✅
└── decorators/
    ├── current-user.decorator.ts ✅
    ├── roles.decorator.ts ✅
    └── index.ts ✅
```

---

#### Fase 3: Usuários (Próxima) 🔜

- [ ] Users module structure
- [ ] CRUD básico (Create, Read, Update)
- [ ] Endpoints públicos vs admin
- [ ] Password management
- [ ] Search functionality
- [ ] Testes de integração

#### Fase 4: Times

- [ ] Teams module structure
- [ ] CRUD de times
- [ ] Membership management
- [ ] Role promotions/demotions
- [ ] Queries otimizadas
- [ ] Integração com ManagementRule

#### Fase 5: Refinamentos

- [ ] Error handling global
- [ ] Logging interceptor
- [ ] Response transformation
- [ ] Rate limiting (@nestjs/throttler)
- [ ] Security headers
- [ ] Documentação Swagger

---

## 🎯 Objetivo

Implementar o backend do Forji focando em:

1. **Autenticação JWT** (register, login, validação)
2. **Gestão de Usuários** (CRUD + admin)
3. **Gestão de Times** (CRUD + memberships)
4. **Hierarquia** (integração com ManagementRule existente)

### 🔑 Decisões Arquiteturais

- **IDs**: UUID (não BigInt/Serial)
- **Naming**: snake_case para tabelas e colunas
- **Soft Delete**: `deleted_at` nullable para soft deletes
- **Timestamps**: `created_at` e `updated_at` em todas as entidades

---

## 📊 Schema Prisma (UUID + snake_case)

### 1. Modelo de Dados Completo

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// CORE: Users & Authentication
// ============================================

model User {
  id            String      @id @default(uuid()) @db.Uuid
  email         String      @unique
  password      String      // Hash bcrypt
  name          String
  position      String?
  bio           String?
  is_admin      Boolean     @default(false)
  is_manager    Boolean     @default(false)

  // Timestamps
  created_at    DateTime    @default(now())
  updated_at    DateTime    @updatedAt
  deleted_at    DateTime?   // Soft delete

  // Relations
  team_memberships              TeamMember[]

  // Hierarchy (Management Rules)
  management_rules_as_manager      ManagementRule[] @relation("ManagerRules")
  management_rules_as_subordinate  ManagementRule[] @relation("SubordinateRules")

  // Future: PDI, Gamification, etc
  // pdi_plan                      PdiPlan?
  // gamification_profile          GamificationProfile?

  @@map("users")
}

// ============================================
// TEAMS: Organization Structure
// ============================================

model Team {
  id              String      @id @default(uuid()) @db.Uuid
  name            String      @unique
  description     String?
  status          TeamStatus  @default(ACTIVE)

  // Timestamps
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
  deleted_at      DateTime?   // Soft delete

  // Relations
  members           TeamMember[]
  management_rules  ManagementRule[]

  @@map("teams")
}

model TeamMember {
  id          String      @id @default(uuid()) @db.Uuid
  user_id     String      @db.Uuid
  team_id     String      @db.Uuid
  role        TeamRole    @default(MEMBER)

  // Timestamps
  joined_at   DateTime    @default(now())
  deleted_at  DateTime?   // Soft delete

  // Relations
  user        User        @relation(fields: [user_id], references: [id], onDelete: Cascade)
  team        Team        @relation(fields: [team_id], references: [id], onDelete: Cascade)

  // Constraints
  @@unique([user_id, team_id], name: "unique_user_team")
  @@index([team_id])
  @@index([user_id])
  @@index([role])
  @@map("team_members")
}

enum TeamStatus {
  ACTIVE
  ARCHIVED
}

enum TeamRole {
  MANAGER    // Team lead
  MEMBER     // Regular member
}

// ============================================
// MANAGEMENT: Hierarchy System
// ============================================

model ManagementRule {
  id                String              @id @default(uuid()) @db.Uuid
  rule_type         ManagementRuleType
  manager_id        String              @db.Uuid
  team_id           String?             @db.Uuid
  subordinate_id    String?             @db.Uuid

  // Timestamps
  created_at        DateTime            @default(now())
  updated_at        DateTime            @updatedAt
  deleted_at        DateTime?           // Soft delete

  // Relations
  manager           User                @relation("ManagerRules", fields: [manager_id], references: [id], onDelete: Cascade)
  subordinate       User?               @relation("SubordinateRules", fields: [subordinate_id], references: [id], onDelete: Cascade)
  team              Team?               @relation(fields: [team_id], references: [id], onDelete: Cascade)

  // Constraints
  @@unique([manager_id, subordinate_id, rule_type], name: "unique_manager_subordinate_rule")
  @@unique([manager_id, team_id, rule_type], name: "unique_manager_team_rule")
  @@index([manager_id])
  @@index([subordinate_id])
  @@index([team_id])
  @@index([rule_type])
  @@map("management_rules")
}

enum ManagementRuleType {
  INDIVIDUAL  // Manager de pessoa específica
  TEAM        // Manager de time inteiro
}
```

---

## 🏗️ Estrutura de Módulos NestJS

### 2. Arquitetura de Diretórios

```
backend/src/
├── main.ts                           # Bootstrap da aplicação
├── app.module.ts                     # Root module
│
├── prisma/                           # Prisma Client Global
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
├── common/                           # Shared utilities
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── owner.guard.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   └── pipes/
│       └── validation.pipe.ts
│
├── auth/                             # Authentication Module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   └── dto/
│       ├── login.dto.ts
│       ├── register.dto.ts
│       └── auth-response.dto.ts
│
├── users/                            # Users Module
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│       ├── create-user.dto.ts
│       ├── update-user.dto.ts
│       ├── user-response.dto.ts
│       └── update-password.dto.ts
│
├── teams/                            # Teams Module
│   ├── teams.module.ts
│   ├── teams.controller.ts
│   ├── teams.service.ts
│   └── dto/
│       ├── create-team.dto.ts
│       ├── update-team.dto.ts
│       ├── team-response.dto.ts
│       ├── add-member.dto.ts
│       └── update-member-role.dto.ts
│
└── management/                       # Management Hierarchy Module
    ├── management.module.ts
    ├── management.controller.ts
    ├── management.service.ts
    └── dto/
        ├── create-rule.dto.ts
        ├── management-rule-response.dto.ts
        └── subordinates-response.dto.ts
```

---

## 🔐 Sistema de Autenticação

### 3. JWT Authentication Flow

#### 3.1 Endpoints

```typescript
POST /auth/register
Body: { name: string, email: string, password: string }
Response: { user: UserResponseDto, access_token: string }

POST /auth/login
Body: { email: string, password: string }
Response: { user: UserResponseDto, access_token: string }

GET /auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { user: UserResponseDto }

POST /auth/logout
Headers: { Authorization: "Bearer <token>" }
Response: { message: "Logged out successfully" }
```

#### 3.2 JWT Payload Structure

```typescript
interface JwtPayload {
  sub: string; // userId (UUID)
  email: string;
  is_admin: boolean;
  is_manager: boolean;
  iat: number;
  exp: number;
}
```

#### 3.3 Password Security

- **Hashing**: bcrypt com salt rounds = 10
- **Validation**: Min 6 caracteres
- **Storage**: NUNCA retornar password em responses

#### 3.4 Guards Hierarchy

```typescript
// 1. JwtAuthGuard (base)
@UseGuards(JwtAuthGuard)
// Valida token JWT e injeta user no request

// 2. RolesGuard (sobre JWT)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
// Verifica papéis específicos

// 3. OwnerGuard (sobre JWT)
@UseGuards(JwtAuthGuard, OwnerGuard)
// Valida se user é dono do recurso
```

---

## 👥 Módulo de Usuários

### 4. User Management Endpoints

#### 4.1 Public Endpoints

```typescript
// Apenas registro - login está em /auth
POST / auth / register;
```

#### 4.2 Authenticated Endpoints

```typescript
GET /users
Query: { page?: number, limit?: number, search?: string, role?: string }
Response: { data: UserResponseDto[], total: number, page: number, limit: number }

GET /users/search
Query: { q: string }
Response: UserResponseDto[]

GET /users/:id
Response: UserResponseDto

PATCH /users/me
Body: UpdateUserDto (name, position, bio)
Response: UserResponseDto

PATCH /users/me/password
Body: { current_password: string, new_password: string }
Response: { message: "Password updated" }
```

#### 4.3 Admin Endpoints

```typescript
POST /users
Body: CreateUserDto
Response: UserResponseDto

PATCH /users/:id
Body: UpdateUserDto
Response: UserResponseDto

DELETE /users/:id
Response: { message: "User deleted" }

PATCH /users/:id/password
Body: { new_password: string }
Response: { message: "Password updated" }

PATCH /users/:id/toggle-admin
Response: UserResponseDto

PATCH /users/:id/toggle-manager
Response: UserResponseDto
```

#### 4.4 Business Rules

- Email único e validado
- Nome obrigatório (min 2 caracteres)
- Senha min 6 caracteres
- Admin pode alterar qualquer dado
- Usuários comuns apenas próprios dados
- Soft delete com `deleted_at`
- Excluir `deleted_at IS NULL` de queries padrão

---

## 🏢 Módulo de Times

### 5. Team Management Endpoints

#### 5.1 Authenticated Endpoints

```typescript
GET /teams
Query: { status?: 'ACTIVE' | 'ARCHIVED', include?: 'members' | 'memberCount' }
Response: TeamResponseDto[]

GET /teams/:id
Query: { include?: 'members' }
Response: TeamResponseDto

GET /teams/:id/members
Response: TeamMemberResponseDto[]

GET /teams/search
Query: { q: string }
Response: TeamResponseDto[]
```

#### 5.2 Manager/Admin Endpoints

```typescript
POST /teams
Body: CreateTeamDto
Response: TeamResponseDto
// Apenas admin ou manager pode criar

PATCH /teams/:id
Body: UpdateTeamDto
Response: TeamResponseDto
// Admin ou líder do time

DELETE /teams/:id
Response: { message: "Team deleted" }
// Apenas admin (soft delete)

POST /teams/:id/members
Body: AddMemberDto { user_id: string, role: TeamRole }
Response: TeamMemberResponseDto
// Admin ou líder do time

PATCH /teams/:id/members/:user_id
Body: { role: TeamRole }
Response: TeamMemberResponseDto
// Admin ou líder do time (promover/rebaixar)

DELETE /teams/:id/members/:user_id
Response: { message: "Member removed" }
// Admin ou líder do time
```

#### 5.3 Business Rules

- Nome do time único
- Status: ACTIVE (padrão) | ARCHIVED
- Team pode ter múltiplos MANAGERs
- Líderes podem adicionar/remover membros
- Líderes NÃO podem deletar time (apenas admin)
- Ao deletar team: soft delete + cascade em members
- Validar que user existe antes de adicionar
- Validar que user não está duplicado no time

---

## 🔗 Módulo de Hierarquia (Management)

### 6. Management Rules Endpoints

#### 6.1 Authenticated Endpoints

```typescript
GET /management/my-subordinates
Response: UserResponseDto[]
// Retorna subordinados do usuário logado

GET /management/my-teams
Response: TeamResponseDto[]
// Retorna times que o usuário logado gerencia

GET /management/rules
Query: { manager_id?: string, team_id?: string, type?: ManagementRuleType }
Response: ManagementRuleResponseDto[]
// Lista regras (admin vê todas, managers veem as próprias)
```

#### 6.2 Manager/Admin Endpoints

```typescript
POST /management/rules
Body: CreateRuleDto {
  rule_type: ManagementRuleType,
  manager_id: string,
  team_id?: string,
  subordinate_id?: string
}
Response: ManagementRuleResponseDto
// Criar regra de hierarquia

DELETE /management/rules/:id
Response: { message: "Rule deleted" }
// Remover regra de hierarquia
```

#### 6.3 Business Rules

- `INDIVIDUAL`: Requer `subordinate_id`, não `team_id`
- `TEAM`: Requer `team_id`, não `subordinate_id`
- Manager não pode ser subordinado de si mesmo
- Unique constraints: (manager, subordinate, type) e (manager, team, type)
- Soft delete com `deleted_at`

---

## 📝 DTOs e Validation

### 7. Data Transfer Objects

#### 7.1 Auth DTOs

```typescript
// login.dto.ts
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// register.dto.ts
export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  position?: string;
}

// auth-response.dto.ts
export class AuthResponseDto {
  user: UserResponseDto;
  access_token: string;
}
```

#### 7.2 User DTOs

```typescript
// user-response.dto.ts
export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  position?: string;
  bio?: string;
  is_admin: boolean;
  is_manager: boolean;
  created_at: Date;
  updated_at: Date;
  // NUNCA incluir password ou deleted_at
}

// create-user.dto.ts (admin only)
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsBoolean()
  is_admin?: boolean;

  @IsOptional()
  @IsBoolean()
  is_manager?: boolean;
}

// update-user.dto.ts
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}

// update-password.dto.ts
export class UpdatePasswordDto {
  @IsString()
  current_password: string;

  @IsString()
  @MinLength(6)
  new_password: string;
}
```

#### 7.3 Team DTOs

```typescript
// create-team.dto.ts
export class CreateTeamDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// update-team.dto.ts
export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TeamStatus)
  status?: TeamStatus;
}

// team-response.dto.ts
export class TeamResponseDto {
  id: string;
  name: string;
  description?: string;
  status: TeamStatus;
  member_count?: number;
  members?: TeamMemberResponseDto[];
  created_at: Date;
  updated_at: Date;
}

// team-member-response.dto.ts
export class TeamMemberResponseDto {
  id: string;
  user_id: string;
  team_id: string;
  role: TeamRole;
  joined_at: Date;
  user?: UserResponseDto; // Optional populated user
}

// add-member.dto.ts
export class AddMemberDto {
  @IsUUID()
  user_id: string;

  @IsEnum(TeamRole)
  role: TeamRole;
}

// update-member-role.dto.ts
export class UpdateMemberRoleDto {
  @IsEnum(TeamRole)
  role: TeamRole;
}
```

#### 7.4 Management DTOs

```typescript
// create-rule.dto.ts
export class CreateRuleDto {
  @IsEnum(ManagementRuleType)
  rule_type: ManagementRuleType;

  @IsUUID()
  manager_id: string;

  @IsOptional()
  @IsUUID()
  team_id?: string;

  @IsOptional()
  @IsUUID()
  subordinate_id?: string;
}

// management-rule-response.dto.ts
export class ManagementRuleResponseDto {
  id: string;
  rule_type: ManagementRuleType;
  manager_id: string;
  team_id?: string;
  subordinate_id?: string;
  created_at: Date;
  updated_at: Date;
  manager?: UserResponseDto;
  team?: TeamResponseDto;
  subordinate?: UserResponseDto;
}
```

---

## 🔍 Queries e Performance

### 8. Otimizações Prisma

#### 8.1 Evitar N+1 Queries

```typescript
// ❌ MAU: N+1
const teams = await prisma.team.findMany();
for (const team of teams) {
  const members = await prisma.teamMember.findMany({
    where: { team_id: team.id },
  });
}

// ✅ BOM: Include
const teams = await prisma.team.findMany({
  include: {
    members: {
      include: {
        user: true,
      },
    },
  },
});
```

#### 8.2 Contagens Eficientes

```typescript
// Contar sem carregar
const teamWithCount = await prisma.team.findUnique({
  where: { id: teamId },
  include: {
    _count: {
      select: { members: true },
    },
  },
});
```

#### 8.3 Paginação

```typescript
async findAll(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.prisma.user.findMany({
      where: { deleted_at: null },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' }
    }),
    this.prisma.user.count({ where: { deleted_at: null } })
  ]);

  return { data, total, page, limit };
}
```

#### 8.4 Soft Delete Pattern

```typescript
// Helper: Excluir deletados
const activeOnly = { deleted_at: null };

// Queries
findMany({ where: activeOnly });

// Soft delete
update({ where: { id }, data: { deleted_at: new Date() } });

// Restore
update({ where: { id }, data: { deleted_at: null } });
```

---

## 🛡️ Segurança e Validação

### 9. Security Best Practices

#### 9.1 Password Security

```typescript
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Hash
async hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify
async comparePasswords(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}
```

#### 9.2 JWT Configuration

```typescript
// .env
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRATION=7d

// jwt.strategy.ts
constructor(private configService: ConfigService) {
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: configService.get('JWT_SECRET'),
  });
}
```

#### 9.3 Rate Limiting

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
  ],
})

// Auth endpoints (mais restritivo)
@Throttle(5, 60) // 5 requests per minute
@Post('login')
async login() {}
```

#### 9.4 CORS Configuration

```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

## 🧪 Estratégia de Testes

### 10. Testing Plan

#### 10.1 Unit Tests (Services)

```typescript
// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a user', async () => {
    const dto = { name: 'Test', email: 'test@test.com', password: 'pass123' };
    const result = await service.create(dto);
    expect(result.email).toBe(dto.email);
  });
});
```

#### 10.2 Integration Tests (Controllers)

```typescript
// auth.controller.spec.ts
describe('AuthController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'pass123' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
        expect(res.body.user).toHaveProperty('email', 'test@test.com');
      });
  });
});
```

#### 10.3 E2E Tests (Critical Flows)

```typescript
// onboarding.e2e-spec.ts
describe('User Onboarding Flow (E2E)', () => {
  it('should complete full onboarding', async () => {
    // 1. Register
    const registerRes = await request(app)
      .post('/auth/register')
      .send({ name: 'John', email: 'john@test.com', password: 'pass123' });

    const token = registerRes.body.access_token;

    // 2. Update profile
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ position: 'Developer', bio: 'Hello' })
      .expect(200);

    // 3. Get profile
    const profileRes = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileRes.body.position).toBe('Developer');
  });
});
```

#### 10.4 Coverage Goals

- **Unit Tests**: 70% cobertura mínima
- **Integration Tests**: Endpoints principais
- **E2E Tests**: Fluxos críticos (onboarding, hierarquia)

---

## 📦 Variáveis de Ambiente

### 11. Environment Configuration

#### 11.1 `.env` Development

```env
# Database
DATABASE_URL="postgresql://forji_user:forji_pass@localhost:5433/forji_db?schema=public"

# JWT
JWT_SECRET="85944eca-bcfa-4cb8-ac61-d152596ddd14"
JWT_EXPIRATION="7d"

# Server
PORT=8000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

#### 11.2 `.env.example`

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/forji_db?schema=public"

# JWT
JWT_SECRET="change-me-in-production"
JWT_EXPIRATION="7d"

# Server
PORT=8000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

---

## 🚀 Roadmap de Implementação

### 12. Ordem de Desenvolvimento

#### **Fase 1: Fundação (Semana 1)**

- [x] Setup inicial NestJS
- [x] Configuração Prisma
- [ ] Schema Prisma (Users, Teams, TeamMembers, ManagementRules)
- [ ] Migrations iniciais
- [ ] PrismaService + PrismaModule
- [ ] Seed data (5 usuários + 4 times mock)

**Entregável**: Database configurado, migrations rodando

---

#### **Fase 2: Autenticação (Semana 1-2)**

- [ ] Auth Module structure
- [ ] Local Strategy (login)
- [ ] JWT Strategy (token validation)
- [ ] Guards (JWT, Roles, Owner)
- [ ] Decorators (@CurrentUser, @Roles)
- [ ] DTOs (Login, Register, AuthResponse)
- [ ] Endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/me`
  - `POST /auth/logout`
- [ ] Unit tests (auth.service)
- [ ] Integration tests (auth.controller)

**Entregável**: Sistema de auth completo e testado

---

#### **Fase 3: Usuários (Semana 2)**

- [ ] Users Module structure
- [ ] UsersService (CRUD básico)
- [ ] DTOs (Create, Update, Response)
- [ ] Endpoints públicos:
  - `GET /users` (list + pagination)
  - `GET /users/search`
  - `GET /users/:id`
- [ ] Endpoints autenticados:
  - `PATCH /users/me`
  - `PATCH /users/me/password`
- [ ] Endpoints admin:
  - `POST /users`
  - `PATCH /users/:id`
  - `DELETE /users/:id`
  - `PATCH /users/:id/password`
  - `PATCH /users/:id/toggle-admin`
- [ ] Unit tests (users.service)
- [ ] Integration tests (users.controller)

**Entregável**: Gestão de usuários completa

---

#### **Fase 4: Times (Semana 2-3)**

- [ ] Teams Module structure
- [ ] TeamsService (CRUD + memberships)
- [ ] DTOs (CreateTeam, UpdateTeam, AddMember, etc)
- [ ] Endpoints autenticados:
  - `GET /teams`
  - `GET /teams/:id`
  - `GET /teams/:id/members`
  - `GET /teams/search`
- [ ] Endpoints manager/admin:
  - `POST /teams`
  - `PATCH /teams/:id`
  - `DELETE /teams/:id` (soft delete)
  - `POST /teams/:id/members`
  - `PATCH /teams/:id/members/:userId`
  - `DELETE /teams/:id/members/:userId`
- [ ] Query optimization (include, count)
- [ ] Unit tests (teams.service)
- [ ] Integration tests (teams.controller)

**Entregável**: Gestão de times completa

---

#### **Fase 5: Hierarquia (Semana 3)**

- [ ] Management Module structure
- [ ] ManagementService (rules CRUD)
- [ ] DTOs (CreateRule, RuleResponse)
- [ ] Endpoints autenticados:
  - `GET /management/my-subordinates`
  - `GET /management/my-teams`
  - `GET /management/rules`
- [ ] Endpoints manager/admin:
  - `POST /management/rules`
  - `DELETE /management/rules/:id`
- [ ] Validações de hierarquia
- [ ] Unit tests (management.service)
- [ ] Integration tests (management.controller)

**Entregável**: Sistema de hierarquia funcional

---

#### **Fase 6: Refinamentos (Semana 3-4)**

- [ ] Global exception filter
- [ ] Logging interceptor
- [ ] Response transformation interceptor
- [ ] Rate limiting por endpoint
- [ ] Security headers (helmet)
- [ ] API documentation (Swagger)
- [ ] E2E tests (fluxos completos)
- [ ] README.md atualizado
- [ ] Deploy preparation

**Entregável**: Backend production-ready

---

## 🔗 Compatibilidade com Frontend

### 13. Frontend Integration

#### 13.1 Mock Data → Seed Data

Frontend tem 5 usuários mock que devem ser replicados no seed:

```typescript
// prisma/seed.ts
const users = [
  {
    id: '00000000-0000-0000-0000-000000000001', // UUID fixo para desenvolvimento
    email: 'diego@forji.com',
    name: 'Diego Santos',
    position: 'CTO',
    is_admin: true,
    is_manager: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'maria@forji.com',
    name: 'Maria Silva',
    position: 'Engineering Manager',
    is_admin: false,
    is_manager: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'ana@forji.com',
    name: 'Ana Costa',
    position: 'Frontend Developer',
    is_admin: false,
    is_manager: false,
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'carlos@forji.com',
    name: 'Carlos Pereira',
    position: 'Backend Developer',
    is_admin: false,
    is_manager: false,
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    email: 'pedro@forji.com',
    name: 'Pedro Oliveira',
    position: 'DevOps Engineer',
    is_admin: false,
    is_manager: false,
  },
];
```

#### 13.2 Mock Teams → Seed Teams

```typescript
const teams = [
  { id: '00000000-0000-0000-0001-000000000001', name: 'Frontend', description: 'Frontend team' },
  { id: '00000000-0000-0000-0001-000000000002', name: 'Backend', description: 'Backend team' },
  { id: '00000000-0000-0000-0001-000000000003', name: 'DevOps', description: 'DevOps team' },
  { id: '00000000-0000-0000-0001-000000000004', name: 'QA', description: 'QA team' },
];
```

#### 13.3 API Response Format

Frontend espera (conforme `AUTH_REFACTORING.md`):

```typescript
// Frontend expectation
interface AuthResponse {
  user: AuthUser;
  token: string; // <-- Frontend usa "token"
}

// Backend deve retornar
{
  user: UserResponseDto,
  access_token: string // <-- Backend usa "access_token"
}
```

**⚠️ Decisão**: Frontend deve ser atualizado para usar `access_token` (padrão OAuth2) OU backend mapeia para `token`.

---

## ✅ Definition of Done

### 14. Checklist de Prontidão

#### Setup & Config

- [ ] Prisma schema com UUIDs e snake_case
- [ ] Migrations executando sem erros
- [ ] Seed data populando corretamente
- [ ] Variáveis de ambiente documentadas

#### Autenticação

- [ ] Register, Login, Me, Logout funcionando
- [ ] JWT gerado e validado corretamente
- [ ] Guards implementados e testados
- [ ] Passwords hasheados com bcrypt

#### Usuários

- [ ] CRUD completo (create, read, update, delete)
- [ ] Paginação funcionando
- [ ] Busca por nome/email
- [ ] Admin pode editar qualquer usuário
- [ ] Soft delete implementado

#### Times

- [ ] CRUD de times
- [ ] Adicionar/remover membros
- [ ] Promover/rebaixar papéis
- [ ] Queries otimizadas (sem N+1)
- [ ] Validações de permissão

#### Hierarquia

- [ ] Criar/remover regras
- [ ] Listar subordinados
- [ ] Listar times gerenciados
- [ ] Validações de hierarquia

#### Qualidade

- [ ] Cobertura de testes > 70%
- [ ] Lint passando (eslint)
- [ ] Format passando (prettier)
- [ ] Sem vulnerabilidades críticas (npm audit)

#### Documentação

- [ ] Swagger/OpenAPI documentado
- [ ] README.md atualizado
- [ ] Endpoints documentados
- [ ] Exemplos de requests/responses

---

## 📚 Próximos Passos

### 15. Após Implementação Inicial

1. **PDI System**: Planos de desenvolvimento individual
2. **Gamification**: XP, níveis, conquistas
3. **Pull Requests**: Integração GitHub
4. **Notifications**: Sistema de notificações
5. **Analytics**: Dashboard e métricas
6. **Websockets**: Real-time updates
7. **Background Jobs**: Queue system (Bull/BullMQ)
8. **File Upload**: Avatar images (S3/local)

---

## 🎯 Métricas de Sucesso

### 16. KPIs

**Performance**:

- Response time < 200ms (95th percentile)
- Zero N+1 queries em produção
- Database connection pool otimizado

**Qualidade**:

- Cobertura de testes > 70%
- Zero vulnerabilidades críticas
- TypeScript strict mode habilitado

**Segurança**:

- Rate limiting configurado
- CORS restrito
- JWT com expiração adequada
- Passwords sempre hasheados

**Developer Experience**:

- Setup em < 5 minutos
- Hot reload funcionando
- Documentação clara e atualizada

---

## 🔧 Comandos Úteis

### 17. Quick Reference

```bash
# Development
npm run start:dev

# Build
npm run build

# Tests
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e

# Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run prisma:seed

# Lint & Format
npm run lint
npm run format

# Production
npm run start:prod
```

---

## 📞 Suporte

Para questões ou discussões sobre este plano:

1. Revisar este documento
2. Verificar schemas do Prisma
3. Consultar documentação NestJS/Prisma
4. Abrir issue se necessário

---

**Status**: 🟡 Pronto para implementação  
**Última Atualização**: 16 de outubro de 2025
