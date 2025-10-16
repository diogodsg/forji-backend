# 🔧 Cycle Debug Panel

Um painel de debug avançado para a funcionalidade de cycles, disponível apenas em ambiente de desenvolvimento.

## � **v1.1.0 - Refatoração e Otimização de Tamanho**

### 📦 **Arquitetura Modular**

O debug panel agora está organizado em componentes menores e mais focados:

```
/debug/
├── CycleDebugPanel.tsx     # Componente principal
├── components/
│   ├── DebugSection.tsx    # Container expansível para seções
│   ├── JsonViewer.tsx      # Visualizador JSON otimizado
│   ├── StateViewer.tsx     # Visualizador de estado do hook
│   ├── PerformanceInfo.tsx # Métricas de performance
│   ├── ComponentInfo.tsx   # Informações do ambiente
│   ├── ActionSimulator.tsx # Simulador de ações
│   └── index.ts           # Exportações centralizadas
└── README.md              # Esta documentação
```

### 🎯 **Melhorias de UX**

#### **Tamanho Otimizado**

- **Largura**: 384px → **320px** (mais compacto)
- **Altura máxima**: 70vh → **85vh** (melhor aproveitamento vertical)
- **Padding reduzido**: Espaçamentos mais eficientes
- **JSON viewers limitados**: Altura máxima controlada para evitar overflow

#### **Responsividade Aprimorada**

- **Cálculo dinâmico de posição**: Previne que o painel saia da tela
- **Redimensionamento inteligente**: Reposiciona automaticamente no resize
- **Margens de segurança**: 20px de distância das bordas da tela

#### **Interface Compacta**

- **Action buttons em grid 2x3**: Uso mais eficiente do espaço
- **Texto truncado**: UserAgent e URLs limitados para exibição
- **Scroll otimizado**: Cada seção com altura controlada

## �📋 Funcionalidades

### 🎯 **State & Data**

- **Hook State**: Estado completo do `useCurrentCycle()` (altura limitada)
- **Goals Summary**: Resumo visual de todas as metas (altura 24px)
- **Cycle Data**: Dados completos do ciclo atual em JSON (altura limitada)

### ⚡ **Performance**

- **Render Count**: Quantas vezes o componente renderizou
- **Render Times**: Tempo médio de renderização (últimos 3 renders)
- **Memory Usage**: Uso de memória JavaScript (quando disponível)

### 🛠️ **Component Info**

- **Environment**: Informações do ambiente (viewport, user agent truncado)
- **Modal State**: Estado atual dos modais
- **Timestamp**: Última atualização dos dados

### 🎮 **Action Simulator**

Botões organizados em grid 2x3 para economizar espaço:

- **🎯 Update Goal**: Simula atualização de progresso das metas
- **🔄 Complete Goal**: Marca uma meta aleatória como concluída
- **📊 Log State**: Exibe estado completo no console
- **🧹 Clear Console**: Limpa o console do browser
- **🚨 Test Error**: Testa tratamento de erros
- **📱 Viewport Info**: Mostra informações da viewport

## 🚀 Como Usar

### Acesso Rápido

1. **Botão flutuante**: Canto inferior direito da tela
2. **Clique** para abrir/fechar o painel
3. **Drag & Drop**: Arraste o painel pela barra superior

### Navegação

- **Seções Expansíveis**: Clique nos títulos para expandir/recolher
- **JSON Viewer**: Dados formatados e coloridos (altura controlada)
- **Action Buttons**: Botões em grid compacto com emojis

## 🔒 Segurança

### Ambiente de Desenvolvimento Apenas

```typescript
if (process.env.NODE_ENV === "production") {
  return null;
}
```

O componente **não é incluído** em builds de produção, garantindo que:

- ✅ Não vaza informações sensíveis
- ✅ Não impacta performance em produção
- ✅ Não adiciona tamanho ao bundle final

## 💡 Casos de Uso

### 👨‍💻 **Para Desenvolvedores**

