# Fix: CompetenciesSection TypeError - categoryConfig undefined

## ❌ Problema

```
hook.js:608 TypeError: Cannot read properties of undefined (reading 'icon')
    at CompetencyCard (CompetenciesSection.tsx:148:31)
```

## 🔍 Causa Raiz

O componente `CompetenciesSection` estava tentando acessar `config.icon`, mas `config` era `undefined` porque:

1. **Backend retorna**: `category: "TECHNICAL"` (uppercase - enum do Prisma)
2. **Componente esperava**: `category: "technical"` (lowercase)
3. **categoryConfig** só tinha chaves lowercase: `leadership`, `technical`, `behavioral`

Quando o backend retornava `TECHNICAL`, a lookup `categoryConfig[competency.category]` retornava `undefined`.

## ✅ Solução Implementada

### 1. **Expandido categoryConfig para aceitar ambos os casos** (`CompetenciesSection.tsx`)

```typescript
const categoryConfig: Record<string, {
  icon: any;
  label: string;
  color: string;
  bg: string;
  border: string;
  progressColor: string;
}> = {
  // Lowercase (mock data)
  leadership: { icon: Crown, label: "LIDERANÇA", ... },
  technical: { icon: Code, label: "TÉCNICO", ... },
  behavioral: { icon: Users, label: "COMPORTAMENTAL", ... },

  // Uppercase (backend data)
  LEADERSHIP: { icon: Crown, label: "LIDERANÇA", ... },
  TECHNICAL: { icon: Code, label: "TÉCNICO", ... },
  BEHAVIORAL: { icon: Users, label: "COMPORTAMENTAL", ... },
};

// ✅ Fallback para technical se categoria não encontrada
const config = categoryConfig[competency.category] || categoryConfig.technical;
```

### 2. **Atualizado interface Competency** (`CompetenciesSection.tsx`)

```typescript
interface Competency {
  id: string;
  name: string;
  category:
    | "leadership"
    | "technical"
    | "behavioral"
    | "LEADERSHIP"
    | "TECHNICAL"
    | "BEHAVIORAL"; // ✅ Aceita ambos
  currentLevel: number;
  targetLevel: number;
  currentProgress: number;
  nextMilestone?: string; // ✅ Opcional
  totalXP?: number; // ✅ Opcional
}
```

### 3. **Adicionado fallbacks para campos opcionais** (`CompetenciesSection.tsx`)

```typescript
// No reduce de totalXP
const totalXP = competencies.reduce((sum, comp) => sum + (comp.totalXP || 0), 0);

// No card
<span>{(competency.totalXP || 0).toLocaleString()} XP</span>

// No nextMilestone
<div className={`text-sm font-semibold ${config.color}`}>
  {competency.nextMilestone || 'A definir'}
</div>
```

### 4. **Mapeamento de dados na página** (`CurrentCyclePageOptimized.tsx`)

```typescript
// ✅ Mapear competencies do backend para formato do CompetenciesSection
const competenciesData =
  competencies.length > 0
    ? competencies.map((comp) => ({
        ...comp, // Manter todos os campos originais
        currentProgress: comp.currentProgress || 0,
        totalXP: comp.totalXP || 0,
        nextMilestone: comp.nextMilestone || "A definir",
      }))
    : mockCompetenciesData;
```

## 🎯 Benefícios

1. ✅ **Compatível com backend e mock**: Aceita UPPERCASE e lowercase
2. ✅ **Fallback robusto**: Usa `technical` se categoria desconhecida
3. ✅ **Null-safe**: Todos os campos opcionais têm fallbacks
4. ✅ **Type-safe**: Interface aceita ambos os formatos
5. ✅ **Mantém dados originais**: Não quebra outros componentes

## 🔄 Padrão Similar ao GoalsDashboard

Ambos os fixes seguem o mesmo padrão:

| Problema           | GoalsDashboard              | CompetenciesSection               |
| ------------------ | --------------------------- | --------------------------------- |
| Campo incompatível | `lastUpdate` vs `updatedAt` | `technical` vs `TECHNICAL`        |
| Solução            | Conversão string → Date     | Duplicar configs para ambos casos |
| Fallback           | 999 dias se null            | `categoryConfig.technical`        |
| Campos opcionais   | `lastUpdate?`               | `nextMilestone?`, `totalXP?`      |

## 🧪 Teste

1. Acesse a página de ciclo
2. Componente CompetenciesSection deve renderizar sem erros
3. Competências vindas do backend devem mostrar:
   - Ícone correto por categoria (Crown, Code, Users)
   - Cores corretas (amber, blue, emerald)
   - XP total (ou 0 se não houver)
   - Próximo marco (ou "A definir" se não houver)

## 📝 Possível Melhoria Futura

Normalizar todas as categorias para lowercase no mapeamento da página:

```typescript
const competenciesData =
  competencies.length > 0
    ? competencies.map((comp) => ({
        ...comp,
        category: comp.category.toLowerCase() as any, // ✅ Normalizar aqui
        currentProgress: comp.currentProgress || 0,
        totalXP: comp.totalXP || 0,
        nextMilestone: comp.nextMilestone || "A definir",
      }))
    : mockCompetenciesData;
```

Isso permitiria manter apenas as chaves lowercase no `categoryConfig`, reduzindo duplicação.
