# 🔍 Debug Guide - Google OAuth Login

## Logs Adicionados

Adicionei logs detalhados em todo o fluxo OAuth para facilitar o debug.

## 📋 Como Testar

### 1. Verifique as Variáveis de Ambiente

**Backend (.env):**

```bash
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:8000/api/auth/google/callback"
FRONTEND_URL="http://localhost:5173"
```

### 2. Reinicie o Backend

```bash
cd backend
npm run start:dev
```

**Verifique o log inicial:**

```
🔧 GoogleStrategy Config: {
  clientID: 'xxxxx...',
  clientSecret: '✅ SET',
  callbackURL: 'http://localhost:8000/api/auth/google/callback'
}
```

Se aparecer `❌ MISSING`, as variáveis não estão carregadas!

### 3. Teste o Fluxo OAuth

1. **Clique em "Continuar com Google"**

2. **Faça login no Google**

3. **Acompanhe os logs do backend:**

```
✅ Google validation successful: { email: 'seu@email.com', name: 'Seu Nome' }
📞 Google callback received, user: { email: 'seu@email.com', ... }
🔐 Google OAuth - Profile received: { email: 'seu@email.com', name: 'Seu Nome' }
✅ User found: { id: 'xxx', email: 'seu@email.com' }
🎟️ JWT Token generated: eyJhbGciOiJIUzI1NI6Ik...
✅ Login successful, redirecting with token
🔄 Redirecting to: http://localhost:5173/auth/callback?token=...
```

4. **Acompanhe os logs do frontend (Console do navegador):**

```
📥 AuthCallback - Token received: ✅ YES
📥 Full URL: http://localhost:5173/auth/callback?token=...
💾 Storing token in localStorage...
🔄 Redirecting to home...
```

## 🐛 Problemas Comuns

### ❌ "No token found in callback URL"

**Causa:** Backend não está redirecionando com o token

**Verifique:**

- Logs do backend mostram `🔄 Redirecting to:`?
- A URL de callback está correta?
- `FRONTEND_URL` está configurado corretamente?

### ❌ "No account found with this email"

**Causa:** Usuário não existe no banco de dados

**Solução:** Crie uma conta primeiro usando o formulário de registro tradicional com o mesmo email do Google

### ❌ "User has no workspace membership"

**Causa:** Usuário existe mas não tem workspace

**Solução:** Execute o seed ou crie workspace manualmente

### ❌ Backend não inicia / Google Strategy não carrega

**Causa:** `ConfigModule` não estava importado no `AuthModule`

**Solução:** ✅ Já corrigido! ConfigModule agora está importado.

## 📊 Checklist de Verificação

- [ ] Backend rodando sem erros
- [ ] Log `🔧 GoogleStrategy Config` mostra credenciais carregadas
- [ ] Variáveis GOOGLE\_\* estão no .env do backend
- [ ] Conta já criada no sistema com email do Google
- [ ] FRONTEND_URL aponta para http://localhost:5173
- [ ] Browser console mostra logs do AuthCallbackPage

## 🔧 Comandos Úteis

**Verificar .env do backend:**

```bash
cd backend
cat .env | grep GOOGLE
```

**Verificar se usuário existe:**

```bash
# Entre no Prisma Studio
npx prisma studio
# Busque por seu email na tabela User
```

**Limpar localStorage do frontend:**

```javascript
// No console do navegador
localStorage.clear();
```

## 📝 Próximos Passos

Se ainda não funcionar após verificar todos os itens acima, compartilhe:

1. **Logs do backend** (terminal onde roda `npm run start:dev`)
2. **Logs do frontend** (console do navegador - F12)
3. **URL de callback** que aparece na barra de endereço após login no Google

---

**Alterações feitas:**

- ✅ Adicionado `ConfigModule` no `AuthModule`
- ✅ Logs detalhados em todas as etapas do fluxo
- ✅ Validação de configuração na inicialização