- Debug de estado dos hooks
- Teste de interações de usuário
- Verificação de performance
- Análise de fluxo de dados

### 🧪 **Para QA/Testes**

- Simulação de cenários específicos
- Verificação de estados edge case
- Validação de comportamentos esperados
- Teste de responsividade

### 🎯 **Para Product**

- Visualização de dados em tempo real
- Compreensão do modelo de dados
- Teste de UX flows
- Análise de métricas

## 🎨 Interface

### Layout Responsivo

- **Width**: 320px (otimizado para não sair da tela)
- **Max Height**: 85vh (melhor aproveitamento vertical)
- **Position**: Fixed, draggável com limites
- **Z-index**: 60 (acima de sidebar e navbar)

### Cores & Tema

- **Header**: Fundo escuro (#1f2937)
- **Seções**: Fundo claro com bordas
- **JSON**: Terminal style (fundo escuro + texto verde, altura limitada)
- **Botões**: Grid 2x3 com azul claro e hover states

### Otimizações de Espaço

- **Padding reduzido**: p-4 → p-3 no container principal
- **Spacing compacto**: space-y-3 → space-y-2 entre seções
- **JSON altura limitada**: max-h-48, max-h-32, max-h-24 dependendo do contexto
- **Texto truncado**: UserAgent e URLs limitados para economizar espaço

## 🔧 Customização

### Adicionar Nova Seção

```typescript
<DebugSection
  title="Nova Seção"
  icon={<Icon className="w-4 h-4 text-color-600" />}
  defaultExpanded={false}
>
  <YourComponent />
</DebugSection>
```

### Adicionar Nova Ação

```typescript
const newAction = {
  name: "🎯 Sua Ação",
  action: () => {
    // Sua lógica aqui
    console.log("Debug: Ação executada");
  },
};
```

### JsonViewer com Altura Customizada

```typescript
<JsonViewer
  data={yourData}
  title="Título"
  maxHeight="max-h-16" // Customize a altura máxima
/>
```

## 📊 Métricas Coletadas

- ✅ **Render Performance**: Tempo de renderização
- ✅ **Memory Usage**: Heap JavaScript
- ✅ **User Interactions**: Simulações de ações
- ✅ **State Changes**: Mudanças de estado do ciclo
- ✅ **Component Lifecycle**: Montagem/desmontagem

## 🏗️ **Benefícios da Refatoração**

- ✅ **Tamanho Otimizado**: Painel não sai mais da tela quando expandido
- ✅ **Componentes Modulares**: Cada funcionalidade em arquivo separado
- ✅ **Manutenibilidade**: Código mais limpo e organizados
- ✅ **Reutilização**: Componentes podem ser usados independentemente
- ✅ **Performance**: Alturas limitadas evitam scroll excessivo
- ✅ **UX Melhorada**: Interface mais compacta e responsiva

## ⚠️ Limitações

- **Produção**: Não disponível (por design)
- **Performance**: Adiciona overhead mínimo em desenvolvimento
- **Memória**: Armazena histórico limitado de renders
- **Browser**: Funcionalidades específicas podem variar
- **Tamanho**: Otimizado para telas >= 1200px (funciona em menores mas pode ficar apertado)

---

> 💡 **Dica**: Use Ctrl+Shift+I para abrir DevTools e ver logs detalhados das ações simuladas!

## 🔄 **Changelog v1.1.0**

### ✨ **Novo**

- Arquitetura modular com componentes separados
- JsonViewer com altura customizável
- ActionSimulator em grid 2x3 compacto
- Cálculo inteligente de posição para não sair da tela

### 🔧 **Melhorado**

- Largura reduzida: 384px → 320px
- Altura máxima: 70vh → 85vh
- Padding otimizado em todo painel
- Texto truncado para economizar espaço
- Performance de scroll em seções individuais

### 🚫 **Removido**

- Definições inline de componentes (movidas para arquivos separados)
- Alturas excessivas em JSON viewers
- Espaçamentos desnecessários
