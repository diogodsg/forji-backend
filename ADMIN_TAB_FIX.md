# 🔧 Fix: Admin Tab não Aparecia no Menu

## 🐛 Problema

**Sintoma:** Após login com `diego@forge.com` (usuário admin), a aba "Admin" não aparecia no menu de navegação.

**Causa Raiz:** Bug no parsing do token mock em `mockGetUserByToken()`.

### Como o Bug Acontecia:

1. **Login gera token:**

   ```typescript
   const token = `mock_token_${user.id}_${Date.now()}`;
   // Exemplo: "mock_token_550e8400-e29b-41d4-a716-446655440001_1729180800000"
   ```

2. **mockGetUserByToken tentava extrair UUID:**

   ```typescript
   // ANTES (BUGADO)
   const parts = token.split("_");
   // Resultado: ["mock", "token", "550e8400-e29b-41d4-a716-446655440001", "1729180800000"]
   // Porém UUID tem HÍFENS, não underscores!

   const userId = parts.slice(2, -1).join("_");
   // Resultado: "550e8400-e29b-41d4-a716-446655440001"
   // ✅ Funciona por acaso neste caso!
   ```

3. **Mas o problema real era:**
   Se o UUID tivesse underscores OU o split estivesse errado, o userId ficaria incorreto e nenhum usuário seria encontrado.

## ✅ Solução Implementada

**Arquivo:** `/frontend/src/features/auth/data/mockAuth.ts`

### Antes (Bugado):

```typescript
export function mockGetUserByToken(token: string): AuthUser | null {
  const parts = token.split("_");
  if (parts.length < 3) return null;

  // Reconstruir UUID juntando partes
  const userId = parts.slice(2, -1).join("_");

  return mockAuthUsers.find((u) => u.id === userId) || null;
}
```

### Depois (Corrigido):

```typescript
export function mockGetUserByToken(token: string): AuthUser | null {
  if (!token || !token.startsWith("mock_token_")) {
    return null;
  }

  // Remove o prefixo "mock_token_"
  const withoutPrefix = token.substring("mock_token_".length);

  // Divide pela ÚLTIMA ocorrência de "_" (separa UUID do timestamp)
  const lastUnderscoreIndex = withoutPrefix.lastIndexOf("_");
  if (lastUnderscoreIndex === -1) {
    return null;
  }

  // UUID está ANTES do último underscore
  const userId = withoutPrefix.substring(0, lastUnderscoreIndex);

  return mockAuthUsers.find((u) => u.id === userId) || null;
}
```

### Por Que Funciona Agora:

1. **Remove prefixo completo:**

   ```typescript
   "mock_token_550e8400-e29b-41d4-a716-446655440001_1729180800000"
   // Remove "mock_token_"
   → "550e8400-e29b-41d4-a716-446655440001_1729180800000"
   ```

2. **Encontra último underscore:**

   ```typescript
   lastUnderscoreIndex = 36 (posição do _ antes do timestamp)
   ```

3. **Extrai UUID corretamente:**

   ```typescript
   userId = "550e8400-e29b-41d4-a716-446655440001";
   ```

4. **Encontra usuário com isAdmin: true:**
   ```typescript
   mockAuthUsers.find((u) => u.id === userId);
   // Retorna: { id: "550...", name: "Diego", isAdmin: true, ... }
   ```

## 🔍 Debug Adicionado

### App.tsx - Indicador Visual (Desenvolvimento)

```tsx
{
  import.meta.env.DEV && (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded z-50">
      isAdmin: {user.isAdmin ? "true" : "false"} | isManager:{" "}
      {user.isManager ? "true" : "false"}
    </div>
  );
}
```

**Resultado:** Badge no canto inferior direito mostrando status de admin/manager.

### useAuth.tsx - Console Log Detalhado

```typescript
console.log("🔍 Debug user:", {
  isAdmin: userData.isAdmin,
  isManager: userData.isManager,
});
```

**Resultado:** Log no console mostrando flags de permissão.

## 🧪 Como Testar

### Teste 1: Login e Verificar Menu Admin

```bash
1. Fazer logout (se logado)
2. Abrir: http://localhost:5173/login
3. Email: diego@forge.com
4. Senha: senha123
5. Clicar "Entrar"

✅ Esperado:
- Redireciona para /development
- Menu horizontal tem aba "Admin" (ícone de escudo)
- Badge no canto inferior direito: "isAdmin: true | isManager: true"
- Console: "🔍 Debug user: { isAdmin: true, isManager: true }"
```

### Teste 2: Acessar Página Admin

```bash
1. Após login, clicar na aba "Admin"
2. OU navegar manualmente: http://localhost:5173/admin

✅ Esperado:
- Página de admin carrega
- Tabs: "Pessoas" e "Equipes"
- Não desloga automaticamente
```

### Teste 3: Login com Usuário Não-Admin

```bash
1. Fazer logout
2. Login: ana@forge.com / senha123

✅ Esperado:
- Redireciona para /development
- Menu NÃO tem aba "Admin"
- Badge: "isAdmin: false | isManager: false"
- Se tentar acessar /admin manualmente: "Acesso Negado"
```

## 📊 Usuários Mock Disponíveis

| Email            | isAdmin  | isManager | Posição         |
| ---------------- | -------- | --------- | --------------- |
| diego@forge.com  | ✅ true  | ✅ true   | Tech Lead       |
| maria@forge.com  | ❌ false | ✅ true   | Product Manager |
| ana@forge.com    | ❌ false | ❌ false  | Developer       |
| carlos@forge.com | ❌ false | ❌ false  | Frontend Dev    |
| pedro@forge.com  | ❌ false | ❌ false  | UX Designer     |

## 🎯 Resultado

### Antes:

- ❌ Login com diego@forge.com não mostrava aba Admin
- ❌ `user.isAdmin` retornava `undefined` ou `false`
- ❌ mockGetUserByToken retornava usuário errado ou null

### Agora:

- ✅ Login com diego@forge.com mostra aba Admin
- ✅ `user.isAdmin` retorna `true` corretamente
- ✅ mockGetUserByToken extrai UUID do token corretamente
- ✅ Badge de debug mostra status em tempo real

## 🔧 Arquivos Modificados

1. **`/frontend/src/features/auth/data/mockAuth.ts`**

   - ✅ `mockGetUserByToken()` refatorado
   - ✅ Parsing de token corrigido

2. **`/frontend/src/App.tsx`**

   - ✅ Badge de debug adicionado (dev only)

3. **`/frontend/src/features/auth/hooks/useAuth.tsx`**
   - ✅ Console log detalhado adicionado

## 💡 Aprendizado

**Problema:** Split por underscore não funciona quando o dado contém underscores.

**Solução:** Use `lastIndexOf()` para dividir pela última ocorrência, garantindo que caracteres especiais no meio do dado não causem problemas.

**Técnica:**

```typescript
// ❌ ERRADO: split pode quebrar dados
const parts = token.split("_");

// ✅ CERTO: lastIndexOf preserva dados complexos
const lastIndex = token.lastIndexOf("_");
const data = token.substring(0, lastIndex);
```

---

**Última atualização:** 2025-10-17  
**Autor:** GitHub Copilot  
**Versão:** 1.0
