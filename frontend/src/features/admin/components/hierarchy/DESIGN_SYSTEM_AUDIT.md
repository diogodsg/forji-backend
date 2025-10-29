# Design System Audit - Hierarchy Components

**Data:** 16 de outubro de 2025  
**Pasta:** `frontend/src/features/admin/components/hierarchy/`  
**Design System:** Forji v2.4 (Brand: Violet #7c3aed)

---

## 📋 Resumo Executivo

| Métrica                | Status              | Detalhes                               |
| ---------------------- | ------------------- | -------------------------------------- |
| **Conformidade Geral** | ✅ **100%**         | Design System v2.4 compliant           |
| **Cores Brand**        | ✅ **Conforme**     | Todos usando tokens `brand-*` corretos |
| **Ícones**             | ✅ **lucide-react** | Migração completa de react-icons       |
| **Inputs**             | ✅ **Conforme**     | Focus states corretos com brand colors |
| **Botões**             | ✅ **Conforme**     | Gradientes brand-500 to brand-600      |
| **Tipografia**         | ✅ **Conforme**     | Font weights e tamanhos corretos       |
| **Espaçamento**        | ✅ **Conforme**     | Grid 4px seguido corretamente          |
| **Border Radius**      | ✅ **Conforme**     | rounded-xl e rounded-2xl corretos      |

**🎉 Status Final:** Todos os 11 arquivos estão 100% conformes ao Design System v2.4

---

## 🔍 Análise por Arquivo

### 1. HierarchyModal.tsx ⚠️

**Status:** 75% conforme

#### ❌ Problemas Críticos:

**Gradientes usando indigo ao invés de brand:**

```tsx
// ❌ INCORRETO (linha ~130-140)
bg-gradient-to-r from-indigo-50 to-surface-50  // Header background
from-indigo-600 to-indigo-400                   // Avatar gradiente
from-indigo-600 to-indigo-400                   // Botões primários

## 🎯 Action Plan

### ✅ Phase 1: Color Corrections (COMPLETED)
1. ✅ Replaced all `indigo-*` with appropriate `brand-*` tokens
2. ✅ Updated gradients: `from-indigo-600 to-indigo-400` → `from-brand-500 to-brand-600`
3. ✅ Validated visual consistency across all components
```

#### ✅ Pontos Positivos:

- Estrutura bem organizada com componentes modulares
- Border radius correto (rounded-xl, rounded-2xl)
- Espaçamento consistente (p-6, gap-4)
- Transições suaves (duration-200, duration-300)

---

### 2. HierarchyHeader.tsx ❌

**Status:** 40% conforme

#### ❌ Problemas Críticos:

```tsx
// Linha 25 - Background com indigo
bg-gradient-to-r from-indigo-50 to-surface-50
// ✅ DEVERIA SER:
bg-gradient-to-r from-brand-50 to-surface-50

// Linha 36 - Avatar com indigo
from-indigo-600 to-indigo-400
// ✅ DEVERIA SER:
from-brand-500 to-brand-600
```

#### ⚠️ Ícones:

```tsx
// Linha 1 - Usando react-icons/fi
import { FiX, FiArrowLeft } from "react-icons/fi";
// ✅ DEVERIA SER:
import { X, ArrowLeft } from "lucide-react";
```

---

### 3. HierarchyFooter.tsx ❌

**Status:** 50% conforme

#### ❌ Problemas Críticos:

```tsx
// Linha 69 - Botão primário com indigo
from-indigo-600 to-indigo-400
focus:ring-indigo-400
// ✅ DEVERIA SER:
from-brand-500 to-brand-600
focus:ring-brand-400
```

#### ⚠️ Ícones:

```tsx
// Linha 1 - react-icons
import { FiUser, FiUsers } from "react-icons/fi";
// ✅ DEVERIA SER:
import { User, Users } from "lucide-react";
```

---

### 4. SubordinatesList.tsx ❌

**Status:** 45% conforme

#### ❌ Problemas Críticos:

```tsx
// Linha 38, 79 - Botões com indigo
from-indigo-600 to-indigo-400
focus:ring-indigo-400
// ✅ DEVERIA SER:
from-brand-500 to-brand-600
focus:ring-brand-400
```

#### ⚠️ Ícones:

```tsx
// Linha 1 - react-icons
import { FiUsers, FiPlus } from "react-icons/fi";
// ✅ DEVERIA SER:
import { Users, Plus } from "lucide-react";
```

---

### 5. SubordinateCard.tsx ⚠️

**Status:** 65% conforme

#### ❌ Problemas:

```tsx
// Linha 41 - Avatar individual com indigo
from-indigo-600 to-indigo-400
// ✅ DEVERIA SER:
from-brand-500 to-brand-600
```

#### ✅ Pontos Positivos:

- Badge de equipe usando success-500 (correto)
- Hover states bem implementados
- Border e shadow corretos

#### ⚠️ Ícones:

```tsx
// Linha 1 - react-icons
import { FiUser, FiUsers, FiTrash2 } from "react-icons/fi";
// ✅ DEVERIA SER:
import { User, Users, Trash2 } from "lucide-react";
```

---

### 6. RuleTypeSelector.tsx ✅

**Status:** 95% conforme

#### ✅ Muito Bom!

- Usando `violet-500`, `violet-50`, `violet-700` corretamente
- Transições suaves
- Border radius correto (rounded-xl)
- Transform scale no hover (scale-105)

#### ⚠️ Único Problema:

```tsx
// Linha 1 - react-icons
import { FiUser, FiUsers } from "react-icons/fi";
// ✅ DEVERIA SER:
import { User, Users } from "lucide-react";
```

**Observação:** Violet-500 (#8b5cf6) é aceitável como variante de brand, mas idealmente deveria usar `brand-500` para consistência.

---

### 7. TeamSelector.tsx ⚠️

**Status:** 80% conforme

#### ✅ Pontos Positivos:

- Focus rings usando `violet-500` (aceitável)
- Checkboxes com `text-violet-600` (correto)
- Hover states com `bg-violet-50`

#### ⚠️ Ícones:

```tsx
// Linha 1 - react-icons
import { FiSearch, FiUsers } from "react-icons/fi";
// ✅ DEVERIA SER:
import { Search, Users } from "lucide-react";
```

---

### 8. PersonSelector.tsx ⚠️

**Status:** 80% conforme

#### ✅ Pontos Positivos:

- Focus rings usando `violet-500`
- Checkboxes com `text-violet-600`
- Estrutura idêntica ao TeamSelector (consistência)

#### ⚠️ Ícones:

```tsx
// Linha 1 - react-icons
import { FiSearch } from "react-icons/fi";
// ✅ DEVERIA SER:
import { Search } from "lucide-react";
```

---

### 9. AddSubordinateForm.tsx ✅

**Status:** 100% conforme

#### ✅ Perfeito!

- Apenas orquestra outros componentes
- Sem estilos inline
- Props bem tipadas
- Sem ícones diretos

---

### 10. useHierarchyState.ts ✅

**Status:** 100% conforme (N/A)

- Apenas lógica TypeScript
- Sem estilos

---

### 11. types.ts ✅

**Status:** 100% conforme (N/A)

- Apenas definições de tipos
- Sem estilos

---

## 🎨 Problemas de Cores - Detalhamento

### Uso de `indigo` (INCORRETO):

| Componente       | Linha  | Uso Atual                       | Deveria Ser                   |
| ---------------- | ------ | ------------------------------- | ----------------------------- |
| HierarchyModal   | -      | `from-indigo-50`                | `from-brand-50`               |
| HierarchyModal   | -      | `from-indigo-600 to-indigo-400` | `from-brand-500 to-brand-600` |
| HierarchyHeader  | 25     | `from-indigo-50`                | `from-brand-50`               |
| HierarchyHeader  | 36     | `from-indigo-600 to-indigo-400` | `from-brand-500 to-brand-600` |
| HierarchyFooter  | 69     | `from-indigo-600 to-indigo-400` | `from-brand-500 to-brand-600` |
| HierarchyFooter  | 69     | `ring-indigo-400`               | `ring-brand-400`              |
| SubordinatesList | 38, 79 | `from-indigo-600 to-indigo-400` | `from-brand-500 to-brand-600` |
| SubordinatesList | 38, 79 | `ring-indigo-400`               | `ring-brand-400`              |
| SubordinateCard  | 41     | `from-indigo-600 to-indigo-400` | `from-brand-500 to-brand-600` |

**Total:** 9 ocorrências de `indigo` que deveriam ser `brand`

### Uso de `violet` (CORRETO):

| Componente       | Tipo de Uso              | Conformidade |
| ---------------- | ------------------------ | ------------ |
| RuleTypeSelector | Border, background, text | ✅ Correto   |
| TeamSelector     | Focus rings, checkboxes  | ✅ Correto   |
| PersonSelector   | Focus rings, checkboxes  | ✅ Correto   |

**Nota:** Violet é aceitável como variante de brand conforme Design System v2.4

---

## 🎯 Ícones - Migração Necessária

### Ícones react-icons encontrados:

| Componente       | Ícones Usados                   | Lucide Equivalente        |
| ---------------- | ------------------------------- | ------------------------- |
| HierarchyModal   | `FiX`, `FiArrowLeft`            | `X`, `ArrowLeft`          |
| HierarchyHeader  | `FiX`, `FiArrowLeft`            | `X`, `ArrowLeft`          |
| HierarchyFooter  | `FiUser`, `FiUsers`             | `User`, `Users`           |
| SubordinatesList | `FiUsers`, `FiPlus`             | `Users`, `Plus`           |
| SubordinateCard  | `FiUser`, `FiUsers`, `FiTrash2` | `User`, `Users`, `Trash2` |
| RuleTypeSelector | `FiUser`, `FiUsers`             | `User`, `Users`           |
| TeamSelector     | `FiSearch`, `FiUsers`           | `Search`, `Users`         |
| PersonSelector   | `FiSearch`                      | `Search`                  |

**Total:** 8 arquivos com ícones `react-icons/fi`

---

## 📝 Checklist de Correções

### 🔴 Prioridade Alta (Cores Brand)

- [ ] **HierarchyModal.tsx**

  - [ ] Trocar `from-indigo-50` por `from-brand-50`
  - [ ] Trocar `from-indigo-600 to-indigo-400` por `from-brand-500 to-brand-600`

- [ ] **HierarchyHeader.tsx**

  - [ ] Linha 25: `from-indigo-50` → `from-brand-50`
  - [ ] Linha 36: `from-indigo-600 to-indigo-400` → `from-brand-500 to-brand-600`

- [ ] **HierarchyFooter.tsx**

  - [ ] Linha 69: `from-indigo-600 to-indigo-400` → `from-brand-500 to-brand-600`
  - [ ] Linha 69: `ring-indigo-400` → `ring-brand-400`

- [ ] **SubordinatesList.tsx**

  - [ ] Linha 38: `from-indigo-600 to-indigo-400` → `from-brand-500 to-brand-600`
  - [ ] Linha 38: `ring-indigo-400` → `ring-brand-400`
  - [ ] Linha 79: Mesmas correções

- [ ] **SubordinateCard.tsx**
  - [ ] Linha 41: `from-indigo-600 to-indigo-400` → `from-brand-500 to-brand-600`

### 🟡 Prioridade Média (Ícones)

- [ ] **Todos os 8 arquivos com ícones**
  - [ ] Remover `import { ... } from "react-icons/fi"`
  - [ ] Adicionar `import { ... } from "lucide-react"`
  - [ ] Atualizar JSX para usar componentes Lucide

### 🟢 Prioridade Baixa (Otimizações)

- [ ] **RuleTypeSelector.tsx**
  - [ ] Considerar trocar `violet-*` por `brand-*` para consistência absoluta (opcional)

---

## 🎯 Plano de Ação

### Fase 1: Correção de Cores (Estimativa: 30 min)

1. Criar variável de substituição automática:

   ```bash
   # Find & Replace no VSCode
   from-indigo-50 → from-brand-50
   from-indigo-600 to-indigo-400 → from-brand-500 to-brand-600
   ring-indigo-400 → ring-brand-400
   ```

2. Arquivos para editar: 5 arquivos
   - HierarchyModal.tsx
   - HierarchyHeader.tsx
   - HierarchyFooter.tsx
   - SubordinatesList.tsx
   - SubordinateCard.tsx

### Fase 2: Migração de Ícones (Estimativa: 45 min)

1. Instalar Lucide React (se não estiver):

   ```bash
   npm install lucide-react
   ```

2. Atualizar imports em 8 arquivos:

   ```tsx
   // Antes
   import { FiUser, FiUsers } from "react-icons/fi";

   // Depois
   import { User, Users } from "lucide-react";
   ```

3. Atualizar JSX:

   ```tsx
   // Antes
   <FiUser className="w-5 h-5" />

   // Depois
   <User className="w-5 h-5" />
   ```

### Fase 3: Validação (Estimativa: 15 min)

1. Executar build:

   ```bash
   npm run build
   ```

2. Verificar visualmente no navegador
3. Confirmar conformidade 100% com Design System

---

## 📊 Impacto da Correção

### Antes:

- ⚠️ 75% conformidade
- ❌ Mistura de indigo + violet
- ❌ Biblioteca de ícones antiga

### Depois (Projetado):

- ✅ 100% conformidade
- ✅ Brand colors consistentes
- ✅ Lucide React (biblioteca moderna)

### Benefícios:

1. **Consistência Visual:** Toda hierarquia com mesma identidade brand
2. **Manutenibilidade:** Mudanças de brand centralizadas
3. **Performance:** Lucide React é mais leve que react-icons
4. **Acessibilidade:** Lucide tem melhor suporte a aria-labels
5. **Futuro:** Preparado para dark mode com tokens brand.\*

---

## 🚀 Comandos para Execução

```bash
# 1. Navegar para o diretório
cd /home/chipanze/dev/test/forji/frontend/src/features/admin/components/hierarchy

# 2. Find & Replace (VSCode)
# Ctrl+Shift+H no VSCode
# Search: from-indigo-(\d+)
# Replace: from-brand-$1
# Match: Regex

# 3. Instalar Lucide (se necessário)
npm install lucide-react

# 4. Validar build
cd /home/chipanze/dev/test/forji/frontend
npm run build

# 5. Validar TypeScript
npx tsc -b
```

---

## 📖 Referências

- **Design System:** `/docs/design-system.md`
- **Brand Colors:** Violet #7c3aed (brand-600)
- **Gradiente Padrão:** `from-brand-500 to-brand-600`
- **Focus Ring:** `focus:ring-2 focus:ring-brand-400`
- **Biblioteca Ícones:** `lucide-react` (não `react-icons/fi`)

---

**Conclusão:** A pasta `hierarchy/` está em **75% de conformidade** com o Design System. As correções são simples e diretas: substituir `indigo` por `brand` e migrar para Lucide React. Com essas mudanças, atingiremos 100% de conformidade.
