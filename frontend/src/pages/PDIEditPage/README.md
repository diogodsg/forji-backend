# PDIEditPage - Estrutura Refatorada

Este documento descreve a nova estrutura modular da página `PDIEditPage`, que foi quebrada em componentes menores para melhorar a manutenibilidade e organização do código.

## Estrutura de Arquivos

```
frontend/src/pages/PDIEditPage/
├── index.ts                    # Arquivo de exportação principal
├── components/                 # Componentes específicos da página
│   ├── PDIEditHeader.tsx      # Header da página de edição
│   ├── PDIHeroSection.tsx     # Seção hero com dados do subordinado
│   ├── PDIContentSections.tsx # Seções principais (metas, competências, atividades)
│   └── PDIEditStates.tsx      # Estados de loading, erro e permissão
└── hooks/                     # Hooks customizados
    ├── usePDIEditData.ts      # Hook para gerenciar dados do PDI
    └── usePDIEditActions.ts   # Hook para gerenciar ações/handlers
```

## Componentes

### PDIEditHeader

**Localização:** `components/PDIEditHeader.tsx`

Header específico para a página de edição de PDI com informações do subordinado e botão de voltar.

**Props:**

- `subordinate`: Dados do subordinado
- `onBack`: Função de callback para voltar

### PDIHeroSection

**Localização:** `components/PDIHeroSection.tsx`

Seção hero melhorada com avatar, estatísticas e barra de progresso do subordinado.

**Props:**

- `subordinate`: Dados do subordinado
- `cycle`: Dados do ciclo atual
- `goals`: Array de metas

### PDIContentSections

**Localização:** `components/PDIContentSections.tsx`

Componente principal que renderiza todas as seções de conteúdo (metas, competências, atividades) e seus modais.

**Props:** Recebe todos os handlers necessários para ações de CRUD

### PDIEditStates

**Localização:** `components/PDIEditStates.tsx`

Componentes para diferentes estados da aplicação:

- `LoadingPage`: Estado de carregamento
- `PermissionDeniedPage`: Acesso negado
- `UserNotFoundPage`: Usuário não encontrado

## Hooks Customizados

### usePDIEditData

**Localização:** `hooks/usePDIEditData.ts`

Hook responsável por gerenciar todos os dados do PDI do subordinado.

**Retorna:**

- Estados de dados: `subordinate`, `cycle`, `goals`, `competencies`, `activities`
- Estados de loading: `loading`, `hasPermission`, `permissionChecked`, `error`
- Funções de refresh: `refreshGoals`, `refreshCompetencies`, `refreshActivities`

**Funcionalidades:**

- Verificação de permissões automatizada
- Carregamento paralelo de dados
- Cache e refresh seletivo

### usePDIEditActions

**Localização:** `hooks/usePDIEditActions.ts`

Hook responsável por gerenciar todas as ações e handlers da página.

**Retorna:**

- Handlers para metas: criação, edição, exclusão, atualização de progresso
- Handlers para competências: criação, visualização, atualização, exclusão
- Handlers para atividades: criação, edição, exclusão, visualização

**Funcionalidades:**

- Integração com APIs do backend
- Gerenciamento de toasts e notificações
- Refresh automático de dados após ações

## Arquivo Principal

### PDIEditPage.tsx

**Localização:** `PDIEditPage.tsx`

Arquivo principal simplificado que coordena todos os componentes e hooks.

**Responsabilidades:**

- Gerenciamento de estado dos modais
- Coordenação entre hooks e componentes
- Renderização condicional baseada em estados
- Navegação e roteamento

## Benefícios da Refatoração

1. **Manutenibilidade**: Código organizado em módulos específicos
2. **Reutilização**: Componentes podem ser reutilizados em outras páginas
3. **Testabilidade**: Cada componente pode ser testado isoladamente
4. **Legibilidade**: Lógica separada por responsabilidade
5. **Performance**: Hooks otimizados com cache e refresh seletivo

## Padrões Utilizados

- **Custom Hooks**: Para separar lógica de estado e ações
- **Compound Components**: Para componentes relacionados
- **Props Drilling Mínimo**: Estados centralizados em hooks
- **Error Boundaries**: Tratamento de erros isolado
- **Loading States**: Estados de carregamento bem definidos

## Como Usar

```typescript
import {
  PDIEditHeader,
  PDIContentSections,
  PermissionDeniedPage,
  UserNotFoundPage,
  LoadingPage,
  usePDIEditData,
  usePDIEditActions,
} from "./PDIEditPage/index";

// Usar os hooks
const data = usePDIEditData(userId);
const actions = usePDIEditActions(/* parâmetros */);

// Renderizar componentes
<PDIEditHeader subordinate={data.subordinate} onBack={handleBack} />
<PDIContentSections {...props} />
```

## Migração

A refatoração foi feita de forma que mantém a mesma interface pública e funcionalidades. Nenhuma mudança é necessária em outros arquivos que importam `PDIEditPage`.

## Próximos Passos

1. Implementar testes unitários para cada componente
2. Otimizar performance com React.memo onde necessário
3. Adicionar mais tipos TypeScript específicos
4. Considerar implementar React Query para cache de dados
5. Adicionar Storybook para documentação visual dos componentes
