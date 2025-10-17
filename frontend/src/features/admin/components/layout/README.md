# Layout Components

Componentes de layout e controle de acesso para a seção admin.

## 📦 Componentes

### AccessDeniedPanel

**Linhas**: 12

**Responsabilidade**: Tela exibida quando usuário não tem permissão de admin.

**Features**:

- Ícone de bloqueio
- Mensagem clara de negação
- Link para voltar à home
- Design System v2.4 compliant

**Props**: Nenhuma (stateless)

**Uso**:

```tsx
import { AccessDeniedPanel } from "@/features/admin/components/layout";

function AdminPage() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <AccessDeniedPanel />;
  }

  return <AdminContent />;
}
```

---

### RequireAdminRoute

**Linhas**: 18

**Responsabilidade**: HOC para proteger rotas que exigem permissão de admin.

**Features**:

- Verifica permissão automaticamente
- Redirect para AccessDeniedPanel
- Loading state durante verificação

**Props**:

```typescript
interface RequireAdminRouteProps {
  children: React.ReactNode;
}
```

**Uso**:

```tsx
import { RequireAdminRoute } from "@/features/admin/components/layout";

function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <RequireAdminRoute>
            <AdminLayout />
          </RequireAdminRoute>
        }
      />
    </Routes>
  );
}
```

---

## 🎯 Padrão de Uso

### Proteção de Rota Completa

```tsx
// src/pages/admin/AdminDashboard.tsx
import { RequireAdminRoute } from "@/features/admin/components/layout";

export function AdminDashboard() {
  return (
    <RequireAdminRoute>
      <div className="admin-dashboard">{/* Conteúdo protegido */}</div>
    </RequireAdminRoute>
  );
}
```

### Proteção Condicional

```tsx
// src/features/admin/pages/UsersPage.tsx
import { AccessDeniedPanel } from "@/features/admin/components/layout";
import { useAuth } from "@/hooks/useAuth";

export function UsersPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (!user?.isAdmin) {
    return <AccessDeniedPanel />;
  }

  return <UsersList />;
}
```

---

## 🔐 Segurança

### ⚠️ Importante

- **RequireAdminRoute** faz verificação client-side apenas
- **SEMPRE** validar permissões no backend
- Não confiar apenas em proteção de rota

### ✅ Boas Práticas

```tsx
// ❌ ERRADO - Apenas client-side
<RequireAdminRoute>
  <SensitiveData />
</RequireAdminRoute>

// ✅ CORRETO - Client + Backend
<RequireAdminRoute>
  <SensitiveData /> {/* fetch protegido por auth no backend */}
</RequireAdminRoute>
```

---

## 🎨 Design System

### AccessDeniedPanel

```
┌─────────────────────────────────┐
│                                 │
│         🔒                      │
│                                 │
│    Acesso Negado                │
│                                 │
│    Você não tem permissão       │
│    para acessar esta página.    │
│                                 │
│    [Voltar para Home]           │
│                                 │
└─────────────────────────────────┘
```

**Cores**:

- Ícone: `text-error-500`
- Título: `text-gray-900`
- Descrição: `text-gray-600`
- Botão: `bg-brand-600 hover:bg-brand-700`

---

## 🧪 Testing

```tsx
// AccessDeniedPanel.test.tsx
describe("AccessDeniedPanel", () => {
  it("exibe mensagem de acesso negado", () => {
    render(<AccessDeniedPanel />);
    expect(screen.getByText(/Acesso Negado/i)).toBeInTheDocument();
  });

  it("renderiza link para home", () => {
    render(<AccessDeniedPanel />);
    const link = screen.getByText(/Voltar para Home/i);
    expect(link).toHaveAttribute("href", "/");
  });
});
```

```tsx
// RequireAdminRoute.test.tsx
describe("RequireAdminRoute", () => {
  it("renderiza children se usuário é admin", () => {
    mockUseAuth({ isAdmin: true });
    render(
      <RequireAdminRoute>
        <div>Admin Content</div>
      </RequireAdminRoute>
    );
    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });

  it("renderiza AccessDeniedPanel se não é admin", () => {
    mockUseAuth({ isAdmin: false });
    render(
      <RequireAdminRoute>
        <div>Admin Content</div>
      </RequireAdminRoute>
    );
    expect(screen.getByText(/Acesso Negado/i)).toBeInTheDocument();
  });
});
```

---

**Mantido por**: Admin Team  
**Última revisão**: 16 de Outubro de 2025
