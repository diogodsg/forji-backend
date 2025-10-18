# Toast System - Guia de Uso

Sistema de notificações seguindo o **Design System Forge v2.4** com gradientes Violet brand, sombras suaves e micro-interactions.

## 📦 Instalação

O sistema já está integrado no `App.tsx`:

```tsx
import { ToastProvider, ToastContainer } from "@/components/Toast";

<ToastProvider>
  <App />
  <ToastContainer />
</ToastProvider>;
```

## 🎨 Design System

### Tipos de Toast

| Tipo      | Gradiente               | Ícone         | Uso Principal                      |
| --------- | ----------------------- | ------------- | ---------------------------------- |
| `success` | `emerald-50 → green-50` | CheckCircle2  | Confirmações, ações bem-sucedidas  |
| `error`   | `rose-50 → rose-100`    | XCircle       | Erros, falhas, ações bloqueadas    |
| `warning` | `amber-50 → yellow-50`  | AlertTriangle | Avisos, atenções, dados não salvos |
| `info`    | `indigo-50 → purple-50` | Info          | Informações, novidades, dicas      |

### Elementos Visuais

- **Border Radius**: `rounded-xl` (0.75rem)
- **Shadow**: `shadow-lg` (elevação média)
- **Padding**: `p-4` (1rem)
- **Gap interno**: `gap-3` (0.75rem)
- **Ícones**: Lucide React, tamanho `w-5 h-5`
- **Animação**: `slide-in-from-right` (300ms)

### Acessibilidade

- `role="alert"` para semântica
- `aria-live="polite"` (info, success, warning)
- `aria-live="assertive"` (error - prioritário)
- Botão fechar com `aria-label`
- Focus ring com `focus:ring-2 focus:ring-brand-400`

## 🚀 Uso Básico

### 1. Importar o Hook

```tsx
import { useToast } from "@/components/Toast";

function MyComponent() {
  const { success, error, warning, info } = useToast();

  // ...
}
```

### 2. Disparar Notificações

#### Success (Verde)

```tsx
// Simples
success("Dados salvos com sucesso!");

// Com título
success(
  "Seu perfil foi atualizado com todas as alterações.",
  "Perfil atualizado"
);

// Com duração customizada (10 segundos)
success("Operação concluída. Verifique seu email.", "Sucesso", 10000);
```

#### Error (Vermelho)

```tsx
// Simples
error("Não foi possível conectar ao servidor.");

// Com título e contexto
error(
  "Verifique sua conexão com a internet e tente novamente.",
  "Erro de Conexão"
);

// Permanente (não some automaticamente)
error(
  "Erro crítico detectado. Contate o suporte.",
  "Erro Crítico",
  0 // duration = 0 significa permanente
);
```

#### Warning (Amarelo/Âmbar)

```tsx
// Atenção
warning("Você tem alterações não salvas.");

// Com detalhes
warning("Salve suas alterações antes de sair da página.", "Atenção");
```

#### Info (Roxo/Brand)

```tsx
// Informação
info("Nova funcionalidade disponível!");

// Com descrição
info("Agora você pode exportar relatórios em PDF e Excel.", "Novidade");
```

## 🔧 API Completa

### `useToast()` Hook

Retorna objeto com métodos:

```typescript
interface ToastContextValue {
  // Métodos de atalho (recomendado)
  success: (message: string, title?: string, duration?: number) => string;
  error: (message: string, title?: string, duration?: number) => string;
  warning: (message: string, title?: string, duration?: number) => string;
  info: (message: string, title?: string, duration?: number) => string;

  // Método genérico (avançado)
  toast: (toast: Omit<Toast, "id">) => string;

  // Gerenciamento
  remove: (id: string) => void;
  clear: () => void;

  // Estado atual
  toasts: Toast[];
}
```

### Método `toast()` (Avançado)

Para controle total:

```tsx
const { toast } = useToast();

const toastId = toast({
  type: "success",
  title: "Título",
  message: "Mensagem completa aqui",
  duration: 5000, // ou 0 para permanente
});

// Remover manualmente depois
setTimeout(() => remove(toastId), 3000);
```

### Método `clear()`

Remove todos os toasts de uma vez:

```tsx
const { clear } = useToast();

// Limpar todos
clear();
```

## 📝 Exemplos Práticos

### 1. Integrado com useAuth (já implementado)

```tsx
// Login bem-sucedido
toast.success(`Bem-vindo de volta, ${response.user.name}!`, "Login realizado");

// Erro de autenticação
toast.error(errorMsg, "Erro no login");

// Fallback mock ativo
toast.warning("Usando dados mockados (modo desenvolvimento)", "Fallback ativo");

// Logout
toast.info("Até logo! Sessão encerrada.", "Logout");
```

### 2. Form Validation

