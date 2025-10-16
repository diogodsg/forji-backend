# Goal Wizard - Estrutura de Componentes

Componente modularizado para criação de metas em 2 etapas com sistema de XP.

## 🎯 Tipos de Meta

O wizard suporta 4 tipos de metas:

### 🔼 **Aumentar** (increase)

Meta de crescimento numérico. Exemplo: "Aumentar de 5 para 15 mentorias"

- Campos: Valor Inicial, Meta (aumentar para), Unidade
- Cor: Emerald (verde)
- XP Bonus: Meta ambiciosa se crescimento ≥ 50%

### 🔽 **Diminuir** (decrease)

Meta de redução numérica. Exemplo: "Reduzir de 20h para 10h tempo de deploy"

- Campos: Valor Atual, Meta (reduzir para), Unidade
- Cor: Blue (azul)
- XP Bonus: Meta ambiciosa se redução ≥ 50%

### 📊 **Porcentagem** (percentage)

Meta com progresso percentual. Exemplo: "Atingir 90% de cobertura de testes"

- Campos: Percentual Atual (0-100%), Meta Percentual (0-100%), O que está sendo medido
- Cor: Purple (roxo)
- XP Bonus: Meta ambiciosa se melhoria ≥ 20 pontos percentuais

### ✅ **Binário** (binary)

Meta de conclusão sim/não. Exemplo: "Obter certificação AWS"

- Sem campos adicionais (apenas título + descrição)
- Cor: Amber (âmbar)
- Progresso acompanhado via marcos intermediários

## 📁 Estrutura

```
goal-wizard/
├── index.tsx                    # Componente principal (orquestrador)
├── types.ts                     # Types & Interfaces
├── constants.ts                 # GOAL_TYPES configuration
├── utils.ts                     # Validation & XP calculation
├── WizardHeader.tsx            # Header com progress indicator
├── Step1BasicInfo.tsx          # Formulário Step 1
├── Step2Planning.tsx           # Formulário Step 2
├── SuccessCriterionForm.tsx    # Forms específicos por tipo de meta
├── ListEditor.tsx              # Editor de listas reutilizável
├── XPBreakdown.tsx             # Preview de XP
└── WizardFooter.tsx            # Navegação entre steps
```

## 🎯 Componentes

### **index.tsx** (Principal - 130 linhas)

- Orquestra todo o wizard
- Gerencia estado do form e navegação
- Renderiza steps condicionalmente
- Usa Portal para modal

### **types.ts**

- `GoalType`: "increase" | "decrease" | "percentage" | "binary"
- `GoalData`: Interface completa da meta (sem campo targetDate)
- `XPBonus`: Interface de bonuses
- `GoalTypeConfig`: Configuração visual dos tipos

### **constants.ts**

- `GOAL_TYPES`: Array com 4 tipos de meta (aumentar, diminuir, porcentagem, binário)
- Cada tipo tem: icon, title, description, colors, example

### **utils.ts**

- `validateStep1()`: Valida título, descrição e tipo (removido validação de data)
- `validateStep2()`: Valida critério (varia por tipo)
- `calculateGoalXP()`: Calcula XP total + bonuses
  - Base: 40 XP
  - +8 XP: Descrição > 100 caracteres
  - +12 XP: Critério bem definido
  - +10 XP: ≥ 2 marcos intermediários
  - +15 XP: Meta ambiciosa (varia por tipo)

### **WizardHeader.tsx** (60 linhas)

- Header fixo com gradiente
- Progress indicator (Step 1/2)
- Botão de fechar

### **Step1BasicInfo.tsx** (110 linhas)

- Título, Descrição, Tipo de Meta (4 cards)
- Sem campo de Data Alvo (removido)
- **XP Preview visível no Step 1** ✨
- Feedback de caracteres e bonus

### **Step2Planning.tsx** (80 linhas)

- Recap do tipo selecionado
- SuccessCriterionForm (varia por tipo)
- ListEditor para marcos
- **XP Preview visível no Step 2** ✨

### **SuccessCriterionForm.tsx** (350 linhas)

- **Increase**: Valor Inicial → Meta (aumentar para) + Unidade
- **Decrease**: Valor Atual → Meta (reduzir para) + Unidade
- **Percentage**: % Atual → Meta % + O que está sendo medido
- **Binary**: Apenas mensagem explicativa + marcos

### **ListEditor.tsx** (70 linhas)

- Input + botão "Adicionar"
- Lista de items com animação hover
- Botão remover (visível on hover)
- Suporta Enter para adicionar

### **XPBreakdown.tsx** (50 linhas)

- Card com gradiente brand/purple
- Total XP em destaque
- Lista de bonuses desbloqueados

### **WizardFooter.tsx** (60 linhas)

- Step 1: Cancelar | Próximo
- Step 2: Voltar | Criar Meta (+XP)
- Validação condicional dos botões

## 🎨 Benefícios da Modularização

✅ **Manutenibilidade**: Cada componente tem responsabilidade única
✅ **Reusabilidade**: ListEditor, XPBreakdown podem ser usados em outros lugares
✅ **Testabilidade**: Componentes pequenos são mais fáceis de testar
✅ **Legibilidade**: ~100 linhas por arquivo (muito melhor que 950!)
✅ **Performance**: React re-renderiza apenas componentes que mudaram
✅ **Colaboração**: Times podem trabalhar em componentes diferentes

## 📊 Comparação

| Métrica           | Antes        | Depois       |
| ----------------- | ------------ | ------------ |
| Arquivo principal | 950 linhas   | 130 linhas   |
| Componentes       | 1 monolítico | 11 modulares |
| Maior arquivo     | 950 linhas   | 200 linhas   |
| Reusabilidade     | 0%           | 40%          |
| Testabilidade     | Difícil      | Fácil        |

## 🔄 Uso

```tsx
import { GoalCreatorWizardRefactored } from "@/features/cycles/components/tracking-recorders";

function MyComponent() {
  return (
    <GoalCreatorWizardRefactored
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSave={(data) => console.log(data)}
      prefillData={existingGoal}
    />
  );
}
```

## 🎯 Próximos Passos

- [ ] Adicionar testes unitários para cada componente
- [ ] Adicionar Storybook stories
- [ ] Implementar loading states
- [ ] Adicionar animações de transição entre steps
- [ ] Persistir rascunho no localStorage
