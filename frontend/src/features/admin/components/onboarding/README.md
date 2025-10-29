# Onboarding Components

Sistema modular de onboarding para gerenciamento de pessoas e estrutura organizacional.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Componentes](#componentes)
- [Uso](#uso)
- [Design System](#design-system)
- [Acessibilidade](#acessibilidade)

---

## 🎯 Visão Geral

O sistema de onboarding permite dois fluxos principais:

1. **Criar nova pessoa** - Formulário completo para adicionar alguém ao sistema
2. **Organizar pessoas existentes** - Atribuir gerentes e equipes a múltiplas pessoas

### Features Principais

- ✅ **Wizard de 3 steps** com progresso visual
- ✅ **Validação inline** com feedback visual
- ✅ **Portal rendering** para melhor z-index
- ✅ **ESC e click fora** para fechar
- ✅ **Design System v2.4** compliant
- ✅ **100% TypeScript** com types seguros
- ✅ **Acessibilidade ARIA** completa

---

## 🏗️ Arquitetura

```
onboarding/
├── OnboardingModal.tsx          # Componente principal + Portal
├── useOnboardingState.ts        # Hook com toda lógica de estado
├── types.ts                     # Definições de tipos
├── index.ts                     # Barrel export
│
├── OnboardingHeader.tsx         # Header com título e botão fechar
├── OnboardingFooter.tsx         # Footer com navegação entre steps
├── ProgressSteps.tsx            # Indicador visual de progresso
│
├── UserFormStep.tsx             # Step 0: Formulário de nova pessoa
├── UserSelectionStep.tsx        # Step 0: Seleção de pessoas existentes
├── StructureAssignmentStep.tsx  # Step 1: Atribuir gerente e equipe
└── ReviewStep.tsx               # Step 2: Revisão final
```

### Princípios de Design

1. **Separação de Concerns**: UI, lógica e tipos separados
2. **Single Responsibility**: Cada componente tem uma responsabilidade
3. **Composição**: OnboardingModal orquestra componentes menores
4. **Reusabilidade**: Componentes podem ser usados independentemente

---

## 📦 Componentes

### OnboardingModal

**Responsabilidade**: Componente principal que orquestra todo o fluxo.

**Props**:

```typescript
interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AdminUser[]; // Array vazio = criar nova pessoa
}
```

**Features**:

- Portal rendering para `document.body`
- ESC key listener
- Body scroll lock
- Click fora para fechar
- Animações de entrada

**Uso**:

```tsx
<OnboardingModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  users={usersToOrganize}
/>
```

---

### useOnboardingState

**Responsabilidade**: Gerenciar todo estado e lógica do wizard.

**Returns**:

```typescript
{
  currentStep: number;
  selectedUsers: number[];
  assignments: Assignments;
  newUserData: NewUserData;
  isCreatingNewUser: boolean;
  steps: OnboardingStep[];
  allManagers: AdminUser[];
  handleUserToggle: (userId: number) => void;
  handleAssignment: (userId, field, value) => void;
  updateNewUserData: (data) => void;
  nextStep: () => void;
  prevStep: () => void;
}
```

---

### OnboardingHeader

**Responsabilidade**: Header fixo com título e botão fechar.

**Props**:

```typescript
interface OnboardingHeaderProps {
  isCreatingNewUser: boolean;
  userCount: number;
  onClose: () => void;
}
```

**Features**:

- Ícone Settings em gradiente brand
- Título dinâmico baseado no fluxo
- Contador de pessoas (se aplicável)
- Botão X com aria-label

---

### ProgressSteps

**Responsabilidade**: Indicador visual de progresso.

**Props**:

```typescript
interface ProgressStepsProps {
  steps: OnboardingStep[];
  currentStep: number;
}
```

**Features**:

- Ícones Lucide React dinâmicos
- Cores baseadas em estado (current, completed, pending)
- Separadores visuais entre steps

---

### UserFormStep (Step 0 - Novo Usuário)

**Responsabilidade**: Formulário para criar nova pessoa.

**Props**:

```typescript
interface UserFormStepProps {
  userData: NewUserData;
  onUpdate: (data: Partial<NewUserData>) => void;
}
```

**Features**:

- Validação inline (nome e email)
- Labels com ícones (UserIcon, Mail, Briefcase, Shield)
- Campos obrigatórios marcados com `*`
- Checkbox estilizado para admin
- Mensagens de erro contextuais

**Validação**:

```typescript
isNameValid = userData.name.trim() !== "";
isEmailValid = userData.email.trim() !== "" && userData.email.includes("@");
```

---

### UserSelectionStep (Step 0 - Usuários Existentes)

**Responsabilidade**: Seleção múltipla de pessoas.

**Props**:

```typescript
interface UserSelectionStepProps {
  users: AdminUser[];
  selectedUsers: number[];
  onToggleUser: (userId: number) => void;
}
```

**Features**:

- Contador de seleção destacado
- Cards com avatar e ícones
- Visual diferenciado para selecionados
- Empty state quando lista vazia
- Scroll independente (max 320px)

---

### StructureAssignmentStep (Step 1)

**Responsabilidade**: Atribuir gerente e equipe.

**Props**:

```typescript
interface StructureAssignmentStepProps {
  isCreatingNewUser: boolean;
  newUserData?: NewUserData;
  selectedUsers: number[];
  users: AdminUser[];
  allManagers: AdminUser[];
  assignments: Assignments;
  onAssignment: (userId, field, value) => void;
}
```

**Features**:

- Cards com avatar e gradiente
- Selects para gerente e equipe
- Warning quando não há gerentes
- Labels com ícones (Users, Building2)
- Campos opcionais marcados

---

### ReviewStep (Step 2)

**Responsabilidade**: Revisão final antes de confirmar.

**Props**:

```typescript
interface ReviewStepProps {
  isCreatingNewUser: boolean;
  newUserData?: NewUserData;
  selectedUsers: number[];
  users: AdminUser[];
  allManagers: AdminUser[];
  assignments: Assignments;
}
```

**Features**:

- Cards com avatar e badge de status
- Grid de detalhes com ícones
- Info organizada em cards pequenos
- Visual claro de "Não definido"
- Badge de sucesso (Check icon)

---

### OnboardingFooter

**Responsabilidade**: Navegação entre steps.

**Props**:

```typescript
interface OnboardingFooterProps {
  currentStep: number;
  steps: OnboardingStep[];
  isCreatingNewUser: boolean;
  onBack: () => void;
  onNext: () => void;
  onConfirm: () => void;
  onClose: () => void;
}
```

**Features**:

- Botão voltar/cancelar (adapta ao step)
- Botão continuar (disabled até step completo)
- Botão confirmar final com ícones (Sparkles/Rocket)
- Gradientes diferenciados (brand/success)

---

## 🎨 Design System

### Cores

| Token       | Uso                                 |
| ----------- | ----------------------------------- |
| `brand-*`   | Primary actions, ícones, highlights |
| `success-*` | Confirmações, completed states      |
| `warning-*` | Avisos, estados opcionais           |
| `error-*`   | Validação, campos obrigatórios      |
| `surface-*` | Backgrounds, borders, dividers      |

### Ícones (Lucide React)

| Componente | Ícones Usados                                                |
| ---------- | ------------------------------------------------------------ |
| Header     | `Settings`, `X`                                              |
| Progress   | `User`, `Users`, `Building2`, `CheckCircle`                  |
| UserForm   | `User`, `Mail`, `Briefcase`, `Shield`                        |
| Selection  | `Users`, `Mail`                                              |
| Structure  | `User`, `Users`, `Building2`, `AlertCircle`                  |
| Review     | `Check`, `User`, `Users`, `Building2`, `Briefcase`, `Shield` |
| Footer     | `Sparkles`, `Rocket`                                         |

### Tamanhos

| Uso             | Classes                  |
| --------------- | ------------------------ |
| Ícones pequenos | `w-3 h-3`, `w-3.5 h-3.5` |
| Ícones padrão   | `w-4 h-4`                |
| Ícones médios   | `w-5 h-5`                |
| Ícones grandes  | `w-6 h-6`, `w-8 h-8`     |
| Avatares        | `w-10 h-10`, `w-12 h-12` |

---

## ♿ Acessibilidade

### ARIA

- ✅ `role="dialog"` no modal
- ✅ `aria-modal="true"`
- ✅ `aria-labelledby` conectado ao título
- ✅ `aria-label` em botões sem texto
- ✅ Labels semânticos em todos inputs

### Keyboard

- ✅ **ESC**: Fecha o modal
- ✅ **Tab**: Navegação entre campos
- ✅ **Enter**: Submit em inputs
- ✅ **Space**: Toggle em checkboxes

### Focus

- ✅ Ring visível: `focus:ring-2 focus:ring-brand-400`
- ✅ Outline removido: `focus:outline-none`
- ✅ Ordem lógica de tabulação

### Screen Readers

- ✅ Labels descritivos
- ✅ Mensagens de erro anunciadas
- ✅ Estados de progresso claros
- ✅ Botões com contexto

---

## 📝 Uso Avançado

### Exemplo Completo

```tsx
import { useState } from "react";
import { OnboardingModal } from "@/features/admin/components/onboarding";
import type { AdminUser } from "@/features/admin/types";

function AdminPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);

  const handleCreateNewUser = () => {
    setUsers([]); // Array vazio = criar nova pessoa
    setIsModalOpen(true);
  };

  const handleOrganizeUsers = (usersToOrganize: AdminUser[]) => {
    setUsers(usersToOrganize);
    setIsModalOpen(true);
  };

  return (
    <>
      <button onClick={handleCreateNewUser}>Adicionar Nova Pessoa</button>

      <button onClick={() => handleOrganizeUsers(unorganizedUsers)}>
        Organizar {unorganizedUsers.length} Pessoas
      </button>

      <OnboardingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
      />
    </>
  );
}
```

### Customização

Para customizar comportamentos, edite:

1. **Validação**: `UserFormStep.tsx` - Adicionar regras
2. **Steps**: `useOnboardingState.ts` - Modificar lógica de completed
3. **API Call**: `OnboardingModal.tsx` - `handleConfirm` function
4. **Opções de Equipe**: `StructureAssignmentStep.tsx` - Options do select

---

## 🧪 Testing

### Unit Tests (Sugerido)

```typescript
// UserFormStep.test.tsx
describe("UserFormStep", () => {
  it("valida email corretamente", () => {
    // Test email validation
  });

  it("marca campos obrigatórios", () => {
    // Test required indicators
  });
});
```

### Integration Tests

```typescript
// OnboardingModal.test.tsx
describe("OnboardingModal", () => {
  it("completa fluxo de criar nova pessoa", () => {
    // Test full flow
  });

  it("fecha ao pressionar ESC", () => {
    // Test keyboard handling
  });
});
```

---

## 🐛 Troubleshooting

### Modal não aparece

- ✅ Verificar `isOpen` prop
- ✅ Verificar z-index (deve ser 50)
- ✅ Verificar se há overlay cobrindo

### Portal não funciona

- ✅ Verificar se `document.body` existe (SSR)
- ✅ Considerar usar `useEffect` para mounting

### Steps não avançam

- ✅ Verificar `completed` logic em `useOnboardingState`
- ✅ Console.log o estado dos steps
- ✅ Verificar validações nos componentes

---

## 📚 Referências

- [CHANGELOG.md](./CHANGELOG.md) - Histórico de mudanças
- [Design System v2.4](/docs/design-system.md)
- [Types Definition](./types.ts)
- [State Management Hook](./useOnboardingState.ts)

---

**Versão**: 2.0.0  
**Última Atualização**: 16 de Outubro de 2025  
**Autor**: Forji Team  
**Status**: ✅ Production Ready
