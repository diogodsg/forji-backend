# Pages Architecture Guide

This document describes how route-level pages are organized and how they interact with feature modules in the Forge frontend.

## Goals

- Keep page components thin and declarative.
- Encapsulate domain logic inside feature hooks/components (under `src/features/*`).
- Promote reuse (e.g., `MyPrsPage` reused inside `ManagerDashboardPage`).
- Make translation / copy control explicit (currently PT-BR UI + EN documentation comments).

## Current Pages (`src/pages`)

| Page                   | Route / Usage          | Responsibility                              | Notes                                                                                      |
| ---------------------- | ---------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `LoginPage`            | Shown pre-auth         | Branding + login form                       | Marketing panel hidden on small screens.                                                   |
| `MyPrsPage`            | `/me/prs` and embedded | PR list, filters, pagination, detail drawer | Uses `usePrsFiltersPagination` + `useRemotePrs`. Fallback mocks during early API failures. |
| `MyPdiPage`            | `/me/pdi`              | User PDI view/editor                        | Auto-creates empty plan via `useEnsurePdi`.                                                |
| `ManagerDashboardPage` | `/manager`             | Manager view (reports + PRs + PDI)          | Decomposed into `features/manager` components.                                             |
| `AdminAccessPage`      | `/admin`               | User & access management                    | Aggregates admin feature components only.                                                  |
| `NotFoundPage`         | `*` fallback           | 404 UI                                      | Simple, links back to PRs.                                                                 |

Pages removed: `ManagerPrsPage`, `MyProgressPage` (obsolete / superseded).

## Page vs Feature Component

A page should:

- Own routing-level concerns (auth gating, layout composition, high-level loading/empty states).
- Compose feature-level blocks.
- Avoid deep conditional logic and domain transforms (delegate to hooks/services).

A page should NOT:

- Contain large tables, complex forms, or reusable layout fragments (move those to `features/*/components`).
- Re-implement data fetching already handled by a feature hook.
- Maintain duplicated state separate from hooks (unless bridging multiple domains).

## Common Patterns

1. **Lazy Loading**: Pages are loaded via `React.lazy` in `App.tsx` to keep initial bundle lean.
2. **Error Boundaries**: Global boundary wraps routes; pages themselves should surface domain errors in-context.
3. **Fallback Mocks**: Some hooks (e.g., `useRemotePrs`) accept `{ fallbackMocks: true }` to provide resilience early in development.
4. **Portuguese UI + English Docs**: Intentional dual-language approach for now. A migration path to i18n is outlined below.
5. **Reusability**: `MyPrsPage` is reused within the manager dashboard to avoid parallel PR implementations.

## Adding a New Page

1. Create the file under `src/pages/NewThingPage.tsx`.
2. Implement a small, documented component with TSDoc header:
   - What it displays.
   - Which feature hooks it composes.
   - Any side-effects / gating logic.
3. Add lazy import + route entry in `App.tsx`.
4. Prefer delegating:
   - Data fetching -> `features/<domain>/hooks`.
   - UI blocks -> `features/<domain>/components`.
5. Keep local state minimal (selection, view mode, ephemeral UI).
6. Provide clear empty / loading / error microcopy.
7. If page relies on creating default data (like PDI) wrap that in a dedicated hook (e.g., `useEnsureX`).

## Refactoring an Overgrown Page

Symptoms:

- File > ~250 lines.
- Repeated JSX patterns (tables, cards) that could be reused.
- Multiple unrelated concerns (e.g., filters + creation modal + nested editing logic) inline.

Steps:

1. Identify cohesive blocks (sidebar, header, panel, drawer panels, toolbars).
2. Move each block to `features/<domain>/components/` with a narrow prop surface.
3. Replace inline logic with feature hook calls; only pass derived values to components.
4. Add TSDoc summarizing new boundaries.

## Example Decomposition (Done)

`ManagerDashboardPage` →

- `ReportsSidebar`
- `ManagerHeader`
- `ManagerPdiPanel`
- Reuse of `MyPrsPage`

## Translation / i18n Strategy (Future)

Current approach is static PT-BR. To migrate:

1. Introduce `src/i18n/strings.ts` exporting nested keys.
2. Replace literals gradually with a tiny `t(key)` helper.
3. Add English set; flip language via context/provider.
4. Defer runtime pluralization until needed.

## Testing Guidance

- Pages: favor integration tests (render with mocked feature hooks) verifying routing + composition.
- Feature hooks: unit test data mapping, error fallback, pagination resets.
- Snapshots reserved for stable layout fragments only.

## Performance Considerations

- Avoid fetching when data can be derived (e.g., `skip: !id`).
- Memoize heavy derived collections (`useMemo` around filtering as in `AdminAccessPage`).
- Defer rarely used panels via conditional mounting (tabs pattern).

## Accessibility Checklist

- Headings (`h1`) present once per page.
- Interactive elements: semantic `<button>`/`<a>` elements not divs.
- Focus order: modals and drawers should trap focus (handled in feature components, not pages).
- Provide descriptive alt text for brand imagery (e.g., logo alt="Forge").

## Page Lifecycle Cheat Sheet

| Concern            | Pattern                                                      |
| ------------------ | ------------------------------------------------------------ |
| Data fetch + cache | Feature hook (`useRemoteX`)                                  |
| Derived filtering  | `useMemo` in page or moved into hook if reused               |
| Auth gating        | Early return (e.g., `if (!user) ...`) or wrapper route guard |
| Layout chrome      | Higher-level layout (not inside page unless unique)          |
| Error presentation | Inline lightweight alert block                               |
| Deep editing flows | Dedicated feature component                                  |

## Pending / Opportunities

- Introduce stronger shared types for manager report user objects (remove `any` casts).
- Consolidate empty/loading copy into a UI feedback helper.
- Add URL param sync for manager selection + tab state.
- Build first integration tests (cypress or testing-library) for critical flows: login, admin create user, view PRs, create PDI.

---

Maintainers: update this guide when adding new structural patterns or deprecating pages.
