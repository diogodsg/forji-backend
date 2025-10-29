# Guia de Testes - Sistema de Autenticação Mock

## 🎯 Como Testar

### 1. Login com Usuários Existentes

**Admin + Manager (Acesso Total)**

```
Email: diego@forji.com
Senha: qualquer coisa (ex: "123" ou "senha" ou "admin")
```

- ✅ Deve logar com sucesso
- ✅ Deve ver menu Admin e Manager
- ✅ Console: "✅ Login mock bem-sucedido: Diego Santos"

**Manager (Sem Admin)**

```
Email: maria@forji.com
Senha: qualquer senha
```

- ✅ Deve logar com sucesso
- ✅ Deve ver menu Manager (não Admin)
- ✅ Console: "✅ Login mock bem-sucedido: Maria da Silva Sauro"

**Usuário Normal**

```
Email: ana@forji.com
Senha: qualquer senha
```

- ✅ Deve logar com sucesso
- ✅ Não deve ver menus Admin/Manager
- ✅ Console: "✅ Login mock bem-sucedido: Ana Silva"

### 2. Erros de Login

**Email Inexistente**

```
Email: naoexiste@forji.com
Senha: 123
```

- ✅ Deve mostrar erro: "Email não encontrado"
- ✅ Deve manter no LoginPage

**Senha Vazia**

```
Email: diego@forji.com
Senha: (deixar vazio)
```

- ✅ Deve mostrar erro: "Preencha os campos."
- ✅ Não deve fazer chamada mock

### 3. Registro de Novo Usuário

**Criar Nova Conta**

```
1. Clicar em "Criar uma conta"
2. Nome: João Silva
3. Email: joao@forji.com
4. Senha: 123
5. Clicar em "Registrar"
```

- ✅ Deve criar usuário com sucesso
- ✅ Deve logar automaticamente
- ✅ Console: "✅ Registro mock bem-sucedido: João Silva"
- ✅ Usuário deve ter: isAdmin=false, isManager=false

**Email Duplicado**

```
1. Tentar registrar com: diego@forji.com
```

- ✅ Deve mostrar erro: "Email já cadastrado"
- ✅ Não deve criar usuário

### 4. Persistência de Sessão

**Manter Login Após Reload**

```
1. Fazer login (ex: diego@forji.com)
2. Recarregar página (F5)
```

- ✅ Deve manter usuário logado
- ✅ Delay de 300ms (validação do token)
- ✅ Console: "✅ Usuário autenticado (mock): Diego Santos"

**Logout e Limpar Sessão**

```
1. Estar logado
2. Clicar em logout
3. Recarregar página
```

- ✅ Deve voltar para LoginPage
- ✅ Console: "👋 Logout realizado"
- ✅ localStorage deve estar limpo

### 5. Loading States

**Loading Inicial**

```
1. Recarregar página estando logado
```

- ✅ Deve mostrar ScreenLoading (~300ms)
- ✅ Depois deve mostrar AppLayout

**Loading no Login**

```
1. Clicar em "Entrar"
```

- ✅ Botão deve mostrar "Entrando..."
- ✅ Spinner deve aparecer (~500ms)

**Loading no Registro**

```
1. Clicar em "Registrar"
```

- ✅ Botão deve mostrar "Registrando..."
- ✅ Spinner deve aparecer (~600ms)

### 6. Console Logs (Debug)

**Login**

```
✅ Login mock bem-sucedido: [Nome do Usuário]
```

**Registro**

```
✅ Registro mock bem-sucedido: [Nome do Usuário]
```

**Validação de Token**

```
✅ Usuário autenticado (mock): [Nome do Usuário]
ou
⚠️ Token mock inválido, sessão limpa
```

**Logout**

```
👋 Logout realizado
```

**Refresh User**

```
🔄 Dados do usuário atualizados
```

---

## 🧪 Casos de Teste Automatizados

### Test Suite: Authentication Flow

