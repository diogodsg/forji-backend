# User Management Components

Componentes para gerenciamento de usuários, subordinados e workflows de pessoas.

## 📦 Componentes

### AdminSubordinatesManagement

**Linhas**: 1,032 (⚠️ Candidato a refatoração)

**Responsabilidade**: Gerenciar subordinados diretos e indiretos.

**Features**:

- Listagem de subordinados
- Filtros e busca
- Atribuição de gerentes
- Edição em massa

**Props**:

```typescript
interface AdminSubordinatesManagementProps {
  // Props principais
}
```

---

### EnhancedUsersToolbar

**Linhas**: 119

**Responsabilidade**: Barra de ferramentas com ações rápidas para usuários.

**Features**:

- Busca global
- Filtros avançados
- Ações em lote
- Export de dados

---

### SimplifiedUsersTable

**Linhas**: 230

**Responsabilidade**: Tabela otimizada de usuários.

**Features**:

- Paginação
- Ordenação
- Seleção múltipla
- Virtual scrolling

---

### WorkflowPeopleTab

**Linhas**: 181

**Responsabilidade**: Aba de workflow de pessoas (Unaware → Onboarded).

**Features**:

- Cards por status
- Drag and drop (futuro)
- Ações contextuais
- Filtros por equipe

---

### ManagerDrawer

**Linhas**: 142

**Responsabilidade**: Drawer lateral para gerenciar gerentes.

**Features**:

- Busca de gerentes
- Atribuição rápida
- Histórico de mudanças

---

### ManagerPickerPopover

**Linhas**: 151

**Responsabilidade**: Popover para seleção de gerente.

**Features**:

- Lista filtrada
- Avatar e detalhes
- Seleção única

---

## 🔄 Refatoração Futura

### AdminSubordinatesManagement (1,032 linhas)

**Proposta de quebra**:

```
subordinates/
├── AdminSubordinatesManagement.tsx (orquestrador ~200 linhas)
├── SubordinateCard.tsx
├── SubordinatesList.tsx
├── SubordinatesToolbar.tsx
├── SubordinatesFilters.tsx
├── BulkActionsBar.tsx
├── useSubordinates.ts (hook com lógica)
├── types.ts
└── index.ts
```

---

## 🎯 Uso

```tsx
import {
  AdminSubordinatesManagement,
  EnhancedUsersToolbar,
  SimplifiedUsersTable,
  WorkflowPeopleTab,
} from "@/features/admin/components/user-management";

function AdminUsersPage() {
  return (
    <>
      <EnhancedUsersToolbar />
      <WorkflowPeopleTab />
      <SimplifiedUsersTable />
    </>
  );
}
```

---

**Mantido por**: Admin Team  
**Última revisão**: 16 de Outubro de 2025
