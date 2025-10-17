# Modal Components

Modais genéricos usados em diferentes contextos do admin.

## 📦 Componentes

### AdminCreateRuleModal

**Linhas**: 381

**Responsabilidade**: Modal para criar regras de gamificação/gestão.

**Features**:

- Formulário multi-step
- Validação inline
- Preview de regra
- Suporte a condições complexas

**Props**:

```typescript
interface AdminCreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rule: Rule) => void;
}
```

**Uso**:

```tsx
import { AdminCreateRuleModal } from "@/features/admin/components/modals";

<AdminCreateRuleModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleCreateRule}
/>;
```

---

### ChangePasswordModal

**Linhas**: 248

**Responsabilidade**: Modal para admin alterar senha de usuário.

**Features**:

- Geração de senha forte
- Toggle de visibilidade
- Validação de força
- Copy to clipboard

**Props**:

```typescript
interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}
```

**Uso**:

```tsx
import { ChangePasswordModal } from "@/features/admin/components/modals";

<ChangePasswordModal
  isOpen={showChangePassword}
  onClose={() => setShowChangePassword(false)}
  userId={selectedUser.id}
  userName={selectedUser.name}
/>;
```

---

## 🎨 Design System

Ambos modais seguem **Design System v2.4**:

- Portal rendering para z-index correto
- ESC e click fora para fechar
- ARIA attributes completos
- Animações suaves
- Cores brand (violet #7c3aed)

---

## 🔐 Segurança

### ChangePasswordModal

- ⚠️ Apenas admins podem usar
- ⚠️ Log de auditoria recomendado
- ✅ Senhas nunca exibidas em plain text
- ✅ Hash no backend antes de salvar

---

**Mantido por**: Admin Team  
**Última revisão**: 16 de Outubro de 2025
