# Shared Components

Thin layer of generic, domain-agnostic UI primitives extracted from feature modules when reuse is clear.

## Scope Rules

- Only presentational or layout components (no business logic, no data fetching)
- Never import from `features/*` (one-way dependency: features -> shared)
- Avoid domain vocabulary ("PR", "PDI"); use neutral prop names
- Keep APIs minimal; accept `className` for extension instead of new props

## Current Components

| Component          | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `PaginationFooter` | Page navigation + size selector             |
| `StatCard`         | Simple metric label + value                 |
| `LinesDeltaCard`   | Additions vs deletions compact diff summary |
| `SidePanel`        | Sliding overlay container                   |
| `Badge`            | Generic status/label pill                   |

Helper:

- `semanticStatusBadge` maps arbitrary status strings to `Badge` props without encoding feature logic.

## Non-Goals

- Theming system (keep Tailwind utilities inline)
- Complex state machines
- Data adapters or HTTP concerns

## Extraction Guidelines

1. Prove duplication (≥2 features) or clear upcoming reuse.
2. Strip feature-specific naming/assumptions during extraction.
3. Add minimal TSDoc (what it does, not how Tailwind works).
4. Update root README if extraction is significant.

## Future Candidates

- Generic `DataTable` (once at least two features need advanced tables)
- `Modal` primitive (when we have more than one modal style)
- `Tabs` (if repeated in different domains)

Reassess contents periodically; move anything that drifts into domain logic back to its feature.
