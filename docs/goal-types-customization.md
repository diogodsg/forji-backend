# Personalização de Tipos de Metas

## Visão Geral

O sistema de atualização de metas foi personalizado para oferecer interfaces específicas para cada tipo de meta, tornando a experiência mais intuitiva e contextualizada.

## Tipos de Metas

### 1. **Increase** (Aumentar)

- **Ícone**: ArrowUp (Seta para cima)
- **Cor**: Emerald (verde)
- **Label**: "Aumentar"
- **Hint**: "Quanto mais próximo de 100%, mais você cresceu!"
- **Interface**: Slider de 0-100%
- **Exemplo**: "Aumentar número de mentorias de 5 para 15"
- **Comportamento**: Progresso de 60% significa que realizou 9 mentorias (5 + 60% de 10)

### 2. **Decrease** (Reduzir)

- **Ícone**: ArrowDown (Seta para baixo)
- **Cor**: Blue (azul)
- **Label**: "Reduzir"
- **Hint**: "Quanto mais próximo de 100%, mais você reduziu!"
- **Interface**: Slider de 0-100%
- **Exemplo**: "Reduzir bugs em produção de 20 para 10"
- **Comportamento**: Progresso de 50% significa que reduziu 5 bugs (50% de 10)

### 3. **Percentage** (Percentual)

- **Ícone**: Percent (%)
- **Cor**: Purple (roxo)
- **Label**: "Percentual"
- **Hint**: "Qual o percentual atual alcançado?"
- **Interface**: Slider de 0-100%
- **Exemplo**: "Aumentar cobertura de testes de 78% para 90%"
- **Comportamento**: Representa diretamente o valor percentual da métrica

### 4. **Binary** (Conclusão)

- **Ícone**: CheckCircle (Check circular)
- **Cor**: Amber (âmbar)
- **Label**: "Conclusão"
- **Hint**: "Marque 100% quando concluir esta meta!"
- **Interface**: **Botões Sim/Não** (não usa slider!)
- **Exemplo**: "Obter certificação AWS"
- **Comportamento**:
  - 0% = Não Concluída ❌
  - 100% = Concluída ✅
  - **Bônus especial**: Ao marcar como concluída, exibe alerta com "+50 XP bônus"

## Elementos Personalizados

### Badge de Tipo

Cada meta exibe um badge colorido com o ícone e label do tipo:

```tsx
<div className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-{color}-50 text-{color}-700 border border-{color}-200">
  <TypeIcon className="w-3 h-3" />
  {typeConfig.label}
</div>
```

### Hint Contextual

Abaixo do controle de progresso, cada tipo exibe uma dica específica:

```tsx
<div className="mt-2 p-2 bg-brand-50 rounded-lg border border-brand-200">
  <p className="text-xs text-brand-700 flex items-center gap-1">
    <TypeIcon className="w-3 h-3" />
    {typeConfig.hint}
  </p>
</div>
```

### Interface Binary Especial

Para metas binárias, substituímos o slider por botões visuais:

```tsx
{data.goalType === "binary" ? (
  <div className="grid grid-cols-2 gap-3">
    <button /* Não Concluída - 0% */>
      <div className="text-2xl">❌</div>
      <div className="font-semibold">Não Concluída</div>
      <div className="text-xs">0%</div>
    </button>
    <button /* Concluída - 100% */>
      <div className="text-2xl">✅</div>
      <div className="font-semibold">Concluída!</div>
      <div className="text-xs">100%</div>
    </button>
  </div>
) : (
  // Slider para outros tipos
)}
```

## Sistema de XP

O sistema de XP permanece o mesmo para todos os tipos:

| Bônus                   | Condição        | XP        |
| ----------------------- | --------------- | --------- |
| Base                    | Sempre          | +15 XP    |
| Descrição Detalhada     | ≥100 caracteres | +10 XP    |
| Progresso Significativo | ≥20% de avanço  | +15 XP    |
| Conclusão               | Atingir 100%    | +50 XP    |
| **Total Máximo**        |                 | **90 XP** |

## Implementação Técnica

### Interface TypeScript

```typescript
export interface GoalUpdateData {
  goalId: string;
  goalTitle: string;
  goalType?: "increase" | "decrease" | "percentage" | "binary";
  currentProgress: number;
  newProgress: number;
  description: string;
}
```

### Configuração de Tipos

```typescript
const getGoalTypeConfig = () => {
  switch (data.goalType) {
    case "increase": return { icon: ArrowUp, color: "emerald", ... };
    case "decrease": return { icon: ArrowDown, color: "blue", ... };
    case "percentage": return { icon: Percent, color: "purple", ... };
    case "binary": return { icon: CheckCircle, color: "amber", ... };
    default: return { icon: TrendingUp, color: "brand", ... };
  }
};
```

## Mocks de Exemplo

```typescript
const goalsData = [
  {
    id: "goal-1",
    title: "Aumentar número de mentorias",
    type: "increase",
    progress: 60,
    description: "Meta: 15 mentorias (atualmente: 9/15)",
  },
  {
    id: "goal-2",
    title: "Reduzir bugs em produção",
    type: "decrease",
    progress: 50,
    description: "Reduzir de 20 para 10 bugs (atualmente: 15 bugs)",
  },
  {
    id: "goal-3",
    title: "Aumentar cobertura de testes",
    type: "percentage",
    progress: 78,
    description: "Meta: 90% de cobertura",
  },
  {
    id: "goal-4",
    title: "Obter certificação AWS",
    type: "binary",
    progress: 0,
    description: "Certificação AWS Solutions Architect",
  },
];
```

## UX Guidelines

1. **Increase/Decrease**: Use quando há um valor numérico a ser alterado
2. **Percentage**: Use para métricas que são naturalmente percentuais
3. **Binary**: Use apenas para metas de conclusão (sim/não, feito/não feito)

## Arquivos Modificados

- `goal-update-recorder/types.ts` - Adicionado campo `goalType`
- `goal-update-recorder/GoalUpdateForm.tsx` - Interface condicional por tipo
- `goal-update-recorder/index.tsx` - Passa tipo para o formulário
- `CurrentCyclePageOptimized.tsx` - Mocks com tipos específicos