```tsx
function handleSubmit(data: FormData) {
  // Validação
  if (!data.email) {
    error("Por favor, preencha o email.", "Campo obrigatório");
    return;
  }

  if (!isValidEmail(data.email)) {
    warning("O formato do email está incorreto.", "Email inválido");
    return;
  }

  // Sucesso
  success("Formulário enviado com sucesso!");
}
```

### 3. Operações Assíncronas

```tsx
async function saveData() {
  try {
    await api.post("/data", payload);
    success("Dados salvos com sucesso!");
  } catch (err) {
    error(extractErrorMessage(err), "Erro ao salvar");
  }
}
```

### 4. Progresso de Upload

```tsx
async function uploadFile(file: File) {
  const uploadId = info(
    "Fazendo upload do arquivo...",
    "Aguarde",
    0 // Permanente durante upload
  );

  try {
    await api.upload(file);
    remove(uploadId);
    success("Arquivo enviado com sucesso!");
  } catch (err) {
    remove(uploadId);
    error("Falha no upload. Tente novamente.");
  }
}
```

### 5. Ações Destrutivas (Confirmação)

```tsx
function handleDelete() {
  warning(
    "Esta ação não pode ser desfeita.",
    "Confirmar exclusão?",
    8000 // 8 segundos
  );

  // Lógica de confirmação...

  // Depois de confirmar:
  success("Item excluído com sucesso.");
}
```

### 6. Feedback de Cópia

```tsx
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  success("Copiado para a área de transferência!", "", 2000);
}
```

### 7. Notificação de Novidade

```tsx
useEffect(() => {
  // Ao montar componente, mostrar novidade
  if (isNewFeature) {
    info(
      "Explore os novos recursos de gamificação no menu.",
      "Novidade disponível!"
    );
  }
}, []);
```

### 8. Erro de Rede com Retry

```tsx
async function fetchData() {
  try {
    const data = await api.get("/data");
    return data;
  } catch (err) {
    const retryId = error(
      "Falha na conexão. Clique aqui para tentar novamente.",
      "Erro de Rede",
      0 // Permanente
    );

    // Implementar retry logic...
  }
}
```

## 🎨 Customização

### Duração Padrão

Alterável em `ToastContext.tsx`:

```tsx
const newToast: Toast = {
  id,
  duration: 5000, // <- Alterar aqui (5s padrão)
  ...toastData,
};
```

### Posição do Container

Alterável em `ToastContainer.tsx`:

```tsx
// Padrão: top-right
<div className="fixed top-4 right-4 z-50">

// Outras opções:
// Top-left: "top-4 left-4"
// Bottom-right: "bottom-4 right-4"
// Bottom-left: "bottom-4 left-4"
// Top-center: "top-4 left-1/2 -translate-x-1/2"
```

### Novos Tipos de Toast

Para adicionar novos tipos (ex: `neutral`), editar `ToastContainer.tsx`:

```tsx
const toastConfig: Record<ToastType, {...}> = {
  // ... tipos existentes
  neutral: {
    icon: Circle,
    bgGradient: "from-gray-50 to-gray-100",
    borderColor: "border-gray-200",
    iconColor: "text-gray-600",
    textColor: "text-gray-900",
  },
};
```

## 🧪 Testes

### Jest + React Testing Library

```tsx
import { render, screen } from "@testing-library/react";
import { ToastProvider, useToast } from "@/components/Toast";

function TestComponent() {
  const { success } = useToast();
  return <button onClick={() => success("Test")}>Show</button>;
}

test("should show toast on button click", () => {
  render(
    <ToastProvider>
      <TestComponent />
    </ToastProvider>
  );

  const button = screen.getByText("Show");
  fireEvent.click(button);

  expect(screen.getByRole("alert")).toHaveTextContent("Test");
});
```

## 📊 Performance

- **Bundle size**: ~2KB (gzipped)
- **Dependencies**: Apenas Lucide React (ícones)
- **Renderizações**: Otimizado com `useCallback`
- **Memory leaks**: Auto-cleanup de timers

## ✅ Checklist de Boas Práticas

- [ ] Usar títulos descritivos para contexto adicional
- [ ] Mensagens curtas e objetivas (máx. 2 linhas)
- [ ] Success para confirmações positivas
- [ ] Error para falhas e bloqueios
- [ ] Warning para atenções não-críticas
- [ ] Info para novidades e dicas
- [ ] Duração adequada: 2-3s para success rápido, 5-8s para mensagens longas
- [ ] Permanente (duration=0) apenas para erros críticos ou ações pendentes
- [ ] Remover toasts manualmente quando ação é concluída
- [ ] Não abusar de toasts (máx. 1-2 por interação)

## 🔍 Debug

Console logs automáticos no `useAuth`:

```
✅ Login bem-sucedido via API: João Silva
⚠️ Login com fallback mock: João Silva
❌ Erro no login via API: Credenciais inválidas
```

---

**Toast System v1.0 - Forge Design System v2.4**  
_Criado em Outubro 2025_
