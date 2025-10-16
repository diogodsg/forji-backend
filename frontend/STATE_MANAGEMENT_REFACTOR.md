# Gerenciamento de Estado - CurrentCyclePageOptimized

## 📋 **Problema: State Management Complexo**

A página `CurrentCyclePageOptimized` gerencia **7 modals diferentes**, cada um com seu próprio estado de abertura/fechamento e IDs selecionados. Isso resulta em **gerenciamento de estado complexo**.

---

## ❌ **Abordagem ANTERIOR (Primitiva)**

### Código:

```tsx
// 10 useState hooks separados! 😱
const [isOneOnOneOpen, setIsOneOnOneOpen] = useState(false);
const [isMentoringOpen, setIsMentoringOpen] = useState(false);
const [isCompetenceOpen, setIsCompetenceOpen] = useState(false);
const [isGoalCreatorOpen, setIsGoalCreatorOpen] = useState(false);
const [isGoalUpdateOpen, setIsGoalUpdateOpen] = useState(false);
const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
const [isCompetenceUpdateOpen, setIsCompetenceUpdateOpen] = useState(false);
const [selectedCompetenceId, setSelectedCompetenceId] = useState<string | null>(
  null
);
const [isActivityDetailsOpen, setIsActivityDetailsOpen] = useState(false);
const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
  null
);

// Handlers verbosos
const handleUpdateGoal = (goalId: string) => {
  setSelectedGoalId(goalId);
  setIsGoalUpdateOpen(true);
};

// Cleanup manual em cada modal
<GoalUpdateRecorder
  isOpen={isGoalUpdateOpen}
  onClose={() => {
    setIsGoalUpdateOpen(false);
    setSelectedGoalId(null); // ⚠️ Fácil esquecer!
  }}
/>;
```

### ⚠️ **Problemas:**

1. **Verbosidade Extrema**

   - 10 linhas só para declarar estados
   - Poluição visual no componente

2. **Escalabilidade Ruim**

   - Novo modal = 2+ novos estados
   - Padrão se repete infinitamente

3. **Sem Garantias**

   - Múltiplos modals podem abrir simultaneamente
   - Estado inconsistente possível

4. **Cleanup Manual**

   - Cada modal precisa limpar seu próprio estado
   - Fácil esquecer de resetar `selectedId`

5. **Hard to Debug**

   - Estado espalhado em 10 variáveis
   - DevTools mostra 10+ entradas separadas

6. **Repetição de Lógica**
   - Padrão `isXOpen + selectedXId` se repete
   - Mesma lógica duplicada 7x

---

## ✅ **Abordagem NOVA (Centralizada com useReducer)**

### 1. **Custom Hook: `useModalManager`**

```tsx
// hooks/useModalManager.ts

export type ModalType =
  | "oneOnOne"
  | "mentoring"
  | "competence"
  | "goalCreator"
  | "goalUpdate"
  | "competenceUpdate"
  | "activityDetails"
  | null;

export interface ModalState {
  type: ModalType;
  selectedId: string | null;
}

// Reducer centralizado
function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        type: action.payload.modalType,
        selectedId: action.payload.id || null,
      };
    case "CLOSE_MODAL":
      return { type: null, selectedId: null }; // ✅ Limpa tudo automaticamente!
    default:
      return state;
  }
}

export function useModalManager() {
  const [modalState, dispatch] = useReducer(modalReducer, initialState);

  const openModal = useCallback((modalType: ModalType, id?: string) => {
    dispatch({ type: "OPEN_MODAL", payload: { modalType, id } });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: "CLOSE_MODAL" });
  }, []);

  const isOpen = useCallback(
    (modalType: ModalType) => modalState.type === modalType,
    [modalState.type]
  );

  return { modalState, openModal, closeModal, isOpen };
}
```

### 2. **Helpers Semânticos**

```tsx
export function createModalHelpers(openModal, closeModal) {
  return {
    // Quick Actions
    handleOneOnOne: () => openModal("oneOnOne"),
    handleMentoring: () => openModal("mentoring"),
    handleCompetence: () => openModal("competence"),
    handleGoalCreator: () => openModal("goalCreator"),

    // Com ID
    handleGoalUpdate: (goalId: string) => openModal("goalUpdate", goalId),
    handleCompetenceUpdate: (compId: string) =>
      openModal("competenceUpdate", compId),
    handleActivityDetails: (actId: string) =>
      openModal("activityDetails", actId),

    // Close universal
    handleClose: closeModal,
  };
}
```

