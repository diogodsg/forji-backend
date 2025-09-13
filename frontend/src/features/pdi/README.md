# PDI Feature Module

Personal Development & Impact (PDI) feature encapsulates all logic, UI, and data access for creating, editing, viewing and persisting a user's development plan (competencies, milestones, key results, results / progress records).

## Goals

- Strong feature boundary (no outside imports into its internals except shared libs like `apiClient`)
- Reducer-driven local editing state with diff tracking (`pendingSave`)
- Debounced autosave with graceful merge of fresh server data
- Clear separation of view vs. editing concerns
- Testable pure logic (reducer) + thin integration hooks

## Folder Structure

```
features/pdi/
  components/        // UI building blocks & composed views
  hooks/             // Data + state management hooks
  lib/               // Pure utilities (merge, factories, helpers)
  mocks/             // Feature-scoped mock data
  tests/             // Unit tests (logic-level preferred)
  types/             // Domain model (PDI plan + nested entities)
  index.ts           // Public barrel export
  README.md          // (this file)
```

## Domain Model (simplified)

Key entities (see `types/pdi.ts` for full definitions):

- `PdiPlan`: root aggregate (competencies, milestones, key results, resultsTable)
- `Competency`: skill area with improvement actions
- `Milestone`: dated goal with tasks
- `KeyResult`: measurable metric with target & current values
- `ResultRecord`: time-stamped performance/progress entry

Design choices:

- Flat numeric IDs (client may create negative/temporary before server persistence)
- Optional fields tolerated while drafting (backend may enrich later)
- Merge strategy prefers server authoritative fields while preserving unsaved local edits

## Core Hooks

| Hook                  | Responsibility                                                  | Key Returns                                                 |
| --------------------- | --------------------------------------------------------------- | ----------------------------------------------------------- |
| `usePdiEditing`       | Owns reducer state & actions for local working copy             | `{ state, dispatch }`                                       |
| `useRemotePdi`        | Load + upsert current user's plan                               | `{ plan, refresh, saveFull, patchPartial, loading, error }` |
| `useRemotePdiForUser` | Manager context variant (target user)                           | Same shape as `useRemotePdi`                                |
| `useAutoSave`         | Debounced persistence of dirty working copy                     | `{ status, lastSavedAt }`                                   |
| `useLocalPdi`         | (Optional) local storage persistence (currently disabled in UI) | `{ loadLocal, saveLocal, clear }`                           |

## Editing Lifecycle

1. Initial fetch (`useRemotePdi`) populates canonical server plan
2. Working copy created via reducer in `usePdiEditing`
3. User interactions dispatch reducer actions -> sets `pendingSave`
4. `useAutoSave` observes dirty state, debounces (e.g. 800ms idle)
5. Autosave merges current server snapshot + local changes → `saveFull`
6. On success: update timestamps, clear `pendingSave`; on conflict: best-effort merge

Failure handling: transient errors keep `pendingSave` true; autosave retries on next state change or manual action.

## Components Overview (selected)

| Component             | Role                                                           |
| --------------------- | -------------------------------------------------------------- |
| `EditablePdiView`     | Orchestrates full editing experience (sections + autosave bar) |
| `MilestonesSection`   | Lists & edits milestones & tasks                               |
| `CompetenciesSection` | Competency + improvement actions editing                       |
| `KeyResultsSection`   | Metric-oriented goals editing                                  |
| `ResultsSection`      | Tabular view of progress/impact records                        |
| `SaveStatusBar`       | Visual feedback: saving, saved, error states                   |

Supporting editors (`CompetenciesEditor`, `KeyResultsEditor`, etc.) isolate mutation logic from section layout.

## Typical Usage

```tsx
import { EditablePdiView } from "@/features/pdi";

export function MyPdiPage() {
  return <EditablePdiView />;
}
```

Manager context (target user): page-level component supplies `userId` (implementation may unwrap and use `useRemotePdiForUser`).

## Public API Surface (via `index.ts`)

Exports are intentionally curated:

- Components: `EditablePdiView`
- Hooks (optionally re-exported if needed externally): `usePdiEditing`, `useRemotePdi`, `useRemotePdiForUser`
- Types: root PDI types (plan + nested) for cross-feature coordination
- Utilities: (avoid exporting unless a cross-feature consumer emerges)

If something else becomes needed externally, prefer adding a façade function instead of exposing deep internals.

## Merge Strategy (High Level)

`mergeServerPlan(localDraft, freshServer)`:

- Preserve entities only existing locally (client-created)
- For shared entities, server authoritative on IDs & canonical timestamps
- Local wins for in-progress text fields if `pendingSave` was set
- Drops orphaned entities removed server-side if they were untouched locally

## Testing Guidelines

- Put pure logic tests under `tests/` (e.g. reducer scenarios)
- Mock network in hook tests (Vitest + msw if added later)
- Keep component tests shallow / interaction-focused (only for critical flows)

## Extension Points

Potential next iterations:

- Offline queue: buffer saves when offline & replay
- Conflict resolution UI: per-field diff surfacing
- Granular patching: compute minimal patch sets instead of full upsert
- Metrics normalization helper (aggregate KR progress, velocity charts)
- Accessibility audit of editor controls

## Performance Notes

- Reducer state kept minimal; derived counts computed inline (no premature memoization)
- Debounce delay balanced between perceived immediacy and request volume
- Consider batching sequential rapid edits into a single payload (future)

## Decision Log (abridged)

| Date       | Decision                                   | Rationale                                                |
| ---------- | ------------------------------------------ | -------------------------------------------------------- |
| 2025-09-13 | Feature-first migration                    | Reduce cross-folder coupling & clarify domain boundaries |
| 2025-09-13 | Debounced autosave over manual save button | Lower user friction & prevent lost edits                 |
| 2025-09-13 | Barrel-limited exports                     | Maintain encapsulation & ease refactors                  |

## Conventions

- Internal imports use relative paths inside the feature to avoid accidental public leakage
- External consumers must use the barrel (`@/features/pdi`) only
- Avoid default exports for shared entities; maintain named exports for clarity

## Adding a New Section

1. Define/extend types in `types/pdi.ts`
2. Add reducer cases (if stateful) in `usePdiEditing`
3. Create UI component under `components/`
4. Wire into `EditablePdiView`
5. Update tests & mocks

## Maintenance Checklist

- [ ] No external import reaches into non-exported internals
- [ ] Build & typecheck clean after changes
- [ ] Autosave status transitions correct (idle → saving → saved/error)
- [ ] Reducer tests updated for new actions

---

Questions or evolutions: start with an issue referencing this README so architectural intent stays coherent.
