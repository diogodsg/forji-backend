# Sistema de Atualização de Competências

## Visão Geral

Sistema completo para atualizar o progresso de competências com interface personalizada por categoria (Liderança, Técnico, Comportamental).

## Arquitetura

### Componentes

```
competence-update-recorder/
├── types.ts                      # Interfaces TypeScript
├── utils.ts                      # Lógica de XP e validação
├── CompetenceUpdateForm.tsx      # Formulário principal
└── index.tsx                     # Modal wrapper (CompetenceUpdateRecorder)
```

## Interfaces TypeScript

### CompetenceUpdateData

```typescript
{
  competenceId: string;
  competenceName: string;
  category: "leadership" | "technical" | "behavioral";
  currentLevel: number;
  targetLevel: number;
  currentProgress: number;
  newProgress: number;
  milestone: string;
}
```

### CompetenceData

```typescript
{
  id: string;
  name: string;
  category: "leadership" | "technical" | "behavioral";
  currentLevel: number;
  targetLevel: number;
  currentProgress: number;
  nextMilestone: string;
}
```

## Categorias de Competência

### 1. Leadership (Liderança)

- **Ícone**: `Crown` (Coroa)
- **Cores**: Amber/Yellow
  - Fundo: `bg-amber-50`
  - Borda: `border-amber-200`
  - Texto: `text-amber-600`
  - Gradiente: `from-amber-500 to-amber-600`
- **Exemplos**: Gestão de Times, Tomada de Decisão, Influência

### 2. Technical (Técnico)

- **Ícone**: `Code` (Código)
- **Cores**: Blue
  - Fundo: `bg-blue-50`
  - Borda: `border-blue-200`
  - Texto: `text-blue-600`
  - Gradiente: `from-blue-500 to-blue-600`
- **Exemplos**: Arquitetura de Software, DevOps, Clean Code

### 3. Behavioral (Comportamental)

- **Ícone**: `Users` (Pessoas)
- **Cores**: Emerald/Green
  - Fundo: `bg-emerald-50`
  - Borda: `border-emerald-200`
  - Texto: `text-emerald-600`
  - Gradiente: `from-emerald-500 to-emerald-600`
- **Exemplos**: Comunicação, Colaboração, Empatia

## Sistema de XP

### Bônus Disponíveis

| Bônus                       | Condição       | XP        | Descrição                      |
| --------------------------- | -------------- | --------- | ------------------------------ |
| **Update de competência**   | Sempre         | +20 XP    | Base para qualquer atualização |
| **Progresso significativo** | ≥15% de avanço | +15 XP    | Avanço considerável            |
| **Nível alcançado!**        | Atingir 100%   | +40 XP    | Completar nível da competência |
| **TOTAL MÁXIMO**            |                | **75 XP** |                                |

### Cálculo de Bônus

```typescript
export function calculateBonuses(data: CompetenceUpdateData): XPBonus[] {
  const bonuses: XPBonus[] = [];

  // 1. Base XP (sempre)
  bonuses.push({
    label: "Update de competência",
    value: 20,
  });

  // 2. Progresso significativo (≥15%)
  const progressIncrease = data.newProgress - data.currentProgress;
  if (progressIncrease >= 15) {
    bonuses.push({
      label: "Progresso significativo",
      value: 15,
    });
  }

  // 3. Nível alcançado (100%)
  if (data.newProgress === 100 && data.currentProgress < 100) {
    bonuses.push({
      label: "Nível alcançado!",
      value: 40,
    });
  }

  return bonuses;
}
```

## Validação

```typescript
export function isFormValid(data: CompetenceUpdateData): boolean {
  return (
    data.newProgress >= 0 &&
    data.newProgress <= 100 &&
    data.newProgress >= data.currentProgress &&
    data.milestone.trim() !== ""
  );
}
```

**Requisitos:**

- ✅ Progresso entre 0-100%
- ✅ Novo progresso ≥ progresso atual
- ✅ Marco/objetivo preenchido

## Interface do Usuário

### Layout (1100x680px)

```
┌─────────────────────────────────────────────────────────┐
│ 🧠 Atualizar Competência                    [X]        │
│ Registre seu progresso e ganhe até 75 XP              │
├─────────────────────────────────┬──────────────────────┤
│ [Card da Competência]           │                      │
│ Nome: Liderança de Times        │   📊 XP BREAKDOWN    │
│ Nível: 2 → 3                    │                      │
│ Progresso: 60%                  │   +20 Update base    │
│ [LIDERANÇA Badge]               │   +15 Significativo  │
│                                  │   ────────────────   │
│ [Ícone] Novo Progresso          │   75 XP TOTAL       │
│ ┌─────────────────────────────┐ │                      │
│ │ [====75%====]               │ │                      │
│ └─────────────────────────────┘ │                      │
│ [Slider]                        │                      │
│ Mínimo: 60% | Máximo: 100%      │                      │
│                                  │                      │
│ 💡 Hint contextualizado          │                      │
│                                  │                      │
│ [Ícone] Próximo marco           │                      │
│ [Input: Liderar projeto...]     │                      │
└─────────────────────────────────┴──────────────────────┘
│ [Cancelar]              Total: 75 XP [Salvar]         │
└─────────────────────────────────────────────────────────┘
```

### Elementos da Interface

#### 1. Card de Informação

- Fundo colorido baseado na categoria
- Ícone da categoria em círculo colorido
- Badge com label da categoria
- Níveis atuais e target
- Progresso atual em %

#### 2. Slider de Progresso

- Barra visual colorida por categoria
- Slider com mínimo = progresso atual
- Indicadores de mínimo/máximo
- Contador de avanço (+X%)
- Hint contextualizado

