# Admin Components

Sistema modular de componentes para a seção administrativa do Forji.

## 📁 Estrutura

```
components/
├── layout/              # Layout e controle de acesso
│   ├── AccessDeniedPanel.tsx
│   ├── RequireAdminRoute.tsx
│   ├── index.ts
│   └── README.md
│
├── user-management/     # Gerenciamento de usuários
│   ├── AdminSubordinatesManagement.tsx (1,032 linhas)
│   ├── EnhancedUsersToolbar.tsx
│   ├── SimplifiedUsersTable.tsx
│   ├── WorkflowPeopleTab.tsx
│   ├── ManagerDrawer.tsx
│   ├── ManagerPickerPopover.tsx
│   ├── index.ts
│   └── README.md
│
├── team-management/     # Gerenciamento de equipes
│   ├── TeamsManagement.tsx (683 linhas)
│   ├── index.ts
│   └── README.md
│
├── hierarchy/           # Hierarquia organizacional
│   ├── HierarchyModal.tsx (646 linhas)
│   ├── index.ts
│   └── README.md
│
├── modals/              # Modais genéricos
│   ├── AdminCreateRuleModal.tsx
│   ├── ChangePasswordModal.tsx
│   ├── index.ts
│   └── README.md
│
├── cards/               # Cards reutilizáveis
│   ├── ModernPersonCard.tsx
│   ├── index.ts
│   └── README.md
│
├── shared/              # Componentes compartilhados
│   ├── FormField.tsx
│   ├── QuickActions.tsx
│   ├── ActionableInsights.tsx
│   ├── index.ts
│   └── README.md
│
├── onboarding/          # Sistema de onboarding (11 arquivos)
│   ├── OnboardingModal.tsx
│   ├── useOnboardingState.ts
│   ├── types.ts
│   ├── [8 outros componentes]
│   ├── index.ts
│   ├── README.md
│   └── CHANGELOG.md
│
├── index.ts             # Barrel export principal
└── README.md            # Este arquivo
```

---

## 🎯 Organização por Domínio

### Princípios

1. **Separação por Responsabilidade**: Cada pasta tem um domínio claro
2. **Modularidade**: Componentes podem ser usados independentemente
3. **Documentação**: Cada pasta tem seu próprio README
4. **Barrel Exports**: Imports simplificados via `index.ts`

### Categorias

| Pasta              | Propósito                           | Componentes |
| ------------------ | ----------------------------------- | ----------- |
| `layout/`          | Controle de acesso e estrutura      | 2           |
| `user-management/` | Gerenciar pessoas e subordinados    | 6           |
| `team-management/` | Gerenciar equipes                   | 1           |
| `hierarchy/`       | Visualizar estrutura organizacional | 1           |
| `modals/`          | Modais genéricos                    | 2           |
| `cards/`           | Cards de exibição                   | 1           |
| `shared/`          | Utilitários compartilhados          | 3           |
| `onboarding/`      | Sistema de onboarding completo      | 11          |

---

## 📦 Como Importar

### Import Específico

```tsx
// Importar de subpasta específica
import { AdminSubordinatesManagement } from "@/features/admin/components/user-management";
import { TeamsManagement } from "@/features/admin/components/team-management";
import { OnboardingModal } from "@/features/admin/components/onboarding";
```

### Import Geral

```tsx
// Importar do barrel export principal
import {
  AdminSubordinatesManagement,
  TeamsManagement,
  OnboardingModal,
  RequireAdminRoute,
} from "@/features/admin/components";
```

---

## ⚠️ Componentes Grandes

### Candidatos a Refatoração

Três componentes excedem 600 linhas e precisam ser quebrados:

1. **AdminSubordinatesManagement** (1,032 linhas)

   - Proposta: Criar subpasta `subordinates/` com 7-8 componentes menores
   - Ver: [user-management/README.md](./user-management/README.md)

2. **HierarchyModal** (646 linhas)

   - Proposta: Criar subpasta `hierarchy-tree/` com componentes de árvore
   - Ver: [hierarchy/README.md](./hierarchy/README.md)

3. **TeamsManagement** (683 linhas)
   - Proposta: Criar subpasta `teams/` com componentes modulares
   - Ver: [team-management/README.md](./team-management/README.md)

---

## ✅ Exemplo de Boa Estrutura

### Onboarding (Sistema Modular)

O `onboarding/` é exemplo de estrutura bem organizada:

