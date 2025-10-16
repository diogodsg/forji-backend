# Cycles Components Organization

Esta pasta contém todos os componentes relacionados à funcionalidade de ciclos de desenvolvimento, organizados por funcionalidade:

## 📁 Estrutura de Pastas

### `/cycle-management`

Componentes para criação e gestão de ciclos:

- `CurrentCycleMain.tsx` - Página principal do ciclo atual
- `CurrentCycleView.tsx` - Visualização do ciclo atual
- `CurrentCycleViewWithTabs.tsx` - Versão com abas da visualização
- `QuickCycleCreator.tsx` - Criador rápido de ciclos
- `MilestoneCreator.tsx` - Criador de marcos/milestones

### `/tracking-recorders`

Componentes para registro e acompanhamento de atividades:

- `OneOnOneRecorder.tsx` - Modal para registrar 1:1s
- `OneOnOneRecorderCompact.tsx` - Versão compacta do recorder
- `MentoringRecorder.tsx` - Modal para registrar mentorias
- `CertificationRecorder.tsx` - Modal para registrar certificações

### `/competency-management`

Componentes para gestão de competências:

- `CompetencyManager.tsx` - Gerenciador de competências

### `/ui-shared`

Componentes de UI compartilhados:

- `QuickActions.tsx` - Botões de ações rápidas

## 🔗 Importações

Todos os componentes podem ser importados através do index principal:

```typescript
import {
  CurrentCycleMain,
  OneOnOneRecorder,
  CompetencyManager,
  QuickActions,
} from "@/features/cycles/components";
```

Ou através dos índices específicos das pastas:

```typescript
import { CurrentCycleMain } from "@/features/cycles/components/cycle-management";
import { OneOnOneRecorder } from "@/features/cycles/components/tracking-recorders";
```

## 🎯 Benefícios da Organização

1. **Separação de Responsabilidades**: Cada pasta tem uma função específica
2. **Facilita Manutenção**: Mais fácil encontrar e modificar componentes
3. **Escalabilidade**: Estrutura preparada para crescimento
4. **Reutilização**: Componentes compartilhados identificados claramente
5. **Navegação**: Estrutura intuitiva para desenvolvimento em equipe
