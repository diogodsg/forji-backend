# Google OAuth Login - Guia de Configuração

## ✅ Implementação Completa

Sistema de login com Google OAuth implementado para **apenas login** (não cria contas novas).

## 📋 Requisitos

- Aplicação OAuth configurada no Google Cloud Console
- Client ID e Client Secret do Google
- Usuários devem criar conta primeiro via registro tradicional

## 🔧 Configuração

### 1. Backend (.env)

Adicione as seguintes variáveis no arquivo `.env` do backend:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:8000/api/auth/google/callback"
```

### 2. Frontend (.env)

Adicione no arquivo `.env` do frontend:

```bash
VITE_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
```

### 3. Google Cloud Console

Configure os **Authorized redirect URIs** no Google Cloud Console:

**Desenvolvimento:**

- `http://localhost:8000/api/auth/google/callback`

**Produção:**

- `https://api.seudominio.com/api/auth/google/callback`

## 🎯 Como Funciona

### Fluxo de Autenticação

1. **Usuário clica em "Continuar com Google"**

   - Frontend redireciona para: `http://localhost:8000/api/auth/google`

2. **Backend inicia OAuth flow**

   - Google Strategy redireciona para página de login do Google

3. **Usuário faz login no Google**

   - Google redireciona de volta para: `http://localhost:8000/api/auth/google/callback`

4. **Backend processa callback**

   - Valida usuário no banco de dados
   - Se usuário não existe: retorna erro 401
   - Se usuário existe: gera JWT token

5. **Backend redireciona para frontend**

   - URL: `http://localhost:5173/auth/callback?token=JWT_TOKEN`

6. **Frontend processa token**
   - Salva no localStorage
   - AuthContext valida e carrega dados do usuário
   - Redireciona para dashboard

## 🔒 Segurança

- ✅ Apenas usuários existentes podem fazer login via Google
- ✅ Email deve corresponder a uma conta já criada
- ✅ Token JWT gerado com mesmo padrão do login tradicional
- ✅ Validação automática pelo AuthContext

## 🚫 Comportamento

### Login com Conta Inexistente

Se o usuário tentar fazer login com Google usando um email não cadastrado:

```
❌ Erro: "No account found with this email. Please create an account first."
```

**Solução:** Usuário deve criar conta primeiro usando o formulário de registro tradicional.

## 📁 Arquivos Criados/Modificados

### Backend

- ✅ `backend/src/auth/strategies/google.strategy.ts` - Estratégia OAuth do Google
- ✅ `backend/src/auth/use-cases/google-oauth.use-case.ts` - Lógica de login via Google
- ✅ `backend/src/auth/auth.controller.ts` - Endpoints `/auth/google` e `/auth/google/callback`
- ✅ `backend/src/auth/auth.service.ts` - Método `googleLogin()`
- ✅ `backend/src/auth/auth.module.ts` - Registro da GoogleStrategy
- ✅ `backend/.env.example` - Variáveis de ambiente documentadas

### Frontend

- ✅ `frontend/src/features/auth/components/LoginForm.tsx` - Botão "Continuar com Google"
- ✅ `frontend/src/pages/AuthCallbackPage.tsx` - Página de processamento do callback
- ✅ `frontend/src/App.tsx` - Rota `/auth/callback`
- ✅ `frontend/.env` - Variável `VITE_GOOGLE_CLIENT_ID`

## 🧪 Testando

1. **Certifique-se de ter variáveis configuradas** nos arquivos `.env`
2. **Reinicie o backend** para carregar as novas variáveis
3. **Crie uma conta via registro tradicional** com seu email do Google
4. **Acesse a página de login**
5. **Clique em "Continuar com Google"**
6. **Faça login com a conta Google** que corresponde ao email cadastrado
7. **Você deve ser redirecionado para o dashboard** autenticado

## 🔄 Produção

Para deploy em produção, atualize:

1. **Google Cloud Console:**

   - Adicione URIs de produção nos Authorized redirect URIs

2. **Backend .env:**

   ```bash
   GOOGLE_CALLBACK_URL="https://api.seudominio.com/api/auth/google/callback"
   FRONTEND_URL="https://seudominio.com"
   ```

3. **Frontend .env:**
   ```bash
   VITE_API_BASE_URL=https://api.seudominio.com/api
   VITE_GOOGLE_CLIENT_ID=seu-client-id-producao.apps.googleusercontent.com
   ```

## 💡 Próximos Passos (Opcional)

Se no futuro quiser permitir **criação de conta via Google**:

1. Modifique `google-oauth.use-case.ts`
2. Remova a validação que bloqueia usuários novos
3. Implemente criação automática de workspace
4. Adicione lógica de gamification para novos usuários

---

✨ **Login com Google implementado com sucesso!**
