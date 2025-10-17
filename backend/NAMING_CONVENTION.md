# 🔄 Naming Convention Guide

## Estratégia de Nomenclatura

O Forge Backend usa **duas convenções de nomenclatura diferentes**:

- **Database (Prisma)**: `snake_case`
- **Application Code (TypeScript)**: `camelCase`

---

## 📊 Como Funciona

### 1. No Banco de Dados (snake_case)

```sql
-- Tabela: users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR,
  is_admin BOOLEAN,      -- snake_case
  is_manager BOOLEAN,    -- snake_case
  created_at TIMESTAMP,  -- snake_case
  updated_at TIMESTAMP   -- snake_case
);
```

### 2. No Schema Prisma (snake_case)

```prisma
model User {
  id         String   @id @default(uuid())
  email      String   @unique
  is_admin   Boolean  @default(false)   // snake_case
  is_manager Boolean  @default(false)   // snake_case
  created_at DateTime @default(now())   // snake_case
  updated_at DateTime @updatedAt        // snake_case

  @@map("users")
}
```

### 3. No Código TypeScript (camelCase)

```typescript
// Entity transformada para camelCase
export class UserEntity {
  id: string;
  email: string;
  isAdmin: boolean; // camelCase ✅
  isManager: boolean; // camelCase ✅
  createdAt: Date; // camelCase ✅
  updatedAt: Date; // camelCase ✅
}

// DTO também em camelCase
export class AuthResponseDto {
  user: UserEntity;
  accessToken: string; // camelCase ✅
}
```

---

## 🔄 Transformação Automática

### UserEntity.fromPrisma()

Converte objetos do Prisma (snake_case) para camelCase:

```typescript
// Prisma retorna (snake_case)
const prismaUser = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
});
// {
//   id: "uuid",
//   email: "user@example.com",
//   is_admin: true,        // snake_case do banco
//   is_manager: false,     // snake_case do banco
//   created_at: Date,      // snake_case do banco
//   updated_at: Date       // snake_case do banco
// }

// Transformar para camelCase
const user = UserEntity.fromPrisma(prismaUser);
// {
//   id: "uuid",
//   email: "user@example.com",
//   isAdmin: true,         // camelCase ✅
//   isManager: false,      // camelCase ✅
//   createdAt: Date,       // camelCase ✅
//   updatedAt: Date        // camelCase ✅
// }
```

### Exemplo no AuthService

```typescript
async register(registerDto: RegisterDto) {
  // 1. Prisma usa snake_case no banco
  const user = await this.prisma.user.create({
    data: {
      email: registerDto.email,
      password: hashedPassword,
      // Prisma mapeia automaticamente para is_admin no banco
      is_admin: false,
    },
  });

  // 2. Transformar para camelCase na aplicação
  const userEntity = UserEntity.fromPrisma(user);

  // 3. Retornar DTO em camelCase
  return {
    user: userEntity,      // camelCase ✅
    accessToken: token,    // camelCase ✅
  };
}
```

---

## 🎯 Benefícios

### ✅ Vantagens

1. **Consistência SQL**: snake_case é padrão em PostgreSQL
2. **Consistência TypeScript**: camelCase é padrão em JavaScript/TypeScript
3. **Melhor DX**: Cada camada usa sua convenção natural
4. **Type Safety**: TypeScript garante que você use o formato correto

### 📝 Regras Práticas

| Contexto         | Convenção         | Exemplo                  |
| ---------------- | ----------------- | ------------------------ |
| Database Schema  | `snake_case`      | `is_admin`, `created_at` |
| Prisma Model     | `snake_case`      | `is_admin`, `created_at` |
| TypeScript Class | `camelCase`       | `isAdmin`, `createdAt`   |
| DTO Properties   | `camelCase`       | `isAdmin`, `accessToken` |
| JSON Response    | `camelCase`       | `isAdmin`, `accessToken` |
| Environment Vars | `SCREAMING_SNAKE` | `JWT_SECRET`             |

---

## 🛠️ Como Adicionar Novos Campos

### 1. Adicione no Prisma Schema (snake_case)

```prisma
model User {
  // ... campos existentes
  phone_number String?  // snake_case no banco
}
```

### 2. Rode a Migration

```bash
npx prisma migrate dev --name add_phone_number
```

### 3. Atualize UserEntity (camelCase)

```typescript
export class UserEntity {
  // ... campos existentes
  phoneNumber?: string; // camelCase na aplicação

  static fromPrisma(prismaUser: PrismaUser): UserEntity {
    return {
      // ... mapeamentos existentes
      phoneNumber: prismaUser.phone_number ?? undefined, // transformação
    };
  }
}
```

### 4. Use no Código (camelCase)

```typescript
const user = await this.authService.getUserById(id);
console.log(user.phoneNumber); // camelCase ✅
```

---

## 🚫 Anti-Patterns (Evite!)

### ❌ Misturar Convenções

```typescript
// ERRADO: snake_case no código TypeScript
const user = {
  email: 'test@test.com',
  is_admin: true, // ❌ Não use snake_case aqui
  created_at: new Date(), // ❌ Não use snake_case aqui
};
```

### ❌ Não Transformar Prisma Objects

```typescript
// ERRADO: Retornar objeto Prisma diretamente
@Get('me')
async getProfile() {
  const user = await this.prisma.user.findUnique(...);
  return user;  // ❌ Contém snake_case!
}

// CORRETO: Transformar para camelCase
@Get('me')
async getProfile() {
  const user = await this.prisma.user.findUnique(...);
  return UserEntity.fromPrisma(user);  // ✅ camelCase
}
```

---

## 📚 Resumo

1. **Banco de dados**: Sempre `snake_case`
2. **Prisma Schema**: Sempre `snake_case` (reflete o banco)
3. **TypeScript/DTOs**: Sempre `camelCase`
4. **JSON APIs**: Sempre `camelCase` (responses e requests)
5. **Transformação**: Use `UserEntity.fromPrisma()` para converter

Isso garante:

- ✅ Código TypeScript idiomático (camelCase)
- ✅ Database SQL padrão (snake_case)
- ✅ Type safety completo
- ✅ Consistência em toda a aplicação