### 3. **Uso no Componente**

```tsx
export function CurrentCyclePageOptimized() {
  // ✅ 1 linha para setup completo!
  const { modalState, openModal, closeModal, isOpen } = useModalManager();

  // ✅ Handlers semânticos prontos
  const {
    handleOneOnOne,
    handleMentoring,
    handleCompetence,
    handleGoalCreator,
    handleGoalUpdate,
    handleCompetenceUpdate,
    handleActivityDetails,
    handleClose,
  } = createModalHelpers(openModal, closeModal);

  // ✅ Handlers limpos
  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case "oneOnOne":
        handleOneOnOne();
        break;
      case "mentoring":
        handleMentoring();
        break;
      case "certification":
        handleCompetence();
        break;
      case "newGoal":
        handleGoalCreator();
        break;
    }
  };

  // ✅ Modals simples
  return (
    <>
      <OneOnOneRecorder
        isOpen={isOpen("oneOnOne")}
        onClose={handleClose}
        onSave={(data) => {
          console.log("Saved:", data);
          handleClose(); // ✅ Cleanup automático!
        }}
      />

      {/* Modal com ID */}
      {modalState.type === "goalUpdate" &&
        modalState.selectedId &&
        (() => {
          const goal = goalsData.find((g) => g.id === modalState.selectedId);
          if (!goal) return null;

          return (
            <GoalUpdateRecorder
              isOpen={true}
              onClose={handleClose}
              goal={goal}
            />
          );
        })()}
    </>
  );
}
```

---

## 🎯 **Vantagens da Nova Abordagem**

### 1. **Código Muito Mais Limpo**

- **Antes:** 10 linhas de useState
- **Depois:** 1 linha de useModalManager
- **Redução:** 90% menos código

### 2. **Garantia de Exclusividade**

```tsx
// ✅ Apenas 1 modal aberto por vez (garantido pelo reducer)
modalState = { type: "oneOnOne", selectedId: null };
modalState = { type: "goalUpdate", selectedId: "goal-123" };
modalState = { type: null, selectedId: null }; // Fechado
```

### 3. **Cleanup Automático**

```tsx
// ❌ Antes: Cleanup manual em cada modal
onClose={() => {
  setIsGoalUpdateOpen(false);
  setSelectedGoalId(null); // Fácil esquecer!
}}

// ✅ Depois: Uma função para todos
onClose={handleClose} // Limpa tudo automaticamente
```

### 4. **Fácil de Escalar**

```tsx
// Adicionar novo modal = 2 mudanças:

// 1. Adicionar tipo no hook
export type ModalType =
  | 'oneOnOne'
  | 'newModal' // ✅ Aqui

// 2. Adicionar helper
export function createModalHelpers(...) {
  return {
    // ...
    handleNewModal: () => openModal('newModal'), // ✅ Aqui
  };
}
```

### 5. **Debug Simplificado**

```tsx
// DevTools mostra:
modalState: {
  type: 'goalUpdate',
  selectedId: 'goal-123'
}

// ✅ 1 objeto vs 10 variáveis separadas!
```

### 6. **Type-Safe**

```tsx
// ✅ TypeScript previne erros
isOpen("wrongModal"); // ❌ Erro de compilação!
isOpen("oneOnOne"); // ✅ OK

openModal("wrongModal"); // ❌ Erro de compilação!
openModal("goalUpdate", "goal-123"); // ✅ OK
```

### 7. **Testável**

```tsx
// Fácil de testar em isolamento
describe("useModalManager", () => {
  it("should open modal", () => {
    const { result } = renderHook(() => useModalManager());

    act(() => {
      result.current.openModal("oneOnOne");
    });

    expect(result.current.modalState.type).toBe("oneOnOne");
    expect(result.current.isOpen("oneOnOne")).toBe(true);
  });

  it("should close modal and reset id", () => {
    const { result } = renderHook(() => useModalManager());

    act(() => {
      result.current.openModal("goalUpdate", "goal-123");
    });

    expect(result.current.modalState.selectedId).toBe("goal-123");

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.modalState.type).toBeNull();
    expect(result.current.modalState.selectedId).toBeNull();
  });
});
```

---

## 📊 **Comparação Quantitativa**

