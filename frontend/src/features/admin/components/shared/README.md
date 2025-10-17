# Shared Components

Componentes compartilhados entre diferentes seções do admin.

## 📦 Componentes

### FormField

**Linhas**: 17

**Responsabilidade**: Campo de formulário estilizado e consistente.

**Features**:

- Label com suporte a ícones
- Validação visual
- Mensagens de erro
- Required indicator

**Props**:

```typescript
interface FormFieldProps {
  label: string;
  icon?: React.ComponentType;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}
```

**Uso**:

```tsx
import { FormField } from "@/features/admin/components/shared";
import { Mail } from "lucide-react";

<FormField label="Email" icon={Mail} error={emailError} required>
  <input type="email" value={email} />
</FormField>;
```

---

### QuickActions

**Linhas**: 184

**Responsabilidade**: Ações rápidas contextuais.

**Features**:

- Grid de botões com ícones
- Contadores dinâmicos
- Gradientes brand
- Hover effects

**Props**:

```typescript
interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick: (actionId: string) => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType;
  count?: number;
  color?: "brand" | "success" | "warning" | "error";
}
```

**Uso**:

```tsx
import { QuickActions } from "@/features/admin/components/shared";
import { UserPlus, Users, Building2 } from "lucide-react";

const actions = [
  { id: "add-user", label: "Adicionar Pessoa", icon: UserPlus },
  { id: "organize", label: "Organizar", icon: Users, count: 5 },
  { id: "teams", label: "Equipes", icon: Building2 },
];

<QuickActions actions={actions} onActionClick={handleActionClick} />;
```

---

### ActionableInsights

**Linhas**: 211

**Responsabilidade**: Cards com insights acionáveis.

**Features**:

- Destaque visual com gradientes
- Call-to-action buttons
- Ícones Lucide
- Animações de entrada

**Props**:

```typescript
interface ActionableInsightsProps {
  insights: Insight[];
  onAction: (insightId: string) => void;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  actionLabel: string;
  severity: "info" | "warning" | "success";
}
```

**Uso**:

```tsx
import { ActionableInsights } from "@/features/admin/components/shared";
import { AlertCircle, CheckCircle } from "lucide-react";

const insights = [
  {
    id: "unassigned",
    title: "5 pessoas sem gerente",
    description: "Atribua gerentes para melhorar a estrutura",
    icon: AlertCircle,
    actionLabel: "Atribuir agora",
    severity: "warning",
  },
];

<ActionableInsights insights={insights} onAction={handleInsightAction} />;
```

---

## 🎯 Quando Usar

### FormField

- ✅ Formulários complexos com validação
- ✅ Campos que precisam de ícones
- ✅ Consistência visual entre forms

### QuickActions

- ✅ Dashboards com ações principais
- ✅ Toolbars com múltiplas opções
- ✅ Navegação rápida entre seções

### ActionableInsights

- ✅ Alertas que requerem ação
- ✅ Recomendações baseadas em dados
- ✅ Onboarding guides

---

## 🎨 Design System v2.4

Todos componentes seguem:

- ✅ Cores brand (violet #7c3aed)
- ✅ Ícones Lucide React
- ✅ Spacing consistente
- ✅ Hover states
- ✅ Accessibility (ARIA)

---

**Mantido por**: Admin Team  
**Última revisão**: 16 de Outubro de 2025