```
onboarding/
├── OnboardingModal.tsx          # Orquestrador (113 linhas)
├── useOnboardingState.ts        # Lógica separada
├── types.ts                     # Tipos centralizados
├── OnboardingHeader.tsx         # Componente pequeno
├── OnboardingFooter.tsx         # Componente pequeno
├── ProgressSteps.tsx            # Componente pequeno
├── [4 steps components]         # Componentes de steps
├── index.ts                     # Barrel export
├── README.md                    # Documentação completa
└── CHANGELOG.md                 # Histórico de mudanças
```

**Por que é bom?**

- ✅ Nenhum arquivo > 400 linhas
- ✅ Responsabilidade única por arquivo
- ✅ Lógica separada em custom hook
- ✅ Tipos centralizados
- ✅ Documentação detalhada
- ✅ Histórico de mudanças

---

## 🎨 Design System

Todos componentes seguem **Design System v2.4**:

### Cores

- Brand: `#7c3aed` (violet)
- Surface: Tons de cinza neutro
- Success: Verde
- Warning: Amarelo
- Error: Vermelho

### Ícones

- **Biblioteca**: Lucide React
- **Tamanhos**: `w-4 h-4` (padrão), `w-5 h-5` (médio), `w-6 h-6` (grande)
- **⛔ Não usamos emojis**

### Espaçamento

- Grid: 4px base (`space-1` = 4px)
- Containers: `p-6` ou `p-8`
- Gaps: `gap-4` ou `gap-6`

---

## 🔗 Dependências Externas

### Hooks (em `/hooks`)

```tsx
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";
import { useAdminTeams } from "@/features/admin/hooks/useAdminTeams";
import { useMyReports } from "@/features/admin/hooks/useMyReports";
```

### Services (em `/services`)

```tsx
import { adminApi } from "@/features/admin/services/adminApi";
import { teamsApi } from "@/features/admin/services/teamsApi";
```

### Types (em `/types`)

```tsx
import type { AdminUser, Team } from "@/features/admin/types";
```

---

## 📚 Documentação

Cada pasta tem seu próprio README com:

- 📦 Descrição dos componentes
- 🎯 Exemplos de uso
- 🔄 Propostas de refatoração (se aplicável)
- 🎨 Guidelines de design

**Leia os READMEs**:

- [layout/README.md](./layout/README.md)
- [user-management/README.md](./user-management/README.md)
- [team-management/README.md](./team-management/README.md)
- [hierarchy/README.md](./hierarchy/README.md)
- [modals/README.md](./modals/README.md)
- [cards/README.md](./cards/README.md)
- [shared/README.md](./shared/README.md)
- [onboarding/README.md](./onboarding/README.md)

---

## 🧪 Testing

### Estrutura de Testes (Futuro)

```
components/
├── layout/
│   ├── AccessDeniedPanel.tsx
│   ├── AccessDeniedPanel.test.tsx
│   └── RequireAdminRoute.test.tsx
├── user-management/
│   └── __tests__/
│       ├── AdminSubordinatesManagement.test.tsx
│       └── SimplifiedUsersTable.test.tsx
```

---

## 📊 Métricas

| Categoria       | Arquivos | Linhas    | Média   |
| --------------- | -------- | --------- | ------- |
| layout          | 2        | 30        | 15      |
| user-management | 6        | 1,877     | 313     |
| team-management | 1        | 683       | 683     |
| hierarchy       | 1        | 646       | 646     |
| modals          | 2        | 629       | 315     |
| cards           | 1        | 385       | 385     |
| shared          | 3        | 412       | 137     |
| onboarding      | 11       | 1,200     | 109     |
| **Total**       | **27**   | **5,862** | **217** |

---

## 🚀 Próximos Passos

### Curto Prazo

1. ✅ ~~Organizar em subpastas por domínio~~
2. ✅ ~~Criar barrel exports~~
3. ✅ ~~Documentar com READMEs~~
4. ⏳ Atualizar imports em páginas
5. ⏳ Adicionar testes unitários

### Médio Prazo

1. ⏳ Refatorar AdminSubordinatesManagement (1,032 linhas)
2. ⏳ Refatorar TeamsManagement (683 linhas)
3. ⏳ Refatorar HierarchyModal (646 linhas)
4. ⏳ Criar storybook para componentes

### Longo Prazo

1. ⏳ E2E tests com Playwright
2. ⏳ Performance optimization
3. ⏳ Accessibility audit
4. ⏳ Component library extraction

---

**Mantido por**: Admin Team  
**Última atualização**: 16 de Outubro de 2025  
**Versão**: 2.0.0  
**Status**: ✅ Em produção
