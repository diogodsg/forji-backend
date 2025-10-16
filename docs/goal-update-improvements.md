# Melhorias na Atualização de Metas

## Problema Resolvido

As metas de **increase** (aumentar) e **decrease** (reduzir) estavam mostrando apenas percentuais, sem contexto sobre valores absolutos. Isso tornava difícil entender o progresso real.

## Solução Implementada

### 1. **Valores Absolutos nos Dados**

Adicionados novos campos aos mocks e interfaces:

```typescript
{
  currentValue: 9,      // Valor atual absoluto
  targetValue: 15,      // Valor alvo
  startValue: 5,        // Valor inicial
  unit: "mentorias"     // Unidade de medida
}
```

### 2. **Visualização Melhorada no Card de Informação**

#### Antes:

```
Progresso atual: 60%
```

#### Depois (para increase/decrease):

```
Atual: 9 mentorias → Meta: 15 mentorias
Progresso: 60%
```

### 3. **Barra de Progresso com Valores Absolutos**

#### Increase (Aumentar):

- Cor: Verde/Emerald
- Barra mostra: "9 mentorias" ao invés de "60%"
- Mínimo: "9 mentorias"
- Avanço: "+2 mentorias" ao invés de "+10%"
- Máximo: "15 mentorias"

#### Decrease (Reduzir):

- Cor: Azul/Blue
- Barra mostra: "15 bugs críticos"
- Mínimo: "15 bugs críticos"
- Avanço: "-3 bugs críticos"
- Máximo: "10 bugs críticos"

#### Percentage (Percentual):

- Cor: Roxo/Purple
- Mantém visualização em %
- Barra mostra: "78%"

#### Binary (Conclusão):

- Cor: Âmbar/Amber
- Botões Sim/Não (não usa slider)

### 4. **Hints Contextualizados**

**Increase:**

```
"Ajuste o slider para indicar quantos mentorias você já alcançou!"
```

**Decrease:**

```
"Ajuste o slider para indicar quantos bugs críticos restam!"
```

**Percentage:**

```
"Qual o percentual atual alcançado?"
```

**Binary:**

```
"Marque 100% quando concluir esta meta!"
```

### 5. **Cores por Tipo**

Cada tipo tem sua própria paleta de cores aplicada em:

- Card de informação da meta (fundo e borda)
- Ícone da meta
- Ícone do campo de progresso
- Barra de progresso
- Badge do tipo
- Texto de avanço

## Exemplo de Uso

### Meta: "Aumentar número de mentorias"

```typescript
{
  type: "increase",
  currentValue: 9,
  targetValue: 15,
  startValue: 5,
  unit: "mentorias",
  progress: 60
}
```

**Visualização:**

- Card verde claro
- "Atual: 9 mentorias → Meta: 15 mentorias"
- Slider com valores de 9 a 15
- Barra verde mostrando "9 mentorias"
- Ao ajustar para 12: "+3 mentorias"

### Meta: "Reduzir bugs em produção"

```typescript
{
  type: "decrease",
  currentValue: 15,
  targetValue: 10,
  startValue: 20,
  unit: "bugs críticos",
  progress: 50
}
```

**Visualização:**

- Card azul claro
- "Atual: 15 bugs críticos → Meta: 10 bugs críticos"
- Slider com valores de 15 a 10
- Barra azul mostrando "15 bugs críticos"
- Ao ajustar para 12: "-3 bugs críticos"

## Cálculo de Valores Absolutos

```typescript
const calculateAbsoluteValue = (progress: number) => {
  const range = targetValue - startValue;
  const value = startValue + (range * progress) / 100;
  return Math.round(value);
};
```

**Exemplo Increase:**

- Start: 5, Target: 15, Progress: 60%
- Range: 15 - 5 = 10
- Value: 5 + (10 \* 0.6) = 11 mentorias

**Exemplo Decrease:**

- Start: 20, Target: 10, Progress: 50%
- Range: 10 - 20 = -10
- Value: 20 + (-10 \* 0.5) = 15 bugs

## Arquivos Modificados

1. **types.ts** - Adicionados campos de valores absolutos
2. **GoalUpdateForm.tsx** - Lógica de exibição condicional
3. **index.tsx** - Passa valores absolutos para o form
4. **CurrentCyclePageOptimized.tsx** - Mocks com dados completos

## UX Benefits

✅ **Clareza**: Usuário vê exatamente quantas mentorias fez, não apenas %
✅ **Contexto**: Mostra valor atual, meta e unidade
✅ **Feedback**: Avanço mostrado em valores absolutos (+2 mentorias)
✅ **Consistência**: Cores e ícones específicos por tipo
✅ **Intuitivo**: Hints explicam como usar cada tipo de meta
