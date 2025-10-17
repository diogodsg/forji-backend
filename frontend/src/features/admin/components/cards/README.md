# Card Components

Componentes de cards reutilizáveis para exibição de dados.

## 📦 Componentes

### ModernPersonCard

**Linhas**: 385

**Responsabilidade**: Card rico com informações de pessoa.

**Features**:

- Avatar com status badge
- Detalhes hierárquicos (gerente, equipe)
- Ações contextuais (editar, remover, etc)
- Skeleton loading state
- Hover effects e animações

**Props**:

```typescript
interface ModernPersonCardProps {
  person: AdminUser;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
  isSelected?: boolean;
  isLoading?: boolean;
}
```

---

## 🎯 Uso

### Básico

```tsx
import { ModernPersonCard } from "@/features/admin/components/cards";

<ModernPersonCard
  person={user}
  onEdit={() => handleEdit(user.id)}
  onDelete={() => handleDelete(user.id)}
/>;
```

### Com Seleção

```tsx
<ModernPersonCard
  person={user}
  isSelected={selectedIds.includes(user.id)}
  onViewDetails={() => navigate(`/admin/users/${user.id}`)}
/>
```

### Loading State

```tsx
<ModernPersonCard person={user} isLoading={isUpdating} />
```

---

## 🎨 Visual

```
┌───────────────────────────────────┐
│  👤  João Silva            [...]  │
│      Desenvolvedor Senior         │
│                                   │
│  👤 Gerente: Maria Santos         │
│  👥 Equipe: Tech Team             │
│                                   │
│  [Editar]  [Ver Perfil]          │
└───────────────────────────────────┘
```

---

## 🔄 Estados

| Estado   | Comportamento                    |
| -------- | -------------------------------- |
| Normal   | Hover com elevação e borda brand |
| Selected | Borda brand-500 e fundo brand-50 |
| Loading  | Skeleton com animação pulse      |
| Empty    | Placeholder cinza                |

---

## 🎨 Design System v2.4

- ✅ Cores brand (violet)
- ✅ Ícones Lucide React
- ✅ Shadows e bordas suaves
- ✅ Animações com transition
- ✅ Responsive (mobile-first)

---

## 🔮 Variações Futuras

- `CompactPersonCard` - Versão condensada
- `PersonListItem` - Para listas densas
- `PersonAvatarGroup` - Grupo de avatares

---

**Mantido por**: Admin Team  
**Última revisão**: 16 de Outubro de 2025
