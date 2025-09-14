# PRs Feature Module

Encapsulates listing, filtering, basic analytics and detail inspection of Pull Requests (PRs) loaded from the backend `/prs` endpoint.

## Goals

- Clear boundary (only expose needed UI + hook + types)
- Support server pagination while keeping client-side secondary filtering
- Provide lightweight aggregate stats (counts, line deltas, average merge time)
- Offer detail drawer with AI summary & review checklist placeholders

## Structure

```
features/prs/
  types/          // Domain types (PullRequest, metrics)
  hooks/          // Data fetching & filtering hook (useRemotePrs)
  components/     // UI (list, stats, filters bar, detail drawer)
  mocks/          // Mock data & weekly metrics generation
  index.ts        // Barrel export
  README.md       // (this file)
```

## Public API (barrel)

Exports:

- Types: `PullRequest`, metric interfaces
- Data: `mockPrs`, `weeklyMetrics` (dev/demo only)
- Hook: `useRemotePrs`
- Components: `PrList`, `PrStats`, `PrFiltersBar`, `PrDetailDrawer`

## Hook: useRemotePrs

Inputs (filters): `{ repo?, state?, ownerUserId?, author?, page?, pageSize? }`
Behavior:

- Builds query string for pagination / owner filter (other filters are client-side)
- Maps backend snake/camel mixed fields to stable frontend shape
- Memo filters locally (repo/state/author)
  Returns: `{ prs, loading, error, all, total }`

## Components Overview

| Component        | Responsibility                                        |
| ---------------- | ----------------------------------------------------- |
| `PrList`         | Tabular list + pagination + integrates `PrFiltersBar` |
| `PrFiltersBar`   | Controlled filters (repo, status, author)             |
| `PrStats`        | Aggregated quick KPIs (count, lines, avg merge time)  |
| `PrDetailDrawer` | Detailed view with AI summary & checklist             |

## Data Mapping Rules

| Backend Field            | Frontend Field               |
| ------------------------ | ---------------------------- |
| `id`                     | `id` (string)                |
| `user`                   | `author` & `user` (login)    |
| `repo`                   | `repo`                       |
| `title`                  | `title`                      |
| `createdAt`/`created_at` | `created_at`                 |
| `mergedAt`/`merged_at`   | `merged_at`                  |
| `state`                  | `state` (open/closed/merged) |
| `totalAdditions`         | `lines_added`                |
| `totalDeletions`         | `lines_deleted`              |
| `totalChanges`           | `files_changed`              |
| `reviewText`             | `ai_review_summary`          |

## Pagination Strategy

- Server supplies: `items`, `total`, `page`, `pageSize`
- Component-level pagination (PrList) respects server totals when `serverPaginated` flag is true
- Client filters (repo/state/author) applied after fetch; could migrate to server later if supported

## Testing Ideas (future)

- Hook: mock `api` to assert query string formation & mapping
- Component: snapshot / interaction (filter changes reset page; row click opens drawer)
- Stats: average merge time calculation given sample data

## Future Enhancements

- Server-side filtering for repo/state/author
- Sorting (lines changed, created date)
- Export CSV / metrics endpoint integration
- Merge time bucketing (p95, median)
- Reintroduce trend charts once backend `/prs/metrics` is available
- PR → PDI linkage (action button currently a placeholder)

## Recent Refactor (2025-09)

- Dead code removed: `ProgressCharts`, `SummaryCards` (will return when `/prs/metrics` backend is ready).
- Extracted shared components (`PaginationFooter`, `StatCard`, `LinesDeltaCard`, `SidePanel`, `Badge`) to `src/shared` to keep this feature lean.
- Moved PR status style helpers into `lib/status.ts` (were previously in shared; now domain-scoped).
- Centralized status badge rendering using the `prStatusBadgeClasses` + `prStatusDotColor` helpers.
- Barrel updated to export `./lib/status` for internal and page-level reuse without leaking other internals.
- Added minimal TSDoc across shared components to clarify usage boundaries.

## Maintenance Checklist

- [ ] Fields mapped still match backend schema
- [ ] Hook errors surfaced in page UI
- [ ] Pagination resets on filter change
- [ ] Barrel exports only intended surface

---

Align new changes with this doc to keep boundaries clean.
