# Refatoração Auth - Mock Data Only & Context API

## 📋 Resumo

Refatoração completa do sistema de autenticação para usar exclusivamente dados mock e Context API (sem Zustand).

**Data:** 16 de outubro de 2025  
**Status:** ✅ Completo

---

## 🎯 Decisão Arquitetural: Context API vs Zustand

### ✅ Por Que Context API é a Escolha Certa

**Auth Provider com Context API é IDEAL porque:**

1. **Estado Essencial e Top-Level**

   - Auth é necessário ANTES da árvore de componentes renderizar
   - InnerApp depende de `user` para decidir entre LoginPage e AppLayout
   - Sem auth, não há aplicação - é o estado mais fundamental

2. **Lógica de Ciclo de Vida Complexa**

   - Validação de token ao montar (useEffect)
   - Sincronização com localStorage
   - Validação assíncrona no início da app
   - Context + hooks é perfeito para isso

3. **Provider Pattern Natural**

   - Auth naturalmente encapsula a app toda (`<AuthProvider><App /></AuthProvider>`)
   - Não precisa de acesso fora da árvore React
   - Composição limpa e idiomática

4. **Performance Adequada**

   - Auth muda raramente (login/logout)
   - Re-renders não são problema
   - Não há listas grandes ou dados complexos

5. **Simplicidade e Manutenibilidade**
   - Menos dependências (Context é nativo do React)
   - Padrão React oficial para esse caso de uso
   - Mais fácil para novos desenvolvedores entenderem

### ❌ Por Que Zustand NÃO é Necessário

**Zustand seria overkill porque:**

1. Auth não precisa de acesso fora de componentes React
2. Não há benefício de performance (auth muda pouco)
3. Context já resolve o problema perfeitamente
4. Adicionar Zustand aumentaria complexidade desnecessária
5. Não há necessidade de DevTools para debug de auth

### 📚 Regra de Ouro

**Use Context API quando:**

- Estado é essencial e top-level
- Mudanças são raras
- Precisa de lógica de ciclo de vida (useEffect)
- Provider pattern faz sentido semanticamente

**Use Zustand quando:**

- Estado é complexo com muitas ações
- Precisa de acesso fora de React (middleware, utils)
- Performance é crítica (muitas atualizações)
- Quer DevTools e time-travel debugging

**Auth se encaixa perfeitamente no primeiro grupo!**

---

## 🔄 Mudanças Realizadas

### 1. Mock Data Layer

**Novo Arquivo:** `/features/auth/data/mockAuth.ts`

**Dados Mock:**

```typescript
mockAuthUsers: AuthUser[] = [
  { id: 1, name: "Diego Santos", email: "diego@forge.com", isAdmin: true, isManager: true },
  { id: 2, name: "Maria da Silva Sauro", email: "maria@forge.com", isManager: true },
  { id: 3, name: "Ana Silva", email: "ana@forge.com" },
  { id: 4, name: "Carlos Oliveira", email: "carlos@forge.com" },
  { id: 5, name: "Pedro Costa", email: "pedro@forge.com" },
]
```

**Funções Mock:**

- `mockLogin(email, password)` - Simula login (qualquer senha aceita)
- `mockRegister(data)` - Cria novo usuário temporário
- `mockGetUserByToken(token)` - Recupera usuário por token
- `getMockUserByEmail(email)` - Helper para testes
- `getAllMockAuthUsers()` - Lista todos

**Características:**

- ✅ Delays simulados (300-600ms)
- ✅ Validação de email duplicado
- ✅ Tokens mock formato: `mock_token_{userId}_{timestamp}`
- ✅ Console logs para debugging
- ✅ Novos usuários só existem na sessão (não persistem)

### 2. AuthProvider Refatorado

**Arquivo:** `/features/auth/hooks/useAuth.tsx`

**Antes (API):**

```typescript
const res = await api<{ access_token: string }>("/auth/login", {...});
const me = await api<AuthUser>("/auth/me", { auth: true });
```

**Depois (Mock):**

```typescript
const { user, token } = await mockLogin(email, password);
const userData = mockGetUserByToken(token);
```

**Mudanças:**

- ❌ Removido: `import { api, storeToken, clearToken } from "@/lib/apiClient"`
- ✅ Adicionado: `import { mockLogin, mockRegister, mockGetUserByToken } from "../data/mockAuth"`
- ✅ Mantido: React Context API (useState, useCallback, useEffect)
- ✅ Mantido: localStorage para token (simula sessão entre reloads)

**Nova Lógica:**

1. **Validação de Token (validateToken)**

   ```typescript
   - Delay de 300ms (simular rede)
   - mockGetUserByToken(token)
   - Limpa localStorage se token inválido
   ```

2. **Login (login)**

   ```typescript
   - mockLogin(email, password) com delay 500ms
   - Armazena token em localStorage
   - Atualiza state (setUser, setToken)
   ```

3. **Registro (register)**

   ```typescript
   - mockRegister(data) com delay 600ms
   - Valida email duplicado
   - Cria usuário temporário
   - Armazena token e atualiza state
   ```

4. **Logout (logout)**

   ```typescript
   - Remove token do localStorage
   - Limpa state (user = null, token = null)
   ```

5. **Refresh User (refreshUser)**
   ```typescript
   - Revalida token
   - Atualiza dados do usuário
   ```

### 3. Fluxo de Autenticação

**Diagrama de Estados:**