```typescript
describe("Auth Mock System", () => {
  test("Login com usuário existente", async () => {
    const { user, token } = await mockLogin("diego@forji.com", "123");
    expect(user.name).toBe("Diego Santos");
    expect(user.isAdmin).toBe(true);
    expect(token).toMatch(/^mock_token_1_/);
  });

  test("Login com email inexistente", async () => {
    await expect(mockLogin("naoexiste@forji.com", "123")).rejects.toThrow(
      "Email não encontrado"
    );
  });

  test("Registro de novo usuário", async () => {
    const { user } = await mockRegister({
      name: "Teste",
      email: "teste@forji.com",
      password: "123",
    });
    expect(user.name).toBe("Teste");
    expect(user.isAdmin).toBe(false);
  });

  test("Registro com email duplicado", async () => {
    await expect(
      mockRegister({
        name: "Diego Clone",
        email: "diego@forji.com",
        password: "123",
      })
    ).rejects.toThrow("Email já cadastrado");
  });

  test("Token validation recupera usuário", () => {
    const token = "mock_token_1_1234567890";
    const user = mockGetUserByToken(token);
    expect(user?.id).toBe(1);
    expect(user?.name).toBe("Diego Santos");
  });

  test("Token inválido retorna null", () => {
    const user = mockGetUserByToken("invalid_token");
    expect(user).toBeNull();
  });
});
```

---

## 🔍 Checklist de Validação

### Funcionalidades Core

- [ ] Login com email/senha funciona
- [ ] Registro cria novo usuário
- [ ] Logout limpa sessão
- [ ] Reload mantém sessão (token no localStorage)

### Validações

- [ ] Email inexistente mostra erro
- [ ] Email duplicado no registro mostra erro
- [ ] Campos vazios mostram erro
- [ ] Token inválido limpa sessão

### UX

- [ ] Loading durante login (~500ms)
- [ ] Loading durante registro (~600ms)
- [ ] Loading durante validação inicial (~300ms)
- [ ] Mensagens de erro apropriadas
- [ ] Transição suave entre LoginPage e AppLayout

### Roles e Permissões

- [ ] Admin vê menu Admin + Manager
- [ ] Manager vê menu Manager (não Admin)
- [ ] User não vê menus especiais
- [ ] Rotas protegidas funcionam corretamente

### Persistência

- [ ] Token salvo em localStorage após login
- [ ] Token carregado ao montar app
- [ ] Token removido no logout
- [ ] Novos usuários não persistem após reload (comportamento esperado)

### Console Logs

- [ ] Logs de login aparecem
- [ ] Logs de registro aparecem
- [ ] Logs de validação aparecem
- [ ] Logs de logout aparecem
- [ ] Erros são logados apropriadamente

---

## 📊 Delays Simulados

| Operação         | Delay       | Razão                                |
| ---------------- | ----------- | ------------------------------------ |
| Login            | 500ms       | Simular requisição de autenticação   |
| Registro         | 600ms       | Simular criação de conta + validação |
| Token Validation | 300ms       | Simular verificação de token         |
| Refresh User     | Instantâneo | Apenas consulta local                |

---

## 💡 Dicas para Testes

### 1. Testar Diferentes Roles

```bash
# Admin + Manager
diego@forji.com

# Só Manager
maria@forji.com

# User normal
ana@forji.com
carlos@forji.com
pedro@forji.com
```

### 2. Limpar Sessão Manualmente

```javascript
// No DevTools Console
localStorage.removeItem("auth:token");
location.reload();
```

### 3. Ver Token Atual

```javascript
// No DevTools Console
localStorage.getItem("auth:token");
```

### 4. Forçar Logout

```javascript
// No DevTools Console
localStorage.clear();
location.reload();
```

### 5. Ver Usuários Mock Disponíveis

```javascript
// No código, importar:
import { getAllMockAuthUsers } from "@/features/auth";

// Listar todos
getAllMockAuthUsers();
```

---

## 🐛 Troubleshooting

### Problema: Fica em Loading Infinito

**Solução:**

```javascript
// Limpar localStorage
localStorage.clear();
location.reload();
```

### Problema: Não Consegue Logar

**Verificar:**

1. Email está correto? (case-sensitive)
2. Alguma senha foi digitada? (pode ser qualquer uma)
3. Console mostra algum erro?

### Problema: Logout Não Funciona

**Verificar:**

1. Console mostra "👋 Logout realizado"?
2. localStorage foi limpo? (`localStorage.getItem('auth:token')` deve ser null)
3. Recarregou a página?

### Problema: Novo Usuário Desaparece Após Reload

**Isso é esperado!** Novos usuários registrados não persistem após reload. É comportamento mock intencional.

---

## ✅ Status de Testes

**Última Atualização:** 16 de outubro de 2025

- [ ] Testes manuais executados
- [ ] Todos os usuários mock testados
- [ ] Registro testado
- [ ] Logout testado
- [ ] Persistência validada
- [ ] Roles verificadas
- [ ] Console logs validados

**Responsável pelos testes:** ****\*\*****\_****\*\*****

**Observações:** ******\*\*\*\*******\_******\*\*\*\*******
