# Forge Design System

**Status**: Implementado — Sistema visual unificado v2.4 baseado em Violet (#7c3aed)  
**Última Atualização**: Outubro 2025

## 📋 Índice

- [Princípios](#princípios)
- [Tokens de Design](#tokens-de-design)
- [Componentes](#componentes)
- [Padrões de Layout](#padrões-de-layout)
- [Micro-interactions](#micro-interactions)
- [Acessibilidade](#acessibilidade)

---

## Princípios

1. **Clareza Primeiro**: Hierarquia visual evidente, tipografia legível, contraste adequado
2. **Leve e Performático**: Baseado em Tailwind CSS, minimal dependencies
3. **Extensível**: Tokens centralizados facilitam expansão (dark mode, temas)
4. **Acessível por Padrão**: Contraste mínimo AA, estados de foco visíveis
5. **Consistente**: Design system aplicado em toda aplicação

---

## Tokens de Design

### 🎨 Cores

**Fonte**: `tailwind.config.js` (extend.colors)

#### Brand Colors (Violet)

| Token              | Valor     | Uso                                |
| ------------------ | --------- | ---------------------------------- |
| `brand.50`         | `#f5f3ff` | Backgrounds muito suaves           |
| `brand.100`        | `#ede9fe` | Hover states, highlights           |
| `brand.200`        | `#ddd6fe` | Borders suaves                     |
| `brand.300`        | `#c4b5fd` | Hover borders                      |
| `brand.400`        | `#a78bfa` | Secondary actions                  |
| `brand.500`        | `#8b5cf6` | **Ações primárias** (gradientes)   |
| `brand.600`        | `#7c3aed` | **Cor principal** (ícones, textos) |
| `brand.700`        | `#6d28d9` | Dark variants                      |
| `brand.800`        | `#5b21b6` | Very dark variants                 |
| `brand.900`        | `#4c1d95` | Text emphasis, dark mode           |
| `brand.DEFAULT`    | `#7c3aed` | Fallback brand color               |
| `brand.foreground` | `#ffffff` | Texto sobre brand backgrounds      |

#### Surface System

| Token         | Valor     | Uso                          |
| ------------- | --------- | ---------------------------- |
| `surface.0`   | `#ffffff` | Fundo puro (cards, modais)   |
| `surface.50`  | `#fafbfc` | Elevated surfaces            |
| `surface.100` | `#f8fafc` | Fundo principal das páginas  |
| `surface.200` | `#eef2f6` | Realces suaves, hover states |
| `surface.300` | `#e2e8f0` | **Bordas padrão**, divisores |
| `surface.400` | `#cbd5e1` | Elementos inativos           |

#### Semantic Colors

| Token         | Valor     | Uso                              |
| ------------- | --------- | -------------------------------- |
| `success.50`  | `#ecfdf5` | Success backgrounds              |
| `success.200` | `#bbf7d0` | Success highlights               |
| `success.500` | `#10b981` | **Success states**, confirmações |
| `success.600` | `#059669` | Success emphasis                 |
| `warning.50`  | `#fffbeb` | Warning backgrounds              |
| `warning.200` | `#fed7aa` | Warning highlights               |
| `warning.500` | `#f59e0b` | **Warnings**, atenção            |
| `warning.600` | `#d97706` | Warning emphasis                 |
| `error.50`    | `#fef2f2` | Error backgrounds                |
| `error.200`   | `#fecaca` | Error highlights                 |
| `error.500`   | `#ef4444` | **Errors**, ações destrutivas    |
| `error.600`   | `#dc2626` | Error emphasis                   |

#### Gradientes Padrão

**Gradiente Brand Principal:**

```jsx
className = "bg-gradient-to-br from-brand-500 to-brand-600";
// ou
className = "bg-gradient-to-r from-brand-500 to-brand-600";
```

**Texto com Gradiente:**

```jsx
className =
  "bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent";
```

**Gradientes Semânticos:**

- **Success**: `from-emerald-50 to-green-50` (backgrounds) | `from-emerald-400 to-emerald-600` (botões)
- **Warning**: `from-amber-50 to-yellow-50` (backgrounds) | `from-amber-500 to-amber-600` (botões)
- **Error**: `from-rose-50 to-rose-100` (backgrounds) | `from-red-500 to-red-600` (botões)
- **Neutral**: `from-white to-surface-50` (cards) | `from-surface-50 to-surface-100` (páginas)

---

### 📝 Tipografia

**Família**: `Geist, Inter, system-ui, sans-serif`  
**Configuração**: `font-sans` (Tailwind padrão)

#### Hierarquia de Texto

| Escala             | Classes Tailwind                        | Uso                              | Peso |
| ------------------ | --------------------------------------- | -------------------------------- | ---- |
| **Display Large**  | `text-5xl font-bold tracking-tight`     | Hero sections, landing           | 700  |
| **Display Medium** | `text-4xl font-bold tracking-tight`     | Page titles                      | 700  |
| **Heading Large**  | `text-3xl font-bold tracking-tight`     | **Main headings** (páginas)      | 700  |
| **Heading Medium** | `text-2xl font-semibold tracking-tight` | Section headings                 | 600  |
| **Heading Small**  | `text-xl font-semibold`                 | Card headers, subsections        | 600  |
| **Subheading**     | `text-lg font-medium`                   | Subsections, labels              | 500  |
| **Body Large**     | `text-base font-normal`                 | Primary reading text             | 400  |
| **Body Medium**    | `text-sm font-normal`                   | **Secondary text**, descriptions | 400  |
| **Body Small**     | `text-xs font-medium`                   | **Labels**, captions, metadata   | 500  |
| **Caption**        | `text-[10px] font-medium tracking-wide` | Fine print, timestamps           | 500  |

**Dicas de Uso:**

- Usar `font-semibold` para headers de cards e sections
- `tracking-tight` em headings grandes para melhor densidade visual
- `font-medium` para labels e textos de destaque
- `uppercase tracking-wide` para labels de métricas (ex: "XP TOTAL")

---

### 📐 Espaçamento

**Base**: Grid 4px (escala Tailwind padrão)

#### Padrões de Aplicação

| Contexto               | Classes                                           |
| ---------------------- | ------------------------------------------------- |
| **Página Container**   | `px-6 py-6` (desktop)                             |
| **Card Padding**       | `p-4` (compacto) / `p-5` (padrão) / `p-6` (amplo) |
| **Section Spacing**    | `space-y-6` / `space-y-8`                         |
| **Grid Gaps**          | `gap-3` / `gap-4` / `gap-6`                       |
| **Header Spacing**     | `pb-6` (após headers)                             |
| **Border Bottom Card** | `border-b border-surface-200`                     |

**Exemplo de Estrutura:**

```jsx
<div className="container mx-auto px-6 py-6 max-w-7xl">
  <div className="space-y-6">
    <div className="bg-white rounded-xl p-5 border border-surface-300">
      {/* Conteúdo do card */}
    </div>
  </div>
</div>
```

---

### 🔲 Border Radius

| Token          | Valor     | Uso                           |
| -------------- | --------- | ----------------------------- |
| `rounded`      | `0.25rem` | Badges pequenos               |
| `rounded-lg`   | `0.5rem`  | Botões, mini-cards            |
| `rounded-xl`   | `0.75rem` | **Cards padrão** (mais comum) |
| `rounded-2xl`  | `1rem`    | Cards de destaque, sections   |
| `rounded-full` | `9999px`  | Avatares, badges circulares   |

---

### 🌟 Sombras (Shadow)

| Token         | Uso                               | Exemplo                          |
| ------------- | --------------------------------- | -------------------------------- |
| `shadow-sm`   | **Cards padrão**, elementos sutis | `.shadow-sm`                     |
| `shadow-md`   | Hover states, elementos elevados  | `.hover:shadow-md`               |
| `shadow-lg`   | Cards de destaque, dropdowns      | `.shadow-lg`                     |
| `shadow-xl`   | Modais, elementos muito elevados  | `.shadow-xl`                     |
| `shadow-soft` | Sombra suave customizada (config) | Definido no tailwind.config      |
| `shadow-glow` | Glow effect brand (config)        | `0 0 15px rgba(124,58,237,0.08)` |

---

### 🔳 Bordas

**Padrão**: `border border-surface-300`

| Contexto          | Classes                     |
| ----------------- | --------------------------- |
| **Cards Padrão**  | `border border-surface-300` |
| **Cards Ativos**  | `border border-brand-300`   |
| **Hover States**  | `hover:border-brand-300`    |
| **Success State** | `border border-emerald-200` |
| **Warning State** | `border border-amber-200`   |
| **Error State**   | `border border-rose-200`    |

---

### 🎨 Background Patterns

**Background Principal das Páginas:**

```jsx
className = "min-h-screen bg-gradient-to-br from-surface-50 to-surface-100";
```

**Background de Cards com Gradiente Sutil:**

```jsx
className = "bg-gradient-to-br from-white to-surface-50";
```

**Background de Cards Semânticos:**

```jsx
// Success
className = "bg-gradient-to-br from-emerald-50 to-green-50";

// Warning
className = "bg-gradient-to-br from-amber-50 to-yellow-50";

// Info/Brand
className = "bg-gradient-to-br from-indigo-50 to-purple-50";

// Error
className = "bg-gradient-to-br from-rose-50 to-rose-100";
```

---

## Componentes

### 🎴 Cards

#### Card Base Padrão

```jsx
<div className="bg-white rounded-xl shadow-sm border border-surface-300 p-5">
  {/* Conteúdo */}
</div>
```

#### Variações de Cards

| Tipo                | Classes                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| **Padrão**          | `bg-white rounded-xl border border-surface-300 shadow-sm p-5`                                   |
| **Elevated**        | `bg-white rounded-2xl border border-surface-300 shadow-lg p-6`                                  |
| **Com Gradiente**   | `bg-gradient-to-br from-white to-surface-50 rounded-xl border border-surface-200 shadow-sm p-5` |
| **Interactive**     | `hover:shadow-lg hover:border-brand-300 transition-all duration-300`                            |
| **Glassmorphism**   | `bg-white/80 backdrop-blur-sm rounded-xl border border-white/20`                                |
| **Brand Highlight** | `bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl text-white p-4`                       |

#### Card com Header

```jsx
<div className="bg-white rounded-2xl shadow-sm border border-surface-300">
  <div className="p-5 border-b border-surface-200">
    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
      <FiAward className="w-5 h-5 text-brand-600" />
      Título do Card
    </h2>
    <p className="text-gray-600 text-sm mt-1">
      Descrição ou informação adicional
    </p>
  </div>
  <div className="p-5">{/* Conteúdo principal */}</div>
</div>
```

#### Card de Métrica (Stat Card)

```jsx
<div className="bg-white/80 rounded-lg p-3 text-center">
  <div className="text-xl font-bold text-brand-600">{value}</div>
  <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
    {label}
  </div>
</div>
```

---

### 🔘 Botões

#### Botão Primário (Brand)

```jsx
<button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-10 px-4 rounded-lg transition-all duration-200 hover:opacity-90 focus:ring-2 focus:ring-brand-400 focus:outline-none disabled:opacity-60">
  <FiPlus className="w-4 h-4" />
  Botão Primário
</button>
```

#### Botão Secundário

```jsx
<button className="inline-flex items-center justify-center gap-2 border border-surface-300 bg-white text-gray-700 font-medium text-sm h-10 px-4 rounded-lg transition-all duration-200 hover:bg-surface-100 focus:ring-2 focus:ring-brand-400 focus:outline-none">
  Botão Secundário
</button>
```

#### Botão Ghost

```jsx
<button className="inline-flex items-center justify-center gap-2 text-brand-600 font-medium text-sm h-10 px-4 rounded-lg transition-all duration-200 hover:bg-brand-50 focus:ring-2 focus:ring-brand-400 focus:outline-none">
  Botão Ghost
</button>
```

#### Botão Destrutivo

```jsx
<button className="inline-flex items-center justify-center gap-2 bg-error-500 text-white font-medium text-sm h-10 px-4 rounded-lg transition-all duration-200 hover:bg-error-600 focus:ring-2 focus:ring-error-400 focus:outline-none">
  Excluir
</button>
```

---

### 📝 Inputs

#### Input Padrão

```jsx
<input
  type="text"
  className="w-full px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-sm transition-all duration-200"
  placeholder="Digite aqui..."
/>
```

#### Textarea

```jsx
<textarea
  className="w-full px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-sm transition-all duration-200 resize-none"
  rows={4}
  placeholder="Digite aqui..."
/>
```

#### Select

```jsx
<select className="w-full px-3 py-2 rounded-lg border border-surface-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-sm transition-all duration-200">
  <option>Opção 1</option>
  <option>Opção 2</option>
</select>
```

---

### 🏷️ Badges

#### Badge Padrão (Brand)

```jsx
<span className="inline-flex items-center gap-1 bg-gradient-to-r from-brand-500 to-brand-600 px-2.5 py-1 rounded-lg text-xs font-medium text-white shadow-sm">
  <FiAward className="w-3 h-3" />
  Badge Text
</span>
```

#### Badge com Background Suave

```jsx
<span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-brand-200">
  Badge Text
</span>
```

#### Badge de Status

```jsx
// Success
<span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-xs font-medium">
  <FiCheck className="w-3 h-3" />
  Ativo
</span>

// Warning
<span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-medium">
  <FiAlertTriangle className="w-3 h-3" />
  Atenção
</span>
```

#### Badge de Contador

```jsx
<span className="inline-flex items-center justify-center w-5 h-5 bg-brand-600 text-white text-xs font-bold rounded-full">
  3
</span>
```

---

### 👤 Avatares

#### Avatar com Gradiente Brand

```jsx
<div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
  JS
</div>
```

#### Tamanhos de Avatar

| Tamanho     | Classes               | Uso                |
| ----------- | --------------------- | ------------------ |
| **Micro**   | `w-6 h-6 text-xs`     | Inline, mini-cards |
| **Small**   | `w-7 h-7 text-xs`     | Listas, tabelas    |
| **Default** | `w-10 h-10 text-sm`   | **Cards padrão**   |
| **Medium**  | `w-12 h-12 text-base` | Headers, perfil    |
| **Large**   | `w-16 h-16 text-xl`   | Perfil principal   |

#### Avatar com Status Indicator

```jsx
<div className="relative">
  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
    JS
  </div>
  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
</div>
```

---

### 🏆 Elementos de Gamificação

#### Rank Badge

```jsx
// 1º Lugar - Ouro
<div className="w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-lg text-yellow-600 bg-yellow-50 border-yellow-200">
  <FiAward className="w-6 h-6 text-yellow-500" />
</div>

// 2º Lugar - Prata
<div className="w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-lg text-gray-600 bg-gray-50 border-gray-200">
  <FiAward className="w-6 h-6 text-gray-400" />
</div>

// 3º Lugar - Bronze
<div className="w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-lg text-amber-700 bg-amber-50 border-amber-200">
  <FiAward className="w-6 h-6 text-amber-600" />
</div>

// Outros
<div className="w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-lg text-gray-600 bg-gray-50 border-gray-200">
  #4
</div>
```

#### Progress Bar

```jsx
<div className="w-full bg-surface-200 rounded-full h-2 overflow-hidden">
  <div
    className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
    style={{ width: `${percentage}%` }}
  />
</div>
```

#### Streak Badge

```jsx
<div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
  <FiZap className="w-3 h-3" />
  <span className="text-xs font-medium">4 semanas crescendo!</span>
</div>
```

---

### 🎯 Ícones

**Biblioteca**: **Lucide React** (`lucide-react`)  
**Migração**: Remover `react-icons/fi` em favor de Lucide React

#### Tamanhos Padronizados

| Tamanho     | Classes   | Uso                       |
| ----------- | --------- | ------------------------- |
| **Micro**   | `w-3 h-3` | Badges, status indicators |
| **Small**   | `w-4 h-4` | Botões, inputs, navegação |
| **Default** | `w-5 h-5` | **Headers**, cards        |
| **Medium**  | `w-6 h-6` | Ícones de destaque        |
| **Large**   | `w-8 h-8` | Hero sections             |

#### Cores de Ícones

| Estado       | Classes            | Uso                    |
| ------------ | ------------------ | ---------------------- |
| **Inactive** | `text-gray-400`    | Disabled, secondary    |
| **Default**  | `text-gray-600`    | Normal state           |
| **Active**   | `text-brand-600`   | Selected, current      |
| **On Brand** | `text-white`       | Over brand backgrounds |
| **Success**  | `text-success-600` | Positive actions       |
| **Warning**  | `text-warning-600` | Caution states         |
| **Error**    | `text-error-600`   | Destructive actions    |

#### Ícone em Header de Card

```jsx
<div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
  <FiUsers className="w-6 h-6 text-white" />
</div>
```

---

### 📊 Componentes de Dados

#### Metric Card (Grid de Métricas)

```jsx
<div className="grid grid-cols-3 md:grid-cols-6 gap-4">
  <div className="text-center">
    <div className="text-xl font-bold text-brand-600">42</div>
    <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
      Pessoas
    </div>
  </div>
  <div className="text-center">
    <div className="text-xl font-bold text-emerald-600">+18%</div>
    <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
      Crescimento
    </div>
  </div>
</div>
```

#### Team Card (Leaderboard)

```jsx
<div className="group bg-gradient-to-br from-white to-surface-50 rounded-xl p-5 border border-surface-200 hover:border-brand-300 hover:shadow-lg transition-all duration-300">
  <div className="flex items-start justify-between mb-5">
    <div className="flex items-start gap-3">
      {/* Rank Icon */}
      <div className="w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-lg text-yellow-600 bg-yellow-50 border-yellow-200">
        <FiAward className="w-6 h-6 text-yellow-500" />
      </div>

      {/* Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-brand-600 transition-colors mb-1">
          Nome da Equipe
        </h3>
        <p className="text-sm text-gray-600">Liderado por João • 7 membros</p>
      </div>
    </div>

    {/* Total XP */}
    <div className="text-right">
      <div className="text-xl font-bold text-gray-800">3,240</div>
      <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
        XP Total
      </div>
    </div>
  </div>

  {/* Métricas */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <div className="bg-white/80 rounded-lg p-3 text-center">
      <div className="text-base font-bold text-gray-800">463</div>
      <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
        Média/Membro
      </div>
    </div>
  </div>
</div>
```

#### Empty State

```jsx
<div className="bg-white rounded-xl border border-surface-300 p-12 text-center">
  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
    <FiInbox className="w-8 h-8 text-gray-400" />
  </div>
  <p className="text-gray-500 mb-4">Nenhum dado disponível</p>
  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm h-10 px-4 rounded-lg">
    <FiPlus className="w-4 h-4" />
    Adicionar Novo
  </button>
</div>
```

---

## Padrões de Layout

### 📄 Page Layout

**Estrutura Padrão:**

```jsx
<div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
  <div className="container mx-auto px-6 py-6 max-w-7xl">
    {/* Hero Header */}
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
          <FiIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            Título da Página
          </h1>
          <p className="text-brand-600 font-medium text-sm">Subtítulo</p>
        </div>
      </div>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
        Descrição da página
      </p>
    </div>

    {/* Conteúdo */}
    <div className="space-y-6">{/* Cards e componentes */}</div>
  </div>
</div>
```

### 🏗️ Grid Layouts

#### Grid 2 Colunas (Responsive)

```jsx
<div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
  <div className="xl:col-span-3">{/* Conteúdo principal */}</div>
  <div className="space-y-4">{/* Sidebar */}</div>
</div>
```

#### Grid de Métricas

```jsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{/* Stat cards */}</div>
```

#### Grid de Cards

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

---

## Micro-interactions

### ✨ Hover Effects

#### Card Hover

```jsx
className =
  "hover:shadow-lg hover:border-brand-300 transition-all duration-300";
```

#### Button Hover

```jsx
className = "hover:opacity-90 transition-all duration-200";
className = "hover:bg-surface-100 transition-all duration-200";
```

#### Scale on Hover

```jsx
className = "hover:scale-[1.02] transition-transform duration-200";
className = "hover:scale-105 transition-transform duration-200";
```

### 🎯 Active States

```jsx
className = "active:scale-[0.98] transition-transform duration-150";
```

### 🔄 Loading States

#### Skeleton Loader

```jsx
<div className="animate-pulse rounded-2xl border border-surface-200/60 bg-gradient-to-r from-white to-surface-50/50 p-5 shadow-sm">
  <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
</div>
```

#### Spinner

```jsx
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
```

### 🎨 Focus States

**Padrão para Inputs e Botões:**

```jsx
className = "focus:outline-none focus:ring-2 focus:ring-brand-400";
```

**Focus com Border:**

```jsx
className =
  "focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500";
```

---

## Acessibilidade

### ♿ Diretrizes

1. **Contraste de Cores**

   - Mínimo AA (4.5:1) para textos normais
   - Brand `#7c3aed` mantém contraste adequado sobre branco
   - Usar `text-gray-600` ou mais escuro para body text

2. **Estados de Foco**

   - Sempre incluir `focus:ring-2 focus:ring-brand-400 focus:outline-none`
   - Ring visível e consistente em toda aplicação

3. **Labels e Aria**

   - Todos inputs com `<label>` explícito ou `aria-label`
   - Botões com texto descritivo ou `aria-label`

4. **Navegação por Teclado**

   - Suporte para atalhos `G + [tecla]`
   - Ordem de foco lógica (tab order)

5. **Semântica HTML**
   - Usar elementos semânticos (`<main>`, `<section>`, `<nav>`, `<header>`)
   - Hierarquia de headings correta (h1 → h2 → h3)

---

## Utilities Customizadas

### 🎨 Classes Utilitárias

#### Background Pattern Principal

```css
/* No Tailwind config ou inline */
.bg-app-pattern {
  background: radial-gradient(
    circle at 12% 18%,
    #dbe4ff 0%,
    #e5ecff 35%,
    #f1f5ff 55%,
    #f8fafc 70%
  );
}
```

#### Gradiente Brand

```css
.bg-brand-gradient {
  background: linear-gradient(to right, #8b5cf6, #7c3aed);
}
```

#### Shadow Soft (Tailwind Config)

```js
boxShadow: {
  soft: '0 1px 2px 0 rgba(0,0,0,0.04), 0 2px 6px -1px rgba(0,0,0,0.05)',
  glow: '0 0 15px rgba(124,58,237,0.08)',
}
```

---

## Checklist de Implementação

Ao criar novos componentes, validar:

- [ ] Usar tokens `brand.*` ao invés de cores hardcoded
- [ ] Aplicar `rounded-xl` ou `rounded-2xl` em cards
- [ ] Bordas com `border-surface-300` padrão
- [ ] Espaçamento com grid 4px (`p-4`, `p-5`, `p-6`, `gap-4`)
- [ ] Gradiente brand: `from-brand-500 to-brand-600`
- [ ] Ícones Lucide React com tamanhos padronizados (`w-4 h-4`, `w-5 h-5`)
- [ ] Hover effects: `hover:shadow-lg`, `hover:border-brand-300`
- [ ] Focus states: `focus:ring-2 focus:ring-brand-400`
- [ ] Transições suaves: `transition-all duration-200` ou `duration-300`
- [ ] Contraste de texto adequado (mínimo AA)
- [ ] Tipografia: `font-semibold` para headers, `font-medium` para labels

---

## Roadmap Futuro

### 🌙 Dark Mode

- Implementar tokens para modo escuro
- Variantes automáticas com `dark:` prefix
- Toggle persistente em localStorage

### 🎨 Temas por Empresa

- Sistema de customização de cores
- Substituição de `brand.*` por variáveis CSS
- Preview de temas em tempo real

### 📱 Mobile-First Enhancements

- Componentes otimizados para touch
- Bottom sheets e drawers nativos
- Gestures (swipe actions)

### ⚡ Performance

- Lazy loading de componentes pesados
- Virtualization para listas longas
- Tree-shaking otimizado de ícones

---

**Design System v2.4 - Outubro 2025**  
_Forge - Plataforma Gamificada de Gestão de Times_