| Métrica                       | Antes        | Depois   | Melhoria |
| ----------------------------- | ------------ | -------- | -------- |
| **useState hooks**            | 10           | 0        | -100%    |
| **Linhas de estado**          | 10           | 1        | -90%     |
| **Handlers verbosos**         | 7            | 0        | -100%    |
| **Cleanup manual**            | 7 modals     | 0        | -100%    |
| **Type safety**               | ❌ Nenhuma   | ✅ Total | +∞       |
| **Debug difficulty**          | 10 variáveis | 1 objeto | -90%     |
| **Garantia de exclusividade** | ❌ Não       | ✅ Sim   | +100%    |

---

## 🏗️ **Arquitetura do Sistema**

```
┌─────────────────────────────────────────────────────────┐
│ CurrentCyclePageOptimized.tsx                           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ useModalManager()                               │   │
│  │                                                 │   │
│  │  modalState: { type, selectedId }              │   │
│  │  openModal(type, id?)                          │   │
│  │  closeModal()                                  │   │
│  │  isOpen(type)                                  │   │
│  └────────────┬────────────────────────────────────┘   │
│               │                                         │
│  ┌────────────▼────────────────────────────────────┐   │
│  │ createModalHelpers()                           │   │
│  │                                                │   │
│  │  handleOneOnOne()                             │   │
│  │  handleMentoring()                            │   │
│  │  handleGoalUpdate(id)                         │   │
│  │  handleCompetenceUpdate(id)                   │   │
│  │  handleActivityDetails(id)                    │   │
│  │  handleClose()                                │   │
│  └────────────┬────────────────────────────────────┘   │
│               │                                         │
│  ┌────────────▼────────────────────────────────────┐   │
│  │ Render (7 Modals)                              │   │
│  │                                                │   │
│  │  OneOnOne: isOpen('oneOnOne')                 │   │
│  │  Mentoring: isOpen('mentoring')               │   │
│  │  Competence: isOpen('competence')             │   │
│  │  GoalCreator: isOpen('goalCreator')           │   │
│  │  GoalUpdate: modalState.type === 'goalUpdate' │   │
│  │  CompetenceUpdate: ...                        │   │
│  │  ActivityDetails: ...                         │   │
│  │                                                │   │
│  │  All: onClose={handleClose}                   │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 **Próximas Evoluções Possíveis**

### 1. **Context API para Modals Globais**

```tsx
// contexts/ModalContext.tsx
export const ModalProvider = ({ children }) => {
  const modalManager = useModalManager();

  return (
    <ModalContext.Provider value={modalManager}>
      {children}
    </ModalContext.Provider>
  );
};

// Uso em qualquer componente profundo
const { openModal } = useModalContext();
openModal("goalUpdate", "goal-123");
```

### 2. **History Stack (Múltiplos Modals)**

```tsx
// Para casos onde modals podem empilhar
interface ModalState {
  stack: Array<{ type: ModalType; selectedId: string | null }>;
}

// Permite: Modal A → Modal B → Voltar para A
```

### 3. **Persistent State (URL Sync)**

```tsx
// Sincronizar com URL
// /cycle?modal=goalUpdate&id=goal-123

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const modalType = params.get("modal");
  const id = params.get("id");

  if (modalType) openModal(modalType, id);
}, [location]);
```

### 4. **Analytics Integration**

```tsx
const openModal = useCallback((modalType: ModalType, id?: string) => {
  // Track modal opening
  analytics.track("Modal Opened", { modalType, id });

  dispatch({ type: "OPEN_MODAL", payload: { modalType, id } });
}, []);
```

---

## 💡 **Conclusão**

### **Antes:**

- ❌ 10 useState hooks
- ❌ Estado espalhado e difícil de debugar
- ❌ Cleanup manual propenso a erros
- ❌ Sem garantias de consistência
- ❌ Hard to scale

### **Depois:**

- ✅ 1 useReducer centralizado
- ✅ Estado unificado e previsível
- ✅ Cleanup automático garantido
- ✅ Type-safe e testável
- ✅ Fácil de escalar

### **Resultado:**

**90% menos código**, **100% mais robusto**, **infinitamente mais escalável**! 🎉

---

**Padrão aplicável em:** Qualquer componente com múltiplos modals/dialogs/overlays.

**Inspiração:** Redux patterns + Modern React hooks + Type safety first.

**Próximo nível:** Context API + URL sync + Analytics.
