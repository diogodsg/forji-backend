# Sistema de XP - Atualização de Metas

## Simplificação do Sistema

O sistema de XP foi simplificado, removendo a necessidade de descrição textual para focar apenas no progresso objetivo.

## Bônus de XP

| Bônus                       | Condição       | XP        | Descrição                           |
| --------------------------- | -------------- | --------- | ----------------------------------- |
| **Base**                    | Sempre         | +15 XP    | Recompensa por atualizar a meta     |
| **Progresso Significativo** | ≥20% de avanço | +15 XP    | Quando o avanço é ≥20%              |
| **Conclusão**               | Atingir 100%   | +50 XP    | Bônus especial por completar a meta |
| **TOTAL MÁXIMO**            |                | **80 XP** |                                     |

## Mudanças em Relação à Versão Anterior

### ❌ Removido

- Campo de descrição "O que você conquistou?"
- Bônus de +10 XP por descrição detalhada (≥100 caracteres)
- Validação de descrição obrigatória

### ✅ Mantido

- Update base (+15 XP)
- Progresso significativo (+15 XP) - agora com threshold de 20% ao invés de 25%
- Meta concluída (+50 XP)

### 🎯 Benefícios

- **Mais rápido**: Sem necessidade de escrever texto
- **Menos fricção**: Apenas ajustar o slider
- **Foco no objetivo**: Progresso numérico é o que importa
- **Mobile-friendly**: Mais fácil de usar em dispositivos móveis

## Cálculo de Bônus

```typescript
export function calculateBonuses(data: GoalUpdateData): XPBonus[] {
  const bonuses: XPBonus[] = [];

  // 1. Base XP (sempre)
  bonuses.push({
    label: "Update de meta",
    value: 15,
  });

  // 2. Progresso significativo (≥20%)
  const progressIncrease = data.newProgress - data.currentProgress;
  if (progressIncrease >= 20) {
    bonuses.push({
      label: "Progresso significativo",
      value: 15,
    });
  }

  // 3. Conclusão da meta (100%)
  if (data.newProgress === 100 && data.currentProgress < 100) {
    bonuses.push({
      label: "Meta concluída! 🎉",
      value: 50,
    });
  }

  return bonuses;
}
```

## Validação Simplificada

```typescript
export function isFormValid(data: GoalUpdateData): boolean {
  return (
    data.newProgress >= 0 &&
    data.newProgress <= 100 &&
    data.newProgress >= data.currentProgress
  );
}
```

**Validações:**

- ✅ Progresso entre 0-100%
- ✅ Novo progresso ≥ progresso atual (não pode retroceder)
- ❌ ~~Descrição obrigatória~~ (removido)

## Exemplos de Ganho de XP

### Exemplo 1: Update Simples

```
Progresso: 60% → 70% (+10%)
XP Ganho: 15 XP (apenas base)
```

### Exemplo 2: Progresso Significativo

```
Progresso: 60% → 85% (+25%)
XP Ganho: 30 XP (base + significativo)
```

### Exemplo 3: Conclusão da Meta

```
Progresso: 80% → 100% (+20%)
XP Ganho: 80 XP (base + significativo + conclusão)
```

### Exemplo 4: Pequeno Update

```
Progresso: 90% → 95% (+5%)
XP Ganho: 15 XP (apenas base)
```

## Interface Simplificada

### Antes

```
┌─────────────────────────────────────┐
│ Novo Progresso: [====60%====]      │
│                                      │
│ O que você conquistou? *            │
│ ┌──────────────────────────────┐   │
│ │ [Textarea para descrição]    │   │
│ │                               │   │
│ │                               │   │
│ └──────────────────────────────┘   │
│ 0/100 caracteres para +10 XP        │
└─────────────────────────────────────┘
```

### Depois

```
┌─────────────────────────────────────┐
│ [Ícone] Novo Progresso              │
│ ┌──────────────────────────────┐   │
│ │ [====60%====]                │   │
│ └──────────────────────────────┘   │
│ [========slider========]            │
│ Mínimo: 50% | Máximo: 100%          │
│                                      │
│ 💡 Hint contextualizado              │
└─────────────────────────────────────┘
```

## Integração com Tipos de Meta

O sistema de XP funciona igualmente para todos os tipos de meta:

### Increase (Aumentar)

```
9 mentorias → 12 mentorias (+3, 30% de avanço)
= 30 XP (base + significativo)
```

### Decrease (Reduzir)

```
15 bugs → 12 bugs (-3, 30% de avanço)
= 30 XP (base + significativo)
```

### Percentage (Percentual)

```
78% → 90% (+12%, apenas avanço percentual)
= 15 XP (apenas base)
```

### Binary (Conclusão)

```
0% → 100% (meta concluída!)
= 80 XP (base + significativo + conclusão)
```

## Arquivo Modificado

- `goal-update-recorder/utils.ts`
  - Removida validação de descrição
  - Removido bônus de descrição detalhada
  - Ajustado threshold de progresso significativo (25% → 20%)
  - Total máximo: 90 XP → 80 XP
