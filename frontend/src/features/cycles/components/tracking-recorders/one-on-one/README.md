# OneOnOneRecorder Components

## 📋 Overview

The OneOnOneRecorder is a **2-step wizard** modal for recording 1:1 meetings with team members. It follows the same architecture as the GoalWizard, providing a clean, focused user experience.

## 🎯 Design Philosophy

- **Fixed Size Modal**: 1100px × 680px for consistency
- **2-Step Flow**: Split complex form into digestible steps
- **XP Preview**: Real-time XP calculation displayed in sidebar
- **Modular Components**: Each component has a single responsibility
- **Encoding Safety**: All Portuguese special characters properly handled (é, ã, ç, õ)

## 📁 File Structure

```
one-on-one/
├── index.tsx              # Main wizard orchestrator (121 lines)
├── WizardHeader.tsx       # Header with step progress (78 lines)
├── WizardFooter.tsx       # Navigation buttons (62 lines)
├── Step1BasicInfo.tsx     # Step 1: Basic information (97 lines)
├── Step2Outcomes.tsx      # Step 2: Outcomes & next steps (110 lines)
├── ListEditor.tsx         # Reusable list input component (69 lines)
├── XPBreakdown.tsx        # XP calculation display (47 lines)
├── types.ts               # TypeScript interfaces (24 lines)
├── utils.ts               # Business logic & validation (58 lines)
└── README.md              # This file
```

**Total**: 9 files, ~666 lines (average 74 lines/file)

## 🧩 Component Breakdown

### index.tsx (Main Orchestrator)

**Purpose**: Main wizard logic with step navigation and state management

**Responsibilities**:

- Manage current step (1-2)
- Handle form data state
- Coordinate step transitions
- Calculate total XP
- Submit final data

**Key Features**:

- Portal-based modal rendering
- Fixed dimensions (1100px × 680px)
- Step validation (per-step progression)
- Async submission handling

**Props**:

```typescript
interface OneOnOneRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: OneOnOneData) => void;
  prefillData?: Partial<OneOnOneData>;
}
```

---

### WizardHeader.tsx

**Purpose**: Display wizard progress and XP preview

**Responsibilities**:

- Show current step label
- Display step progress pills
- Show total XP to be gained
- Provide close button

**Visual Structure**:

- Blue gradient background
- Step pills with completion indicators (✓)
- XP badge in header
- Navigation arrows (→) between steps

---

### WizardFooter.tsx

**Purpose**: Step navigation controls

**Responsibilities**:

- Navigate between steps
- Submit final form
- Validate before proceeding
- Show loading state

**Button States**:

- **Step 1**: "Anterior" (disabled) | "Próximo"
- **Step 2**: "Anterior" | "Concluir 1:1"

---

### Step1BasicInfo.tsx

**Purpose**: Step 1 - Collect basic meeting information

**Layout**: 2-column grid (2/3 form + 1/3 XP sidebar)

**Fields**:

1. **Participant** (text input) - Required

   - Icon: User
   - Placeholder: "Nome do participante do 1:1"

2. **Date** (date input) - Required

   - Icon: Calendar
   - Default: Today's date

3. **Working On** (list editor)

   - Icon: ListTodo
   - Color: Blue
   - Bonus: +50 XP if filled

4. **General Notes** (textarea)
   - Icon: FileText
   - Rows: 6
   - Bonus: +50 XP if >50 chars

**Validation**: Participant + Date required to proceed

---

### Step2Outcomes.tsx

**Purpose**: Step 2 - Record meeting outcomes and action items

**Layout**: 2-column grid (2/3 form + 1/3 XP sidebar)

**Fields**:

1. **Positive Points** (list editor)

   - Icon: ThumbsUp
   - Color: Emerald
   - Bonus: +50 XP if filled

2. **Improvement Points** (list editor)

   - Icon: AlertTriangle
   - Color: Amber
   - Bonus: +50 XP if filled

3. **Next Steps** (list editor)
   - Icon: ArrowRight
   - Color: Blue
   - Bonus: +50 XP if filled

**Validation**: Form must be valid (at least participant + date)

---

### ListEditor.tsx

**Purpose**: Reusable component for managing lists of items

**Responsibilities**:

- Add items to list (button or Enter key)
- Remove items from list
- Color-coded styling
- Empty state handling

**Colors**:

- `blue`: General items (workingOn, nextSteps)
- `emerald`: Positive feedback (positivePoints)
- `amber`: Improvements (improvementPoints)

**Props**:

```typescript
interface ListEditorProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
  color: "blue" | "emerald" | "amber";
}
```

---

### XPBreakdown.tsx

**Purpose**: Display XP calculation breakdown

**Responsibilities**:

- Show base XP (300 XP)
- List all active bonuses (+50 XP each)
- Calculate and display total

**Bonuses Available**:

- Working On items (+50 XP)
- Positive Points (+50 XP)
- Improvement Points (+50 XP)
- Next Steps (+50 XP)
- General Notes >50 chars (+50 XP)

