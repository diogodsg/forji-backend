# Users Module - Repository Pattern + Use Cases

## 📋 Overview

This module was refactored to follow **Repository Pattern + Use Cases** architecture for better maintainability, testability, and scalability.

## 🏗️ Architecture

```
users/
├── dto/                              # Data Transfer Objects
├── services/                         # Auxiliary services (reusable)
│   ├── password.service.ts          # Password hashing, validation, generation
│   └── permissions.service.ts       # Authorization checks
├── repositories/                     # Data access layer
│   └── users.repository.ts          # All Prisma queries
├── use-cases/                        # Business logic
│   ├── find-all-users.use-case.ts   # Find users with hierarchy
│   ├── find-one-user.use-case.ts    # Find single user
│   ├── search-users.use-case.ts     # Search users
│   ├── create-user.use-case.ts      # Create basic user
│   ├── onboard-user.use-case.ts     # Create with manager/team
│   ├── update-user.use-case.ts      # Update profile
│   ├── update-password.use-case.ts  # Change password
│   ├── admin-reset-password.use-case.ts  # Admin reset
│   └── delete-user.use-case.ts      # Soft delete
├── users.service.ts                 # Facade (delegates to use cases)
├── users.controller.ts              # HTTP endpoints
└── users.module.ts                  # Module registration
```

## 🎯 Design Principles

### 1. **Separation of Concerns**

- **Repository**: Only database queries (Prisma)
- **Use Cases**: Only business logic
- **Services**: Reusable utilities (password, permissions)
- **Facade**: Orchestration (delegates to use cases)

### 2. **Single Responsibility**

Each file has ONE clear purpose:

- `password.service.ts` - Everything about passwords
- `onboard-user.use-case.ts` - Only onboarding logic
- `users.repository.ts` - Only data access

### 3. **Dependency Injection**

All dependencies are injected through constructors, making testing easy:

```typescript
constructor(
  private readonly usersRepository: UsersRepository,
  private readonly passwordService: PasswordService,
) {}
```

### 4. **Testability**

Easy to mock dependencies:

```typescript
const mockRepo = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const useCase = new CreateUserUseCase(mockRepo, passwordService);
```

## 📦 Layer Responsibilities

### **Repository Layer** (`users.repository.ts`)

**What it does:**

- Encapsulates all Prisma queries
- Provides clean interface for data access
- No business logic, just CRUD operations

**Example:**

```typescript
async findByEmail(email: string) {
  return this.prisma.user.findUnique({ where: { email } });
}
```

### **Service Layer** (`services/`)

**What it does:**

- Reusable utilities
- Can be used across multiple use cases
- No database access

**Examples:**

- `PasswordService`: hash, compare, generate, validate
- `PermissionsService`: isAdmin, canEdit, ensurePermission

### **Use Case Layer** (`use-cases/`)

**What it does:**

- Contains business logic for ONE specific operation
- Coordinates between repository and services
- Validates inputs and permissions
- Handles transactions

**Example:**

```typescript
async execute(dto: CreateUserDto, creatorId: string) {
  // 1. Validate
  const existing = await this.repo.findByEmail(dto.email);
  if (existing) throw new ConflictException();

  // 2. Transform
  const password = await this.passwordService.hash(dto.password);

  // 3. Persist
  return this.repo.create({ ...dto, password });
}
```

### **Facade Layer** (`users.service.ts`)

**What it does:**

- Simple delegation to use cases
- Maintains backward compatibility
- Clean public API

**Example:**

```typescript
async create(dto: CreateUserDto, creatorId: string) {
  return this.createUserUseCase.execute(dto, creatorId);
}
```

## 🔄 Migration Strategy

To migrate from old to new architecture:

### Step 1: Copy files

```bash
# Backup old service
cp users.service.ts users.service.old.ts

# Replace with refactored version
cp users.service.refactored.ts users.service.ts
cp users.module.refactored.ts users.module.ts
```

### Step 2: Run tests

```bash
npm run test users
```

### Step 3: Start backend

```bash
npm run dev
```

### Step 4: Verify all endpoints work

- GET /users
- GET /users/:id
- POST /users
- POST /users/onboarding
- PATCH /users/:id
- PATCH /users/:id/password
- POST /users/:id/reset-password
- DELETE /users/:id

## ✅ Benefits

### Before (Monolithic Service)

- ❌ 822 lines in one file
- ❌ Hard to test (tightly coupled)
- ❌ Hard to maintain (everything together)
- ❌ Hard to reuse logic

### After (Repository + Use Cases)

- ✅ ~100-200 lines per file
- ✅ Easy to test (mockable dependencies)
- ✅ Easy to maintain (one responsibility per file)
- ✅ Easy to reuse (services exported)
- ✅ Easy to extend (add new use case)

## 🧪 Testing Example

```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepo: jest.Mocked<UsersRepository>;
  let mockPasswordService: jest.Mocked<PasswordService>;

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as any;

    mockPasswordService = {
      hash: jest.fn().mockResolvedValue('hashed'),
    } as any;

    useCase = new CreateUserUseCase(mockRepo, mockPasswordService);
  });

  it('should create user when email is unique', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue({ id: '1', email: 'test@test.com' });

    const result = await useCase.execute(
      {
        email: 'test@test.com',
        password: '123',
        name: 'Test',
      },
      'creator-id',
    );

    expect(result).toBeDefined();
    expect(mockRepo.create).toHaveBeenCalled();
  });

  it('should throw when email exists', async () => {
    mockRepo.findByEmail.mockResolvedValue({ id: '1' } as any);

    await expect(useCase.execute({ email: 'test@test.com' }, 'creator-id')).rejects.toThrow(
      ConflictException,
    );
  });
});
```

## 🚀 Next Steps

1. **Apply same pattern to Teams module**
2. **Add integration tests**
3. **Add API documentation**
4. **Consider adding Domain Events**

## 📚 Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Use Case Pattern](https://khalilstemmler.com/articles/enterprise-typescript-nodejs/application-layer-use-cases/)