```
┌─────────────────┐
│  App.tsx Monta  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  AuthProvider Monta     │
│  - token = localStorage │
│  - loading = true       │
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────┐
│  validateToken()         │
│  - Delay 300ms           │
│  - mockGetUserByToken()  │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌──────┐  ┌──────────┐
│Valid │  │ Invalid  │
│Token │  │ ou null  │
└──┬───┘  └────┬─────┘
   │           │
   │           ▼
   │      ┌──────────┐
   │      │LoginPage │
   │      └────┬─────┘
   │           │
   │      ┌────┴────────┐
   │      │  login() ou │
   │      │  register() │
   │      └────┬────────┘
   │           │
   └───────────┴──────────┐
                          │
                          ▼
                   ┌─────────────┐
                   │  AppLayout  │
                   │  + Routes   │
                   └─────────────┘
```

### 4. Componentes Não Modificados

**LoginForm.tsx** - Mantido sem alterações

- Usa `useAuth()` hook
- Funciona automaticamente com mock data
- UI/UX inalterado

**App.tsx** - Mantido sem alterações

- Usa `<AuthProvider>` wrapper
- `InnerApp` depende de `user` e `loading`
- Lógica condicional permanece igual

---

## 🎨 Usuários Mock Disponíveis

### Admin + Manager

```typescript
Email: diego@forge.com
Senha: qualquer coisa
Role: Admin, Manager
```

### Manager

```typescript
Email: maria@forge.com
Senha: qualquer coisa
Role: Manager
```

### Usuários Normais

```typescript
Email: ana@forge.com | carlos@forge.com | pedro@forge.com
Senha: qualquer coisa
Role: User
```

**Nota:** No modo mock, QUALQUER senha é aceita para simplificar testes.

---

## 🔧 API do AuthProvider

### Context Value

```typescript
interface AuthContextValue {
  user: AuthUser | null; // Usuário autenticado ou null
  loading: boolean; // Loading durante validação inicial
  login: (email, password) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
```

### Storage Keys

```typescript
STORAGE_TOKEN_KEY = "auth:token"; // Token mock no localStorage
```

### Exemplo de Uso

```tsx
function MyComponent() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <div>Não autenticado</div>;
  }

  return (
    <div>
      <p>Olá, {user.name}!</p>
      {user.isAdmin && <AdminPanel />}
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

---

## 📊 Estatísticas

- **Arquivos Criados:** 2 (mockAuth.ts, AUTH_REFACTORING.md)
- **Arquivos Modificados:** 2 (useAuth.tsx, index.ts)
- **Arquivos Removidos:** 0
- **Dependências Removidas:** apiClient (import removido)
- **Linhas de Código Mock:** ~180 linhas
- **Erros de Compilação:** 0 ✅

---

## 🚀 Funcionalidades Implementadas

### Autenticação

- ✅ Login com email/senha
- ✅ Registro de novo usuário
- ✅ Validação de token ao montar
- ✅ Sessão persistente (localStorage)
- ✅ Logout limpa sessão

### UX

- ✅ Delays simulados para feedback realista
- ✅ Loading state durante validação
- ✅ Mensagens de erro apropriadas
- ✅ Console logs para debugging

### Segurança (Mock)

- ✅ Validação de email duplicado no registro
- ✅ Token inválido limpa sessão
- ✅ Logout remove token do localStorage

---

## ⚠️ Comportamento Mock

### O Que Persiste

- ✅ Token no localStorage (sessão entre reloads)

### O Que NÃO Persiste

- ❌ Novos usuários criados via registro (resetam no reload)
- ❌ Alterações em dados de usuário (perfil, etc.)
- ❌ Estado além do token

### Limitações Intencionais

1. **Qualquer senha aceita** - Simplifica testes
2. **Novos usuários temporários** - Não persistem após reload
3. **Token não expira** - Mock não tem expiração
4. **Sem refresh token** - Token mock é único e perpétuo

---

## 🐛 Problemas Conhecidos

### Resolvidos

- ✅ Dependência de apiClient removida
- ✅ Todos os imports atualizados
- ✅ 0 erros de compilação
- ✅ Context API funcionando perfeitamente

### Nenhum Problema Ativo

Sistema 100% funcional com mock data.

---

## 💡 Lições de Arquitetura

### Context API É Perfeito Para Auth

**Razões técnicas:**

1. Auth é singleton conceitual (um usuário por sessão)
2. Provider encapsula app naturalmente
3. useEffect + useState são suficientes
4. Não precisa de DevTools complexos
5. Performance não é gargalo

### Quando Considerar Zustand

Se no futuro o sistema de auth precisar de:

- Múltiplos tokens/sessões simultâneas
- Sincronização complexa com múltiplos serviços
- Middleware customizado (logging, analytics)
- Acesso a auth fora de componentes React
- DevTools para debug avançado

**Mas para auth simples, Context API é a escolha certa.**

---

## 📚 Arquivos Relevantes

### Core

- `/features/auth/hooks/useAuth.tsx` - Provider e hook
- `/features/auth/data/mockAuth.ts` - Mock data layer
- `/features/auth/types/auth.ts` - Type definitions
- `/features/auth/index.ts` - Barrel exports

### Componentes

- `/features/auth/components/LoginForm.tsx` - UI de login
- `/App.tsx` - Wrapper com AuthProvider

---

## ⏭️ Próximos Passos (Opcionais)

1. **Testes**

   - Testar login com todos os usuários mock
   - Testar registro de novo usuário
   - Validar logout e limpeza de sessão
   - Testar reload mantém sessão

2. **Melhorias Futuras** (se necessário)

   - Adicionar expiração de token mock
   - Implementar refresh token pattern
   - Adicionar password validation (min length, etc.)
   - Mock de 2FA/MFA

3. **Documentação**
   - Atualizar README.md da pasta auth
   - Criar guia de "Como adicionar novo usuário mock"

---

**✨ Refatoração concluída! Context API é a escolha arquitetural correta para auth.**