**Maximum XP**: 550 XP (300 base + 250 bonus)

---

### types.ts

**Purpose**: TypeScript type definitions

**Main Types**:

```typescript
interface OneOnOneData {
  participant: string;
  date: string;
  workingOn: string[];
  generalNotes: string;
  positivePoints: string[];
  improvementPoints: string[];
  nextSteps: string[];
}

interface XPBonus {
  label: string;
  value: number;
}
```

---

### utils.ts

**Purpose**: Business logic and validation

**Functions**:

1. **`calculateBonuses(data: OneOnOneData): XPBonus[]`**

   - Returns array of active bonuses
   - Each bonus has label and XP value

2. **`isFormValid(data: OneOnOneData): boolean`**

   - Checks if participant and date are filled
   - Required for form submission

3. **`calculateCompleteness(data: OneOnOneData): number`**
   - Returns percentage (0-100) of filled fields
   - Used for progress tracking

---

## 🎨 Layout Strategy

### Fixed Modal Size

- **Width**: 1100px
- **Height**: 680px
- **Rationale**: Prevents scroll, ensures consistency, better UX

### 2-Column Grid (in each step)

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{/* Form */}</div>
  <div className="lg:col-span-1">{/* XP Sidebar */}</div>
</div>
```

### Sticky XP Sidebar

```tsx
<div className="lg:sticky lg:top-0">
  <XPBreakdown ... />
</div>
```

### Footer Outside Scroll

- Footer is fixed at bottom
- Content area scrolls independently
- Buttons always visible

---

## 🔄 User Flow

### Step 1: Informações Básicas

1. User fills participant name (required)
2. Selects date (required)
3. Optionally adds "working on" items
4. Optionally adds general notes
5. Clicks "Próximo" (enabled when participant + date filled)

### Step 2: Resultados & Próximos Passos

1. User adds positive points
2. User adds improvement points
3. User adds next steps
4. Clicks "Concluir 1:1" (enabled when form valid)
5. Data is saved and modal closes

### XP Feedback

- XP preview in header updates in real-time
- XP breakdown in sidebar shows which bonuses are active
- Encourages complete filling of form

---

## 🛠️ Technical Implementation

### State Management

```typescript
const [currentStep, setCurrentStep] = useState(1);
const [data, setData] = useState<OneOnOneData>(INITIAL_DATA);
const [isSubmitting, setIsSubmitting] = useState(false);
```

### Step Validation

```typescript
// Step 1 validation
const canProceedStep1 = data.participant.trim() !== "" && data.date !== "";

// Step 2 validation
const canProceedStep2 = isFormValid(data);
```

### XP Calculation

```typescript
const baseXP = 300;
const bonusXP =
  (data.workingOn.length > 0 ? 50 : 0) +
  (data.positivePoints.length > 0 ? 50 : 0) +
  (data.improvementPoints.length > 0 ? 50 : 0) +
  (data.nextSteps.length > 0 ? 50 : 0) +
  (data.generalNotes.length > 50 ? 50 : 0);