#### 3. Alerta de Nível Alcançado

Quando newProgress === 100%:

```tsx
<div className="p-3 rounded-lg border bg-[category]-50">
  <Target /> Parabéns! Você alcançará o nível X e ganhará +40 XP bônus!
</div>
```

#### 4. Campo de Marco

- Input de texto obrigatório
- Placeholder com exemplo
- Dica explicativa

## Integração

### No CurrentCyclePageOptimized

```typescript
// 1. Import
import { CompetenceUpdateRecorder } from "../features/cycles/components/tracking-recorders/competence-update-recorder";

// 2. State
const [isCompetenceUpdateOpen, setIsCompetenceUpdateOpen] = useState(false);
const [selectedCompetenceId, setSelectedCompetenceId] = useState<string | null>(null);

// 3. Handler
const handleUpdateCompetency = (competencyId: string) => {
  setSelectedCompetenceId(competencyId);
  setIsCompetenceUpdateOpen(true);
};

// 4. Modal
{isCompetenceUpdateOpen && selectedCompetenceId && (
  <CompetenceUpdateRecorder
    isOpen={isCompetenceUpdateOpen}
    onClose={() => {
      setIsCompetenceUpdateOpen(false);
      setSelectedCompetenceId(null);
    }}
    onSave={(data) => {
      console.log("Competence update saved:", data);
      // TODO: Enviar para API
      setIsCompetenceUpdateOpen(false);
      setSelectedCompetenceId(null);
    }}
    competence={{
      id: selectedCompetenceId,
      name: competenciesData.find(c => c.id === selectedCompetenceId)?.name,
      category: competenciesData.find(c => c.id === selectedCompetenceId)?.category,
      currentLevel: ...,
      targetLevel: ...,
      currentProgress: ...,
      nextMilestone: ...,
    }}
  />
)}
```

## Personalização por Categoria

### Classes CSS Condicionais

Todas as classes CSS são geradas através de funções helpers para garantir que o Tailwind as inclua no build:

```typescript
const getBadgeClasses = () => {
  switch (data.category) {
    case "leadership":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "technical":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "behavioral":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
};
```

### Ícones Dinâmicos

```typescript
const getCategoryConfig = () => {
  switch (data.category) {
    case "leadership": return { icon: Crown, ... };
    case "technical": return { icon: Code, ... };
    case "behavioral": return { icon: Users, ... };
  }
};

const CategoryIcon = categoryConfig.icon;
<CategoryIcon className="w-5 h-5" />
```

## Exemplos de Uso

### Competência de Liderança

```typescript
{
  id: "comp-1",
  name: "Liderança de Times",
  category: "leadership",
  currentLevel: 2,
  targetLevel: 3,
  currentProgress: 60,
  nextMilestone: "Liderar refatoração completa do módulo de autenticação"
}
```

**Update 60% → 80%:**

- +20 XP (base)
- +15 XP (significativo)
- **Total: 35 XP**

**Update 80% → 100%:**

- +20 XP (base)
- +15 XP (significativo)
- +40 XP (nível alcançado)
- **Total: 75 XP**

### Competência Técnica

```typescript
{
  id: "comp-2",
  name: "Arquitetura de Software",
  category: "technical",
  currentLevel: 3,
  targetLevel: 4,
  currentProgress: 40,
  nextMilestone: "Implementar padrões de Clean Architecture"
}
```

**Update 40% → 50%:**

- +20 XP (base)
- **Total: 20 XP** (avanço < 15%)

### Competência Comportamental

```typescript
{
  id: "comp-3",
  name: "Comunicação Assertiva",
  category: "behavioral",
  currentLevel: 1,
  targetLevel: 2,
  currentProgress: 85,
  nextMilestone: "Apresentar proposta técnica para diretoria"
}
```

**Update 85% → 100%:**

- +20 XP (base)
- +15 XP (significativo)
- +40 XP (nível alcançado)
- **Total: 75 XP**

## Remoção de Emojis

### CompetenciesSection.tsx

**Antes:**

```tsx
icon: "👑"; // Leadership
icon: "💻"; // Technical
icon: "🤝"; // Behavioral
```

**Depois:**

```tsx
icon: Crown; // Leadership
icon: Code; // Technical
icon: Users; // Behavioral
```

Ícones renderizados em círculos coloridos:

```tsx
<div className="w-8 h-8 rounded-lg bg-amber-50 border-amber-200 border">
  <Crown className="w-4 h-4 text-amber-600" />
</div>
```

## Arquivos Criados

1. **types.ts** - Interfaces TypeScript
2. **utils.ts** - Lógica de XP e validação
3. **CompetenceUpdateForm.tsx** - Formulário (300 linhas)
4. **index.tsx** - Modal wrapper (130 linhas)

## Arquivos Modificados

1. **CurrentCyclePageOptimized.tsx** - Integração do modal
2. **CompetenciesSection.tsx** - Remoção de emojis, ícones Lucide

## Design System Compliance

✅ **Cores**: Paleta violet/brand + amber/blue/emerald por categoria
✅ **Ícones**: 100% Lucide React
✅ **Tipografia**: font-semibold para títulos, font-medium para labels
✅ **Espaçamento**: gap-_ e p-_ consistentes
✅ **Bordas**: rounded-lg/xl, border-surface-\*
✅ **Hover**: opacity-90, transition-all
✅ **Focus**: ring-2 ring-brand-400

## Status

✅ Componentes criados
✅ Integração completa
✅ Emojis removidos
✅ Design system respeitado
✅ TypeScript validado
✅ Sem erros de compilação
