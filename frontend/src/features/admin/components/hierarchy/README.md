# Hierarchy Components

Componentes para visualização e gerenciamento de hierarquia organizacional.

## 📦 Componentes

### HierarchyModal

**Linhas**: 646 (⚠️ Candidato a refatoração)

**Responsabilidade**: Modal complexo para visualizar e editar hierarquia.

**Features**:

- Árvore hierárquica visual
- Expansão/colapso de nós
- Drag and drop para reorganizar
- Busca na hierarquia
- Edição inline

**Props**:

```typescript
interface HierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  rootUserId?: number;
  allUsers: AdminUser[];
}
```

**Estado Atual**: Modal monolítico com lógica complexa de árvore.

---

## 🔄 Refatoração Futura

### HierarchyModal (646 linhas)

**Proposta de quebra**:

```
hierarchy/
├── HierarchyModal.tsx (wrapper ~100 linhas)
├── HierarchyTree.tsx (componente principal)
├── HierarchyNode.tsx (nó recursivo)
├── HierarchySearch.tsx
├── HierarchyToolbar.tsx
├── NodeEditPopover.tsx
├── useHierarchyTree.ts (lógica de árvore)
├── useHierarchyDragDrop.ts (drag and drop)
├── types.ts
└── index.ts
```

**Benefícios**:

- Separação clara de responsabilidades
- HierarchyNode reutilizável e testável
- Hooks isolados para lógica complexa
- Melhor performance (memoização de nós)

---

## 🎯 Uso

```tsx
import { HierarchyModal } from "@/features/admin/components/hierarchy";

function OrgChart() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { users } = useAdminUsers();

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Ver Hierarquia</button>

      <HierarchyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allUsers={users}
      />
    </>
  );
}
```

---

## 🧩 Estrutura da Árvore

```typescript
interface HierarchyNode {
  id: number;
  name: string;
  managerId?: number;
  children: HierarchyNode[];
  isExpanded: boolean;
}
```

---

## 🎨 Visualização

```
CEO
├── CTO
│   ├── Tech Lead 1
│   │   ├── Developer 1
│   │   └── Developer 2
│   └── Tech Lead 2
└── CFO
    └── Accountant
```

---

**Mantido por**: Admin Team  
**Última revisão**: 16 de Outubro de 2025