const totalXP = baseXP + bonusXP;
```

### Portal Rendering

```typescript
return createPortal(
  <div className="fixed inset-0 ...">
    <div style={{ width: "1100px", height: "680px" }}>
      {/* Modal content */}
    </div>
  </div>,
  document.body
);
```

---

## ✅ Encoding & Special Characters

All Portuguese characters are properly handled:

- ✓ **Informações** (ç, õ)
- ✓ **Básicas** (á)
- ✓ **Próximos** (ó)
- ✓ **Está** (á)
- ✓ **Anotações** (ç, õ)
- ✓ **Critério** (é, i)

**Navigation symbols**:

- ✓ Checkmark for completed steps
- → Arrow between steps

---

## 🎯 Design Decisions

### Why 2 Steps?

1. **Cognitive Load**: Splitting fields reduces mental overhead
2. **Progressive Disclosure**: User focuses on one context at a time
3. **Clear Separation**: Basic info vs. outcomes/actions
4. **Better UX**: Matches GoalWizard pattern (consistency)

### Why Fixed Size?

1. **No Scrolling**: All content visible without vertical scroll
2. **Predictable Layout**: Same size across all screens
3. **Better Design Control**: Exact spacing and alignment
4. **Professional Look**: More polished than dynamic sizing

### Why XP in Sidebar?

1. **Always Visible**: User sees XP without scrolling
2. **Sticky Positioning**: Stays in view as form scrolls
3. **Motivation**: Real-time feedback encourages completion
4. **Space Efficiency**: Utilizes vertical space well

---

## 🚀 Future Enhancements

Potential improvements:

- [ ] Add auto-save functionality
- [ ] Support editing existing 1:1 records
- [ ] Add meeting duration tracking
- [ ] Include action items assignment
- [ ] Add recurring 1:1 scheduling
- [ ] Export to PDF/email summary

---

## 📝 Usage Example

```typescript
import { OneOnOneRecorder } from "./one-on-one";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async (data: OneOnOneData) => {
    await api.saveOneOnOne(data);
    console.log("1:1 saved!", data);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Registrar 1:1</button>

      <OneOnOneRecorder
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        prefillData={{ participant: "João Silva" }}
      />
    </>
  );
}
```

---

## 🔍 Testing Checklist

- [ ] Step 1 validation (participant + date required)
- [ ] Step 2 validation (form must be valid)
- [ ] XP calculation accuracy (base + bonuses)
- [ ] List editor add/remove operations
- [ ] Portuguese characters rendering correctly
- [ ] Modal fixed size (1100×680)
- [ ] Navigation buttons (Previous/Next/Submit)
- [ ] Submission with loading state
- [ ] Close button functionality
- [ ] Prefill data support

---

**Last Updated**: 2025
**Architecture**: 2-Step Wizard Pattern
**Status**: ✅ Production Ready

## 🧩 Componentes

### `index.tsx` - Componente Principal

**Responsabilidade**: Orquestração e gerenciamento de estado

- Gerencia o estado do formulário
- Coordena as ações (adicionar/remover itens)
- Calcula XP total
- Renderiza o layout principal em 2 colunas

### `RecorderHeader.tsx`

**Responsabilidade**: Header do modal

- Ícone e título
- Preview de XP no canto superior direito
- Botão de fechar

### `RecorderFooter.tsx`

**Responsabilidade**: Footer com ações

- Informação de tempo estimado
- Botões Cancelar e Salvar
- Mostra XP total no botão de salvar
- Desabilita botão se form inválido

### `BasicInfoSection.tsx`

**Responsabilidade**: Coluna esquerda - Informações Básicas

**Campos**:

- Participante
- Data
- No que estava trabalhando (lista)
- Notas gerais (textarea)

### `OutcomesSection.tsx`

**Responsabilidade**: Coluna direita - Resultados

**Campos**:

- Pontos positivos (lista)
- Pontos de melhoria (lista)
- Próximos passos (lista)
- XP Breakdown (embedded)

### `ListEditor.tsx`

**Responsabilidade**: Editor de listas reutilizável

**Features**:

- Input com botão de adicionar
- Enter para adicionar item
- Lista de itens com botão de remover
- Cores customizáveis (blue, emerald, amber)

**Props**:

```typescript
{
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
  color: "blue" | "emerald" | "amber";
}
```

### `XPBreakdown.tsx`

**Responsabilidade**: Exibição do cálculo de XP

**Features**:

- Base XP (50)
- Lista de bônus dinâmicos
- Total calculado
- Visual destacado

### `utils.ts`

**Funções Utilitárias**:

- `calculateBonuses(data)` - Calcula bônus de XP
- `calculateCompleteness(data)` - Calcula % de completude
- `isFormValid(data)` - Valida se form pode ser salvo

### `types.ts`

**Tipos e Interfaces**:

- `OneOnOneData` - Estrutura de dados do 1:1
- `XPBonus` - Estrutura de bônus de XP
- `OneOnOneRecorderProps` - Props do componente principal

## 🎯 Bônus de XP

| Condição                           | Bônus  | Label                 |
| ---------------------------------- | ------ | --------------------- |
| Completude ≥ 80%                   | +10 XP | "Completude alta"     |
| 3+ próximos passos                 | +5 XP  | "3+ próximos passos"  |
| Notas ≥ 100 caracteres             | +5 XP  | "Notas detalhadas"    |
| 2+ pontos positivos E 2+ melhorias | +5 XP  | "Feedback balanceado" |

**Total possível**: 50 (base) + 25 (bônus) = **75 XP**

## ✅ Validação

Campos obrigatórios:

- ✓ Participante (não vazio)
- ✓ Data (preenchida)
- ✓ No que estava trabalhando (min 1 item)
- ✓ Notas gerais (não vazio)

## 🔄 Fluxo de Dados

```
┌──────────────────┐
│  index.tsx       │ ← Estado principal
│  (formData)      │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────────┐
│ Basic │ │ Outcomes  │
│ Info  │ │ Section   │
└───┬───┘ └──┬────────┘
    │        │
    └────┬───┘
         │
    ┌────▼────┐
    │ List    │
    │ Editor  │
    └─────────┘
```

## 📝 Uso

```typescript
import { OneOnOneRecorder } from "./one-on-one";

<OneOnOneRecorder
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSave={(data) => console.log(data)}
  prefillData={{ participant: "João" }}
/>;
```

## 🎨 Benefícios da Refatoração

1. **Separação de Responsabilidades** - Cada componente tem uma função clara
2. **Reutilização** - ListEditor e XPBreakdown são reutilizáveis
3. **Manutenibilidade** - Mais fácil encontrar e modificar código
4. **Testabilidade** - Componentes menores são mais fáceis de testar
5. **Legibilidade** - Código mais organizado e documentado
6. **Escalabilidade** - Fácil adicionar novos campos ou funcionalidades
